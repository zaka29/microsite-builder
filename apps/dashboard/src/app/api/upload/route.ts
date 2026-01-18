import {sanity} from '../../libs/sanity'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json({error: 'No file provided'}, {status: 400})
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Sanity
    const asset = await sanity.assets.upload('image', buffer, {
      filename: file.name,
    })

    return Response.json({
      assetId: asset._id,
      url: asset.url,
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return Response.json({error: 'Upload failed'}, {status: 500})
  }
}
