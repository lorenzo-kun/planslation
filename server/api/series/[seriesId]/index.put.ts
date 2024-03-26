import { type Series, series as seriesTable } from '~/db/schema';

// updates the details of the given series
export default defineEventHandler<{ body: { series: Series } }>(async (req) => {
  const { seriesId } = getRouterParams(req);
  if (!seriesId) return argumentMissingError('Series ID');

  const { series } = await readBody(req);
  if (!series || !Object.entries(series).length)
    return argumentMissingError('Series data');

  const db = useDb();

  // TODO: SESSION MANAGEMENT - check current user has permission on this series
  const { result, error } = await tryUpdate(
    db
      .update(seriesTable)
      .set(sanitiseAlias(series))
      .where(matchesIdOrAlias(seriesTable, seriesId))
      .returning()
      .$dynamic()
  );

  if (error) return error;

  return result.length ? result[0] : entityNotFoundError('Series', seriesId);
});
