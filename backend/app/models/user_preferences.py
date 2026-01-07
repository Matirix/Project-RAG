# schemas/user_preferences.py
from typing import Optional

from pydantic import BaseModel


class UserPreferences(BaseModel):
    session_id: Optional[str] = None
    max_tokens: int = 1000
    temperature: float = 0.4
    top_p: float = 0.9
    prompt_template: str = "This is the data: $search_results$ Explain as if you're a teacher, provide different examples with answers and focus on what might be tested when explaining. Also reference at least a points from the provided documents"
