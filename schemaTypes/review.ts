import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'review',
  title: 'Відгук',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Дата відгуку',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: "Ім'я",
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Рейтинг',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).required(),
    }),
    defineField({
      name: 'text',
      title: 'Текст відгуку',
      type: 'text',
      rows: 4,
    }),
  ],
})
