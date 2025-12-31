<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { lunaService } from '../services/luna.service';
import type { Subscription } from 'rxjs';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const blogPost = ref<any>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
let subscription: Subscription;

const goBack = () => {
  router.back();
};

onMounted(() => {
  isLoading.value = true;
  subscription = lunaService.getPostById(id).subscribe({
    next: (response) => {
      if (response.error === 0) {
        blogPost.value = response.data;
      } else {
        error.value = response.message || 'Failed to load blog post.';
      }
      isLoading.value = false;
    },
    error: (err) => {
      console.error('Error fetching blog post:', err);
      error.value = 'Failed to load blog post.';
      isLoading.value = false;
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
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      {{ error }}
      <div class="mt-4">
        <button @click="goBack" class="text-blue-600 hover:underline cursor-pointer">
          {{ $t('common.back_to_listing') }}
        </button>
      </div>
    </div>

    <div v-else-if="blogPost">
      <h1 class="text-3xl font-bold mb-8">Single Blog Post (ID: {{ id }})</h1>
      <pre class="bg-gray-100 p-6 rounded-lg overflow-auto max-h-[70vh]">{{ JSON.stringify(blogPost, null, 2) }}</pre>
      <div class="mt-8">
        <button @click="goBack" class="text-blue-600 hover:underline cursor-pointer">
          {{ $t('common.back_to_listing') }}
        </button>
      </div>
    </div>
  </div>
</template>
