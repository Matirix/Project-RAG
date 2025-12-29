from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    access_key: str
    access_key_pass: str
    region: str
    knowledge_base_id: str
    knowledge_base_data_source: str
    bucket_name: str

    class Config:
        env_file = Path(__file__).parents[2] / ".env"
