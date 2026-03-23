import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Carrega as variáveis de ambiente (do .env local ou do Render)
load_dotenv()

# 2. Inicializa o FastAPI
app = FastAPI()

# 3. Configura o CORS (Permite que seu site na Vercel acesse este backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Configura a API do Google Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Rota de teste para confirmar que o servidor está vivo
@app.get("/")
async def root():
    return {"status": "Wiki Dash Online", "engine": "Gemini 1.5 Flash"}

# 5. Rota de Predição da IA
@app.get("/api/ia-predict")
async def predict(ativo: str, preco: float, rsi: float):
    try:
        # Usando o modelo flash que é mais rápido e compatível
        model = genai.GenerativeModel('gemini-1.5-flash') 
        
        prompt = (
            f"Ativo: {ativo}, Preço Atual: {preco}, RSI Atual: {rsi}. "
            "Com base nesses dados técnicos, determine um suporte próximo, uma resistência próxima "
            "e um sinal de operação (BUY, SELL ou HOLD). "
            "Responda APENAS o objeto JSON puro, sem formatação markdown, com os campos: "
            "'suporte' (number), 'resistencia' (number) e 'sinal' (string)."
        )
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Limpeza de possíveis marcações de markdown (```json ... ```)
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)
        
    except Exception as e:
        print(f"Erro no processamento da IA: {e}")
        # Retorno de segurança (Fallback) para o Dashboard não quebrar
        return {
            "suporte": round(preco * 0.985, 2),   # 1.5% abaixo do preço
            "resistencia": round(preco * 1.015, 2), # 1.5% acima do preço
            "sinal": "HOLD",
            "error": "Utilizando cálculos automáticos (IA em manutenção)"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)