from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai

app = FastAPI()

# CRITICAL: Libera o acesso para o seu Frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/ia-predict")
async def predict(ativo: str, preco: float, rsi: float):
    # Sua lógica de IA aqui
    return {
        "suporte": preco * 0.98, 
        "resistencia": preco * 1.02, 
        "sinal": "BUY" if rsi < 30 else "SELL" if rsi > 70 else "WAIT"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)