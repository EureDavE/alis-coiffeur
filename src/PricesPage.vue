<script setup>
import { computed, ref } from 'vue'
import { priceCategories } from './data/priceCategories'

const selectedPriceCategory = ref(0)
const currentPriceCategory = computed(() => priceCategories[selectedPriceCategory.value] ?? priceCategories[0])
const remainingPriceCategories = computed(() => Math.max(priceCategories.length - 1, 0))

const selectPriceCategory = (index) => {
  selectedPriceCategory.value = index
}
</script>

<template>
  <main class="prices-page">
    <header class="prices-nav">
      <a class="prices-brand" href="./index.html">
        <strong>ALIS</strong>
        <span>Coiffeur mit Stil</span>
      </a>

      <nav class="prices-links" aria-label="Seitennavigation">
        <a href="./index.html">Start</a>
        <a href="./index.html#leistungen">Leistungen</a>
        <a href="./index.html#team">Galerie</a>
        <a href="./index.html#kontakt">Kontakt</a>
      </nav>

      <a class="prices-nav-cta" href="tel:+41447616222">Jetzt anrufen</a>
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

        <p v-if="remainingPriceCategories > 0" class="price-mobile-note">
          +{{ remainingPriceCategories }} weitere Kategorien
        </p>

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
      <a class="mobile-action-btn is-secondary" href="./index.html">Startseite</a>
      <a class="mobile-action-btn is-primary" href="tel:+41447616222">Jetzt anrufen</a>
    </div>
  </main>
</template>

<style scoped>
@import "./restored.css";

:global(html),
:global(body) {
  margin: 0;
  max-width: 100%;
  overflow-x: hidden;
  background: #050505;
}

.prices-page {
  min-height: 100vh;
  color: #ead08b;
  background:
    radial-gradient(circle at 0 0, rgba(243, 223, 170, 0.18), transparent 24%),
    radial-gradient(circle at 100% 100%, rgba(215, 183, 103, 0.18), transparent 28%),
    linear-gradient(180deg, #261c10, #171108 38%, #171108 100%);
}

.prices-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;
  padding: 1rem 1.4rem;
  border-bottom: 1px solid rgba(215, 183, 103, 0.16);
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
}

.prices-brand {
  display: grid;
  text-decoration: none;
  color: #fff4d6;
}

.prices-brand strong {
  font-family: Oswald, sans-serif;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 0.95;
  letter-spacing: 0.08em;
}

.prices-brand span {
  color: #d8c39a;
  font-family: "Cormorant Garamond", serif;
  font-size: 0.95rem;
}

.prices-links {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.prices-links a,
.prices-nav-cta {
  color: #f0e2bf;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.82rem;
  font-weight: 700;
}

.prices-nav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0.8rem 1.1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #d7b767, #b88636);
  color: #130f09;
}

.prices-hero {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 5.2rem 1.4rem 2.4rem;
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
  gap: 1.4rem;
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
  padding: 0.35rem;
  border: 1px solid rgba(215, 183, 103, 0.12);
  border-radius: 30px;
  background: rgba(12, 10, 7, 0.36);
  box-shadow: inset 0 0 0 1px rgba(215, 183, 103, 0.04);
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
  .prices-nav {
    padding-inline: 1rem;
  }

  .prices-links {
    display: none;
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
  .prices-nav {
    gap: 0.8rem;
    padding: 0.85rem;
  }

  .prices-brand strong {
    font-size: 1.55rem;
  }

  .prices-brand span {
    font-size: 0.78rem;
  }

  .prices-nav-cta {
    min-height: 42px;
    padding: 0.68rem 0.9rem;
    font-size: 0.72rem;
  }

  .prices-hero {
    padding: 2.6rem 1rem 1.4rem;
  }

  .prices-intro {
    max-width: 23rem;
    font-size: 0.84rem;
    line-height: 1.55;
  }

  .price-section {
    padding: 0 1rem 5.8rem;
  }

  .price-tabs {
    display: flex;
    gap: 0.55rem;
    width: auto;
    max-width: none;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 0.3rem;
    scroll-snap-type: x proximity;
    position: sticky;
    top: 4.5rem;
    z-index: 8;
    margin-inline: -0.15rem;
    background: linear-gradient(180deg, rgba(23, 17, 8, 0.94), rgba(23, 17, 8, 0.76));
    backdrop-filter: blur(8px);
    border-radius: 24px;
  }

  .price-tabs::-webkit-scrollbar {
    display: none;
  }

  .price-tab {
    flex: none;
    min-width: 168px;
    scroll-snap-align: start;
    padding: 0.72rem 0.82rem;
    font-size: 0.74rem;
  }

  .price-mobile-note {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.15rem;
    font-size: 0.68rem;
  }

  .price-tabs-hint {
    display: block;
    margin-top: -0.15rem;
    color: #bfa97b;
    font-size: 0.74rem;
    line-height: 1.45;
    text-align: center;
  }

  .price-category-head h2 {
    font-size: clamp(1.75rem, 8.4vw, 2.25rem);
  }

  .price-category-head p {
    font-size: 0.8rem;
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
