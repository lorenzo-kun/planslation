import {
  libraries,
  users,
  type NewLibrary,
  type NewUser,
  defaultLanes,
} from '~/db/schema';
import { DefaultLanes } from '~/utils';

// creates a new library, as well as admin user if provided
export default defineEventHandler<{
  body: { library: NewLibrary; admin?: NewUser };
}>(async (req) => {
  const { library: newLibrary, admin } = await readBody(req);
  if (!newLibrary) throw argumentMissingError('Library data');

  const db = useDb();

  const { result: insertedLibrary, error: libraryError } = await tryInsert(
    db
      .insert(libraries)
      .values(sanitiseAlias(newLibrary))
      .returning()
      .$dynamic()
  );

  if (libraryError) throw libraryError;

  const { error: defaultLanesError } = await tryInsert(
    db
      .insert(defaultLanes)
      .values(
        DefaultLanes.map(dl => ({
          ...dl,
          libraryId: insertedLibrary[0].id as string,
        }))
      )
      .returning({})
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
          libraryId: insertedLibrary[0].id as string,
        })
        .returning()
        .$dynamic()
    );

    if (userError) throw userError;

    return { ...insertedLibrary, user: insertedUser };
  }

  return insertedLibrary;
});
