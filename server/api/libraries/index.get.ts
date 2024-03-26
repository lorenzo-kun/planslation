// returns a list of libraries for the current user
export default defineEventHandler(async () => {
  const db = useDb();

  // TODO: SESSION MANAGEMENT - add current user to filter
  const result = await db.query.libraries.findMany();

  return result;
});
