'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {Button} from '../../../components/ui/button'
import {Input} from '../../../components/ui/input'
import {Label} from '../../../components/ui/label'
import {Textarea} from '../../../components/ui/textarea'
import {Switch} from '../../../components/ui/switch'
import {ProductSelector} from '../../../components/ProductSelector'
import {ImageUpload} from '../../../components/ImageUpload'

interface SelectedProduct {
  _key: string
  shopifyProductId: {
    id: string
    title: string
  }
  title?: string
}

export default function CampaignForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [heroImage, setHeroImage] = useState<{asset: {_ref: string}} | null>(null)
  const [products, setProducts] = useState<SelectedProduct[]>([])
  const [isPublished, setIsPublished] = useState(false)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    // Auto-generate slug if it hasn't been manually edited
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

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
          title,
          slug,
          description,
          heroImage,
          products,
          isPublished,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create campaign')
      }

      toast.success('Campaign created successfully!')
      router.push('/campaigns')
    } catch (error) {
      console.error('Failed to save campaign:', error)
      toast.error('Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Campaign</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
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
              {loading ? 'Creating...' : 'Create Campaign'}
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
