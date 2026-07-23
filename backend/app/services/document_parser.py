from io import BytesIO

from docx import Document as DocxDocument
from pypdf import PdfReader


def extract_text(file):
    filename = file.filename.lower()
    content = file.file.read()

    file.file.seek(0)

    if filename.endswith(".pdf"):
        reader = PdfReader(BytesIO(content))
        return "\n".join(page.extract_text() or "" for page in reader.pages)

    if filename.endswith(".docx"):
        doc = DocxDocument(BytesIO(content))
        return "\n".join(p.text for p in doc.paragraphs)

    if filename.endswith(".txt"):
        return content.decode("utf-8")

    raise ValueError("Unsupported file type")