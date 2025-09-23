/* eslint-disable no-console */
import path from 'node:path'
import fs from 'node:fs/promises'

import type { HostawayReviewRaw } from '../src/server/factory/hostaway-factory'
import { makeHostawayReview, makeHostawayBatch } from '../src/server/factory/hostaway-factory'
import { upsertFromHostaway } from '../src/server/factory/hostaway-prisma'

async function loadJsonMock(): Promise<HostawayReviewRaw[] | null> {
  try {
    const file = path.join(process.cwd(), 'src', 'data', 'hostaway-mock.json')
    const buf = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(buf)
    if (Array.isArray(data)) return data as HostawayReviewRaw[]
    return null
  } catch {
    return null
  }
}

async function main() {
  // 1) Try to seed from JSON (exact real-world shape)
  const fromJson = await loadJsonMock()

  // 2) Otherwise, seed from factory (exact example by default + a few variants)
  const seedData: HostawayReviewRaw[] =
    fromJson ??
    [
      makeHostawayReview(), // your exact example
      ...makeHostawayBatch(3, (i) => ({
        id: 8000 + i,
        type: i % 2 ? 'guest-to-host' : 'host-to-guest',
        rating: i % 2 ? 4.5 : null,
        submittedAt: `2020-09-${String(10 + i).padStart(2, '0')} 12:00:00`,
        listingName: i % 2 ? 'Old Street Flat' : '2B N1 A - 29 Shoreditch Heights',
        publicReview:
          i % 2
            ? 'Great stay overall. Check-in was easy.'
            : 'Left the place spotless and was very responsive.',
      })),
    ]

  let ok = 0
  for (const raw of seedData) {
    await upsertFromHostaway(raw)
    ok++
  }
  console.log(`Seeded ${ok} Hostaway review(s).`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
