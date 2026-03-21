<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import landingVideo from './assets/WWVA0186.mp4'
import heroPoster from './assets/hero.png'
import vorherImage from './assets/Vorher.jpg'
import nachherImage from './assets/Nacher.jpg'
import vorherImageOne from './assets/Vorher1.jpg'
import nachherImageOne from './assets/Nacher1.jpg'

const SKIP_LOADER_KEY = 'alis-skip-loader-once'
const loading = ref(true)
const cutPhase = ref(false)
const skipIntroTransition = ref(false)
const servicePage = ref(0)
const mobileMenuOpen = ref(false)
const activeSection = ref('start')
const now = ref(new Date())
const prefersReducedMotion = ref(false)
const isMobileViewport = ref(false)
const heroVideo = ref(null)
const heroVideoReady = ref(false)
const heroVideoFailed = ref(false)
const activeGalleryLightbox = ref(null)
const lightboxSlideDirection = ref(1)
const gallerySlideDirection = ref({
  kurzhaar: 1,
  damenCut: 1,
})
const beforeAfterProgress = ref({
  kurzhaar: 0,
  damenCut: 0,
})
const beforeAfterDragging = ref({
  kurzhaar: false,
  damenCut: false,
})
const beforeAfterDragStartX = {
  kurzhaar: 0,
  damenCut: 0,
}
const gallerySlideIndex = ref({
  kurzhaar: 0,
  damenCut: 0,
})
const sectionElements = ref([])
let servicesTimer = null
let revealObserver = null
let clockTimer = null
let resizeHandler = null
let scrollHandler = null
let visibilityHandler = null
let mediaQueryList = null
let mediaQueryHandler = null
let scrollTicking = false
let lightboxAutoplayTimer = null
let servicesTouchStartX = 0
let servicesTouchDeltaX = 0
const gallerySwipeState = {}
const lightboxSwipeState = {
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
}
const GALLERY_SWIPE_THRESHOLD = 42
const GALLERY_SLIDE_LOCK_MS = 340
const LIGHTBOX_AUTOPLAY_MS = 2600
const GALLERY_AUTOPLAY_MS = 2800
const galleryClickSuppressed = {}
const beforeAfterClickSuppressed = {}
const beforeAfterAutoTimers = {}
const beforeAfterPhaseTimers = {}
const gallerySlideLocks = {}
const galleryAutoplayTimers = {}
let lightboxSlideLocked = false

