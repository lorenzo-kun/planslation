import { or, eq } from 'drizzle-orm';
import { series } from '~/db/schema';

// returns a list of chapters for the given series, including series lanes
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
        columns: { id: true, title: true, sortOrder: true },
      },
      chapters: {
        columns: { seriesId: false },
      },
    },
  });

  return result || entityNotFoundError('Series', seriesId);
});
