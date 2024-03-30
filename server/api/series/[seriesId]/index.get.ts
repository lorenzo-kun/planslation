import { series } from '~/db/schema';

// returns the details of the given series, including series lanes
export default defineEventHandler(async (req) => {
  const { seriesId } = getRouterParams(req);
  if (!seriesId) throw argumentMissingError('Series ID');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - add current library to filter
  const result = await db.query.series.findFirst({
    where: matchesIdOrAlias(series, seriesId),
    columns: { libraryId: false },
    with: {
      lanes: {
        columns: { seriesId: false },
      },
    },
  });

  if (!result) throw entityNotFoundError('Series', seriesId);

  return result;
});
