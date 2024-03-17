import { eq, or } from 'drizzle-orm';
import type { AliasedEntity, LibSpecificEntity } from '~/db/interfaces';

export const inLibrary = (entity: LibSpecificEntity, libraryId: string) =>
  eq(entity.libraryId, libraryId);

export const matchesIdOrAlias = (aliasedEntity: AliasedEntity, target: string) =>
  or(eq(aliasedEntity.id, target), eq(aliasedEntity.alias, target));
