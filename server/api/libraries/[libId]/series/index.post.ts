import { type NewSeries, defaultLanes, series, seriesLanes } from '~/db/schema';

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

    const insertedSeries = result[0];

    const libraryDefaultLanes = await db.query.defaultLanes.findMany({
      where: inLibrary(defaultLanes, libId),
      columns: {
        title: true,
        description: true,
        sortOrder: true,
        autoAssignUserId: true,
        notifyUserIds: true,
      },
    });

    const { error: defaultLanesError } = await tryInsert(
      db
        .insert(seriesLanes)
        .values(
          libraryDefaultLanes.map(dl => ({
            ...dl,
            seriesId: insertedSeries.id,
          }))
        )
        .$dynamic()
    );

    if (defaultLanesError) throw defaultLanesError;

    return insertedSeries;
  }
);
