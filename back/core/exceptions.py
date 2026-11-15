class BaseException(Exception):
	def __init__(self, message: str):
		self.message = message
		super().__init__(self.message)


class NotFoundError(BaseException):
	pass


class AlreadyExsist(BaseException):
	pass


class InvalidRole(BaseException):
	pass


class InvalidCredentials(BaseException):
	pass
