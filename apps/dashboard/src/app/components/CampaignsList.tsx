import Link from 'next/link'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from './ui/card'
import {Badge} from './ui/badge'
import {Button} from './ui/button'
import {Edit, Plus} from 'lucide-react'

interface Campaign {
  _id: string
  title: string
  slug?: {
    current: string
  }
  description?: string
  isPublished?: boolean
  products?: Array<{_key: string}>
}

interface CampaignsListProps {
  campaigns: Campaign[]
}

export function CampaignsList({campaigns}: CampaignsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <p className="text-muted-foreground">Manage your microsite campaigns</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <Button asChild variant="outline">
              <Link href="/campaigns/new">Create your first campaign</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{campaign.title}</CardTitle>
                    <CardDescription>/{campaign.slug?.current}</CardDescription>
                  </div>
                  <Badge variant={campaign.isPublished ? 'success' : 'secondary'}>
                    {campaign.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {campaign.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {campaign.products?.length || 0} product
                      {campaign.products?.length !== 1 ? 's' : ''}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/campaigns/${campaign._id}`}>
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
