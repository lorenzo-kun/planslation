import { type NewChapter, chapters } from '~/db/schema';

// creates a new chapter in the given series
export default defineEventHandler<{ body: { chapter: NewChapter } }>(
  async (req) => {
    const { seriesId } = getRouterParams(req);
    if (!seriesId) return argumentMissingError('Series ID');

    const { chapter: newChapter } = await readBody(req);
    if (!newChapter) return argumentMissingError('Chapter data');

    const db = useDb();

    // TODO: SESSION MANAGEMENT - check current user has permission on this series
    const { result, error } = await tryInsert(
      db
        .insert(chapters)
        .values({
          ...newChapter,
          seriesId,
        })
        .returning()
        .$dynamic()
    );

    return error || result;
  }
);
