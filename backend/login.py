from datetime import timedelta
from app_types.user_types import UserDetails, UserInDB
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import HTTPException, Depends
# from passlib.context import CryptContext
from pymongo import MongoClient
from config_loader import *
from jwt import create_access_token
import bcrypt

# Connect to your MongoDB database
client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]
users = db[MONGO_USERS_COLLECTION]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def register_user(user: UserDetails):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    # Convert user.details to dictionary before insertion
    user_details_dict = user.dict()
    user_details_dict["hashed_password"] = hashed_password.decode('utf-8')  # Store the hashed password
    del user_details_dict["password"]  # Remove the plain password from the dictionary
    user_details_dict = {k: v for k, v in user_details_dict.items() if v is not None}

    if user.user_type == "therapist":
        # Check if user already exists
        if users.find_one({'email': user_details_dict['email']}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Insert the new user into the database
        result = users.insert_one(user_details_dict)

        return {"ok": bool(result.inserted_id)}
    elif user.user_type == "patient":       
        # Check if user already exists
        if users.find_one({'email': user_details_dict['email']}):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Insert the new user into the database
        result = users.insert_one(user_details_dict)

        return {"ok": bool(result.inserted_id)}
    else:
        raise HTTPException(status_code=400, detail="Invalid user type")

    return {"status": "success"}


def get_user_from_database(username: str) -> UserInDB:
    user_data = users.find_one({"email": username})
    if user_data:
        return UserInDB(**user_data)
    return None

async def handle_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_from_database(form_data.username)
    if not user or not bcrypt.checkpw(form_data.password.encode('utf-8'), user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Generate JWT
    access_token = create_access_token(
        data={"sub": user.email, "userType": user.user_type},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))

    return {"access_token": access_token, "token_type": "bearer"}


from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"

async def google_login(token: str):
    try:
        # Validate the token
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)

        # Check that the user's email is verified
        if idinfo['email_verified']:
            email = idinfo['email']

            # Here, use the email to check if the user exists in your database
            # If they don't, you might want to create a new user entry

            return {"status": "success", "email": email}
        else:
            raise HTTPException(status_code=400, detail="Email not verified by Google")

    except ValueError:
        # Invalid token
        raise HTTPException(status_code=400, detail="Invalid Google token")
