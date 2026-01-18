'use client'

import {useState} from 'react'
import {Upload, X} from 'lucide-react'
import {Button} from './ui/button'
import {Label} from './ui/label'
import Image from 'next/image'

interface ImageUploadProps {
  value?: {
    asset?: {
      _ref?: string
      url?: string
    }
  } | null
  onChange: (image: {asset: {_ref: string; url?: string}} | null) => void
  label?: string
}

export function ImageUpload({value, onChange, label = 'Hero Image'}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.asset?.url || null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      // Create FormData for upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload to Sanity via API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      // Set preview and update form
      setPreviewUrl(data.url)
      onChange({
        asset: {
          _ref: data.assetId,
          url: data.url,
        },
      })
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {previewUrl ? (
        <div className="relative rounded-lg border border-input overflow-hidden">
          <Image
            src={previewUrl}
            alt="Preview"
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <label
            htmlFor="image-upload"
            className="flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-input hover:border-ring transition-colors"
          >
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </p>
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  )
}
