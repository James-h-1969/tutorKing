from fastapi import APIRouter, Depends, HTTPException, Query

from routers.users import service 
from routers.users.schemas import User

from sqlalchemy.ext.asyncio import AsyncSession

from main import get_db

from routers.users import service

router = APIRouter()

@router.post("/users/add_user/")
async def create_user(username: str = Query(...), email: str = Query(...), db: AsyncSession = Depends(get_db)):
    print("Made it here!")
    does_user = await service.does_user_exist(username, email, db)
    if does_user:
        raise HTTPException(status_code=409, detail="User already exists.")
    result = await service.add_user_to_db(username, email, db)
    return {"message": "User created successfully."}
