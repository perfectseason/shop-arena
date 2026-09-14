from pathlib import Path


KNOWLEDGE_DIR = (
    Path(__file__).resolve().parent.parent / "knowledge"
)


def load_knowledge() -> str:
    """
    Read all Markdown files from the knowledge directory.
    """

    if not KNOWLEDGE_DIR.exists():
        return ""

    documents = []

    for file_path in sorted(
        KNOWLEDGE_DIR.glob("*.md")
    ):
        try:
            content = file_path.read_text(
                encoding="utf-8"
            ).strip()

            if not content:
                continue

            documents.append(
                f"""
===== {file_path.name} =====

{content}
"""
            )

        except OSError:
            continue

    return "\n".join(documents)


def get_relevant_knowledge(
    prompt: str,
) -> str:
    """
    Simple first-stage knowledge retrieval.

    This version loads the business Markdown documents
    and selects documents containing words related to
    the customer's question.

    It is intentionally simple and reliable for the
    first working version.
    """

    if not prompt.strip():
        return ""

    documents = []

    for file_path in sorted(
        KNOWLEDGE_DIR.glob("*.md")
    ):
        try:
            content = file_path.read_text(
                encoding="utf-8"
            ).strip()

            if not content:
                continue

            documents.append(
                {
                    "name": file_path.name,
                    "content": content,
                }
            )

        except OSError:
            continue

    if not documents:
        return ""

    prompt_words = {
        word.lower().strip(".,?!:;()[]{}")
        for word in prompt.split()
        if len(word) >= 3
    }

    scored_documents = []

    for document in documents:
        document_words = set(
            document["content"]
            .lower()
            .split()
        )

        score = sum(
            1
            for word in prompt_words
            if word in document_words
        )

        scored_documents.append(
            (
                score,
                document["name"],
                document["content"],
            )
        )

    scored_documents.sort(
        key=lambda item: item[0],
        reverse=True,
    )

    selected = scored_documents[:3]

    return "\n".join(
        f"""
===== {name} =====

{content}
"""
        for score, name, content in selected
        if score > 0
    ).strip()
