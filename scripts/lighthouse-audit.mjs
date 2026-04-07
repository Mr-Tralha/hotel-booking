/**
 * Lighthouse CI measurement script.
 *
 * Prerequisites:
 *   npm install -g @lhci/cli   (or npx @lhci/cli)
 *
 * Usage:
 *   1. Build the project:  npm run build
 *   2. Start production:   npm start
 *   3. In another terminal: node scripts/lighthouse-audit.mjs
 *
 * This script runs Lighthouse against the key pages and outputs results.
 */

import { execSync } from 'node:child_process'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const PAGES = [
  { name: 'Home', url: '/' },
  { name: 'Search', url: '/search?destination=Rio+de+Janeiro&checkIn=2025-08-01&checkOut=2025-08-05&adults=2&children=0&rooms=1' },
  { name: 'Hotel Detail', url: '/hotel/1?checkIn=2025-08-01&checkOut=2025-08-05' },
  { name: 'Checkout', url: '/checkout' },
]

const THRESHOLDS = {
  performance: 80,
  accessibility: 90,
  'best-practices': 90,
  seo: 90,
}

console.log('Lighthouse Performance Audit')
console.log('='.repeat(60))
console.log(`Base URL: ${BASE_URL}\n`)

let allPassed = true

for (const page of PAGES) {
  const fullUrl = `${BASE_URL}${page.url}`
  console.log(`--- ${page.name} (${page.url}) ---`)

  try {
    const result = execSync(
      `npx -y lighthouse "${fullUrl}" --output=json --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo --quiet`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024, timeout: 120_000 }
    )

    const report = JSON.parse(result)
    const categories = report.categories

    for (const [key, threshold] of Object.entries(THRESHOLDS)) {
      const score = Math.round((categories[key]?.score ?? 0) * 100)
      const status = score >= threshold ? 'PASS' : 'FAIL'
      const icon = score >= threshold ? '✓' : '✗'
      console.log(`  ${icon} ${key}: ${score} (threshold: ${threshold}) [${status}]`)
      if (score < threshold) allPassed = false
    }

    // Extract key metrics
    const audits = report.audits
    const metrics = [
      ['FCP', audits['first-contentful-paint']?.displayValue],
      ['LCP', audits['largest-contentful-paint']?.displayValue],
      ['TBT', audits['total-blocking-time']?.displayValue],
      ['CLS', audits['cumulative-layout-shift']?.displayValue],
      ['SI', audits['speed-index']?.displayValue],
    ]
    console.log(`  Metrics: ${metrics.map(([k, v]) => `${k}=${v ?? 'N/A'}`).join(', ')}`)
  } catch (err) {
    console.log(`  ✗ Error running Lighthouse: ${err.message}`)
    allPassed = false
  }
  console.log()
}

console.log('='.repeat(60))
console.log(allPassed ? '✓ All pages passed thresholds' : '✗ Some pages failed thresholds')
process.exit(allPassed ? 0 : 1)
