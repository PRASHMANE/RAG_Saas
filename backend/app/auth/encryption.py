from cryptography.fernet import Fernet
from app.core.config import settings

cipher = Fernet(
    settings.ENCRYPTION_KEY.encode()
)


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