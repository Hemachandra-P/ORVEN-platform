from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "NeuroStack"
    app_version: str = "1.0.0"

    database_url: str

    # JWT Settings
    jwt_secret_key: str
    access_token_expire_minutes: int = 30

    # AI Settings
    # AI Settings
    openai_api_key: str = ""
    groq_api_key: str = ""
    ollama_base_url: str = "http://localhost:11434"
    lmstudio_base_url: str = "http://localhost:1234"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False
    )


settings = Settings()