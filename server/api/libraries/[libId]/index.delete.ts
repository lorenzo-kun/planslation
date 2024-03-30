import { libraries } from '~/db/schema';

// deletes the given library
export default defineEventHandler(async (req) => {
  const { libId } = getRouterParams(req);
  if (!libId) throw argumentMissingError('Library ID');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - check current user has permission on this library
  await db.delete(libraries).where(matchesIdOrAlias(libraries, libId));
});
