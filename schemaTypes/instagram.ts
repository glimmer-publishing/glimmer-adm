import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'instagram',
  title: 'Instagram пости',
  type: 'document',
  fields: [
    defineField({
      name: 'posts',
      title: 'Пости Instagram',
      type: 'array',
      of: [
        defineField({
          type: 'object',
          name: 'post',
          title: 'Пост',
          fields: [
            defineField({
              name: 'image',
              title: 'Зображення',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Альтернативний текст',
                  type: 'string',
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Посилання на пост',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({
                  scheme: ['https'],
                }),
            }),
          ],
          preview: {
            select: {
              media: 'image',
              subtitle: 'image.alt',
              title: 'url',
            },
            prepare({media, subtitle, title}) {
              return {
                media,
                title: title ? `Посилання: ${title}` : 'Без посилання',
                subtitle: subtitle || 'Без alt тексту',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.max(4).required(),
    }),
  ],
  preview: {
    select: {
      media: 'posts[0].image',
      _id: '_id',
      _createdAt: '_createdAt',
    },
    prepare({media, _id, _createdAt}) {
      const date = _createdAt ? new Date(_createdAt).toLocaleDateString() : ''
      return {
        title: `Instagram пости (${_id.slice(-4)})`,
        subtitle: date,
        media,
      }
    },
  },
})
