<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import landingVideo from './assets/WWVA0186.mp4'
import teamPhoto from './assets/download (1).png'
import heroPoster from './assets/hero.png'

const loading = ref(true)
const cutPhase = ref(false)
const servicePage = ref(0)
const selectedPriceCategory = ref(0)
const mobileMenuOpen = ref(false)
const activeSection = ref('start')
const now = ref(new Date())
let servicesTimer = null
let revealObserver = null
let clockTimer = null
let resizeHandler = null
let scrollHandler = null

const navItems = [
  { id: 'start', label: 'Start', href: '#' },
  { id: 'ueber-uns', label: 'Über Uns', href: '#ueber-uns' },
  { id: 'leistungen', label: 'Leistungen', href: '#leistungen' },
  { id: 'preisliste', label: 'Preisliste', href: '#preisliste' },
  { id: 'team', label: 'Team', href: '#team' },
  { id: 'kontakt', label: 'Kontakt', href: '#kontakt' },
]

const services = [
  { icon: 'SN', title: 'Haarschnitt & Styling', lines: ['Waschen, Schneiden und Föhnen', 'Cut & Go, Pony und schnelles Fresh-up'], price: 'ab CHF 35' },
  { icon: 'CL', title: 'Coloration', lines: ['Ansatzfarbe, Tönung und Ganzkopf-Farbe', 'Farbservices für frische, elegante Looks'], price: 'ab CHF 62' },
  { icon: 'BL', title: 'Blondierung', lines: ['Blondierung mit oder ohne Schneiden', 'Ideal für klare, helle Ergebnisse'], price: 'ab CHF 82' },
  { icon: 'ME', title: 'Strähnen & Balayage', lines: ['Mèches, Folienmèches, Highlights', 'Balayage für weiche, natürliche Verläufe'], price: 'ab CHF 95' },
  { icon: 'GL', title: 'Glätten & Dauerwelle', lines: ['Haare glätten oder in Form bringen', 'Von smooth bis voluminöse Welle'], price: 'ab CHF 55' },
  { icon: 'BE', title: 'Beauty Extras', lines: ['Gesichtsbehandlung, Augenbrauen und Wimpern', 'Färben, zupfen, Waxing und Pflege'], price: 'ab CHF 15' },
]

