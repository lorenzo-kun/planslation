export const sanitiseAlias = <T extends { alias?: string | null }>(entity: T) =>
  !entity.alias
    ? entity
    : {
        ...entity,
        alias: entity.alias
          .toLowerCase()
          .replace(/\s/g, '_')
          .replace(/[^\w-]/g, ''),
      };
