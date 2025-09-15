import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'promocode',
  title: 'Промокоди',
  type: 'document',
  fields: [
    defineField({
      name: 'code',
      title: 'Код промокоду',
      type: 'string',
      description: 'Код, який користувач вводить для отримання знижки',
      validation: (Rule) => Rule.required().min(3).max(50),
    }),
    defineField({
      name: 'discountPercent',
      title: 'Знижка (%)',
      type: 'number',
      description: 'Відсоток знижки від 1 до 100',
      validation: (Rule) => Rule.required().min(1).max(100).error('Знижка має бути від 1% до 100%'),
    }),
    defineField({
      name: 'expirationDate',
      title: 'Термін дії',
      description: 'Дата та час, коли промокод перестає діяти',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishers',
      title: 'Видавництва',
      description: 'Видавництва, на які поширюється цей промокод',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'publisher'}]}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
