<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const meta = inject<any>('meta')

const toggleLanguage = () => {
  locale.value = locale.value === 'en' ? 'pt' : 'en'
}
</script>

<template>
  <Teleport to="head">
    <title>{{ meta.title }}</title>

    <meta property="og:title" :content="meta.ogTitle" />
    <meta property="og:description" :content="meta.ogDescription" />
    <meta property="og:image" :content="meta.ogImage" />
    <meta property="og:url" :content="meta.ogUrl" />
    <meta property="og:type" :content="meta.ogType" />

    <meta name="twitter:title" :content="meta.ogTitle" />
    <meta name="twitter:description" :content="meta.ogDescription" />
    <meta name="twitter:image" :content="meta.ogImage" />
  </Teleport>

  <nav class="flex justify-between items-center p-4 border-b">
    <div class="flex gap-4">
      <RouterLink to="/" class="font-medium hover:underline">
        {{ $t('nav.home') }}
      </RouterLink>
      <RouterLink to="/projects" class="font-medium hover:underline">
        {{ $t('nav.projects') }}
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
</template>
