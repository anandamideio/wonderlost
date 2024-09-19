export class WonderError extends Error {
  public code: string;
  public message: string;
  public stack: string;
  public name: string;
  public constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.message = message;
    this.name = "WonderError";
    this.stack = new Error().stack ?? "";
  }

  public toString() {
    return `${this.name}: ${this.message} /n/n ${this.stack}`;
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      name: this.name,
      stack: this.stack,
    };
  }
}