const navItems = [
  { id: 'start', label: 'Start', href: '#' },
  { id: 'ueber-uns', label: 'Über Uns', href: '#ueber-uns' },
  { id: 'leistungen', label: 'Leistungen', href: '#leistungen' },
  { id: 'preisliste', label: 'Preisliste', href: './preise.html' },
  { id: 'team', label: 'Galerie', href: '#team' },
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

const galleryItems = [
  {
    key: 'kurzhaar',
    title: 'Kurzhaarschnitt Vorher / Nachher',
    type: 'Vorher / Nachher',
    beforeAfterImages: [
      { src: vorherImage, alt: 'Kurzhaarschnitt vorher bei Alis Coiffeur', label: 'Vorher' },
      { src: nachherImage, alt: 'Kurzhaarschnitt nachher bei Alis Coiffeur', label: 'Nachher' },
    ],
    alt: 'Vorher-Nachher Kurzhaarschnitt bei Alis Coiffeur',
  },
  {
    key: 'damenCut',
    title: 'Damen Cut & Styling',
    type: 'Vorher / Nachher',
    beforeAfterImages: [
      { src: vorherImageOne, alt: 'Damen Cut vorher bei Alis Coiffeur', label: 'Vorher' },
      { src: nachherImageOne, alt: 'Damen Cut nachher bei Alis Coiffeur', label: 'Nacher' },
    ],
    alt: 'Damen Cut und Styling bei Alis Coiffeur',
  },
  {
    title: 'Herren Fade',
    type: 'Haarschnitt',
    image: './images/galerie/haarschnitt-herren.svg',
    alt: 'Herren Fade und Styling bei Alis Coiffeur',
  },
  {
    title: 'Langhaar Styling',
    type: 'Haarschnitt',
    image: './images/galerie/haarschnitt-langhaar.svg',
    alt: 'Langhaar Styling bei Alis Coiffeur',
  },
  {
    title: 'Farbe & Glanz Finish',
    type: 'Haarschnitt',
    image: './images/galerie/haarschnitt-color.svg',
    alt: 'Color Finish bei Alis Coiffeur',
  },
]

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

const isOpeningSoon = computed(() => {
  const schedule = todaySchedule.value
  if (!schedule || schedule.closed || !schedule.open || isOpenNow.value) return false
  const [openHour, openMinute] = schedule.open.split(':').map(Number)
  const openingMinutes = openHour * 60 + openMinute
  const minutesUntilOpen = openingMinutes - currentTimeInMinutes.value
  return minutesUntilOpen > 0 && minutesUntilOpen <= 60
})

const shopStatusLabel = computed(() => {
  if (isClosingSoon.value) return 'Schliesst demnächst'
  if (isOpeningSoon.value) return 'Öffnet demnächst'
  if (isOpenNow.value) return 'Jetzt geöffnet!'
  return 'Gerade geschlossen'
})

const shopStatusDetail = computed(() => {
  const schedule = todaySchedule.value
  const nextDay = openingHours[(currentDayIndex.value + 1) % openingHours.length]
  if (!schedule) return 'Öffnungszeiten auf Anfrage'
  if (isClosingSoon.value) return `Heute noch bis ${schedule.close}`
  if (isOpeningSoon.value) return `Heute ab ${schedule.open}`
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
const shouldUseHeroVideo = computed(() => !prefersReducedMotion.value)
const shouldShowHeroPoster = computed(() => !shouldUseHeroVideo.value || heroVideoFailed.value)

const previousServices = () => {
  servicePage.value = (servicePage.value - 1 + servicePages.value) % servicePages.value
}

const nextServices = () => {
  servicePage.value = (servicePage.value + 1) % servicePages.value
}

const handleServicesTouchStart = (event) => {
  servicesTouchStartX = event.touches[0]?.clientX ?? 0
  servicesTouchDeltaX = 0
}

const handleServicesTouchMove = (event) => {
  servicesTouchDeltaX = (event.touches[0]?.clientX ?? 0) - servicesTouchStartX
}

const handleServicesTouchEnd = () => {
  if (Math.abs(servicesTouchDeltaX) < 48) {
    servicesTouchStartX = 0
    servicesTouchDeltaX = 0
    return
  }

  if (servicesTouchDeltaX < 0) {
    nextServices()
  } else {
    previousServices()
  }

  startServicesAutoplay()
  servicesTouchStartX = 0
  servicesTouchDeltaX = 0
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const syncBodyScrollLock = () => {
  document.body.style.overflow = mobileMenuOpen.value || Boolean(activeGalleryLightbox.value) ? 'hidden' : ''
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const getGalleryItemByKey = (key) => galleryItems.find((item) => item.key === key)

const lockGallerySlide = (key) => {
  if (gallerySlideLocks[key]) return false
  gallerySlideLocks[key] = window.setTimeout(() => {
    window.clearTimeout(gallerySlideLocks[key])
    delete gallerySlideLocks[key]
  }, GALLERY_SLIDE_LOCK_MS)
  return true
}

const lockLightboxSlide = () => {
  if (lightboxSlideLocked) return false
  lightboxSlideLocked = true
  window.setTimeout(() => {
    lightboxSlideLocked = false
  }, GALLERY_SLIDE_LOCK_MS)
  return true
}

const setGallerySlide = (key, nextIndex) => {
  const item = getGalleryItemByKey(key)
  const imageCount = item?.beforeAfterImages?.length ?? 0
  if (!imageCount || !lockGallerySlide(key)) return
  const currentIndex = gallerySlideIndex.value[key] ?? 0
  gallerySlideDirection.value[key] = nextIndex === currentIndex ? 1 : nextIndex > currentIndex ? 1 : -1
  gallerySlideIndex.value[key] = (nextIndex + imageCount) % imageCount
}

const shiftGallerySlide = (key, direction) => {
  gallerySlideDirection.value[key] = direction >= 0 ? 1 : -1
  setGallerySlide(key, (gallerySlideIndex.value[key] ?? 0) + direction)
}

const stopGalleryAutoplay = (key) => {
  if (!galleryAutoplayTimers[key]) return
  window.clearInterval(galleryAutoplayTimers[key])
  delete galleryAutoplayTimers[key]
}

const startGalleryAutoplay = (key) => {
  stopGalleryAutoplay(key)
  if (!isMobileViewport.value || prefersReducedMotion.value || document.hidden) return
  const item = getGalleryItemByKey(key)
  if (!item?.beforeAfterImages?.length || item.beforeAfterImages.length < 2) return
  galleryAutoplayTimers[key] = window.setInterval(() => {
    shiftGallerySlide(key, 1)
  }, GALLERY_AUTOPLAY_MS)
}

const syncGalleryAutoplay = () => {
  galleryItems
    .filter((item) => item.key && item.beforeAfterImages?.length > 1)
    .forEach((item) => {
      if (isMobileViewport.value && !prefersReducedMotion.value && !document.hidden) {
        startGalleryAutoplay(item.key)
      } else {
        stopGalleryAutoplay(item.key)
      }
    })
}

const setBeforeAfterPosition = (key, nextValue) => {
  beforeAfterProgress.value[key] = Math.min(1, Math.max(0, nextValue))
}

const openGalleryLightbox = (item, startIndex = 0) => {
  if (!item?.beforeAfterImages?.length) return
  activeGalleryLightbox.value = {
    key: item.key,
    title: item.title,
    images: item.beforeAfterImages,
    index: startIndex,
  }
}

const closeGalleryLightbox = () => {
  activeGalleryLightbox.value = null
}

const stopLightboxAutoplay = () => {
  if (!lightboxAutoplayTimer) return
  window.clearInterval(lightboxAutoplayTimer)
  lightboxAutoplayTimer = null
}

const startLightboxAutoplay = () => {
  stopLightboxAutoplay()
  if (
    prefersReducedMotion.value
    || !activeGalleryLightbox.value?.images?.length
    || activeGalleryLightbox.value.images.length < 2
  ) return

  lightboxAutoplayTimer = window.setInterval(() => {
    shiftLightboxSlide(1)
  }, LIGHTBOX_AUTOPLAY_MS)
}

const stopBeforeAfterAnimation = (key) => {
  if (beforeAfterAutoTimers[key]) {
    window.clearTimeout(beforeAfterAutoTimers[key])
    delete beforeAfterAutoTimers[key]
  }
  if (beforeAfterPhaseTimers[key]) {
    window.clearTimeout(beforeAfterPhaseTimers[key])
    delete beforeAfterPhaseTimers[key]
  }
}

const updateBeforeAfterProgress = (key, sliderElement, clientX) => {
  if (!sliderElement) return
  const bounds = sliderElement.getBoundingClientRect()
  const rawProgress = (clientX - bounds.left) / bounds.width
  setBeforeAfterPosition(key, rawProgress)
}

const startBeforeAfterAnimation = (key, force = false) => {
  if (prefersReducedMotion.value || beforeAfterDragging.value[key] || (isMobileViewport.value && !force)) return
  stopBeforeAfterAnimation(key)
  beforeAfterProgress.value[key] = 0
  beforeAfterAutoTimers[key] = window.setTimeout(() => {
    beforeAfterProgress.value[key] = 1
    beforeAfterPhaseTimers[key] = window.setTimeout(() => {
      beforeAfterProgress.value[key] = 0
      beforeAfterAutoTimers[key] = window.setTimeout(() => {
        startBeforeAfterAnimation(key)
      }, 1200)
    }, 2400)
  }, 180)
}

const syncBeforeAfterAnimations = () => {
  if (isMobileViewport.value || prefersReducedMotion.value) {
    stopBeforeAfterAnimation('kurzhaar')
    stopBeforeAfterAnimation('damenCut')
    return
  }
  startBeforeAfterAnimation('kurzhaar')
  startBeforeAfterAnimation('damenCut')
}

const shiftLightboxSlide = (direction) => {
  if (!activeGalleryLightbox.value?.images?.length || !lockLightboxSlide()) return
  const imageCount = activeGalleryLightbox.value.images.length
  lightboxSlideDirection.value = direction >= 0 ? 1 : -1
  activeGalleryLightbox.value = {
    ...activeGalleryLightbox.value,
    index: (activeGalleryLightbox.value.index + direction + imageCount) % imageCount,
  }
  startLightboxAutoplay()
}

const setLightboxSlide = (nextIndex) => {
  if (!activeGalleryLightbox.value?.images?.length || !lockLightboxSlide()) return
  const currentIndex = activeGalleryLightbox.value.index
  lightboxSlideDirection.value = nextIndex === currentIndex ? 1 : nextIndex > currentIndex ? 1 : -1
  activeGalleryLightbox.value = {
    ...activeGalleryLightbox.value,
    index: nextIndex,
  }
  startLightboxAutoplay()
}

const handleGalleryPointerDown = (key, event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  galleryClickSuppressed[key] = false
  gallerySwipeState[key] = {
    startX: event.clientX,
    startY: event.clientY,
    deltaX: 0,
    deltaY: 0,
  }
  event.currentTarget?.setPointerCapture?.(event.pointerId)
}

const handleGalleryPointerMove = (key, event) => {
  if (!gallerySwipeState[key]) return
  gallerySwipeState[key].deltaX = event.clientX - gallerySwipeState[key].startX
  gallerySwipeState[key].deltaY = event.clientY - gallerySwipeState[key].startY
}

const handleGalleryPointerUp = (key, event) => {
  const swipeState = gallerySwipeState[key]
  if (!swipeState) return
  event.currentTarget?.releasePointerCapture?.(event.pointerId)
  const isHorizontalSwipe =
    Math.abs(swipeState.deltaX) >= GALLERY_SWIPE_THRESHOLD
    && Math.abs(swipeState.deltaX) > Math.abs(swipeState.deltaY)
  if (isHorizontalSwipe) {
    galleryClickSuppressed[key] = true
    shiftGallerySlide(key, swipeState.deltaX < 0 ? 1 : -1)
    startGalleryAutoplay(key)
  }
  delete gallerySwipeState[key]
}

const handleGalleryViewerClick = (item) => {
  if (galleryClickSuppressed[item.key]) {
    galleryClickSuppressed[item.key] = false
    return
  }
  openGalleryLightbox(item, gallerySlideIndex.value[item.key] ?? 0)
}

const handleBeforeAfterPointerDown = (key, event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  beforeAfterClickSuppressed[key] = false
  beforeAfterDragging.value[key] = true
  beforeAfterDragStartX[key] = event.clientX
  stopBeforeAfterAnimation(key)
  event.currentTarget?.setPointerCapture?.(event.pointerId)
  updateBeforeAfterProgress(key, event.currentTarget, event.clientX)
}

const handleBeforeAfterPointerMove = (key, event) => {
  if (!beforeAfterDragging.value[key]) return
  updateBeforeAfterProgress(key, event.currentTarget, event.clientX)
}

const handleBeforeAfterPointerUp = (item, event) => {
  const key = item.key
  if (!beforeAfterDragging.value[key]) return
  event?.currentTarget?.releasePointerCapture?.(event.pointerId)
  beforeAfterDragging.value[key] = false
  if (Math.abs((event.clientX ?? 0) - beforeAfterDragStartX[key]) >= 8) {
    beforeAfterClickSuppressed[key] = true
  }
  startBeforeAfterAnimation(key)
}

const handleBeforeAfterClick = (item) => {
  if (beforeAfterClickSuppressed[item.key]) {
    beforeAfterClickSuppressed[item.key] = false
    return
  }
  openGalleryLightbox(item, beforeAfterProgress.value[item.key] >= 0.5 ? 1 : 0)
}

const handleLightboxPointerDown = (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) return
  lightboxSwipeState.startX = event.clientX
  lightboxSwipeState.startY = event.clientY
  lightboxSwipeState.deltaX = 0
  lightboxSwipeState.deltaY = 0
  event.currentTarget?.setPointerCapture?.(event.pointerId)
}

const handleLightboxPointerMove = (event) => {
  lightboxSwipeState.deltaX = event.clientX - lightboxSwipeState.startX
  lightboxSwipeState.deltaY = event.clientY - lightboxSwipeState.startY
}

const handleLightboxPointerUp = (event) => {
  event.currentTarget?.releasePointerCapture?.(event.pointerId)
  const isHorizontalSwipe =
    Math.abs(lightboxSwipeState.deltaX) >= GALLERY_SWIPE_THRESHOLD
    && Math.abs(lightboxSwipeState.deltaX) > Math.abs(lightboxSwipeState.deltaY)
  if (isHorizontalSwipe) {
    shiftLightboxSlide(lightboxSwipeState.deltaX < 0 ? 1 : -1)
  }
  lightboxSwipeState.startX = 0
  lightboxSwipeState.startY = 0
  lightboxSwipeState.deltaX = 0
  lightboxSwipeState.deltaY = 0
}

const collectSectionElements = () => {
  sectionElements.value = navItems
    .filter((item) => item.id !== 'start')
    .map((item) => ({ id: item.id, element: document.getElementById(item.id) }))
    .filter((entry) => entry.element)
}

const syncActiveSection = () => {
  if (typeof window === 'undefined') return
  const threshold = window.innerHeight * 0.35
  let current = 'start'
  for (const entry of sectionElements.value) {
    if (entry.element && entry.element.getBoundingClientRect().top <= threshold) current = entry.id
  }
  if (window.scrollY < 120) current = 'start'
  if (activeSection.value !== current) activeSection.value = current
}

const syncMotionPreference = () => {
  prefersReducedMotion.value = Boolean(mediaQueryList?.matches)
}

const syncViewportState = () => {
  if (typeof window === 'undefined') return
  isMobileViewport.value = window.innerWidth <= 640
}

const updateHeroVideoState = () => {
  const videoElement = heroVideo.value
  heroVideoReady.value = Boolean(videoElement && videoElement.readyState >= 2)
}

const markHeroVideoReady = () => {
  heroVideoFailed.value = false
  heroVideoReady.value = true
}

const handleHeroVideoError = () => {
  heroVideoReady.value = false
  heroVideoFailed.value = true
}

const syncHeroPlayback = async () => {
  if (typeof window === 'undefined') return
  const videoElement = heroVideo.value
  if (!videoElement) return

  if (!shouldUseHeroVideo.value || document.hidden) {
    videoElement.pause()
    return
  }

  updateHeroVideoState()

  try {
    await videoElement.play()
  } catch {
    // Autoplay can be blocked transiently; the first loaded frame can still stay visible.
  }
}

const startServicesAutoplay = () => {
  if (servicesTimer) window.clearInterval(servicesTimer)
  if (prefersReducedMotion.value || document.hidden) return
  servicesTimer = window.setInterval(() => {
    nextServices()
  }, 4500)
}

const setupRevealAnimations = async () => {
  await nextTick()
  const revealElements = Array.from(document.querySelectorAll('[data-reveal]'))
  if (prefersReducedMotion.value) {
    revealElements.forEach((element) => element.classList.add('is-revealed'))
    revealObserver?.disconnect()
    revealObserver = null
    return
  }
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
      isMobileViewport.value
        ? { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
        : { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
  }
  revealElements.forEach((element) => {
    const htmlElement = element
    if (!htmlElement.classList.contains('is-revealed')) revealObserver?.observe(htmlElement)
  })
}

onMounted(() => {
  const skipLoader = window.sessionStorage.getItem(SKIP_LOADER_KEY) === 'true'
  if (skipLoader) {
    window.sessionStorage.removeItem(SKIP_LOADER_KEY)
    loading.value = false
    cutPhase.value = false
    skipIntroTransition.value = true
  }
  syncViewportState()
  mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
  mediaQueryHandler = () => {
    syncMotionPreference()
    syncHeroPlayback()
    startServicesAutoplay()
    syncBeforeAfterAnimations()
  }
  syncMotionPreference()
  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener('change', mediaQueryHandler)
  } else {
    mediaQueryList.addListener(mediaQueryHandler)
  }
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  const finalizeInitialView = () => {
    loading.value = false
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    collectSectionElements()
    setupRevealAnimations()
    updateHeroVideoState()
    syncHeroPlayback()
    syncBeforeAfterAnimations()
    syncGalleryAutoplay()
  }
  if (skipLoader) {
    window.requestAnimationFrame(() => {
      finalizeInitialView()
      window.setTimeout(() => {
        skipIntroTransition.value = false
      }, 520)
    })
  } else {
    window.setTimeout(() => {
      cutPhase.value = true
      window.setTimeout(() => {
        finalizeInitialView()
      }, isMobileViewport.value ? 900 : 800)
    }, prefersReducedMotion.value ? 900 : isMobileViewport.value ? 1550 : 1800)
  }
  startServicesAutoplay()
  clockTimer = window.setInterval(() => {
    now.value = new Date()
  }, 60000)
  resizeHandler = () => {
    syncViewportState()
    if (window.innerWidth > 640) closeMobileMenu()
    collectSectionElements()
    syncHeroPlayback()
    syncBeforeAfterAnimations()
    syncGalleryAutoplay()
  }
  scrollHandler = () => {
    if (scrollTicking) return
    scrollTicking = true
    window.requestAnimationFrame(() => {
      syncActiveSection()
      scrollTicking = false
    })
  }
  visibilityHandler = () => {
    syncHeroPlayback()
    startServicesAutoplay()
    syncGalleryAutoplay()
  }
  window.addEventListener('resize', resizeHandler)
  window.addEventListener('scroll', scrollHandler, { passive: true })
  document.addEventListener('visibilitychange', visibilityHandler)
  syncActiveSection()
})

onBeforeUnmount(() => {
  if (servicesTimer) window.clearInterval(servicesTimer)
  if (clockTimer) window.clearInterval(clockTimer)
  stopLightboxAutoplay()
  Object.keys(galleryAutoplayTimers).forEach((key) => stopGalleryAutoplay(key))
  Object.values(gallerySlideLocks).forEach((timer) => window.clearTimeout(timer))
  stopBeforeAfterAnimation('kurzhaar')
  stopBeforeAfterAnimation('damenCut')
  if (revealObserver) revealObserver.disconnect()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
  if (mediaQueryList && mediaQueryHandler) {
    if (mediaQueryList.removeEventListener) {
      mediaQueryList.removeEventListener('change', mediaQueryHandler)
    } else {
      mediaQueryList.removeListener(mediaQueryHandler)
    }
  }
  document.body.style.overflow = ''
})

watch(mobileMenuOpen, (isOpen) => {
  syncBodyScrollLock()
})

watch(shouldUseHeroVideo, async (enabled) => {
  heroVideoReady.value = false
  heroVideoFailed.value = false

  if (!enabled) {
    heroVideo.value?.pause()
    return
  }

  await nextTick()
  updateHeroVideoState()
  syncHeroPlayback()
})

watch(activeGalleryLightbox, () => {
  syncBodyScrollLock()
  if (activeGalleryLightbox.value) {
    startLightboxAutoplay()
    return
  }
  stopLightboxAutoplay()
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

    <header v-if="!loading" class="nav-wrap" :class="{ 'is-mobile-open': mobileMenuOpen, 'is-skip-enter': skipIntroTransition }">
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
        <a class="cta-btn" href="tel:+41447616222" @click="closeMobileMenu">
          <span>Jetzt anrufen</span>
          <span aria-hidden="true">-></span>
        </a>
      </div>
    </header>

    <section class="page-content" :class="{ 'is-visible': !loading, 'is-skip-enter': skipIntroTransition }">
      <section class="landing-hero">
        <video
          v-if="shouldUseHeroVideo"
          ref="heroVideo"
          class="bg-video"
          :class="{ 'is-ready': heroVideoReady }"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          aria-hidden="true"
          @loadeddata="markHeroVideoReady"
          @canplay="markHeroVideoReady"
          @playing="markHeroVideoReady"
          @error="handleHeroVideoError"
        >
          <source :src="landingVideo" type="video/mp4" />
        </video>
        <img
          v-if="shouldShowHeroPoster"
          class="bg-poster"
          :src="heroPoster"
          alt=""
          aria-hidden="true"
          fetchpriority="high"
          loading="eager"
          decoding="async"
        />
        <div class="bg-overlay" aria-hidden="true"></div>

        <section class="hero-content">
          <div class="hero-rating-chip" data-reveal>
            <span class="hero-rating-score">{{ googleRating.score }}</span>
            <span class="hero-rating-stars" aria-label="4.9 von 5 Sternen">{{ googleRating.stars }}</span>
            <span class="hero-rating-total">({{ googleRating.total }} Google-Bewertungen)</span>
          </div>
          <h1 class="hero-title">
            <span>Mehr Style.</span>
            <span>Mehr Selbstvertrauen.</span>
          </h1>
          <div class="hero-line"></div>
          <p class="hero-subtitle">ALIS Coiffeur.</p>
          <p class="hero-description">
            Damen, Herren, Farbe, Styling und Beauty an einem Ort. Modern, herzlich und direkt in
            Obfelden.
          </p>
          <div class="hero-actions">
            <a class="hero-primary-btn" href="./preise.html">Preise ansehen</a>
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

        <div
          class="services-slider"
          data-reveal
          @touchstart.passive="handleServicesTouchStart"
          @touchmove.passive="handleServicesTouchMove"
          @touchend="handleServicesTouchEnd"
          @touchcancel="handleServicesTouchEnd"
        >
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
                  <a class="service-price-link" href="./preise.html">Zur Preisliste</a>
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

      <section id="team" class="team-section" data-reveal>
        <div class="team-copy" data-reveal>
          <p class="team-kicker">Unsere Galerie</p>
          <h2>Vorher, Nachher und frische Looks</h2>
          <p class="team-intro">
            Eine kuratierte Mini-Galerie mit drei starken Looks wirkt edler und moderner als viele kleine Bilder.
          </p>
        </div>

                <div class="gallery-shell" data-reveal>
          <div class="gallery-grid">
            <article
              v-for="item in galleryItems.slice(0, 2)"
              :key="item.title"
              class="gallery-card"
            >
              <div class="gallery-card-media">
                <template v-if="item.beforeAfterImages">
                  <template v-if="isMobileViewport">
                    <div
                      class="gallery-swipe-viewer"
                      :style="{
                        '--gallery-swipe-enter-x': `${22 * (gallerySlideDirection[item.key] ?? 1)}px`,
                        '--gallery-swipe-leave-x': `${-22 * (gallerySlideDirection[item.key] ?? 1)}px`,
                      }"
                      @pointerdown="handleGalleryPointerDown(item.key, $event)"
                      @pointermove="handleGalleryPointerMove(item.key, $event)"
                      @pointerup="handleGalleryPointerUp(item.key, $event)"
                      @pointercancel="handleGalleryPointerUp(item.key, $event)"
                      @click="handleGalleryViewerClick(item)"
                    >
                      <Transition name="gallery-swipe-slide" mode="out-in">
                        <figure
                          :key="`${item.key}-${gallerySlideIndex[item.key] ?? 0}`"
                          class="gallery-swipe-frame"
                        >
                          <img
                            :src="item.beforeAfterImages[gallerySlideIndex[item.key] ?? 0].src"
                            :alt="item.beforeAfterImages[gallerySlideIndex[item.key] ?? 0].alt"
                            class="gallery-image"
                            loading="lazy"
                            decoding="async"
                          />
                        </figure>
                      </Transition>
                      <span class="gallery-swipe-badge">
                        {{ item.beforeAfterImages[gallerySlideIndex[item.key] ?? 0].label }}
                      </span>
                    </div>
                    <div class="gallery-swipe-dots" aria-label="Vorher Nachher Auswahl">
                      <button
                        v-for="(image, index) in item.beforeAfterImages"
                        :key="`${item.key}-${image.label}`"
                        type="button"
                        class="gallery-swipe-dot"
                        :class="{ 'is-active': (gallerySlideIndex[item.key] ?? 0) === index }"
                        :aria-label="`${image.label} anzeigen`"
                        @click="setGallerySlide(item.key, index)"
                      ></button>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      class="gallery-before-after-slider"
                      @pointerdown="handleBeforeAfterPointerDown(item.key, $event)"
                      @pointermove="handleBeforeAfterPointerMove(item.key, $event)"
                      @pointerup="handleBeforeAfterPointerUp(item, $event)"
                      @pointercancel="handleBeforeAfterPointerUp(item, $event)"
                      @pointerleave="handleBeforeAfterPointerUp(item, $event)"
                      @click="handleBeforeAfterClick(item)"
                    >
                      <figure class="gallery-before-after-base">
                        <img
                          :src="item.beforeAfterImages[0].src"
                          :alt="item.beforeAfterImages[0].alt"
                          class="gallery-image"
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                      <figure
                        class="gallery-before-after-overlay"
                        :style="{ clipPath: `inset(0 0 0 ${(1 - beforeAfterProgress[item.key]) * 100}%)` }"
                      >
                        <img
                          :src="item.beforeAfterImages[1].src"
                          :alt="item.beforeAfterImages[1].alt"
                          class="gallery-image"
                          loading="lazy"
                          decoding="async"
                        />
                      </figure>
                      <div
                        class="gallery-before-after-divider"
                        :class="{ 'is-hidden': beforeAfterProgress[item.key] <= 0.02 || beforeAfterProgress[item.key] >= 0.98 }"
                        :style="{ left: `${beforeAfterProgress[item.key] * 100}%` }"
                      ></div>
                    </div>
                  </template>
                </template>
                <img
                  v-else
                  :src="item.image"
                  :alt="item.alt"
                  class="gallery-image"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div class="gallery-card-copy">
                <span class="gallery-badge">{{ item.type }}</span>
                <h3>{{ item.title }}</h3>
                <p>Inspirationen aus dem Salon mit modernen Schnitten, Farbe und frischen Finishes.</p>
              </div>
            </article>
          </div>

          <div class="gallery-cta" data-reveal>
            <p>Noch mehr Looks, Umstylings und aktuelle Ergebnisse findest du auf Instagram.</p>
            <a
              class="gallery-cta-btn"
              href="https://www.instagram.com/alis_coiffeur_obfelden/"
              target="_blank"
              rel="noreferrer"
            >
              Mehr Bilder auf Instagram
            </a>
          </div>
        </div>
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

      <Teleport to="body">
        <Transition name="gallery-lightbox-enter">
          <div
            v-if="activeGalleryLightbox"
            class="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            :aria-label="activeGalleryLightbox.images[activeGalleryLightbox.index].alt"
            @click.self="closeGalleryLightbox"
          >
            <button
              type="button"
              class="gallery-lightbox-close"
              aria-label="Bild schliessen"
              @click="closeGalleryLightbox"
            >
              ×
            </button>

            <figure class="gallery-lightbox-figure">
              <div
                class="gallery-lightbox-swipe"
                :style="{
                  '--gallery-swipe-enter-x': `${28 * lightboxSlideDirection}px`,
                  '--gallery-swipe-leave-x': `${-28 * lightboxSlideDirection}px`,
                }"
                @pointerdown="handleLightboxPointerDown"
                @pointermove="handleLightboxPointerMove"
                @pointerup="handleLightboxPointerUp"
                @pointercancel="handleLightboxPointerUp"
              >
                <button
                  v-if="activeGalleryLightbox.images.length > 1"
                  type="button"
                  class="gallery-arrow-btn gallery-arrow-btn-lightbox is-left"
                  aria-label="Vorheriges Bild anzeigen"
                  @pointerdown.stop
                  @pointerup.stop
                  @click.stop="shiftLightboxSlide(-1)"
                >
                  &lt;
                </button>
                <div class="gallery-lightbox-stage">
                  <span class="gallery-lightbox-badge">
                    {{ activeGalleryLightbox.images[activeGalleryLightbox.index].label }}
                  </span>
                  <Transition name="gallery-swipe-slide" mode="out-in">
                    <img
                      :key="`lightbox-${activeGalleryLightbox.key}-${activeGalleryLightbox.index}`"
                      :src="activeGalleryLightbox.images[activeGalleryLightbox.index].src"
                      :alt="activeGalleryLightbox.images[activeGalleryLightbox.index].alt"
                      class="gallery-lightbox-image"
                    />
                  </Transition>
                </div>
                <button
                  v-if="activeGalleryLightbox.images.length > 1"
                  type="button"
                  class="gallery-arrow-btn gallery-arrow-btn-lightbox is-right"
                  aria-label="Nächstes Bild anzeigen"
                  @pointerdown.stop
                  @pointerup.stop
                  @click.stop="shiftLightboxSlide(1)"
                >
                  &gt;
                </button>
              </div>
              <div class="gallery-swipe-dots is-lightbox" aria-label="Grossansicht Auswahl">
                <button
                  v-for="(image, index) in activeGalleryLightbox.images"
                  :key="`lightbox-${image.label}`"
                  type="button"
                  class="gallery-swipe-dot"
                  :class="{ 'is-active': activeGalleryLightbox.index === index }"
                  :aria-label="`${image.label} in Grossansicht anzeigen`"
                  @click="setLightboxSlide(index)"
                ></button>
              </div>
            </figure>
          </div>
        </Transition>
      </Teleport>

      <section id="kontakt" class="contact-section" data-reveal>
        <div class="contact-shell">
          <div class="contact-copy" data-reveal>
            <p class="contact-kicker">Kontakt & Zeiten</p>
            <h2>Wir sind für dich da</h2>
            <p class="contact-intro">
              Bei Ali läuft die Terminvergabe telefonisch. Ruf uns einfach an, und wir planen deinen
              Termin direkt mit dir.
            </p>

            <div
              class="contact-status"
              :class="{ 'is-open': isOpenNow, 'is-closed': !isOpenNow, 'is-closing-soon': isClosingSoon, 'is-opening-soon': isOpeningSoon }"
            >
              <span class="contact-status-dot" aria-hidden="true"></span>
              <div>
                <strong>{{ shopStatusLabel }}</strong>
                <p>{{ shopStatusDetail }}</p>
              </div>
            </div>

            <div class="contact-actions">
              <a class="contact-action-btn is-primary" href="tel:+41447616222">Jetzt anrufen</a>
              <a class="contact-action-btn" href="https://www.google.com/maps/dir/?api=1&destination=Ottenbacherstrasse+2a,+8912+Obfelden" target="_blank" rel="noreferrer">Route planen</a>
            </div>

            <div class="contact-info-grid">
              <article class="contact-card">
                <span class="contact-card-label">Telefon</span>
                <p>044 761 62 22</p>
              </article>

              <article class="contact-card">
                <span class="contact-card-label">Standort</span>
                <p>
                  Ottenbacherstrasse 2a, 8912 Obfelden
                </p>
              </article>

              <article class="contact-card">
                <span class="contact-card-label">Terminvergabe</span>
                <p>Nur telefonisch</p>
              </article>

              <article class="contact-card">
                <span class="contact-card-label">Heute</span>
                <p>{{ shopStatusDetail }}</p>
              </article>
            </div>
          </div>

          <div class="hours-panel" data-reveal>
            <div class="hours-head">
              <p class="hours-kicker">Öffnungszeiten</p>
              <h3>Unsere Zeiten auf einen Blick</h3>
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

      <footer class="site-footer">
        <div class="site-footer-box">
          <div class="site-footer-links">
            <a
              class="site-footer-link"
              href="https://www.google.com/maps/dir/?api=1&destination=Ottenbacherstrasse+2a,+8912+Obfelden"
              target="_blank"
              rel="noreferrer"
              aria-label="Standort von Alis Coiffeur in Google Maps öffnen"
            >
              <span class="site-footer-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M12 21s6-5.34 6-11a6 6 0 1 0-12 0c0 5.66 6 11 6 11Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span class="site-footer-link-copy">
                <strong>Standort</strong>
                <span>Ottenbacherstrasse 2a, 8912 Obfelden</span>
              </span>
            </a>
            <a
              class="site-footer-link"
              href="https://www.instagram.com/alis_coiffeur_obfelden/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram von Alis Coiffeur öffnen"
            >
              <span class="site-footer-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.4" cy="6.6" r="1.2" />
                </svg>
              </span>
              <span class="site-footer-link-copy">
                <strong>Instagram</strong>
                <span>@alis_coiffeur_obfelden</span>
              </span>
            </a>
          </div>
          <p>Developed by David Kutlesa</p>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
@import "./restored.css";

:global(html),
:global(body) {
  max-width: 100%;
  overflow-x: hidden;
  background: #000;
}

.hero-title span {
  display: block;
}

.contact-status.is-opening-soon .contact-status-dot {
  background: #d98b2b;
  animation-duration: 1.4s;
  box-shadow: 0 0 0 8px rgba(217, 139, 43, 0.16);
}

.bg-poster {
  object-fit: cover;
  object-position: center;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 0;
  transition: opacity 0.3s ease;
}

.bg-video {
  opacity: 0;
  transition: opacity 0.35s ease;
}

.bg-video.is-ready {
  opacity: 1;
}

.services-section {
  min-height: auto;
  padding-top: 3rem;
  padding-bottom: 3.5rem;
}

.site-root {
  overflow-x: clip;
}

.nav-wrap.is-skip-enter {
  animation: nav-skip-in 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.page-content {
  opacity: 0;
  transform: none !important;
  transition: opacity 0.52s ease;
}

.page-content.is-visible {
  opacity: 1;
  transform: none !important;
}

.page-content.is-skip-enter {
  animation: page-skip-in 0.52s cubic-bezier(0.22, 1, 0.36, 1);
}

.services-slider {
  touch-action: pan-y;
}

.service-card {
  min-height: 380px;
  padding: 2rem 1.5rem 1.8rem;
}

.price-section {
  min-height: auto;
  margin-top: 0;
  padding-top: 2.5rem;
}

.site-footer {
  margin-top: 0;
  padding: 1.1rem 1rem 1.4rem;
  border-top: 1px solid rgba(215, 183, 103, 0.18);
  background: linear-gradient(180deg, rgba(8, 8, 8, 0.92), rgba(4, 4, 4, 0.98));
}

.site-footer-box {
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 0.2rem 0 0;
}

.site-footer-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  margin-bottom: 0.95rem;
}

.site-footer-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border: 1px solid rgba(215, 183, 103, 0.18);
  border-radius: 18px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02)),
    rgba(10, 10, 10, 0.8);
  color: #fff4d6;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.site-footer-link:hover {
  transform: translateY(-2px);
  border-color: rgba(215, 183, 103, 0.42);
  background:
    linear-gradient(145deg, rgba(215, 183, 103, 0.1), rgba(255, 255, 255, 0.03)),
    rgba(10, 10, 10, 0.88);
}

.site-footer-icon {
  flex: 0 0 auto;
  width: 2.6rem;
  height: 2.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(215, 183, 103, 0.22);
  border-radius: 999px;
  background: rgba(215, 183, 103, 0.08);
  color: #d7b767;
}

.site-footer-icon svg {
  width: 1.2rem;
  height: 1.2rem;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.site-footer-link-copy {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

.site-footer-link-copy strong {
  color: #fff4d6;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.site-footer-link-copy span {
  color: #d8c59b;
  font-size: 0.84rem;
  line-height: 1.35;
}

.site-footer-box p {
  margin: 0;
  color: #fff4d6;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.88rem;
  font-weight: 700;
}

[data-reveal] {
  opacity: 0;
  transform: translate3d(0, 18px, 0);
  transition: opacity 0.38s ease-out, transform 0.38s ease-out;
}

[data-reveal].is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}


.team-section {
  min-height: auto;
}

.gallery-shell {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.1rem;
}

.gallery-card {
  overflow: hidden;
  border: 1px solid rgba(215, 183, 103, 0.18);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(215, 183, 103, 0.14), transparent 26%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03)),
    rgba(14, 14, 14, 0.95);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.32), inset 0 0 0 1px rgba(215, 183, 103, 0.06);
}

