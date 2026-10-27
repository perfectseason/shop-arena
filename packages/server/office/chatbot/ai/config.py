import os
from pathlib import Path

from dotenv import load_dotenv

# The project keeps its local environment file in store/.env. Load it using an
# absolute path so startup does not depend on the process working directory.
OFFICE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(OFFICE_DIR / ".env")
load_dotenv(OFFICE_DIR / "store" / ".env")

OPENAI_API_KEY = (
    os.getenv("OPENAI_API_KEY")
    or os.getenv("API_SECRET_KEY")
    or os.getenv("API_SECRETE_KEY")
    or ""
)

LLM_MODEL = os.getenv(
    "LLM_MODEL",
    "gpt-5.6-luna",
)

LLM_MAX_OUTPUT_TOKENS = int(
    os.getenv(
        "LLM_MAX_OUTPUT_TOKENS",
        "300",
    )
)

MAX_HISTORY_MESSAGES = int(
    os.getenv(
        "MAX_HISTORY_MESSAGES",
        "12",
    )
)
