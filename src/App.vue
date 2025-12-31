<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Footer from './components/Footer.vue'

const { locale } = useI18n()

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'pt' : 'en'
}
</script>

<template>
  <div class="min-h-screen">
    <nav class="flex justify-between items-center p-4 border-b">
      <div class="flex gap-4">
        <RouterLink to="/" class="font-medium hover:underline">
          {{ $t('nav.home') }}
        </RouterLink>
        <RouterLink to="/contacts" class="font-medium hover:underline">
          {{ $t('nav.contacts') }}
        </RouterLink>
      </div>

      <button 
        @click="toggleLanguage" 
        class="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {{ locale === 'en' ? 'PT' : 'EN' }}
      </button>
    </nav>

    <RouterView />
    <Footer />
  </div>
</template>


