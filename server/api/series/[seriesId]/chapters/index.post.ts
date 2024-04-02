import { type NewChapter, chapters, series as seriesTable } from '~/db/schema';

// creates a new chapter in the given series
export default defineEventHandler<{ body: { chapter: NewChapter } }>(
  async (req) => {
    const { seriesId } = getRouterParams(req);
    if (!seriesId) throw argumentMissingError('Series ID');

    const { chapter: newChapter } = await readBody(req);
    if (!newChapter) throw argumentMissingError('Chapter data');

    const db = useDb();

    // TODO: SESSION MANAGEMENT - check current user has permission on this series
    const series = await db.query.series.findFirst({
      where: matchesIdOrAlias(seriesTable, seriesId),
      columns: {
        id: true,
      },
    });

    if (!series) throw entityNotFoundError('Series', seriesId);

    const { result, error } = await tryInsert(
      db
        .insert(chapters)
        .values({
          ...newChapter,
          seriesId: series.id,
        })
        .returning()
        .$dynamic()
    );

    if (error) throw error;

    return result;
  }
);
