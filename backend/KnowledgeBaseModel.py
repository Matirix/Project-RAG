# models/knowledge_base_model.py
import os
from typing import Any, Dict, List, Optional

import boto3


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

    def retrieve_and_generate(
        self,
        text: str,
        session_id: Optional[str] = None,
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
                        }
                    },
                },
            },
        }

        if session_id:
            request["sessionId"] = session_id

        response = self.bedrock_agent_runtime.retrieve_and_generate(**request)

        return self._format_response(response)

    def _format_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize Bedrock response into frontend-friendly structure
        """

        output_text = response["output"]["text"]
        session_id = response.get("sessionId")

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
            "session_id": session_id,
        }
