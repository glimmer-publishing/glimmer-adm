import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Категорії',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Назва категорії',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Порядок відображення',
      type: 'number',
      description: 'Менші числа відображаються раніше',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'genres',
      title: 'Жанри',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'genre'}],
        },
      ],
      description: 'Список жанрів (необов’язкове поле)',
    }),
  ],
})
