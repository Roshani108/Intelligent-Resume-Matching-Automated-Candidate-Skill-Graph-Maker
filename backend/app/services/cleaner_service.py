import re
import unicodedata

def clean_text(raw_text: str) -> str:
    """
    Cleans raw text extracted from PDFs:
    1. Normalizes Unicode characters (accents, curly quotes, non-breaking spaces).
    2. Recombines words broken across line breaks with hyphens (e.g. 'engi-\nneer' -> 'engineer').
    3. Normalizes bullet points into consistent standard dashes '-'.
    4. Removes non-printable and strange control characters.
    5. Cleans up excessive tabs and horizontal spaces.
    6. Collapses 3+ consecutive newlines down to 2 newlines (preserves paragraph breaks).
    """
    if not raw_text or not isinstance(raw_text, str):
        return ""

    # Step 1: Normalize unicode (NFKC turns special ligatures and strange spaces into standard ASCII equivalents)
    text = unicodedata.normalize("NFKC", raw_text)

    # Step 2: Replace non-breaking spaces and unusual space chars with standard space
    text = text.replace("\xa0", " ").replace("\u200b", "")

    # Step 3: Fix hyphenated words broken across line breaks (e.g. "soft-\nware" -> "software")
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)

    # Step 4: Standardize varied bullet point symbols to a simple dash "-"
    bullet_pattern = r'[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25AB\u25CF\u25CB\u25A0\uf0b7]'
    text = re.sub(bullet_pattern, '\n- ', text)

    # Step 5: Replace fancy single and double quotation marks with standard straight quotes
    text = re.sub(r'[\u2018\u2019]', "'", text)
    text = re.sub(r'[\u201C\u201D]', '"', text)

    # Step 6: Standardize dashes (em-dash, en-dash) to standard hyphens
    text = re.sub(r'[\u2013\u2014]', '-', text)

    # Step 7: Collapse multiple spaces or tabs on the same line into a single space
    # (while preserving the newlines themselves)
    lines = []
    for line in text.splitlines():
        # Collapse internal runs of spaces/tabs
        cleaned_line = re.sub(r'[ \t]+', ' ', line).strip()
        lines.append(cleaned_line)

    text = "\n".join(lines)

    # Step 8: Collapse excessive blank lines (max 2 consecutive newlines)
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()
