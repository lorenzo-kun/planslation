import { type Library, libraries } from '~/db/schema';

// updates the details of the given library
export default defineEventHandler<{ body: { library: Library } }>(
  async (req) => {
    const { libId } = getRouterParams(req);
    if (!libId) throw argumentMissingError('Library ID');

    const { library } = await readBody(req);
    if (!library || !Object.entries(library).length)
      throw argumentMissingError('Library data');

    const db = useDb();

    // TODO: SESSION MANAGEMENT - check current user has permission on this library
    const { result, error } = await tryUpdate(
      db
        .update(libraries)
        .set(sanitiseAlias(library))
        .where(matchesIdOrAlias(libraries, libId))
        .returning()
        .$dynamic()
    );

    if (error) throw error;

    if (!result?.length) throw entityNotFoundError('Library', libId);

    return result[0];
  }
);
