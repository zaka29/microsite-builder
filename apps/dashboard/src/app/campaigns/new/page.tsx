'use client'

import {useState} from 'react'
import {Button} from '../../components/ui/button'


export default function CampaignForm({}) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')

  async function handleSubmit() {
    await fetch('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        title,
        slug,
        description,
      }),
    })

    alert('Saved!')
  }

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="min-w-1/3 flex flex-col gap-[8px] row-start-2 items-center sm:items-start">
        <h1 className='text-xl font-semibold'>Add new campaign</h1>
        <div className="space-y-6 flex flex-col bg-gray-800 p-4 w-full">
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
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button variant="default" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>

  )
}
