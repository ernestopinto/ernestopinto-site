<script setup lang="ts">
import { provide, reactive } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const meta = reactive({
  title: 'ernestopinto-site',
  description: 'We are a way for the universe to know itself.',
  ogTitle: 'ernestopinto.net',
  ogDescription: 'We are a way for the universe to know itself.',
  ogImage: 'https://ik.imagekit.io/v5b1vx0mg/IMG_4801-2.jpg',
  ogUrl: 'https://ernestopinto.net',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

provide('meta', meta)
</script>

<template>
  <div class="min-h-screen">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>
