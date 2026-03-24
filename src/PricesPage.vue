<script setup>
import { computed, ref } from 'vue'
import { priceCategories } from './data/priceCategories'

const SKIP_LOADER_KEY = 'alis-skip-loader-once'
const selectedPriceCategory = ref(0)
const mobileMenuOpen = ref(false)
const currentPriceCategory = computed(() => priceCategories[selectedPriceCategory.value] ?? priceCategories[0])
const navItems = [
  { id: 'start', label: 'Start', href: './index.html' },
  { id: 'ueber-uns', label: 'Über Uns', href: './index.html#ueber-uns' },
  { id: 'leistungen', label: 'Leistungen', href: './index.html#leistungen' },
  { id: 'preisliste', label: 'Preisliste', href: './preise.html' },
  { id: 'team', label: 'Galerie', href: './index.html#team' },
  { id: 'kontakt', label: 'Kontakt', href: './index.html#kontakt' },
]

const selectPriceCategory = (index) => {
  selectedPriceCategory.value = index
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const markHomeNavigation = () => {
  window.sessionStorage.setItem(SKIP_LOADER_KEY, 'true')
}
</script>

<template>
  <main class="prices-page">
    <header class="nav-wrap" :class="{ 'is-mobile-open': mobileMenuOpen }">
      <a class="brand" href="./index.html" @click="closeMobileMenu(); markHomeNavigation()">
        <span class="brand-logo">ALIS</span>
        <span class="brand-subline">Coiffeur mit Stil</span>
      </a>

      <button
        type="button"
        class="nav-toggle"
        :class="{ 'is-active': mobileMenuOpen }"
        aria-controls="mobile-navigation"
        :aria-expanded="mobileMenuOpen ? 'true' : 'false'"
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
          :class="{ 'is-active': item.id === 'preisliste' }"
          @click="closeMobileMenu(); item.id !== 'preisliste' ? markHomeNavigation() : null"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="nav-right">
        <a class="cta-btn" href="tel:+41447616222">Jetzt anrufen</a>
      </div>
    </header>

    <section class="prices-hero">
      <p class="prices-kicker">Transparente Preise</p>
      <h1>Preisliste</h1>
      <p class="prices-intro">
        Alle Leistungen auf einen Blick. Zeiten sind Richtwerte und können je nach Haarlänge,
        Aufwand und Wunschlook leicht variieren.
      </p>
    </section>

    <section class="price-section">
      <div class="price-shell">
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

        <p class="price-tabs-hint">Wische auf Mobile durch die Kategorien oder tippe direkt auf einen Bereich.</p>
        <section class="price-category">
          <div class="price-category-head">
            <h2>{{ currentPriceCategory.title }}</h2>
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
                <h3>{{ group.title }}</h3>
                <p>{{ group.items.length }} Positionen</p>
              </div>

              <div class="price-table-head">
                <span>Leistung</span>
                <span>Dauer</span>
                <span>Preis</span>
              </div>

              <div class="price-rows">
                <div
                  v-for="item in group.items"
                  :key="`${group.title}-${item.label}-${item.price}`"
                  class="price-row"
                >
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

    <footer class="site-footer">
      <div class="site-footer-box">
        <p>Website by David Kutlesa</p>
      </div>
    </footer>

    <div class="mobile-action-bar">
      <a class="mobile-action-btn is-secondary" href="./index.html" @click="markHomeNavigation()">Startseite</a>
      <a class="mobile-action-btn is-primary" href="tel:+41447616222">Jetzt anrufen</a>
    </div>
  </main>
</template>

<style scoped>
:global(html),
:global(body) {
  margin: 0;
  max-width: 100%;
  overflow-x: hidden;
  background: #050505;
}

:global(*) {
  box-sizing: border-box;
}

.prices-page {
  --nav-height: 94px;
  min-height: 100vh;
  color: #ead08b;
  background:
    radial-gradient(circle at 0 0, rgba(243, 223, 170, 0.18), transparent 24%),
    radial-gradient(circle at 100% 100%, rgba(215, 183, 103, 0.18), transparent 28%),
    linear-gradient(180deg, #261c10, #171108 38%, #171108 100%);
}

.nav-wrap {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 2rem;
  width: 100%;
  min-height: var(--nav-height);
  padding: 0.75rem 2rem;
  background: linear-gradient(180deg, rgba(21, 21, 21, 0.92), rgba(21, 21, 21, 0.42));
  border-bottom: 1px solid rgba(215, 183, 103, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.22);
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  justify-self: start;
  color: inherit;
  text-decoration: none;
  line-height: 0.95;
}

.brand-logo {
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-family: Oswald, sans-serif;
  font-size: clamp(2.3rem, 4.5vw, 3.8rem);
  font-weight: 500;
}

.brand-subline {
  color: #fff;
  letter-spacing: 0.02em;
  font-family: "Cormorant Garamond", serif;
  font-size: 1rem;
}

.nav-right {
  display: flex;
  align-items: center;
  justify-self: end;
}

.nav-toggle {
  position: relative;
  z-index: 22;
  display: none;
  align-items: center;
  justify-content: center;
  justify-self: end;
  width: 54px;
  height: 54px;
  padding: 0;
  border: 1px solid rgba(215, 183, 103, 0.24);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
}

.nav-toggle span {
  position: absolute;
  width: 22px;
  height: 2px;
  border-radius: 999px;
  background: #f3e5c0;
  transition: transform 0.25s ease, opacity 0.2s ease, top 0.25s ease;
}

.nav-toggle span:first-child {
  top: 18px;
}

.nav-toggle span:nth-child(2) {
  top: 26px;
}

.nav-toggle span:nth-child(3) {
  top: 34px;
}

.nav-toggle.is-active span:first-child {
  top: 26px;
  transform: rotate(45deg);
}

.nav-toggle.is-active span:nth-child(2) {
  opacity: 0;
}

.nav-toggle.is-active span:nth-child(3) {
  top: 26px;
  transform: rotate(-45deg);
}

.nav-menu {
  display: flex;
  justify-content: center;
  gap: 1.1rem;
  padding: 0;
  text-transform: uppercase;
  font-weight: 600;
}

.nav-menu a {
  padding: 0.35rem 0.2rem;
  border-radius: 999px;
  color: #ececec;
  letter-spacing: 0.025em;
  font-size: clamp(0.92rem, 1vw, 1.05rem);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.nav-menu a:hover {
  color: #d7b767;
}

.nav-menu .is-active {
  color: #d7b767;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;
  padding: 0.65rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  background: linear-gradient(135deg, #c89a49, #d7b767);
  color: #130f09;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
}

.prices-hero {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: calc(var(--nav-height) + 3.1rem) 1.4rem 1.35rem;
  text-align: center;
  background: transparent;
}

.prices-kicker {
  margin: 0 0 0.8rem;
  color: #c89a49;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: 0.82rem;
}

.prices-hero h1 {
  margin: 0;
  color: #f5e7c3;
  text-transform: uppercase;
  font-family: Oswald, sans-serif;
  font-size: clamp(3.3rem, 8vw, 6rem);
  line-height: 0.95;
}

.prices-intro {
  max-width: 44rem;
  margin: 1.25rem auto 0;
  color: #d0bf98;
  font-size: 1.02rem;
  line-height: 1.75;
}

.price-section {
  padding: 0 1.4rem 4.5rem;
  background: transparent;
}

.price-shell {
  display: grid;
  gap: 0.8rem;
  width: min(100%, 1180px);
  margin: 0 auto;
}

.price-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.85rem;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.price-tab {
  cursor: pointer;
  border: 1px solid rgba(215, 183, 103, 0.2);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: #d9c59c;
  padding: 0.9rem 1.1rem;
  font: inherit;
  text-align: center;
  line-height: 1.3;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.price-tab.is-active {
  border-color: rgba(215, 183, 103, 0.62);
  background: linear-gradient(145deg, rgba(215, 183, 103, 0.2), rgba(215, 183, 103, 0.08));
  color: #fff4d6;
}

.price-tabs-hint {
  display: none;
}

.price-mobile-note {
  display: none;
  width: fit-content;
  margin: 0 auto;
  padding: 0.55rem 0.85rem;
  border: 1px solid rgba(215, 183, 103, 0.22);
  border-radius: 999px;
  background: rgba(215, 183, 103, 0.08);
  color: #f0dfb7;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.76rem;
  font-weight: 700;
}

.price-category {
  display: grid;
  gap: 1.1rem;
  width: 100%;
}

.price-category-head {
  text-align: center;
  max-width: 46rem;
  margin: 0 auto;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(215, 183, 103, 0.16);
}

.price-category-head h2 {
  margin: 0;
  color: #f2e6c7;
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(2.35rem, 4vw, 3.4rem);
  line-height: 1.05;
}

.price-category-head p {
  margin: 0.4rem 0 0;
  color: #a89670;
  font-size: 1rem;
}

.price-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.price-card {
  overflow: hidden;
  min-width: 0;
  border: 1px solid rgba(215, 183, 103, 0.16);
  border-radius: 22px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(14, 14, 14, 0.96);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.price-card.is-centered {
  grid-column: 1 / -1;
  justify-self: center;
  width: min(100%, calc(50% - 0.45rem));
}

.price-card:hover {
  transform: translateY(-2px);
  border-color: rgba(215, 183, 103, 0.28);
  box-shadow: 0 28px 56px rgba(0, 0, 0, 0.32);
}

.price-card-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem 0.8rem;
}

.price-card-head h3 {
  margin: 0;
  color: #f0dfb7;
  font-family: Oswald, sans-serif;
  font-size: 1.95rem;
  line-height: 1.15;
}

.price-card-head p {
  margin: 0;
  color: #a89670;
  font-size: 1rem;
  white-space: nowrap;
}

.price-table-head {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) 110px 90px;
  gap: 1rem;
  padding: 0.6rem 1.2rem;
  border-top: 1px solid rgba(215, 183, 103, 0.14);
  border-bottom: 1px solid rgba(215, 183, 103, 0.14);
  color: #8f7f5a;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.8rem;
}

.price-rows {
  display: grid;
  padding: 0 1.2rem 0.4rem;
}

.price-row {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) 110px 90px;
  gap: 1rem;
  align-items: start;
  padding: 0.72rem 0;
  border-top: 1px solid rgba(215, 183, 103, 0.12);
}

.price-row:first-child {
  border-top: 0;
}

.price-meta {
  min-width: 0;
}

.price-label {
  color: #f2e6c7;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
}

.price-duration {
  color: #a89b79;
  font-size: 1rem;
  line-height: 1.4;
}

.price-value {
  color: #d7b767;
  font-size: 1.06rem;
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
}

.site-footer {
  padding: 1rem 1rem 1.5rem;
  border-top: 1px solid rgba(215, 183, 103, 0.16);
  background: rgba(5, 5, 5, 0.9);
}

.site-footer-box {
  width: min(100%, 1180px);
  margin: 0 auto;
}

.site-footer-box p {
  margin: 0;
  text-align: center;
  color: #fff4d6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.86rem;
  font-weight: 700;
}

@media (width <= 900px) {
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

  .prices-hero {
    padding: calc(var(--nav-height) + 2rem) 1.15rem 1.1rem;
  }

  .prices-intro {
    max-width: 32rem;
    font-size: 0.92rem;
    line-height: 1.6;
  }

  .price-shell {
    gap: 1rem;
  }

  .price-tabs {
    gap: 0.65rem;
    max-width: 100%;
  }

  .price-tab {
    padding: 0.82rem 0.9rem;
    font-size: 0.86rem;
  }

  .price-groups {
    grid-template-columns: 1fr;
  }

  .price-card.is-centered {
    grid-column: auto;
    width: 100%;
  }
}

@media (width <= 640px) {
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
    gap: 0.85rem;
    padding: calc(var(--nav-height) + 1.3rem) 1rem 6rem;
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

  .prices-hero {
    padding: calc(var(--nav-height) + 1.35rem) 1rem 0.95rem;
  }

  .prices-intro {
    max-width: 21rem;
    font-size: 0.82rem;
    line-height: 1.5;
  }

  .price-section {
    padding: 0 1rem 5.8rem;
  }

  .price-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.45rem;
    width: 100%;
    max-width: none;
    overflow: visible;
    padding: 0;
    position: sticky;
    top: 4.5rem;
    z-index: 8;
    margin-inline: 0;
    background: transparent;
    backdrop-filter: none;
    border-radius: 0;
  }

  .price-tab {
    min-width: 0;
    padding: 0.64rem 0.65rem;
    font-size: 0.7rem;
    line-height: 1.22;
  }

  .price-tabs-hint {
    display: none;
  }

  .price-category-head h2 {
    font-size: clamp(1.65rem, 8vw, 2.1rem);
  }

  .price-category-head p {
    font-size: 0.76rem;
  }

  .price-card {
    border-radius: 18px;
  }

  .price-card-head {
    display: block;
    padding: 0.82rem 0.9rem 0.65rem;
  }

  .price-card-head h3 {
    font-size: 1.3rem;
  }

  .price-card-head p {
    margin-top: 0.35rem;
    font-size: 0.78rem;
  }

  .price-table-head {
    display: none;
  }

  .price-rows {
    padding: 0 0.9rem 0.25rem;
  }

  .price-row {
    grid-template-columns: 1fr;
    gap: 0.24rem;
    padding: 0.62rem 0;
  }

  .price-label,
  .price-duration,
  .price-value {
    font-size: 0.88rem;
    text-align: left;
  }

  .site-footer-box p {
    font-size: 0.78rem;
  }

  .mobile-action-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 0.7rem;
    padding: 0.85rem 1rem calc(0.85rem + env(safe-area-inset-bottom));
    background: linear-gradient(180deg, rgba(7, 7, 7, 0.08), rgba(7, 7, 7, 0.94) 24%);
    backdrop-filter: blur(10px);
  }

  .mobile-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    border-radius: 999px;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.74rem;
    font-weight: 700;
  }

  .mobile-action-btn.is-secondary {
    border: 1px solid rgba(215, 183, 103, 0.22);
    background: rgba(255, 255, 255, 0.05);
    color: #f2e6c7;
  }

  .mobile-action-btn.is-primary {
    background: linear-gradient(135deg, #d7b767, #b88636);
    color: #130f09;
  }
}

@media (width > 640px) {
  .mobile-action-bar {
    display: none;
  }
}
</style>
