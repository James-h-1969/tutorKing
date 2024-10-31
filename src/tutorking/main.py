from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import uvicorn

# Dependency to get the database session
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
from routers.users.routes import router as user_router

# get the DB from .env file
from dotenv import load_dotenv
import os
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")  

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Create FastAPI instance 
app = FastAPI(
    title="tutorking",
    description="App to manage tutoring",
    version="0.0.1"
)

# Add middleware to allow for CORS. 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)

# Create the database tables asynchronously
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__=="__main__":
    import asyncio
    asyncio.run(init_db())  # Initialize the database tables
    uvicorn.run(app, host="127.0.0.1", port=8000) 
