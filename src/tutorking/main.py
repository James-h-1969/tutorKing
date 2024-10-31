from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import uvicorn

### Create FastAPI instance 
app = FastAPI(
    title="tutorking",
    description="App to manage tutoring",
    version="0.0.1"
)

# add middleware to allow for CORS. 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/test")
def test_fast_api():
    return {"message": "Hello from FastAPI"}

if __name__=="__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)