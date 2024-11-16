from sqlalchemy import Column, Integer, String, DateTime, func

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# User Model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), index=True)
    email = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    role_id = Column(Integer, index=True, server_default='1')

# Role Model
class Role(Base):
    __tablename__ = "roles"
    role_id = Column(Integer, primary_key=True, index=True)
    role_name = Column(String(45))
    role_description = Column(String(100))
    colour = Column(String(45))