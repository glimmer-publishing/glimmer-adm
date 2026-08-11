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
      title: 'Жанр (застаріле)',
      description:
        'Застаріле поле, залишене для сумісності під час міграції. Використовуйте поле "Жанри" нижче.',
      type: 'reference',
      to: [{type: 'genre'}],
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
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: 'manualRecommendations',
      title: 'Рекомендовані товари (вручну)',
      description:
        'Товари, що показуватимуться як рекомендовані для цієї книги (на сторінці товару та в кошику), з пріоритетом над автоматичними рекомендаціями за жанром.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'product'}],
          // Weak on purpose: a curated pick is a merchandising hint, not a
          // dependency. A strong reference would make Sanity refuse to
          // unpublish or delete any product that some other product happens to
          // recommend, and there is no reverse view to find those referrers.
          // The storefront already drops picks that no longer resolve.
          weak: true,
          options: {
            // Keep the product being edited out of its own picker. The id is
            // compared in both its published and draft form, since either may
            // be what the reference would resolve to.
            filter: ({document}) => {
              const id = document?._id?.replace(/^drafts\./, '') ?? ''
              return {
                filter: '_id != $id && _id != $draftId',
                params: {id, draftId: `drafts.${id}`},
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.unique().custom((refs, context) => {
          const id = context.document?._id?.replace(/^drafts\./, '')
          const hasSelfReference = ((refs ?? []) as Array<{_ref?: string}>).some(
            (ref) => ref._ref?.replace(/^drafts\./, '') === id
          )
          return hasSelfReference ? 'Товар не може бути рекомендованим сам для себе' : true
        }),
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
    defineField({
      name: 'isNationalCashback',
      title: 'Національний кешбек',
      description: 'Книжка доступна для оплати карткою «Національний кешбек»',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