const priceCategories = [
  {
    title: 'Damen - Haarschnitte & Styling',
    groups: [
      { title: 'Waschen, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '1 Std', price: 'CHF 80' }, { label: 'mittel', duration: '1 Std', price: 'CHF 80' }, { label: 'lang', duration: '1 Std 15 min', price: 'CHF 88' }] },
      { title: 'Waschen & Schneiden', items: [{ label: 'kurz', duration: '30 min', price: 'CHF 42' }, { label: 'mittel', duration: '30 min', price: 'CHF 42' }, { label: 'lang', duration: '30 min', price: 'CHF 42' }] },
      { title: 'Waschen & Föhnen', items: [{ label: 'kurz', duration: '30 min', price: 'CHF 45' }, { label: 'mittel', duration: '40 min', price: 'CHF 45' }, { label: 'lang', duration: '45 min', price: 'CHF 55' }] },
      { title: 'Cut & Go', items: [{ label: 'kurz', duration: '20 min', price: 'CHF 35' }, { label: 'mittel', duration: '20 min', price: 'CHF 35' }, { label: 'lang', duration: '20 min', price: 'CHF 35' }] },
      { title: 'Weitere Stylings', items: [{ label: 'Haarschnitt', duration: '20 min', price: 'CHF 35' }, { label: 'Pony schneiden', duration: '10 min', price: 'CHF 15' }, { label: 'Haare glätten', duration: '50 min', price: 'CHF 55' }] },
      { title: 'Dauerwelle', items: [{ label: 'kurz', duration: '1 Std 30 min', price: 'CHF 160' }, { label: 'mittel', duration: '1 Std 30 min', price: 'CHF 170' }, { label: 'lang', duration: '1 Std 30 min', price: 'CHF 190' }] },
    ],
  },
  {
    title: 'Damen - Farbe & Coloration',
    groups: [
      { title: 'Färben ganzer Kopf, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 155' }, { label: 'mittel', duration: '2 Std', price: 'CHF 165' }, { label: 'lang', duration: '2 Std', price: 'CHF 185' }] },
      { title: 'Färben ganzer Kopf & Föhnen', items: [{ label: 'kurz', duration: '1 Std 30 min', price: 'CHF 120' }, { label: 'mittel', duration: '1 Std 30 min', price: 'CHF 130' }, { label: 'lang', duration: '1 Std 30 min', price: 'CHF 150' }] },
      { title: 'Färben ganzer Kopf', items: [{ label: 'kurz', duration: '1 Std 10 min', price: 'CHF 95' }, { label: 'mittel', duration: '1 Std 10 min', price: 'CHF 105' }, { label: 'lang', duration: '1 Std 10 min', price: 'CHF 115' }] },
      { title: 'Ansatzfarbe, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 125' }, { label: 'mittel', duration: '2 Std', price: 'CHF 125' }, { label: 'lang', duration: '2 Std', price: 'CHF 135' }] },
      { title: 'Ansatzfarbe & Föhnen', items: [{ label: 'kurz', duration: '1 Std 30 min', price: 'CHF 90' }, { label: 'mittel', duration: '1 Std 30 min', price: 'CHF 90' }, { label: 'lang', duration: '1 Std 30 min', price: 'CHF 100' }] },
      { title: 'Ansatzfarbe', items: [{ label: 'kurz', duration: '1 Std 10 min', price: 'CHF 62' }, { label: 'mittel', duration: '1 Std 10 min', price: 'CHF 72' }, { label: 'lang', duration: '1 Std 10 min', price: 'CHF 62' }] },
      { title: 'Tönung, Schnitt & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 125' }, { label: 'mittel', duration: '2 Std', price: 'CHF 125' }, { label: 'lang', duration: '2 Std', price: 'CHF 135' }] },
      { title: 'Tönung & Föhnen', items: [{ label: 'kurz', duration: '1 Std 30 min', price: 'CHF 90' }, { label: 'mittel', duration: '1 Std 30 min', price: 'CHF 90' }, { label: 'lang', duration: '1 Std 30 min', price: 'CHF 100' }] },
    ],
  },
  {
    title: 'Blondierung & Strähnen',
    groups: [
      { title: 'Blondierung, Schnitt & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 155' }, { label: 'mittel', duration: '2 Std', price: 'CHF 165' }, { label: 'lang', duration: '2 Std', price: 'CHF 185' }] },
      { title: 'Blondierung & Föhnen', items: [{ label: 'kurz', duration: '1 Std 30 min', price: 'CHF 120' }, { label: 'mittel', duration: '1 Std 30 min', price: 'CHF 130' }, { label: 'lang', duration: '1 Std 30 min', price: 'CHF 150' }] },
      { title: 'Blondierung', items: [{ label: 'kurz', duration: '1 Std 10 min', price: 'CHF 82' }, { label: 'mittel', duration: '1 Std 10 min', price: 'CHF 92' }, { label: 'lang', duration: '1 Std 10 min', price: 'CHF 102' }] },
      { title: 'Mèches Oberkopf, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '2 Std 30 min', price: 'CHF 168' }, { label: 'mittel', duration: '2 Std 30 min', price: 'CHF 178' }, { label: 'lang', duration: '2 Std 30 min', price: 'CHF 188' }] },
      { title: 'Mèches Oberkopf & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 133' }, { label: 'mittel', duration: '2 Std', price: 'CHF 143' }, { label: 'lang', duration: '2 Std', price: 'CHF 153' }] },
      { title: 'Mèches Oberkopf', items: [{ label: 'kurz', duration: '1 Std 40 min', price: 'CHF 95' }, { label: 'mittel', duration: '1 Std 40 min', price: 'CHF 105' }, { label: 'lang', duration: '1 Std 40 min', price: 'CHF 115' }] },
      { title: 'Ganzer Kopf, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '2 Std 30 min', price: 'CHF 293' }, { label: 'mittel', duration: '2 Std 30 min', price: 'CHF 303' }, { label: 'lang', duration: '2 Std 30 min', price: 'CHF 313' }] },
      { title: 'Ganzer Kopf & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 258' }, { label: 'mittel', duration: '2 Std', price: 'CHF 268' }, { label: 'lang', duration: '2 Std', price: 'CHF 278' }] },
      { title: 'Ganzer Kopf', items: [{ label: 'kurz', duration: '1 Std 40 min', price: 'CHF 220' }, { label: 'mittel', duration: '1 Std 40 min', price: 'CHF 230' }, { label: 'lang', duration: '1 Std 40 min', price: 'CHF 240' }] },
      { title: 'Balayage, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '2 Std 30 min', price: 'CHF 293' }, { label: 'mittel', duration: '2 Std 30 min', price: 'CHF 303' }, { label: 'lang', duration: '2 Std 30 min', price: 'CHF 313' }] },
      { title: 'Balayage & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 258' }, { label: 'mittel', duration: '2 Std', price: 'CHF 268' }, { label: 'lang', duration: '2 Std', price: 'CHF 278' }] },
      { title: 'Balayage', items: [{ label: 'kurz', duration: '1 Std 40 min', price: 'CHF 220' }, { label: 'mittel', duration: '1 Std 40 min', price: 'CHF 230' }, { label: 'lang', duration: '1 Std 40 min', price: 'CHF 240' }] },
      { title: 'Folienmèches & Föhnen', items: [{ label: 'kurz', duration: '2 Std', price: 'CHF 258' }, { label: 'mittel', duration: '2 Std', price: 'CHF 268' }, { label: 'lang', duration: '2 Std', price: 'CHF 278' }] },
      { title: 'Folienmèches, Schneiden & Föhnen', items: [{ label: 'kurz', duration: '2 Std 30 min', price: 'CHF 293' }, { label: 'mittel', duration: '2 Std 30 min', price: 'CHF 303' }, { label: 'lang', duration: '2 Std 30 min', price: 'CHF 313' }] },
      { title: 'Folienmèches Oberkopf', items: [{ label: 'kurz', duration: '1 Std 40 min', price: 'CHF 95' }, { label: 'mittel', duration: '1 Std 40 min', price: 'CHF 105' }, { label: 'lang', duration: '1 Std 40 min', price: 'CHF 115' }] },
      { title: 'Folienmèches ganzer Kopf', items: [{ label: 'kurz', duration: '1 Std 40 min', price: 'CHF 220' }, { label: 'mittel', duration: '1 Std 40 min', price: 'CHF 230' }, { label: 'lang', duration: '1 Std 40 min', price: 'CHF 240' }] },
      { title: 'Highlights', items: [{ label: 'kurz', duration: '1 Std 40 min', price: 'CHF 220' }, { label: 'mittel', duration: '1 Std 40 min', price: 'CHF 230' }, { label: 'lang', duration: '1 Std 40 min', price: 'CHF 240' }] },
    ],
  },
  {
    title: 'Beauty, Männer & Kinder',
    groups: [
      { title: 'Gesichtsbehandlungen', items: [{ label: 'Reinigung', duration: '25 min', price: 'CHF 25' }, { label: 'Maske', duration: '-', price: 'CHF 25' }] },
      { title: 'Augenbrauen & Wimpern', items: [{ label: 'Augenbrauen färben & zupfen', duration: '20 min', price: 'CHF 30' }, { label: 'Augenbrauen zupfen', duration: '15 min', price: 'CHF 15' }, { label: 'Augenbrauen färben', duration: '15 min', price: 'CHF 15' }, { label: 'Wimpern färben', duration: '15 min', price: 'CHF 15' }, { label: 'Augenbrauen Waxing', duration: '15 min', price: 'CHF 15' }] },
      { title: 'Männer', items: [{ label: 'Schneiden', duration: '-', price: 'CHF 28' }, { label: 'Waschen, Schneiden & Föhnen', duration: '-', price: 'CHF 35' }, { label: 'Bart', duration: '-', price: 'CHF 20' }, { label: 'Haare und Bart', duration: '-', price: 'CHF 43' }, { label: 'Nassrasur', duration: '-', price: 'CHF 20' }, { label: 'Farbe', duration: '-', price: 'CHF 35' }, { label: 'Haarentfernen mit Wax', duration: '-', price: 'CHF 10' }] },
      { title: 'Kinder', items: [{ label: 'Kinder bis 12 Jahren', duration: '-', price: 'CHF 25' }, { label: 'Mädchen', duration: '-', price: 'CHF 20' }, { label: 'Jungen', duration: '-', price: 'CHF 20' }] },
      { title: 'VIP Men Paket', items: [{ label: 'VIP Men Paket', duration: 'inkl. Waschen, Schneiden, Bart, Augenbrauen zupfen, Wax, Gesichtsmaske, Reinigung', price: 'CHF 75' }] },
    ],
  },
]

