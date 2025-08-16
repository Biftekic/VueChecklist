<template>
  <div class="skip-links">
    <a
      href="#main-content"
      class="skip-link"
      @click.prevent="skipToMain"
    >
      Skip to main content
    </a>
    <a
      href="#navigation"
      class="skip-link"
      @click.prevent="skipToNavigation"
    >
      Skip to navigation
    </a>
    <a
      v-if="hasSearch"
      href="#search"
      class="skip-link"
      @click.prevent="skipToSearch"
    >
      Skip to search
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  hasSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasSearch: false
})

const skipToMain = () => {
  const main = document.querySelector('#main-content, main, [role="main"]') as HTMLElement
  if (main) {
    main.tabIndex = -1
    main.focus()
    main.scrollIntoView({ behavior: 'smooth' })
  }
}

const skipToNavigation = () => {
  const nav = document.querySelector('#navigation, nav, [role="navigation"]') as HTMLElement
  if (nav) {
    nav.tabIndex = -1
    nav.focus()
    nav.scrollIntoView({ behavior: 'smooth' })
  }
}

const skipToSearch = () => {
  const search = document.querySelector('#search, [role="search"], [type="search"]') as HTMLElement
  if (search) {
    search.tabIndex = -1
    search.focus()
    search.scrollIntoView({ behavior: 'smooth' })
  }
}

// Make skip links visible on focus
onMounted(() => {
  const skipLinks = document.querySelectorAll('.skip-link')
  skipLinks.forEach(link => {
    link.addEventListener('focus', () => {
      link.classList.add('skip-link--focused')
    })
    link.addEventListener('blur', () => {
      link.classList.remove('skip-link--focused')
    })
  })
})
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--v-primary-base);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  transition: top 0.2s ease-in-out;
  white-space: nowrap;
}

.skip-link:nth-child(2) {
  left: 150px;
}

.skip-link:nth-child(3) {
  left: 300px;
}

.skip-link:focus,
.skip-link--focused {
  top: 0;
  outline: 2px solid var(--v-primary-darken2);
  outline-offset: 2px;
}

.skip-link:hover {
  background: var(--v-primary-darken1);
}

@media (max-width: 600px) {
  .skip-link {
    padding: 6px 12px;
    font-size: 0.875rem;
  }
  
  .skip-link:nth-child(2) {
    left: 120px;
  }
  
  .skip-link:nth-child(3) {
    left: 240px;
  }
}
</style>