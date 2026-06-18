import os

from app.core.config import settings

from cryptography.fernet import Fernet

key = settings.ENCRYPTION_KEY

if not key:
    raise ValueError(
        "ENCRYPTION_KEY is missing from .env"
    )

cipher = Fernet(key.encode())


def encrypt_api_key(api_key: str) -> str:
    return cipher.encrypt(
        api_key.encode()
    ).decode()


def decrypt_api_key(
    encrypted_key: str,
) -> str:
    return cipher.decrypt(
        encrypted_key.encode()
    ).decode()

