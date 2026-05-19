import pypdf
import sys

def extract_text(pdf_path, out_path):
    try:
        with open(out_path, 'w', encoding='utf-8') as f:
            reader = pypdf.PdfReader(pdf_path)
            for i, page in enumerate(reader.pages):
                f.write(f"--- Page {i+1} ---\n")
                f.write(page.extract_text() + "\n")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        extract_text(sys.argv[1], sys.argv[2])
    else:
        print("Please provide a path to a PDF file and output file")
