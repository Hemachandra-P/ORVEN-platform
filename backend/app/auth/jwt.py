from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import settings

# Algorithm used to sign the JWT
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Creates a signed JWT access token.
    """

    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=ALGORITHM,
    )

    return encoded_jwt


def verify_access_token(token: str):
    """
    Verifies a JWT and returns its payload.
    Raises an exception if invalid or expired.
    """

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[ALGORITHM],
        )
        return payload

    except JWTError:
        return None