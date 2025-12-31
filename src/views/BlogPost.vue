<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { lunaService } from '../services/luna.service';
import type { Subscription } from 'rxjs';
import type { SingleBlogPostDTO } from '../types/blog';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const blogPost = ref<SingleBlogPostDTO | null>(null);
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
      <article class="max-w-4xl mx-auto">
        <!-- Header Image -->
        <div v-if="blogPost.header_image" class="w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-xl">
          <img :src="blogPost.header_image" :alt="blogPost.title" class="w-full h-full object-cover" />
        </div>

        <!-- Meta Information -->
        <div class="flex items-center gap-4 mb-4">
          <span class="text-sm font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {{ $t(`home.themes.${blogPost.theme}`) }}
          </span>
          <span v-if="blogPost.location" class="text-sm text-gray-500 flex items-center">
            <span class="mr-1">📍</span> {{ blogPost.location }}
          </span>
          <span class="text-sm text-gray-500">
            {{ new Date(blogPost.published_at).toLocaleDateString() }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
          {{ blogPost.title }}
        </h1>

        <!-- Body Content -->
        <div class="prose prose-lg max-w-none text-gray-800 mb-12 leading-relaxed" v-html="blogPost.body"></div>

        <!-- Banner Section -->
        <div v-if="blogPost.folder_image_banner && blogPost.folder_image_banner.length > 0" 
             class="mt-12 pt-8 border-t border-gray-100">
          
          <h3 class="text-lg font-semibold text-left mb-6 text-gray-800">
            {{ $t('blog.discover_more') }}
          </h3>
          
          <div class="flex flex-wrap justify-center gap-6">
            <template v-for="(banner, index) in blogPost.folder_image_banner" :key="index">
              <!-- Wrap banner in link if a corresponding link exists -->
              <a v-if="blogPost.folder_link && blogPost.folder_link[index]" 
                 :href="blogPost.folder_link[index]" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="block rounded-xl overflow-hidden shadow-md max-w-sm hover:opacity-90 transition-opacity flex"
              >
                <img :src="banner" alt="Banner" class="w-full h-full object-cover" />
              </a>
              <!-- Otherwise just show the image -->
              <div v-else class="rounded-xl overflow-hidden shadow-md max-w-sm flex">
                <img :src="banner" alt="Banner" class="w-full h-full object-cover" />
              </div>
            </template>
          </div>
        </div>

        <!-- Footer / Back Button -->
        <div class="mt-12 pt-8 border-t border-gray-100">
          <button @click="goBack" class="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors cursor-pointer">
            <span class="mr-2">←</span> {{ $t('common.back_to_listing') }}
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
