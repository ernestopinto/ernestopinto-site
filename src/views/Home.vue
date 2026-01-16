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
      if (response.error === 0) {
        const payload = response.data

        blogPosts.value = payload.data
        totalPages.value = payload.last_page
        currentPage.value = payload.current_page

        // Check for saved post ID and scroll after DOM update
        const savedPostId = sessionStorage.getItem('lastClickedPostId')
        if (savedPostId) {
          setTimeout(() => {
            const element = document.getElementById(`post-${savedPostId}`)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' })
              sessionStorage.removeItem('lastClickedPostId')
            }
          }, 100)
        }
      } else {
        error.value = response.message || 'Failed to load blog data.'
      }

      isLoading.value = false
    },
    error: (err) => {
      console.error('Error fetching blog data:', err);
      error.value = 'Failed to load blog data.';
      isLoading.value = false;
    }
  });
};

onMounted(() => {
  // Restore page and theme if available to help finding the anchor
  const savedPage = sessionStorage.getItem('blogCurrentPage');
  const savedTheme = sessionStorage.getItem('blogSelectedTheme');
  
  if (savedPage) currentPage.value = parseInt(savedPage);
  if (savedTheme !== null) selectedTheme.value = savedTheme === 'null' ? null : savedTheme;

  fetchPosts(currentPage.value, selectedTheme.value);
});

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});

const saveScrollPosition = (postId: number) => {
  sessionStorage.setItem('lastClickedPostId', postId.toString());
  sessionStorage.setItem('blogCurrentPage', currentPage.value.toString());
  sessionStorage.setItem('blogSelectedTheme', selectedTheme.value === null ? 'null' : selectedTheme.value);
};

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

const decodeHtmlEntities = (input: string) => {
  if (!input) return '';
  const el = document.createElement('textarea');
  el.innerHTML = input;
  return el.value;
};

const getPreviewText = (html: string) => {
  if (!html) return '';

  // 1) decode entities like &eacute; -> é
  const decoded = decodeHtmlEntities(html);

  // 2) strip tags (if any)
  const text = decoded.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // 3) clip
  const max = 100;
  return text.length <= max ? text : text.slice(0, max).trim() + '...';
};

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Parallax Header -->
    <header class="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <!-- Background -->
      <div
          class="absolute inset-0 bg-cover bg-no-repeat bg-fixed"
          style="
      background-image: url('https://ik.imagekit.io/v5b1vx0mg/IMG_4801-2.jpg');
      background-position: center 60%;
    "
      >
        <div class="absolute inset-0 bg-black/40"></div>
      </div>

      <!-- Title + Quote -->
      <div class="relative z-10 flex flex-col items-center text-center px-4">
        <h1 class="text-4xl sm:text-5xl md:text-8xl font-bold text-white tracking-tighter drop-shadow-2xl">
          ernestopinto.net
        </h1>

        <p class="mt-4 max-w-3xl text-base sm:text-lg md:text-xl text-white/80 italic tracking-wide drop-shadow-lg">
          “We are a way for the universe to know itself.”
        </p>

        <span class="mt-2 text-sm text-white/60">
          — Carl Sagan
        </span>
      </div>
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
        <div class="grid! grid-cols-1 sm:grid-cols-2! lg:grid!-cols-3 gap-8">
          <RouterLink
            v-for="post in blogPosts" 
            :key="post.id" 
            :id="'post-' + post.id"
            :to="'/blog/' + post.id"
            @click="saveScrollPosition(post.id)"
            class="group bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 block"
          >
            <article>
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
              <div class="text-gray-600 text-sm mb-4 line-clamp-3">
                {{ getPreviewText(post.body) }}
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-4">
                <span>{{ new Date(post.published_at).toLocaleDateString() }}</span>
              </div>
            </div>
          </article>
        </RouterLink>
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
