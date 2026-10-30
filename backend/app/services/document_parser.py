import io
import re
from typing import Optional
from pypdf import PdfReader

class DocumentParserService:
    """
    Extracts and standardizes incident reports, emails, or deviation logs
    from raw text, pasted emails, or uploaded PDF documents.
    """

    @staticmethod
    def extract_from_pdf(file_bytes: bytes) -> str:
        """Extracts readable text from PDF bytes using pypdf."""
        try:
            reader = PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(f"--- Page {idx + 1} ---\n{page_text}")
            
            full_text = "\n\n".join(text_parts).strip()
            if not full_text:
                raise ValueError("PDF contains no selectable text or is an image scan.")
            return full_text
        except Exception as e:
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")

    @staticmethod
    def clean_text_input(raw_text: str) -> str:
        """Normalizes email headers, whitespace, and formatting."""
        if not raw_text or not raw_text.strip():
            raise ValueError("Input incident text cannot be empty.")
        
        # Clean multi-spaces and excessive newlines
        cleaned = re.sub(r'\r\n', '\n', raw_text)
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        return cleaned.strip()

document_parser = DocumentParserService()
