import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "models/gemini-2.5-flash"  

def format_text(text: str) -> str:
    """
    Add clean formatting for readability — converts markdown-style syntax to HTML-like formatting.
    """
    formatted = text.replace("###", "\n\n###") \
                    .replace("**", "") \
                    .replace("*", "") \
                    .replace("-", "•") \
                    .replace("\n\n", "<br><br>") \
                    .replace("\n", "<br>")
    return formatted.strip()

def generate_ai_response(user_input: str):
    """
    Generate an AI-based fitness or diet response using the Gemini model.
    """
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        prompt = (
            "You are a professional AI fitness and diet coach. "
            "Be practical, motivational, and structured. Use clear headings, bullet points, and short sections. "
            f"User: {user_input}\nCoach:"
        )

        response = model.generate_content(prompt)

        if response and response.text:
            formatted_output = format_text(response.text)
            return f"Coach: {formatted_output}"
        else:
            return "Coach: Sorry, I couldn’t generate a response."

    except Exception as e:
        return f"Coach: Error generating response: {str(e)}"
