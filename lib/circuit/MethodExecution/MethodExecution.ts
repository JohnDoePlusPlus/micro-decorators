export function methodExecution(
  method: () => any,
  onSuccess: () => any,
  onError: (error: Error) => unknown,
): unknown {

  try {
    const value = method();

    if (value instanceof Promise) {
      return value
        .then(
          (result) => {
            onSuccess();
            return result;
          },
        )
        .catch(error => onError(error));
    }

    return value;
  } catch (error) {
    return onError(error);
  }
}
