<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { lunaService } from '../services/luna.service';
import type { Subscription } from 'rxjs';

const blogData = ref<any>(null);
const error = ref<string | null>(null);
let subscription: Subscription;

onMounted(() => {
  subscription = lunaService.get<any>('/blog').subscribe({
    next: (data) => {
      blogData.value = data;
    },
    error: (err) => {
      console.error('Error fetching blog data:', err);
      error.value = 'Failed to load blog data.';
    }
  });
});

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold">{{ $t('home.title') }}</h1>
    <p class="mt-2 opacity-70">{{ $t('home.welcome') }}</p>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">{{ $t('home.api_data') }}</h2>
      <div v-if="blogData" class="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
        <pre class="text-xs text-gray-800">{{ JSON.stringify(blogData, null, 2) }}</pre>
      </div>
      <div v-else-if="error" class="text-red-500">
        {{ $t('home.error') }}
      </div>
      <div v-else class="text-gray-500 italic">
        {{ $t('home.loading') }}
      </div>
    </div>
  </div>
</template>
