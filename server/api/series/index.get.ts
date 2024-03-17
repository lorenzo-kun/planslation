// returns a list of series for the current library
export default defineEventHandler(async () => {
  const db = useDb();

  // TODO: SESSION MANAGEMENT - add current library to filter
  const result = await db.query.series.findMany();

  return result;
});
