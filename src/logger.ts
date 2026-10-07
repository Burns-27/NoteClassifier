export type ActionResult = {
  success: boolean,
  message?: string,
  context?: Record<string, unknown>
}