const openingHours = [
  { day: 'Montag', shortDay: 'Mo', open: '09:00', close: '19:00', note: 'Durchgehend geöffnet' },
  { day: 'Dienstag', shortDay: 'Di', open: '09:00', close: '19:00', note: 'Durchgehend geöffnet' },
  { day: 'Mittwoch', shortDay: 'Mi', open: '09:00', close: '19:00', note: 'Durchgehend geöffnet' },
  { day: 'Donnerstag', shortDay: 'Do', open: '09:00', close: '19:00', note: 'Durchgehend geöffnet' },
  { day: 'Freitag', shortDay: 'Fr', open: '09:00', close: '19:00', note: 'Durchgehend geöffnet' },
  { day: 'Samstag', shortDay: 'Sa', open: '08:30', close: '17:00', note: 'Ideal für deinen Weekend-Look' },
  { day: 'Sonntag', shortDay: 'So', closed: true, note: 'Geschlossen' },
]

const googleRating = { score: '4.9', stars: '★★★★★', total: 93 }

const currentDayIndex = computed(() => {
  const weekday = now.value.getDay()
  return weekday === 0 ? 6 : weekday - 1
})

const todaySchedule = computed(() => openingHours[currentDayIndex.value] ?? openingHours[0])
const currentTimeInMinutes = computed(() => now.value.getHours() * 60 + now.value.getMinutes())

