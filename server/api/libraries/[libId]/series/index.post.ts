import { type NewSeries, series } from '~/db/schema';

// creates a new series in the given library
export default defineEventHandler<{ body: { series: NewSeries } }>(
  async (req) => {
    const { libId } = getRouterParams(req);
    if (!libId) throw argumentMissingError('Library ID');

    const { series: newSeries } = await readBody(req);
    if (!newSeries) throw argumentMissingError('Series data');

    const db = useDb();

    // TODO: SESSION MANAGEMENT - check current user has permission on this library
    const { result, error } = await tryInsert(
      db
        .insert(series)
        .values({
          ...sanitiseAlias(newSeries),
          libraryId: libId,
        })
        .returning()
        .$dynamic()
    );

    if (error) throw error;

    return result;
  }
);
