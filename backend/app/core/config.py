from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "AI Blog Advisor"
    version: str = "1.0.0"


settings = Settings()
