# models/knowledge_base_model.py
import json
from typing import Any, Dict, Generator, List

import boto3
from models.user_preferences import UserPreferences


class KnowledgeBaseModel:
    def __init__(
        self,
        knowledge_base_id: str,
        region: str = "us-west-2",
        data_source: str = "",
        model_arn: str = "us.amazon.nova-micro-v1:0",
    ):
        self.knowledge_base_id = knowledge_base_id
        self.model_arn = model_arn
        self.session_id = None
        self.data_source = data_source
        self.bedrock_agent_runtime = boto3.client(
            "bedrock-agent-runtime",
            region_name=region,
        )
        self.bedrock_client = boto3.client("bedrock-agent", region_name=region)

    def sync_data_source(self):
        """
        Begins Ingestion and Embedding
        """
        self.bedrock_client.start_ingestion_job(
            knowledgeBaseId=self.knowledge_base_id,
            dataSourceId=self.data_source,
        )

    def retrieve_and_generate(
        self,
        text: str,
        user_pref: UserPreferences,
    ) -> Dict[str, Any]:
        """
        Perform a retrieve-and-generate call against the knowledge base (non-streaming)
        """
        print(user_pref)
        request: Dict[str, Any] = {
            "input": {"text": text},
            "retrieveAndGenerateConfiguration": {
                "type": "KNOWLEDGE_BASE",
                "knowledgeBaseConfiguration": {
                    "knowledgeBaseId": self.knowledge_base_id,
                    "modelArn": self.model_arn,
                    "generationConfiguration": {
                        "inferenceConfig": {
                            "textInferenceConfig": {
                                "maxTokens": user_pref.max_tokens,
                                "temperature": user_pref.temperature,
                                "topP": user_pref.top_p,
                            }
                        },
                        "promptTemplate": {
                            "textPromptTemplate": user_pref.prompt_template
                        },
                    },
                },
            },
        }

        if user_pref.session_id:
            request["sessionId"] = user_pref.session_id

        response = self.bedrock_agent_runtime.retrieve_and_generate(**request)
        return self._format_response(response)

    def retrieve_and_generate_stream(
        self,
        text: str,
        user_pref: UserPreferences,
    ) -> Generator[str, None, None]:
        """
        Streaming version of retrieve_and_generate with SSE format
        """
        print(user_pref)
        request: Dict[str, Any] = {
            "input": {"text": text},
            "retrieveAndGenerateConfiguration": {
                "type": "KNOWLEDGE_BASE",
                "knowledgeBaseConfiguration": {
                    "knowledgeBaseId": self.knowledge_base_id,
                    "modelArn": self.model_arn,
                    "generationConfiguration": {
                        "inferenceConfig": {
                            "textInferenceConfig": {
                                "maxTokens": user_pref.max_tokens,
                                "temperature": user_pref.temperature,
                                "topP": user_pref.top_p,
                            }
                        },
                        "promptTemplate": {
                            "textPromptTemplate": user_pref.prompt_template
                        },
                    },
                },
            },
        }

        if user_pref.session_id:
            request["sessionId"] = user_pref.session_id

        response = self.bedrock_agent_runtime.retrieve_and_generate_stream(**request)

        # Extract session ID
        session_id = response.get("sessionId")

        # Send session ID first
        yield f"data: {json.dumps({'session_id': session_id, 'type': 'session'})}\n\n"

        # Stream the text chunks
        stream_iterator = response["stream"]
        full_text = ""
        citations_data = None

        for chunk in stream_iterator:
            # Handle text chunks
            if "chunk" in chunk:
                text_chunk = chunk["chunk"].get("bytes")
                if text_chunk:
                    decoded_chunk = text_chunk.decode("utf-8")
                    full_text += decoded_chunk
                    yield f"data: {json.dumps({'text': decoded_chunk, 'type': 'chunk'})}\n\n"

            # Handle citations (typically comes at the end)
            elif "retrievedReferences" in chunk:
                citations_data = chunk.get("retrievedReferences", [])

        # Send citations at the end if available
        if citations_data:
            formatted_citations = self._format_citations(citations_data)
            yield f"data: {json.dumps({'citations': formatted_citations, 'type': 'citations'})}\n\n"

        # Send completion signal
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    def _format_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Format non-streaming response"""
        output_text = response["output"]["text"]
        session_id = response.get("sessionId")
        citations: List[Dict[str, Any]] = []

        for citation in response.get("citations", []):
            generated_part = citation.get("generatedResponsePart", {})
            text_part = generated_part.get("textResponsePart", {})
            span = text_part.get("span")
            refs = citation.get("retrievedReferences", [])

            if refs and span:
                for ref in refs:
                    citations.append(
                        {
                            "text": ref["content"]["text"],
                            "location": ref.get("location", {}),
                            "score": ref.get("score"),
                            "span": span,
                        }
                    )

        print(f"Final citations count: {len(citations)}")

        return {
            "text": output_text,
            "citations": citations,
            "session_id": session_id,
        }

    def _format_citations(
        self, citations_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Format citations for streaming response"""
        citations = []
        for ref in citations_data:
            citations.append(
                {
                    "text": ref.get("content", {}).get("text", ""),
                    "location": ref.get("location", {}),
                    "score": ref.get("score"),
                }
            )
        return citations
