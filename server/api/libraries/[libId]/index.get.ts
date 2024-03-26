import { libraries } from '~/db/schema';

// returns the details of the given library, including default lanes
export default defineEventHandler(async (req) => {
  const { libId } = getRouterParams(req);
  if (!libId) return argumentMissingError('Library ID');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - check current user has permission on this library
  const result = await db.query.libraries.findFirst({
    where: matchesIdOrAlias(libraries, libId),
    with: {
      defaultLanes: {
        columns: { libraryId: false },
      },
    },
  });

  return result || entityNotFoundError('Library', libId);
});
