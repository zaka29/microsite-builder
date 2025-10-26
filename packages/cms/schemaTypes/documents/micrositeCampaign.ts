import {defineType, defineField} from 'sanity'

export const micrositeCampaign = defineType({
  name: 'micrositeCampaign',
  title: 'Microsite Campaign',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign Title',
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
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'products',
      title: 'Linked Shopify Products',
      type: 'array',
      of: [
        defineField({
          name: 'product',
          title: 'Product',
          type: 'object',
          fields: [
            {
              name: 'shopifyProductId',
              title: 'Shopify Product ID',
              type: 'string',
            },
            {
              name: 'title',
              title: 'Product Title (optional override)',
              type: 'string',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'isPublished',
      title: 'Published',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
