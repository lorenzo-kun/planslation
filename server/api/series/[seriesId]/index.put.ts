import { type Series, series as seriesTable } from '~/db/schema';

// updates the details of the given series
export default defineEventHandler<{ body: { series: Series } }>(async (req) => {
  const { seriesId } = getRouterParams(req);
  if (!seriesId) throw argumentMissingError('Series ID');

  const { series } = await readBody(req);
  if (!series || !Object.entries(series).length)
    throw argumentMissingError('Series data');

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

  if (error) throw error;

  if (!result?.length) throw entityNotFoundError('Series', seriesId);

  return result[0];
});
