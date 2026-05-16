from urllib.parse import urlencode

from authlib.integrations.starlette_client import OAuth, OAuthError
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from app.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])

oauth = OAuth()
settings = get_settings()

oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/google")
async def auth_google(request: Request):
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        )
    redirect_uri = settings.google_redirect_uri
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def auth_google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError:
        params = urlencode({"auth": "error", "message": "oauth_failed"})
        return RedirectResponse(url=f"{settings.frontend_url}/?{params}")

    userinfo = token.get("userinfo")
    if not userinfo:
        raise HTTPException(status_code=400, detail="Failed to retrieve user info")

    params = urlencode(
        {
            "auth": "ok",
            "name": userinfo.get("name", ""),
            "email": userinfo.get("email", ""),
            "picture": userinfo.get("picture", ""),
        }
    )
    return RedirectResponse(url=f"{settings.frontend_url}/?{params}")
