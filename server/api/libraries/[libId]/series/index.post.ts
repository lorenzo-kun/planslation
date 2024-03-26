import { type NewSeries, series } from '~/db/schema';
import { tryInsert } from '~/server/utils';

// creates a new series in the given library
export default defineEventHandler<{ body: { series: NewSeries } }>(
  async (req) => {
    const { libId } = getRouterParams(req);
    if (!libId) return argumentMissingError('Library ID');

    const { series: newSeries } = await readBody(req);
    if (!newSeries) return argumentMissingError('Series data');

    const db = useDb();

    // TODO: SESSION MANAGEMENT - check current user has permission on this library
    const { result, error } = await tryInsert(() =>
      db
        .insert(series)
        .values({
          ...newSeries,
          libraryId: libId,
        })
        .returning()
    );

    return error || result;
  }
);