const isOpenNow = computed(() => {
  const schedule = todaySchedule.value
  if (!schedule || schedule.closed || !schedule.open || !schedule.close) return false
  const [openHour, openMinute] = schedule.open.split(':').map(Number)
  const [closeHour, closeMinute] = schedule.close.split(':').map(Number)
  const openingMinutes = openHour * 60 + openMinute
  const closingMinutes = closeHour * 60 + closeMinute
  return currentTimeInMinutes.value >= openingMinutes && currentTimeInMinutes.value < closingMinutes
})

const isClosingSoon = computed(() => {
  const schedule = todaySchedule.value
  if (!schedule || schedule.closed || !schedule.open || !schedule.close || !isOpenNow.value) return false
  const [closeHour, closeMinute] = schedule.close.split(':').map(Number)
  return closeHour * 60 + closeMinute - currentTimeInMinutes.value <= 60
})

const shopStatusLabel = computed(() => (isOpenNow.value ? 'Jetzt geöffnet' : 'Gerade geschlossen'))

const shopStatusDetail = computed(() => {
  const schedule = todaySchedule.value
  const nextDay = openingHours[(currentDayIndex.value + 1) % openingHours.length]
  if (!schedule) return 'Öffnungszeiten auf Anfrage'
  if (isOpenNow.value) return `Heute bis ${schedule.close} geöffnet`
  if (schedule.closed) return nextDay?.closed ? `${schedule.day}: geschlossen` : `Öffnet ${nextDay?.shortDay} um ${nextDay?.open}`
  if (currentTimeInMinutes.value < Number(schedule.open.split(':')[0]) * 60 + Number(schedule.open.split(':')[1])) {
    return `Öffnet heute um ${schedule.open}`
  }
  return nextDay?.closed ? 'Heute geschlossen' : `Öffnet ${nextDay?.shortDay} um ${nextDay?.open}`
})

const servicePages = computed(() => Math.ceil(services.length / 3))
const serviceGroups = computed(() =>
  Array.from({ length: servicePages.value }, (_, pageIndex) =>
    services.slice(pageIndex * 3, pageIndex * 3 + 3).map((service, offset) => ({
      ...service,
      slot: offset === 2 ? 'bottom' : `top-${offset + 1}`,
    })),
  ),
)

