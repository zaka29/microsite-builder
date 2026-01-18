import {sanity} from '../../libs/sanity'
import {CampaignsList} from '../../components/CampaignsList'

export default async function CampaignsPage() {
  const campaigns = await sanity.fetch(`*[_type == "micrositeCampaign"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    description,
    isPublished,
    products
  }`)

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <CampaignsList campaigns={campaigns} />
      </div>
    </div>
  )
}
