import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'glimmer-backend',

  projectId: 'us9jz0mn',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Контент')
          .items([
            S.listItem()
              .title('Hero Баннери')
              .child(S.documentList().title('Hero Баннери').filter('_type == "heroBanner"')),
            S.listItem()
              .title('Баннери на головній сторінці')
              .child(
                S.documentList()
                  .title('Баннери на головній сторінці')
                  .filter('_type == "homepageBanner"'),
              ),
            S.listItem()
              .title('Пости instagram')
              .child(
                S.editor().id('instagram').schemaType('instagram').documentId('instaSingleton'),
              ),
            S.divider(),
            S.listItem()
              .title('Товари')
              .child(S.documentList().title('Товари').filter('_type == "product"')),
            S.listItem()
              .title('Видавництва')
              .child(S.documentList().title('Видавництва').filter('_type == "publisher"')),
            S.listItem()
              .title('Жанри')
              .child(S.documentList().title('Жанри').filter('_type == "genre"')),
            S.listItem()
              .title('Категорії')
              .child(S.documentList().title('Категорії').filter('_type == "category"')),
            S.listItem()
              .title('Характеристики товарів')
              .child(S.documentList().title('Характеристики').filter('_type == "feature"')),
            S.listItem()
              .title('Промокоди')
              .child(S.documentList().title('Промокоди').filter('_type == "promocode"')),
          ]),
    }),

    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
