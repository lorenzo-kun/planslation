import { eq, or } from 'drizzle-orm';
import { series } from '~/db/schema';

// returns the details of the given series, including series lanes
export default defineEventHandler(async (req) => {
  const { seriesId } = getRouterParams(req);
  if (!seriesId)
    return argumentMissingError('Series ID');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - add current library to filter
  const result = await db.query.series.findFirst({
    where: or(eq(series.id, seriesId), eq(series.alias, seriesId)),
    columns: { libraryId: false },
    with: {
      lanes: {
        columns: { seriesId: false },
      },
    },
  });

  return result || entityNotFoundError('Series', seriesId);
});
