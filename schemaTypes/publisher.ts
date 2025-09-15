import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'publisher',
  title: 'Видавництва',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Назва видавництва',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
})
