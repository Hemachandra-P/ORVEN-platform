import os
import json
import pandas as pd

from sqlalchemy.orm import Session

from app.models.dataset import Dataset
from app.models.dataset_prompt import DatasetPrompt


SUPPORTED_EXTENSIONS = {
    ".csv",
    ".xlsx",
    ".xls",
    ".json",
    ".txt",
}


def upload_dataset_file(
    db: Session,
    dataset_id: int,
    file,
):
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == dataset_id)
        .first()
    )

    if not dataset:
        return None

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {extension}")

    # -------------------------
    # CSV
    # -------------------------

    if extension == ".csv":
        df = pd.read_csv(file.file)

    # -------------------------
    # Excel
    # -------------------------

    elif extension in [".xlsx", ".xls"]:
        df = pd.read_excel(file.file)

    # -------------------------
    # JSON
    # -------------------------

    elif extension == ".json":
        df = pd.read_json(file.file)

    # -------------------------
    # TXT
    # -------------------------

    elif extension == ".txt":

        text = file.file.read().decode("utf-8")

        prompt = DatasetPrompt(
            dataset_id=dataset_id,
            prompt=text,
            language="English",
        )

        db.add(prompt)

        dataset.total_prompts += 1

        db.commit()

        return {
            "message": "Text file imported successfully.",
            "records_processed": 1,
            "records_inserted": 1,
            "records_failed": 0,
        }

    inserted = 0

    columns = [c.lower().strip() for c in df.columns]

    # --------------------------------------------------
    # CASE 1
    # Prompt Dataset
    # --------------------------------------------------

    if "prompt" in columns:

        for _, row in df.iterrows():

            prompt = DatasetPrompt(
                dataset_id=dataset_id,
                prompt=str(row.get("prompt", "")),
                context=row.get("context"),
                expected_answer=row.get("expected_answer"),
                category=row.get("category"),
                difficulty=row.get("difficulty"),
                language=row.get("language", "English"),
            )

            db.add(prompt)

            inserted += 1

        dataset.total_prompts += inserted

        db.commit()

        return {
            "message": "Prompt dataset uploaded successfully.",
            "records_processed": len(df),
            "records_inserted": inserted,
            "records_failed": len(df) - inserted,
        }

    # --------------------------------------------------
    # CASE 2
    # Generic Dataset
    # --------------------------------------------------

    dataset.file_name = file.filename

    file.file.seek(0)

    dataset.file_path = json.dumps(df.to_dict(orient="records"))

    db.commit()

    return {
        "message": "Generic dataset uploaded successfully.",
        "columns_detected": list(df.columns),
        "rows": len(df),
        "status": "Dataset stored for future preprocessing.",
    }