.gallery-card-media {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #121212;
  position: relative;
  isolation: isolate;
}

.gallery-arrow-btn {
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid rgba(215, 183, 103, 0.32);
  border-radius: 999px;
  background: rgba(8, 8, 8, 0.56);
  color: #f6e7c1;
  font: inherit;
  font-size: 1rem;
  line-height: 1;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
}

.gallery-arrow-btn:hover {
  transform: translateY(-1px);
  background: rgba(215, 183, 103, 0.18);
  border-color: rgba(215, 183, 103, 0.56);
}

.gallery-before-after-slider {
  position: relative;
  height: 100%;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
  overscroll-behavior: contain;
  -webkit-tap-highlight-color: transparent;
}

.gallery-before-after-base,
.gallery-before-after-overlay {
  position: absolute;
  inset: 0;
  margin: 0;
  backface-visibility: hidden;
}

.gallery-before-after-overlay {
  will-change: clip-path;
  transform: translateZ(0);
  transition: clip-path 0.72s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-before-after-slider:active .gallery-before-after-overlay {
  transition: none;
}

.gallery-before-after-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  width: 1px;
  background: rgba(255, 244, 214, 0.55);
  box-shadow: 0 0 0 1px rgba(215, 183, 103, 0.08);
  transform: translateX(-50%);
  pointer-events: none;
  will-change: left;
  transition: left 0.72s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.gallery-before-after-divider.is-hidden {
  opacity: 0;
}

.gallery-before-after-slider:active .gallery-before-after-divider {
  transition: none;
}

.gallery-swipe-viewer {
  position: relative;
  height: 100%;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
  overscroll-behavior: contain;
  -webkit-tap-highlight-color: transparent;
}

.gallery-swipe-frame {
  position: absolute;
  inset: 0;
  margin: 0;
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.gallery-swipe-slide-enter-active,
.gallery-swipe-slide-leave-active {
  transition: opacity 0.32s ease, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.gallery-swipe-slide-enter-from {
  opacity: 0;
  transform: translateX(var(--gallery-swipe-enter-x, 22px)) scale(0.985);
}

.gallery-swipe-slide-leave-to {
  opacity: 0;
  transform: translateX(var(--gallery-swipe-leave-x, -22px)) scale(0.985);
}

@keyframes gallery-swipe-hint-float {
  0%,
  100% {
    transform: translateX(0);
    opacity: 0.72;
  }
  50% {
    transform: translateX(-8px);
    opacity: 1;
  }
}

.gallery-swipe-badge,
.gallery-lightbox-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  z-index: 2;
  border: 1px solid rgba(215, 183, 103, 0.3);
  border-radius: 999px;
  background: rgba(8, 8, 8, 0.62);
  color: #fff1cb;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.5rem 0.7rem;
}

.gallery-swipe-hint {
  position: absolute;
  right: 0.9rem;
  bottom: 0.9rem;
  z-index: 2;
  color: #f2e6c7;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  padding: 0;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.65);
  animation: gallery-swipe-hint-float 1.9s ease-in-out infinite;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.gallery-swipe-dots {
  display: flex;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.9rem 1rem 0;
}

.gallery-swipe-dots.is-lightbox {
  padding-top: 0;
}

.gallery-swipe-dot {
  width: 0.72rem;
  height: 0.72rem;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.24);
  padding: 0;
  transition: transform 0.2s ease, background 0.2s ease;
}

.gallery-swipe-dot.is-active {
  background: #d7b767;
  transform: scale(1.08);
}

.gallery-card-copy {
  display: grid;
  gap: 0.65rem;
  padding: 1rem 1rem 1.15rem;
}

.gallery-badge {
  width: fit-content;
  padding: 0.38rem 0.7rem;
  border: 1px solid rgba(215, 183, 103, 0.26);
  border-radius: 999px;
  color: #c89a49;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  background: rgba(215, 183, 103, 0.08);
}

.gallery-card-copy h3 {
  margin: 0;
  color: #f2e6c7;
  font-family: Oswald, sans-serif;
  font-size: clamp(1.5rem, 2.3vw, 2rem);
  line-height: 1.05;
}

.gallery-card-copy p {
  margin: 0;
  color: #c8b588;
  font-size: 0.98rem;
  line-height: 1.55;
}

.gallery-cta {
  display: grid;
  justify-items: center;
  gap: 1rem;
  margin-top: 1.6rem;
  text-align: center;
}

.gallery-cta p {
  margin: 0;
  max-width: 36rem;
  color: #e5d4ad;
  font-size: 1rem;
  line-height: 1.6;
}

.gallery-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0.9rem 1.35rem;
  border: 1px solid rgba(215, 183, 103, 0.42);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(215, 183, 103, 0.2), rgba(184, 134, 54, 0.32));
  color: #fff4d6;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.gallery-cta-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(215, 183, 103, 0.7);
  background: linear-gradient(135deg, rgba(215, 183, 103, 0.28), rgba(184, 134, 54, 0.42));
}

