import {at, defineMigration, unset} from 'sanity/migrate'

// Removes the legacy single `genre` reference from products, now that `genres[]`
// is the only genre field in the schema.
//
// Run order: storefront first, then this migration (against `preview`, then
// `production` — it is dataset-scoped, so it must be run once per dataset),
// then the Studio schema deploy. Deploying the schema first is what opens the
// window where the Studio reports the leftover value as an unknown field;
// unsetting first means that window never exists. This migration reads raw
// documents and does not need the field to be in the schema either way.
//
// Pre-condition: every product carrying a `genre` must already have a non-empty
// `genres`, otherwise unsetting loses the only genre data. Verify with
//   count(*[_type == "product" && defined(genre) && (!defined(genres) || count(genres) == 0)])
// and run `migrate-genre-to-genres` first if it is non-zero. Checked before this
// migration was written: 0 in both `preview` and `production`.
//
// Idempotent and safe to re-run: documents that no longer have `genre` are
// skipped, and `unset` on an absent path is a no-op regardless.
export default defineMigration({
  title: 'unset-legacy-genre',
  documentTypes: ['product'],

  migrate: {
    document(doc) {
      if (!('genre' in doc)) {
        return
      }

      return at('genre', unset())
    },
  },
})
