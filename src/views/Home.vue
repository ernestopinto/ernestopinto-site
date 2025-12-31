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
    <h1 class="text-3xl font-bold">Home</h1>
    <p class="mt-2 opacity-70">Welcome to ernestopinto.pt</p>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Luna Blog API Data:</h2>
      <div v-if="blogData" class="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
        <pre class="text-xs text-gray-800">{{ JSON.stringify(blogData, null, 2) }}</pre>
      </div>
      <div v-else-if="error" class="text-red-500">
        {{ error }}
      </div>
      <div v-else class="text-gray-500 italic">
        Loading blog data...
      </div>
    </div>
  </div>
</template>
