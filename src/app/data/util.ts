export function coerceToDate(input: any): Date {
  if (input instanceof Date) {
    return input;
  } else if (input.toDate) {
    return input.toDate();
  } else {
    return null;
  }
}
