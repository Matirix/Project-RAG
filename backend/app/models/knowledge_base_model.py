# models/knowledge_base_model.py
from typing import Any, Dict, List, Optional

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
        Perform a retrieve-and-generate call against the knowledge base
        :param text: The prompt to generate
        :param session_id: The session ID to use for the request      (for sessions)
        :param max_tokens: The maximum number of tokens to generate   (cost management)
        :param temperature: The temperature to use for the generation (factual <-> creative)
        :param top_p: The top-p value to use for the generation       (largeness of the set, factual <-> creative)
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
