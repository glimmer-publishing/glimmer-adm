import {at, defineMigration, setIfMissing} from 'sanity/migrate'

// Superseded by `unset-legacy-genre`. Kept as an audit trail; it is a permanent
// no-op once that migration has run, since there is no `genre` left to copy from.
//
// Copies the legacy single `genre` reference onto the new `genres` array,
// for any product that has a `genre` but no `genres` yet. Idempotent and
// safe to re-run: products that already have `genres` are left untouched,
// and the old `genre` field is never modified or removed here.
export default defineMigration({
  title: 'migrate-genre-to-genres',
  documentTypes: ['product'],

  migrate: {
    document(doc) {
      const genre = doc.genre as {_ref: string; _type: 'reference'} | undefined
      const genres = doc.genres as unknown[] | undefined

      if (!genre?._ref || (genres && genres.length > 0)) {
        return
      }

      return at(
        'genres',
        setIfMissing([
          {
            _key: `migrated-${genre._ref}`,
            _type: 'reference',
            _ref: genre._ref,
          },
        ]),
      )
    },
  },
})
