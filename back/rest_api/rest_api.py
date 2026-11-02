import fastapi
from fastapi import FastAPI, HTTPException, Body, Depends, Response
from uvicorn import run
from fastapi.security import OAuth2PasswordRequestForm
from playhouse.shortcuts import model_to_dict
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import timedelta, datetime, timezone

from back.servises.auth_servise import authentificate
from back.database.schemas import UserLogin
from back.rest_api.routers import product, user, category, storage_cell
from back.core.exceptions import InvalidCredentials, NotFoundError, AlreadyExsist, InvalidRole
from back.database.models import User
from back.rest_api.jwt_token import encode_jwt, key
from back.rest_api.hasher import hash_password, verify_hash


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"])


@app.exception_handler(AlreadyExsist)
async def _(request, exc):
    return JSONResponse(status_code=409, content={"detail": exc.message})


@app.exception_handler(NotFoundError)
async def _(request, exc):
    return JSONResponse(status_code=404, content={"detail": exc.message})


@app.exception_handler(InvalidRole)
async def _(request, exc):
    return JSONResponse(status_code=403, content={"detail": exc.message})


@app.exception_handler(InvalidCredentials)
async def _(request, exc):
    return JSONResponse(status_code=401, content={"detail": exc.message})


@app.post("/login")
def login(form_data: UserLogin = Body()):
    token = authentificate(username=form_data.username, password=form_data.password)

    response = JSONResponse(content=token)
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",
        path="/",
        expires=datetime.now(timezone.utc) + timedelta(days=30)
    )

    return response


@app.post("/logout")
def logout():
    response = JSONResponse(content={"detail": "Logged out"})
    response.delete_cookie(
        key="token",
        path="/",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return response


app.include_router(product.router)
app.include_router(user.router)
app.include_router(category.router)
app.include_router(storage_cell.router)


if __name__ == "__main__":
    run("back.rest_api.rest_api:app", host="0.0.0.0", port=8000, reload=True)
