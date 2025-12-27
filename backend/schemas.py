# schemas/text_input.py
from typing import Optional

from pydantic import BaseModel


class TextInput(BaseModel):
    text: str
    session_id: Optional[str] = None
