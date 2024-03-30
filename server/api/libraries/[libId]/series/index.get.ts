import { libraries } from '~/db/schema';

// returns a list of series in the library
export default defineEventHandler(async (req) => {
  const { libId } = getRouterParams(req);
  if (!libId) throw argumentMissingError('Library ID');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - check current user has permission on this library
  const result = await db.query.libraries.findFirst({
    where: matchesIdOrAlias(libraries, libId),
    columns: {},
    with: {
      series: {
        columns: { libraryId: false },
      },
    },
  });

  if (!result) throw entityNotFoundError('Library', libId);

  return result.series;
});
