from routers.users.schemas import User, Role
from sqlalchemy.future import select

from sqlalchemy.ext.asyncio import AsyncSession


async def get_user(username: str, email: str, db: AsyncSession) -> User:
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
    existing_user: User
        The user if they exist
    
    """
    query = select(User).where((User.username == username) | (User.email == email))
    result = await db.execute(query)
    existing_user = result.scalars().first()
    return existing_user

async def get_user_with_desc(username: str, email: str, db: AsyncSession) -> User:
    """
    Asynchronous function in order to check if a user exists in the db,
    also grabs the role table

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
    existing_user: User
        The user if they exist
    
    """
    query = select(User, Role).join(Role, User.role_id == Role.role_id).where((User.username == username) | (User.email == email))
    result = await db.execute(query)
    existing_user = result.first()
    return existing_user

async def get_user_by_id(id: int, db: AsyncSession) -> User:
    """
    Asynchronous function in order to get a user

    Parameters
    -----
    id: int
        The id of the user
    db: AsyncSession
        The connection to the SQL database

    Returns 
    -----
    existing_user: User
        The user, if they exist
    
    """
    query = select(User).where((User.id == id))
    result = await db.execute(query)
    existing_user = result.scalars().first()
    return existing_user

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