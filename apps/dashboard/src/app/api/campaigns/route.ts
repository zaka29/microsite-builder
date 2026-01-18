import {sanity} from '../../libs/sanity'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const doc = {
      _type: 'micrositeCampaign',
      _id: data.id ?? `campaign-${crypto.randomUUID()}`,
      title: data.title,
      slug: {_type: 'slug', current: data.slug},
      description: data.description,
      heroImage: data.heroImage,
      products: data.products,
      isPublished: data.isPublished ?? false,
    }

    const result = await sanity.createOrReplace(doc)
    return Response.json(result)
  } catch (error) {
    console.error('Campaign API error:', error)
    return Response.json({error: 'Failed to save campaign'}, {status: 500})
  }
}
