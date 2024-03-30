import { series } from '~/db/schema';

// deletes the given series
export default defineEventHandler(async (req) => {
  const { seriesId } = getRouterParams(req);
  if (!seriesId) throw argumentMissingError('Series ID');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - check current user has permission on this series
  await db.delete(series).where(matchesIdOrAlias(series, seriesId));
});