const visibleServices = computed(() => serviceGroups.value[servicePage.value] ?? [])
const currentPriceCategory = computed(() => priceCategories[selectedPriceCategory.value] ?? priceCategories[0])
const remainingPriceCategories = computed(() => Math.max(priceCategories.length - 1, 0))

const previousServices = () => {
  servicePage.value = (servicePage.value - 1 + servicePages.value) % servicePages.value
}

const nextServices = () => {
  servicePage.value = (servicePage.value + 1) % servicePages.value
}

const selectPriceCategory = (index) => {
  selectedPriceCategory.value = index
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const syncActiveSection = () => {
  if (typeof window === 'undefined') return
  const threshold = window.innerHeight * 0.35
  let current = 'start'
  for (const item of navItems) {
    if (item.id === 'start') continue
    const section = document.getElementById(item.id)
    if (section && section.getBoundingClientRect().top <= threshold) current = item.id
  }
  if (window.scrollY < 120) current = 'start'
  activeSection.value = current
}

const startServicesAutoplay = () => {
  if (servicesTimer) window.clearInterval(servicesTimer)
  servicesTimer = window.setInterval(() => {
    nextServices()
  }, 6500)
}

const setupRevealAnimations = async () => {
  await nextTick()
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            revealObserver?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
  }
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    const htmlElement = element
    if (!htmlElement.classList.contains('is-revealed')) revealObserver?.observe(htmlElement)
  })
}

onMounted(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  window.setTimeout(() => {
    cutPhase.value = true
    window.setTimeout(() => {
      loading.value = false
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }, 800)
  }, 1800)
  startServicesAutoplay()
  setupRevealAnimations()
  clockTimer = window.setInterval(() => {
    now.value = new Date()
  }, 60000)
  resizeHandler = () => {
    if (window.innerWidth > 640) closeMobileMenu()
  }
  scrollHandler = () => {
    syncActiveSection()
  }
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('scroll', scrollHandler, { passive: true })
  syncActiveSection()
})

onBeforeUnmount(() => {
  if (servicesTimer) window.clearInterval(servicesTimer)
  if (clockTimer) window.clearInterval(clockTimer)
  if (revealObserver) revealObserver.disconnect()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  document.body.style.overflow = ''
})

watch(servicePage, () => {
  setupRevealAnimations()
})

