import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configuração de CORS para aceitar sua Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.get("/")
async def root():
    return {"status": "Wiki Dash Online", "engine": "Gemini AI"}

@app.get("/api/ia-predict")
async def predict(ativo: str, preco: float, rsi: float):
    try:
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"Ativo: {ativo}, Preço: {preco}, RSI: {rsi}. Forneça suporte, resistencia e sinal (BUY/SELL/HOLD) em JSON puro."
        
        response = model.generate_content(prompt)
        # Aqui você pode tratar o texto da resposta para garantir que seja um JSON válido
        # Por simplicidade, assumimos que a IA responde o formato correto
        import json
        return json.loads(response.text.replace('```json', '').replace('```', ''))
    except Exception as e:
        return {"suporte": preco * 0.98, "resistencia": preco * 1.02, "sinal": "HOLD"}