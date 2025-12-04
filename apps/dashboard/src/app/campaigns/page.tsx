import {sanity} from '../libs/sanity'
import Link from 'next/link'

export default async function CampaignsPage() {
  const campaigns = await sanity.fetch(`*[_type == "micrositeCampaign"]`)

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Campaigns</h1>

      <Link
        href="/campaigns/new"
        className="inline-block mt-4 border border-amber-400 px-4 py-2 rounded text-amber-700 hover:bg-amber-100"
      >
        Create Campaign
      </Link>

      <ul className="mt-8 space-y-4">
        {campaigns.map((c) => (
          <li key={c._id} className="border p-4 rounded">
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm text-gray-500">{c.slug?.current}</div>
            <Link href={`/campaigns/${c._id}`} className="text-blue-500 underline">
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
