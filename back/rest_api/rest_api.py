from fastapi import FastAPI, HTTPException, Body, Depends
import fastapi
from uvicorn import run
from fastapi.security import OAuth2PasswordRequestForm
from playhouse.shortcuts import model_to_dict
from fastapi.middleware.cors import CORSMiddleware

from back.rest_api.jwt_token import get_jwt, get_user, key
from back.rest_api.hasher import verify_hash
from back.database.models import User
from back.rest_api.routers import user


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = User.get_or_none(name=form_data.username)

    if not user:
        raise HTTPException(status_code=400, detail="invalid name")

    user = model_to_dict(user)
    print(user)

    if verify_hash(form_data.password, user["password"]):
        return {"access_token": get_jwt(user, key)}

    raise HTTPException(status_code=400, detail="invalid password")


app.include_router(user.router)


if __name__ == "__main__":
    run("back.rest_api.rest_api:app", host="0.0.0.0", port=8000, reload=True)
