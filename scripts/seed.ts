/**
 * Seed the production dataset with the approved design copy.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=skXXXX npx tsx scripts/seed.ts
 *
 * Idempotent: documents are created with fixed _ids via createOrReplace,
 * so re-running overwrites them rather than producing duplicates.
 *
 * Images:
 *   - heroImage: pulled from Unsplash (placeholder per spec, replace later)
 *   - teamPhoto: Omnia Design Files/images/team.png
 *   - whyImage:  Omnia Design Files/images/why-stretch.png
 */
import {createClient} from '@sanity/client'
import {randomBytes} from 'node:crypto'
import {createReadStream, readFileSync, existsSync} from 'node:fs'
import path from 'node:path'

const PROJECT_ID = 'ksx13wmz'
const DATASET = 'production'
const API_VERSION = '2024-10-01'

/** Load .env.local (preferred) then .env into process.env without overwriting existing values. */
function loadDotenv() {
  for (const filename of ['.env.local', '.env']) {
    const filePath = path.resolve(process.cwd(), filename)
    if (!existsSync(filePath)) continue
    const text = readFileSync(filePath, 'utf8')
    for (const rawLine of text.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) process.env[key] = value
    }
  }
}

loadDotenv()

const token = process.env.SANITY_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN.')
  console.error('Create a write-enabled token at https://www.sanity.io/manage,')
  console.error('then add it to .env.local (see .env.example) and re-run.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
})

const k = () => randomBytes(6).toString('hex')

type Span = {_key: string; _type: 'span'; text: string; marks: string[]}
type MarkDef = {_key: string; _type: 'link'; href: string}
type Block = {
  _key: string
  _type: 'block'
  style: string
  markDefs: MarkDef[]
  children: Span[]
}

const span = (text: string, marks: string[] = []): Span => ({
  _key: k(),
  _type: 'span',
  text,
  marks,
})

const paragraph = (text: string): Block => ({
  _key: k(),
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [span(text)],
})

const paragraphs = (texts: string[]): Block[] => texts.map(paragraph)

/** Parse `**bold**` segments into a single block with `strong` decorators. */
const boldMarkdownBlock = (text: string): Block => {
  const children: Span[] = []
  const re = /\*\*([^*]+)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      children.push(span(text.slice(lastIndex, match.index)))
    }
    children.push(span(match[1], ['strong']))
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    children.push(span(text.slice(lastIndex)))
  }
  if (children.length === 0) {
    children.push(span(''))
  }
  return {
    _key: k(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children,
  }
}

async function uploadFromFile(filePath: string) {
  console.log(`  uploading ${path.basename(filePath)}...`)
  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  console.log(`    → ${asset._id}`)
  return asset._id
}

async function uploadFromUrl(url: string, filename: string) {
  console.log(`  fetching ${filename} from ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`)
  const buf = Buffer.from(await res.arrayBuffer())
  console.log(`  uploading ${filename}...`)
  const asset = await client.assets.upload('image', buf, {filename})
  console.log(`    → ${asset._id}`)
  return asset._id
}

const imageRef = (assetId: string, alt: string) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: assetId},
  alt,
})

const designFilesDir = path.resolve(process.cwd(), 'Omnia Design Files', 'images')

