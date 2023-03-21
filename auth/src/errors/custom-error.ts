export abstract class CustomError extends Error {
  abstract statusCode: number
  abstract serializeErrors (): Array<{ message: string, field?: string }>
}
