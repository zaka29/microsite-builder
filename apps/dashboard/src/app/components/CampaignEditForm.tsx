'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {Button} from './ui/button'
import {Input} from './ui/input'
import {Label} from './ui/label'
import {Textarea} from './ui/textarea'
import {Switch} from './ui/switch'
import {ProductSelector} from './ProductSelector'
import {ImageUpload} from './ImageUpload'

interface Campaign {
  _id: string
  title: string
  slug: {current: string}
  description?: string
  heroImage?: {
    asset?: {
      _id: string
      url: string
    }
  }
  products?: Array<{
    _key: string
    shopifyProductId: {
      id: string
      title: string
    }
    title?: string
  }>
  isPublished?: boolean
}

interface CampaignEditFormProps {
  campaign: Campaign
}

export function CampaignEditForm({campaign}: CampaignEditFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(campaign.title)
  const [slug, setSlug] = useState(campaign.slug.current)
  const [description, setDescription] = useState(campaign.description || '')
  const [heroImage, setHeroImage] = useState<{
    asset: {_ref: string; url?: string}
  } | null>(
    campaign.heroImage?.asset
      ? {
          asset: {
            _ref: campaign.heroImage.asset._id,
            url: campaign.heroImage.asset.url,
          },
        }
      : null,
  )
  const [products, setProducts] = useState(campaign.products || [])
  const [isPublished, setIsPublished] = useState(campaign.isPublished || false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a campaign title')
      return
    }

    if (!slug.trim()) {
      toast.error('Please enter a slug')
      return
    }

    if (products.length === 0) {
      toast.error('Please add at least one product')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: campaign._id,
          title,
          slug,
          description,
          heroImage,
          products,
          isPublished,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update campaign')
      }

      toast.success('Campaign updated successfully!')
      router.push('/campaigns')
    } catch (error) {
      console.error('Failed to save campaign:', error)
      toast.error('Failed to update campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Sale 2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g., summer-sale-2026"
              required
            />
            <p className="text-xs text-muted-foreground">
              This will be the URL path: /microsites/{slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter campaign description..."
              rows={4}
            />
          </div>

          <ImageUpload value={heroImage} onChange={setHeroImage} label="Hero Image" />

          <ProductSelector selectedProducts={products} onChange={setProducts} />

          <div className="flex items-center justify-between rounded-lg border border-input p-4">
            <div className="space-y-0.5">
              <Label htmlFor="published">Publish Campaign</Label>
              <p className="text-sm text-muted-foreground">
                Make this campaign visible on the microsite
              </p>
            </div>
            <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/campaigns')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
