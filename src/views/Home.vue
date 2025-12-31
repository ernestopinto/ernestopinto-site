<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { lunaService } from '../services/luna.service';
import type { Subscription } from 'rxjs';
import type { BlogApiResponse, BlogPostDTO } from '../types/blog';

const blogPosts = ref<BlogPostDTO[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const isLoading = ref(true);
const error = ref<string | null>(null);
const selectedTheme = ref<string | null>(null);
const themes = ['World', 'Arcadeluz', 'Gaming'] as const;

let subscription: Subscription;

const blogSection = ref<HTMLElement | null>(null);

const fetchPosts = (page: number = 1, theme: string | null = null) => {
  isLoading.value = true;
  let url = `/blog?page=${page}`;
  if (theme) {
    url += `&theme=${theme}`;
  }
  
  subscription = lunaService.get<BlogApiResponse>(url).subscribe({
    next: (response) => {
      if (response.error === 0 && response.data) {
        blogPosts.value = response.data.data;
        totalPages.value = response.data.last_page;
        currentPage.value = response.data.current_page;
      } else {
        error.value = response.message || 'Failed to load blog data.';
      }
      isLoading.value = false;
    },
    error: (err) => {
      console.error('Error fetching blog data:', err);
      error.value = 'Failed to load blog data.';
      isLoading.value = false;
    }
  });
};

onMounted(() => {
  fetchPosts(currentPage.value, selectedTheme.value);
});

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});

const scrollToBlog = () => {
  if (blogSection.value) {
    blogSection.value.scrollIntoView({ behavior: 'smooth' });
  }
};

const selectTheme = (theme: string | null) => {
  selectedTheme.value = theme;
  currentPage.value = 1;
  fetchPosts(1, theme);
  scrollToBlog();
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchPosts(page, selectedTheme.value);
    scrollToBlog();
  }
};

const getPreviewText = (html: string) => {
  if (!html) return '';
  // Strip HTML tags
  const text = html.replace(/<[^>]*>?/gm, '');
  if (text.length <= 100) return text;
  return text.substring(0, 100).trim() + '...';
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Parallax Header -->
    <header class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <div 
        class="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style="background-image: url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop');"
      >
        <div class="absolute inset-0 bg-black/40"></div>
      </div>
      <h1 class="relative text-4xl sm:text-5xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl px-4 text-center">
        ernestopinto.net
      </h1>
    </header>

    <!-- Content -->
    <main ref="blogSection" class="max-w-7xl mx-auto px-4 py-12 w-full min-h-[800px]">
      <!-- Theme Filter Bar -->
      <div class="mb-12 flex flex-wrap justify-center gap-4">
        <button 
          @click="selectTheme(null)"
          :class="[
            'px-6 py-2 rounded-full font-medium transition-all cursor-pointer',
            selectedTheme === null 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ $t('home.all_themes') || 'All' }}
        </button>
        <button 
          v-for="theme in themes" 
          :key="theme"
          @click="selectTheme(theme)"
          :class="[
            'px-6 py-2 rounded-full font-medium transition-all cursor-pointer',
            selectedTheme === theme 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ $t(`home.themes.${theme}`) }}
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>

      <div v-else-if="error" class="text-center py-20 text-red-500">
        {{ error }}
      </div>

      <div v-else>
        <!-- Blog Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="post in blogPosts" 
            :key="post.id" 
            class="group bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2"
          >
            <div class="aspect-video overflow-hidden">
              <img 
                v-if="post.header_image"
                :src="post.header_image" 
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {{ $t(`home.themes.${post.theme}`) }}
                </span>
                <span class="text-xs text-gray-500 flex items-center">
                  <span class="mr-1">📍</span> {{ post.location }}
                </span>
              </div>
              <h2 class="text-xl font-bold mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                {{ post.title }}
              </h2>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                {{ getPreviewText(post.body) }}
              </p>
              <div class="flex items-center text-sm text-gray-500 mt-4">
                <span>{{ new Date(post.published_at).toLocaleDateString() }}</span>
              </div>
            </div>
          </article>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-12 gap-2">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {{ $t('common.previous') || 'Previous' }}
          </button>
          <div class="flex items-center px-4 font-medium">
            {{ currentPage }} / {{ totalPages }}
          </div>
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {{ $t('common.next') || 'Next' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Basic Parallax support */
.bg-fixed {
  background-attachment: fixed;
}

@media (max-width: 768px) {
  /* On mobile, fixed background can be buggy, so we might disable it */
  .bg-fixed {
    background-attachment: scroll;
  }
}
</style>
