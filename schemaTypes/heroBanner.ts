import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'heroBanner',
  title: 'Слайд для баннера на головній сторінці',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Основний заголовок слайду',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Текст під слоганом',
      type: 'string',
    }),
    defineField({
      name: 'imageMob',
      title: 'Картинка для слайду на мобільному',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageTab',
      title: 'Картинка для слайду на планшеті',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageDesk',
      title: "Картинка для слайду на комп'ютері",
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'button',
      title: 'Кнопка',
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Текст кнопки',
          type: 'string',
          validation: (rule) => rule.required(),
        },
        {
          name: 'link',
          title: 'Посилання (URL)',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }).required(),
        },
        {
          name: 'position',
          title: 'Положення кнопки',
          type: 'string',
          options: {
            list: [
              {title: 'Зліва знизу', value: 'bottomLeft'},
              {title: 'Справа зверху', value: 'topRight'},
              {title: 'Справа знизу', value: 'bottomRight'},
            ],
            layout: 'radio',
          },
          initialValue: 'bottomLeft',
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Порядок слайду',
      type: 'number',
      description: 'Визначає черговість відображення слайдів (ціле число, від 1)',
      validation: (rule) => rule.required().integer().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
  orderings: [
    {
      title: 'За порядком слайдів',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'За назвою',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
