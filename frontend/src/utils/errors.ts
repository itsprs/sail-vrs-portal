export const extractErrorMessage = (
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  const msg = (err as { response?: { data?: { message?: string } } })?.response
    ?.data?.message
  return msg ?? fallback
}
