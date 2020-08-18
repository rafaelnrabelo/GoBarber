class AppError implements Error {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly name: string;
  public readonly stack?: string | undefined;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
