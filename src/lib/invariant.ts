import { AppError } from "./error";

export function invariantAppError(
  condition: any,
  message: string,
): asserts condition {
  if (!condition) {
    throw new AppError(message);
  }
}
