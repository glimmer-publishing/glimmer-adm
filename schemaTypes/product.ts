import {defineType, defineField} from 'sanity'
import FeatureWithValueInput from '../components/FeatureValueInput'

export default defineType({
  name: 'product',
  title: 'Книги',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Категорія',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'genre',
      title: 'Жанр',
      type: 'reference',
      to: [{type: 'genre'}],
    }),
    defineField({
      name: 'title',
      title: 'Назва книги',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Автор',
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
      name: 'price',
      title: 'Повна ціна',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'discountPrice',
      title: 'Ціна зі знижкою',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'description',
      title: 'Опис',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Галерея зображень',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'bookScreens',
      title: 'Скріншоти книги',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'reviews',
      title: 'Відгуки',
      type: 'array',
      of: [{type: 'review'}],
    }),
    defineField({
      name: 'status',
      title: 'Статус товару',
      type: 'string',
      options: {
        list: [
          {title: 'В наявності', value: 'inStock'},
          {title: 'Передзамовлення', value: 'preOrder'},
        ],
        layout: 'radio',
      },
      initialValue: 'inStock',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'preOrderShippingDate',
      title: 'Дата відправки (для передзамовлення)',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      hidden: ({parent}: {parent: any}) => parent?.status !== 'preOrder',
      validation: (Rule) =>
        Rule.custom((date, context) => {
          const p = context.parent as any
          if (p?.status === 'preOrder' && !date) {
            return 'Вкажіть дату відправки для передзамовлення'
          }
          return true
        }),
    }),
    defineField({
      name: 'sku',
      title: 'Код товару (SKU)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Характеристики',
      type: 'array',
      of: [
        defineField({
          name: 'featureWithValue',
          title: 'Характеристика з значенням',
          type: 'object',
          components: {
            input: FeatureWithValueInput,
          },
          fields: [
            defineField({
              name: 'feature',
              title: 'Характеристика',
              type: 'reference',
              to: [{type: 'feature'}],
              description: 'Оберіть характеристику зі списку',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Значення',
              type: 'string',
              description: 'Введіть значення або оберіть зі списку (залежно від характеристики)',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'feature.name',
              subtitle: 'value',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'isBestseller',
      title: 'Хіт продажу',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isNew',
      title: 'Новинка',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
