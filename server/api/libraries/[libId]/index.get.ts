import { libraries } from '~/db/schema';

// returns the details of the given library, including default lanes
export default defineEventHandler(async (req) => {
  const { libId } = getRouterParams(req);
  if (!libId) throw argumentMissingError('Library ID');

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

  if (!result) throw entityNotFoundError('Library', libId);

  return result;
});
