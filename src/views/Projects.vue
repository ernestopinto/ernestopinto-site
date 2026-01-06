<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Subscription } from 'rxjs'
import {
  Github,
  ExternalLink,
  Rocket,
  Wrench,
  Star,
  GitFork,
  Clock,
  Search,
  Tag,
} from 'lucide-vue-next'

import { lunaService } from '@/services/luna.service'
import type { Project, ProjectStatus } from '@/types/projects'

const projects = ref<Project[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const filter = ref<'all' | ProjectStatus>('all')
const query = ref('')

let subscription: Subscription | undefined

const filteredProjects = computed(() => {
  const q = query.value.trim().toLowerCase()

  return projects.value
      .filter((p) => (filter.value === 'all' ? true : p.status === filter.value))
      .filter((p) => {
        if (!q) return true
        const haystack =
            `${p.name} ${p.description} ${p.tags.join(' ')} ${p.tech.join(' ')}`.toLowerCase()
        return haystack.includes(q)
      })
})

const featured = computed(() => filteredProjects.value.filter((p) => p.featured))
const rest = computed(() => filteredProjects.value.filter((p) => !p.featured))

const statusPill = (s: ProjectStatus) => {
  switch (s) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    case 'maintained':
      return 'bg-blue-50 text-blue-700 border-blue-100'
    case 'experiment':
      return 'bg-purple-50 text-purple-700 border-purple-100'
    case 'archived':
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

onMounted(() => {
  isLoading.value = true
  error.value = null

  subscription = lunaService.getProjects().subscribe({
    next: (response) => {
      if (response.error === 0) {
        projects.value = response.data
      } else {
        error.value = response.message || 'Failed to load projects.'
      }
      isLoading.value = false
    },
    error: (err) => {
      console.error('Error fetching projects:', err)
      error.value = 'Failed to load projects.'
      isLoading.value = false
    },
  })
})

onUnmounted(() => subscription?.unsubscribe())
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <!-- Header -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Projects
        </h1>
        <p class="text-gray-600 max-w-2xl">
          A curated list of things I’m building, maintaining, or exploring — mostly GitHub-based.
        </p>
      </div>

      <!-- Search + Filters -->
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <!-- Search -->
        <div class="relative w-full md:max-w-md">
          <Search class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
              v-model="query"
              type="text"
              placeholder="Search projects…"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <!-- Filters (centered on mobile) -->
        <div class="flex flex-wrap gap-2 justify-center md:justify-end">
          <button
              @click="filter = 'all'"
              class="px-3 py-1.5 rounded-full border text-sm font-medium
                   transition cursor-pointer
                   hover:bg-blue-50 hover:border-blue-300
                   active:scale-95"
              :class="filter === 'all'
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-gray-200 text-gray-700'"
          >
            All
          </button>

          <button
              @click="filter = 'active'"
              class="px-3 py-1.5 rounded-full border text-sm font-medium
                   transition cursor-pointer
                   hover:bg-blue-50 hover:border-blue-300
                   active:scale-95"
              :class="filter === 'active'
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-gray-200 text-gray-700'"
          >
            Active
          </button>

          <button
              @click="filter = 'maintained'"
              class="px-3 py-1.5 rounded-full border text-sm font-medium
                   transition cursor-pointer
                   hover:bg-blue-50 hover:border-blue-300
                   active:scale-95"
              :class="filter === 'maintained'
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-gray-200 text-gray-700'"
          >
            Maintained
          </button>

          <button
              @click="filter = 'experiment'"
              class="px-3 py-1.5 rounded-full border text-sm font-medium
                   transition cursor-pointer
                   hover:bg-blue-50 hover:border-blue-300
                   active:scale-95"
              :class="filter === 'experiment'
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-gray-200 text-gray-700'"
          >
            Experiments
          </button>

          <button
              @click="filter = 'archived'"
              class="px-3 py-1.5 rounded-full border text-sm font-medium
                   transition cursor-pointer
                   hover:bg-blue-50 hover:border-blue-300
                   active:scale-95"
              :class="filter === 'archived'
              ? 'border-blue-600 text-blue-700 bg-blue-50'
              : 'border-gray-200 text-gray-700'"
          >
            Archived
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20 text-red-600">
      {{ error }}
    </div>

    <!-- Empty -->
    <div v-else-if="filteredProjects.length === 0" class="text-center py-20">
      <p class="font-medium text-gray-700">No projects found.</p>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Featured -->
      <div v-if="featured.length" class="mt-10">
        <div class="flex items-center gap-2 mb-4">
          <Rocket class="w-5 h-5 text-blue-700" />
          <h2 class="text-xl font-semibold text-gray-900">Featured</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
              v-for="p in featured"
              :key="p.id"
              class="relative rounded-2xl border border-blue-100
                   bg-blue-50/60 p-6 shadow-sm
                   hover:bg-white hover:shadow-md transition"
          >
            <div class="absolute top-5 right-5">
              <span
                  class="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  :class="statusPill(p.status)"
              >
                {{ p.status }}
              </span>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 pr-24">
              {{ p.name }}
            </h3>

            <p class="mt-2 text-gray-600 leading-relaxed">
              {{ p.description }}
            </p>

            <div class="mt-4 flex flex-wrap gap-2">
              <span
                  v-for="t in p.tech"
                  :key="t"
                  class="inline-flex items-center gap-1 text-xs font-medium
                       px-2.5 py-1 rounded-full
                       bg-white text-blue-700 border border-blue-100"
              >
                <Tag class="w-3.5 h-3.5" />
                {{ t }}
              </span>
            </div>

            <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span v-if="p.stars != null" class="inline-flex items-center gap-1">
                  <Star class="w-4 h-4" /> {{ p.stars }}
                </span>
                <span v-if="p.forks != null" class="inline-flex items-center gap-1">
                  <GitFork class="w-4 h-4" /> {{ p.forks }}
                </span>
                <span v-if="p.updatedAt" class="inline-flex items-center gap-1">
                  <Clock class="w-4 h-4" />
                  {{ new Date(p.updatedAt).toLocaleDateString() }}
                </span>
              </div>

              <div class="flex items-center gap-2">
                <a
                    v-if="p.githubUrl"
                    :href="p.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl
                         border border-blue-200 text-sm font-medium
                         hover:bg-blue-50 transition"
                >
                  <Github class="w-4 h-4" />
                  GitHub
                </a>

                <a
                    v-if="p.demoUrl"
                    :href="p.demoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl
                         bg-blue-700 text-sm font-medium text-white
                         hover:bg-blue-800 transition"
                >
                  <ExternalLink class="w-4 h-4" />
                  Live
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- All Projects -->
      <div class="mt-12">
        <div class="flex items-center gap-2 mb-4">
          <Wrench class="w-5 h-5 text-blue-700" />
          <h2 class="text-xl font-semibold text-gray-900">All projects</h2>
        </div>

        <div class="grid grid-cols-1 gap-4">
          <article
              v-for="p in rest"
              :key="p.id"
              class="rounded-2xl border border-blue-100
                   bg-blue-50/60 p-5
                   hover:bg-white transition"
          >
            <div class="flex flex-col md:flex-row md:justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900 truncate">
                    {{ p.name }}
                  </h3>
                  <span
                      class="text-xs font-semibold px-2.5 py-1 rounded-full border"
                      :class="statusPill(p.status)"
                  >
                    {{ p.status }}
                  </span>
                </div>

                <p class="mt-1 text-gray-600">
                  {{ p.description }}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <a
                    v-if="p.githubUrl"
                    :href="p.githubUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl
                         border border-blue-200 text-sm font-medium
                         hover:bg-blue-50 transition"
                >
                  <Github class="w-4 h-4" />
                  Repo
                </a>

                <a
                    v-if="p.demoUrl"
                    :href="p.demoUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-3 py-2 rounded-xl
                         border border-blue-200 text-sm font-medium
                         hover:bg-blue-50 transition"
                >
                  <ExternalLink class="w-4 h-4" />
                  Demo
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>


