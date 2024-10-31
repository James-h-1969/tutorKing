from routers.users.schemas import User
from sqlalchemy.future import select

from sqlalchemy.ext.asyncio import AsyncSession


async def does_user_exist(username: str, email: str, db: AsyncSession) -> bool:
    """
    Asynchronous function in order to check if a user exists in the db

    Parameters
    -----
    username: str
        The username of the new user
    email: str
        The email of the new user
    db: AsyncSession
        The connection to the SQL database

    Returns 
    -----
    exists: bool
        Whether a user exists or not
    
    """
    query = select(User).where((User.username == username) | (User.email == email))
    result = await db.execute(query)
    existing_user = result.scalars().first()
    exists = existing_user is not None
    return exists

async def add_user_to_db(username: str, email: str, db: AsyncSession) -> None:
    """
    Asycnronous function to add a user to the db

    Parameters
    -----
    username: str
        The username of the new user
    email: str
        The email of the new user
    db: AsyncSession
        The connection to the SQL database
    """
    db_user = User(username=username, email=email)
    db.add(db_user)
    await db.commit()  
    await db.refresh(db_user)  