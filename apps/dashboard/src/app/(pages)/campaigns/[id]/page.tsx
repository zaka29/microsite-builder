import {sanity} from '../../../libs/sanity'
import {CampaignEditForm} from '../../../components/CampaignEditForm'

interface PageProps {
  params: Promise<{id: string}>
}

export default async function EditCampaignPage({params}: PageProps) {
  const {id} = await params

  // Fetch campaign data
  const campaign = await sanity.fetch(
    `*[_type == "micrositeCampaign" && _id == $id][0]{
      _id,
      title,
      slug,
      description,
      heroImage{
        asset->{
          _id,
          url
        }
      },
      products,
      isPublished
    }`,
    {id},
  )

  if (!campaign) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Campaign not found</h1>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return <CampaignEditForm campaign={campaign} />
}
