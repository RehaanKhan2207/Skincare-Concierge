from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import httpx
import os
from dotenv import load_dotenv

# Try loading from the environment file (useful for local development)
# If the file doesn't exist (like on Vercel), it safely skips it without failing.
if os.path.exists("../.env"):
    load_dotenv(dotenv_path="../.env")
elif os.path.exists(".env"):
    load_dotenv()

app = FastAPI()

# Allow CORS so your frontend can communicate with this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None

# Retrieve credentials
IBM_URL = os.getenv("IBM_INSTANCE_URL")
AGENT_ID = os.getenv("AGENT_ID")
API_KEY = os.getenv("IBM_API_KEY")

@app.get("/health")
async def health_check():
    return {"agent_configured": bool(AGENT_ID and API_KEY)}

@app.post("/api/chat")
async def chat_with_agent(request: ChatRequest):
    # Quick sanity check: If API_KEY is missing, catch it before making the network request
    if not API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="Configuration Error: IBM_API_KEY environment variable is missing or empty."
        )

    # Constructing a standard REST call to the Watson Orchestrate instance
    url = f"{IBM_URL}/v1/orchestrate/{AGENT_ID}/chat/completions" 
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        # First, exchange the API key for an IAM access token
        token_url = "https://iam.cloud.ibm.com/identity/token"
        token_data = {
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": API_KEY
        }
        token_headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        try:
            token_response = await client.post(token_url, data=token_data, headers=token_headers)
            # If IBM returns a 400 or 401, this will raise an error containing the reason
            token_response.raise_for_status()
            access_token = token_response.json().get("access_token")
        except httpx.HTTPStatusError as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to get IAM token: Client error '{e.response.status_code}' from IBM. Reason: {e.response.text}"
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to get IAM token: {str(e)}")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        payload = {
            "messages": [
                {"role": "user", "content": request.message}
            ],
            "stream": False
        }
    
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            
            # Parse the response (adjust based on exact IBM JSON structure)
            reply = data.get("choices", [{}])[0].get("message", {}).get("content", "I could not process that request.")
            
            return {"reply": reply, "thread_id": data.get("thread_id")}
            
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"IBM API Error: {e.response.text}")
        except Exception as e:
            import traceback
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=repr(e))
