import {sanity} from '../libs/sanity'
import {CampaignsList} from '../components/CampaignsList'
import Link from 'next/link'

export default async function Home() {
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Microsite Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your microsite campaigns.{' '}
            <Link href="/campaigns" className="text-primary hover:underline">
              View all campaigns →
            </Link>
          </p>
        </div>
        <CampaignsList campaigns={campaigns} />
      </div>
    </div>
  )
}
