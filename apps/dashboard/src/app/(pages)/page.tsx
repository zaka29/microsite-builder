import {sanity} from '../libs/sanity'
import {CampaignsList} from '../components/CampaignsList'

export default async function Home() {
  const campaigns = await sanity.fetch(`*[_type == "micrositeCampaign"]`)

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <CampaignsList campaigns={campaigns} />
    </div>
  )
}
