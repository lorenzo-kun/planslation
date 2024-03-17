export const argumentMissingError = (...args: string[]) =>
  createError({
    statusCode: 400,
    message: `Argument missing: ${args.join(', ')} must be provided`,
  });

export const entityNotFoundError = (entityName: string, id: string) =>
  createError({
    statusCode: 400,
    message: `${entityName} corresponding to ID ${id} could not be found`,
  });
