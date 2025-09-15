import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homepageBanner',
  title: 'Банер для головної сторінки',
  type: 'document',
  fields: [
    defineField({
      name: 'imageSmall',
      title: 'Зображення (640x536)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageLarge',
      title: 'Зображення (1160x640)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Посилання (URL, опціонально)',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'showOnCatalog',
      title: 'Показувати на сторінці каталогу',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'imageCatalog',
      title: 'Зображення для каталогу (480x1238)',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({parent}: {parent: any}) => !parent?.showOnCatalog,
      validation: (Rule) =>
        Rule.custom((image, context) => {
          const p = context.parent as any
          if (p?.showOnCatalog && !image) {
            return 'Завантажте зображення для каталогу'
          }
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Порядок відображення',
      type: 'number',
      description: 'Визначає черговість відображення банерів',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'link',
      media: 'imageSmall',
      order: 'order',
    },
    prepare({title, media, order}) {
      return {
        title: title || `Баннер ${order}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'За порядком',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