watch(mobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<template>
  <main class="site-root">
    <section v-if="loading" class="loader-wrap" :class="{ 'is-cutting': cutPhase }">
      <div class="cut-overlay" aria-hidden="true">
        <div class="cut-half cut-left"></div>
        <div class="cut-half cut-right"></div>
      </div>

      <div class="logo-build">
        <div class="scissors-wrap">
          <div class="scissors">
            <span class="blade blade-left"></span>
            <span class="blade blade-right"></span>
            <span class="pivot"></span>
            <span class="ring ring-left"></span>
            <span class="ring ring-right"></span>
            <span class="handle handle-left"></span>
            <span class="handle handle-right"></span>
          </div>
        </div>
        <div class="top-mark">
          <div class="swirl swirl-left"></div>
          <div class="top-line"></div>
          <div class="swirl swirl-right"></div>
        </div>
        <div class="flourish flourish-top"></div>
        <div class="logo-line line-title"><span>ALIS COIFFEUR</span></div>
        <div class="logo-line line-subtitle"><span>FÜR DAMEN UND HERREN</span></div>
        <div class="logo-core">
          <div class="wing wing-left"></div>
          <div class="center-seal">A</div>
          <div class="wing wing-right"></div>
        </div>
        <div class="flourish flourish-bottom"></div>
      </div>
    </section>

    <header v-if="!loading" class="nav-wrap" :class="{ 'is-mobile-open': mobileMenuOpen }">
      <div class="brand">
        <div class="brand-logo">ALIS</div>
        <div class="brand-subline">Coiffeur mit Stil</div>
      </div>
      <button
        type="button"
        class="nav-toggle"
        :class="{ 'is-active': mobileMenuOpen }"
        :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
        aria-controls="mobile-navigation"
        aria-label="Navigation umschalten"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav id="mobile-navigation" class="nav-menu" aria-label="Hauptnavigation" :class="{ 'is-open': mobileMenuOpen }">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          :class="{ 'is-active': activeSection === item.id }"
          @click="closeMobileMenu"
        >
          {{ item.label }}
        </a>
      </nav>
      <div class="nav-right">
        <a class="cta-btn" href="#kontakt" @click="closeMobileMenu">
          <span>Jetzt Kontakt</span>
          <span aria-hidden="true">-></span>
        </a>
      </div>
    </header>

    <section class="page-content" :class="{ 'is-visible': !loading }">
      <section class="landing-hero">
        <video class="bg-video" autoplay muted loop playsinline preload="metadata" :poster="heroPoster" aria-hidden="true">
          <source :src="landingVideo" type="video/mp4" />
        </video>
        <div class="bg-overlay" aria-hidden="true"></div>

        <section class="hero-content">
          <div class="hero-rating-chip" data-reveal>
            <span class="hero-rating-score">{{ googleRating.score }}</span>
            <span class="hero-rating-stars" aria-label="4.9 von 5 Sternen">{{ googleRating.stars }}</span>
            <span class="hero-rating-total">({{ googleRating.total }} Google-Bewertungen)</span>
          </div>
          <h1 class="hero-title">Mehr Style. <br /> Mehr Selbstvertrauen.</h1>
          <div class="hero-line"></div>
          <p class="hero-subtitle">Coiffeur ALIS.</p>
          <p class="hero-description">
            Damen, Herren, Farbe, Styling und Beauty an einem Ort. Modern, herzlich und direkt in
            Obfelden.
          </p>
          <div class="hero-actions">
            <a class="hero-primary-btn" href="#kontakt">Termin anfragen</a>
            <a class="hero-secondary-btn" href="tel:+41447616222">Jetzt anrufen</a>
          </div>
          <div class="hero-facts" data-reveal>
            <article class="hero-fact">
              <span>Standort</span>
              <strong>Ottenbacherstrasse 2a</strong>
            </article>
            <article class="hero-fact">
              <span>Status</span>
              <strong>{{ shopStatusDetail }}</strong>
            </article>
          </div>
        </section>
      </section>

      <section id="ueber-uns" class="about-section" data-reveal>
        <div class="about-ornament about-ornament-top" aria-hidden="true">
          <div class="about-scissors about-scissors-top">
            <svg viewBox="0 0 200 200" class="about-scissors-svg" role="presentation">
              <circle cx="60" cy="54" r="26" class="scissor-loop" />
              <circle cx="140" cy="54" r="26" class="scissor-loop" />
              <g class="scissor-half scissor-half-left">
                <line x1="82" y1="78" x2="100" y2="100" class="scissor-arm" />
                <line x1="100" y1="100" x2="36" y2="184" class="scissor-blade-line" />
              </g>
              <g class="scissor-half scissor-half-right">
                <line x1="118" y1="78" x2="100" y2="100" class="scissor-arm" />
                <line x1="100" y1="100" x2="164" y2="184" class="scissor-blade-line" />
              </g>
              <circle cx="100" cy="100" r="8" class="scissor-screw" />
            </svg>
          </div>
        </div>

        <div class="about-copy" data-reveal>
          <h2>Über Uns</h2>
          <p>
            Alis Coiffeur steht für moderne Schnitte, gepflegte Farben und ein Styling, das zu
            deinem Alltag passt. Von klassischen Damenservices bis zu Beauty-Extras bekommst du bei
            uns alles in einer ruhigen, stilvollen Atmosphäre.
          </p>
        </div>

        <div class="about-ornament about-ornament-bottom" aria-hidden="true">
          <div class="about-scissors about-scissors-bottom">
            <svg viewBox="0 0 200 200" class="about-scissors-svg" role="presentation">
              <circle cx="60" cy="54" r="26" class="scissor-loop" />
              <circle cx="140" cy="54" r="26" class="scissor-loop" />
              <g class="scissor-half scissor-half-left">
                <line x1="82" y1="78" x2="100" y2="100" class="scissor-arm" />
                <line x1="100" y1="100" x2="36" y2="184" class="scissor-blade-line" />
              </g>
              <g class="scissor-half scissor-half-right">
                <line x1="118" y1="78" x2="100" y2="100" class="scissor-arm" />
                <line x1="100" y1="100" x2="164" y2="184" class="scissor-blade-line" />
              </g>
              <circle cx="100" cy="100" r="8" class="scissor-screw" />
            </svg>
          </div>
        </div>
      </section>

      <section id="leistungen" class="services-section" data-reveal>
        <div class="services-head" data-reveal>
          <div>
            <p class="services-kicker">Salon Highlights</p>
            <h2>Unsere Leistungen</h2>
          </div>
        </div>

        <div class="services-slider" data-reveal>
          <Transition name="services-swipe" mode="out-in">
            <div :key="servicePage" class="services-grid">
              <article
                v-for="service in visibleServices"
                :key="service.title"
                class="service-card service-card-featured"
                :class="`is-${service.slot}`"
              >
                <div class="service-card-copy">
                  <p class="service-eyebrow">Signature Service</p>
                  <h3>{{ service.title }}</h3>
                  <p v-for="line in service.lines" :key="line">{{ line }}</p>
                </div>

                <div class="service-footer">
                  <a href="#">Mehr erfahren</a>
                </div>
              </article>
            </div>
          </Transition>
        </div>

        <div class="services-dots" aria-label="Leistungen Auswahl" data-reveal>
          <button
            v-for="(_, index) in servicePages"
            :key="index"
            type="button"
            class="services-dot"
            :class="{ 'is-active': index === servicePage }"
            :aria-label="`Gehe zu Slide ${index + 1}`"
            @click="servicePage = index; startServicesAutoplay()"
          ></button>
        </div>
      </section>

      <section id="preisliste" class="price-section" data-reveal>
        <div class="price-head" data-reveal>
          <p class="price-kicker">Transparente Preise</p>
          <h2>Preisliste</h2>
          <p class="price-intro">
            Alle Leistungen auf einen Blick. Zeiten sind Richtwerte und können je nach Haarlänge,
            Aufwand und Wunschlook leicht variieren.
          </p>
          <p class="price-mobile-note">Preisliste +{{ remainingPriceCategories }} weitere</p>
        </div>

        <div class="price-shell" data-reveal>
          <div class="price-tabs" aria-label="Preisliste Kategorien">
            <button
              v-for="(category, index) in priceCategories"
              :key="category.title"
              type="button"
              class="price-tab"
              :class="{ 'is-active': index === selectedPriceCategory }"
              @click="selectPriceCategory(index)"
            >
              {{ category.title }}
            </button>
          </div>

          <section class="price-category">
            <div class="price-category-head">
              <h3>{{ currentPriceCategory.title }}</h3>
              <p>{{ currentPriceCategory.groups.length }} Preisblöcke in dieser Kategorie</p>
            </div>

            <div class="price-groups">
              <article
                v-for="(group, index) in currentPriceCategory.groups"
                :key="group.title"
                class="price-card"
                :class="{ 'is-centered': currentPriceCategory.groups.length % 2 === 1 && index === currentPriceCategory.groups.length - 1 }"
              >
                <div class="price-card-head">
                  <h4>{{ group.title }}</h4>
                  <p>{{ group.items.length }} Positionen</p>
                </div>

                <div class="price-table-head">
                  <span>Leistung</span>
                  <span>Dauer</span>
                  <span>Preis</span>
                </div>

                <div class="price-rows">
                  <div v-for="item in group.items" :key="`${group.title}-${item.label}-${item.price}`" class="price-row">
                    <div class="price-meta">
                      <span class="price-label">{{ item.label }}</span>
                    </div>
                    <span class="price-duration">{{ item.duration }}</span>
                    <span class="price-value">{{ item.price }}</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section id="team" class="team-section" data-reveal>
        <div class="team-copy" data-reveal>
          <p class="team-kicker">Unser Team</p>
          <h2>Styling mit Persönlichkeit</h2>
          <p class="team-intro">
            Statt einzelner Karten steht hier euer gemeinsamer Auftritt im Fokus. Das Team wird als
            ein starkes Ganzes gezeigt.
          </p>
        </div>

        <figure class="team-figure" data-reveal>
          <img :src="teamPhoto" alt="Gesamtbild vom Team von Alis Coiffeur" class="team-image" loading="lazy" decoding="async" />
        </figure>
      </section>

      <section class="reviews-section" data-reveal>
        <div class="reviews-shell">
          <div class="reviews-copy" data-reveal>
            <p class="reviews-kicker">Google Bewertungen</p>
            <h2>Von Kundinnen und Kunden geschätzt</h2>
            <p class="reviews-intro">
              Ein starker erster Eindruck entsteht nicht nur durch den Look, sondern auch durch
              echtes Vertrauen von Kundinnen und Kunden.
            </p>
          </div>

          <div class="reviews-grid" data-reveal>
            <article class="reviews-summary-card">
              <span class="reviews-summary-label">Durchschnitt</span>
              <strong>{{ googleRating.score }}</strong>
              <p>{{ googleRating.stars }}</p>
              <div class="reviews-summary-footer">
                <span>{{ googleRating.total }} Rezensionen auf Google</span>
                <a
                  class="reviews-link"
                  href="https://www.google.com/maps/search/?api=1&query=Ali's+Coiffeur+Obfelden"
                  target="_blank"
                  rel="noreferrer"
                >
                  Auf Google ansehen
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="kontakt" class="contact-section" data-reveal>
        <div class="contact-shell">
          <div class="contact-copy" data-reveal>
            <p class="contact-kicker">Kontakt & Zeiten</p>
            <h2>Wir sind für dich da</h2>
            <p class="contact-intro">
              Ruf uns an, melde dich für eine Beratung oder plane deinen nächsten Termin direkt mit
              uns im Salon.
            </p>

            <div class="contact-status" :class="{ 'is-open': isOpenNow, 'is-closed': !isOpenNow, 'is-closing-soon': isClosingSoon }">
              <span class="contact-status-dot" aria-hidden="true"></span>
              <div>
                <strong>{{ shopStatusLabel }}</strong>
                <p>{{ shopStatusDetail }}</p>
              </div>
            </div>

            <div class="contact-actions">
              <a class="contact-action-btn is-primary" href="tel:+41447616222">Jetzt anrufen</a>
              <a class="contact-action-btn" href="https://www.google.com/maps/dir/?api=1&destination=Ottenbacherstrasse+2a,+8912+Obfelden" target="_blank" rel="noreferrer">Route planen</a>
              <a class="contact-action-btn" href="https://www.instagram.com/alis_coiffeur_obfelden/" target="_blank" rel="noreferrer">Instagram</a>
            </div>

            <div class="contact-info-grid">
              <article class="contact-card">
                <span class="contact-card-label">Telefon</span>
                <a href="tel:+41447616222">044 761 62 22</a>
              </article>

              <article class="contact-card">
                <span class="contact-card-label">Standort</span>
                <a href="https://www.google.com/maps/search/?api=1&query=Ottenbacherstrasse+2a,+8912+Obfelden" target="_blank" rel="noreferrer">
                  Ottenbacherstrasse 2a, 8912 Obfelden
                </a>
              </article>

              <article class="contact-card">
                <span class="contact-card-label">Instagram</span>
                <a href="https://www.instagram.com/alis_coiffeur_obfelden/" target="_blank" rel="noreferrer">alis_coiffeur_obfelden</a>
              </article>

              <article class="contact-card">
                <span class="contact-card-label">Online buchen</span>
                <a href="#kontakt">Termin bequem anfragen</a>
              </article>
            </div>
          </div>

          <div class="hours-panel" data-reveal>
            <div class="hours-head">
              <p class="hours-kicker">Öffnungszeiten</p>
              <h3>Links Infos, rechts Zeiten</h3>
            </div>

            <div class="hours-list">
              <div
                v-for="day in openingHours"
                :key="day.day"
                class="hours-row"
                :class="{ 'is-today': day.day === todaySchedule.day, 'is-closed': day.closed }"
              >
                <div class="hours-day">
                  <span>{{ day.shortDay }}</span>
                  <strong>{{ day.day }}</strong>
                </div>
                <div class="hours-time">
                  <template v-if="day.closed">Geschlossen</template>
                  <template v-else>{{ day.open }} - {{ day.close }}</template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
@import "./restored.css";
</style>
