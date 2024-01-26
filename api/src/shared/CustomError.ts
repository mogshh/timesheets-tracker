export class CustomError {
  private error: Error;
  constructor(
    private message: string,
    private innerException: any | null = null,
    private additionalInfo: any | null = null
  ) {
    this.error = new Error();
  }

  public toString() {
    return JSON.stringify({
      message: this.message,
      innerException: this.innerException,
      additionalInfo: this.additionalInfo,
      stack: this.error.stack,
    });
  }
}
