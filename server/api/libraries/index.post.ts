import {
  defaultLanes,
  libraries,
  users,
  type NewLibrary,
  type NewUser,
} from '~/db/schema';
import { DefaultLanes } from '~/utils';

// creates a new library, as well as admin user if provided
export default defineEventHandler<{
  body: { library: NewLibrary; admin?: NewUser };
}>(async (req) => {
  const { library: newLibrary, admin } = await readBody(req);
  if (!newLibrary) throw argumentMissingError('Library data');

  const db = useDb();

  const { result, error: libraryError } = await tryInsert(
    db
      .insert(libraries)
      .values(sanitiseAlias(newLibrary))
      .returning()
      .$dynamic()
  );

  if (libraryError) throw libraryError;

  const insertedLibrary = result[0];

  const { error: defaultLanesError } = await tryInsert(
    db
      .insert(defaultLanes)
      .values(
        DefaultLanes.map(dl => ({
          ...dl,
          libraryId: insertedLibrary.id,
        }))
      )
      .$dynamic()
  );

  if (defaultLanesError) throw defaultLanesError;

  if (admin) {
    const { result: insertedUser, error: userError } = await tryInsert(
      db
        .insert(users)
        .values({
          ...admin,
          isAdmin: true,
          libraryId: insertedLibrary.id,
        })
        .returning()
        .$dynamic()
    );

    if (userError) throw userError;

    return { ...insertedLibrary, user: insertedUser };
  }

  return insertedLibrary;
});
