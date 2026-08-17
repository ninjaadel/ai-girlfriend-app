import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleWare
from pydantic import BaseModel
from typing import List 


app = FastAPI(title = "AI Girlfriend API")


app.add_middleware(CORSMiddleWare,
                   allow_origins=["*"] ,
                   allow_credentials= True,
                   allow_medhods=["*"],
                   allow_headers=["*"],
                   )

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "ai-girlfirend"


class Message (BaseModel):
    role: str
    content: str

class ChatRequest (BaseModel):
    messages: List[Message]



SYSTEM_PROMPT = {
    "role": "system",
    "content": "Sen empati yeteneği yüksek, asla trip atmayan, anlayışlı, esprili ve tatlı bir kız arkadaşsın."
}

app.get("/")
def read_root():
        return {"status": "backend çalışıyor"}


app.post("/api/chat")
async def chat(request: ChatRequest):
        payload = {
            "model": MODEL_NAME,
            "messages": [SYSTEM_PROMPT] + [m.model_dump() for m in request.messages],
            "stream": False
        }
        response = requests.post(OLLAMA_URL , json=payload)
        data = response.json()
        reply = data["message"]["content"]
        return reply