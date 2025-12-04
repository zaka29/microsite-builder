'use client'

import {useState} from 'react'
import {Button} from '../../components/ui/button'
export default function CampaignForm({campaign}) {
  const [title, setTitle] = useState(campaign?.title || '')
  const [slug, setSlug] = useState(campaign?.slug?.current || '')
  const [description, setDescription] = useState(campaign?.description || '')

  async function handleSubmit() {
    await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        id: campaign?._id,
        title,
        slug,
        description,
      }),
    })

    alert('Saved!')
  }

  return (
    <div className="space-y-4">
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        className="input"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Slug"
      />
      <textarea
        className="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button variant="default" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  )
}
