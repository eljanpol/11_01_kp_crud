import jwt
from datetime import datetime, timedelta, timezone


key = "QDRDDoV7TZE0MrJmsL2PmV853ZE7luZZpD27TnU9Gnq1nZOcbiNGxtmdUIzjn3QPYfBBMbk1yGl9xZTpl3TqfCsSGL7o3ZjXKaqc1OiS7eilQKCAnquvaTP9XYGCFswe"


def encode_jwt(user_id: str, key: str, expires_minutes: int = 5):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expires_minutes),
    }

    return jwt.encode(payload, key=key, algorithm="HS256")


def decode_jwt(token: str, key: str):
    user_dict = jwt.decode(token, key=key, algorithms=["HS256"])

    return user_dict