async function main() {
  console.log('Uploading images...')
  const [heroAssetId, teamAssetId, whyAssetId] = await Promise.all([
    uploadFromUrl(
      'https://images.unsplash.com/photo-1509111884843-33c32e087103?w=2400&q=85',
      'hero-lake-superior.jpg',
    ),
    uploadFromFile(path.join(designFilesDir, 'team.png')),
    uploadFromFile(path.join(designFilesDir, 'why-stretch.png')),
  ])

  console.log('\nCreating documents...')

  const siteSettings = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: 'OMNIA',
    footerBrandLines: ['Omnia Wellness', '& Recovery'],
    footerTagline:
      'Whole-health physical therapy and performance care for the Twin Ports — and beyond, virtually.',
    navLinks: [
      {_key: k(), _type: 'navLink', label: 'Mission', href: '#mission'},
      {_key: k(), _type: 'navLink', label: 'Team', href: '/team'},
      {_key: k(), _type: 'navLink', label: 'Services', href: '/services'},
      {_key: k(), _type: 'navLink', label: 'Why Us', href: '#why'},
      {_key: k(), _type: 'navLink', label: 'FAQ', href: '/faq'},
      {_key: k(), _type: 'navLink', label: 'Contact', href: '/contact'},
    ],
    navCtaLabel: 'Schedule an Appointment',
    navCtaHref: '/appointment',
    footerExploreLinks: [
      {_key: k(), _type: 'footerLink', label: 'Mission', href: '#mission'},
      {_key: k(), _type: 'footerLink', label: 'Team', href: '/team'},
      {_key: k(), _type: 'footerLink', label: 'Services', href: '/services'},
      {_key: k(), _type: 'footerLink', label: 'FAQ', href: '/faq'},
      {_key: k(), _type: 'footerLink', label: 'Contact', href: '/contact'},
    ],
    phone: '(218) 499-0806',
    phoneHref: '+12184990806',
    email: 'omniatherapies@gmail.com',
    fax: '(218) 282-5828',
    addressLines: ['1308 Tower Ave', 'Superior, WI 54880'],
    serviceArea: 'Superior · Duluth · Virtual — MN & WI',
    copyrightLine: '© 2026 Omnia Wellness & Recovery',
  }

  const homePage = {
    _id: 'homePage',
    _type: 'homePage',
    title: 'Home',

    heroEyebrow: 'Superior & Duluth · In-person & Virtual',
    heroHeadingLines: [
      {_key: k(), _type: 'headingLine', highlight: 'MOVE', rest: 'BETTER.'},
      {_key: k(), _type: 'headingLine', highlight: 'RECOVER', rest: 'FASTER.'},
      {_key: k(), _type: 'headingLine', highlight: 'LIVE', rest: 'STRONGER.'},
    ],
    heroSubheading:
      'Expert orthopedic physical therapy and performance care — personalized, one-on-one, and built entirely around your goals.',
    heroImage: imageRef(heroAssetId, 'Lake Superior North Shore in autumn'),
    heroPrimaryCtaLabel: 'Book your visit',
    heroPrimaryCtaHref: '/appointment',
    heroSecondaryCtaLabel: 'Explore services',
    heroSecondaryCtaHref: '#services',

    missionEyebrow: 'Our mission',
    missionHeading: 'To help you be healthier, prevent injury, and recover — completely.',
    missionStats: [
      {_key: k(), _type: 'stat', number: '1:1', label: 'Every session'},
      {_key: k(), _type: 'stat', number: '0', label: 'Wait times'},
      {_key: k(), _type: 'stat', number: '2', label: 'Cities served'},
    ],
    missionBody: paragraphs([
      'Omnia Wellness & Recovery provides expert physical therapy in Superior and Duluth, specializing in orthopedic rehab, dry needling with electrical stimulation, and physical therapy for athletes and performance-based care.',
      'From weekend warriors to competitive athletes, we treat back pain, neck pain, sciatica, joint arthritis, and sports injuries using a hands-on approach that combines manual therapy, strength training, and movement optimization to get you back in the game.',
      'With personalized, one-on-one sessions and minimal wait times, we help you recover faster, move better, and return to work, sport, and daily life with confidence.',
    ]),

    teamEyebrow: 'Get to know your team',
    teamPhoto: imageRef(teamAssetId, 'Blake Radtke with family on a North Shore trail'),
    teamBadgeName: 'Blake Radtke',
    teamBadgeTitle: 'DPT · Movement Specialist',
    teamHeading: 'Meet Blake.',
    teamName: 'Blake Radtke, DPT',
    teamBio: paragraphs([
      "I'm a Physical Therapist based in the Twin Ports, offering hands-on care in Superior and Duluth — with virtual options for those across greater Minnesota and Wisconsin. Alongside my Doctorate in Physical Therapy, I hold an education in Biokinetics with an emphasis in Bioenergetics.",
      "That means I'm both a specialist in movement and in injury recovery and prevention — and I can also guide your nutrition and your complete wellbeing journey.",
      'The name says it: Omnia means "everything" or "all." My goal is to provide whole-health care to every person I work with — nutrition, exercise, and injury prevention and recovery, together.',
    ]),

    servicesEyebrow: 'What we offer',
    servicesHeading: 'Care for every part of you.',
    servicesIntro:
      'Virtual and in-person services, from comprehensive wellness programs to specialized physical therapy treatments — all designed to support your journey to better health.',
    servicesViewAllLabel: 'View all services',
    servicesViewAllHref: '/services',

    whyEyebrow: 'Why choose us',
    whyHeading: 'A results-driven approach, built around your goals.',
    whyImage: imageRef(whyAssetId, 'Therapist guiding a seated overhead shoulder stretch'),
    whyBody: paragraphs([
      "At Omnia Wellness & Recovery in Superior, Wisconsin, we help you move better, feel stronger, and stay pain-free. Whether you're managing chronic pain, recovering from an injury, or optimizing performance, your plan is built around you.",
    ]),
    whyList: [
      {
        _key: k(),
        _type: 'whyListItem',
        lead: 'One-on-one, every time.',
        rest: 'No double-booking, no rushing — just focused care and minimal wait times.',
      },
      {
        _key: k(),
        _type: 'whyListItem',
        lead: 'Whole-health perspective.',
        rest: 'Movement, strength, nutrition, and recovery considered together.',
      },
      {
        _key: k(),
        _type: 'whyListItem',
        lead: 'In-person or virtual.',
        rest: 'Expert care wherever you are across MN & WI.',
      },
    ],
    howCanWeHelpEyebrow: 'How can we help you?',
    howCanWeHelpCards: [
      boldMarkdownBlock(
        '**Stay active, strong, and full of life** — so you can enjoy every moment without being held back by pain or discomfort.',
      ),
      boldMarkdownBlock(
        'From personalized weightlifting protocols to injury prevention and dry needling, our services are **designed for lasting relief** and better overall wellbeing.',
      ),
      boldMarkdownBlock(
        'Virtual and in-person mobility and stability training, tailored to you — helping **reduce the risk of serious conditions** down the road.',
      ),
      boldMarkdownBlock(
        'We believe in the power of **balanced nutrition, safe exercise, and effective recovery** to support your long-term health.',
      ),
      boldMarkdownBlock(
        "We're committed to a pain-free life, so you can **sleep better, wake up energized, and live fully.**",
      ),
      boldMarkdownBlock(
        'Want to walk, run, hike, or play pickleball **without knee pain?** We can help make that possible.',
      ),
    ],

    ctaEyebrow: 'Ready when you are',
    ctaHeading: 'Start feeling like yourself again.',
    ctaBody:
      'Book a one-on-one session in Superior, Duluth, or virtually — minimal wait times, real results.',
    ctaButtonLabel: 'Schedule an appointment',
    ctaButtonHref: '/appointment',

    faqHeading: 'FAQs',
    faqs: [
      {
        _key: k(),
        _type: 'faqItem',
        question: 'What services does Omnia Wellness & Recovery offer?',
        answer: paragraphs([
          'We offer orthopedic physical therapy including dry needling with electrical stimulation, manual therapy, strength and weightlifting programs, cupping, flexibility and mobility training, and injury prevention and recovery — available both in-person and virtually.',
        ]),
      },
      {
        _key: k(),
        _type: 'faqItem',
        question: 'How do I book an appointment?',
        answer: paragraphs([
          'The easiest way is to use our online scheduler — pick a service, choose a time that works, and tell us a little about you. You can also call us at (218) 499-0806 or email omniatherapies@gmail.com.',
        ]),
      },
      {
        _key: k(),
        _type: 'faqItem',
        question: 'What is your cancellation policy?',
        answer: paragraphs([
          "We kindly ask for at least 24 hours' notice to cancel or reschedule so we can offer your spot to someone else. Late cancellations and no-shows may be subject to a fee.",
        ]),
      },
      {
        _key: k(),
        _type: 'faqItem',
        question: 'What should I wear to my appointment?',
        answer: paragraphs([
          'Wear comfortable, loose-fitting clothing you can move in — athletic wear is ideal. Depending on the area being treated, it helps to have easy access to the region (e.g. shorts for knee or hip work).',
        ]),
      },
    ],
  }

  const services: Array<{
    displayNumber: string
    icon: string
    name: string
    summary: string
  }> = [
    {
      displayNumber: '01',
      icon: 'needle',
      name: 'Dry Needling',
      summary:
        'Fine needles target specific trigger points to release tension, promote healing, and restore muscle function — ideal for chronic pain and injury recovery, paired with electrical stimulation.',
    },
    {
      displayNumber: '02',
      icon: 'hand',
      name: 'Manual Therapy',
      summary:
        'Hands-on techniques — joint mobilization, spinal and joint manipulation, and soft-tissue work — that reduce pain, restore mobility, and enhance overall physical function, tailored to your specific needs.',
    },
    {
      displayNumber: '03',
      icon: 'dumbbell',
      name: 'Strength Training',
      summary:
        "Programs built to your goals — building muscle, improving endurance, and boosting performance with proper technique and safe progression, whether you're an athlete or staying strong.",
    },
    {
      displayNumber: '04',
      icon: 'cupping',
      name: 'Cupping',
      summary:
        'Suction therapy that increases blood flow, reduces muscle tension, and promotes healing — a great option for sore muscles, back pain, and sports-related injuries.',
    },
    {
      displayNumber: '05',
      icon: 'mobility',
      name: 'Flexibility & Mobility',
      summary:
        'Targeted programs that improve range of motion, joint health, and movement quality — so you move more easily and efficiently while reducing injury risk.',
    },
    {
      displayNumber: '06',
      icon: 'recovery',
      name: 'Injury Prevention & Recovery',
      summary:
        'Strengthen vulnerable areas to prevent injury, plus personalized recovery plans that rebuild strength and mobility — ensuring a smooth, confident return to your activities.',
    },
    {
      displayNumber: '07',
      icon: 'ultrasound',
      name: 'Diagnostic Ultrasound',
      summary:
        'Real-time, in-clinic imaging that looks inside an injury — visualizing muscles, tendons, and joints to pinpoint the problem and guide a precise treatment plan. No referral or radiation.',
    },
    {
      displayNumber: '08',
      icon: 'athlete',
      name: 'Physical Therapy for Athletes',
      summary:
        'Sports physical therapy for athletes at every level — rehabbing injuries, rebuilding strength and explosive power, and training sport-specific movement so you return to play safely and perform at your peak.',
    },
    {
      displayNumber: '09',
      icon: 'manipulation',
      name: 'Manipulation Therapy',
      summary:
        'Precise, high-velocity adjustments that restore motion to restricted spinal and peripheral joints — relieving pain, easing stiffness, and improving alignment, paired with movement retraining so results last.',
    },
  ]

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const servicesPage = {
    _id: 'servicesPage',
    _type: 'servicesPage',
    title: 'Services',
    pageHeading: 'Care for every part of you.',
    intro: paragraphs([
      'Virtual and in-person services, from comprehensive wellness programs to specialized physical therapy treatments — all designed to support your journey to better health.',
    ]),
    services: services.map((s) => ({
      _key: k(),
      _type: 'service',
      icon: s.icon,
      displayNumber: s.displayNumber,
      name: s.name,
      slug: {_type: 'slug', current: slugify(s.name)},
      summary: s.summary,
    })),
  }

  const appointmentPage = {
    _id: 'appointmentPage',
    _type: 'appointmentPage',
    title: 'Appointments',
    pageHeading: 'Book your visit.',
    backLinkLabel: '← Home',
    backLinkHref: '/',
    leadHeading: 'Book your visit.',
    leadBody: 'Choose a service and time that works for you — it only takes a minute.',
    reassurances: [
      {
        _key: k(),
        _type: 'reassuranceItem',
        lead: 'One-on-one care',
        rest: 'in Superior, Duluth, or virtually.',
      },
      {
        _key: k(),
        _type: 'reassuranceItem',
        lead: 'Minimal wait times',
        rest: '— get seen quickly.',
      },
      {
        _key: k(),
        _type: 'reassuranceItem',
        lead: 'Secure scheduling',
        rest: 'powered by PT Everywhere.',
      },
    ],
    launchEyebrow: 'Online scheduling',
    launchHeading: "Let's get you booked.",
    launchBody:
      "Our secure scheduler opens in a new tab — pick your service, choose a time that works, and you're set.",
    launchButtonLabel: 'Book online',
    onlineBookingUrl: 'https://app.pteverywhere.com/omnia/bookingonline',
    launchNote: 'Powered by PT Everywhere · Secure scheduling',
  }

  const contactPage = {
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Contact',
    pageHeading: 'Get in touch',
    intro: paragraphs([
      "Questions, insurance, or ready to book — we'd love to hear from you. The fastest way to get started is to schedule an appointment.",
    ]),
    clinicName: 'Omnia Wellness & Recovery',
    addressLines: ['1308 Tower Ave', 'Superior, WI 54880'],
    phone: '(218) 499-0806',
    fax: '(218) 282-5828',
    email: 'omniatherapies@gmail.com',
    hours: [
      {
        _key: k(),
        _type: 'hoursRow',
        label: 'Hours',
        hours: 'Mon–Fri · By appointment, In-person & virtual',
      },
    ],
    servingArea: 'Superior · Duluth · greater MN & WI',
    mapEmbedUrl:
      'https://www.google.com/maps?q=1308%20Tower%20Ave,%20Superior,%20WI%2054880&output=embed',
    formNote: 'Prefer to talk? Call us at (218) 499-0806 — Mon–Fri.',
  }

  const docs = [siteSettings, homePage, servicesPage, appointmentPage, contactPage]

  for (const doc of docs) {
    console.log(`  createOrReplace ${doc._id}...`)
    await client.createOrReplace(doc as any)
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
