/*
 * The log calls have 2 signatures:
 * - ({mergingObject} | Error, message, { ...interpolationValues })
 * - ( message, { ...interpolationValues })
 *
 * Pass an object as the first argument to log structured data. The string argument logs a message.
 * The message can have placeholders, the interpolated values are defined in the last object.
 * If the 1st argument is an Error it will be wrapped in an object with the key 'err'.
 *
 * Copied from Pino: https://getpino.io/#/docs/api?id=logging-method-parameters
 */
interface LogFn {
  (obj: Error | unknown, msg?: string, ...args: any[]): void
  (msg: string, ...args: any[]): void
}

export interface Logger {
  debug: LogFn
  info: LogFn
  error: LogFn
  child: (bindings: Record<string, any>) => Logger
}
