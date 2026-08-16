import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleWare
from pydantic import BaseModel
from typing import List 


app = FastAPI(title = "AI Girlfriend API")


app.add_middleware(CORSMiddleWare,
                   allow_origins=["*"])