.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  align-items: center;
  justify-items: center;
  padding: 1.25rem;
  background:
    radial-gradient(circle at 20% 18%, rgba(215, 183, 103, 0.08), transparent 26%),
    radial-gradient(circle at 78% 82%, rgba(215, 183, 103, 0.06), transparent 30%),
    rgba(5, 5, 5, 0.94);
  backdrop-filter: blur(14px);
  overscroll-behavior: contain;
}

.gallery-lightbox-close {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  z-index: 4;
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(215, 183, 103, 0.28);
  border-radius: 999px;
  background: rgba(18, 18, 18, 0.72);
  color: #f6e7c1;
  font: inherit;
  font-size: 1.5rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.gallery-lightbox-close:hover {
  background: rgba(215, 183, 103, 0.12);
  border-color: rgba(215, 183, 103, 0.5);
  transform: translateY(-1px);
}

.gallery-lightbox-figure {
  margin: 0;
  display: grid;
  gap: 0.9rem;
  width: min(100%, 42rem);
}

.gallery-lightbox-swipe {
  position: relative;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
  overscroll-behavior: contain;
  -webkit-tap-highlight-color: transparent;
  padding-inline: 3.4rem;
  display: grid;
  justify-items: center;
}

.gallery-lightbox-stage {
  position: relative;
  width: 100%;
}

.gallery-lightbox-image {
  display: block;
  width: 100%;
  max-height: calc(100svh - 10rem);
  object-fit: contain;
  border-radius: 26px;
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(215, 183, 103, 0.08);
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.gallery-lightbox-caption {
  color: rgba(243, 223, 170, 0.88);
  text-align: center;
  font-size: 0.88rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.gallery-lightbox-stage .gallery-lightbox-badge {
  top: 1rem;
  left: 1rem;
}

.gallery-arrow-btn-lightbox {
  position: absolute;
  top: 50%;
  z-index: 3;
  width: 2.85rem;
  height: 2.85rem;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(8px);
  transform: translateY(-50%);
}

.gallery-arrow-btn-lightbox:hover {
  transform: translateY(-50%) scale(1.03);
}

.gallery-arrow-btn-lightbox.is-left {
  left: 0.4rem;
}

.gallery-arrow-btn-lightbox.is-right {
  right: 0.4rem;
}

.gallery-lightbox-enter-enter-active,
.gallery-lightbox-enter-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.gallery-lightbox-enter-enter-from,
.gallery-lightbox-enter-leave-to {
  opacity: 0;
}

.gallery-lightbox-enter-enter-from .gallery-lightbox-figure,
.gallery-lightbox-enter-leave-to .gallery-lightbox-figure {
  transform: translateY(14px) scale(0.97);
}

.gallery-lightbox-enter-enter-active .gallery-lightbox-figure,
.gallery-lightbox-enter-leave-active .gallery-lightbox-figure {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.service-price-link {
  color: #d7b767 !important;
  display: inline-block;
  font-size: 0.96rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-decoration-line: underline !important;
  text-decoration-color: rgba(215, 183, 103, 0.98) !important;
  text-decoration-thickness: 1px !important;
  text-underline-offset: 0.24rem;
  transition: opacity 0.2s ease;
}

.service-price-link:link,
.service-price-link:visited,
.service-price-link:hover,
.service-price-link:active,
.service-price-link:hover {
  color: #d7b767 !important;
  text-decoration-line: underline !important;
  text-decoration-color: rgba(215, 183, 103, 0.98) !important;
}

.about-ornament-top {
  top: 7rem;
  right: 7rem;
}

.about-ornament-bottom {
  bottom: 7rem;
  left: 7rem;
}

.about-scissors {
  opacity: 0.22;
  width: 12.5rem;
  height: 12.5rem;
  height: 12.5rem;
}

@media (width>900px) {
  .site-root {
    --nav-height: 86px;
  }

  .nav-wrap {
    gap: 1.4rem;
    min-height: 86px;
    padding: 0.6rem 2rem;
  }

  .brand-logo {
    font-size: clamp(2rem, 3.8vw, 3.35rem);
  }

  .brand-subline {
    font-size: 0.92rem;
  }

  .nav-menu {
    gap: clamp(0.8rem, 1vw, 1.2rem);
  }

  .nav-menu a {
    font-size: clamp(0.84rem, 0.9vw, 1rem);
  }

  .cta-btn {
    min-height: 52px;
    padding: 0.6rem 1.15rem;
    font-size: 0.92rem;
  }

  .hero-content {
    max-width: 760px;
    bottom: 4.7rem;
    left: 3rem;
  }

  .hero-rating-chip {
    margin-bottom: 1rem;
    padding: 0.6rem 0.9rem;
  }

  .hero-rating-score {
    font-size: 1.3rem;
  }

  .hero-rating-total {
    font-size: 0.9rem;
  }

  .hero-title {
    font-size: clamp(2.25rem, 4vw, 4.15rem);
    line-height: 1.02;
  }

  .hero-line {
    width: 180px;
    margin-top: 0.95rem;
  }

  .hero-subtitle {
    margin-top: 0.8rem;
    font-size: clamp(1.85rem, 2.8vw, 3rem);
  }

  .hero-description {
    max-width: 34rem;
    margin-top: 0.9rem;
    font-size: clamp(0.96rem, 1.1vw, 1.06rem);
    line-height: 1.6;
  }

  .hero-actions {
    gap: 0.8rem;
    margin-top: 1.35rem;
  }

  .hero-primary-btn,
  .hero-secondary-btn {
    min-height: 50px;
    padding: 0.8rem 1.2rem;
    font-size: 0.82rem;
  }

  .hero-facts {
    gap: 0.8rem;
    width: min(100%, 34rem);
    margin-top: 1.35rem;
  }

  .hero-fact {
    padding: 0.85rem 0.95rem;
  }

  .hero-fact span {
    font-size: 0.7rem;
  }

  .hero-fact strong {
    font-size: 0.94rem;
  }

  .gallery-shell {
    width: min(100%, 1040px);
  }

  .gallery-grid {
    gap: 0.9rem;
  }

  .gallery-card-media {
    aspect-ratio: 4 / 4.35;
  }

  .gallery-card-copy {
    gap: 0.55rem;
    padding: 0.85rem 0.9rem 0.95rem;
  }

  .gallery-card-copy h3 {
    font-size: clamp(1.35rem, 1.9vw, 1.75rem);
  }

  .gallery-card-copy p {
    font-size: 0.92rem;
  }
}

@media (width<=900px) {
  .nav-wrap {
    gap: 1rem;
    padding: 0.85rem 1.15rem;
  }

  .brand-logo {
    font-size: clamp(1.8rem, 5.6vw, 2.6rem);
  }

  .brand-subline {
    font-size: 0.82rem;
  }

  .nav-menu {
    gap: 0.7rem 0.9rem;
  }

  .nav-menu a {
    font-size: 0.86rem;
  }

  .cta-btn {
    min-height: 48px;
    padding: 0.55rem 0.95rem;
    font-size: 0.82rem;
  }

  .hero-content {
    max-width: 34rem;
    bottom: 2.4rem;
    left: 1.6rem;
    right: 1.6rem;
  }

  .hero-title {
    font-size: clamp(2.1rem, 6.1vw, 3.35rem);
    line-height: 1;
  }

  .hero-line {
    width: 140px;
    margin-top: 0.8rem;
  }

  .hero-subtitle {
    margin-top: 0.75rem;
    font-size: clamp(1.45rem, 4vw, 2.3rem);
  }

  .hero-description {
    max-width: 28rem;
    font-size: 0.94rem;
    line-height: 1.55;
  }

  .hero-actions {
    gap: 0.7rem;
    margin-top: 1.15rem;
  }

  .hero-primary-btn,
  .hero-secondary-btn {
    min-height: 48px;
    padding: 0.75rem 1.05rem;
    font-size: 0.8rem;
  }

  .hero-facts {
    gap: 0.7rem;
    width: min(100%, 28rem);
    margin-top: 1.1rem;
  }

  .hero-fact {
    padding: 0.8rem 0.85rem;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
  }

  .gallery-card-media {
    aspect-ratio: 4 / 4.6;
  }

  .gallery-card-copy {
    padding: 0.78rem 0.8rem 0.9rem;
  }

  .gallery-card-copy h3 {
    font-size: 1.28rem;
  }

  .gallery-card-copy p {
    font-size: 0.88rem;
    line-height: 1.45;
  }
}

@media (width<=640px) {
  .nav-wrap,
  .nav-toggle,
  .hero-secondary-btn,
  .nav-menu {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  .bg-video {
    transform: none;
    will-change: auto;
  }

  .about-section,
  .services-section,
  .price-section,
  .team-section,
  .reviews-section,
  .contact-section {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .about-section,
  .services-section,
  .price-section,
  .team-section,
  .reviews-section {
    min-height: auto;
  }

  .about-section {
    min-height: 100svh;
    padding-top: 4rem;
    padding-bottom: 4rem;
    align-items: center;
  }

  .hero-content {
    width: min(100% - 2rem, 20.5rem);
    inset: auto 1rem 2.2rem;
    text-align: left;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 0.28rem;
  }

  .hero-title {
    max-width: 8.8ch;
    font-size: clamp(1.8rem, 7.8vw, 2.4rem);
    line-height: 0.98;
  }

  .hero-title span {
    display: block;
  }

  .hero-line {
    width: 96px;
    margin-top: 0.65rem;
  }

  .hero-description {
    max-width: 19.5rem;
    font-size: 0.86rem;
    line-height: 1.45;
  }

  .hero-subtitle {
    margin-top: 0.7rem;
    font-size: clamp(1.35rem, 6vw, 1.85rem);
  }

  .hero-actions {
    width: 100%;
    gap: 0.55rem;
    margin-top: 0.9rem;
  }

  .hero-primary-btn,
  .hero-secondary-btn,
  .contact-action-btn {
    min-height: 48px;
    padding: 0.78rem 1rem;
    font-size: 0.8rem;
  }

  .services-section {
    padding-top: 0.4rem;
    padding-bottom: 1.8rem;
  }

  .services-head,
  .price-head,
  .team-copy,
  .reviews-copy {
    margin-bottom: 1.5rem;
  }

  .services-head h2,
  .price-head h2,
  .team-copy h2,
  .reviews-copy h2,
  .contact-copy h2 {
    font-size: clamp(2.2rem, 9.8vw, 3rem);
  }

  .services-head p,
  .price-intro,
  .team-intro,
  .reviews-intro,
  .contact-intro {
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .service-card,
  .price-card,
  .contact-copy,
  .hours-panel,
  .reviews-summary-card {
    border-radius: 20px;
  }

  .service-card {
    min-height: 0;
    padding: 1.2rem 0.95rem;
    gap: 0.8rem;
  }

  .service-card h3 {
    font-size: clamp(1.65rem, 7.8vw, 2.2rem);
  }

  .about-ornament {
    display: none;
  }

  .service-card-copy p,
  .service-eyebrow {
    font-size: 0.82rem;
  }

  .service-price-link {
    color: #d7b767 !important;
    font-size: 0.82rem;
    text-decoration-line: underline !important;
    text-decoration-color: rgba(215, 183, 103, 0.98) !important;
  }

  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
  }

  .gallery-swipe-hint {
    font-size: 0.66rem;
    padding: 0;
  }

  .gallery-swipe-badge,
  .gallery-lightbox-badge {
    top: 0.75rem;
    left: 0.75rem;
    font-size: 0.68rem;
    padding: 0.45rem 0.62rem;
  }

  .gallery-card-copy {
    padding: 0.75rem 0.8rem 0.85rem;
  }

  .gallery-badge {
    max-width: 100%;
    padding: 0.34rem 0.58rem;
    font-size: 0.66rem;
    letter-spacing: 0.1em;
    white-space: nowrap;
  }

  .gallery-card-copy h3 {
    font-size: 1.22rem;
  }

  .gallery-cta {
    gap: 0.75rem;
    margin-top: 1.2rem;
  }

  .gallery-cta p {
    font-size: 0.85rem;
  }

  .gallery-cta-btn {
    min-height: 44px;
    padding: 0.68rem 0.95rem;
    font-size: 0.72rem;
  }

  .gallery-lightbox {
    padding: 0.75rem 0.5rem 0.85rem;
    align-items: center;
  }

  .gallery-lightbox-close {
    top: 0.55rem;
    right: 0.55rem;
    width: 2.7rem;
    height: 2.7rem;
    font-size: 1.3rem;
  }

  .gallery-lightbox-figure {
    width: min(100%, 100vw - 1rem);
    gap: 0.55rem;
    margin-top: 0;
  }

  .gallery-lightbox-swipe {
    padding-inline: 0.25rem;
    cursor: ew-resize;
  }

  .gallery-lightbox-stage {
    width: 100%;
  }

  .gallery-lightbox-image {
    width: 100%;
    max-height: calc(100svh - 8.9rem);
    border-radius: 22px;
  }

  .gallery-arrow-btn-lightbox {
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
    width: 2.7rem;
    height: 2.7rem;
    background: rgba(12, 12, 12, 0.58);
  }

  .gallery-arrow-btn-lightbox:hover {
    transform: translateY(-50%);
  }

  .gallery-arrow-btn-lightbox.is-left {
    left: 0.7rem;
  }

  .gallery-arrow-btn-lightbox.is-right {
    right: 0.7rem;
  }

  .gallery-lightbox-caption {
    font-size: 0.78rem;
    line-height: 1.3;
    padding-inline: 0.8rem;
    opacity: 0.86;
  }

  .gallery-swipe-dots.is-lightbox {
    padding-top: 0.35rem;
  }

  .price-section {
    padding-top: 1rem;
    padding-bottom: 2.3rem;
  }

  .price-shell {
    gap: 1rem;
  }

  .price-mobile-note {
    margin-top: 0.6rem;
    padding: 0.42rem 0.72rem;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
  }

  .price-tabs {
    gap: 0.5rem;
    padding-bottom: 0.05rem;
  }

  .price-tab {
    min-width: 164px;
    padding: 0.58rem 0.78rem;
    font-size: 0.72rem;
    line-height: 1.15;
  }

  .price-category-head h3 {
    font-size: clamp(1.75rem, 8vw, 2.35rem);
  }

  .price-category-head p,
  .price-card-head p,
  .price-duration,
  .price-value,
  .price-label {
    font-size: 0.86rem;
  }

  .price-card-head,
  .price-rows,
  .contact-status,
  .hours-row {
    padding-left: 0.85rem;
    padding-right: 0.85rem;
  }

  .price-row {
    padding: 0.6rem 0;
  }

  .reviews-section,
  .contact-section {
    padding-top: 2.8rem;
    padding-bottom: 3.6rem;
  }

  .contact-copy,
  .hours-panel {
    padding: 1rem;
  }

  .reviews-copy {
    padding-top: 0.7rem;
  }

  .reviews-copy h2 {
    line-height: 1.02;
  }

  .contact-info-grid {
    gap: 0.75rem;
  }

  .site-footer {
    padding: 0.7rem 1rem 1.25rem;
  }

  .site-footer-box {
    padding: 0;
  }

  .site-footer-links {
    grid-template-columns: 1fr;
    gap: 0.7rem;
    margin-bottom: 0.85rem;
  }

  .site-footer-link {
    padding: 0.82rem 0.9rem;
    border-radius: 16px;
  }

  .site-footer-box p {
    font-size: 0.78rem;
    letter-spacing: 0.03em;
  }

  .logo-build {
    width: min(84vw, 22rem);
    padding-inline: 0.5rem;
  }

  .flourish-top,
  .flourish-bottom {
    display: none;
  }

  .top-mark {
    display: grid;
    align-items: start;
    gap: 0.14rem;
    margin-bottom: 0.38rem;
  }

  .top-line {
    width: 3.15rem;
    height: 2px;
    transform: translateY(-0.18rem);
  }

  .swirl {
    height: 1.4rem;
    margin-top: 0.08rem;
  }

  .swirl:before {
    height: 1rem;
  }

  .swirl:after {
    height: 0.72rem;
  }

  .logo-core {
    margin-top: 0.55rem;
  }

  .line-title {
    margin-top: 0.2rem;
  }

  .line-subtitle {
    margin-top: 0.15rem;
  }

  .nav-wrap {
    padding: 0.8rem 0.9rem;
  }

  .nav-toggle {
    width: 48px;
    height: 48px;
    border-radius: 13px;
  }

  .nav-toggle span {
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .nav-toggle span:first-child {
    top: calc(50% - 8px);
  }

  .nav-toggle span:nth-child(2) {
    top: 50%;
  }

  .nav-toggle span:nth-child(3) {
    top: calc(50% + 8px);
  }

  .nav-toggle.is-active span:first-child {
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .nav-toggle.is-active span:nth-child(3) {
    top: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    min-height: 100dvh;
    padding:
      max(calc(var(--nav-height) + 1rem), env(safe-area-inset-top) + 5.5rem)
      1rem
      max(2rem, env(safe-area-inset-bottom) + 1.2rem);
  }

  .nav-menu a {
    width: min(100%, 22rem);
    padding: 0.45rem 0.7rem;
    border: 0;
    background: transparent;
    color: rgba(245, 241, 230, 0.92);
    letter-spacing: 0.05em;
    font-family: Oswald, sans-serif;
    font-size: 1.22rem;
    font-weight: 500;
    line-height: 1.08;
    text-align: center;
    text-transform: uppercase;
    position: relative;
  }

  .nav-menu a.is-active {
    color: #e3bf67;
    text-shadow: 0 0 18px rgba(215, 183, 103, 0.18);
  }
}

@keyframes nav-skip-in {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes page-skip-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-video {
    display: none;
  }

  .loader-wrap *,
  .page-content,
  .nav-wrap,
  .nav-menu,
  .hero-primary-btn,
  .hero-secondary-btn,
  .contact-action-btn {
    animation: none !important;
    transition: none !important;
  }
}
</style>























