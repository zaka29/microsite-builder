import Link from 'next/link'

interface Campaign {
  _id: string
  title: string
  slug?: {
    current: string
  }
}

interface CampaignsListProps {
  campaigns: Campaign[]
}

export function CampaignsList({campaigns}: CampaignsListProps) {
  return (
    <>
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
    </>
  )
}
