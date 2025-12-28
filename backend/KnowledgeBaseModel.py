# models/knowledge_base_model.py
import asyncio
import json
import os
import time
from typing import Any, Dict, List

import boto3
from fastapi.responses import StreamingResponse


class KnowledgeBaseModel:
    def __init__(
        self,
        knowledge_base_id: str,
        region: str = "us-west-2",
        model_arn: str = "us.amazon.nova-micro-v1:0",
    ):
        self.knowledge_base_id = knowledge_base_id
        self.model_arn = model_arn
        self.session_id = None
        self.bedrock_agent_runtime = boto3.client(
            "bedrock-agent-runtime",
            region_name=region,
        )
        self.text_prompt_template = "Explain it simply, provide a a few examples based on $search_results$ and then sum it up again in simple terms"

    def retrieve_and_generate(
        self,
        text: str,
        max_tokens: int = 1000,
        temperature: float = 0.4,
        top_p: float = 0.9,
    ) -> Dict[str, Any]:
        """
        Perform a retrieve-and-generate call against the knowledge base
        :param text: The prompt to generate
        :param session_id: The session ID to use for the request      (for sessions)
        :param max_tokens: The maximum number of tokens to generate   (cost management)
        :param temperature: The temperature to use for the generation (factual <-> creative)
        :param top_p: The top-p value to use for the generation       (largeness of the set, factual <-> creative)
        """

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
                                "maxTokens": max_tokens,
                                "temperature": temperature,
                                "topP": top_p,
                            }
                        },
                        "promptTemplate": {
                            "textPromptTemplate": self.text_prompt_template
                        },
                    },
                },
            },
        }
        if self.session_id:
            request["sessionId"] = self.session_id
        response = self.bedrock_agent_runtime.retrieve_and_generate(**request)
        self.session_id = response.get("sessionId")

        return self._format_response(response)

    def retrieve_and_generate_stream_sse(self, text: str):
        """
        Used to emulate chat gpt-like printing behavour
        :param text: The prompt to generate
        :param session_id: The session ID to use for the request      (for sessions)
        :param max_tokens: The maximum number of tokens to generate   (cost management)
        :param temperature: The temperature to use for the generation (factual <-> creative)
        :param top_p: The top-p value to use for the generation       (largeness of the set, factual <-> creative)
        """
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
                                "maxTokens": 1000,
                                "temperature": 0.4,
                                "topP": 0.9,
                            }
                        },
                        "promptTemplate": {
                            "textPromptTemplate": self.text_prompt_template
                        },
                    },
                },
            },
        }
        if self.session_id:
            request["sessionId"] = self.session_id
        response = self.bedrock_agent_runtime.retrieve_and_generate_stream(**request)

        # Extract session ID
        self.session_id = response.get("sessionId")
        # Extract the actual stream generator
        stream_iterator = response["stream"]

        for chunk in stream_iterator:
            # chunk is a dict, not a string
            text_chunk = chunk.get("output", {}).get("text")
            if text_chunk:
                yield f"data: {json.dumps({'text': text_chunk, 'session_id': self.session_id})}\n\n"

        # Optionally store session_id for reuse

    def _format_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize Bedrock response into frontend-friendly structure
        """

        output_text = response["output"]["text"]

        citations: List[List[Dict[str, Any]]] = []

        for citation in response.get("citations", []):
            refs = []
            for ref in citation.get("retrievedReferences", []):
                refs.append(
                    {
                        "text": ref["content"]["text"],
                        "location": ref.get("location"),
                        "score": ref.get("score"),
                    }
                )
            citations.append(refs)

        return {
            "text": output_text,
            "citations": citations,
            "session_id": self.session_id,
        }
