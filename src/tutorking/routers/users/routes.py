from fastapi import APIRouter, Depends, HTTPException, Query

from routers.users import service 
from routers.users.schemas import User

from sqlalchemy.ext.asyncio import AsyncSession

from main import get_db

from routers.users import service

router = APIRouter()

@router.post("/users/add_user")
async def create_user(username: str = Query(...), email: str = Query(...), db: AsyncSession = Depends(get_db)):
    user = await service.get_user(username, email, db)
    if user:
        raise HTTPException(status_code=409, detail="User already exists.")
    result = await service.add_user_to_db(username, email, db)
    return {"message": "User created successfully."}

@router.get("/users/get_user")
async def get_user_from_db(username: str = Query(...), email: str = Query(...), include_role_desc: bool = Query(...), db: AsyncSession = Depends(get_db)):
    if include_role_desc:
        user, role = await service.get_user_with_desc(username, email, db)
    else:
        user = await service.get_user(username, email, db)
    if user:
        return {
            'user': user,
            'role': role or {},
        }
    else:
        raise HTTPException(status_code=404, detail="User not found.")
        
@router.patch("/users/update_user_role")
async def update_user_role(user_id: int = Query(...), role_id: int = Query(...), db: AsyncSession = Depends(get_db)):
    user = await service.get_user_by_id(user_id, db)
    user.role_id = role_id

    await db.commit()

    return user