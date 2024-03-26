import { type Library, libraries } from '~/db/schema';

// updates the details of the given library
export default defineEventHandler<{ body: { library: Library } }>(
  async (req) => {
    const { libId } = getRouterParams(req);
    if (!libId) return argumentMissingError('Library ID');

    const { library } = await readBody(req);
    if (!library || !Object.entries(library).length)
      return argumentMissingError('Library data');

    const db = useDb();

    // TODO: SESSION MANAGEMENT - check current user has permission on this library
    const result = await db
      .update(libraries)
      .set(sanitiseAlias(library))
      .where(matchesIdOrAlias(libraries, libId))
      .returning();

    return result.length ? result[0] : entityNotFoundError('Library', libId);
  }
);
