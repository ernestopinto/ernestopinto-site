<script setup lang="ts">
import {ref, onUnmounted} from 'vue'
import type {Subscription} from 'rxjs'
import {lunaService} from '../services/luna.service'
import {useI18n} from "vue-i18n";

type ContactResponse = unknown

const {t} = useI18n()
const message = ref('')
const isSubmitting = ref(false)
const success = ref<string | null>(null)
const error = ref<string | null>(null)
const emailsender = ref('')


let sub: Subscription | null = null

function validate(): string | null {
  const trimmed = message.value.trim()

  if (!trimmed) return t('contacts.validation')
  if (trimmed.length < 10)
    return t('contacts.validationMinLength', {min: 10})
  if (trimmed.length > 2000)
    return t('contacts.validationMaxLength', {max: 2000})

  return null
}

function extractErrorMessage(e: any): string {
  // Axios-style error
  const status = e?.response?.status
  const backendMsg =
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.response?.data?.errors?.message?.[0]

  if (backendMsg) return String(backendMsg)
  if (status) return `Request failed (HTTP ${status}).`
  return 'Something went wrong. Please try again.'
}

function submit() {
  success.value = null
  error.value = null

  const validation = validate()
  if (validation) {
    error.value = validation
    return
  }

  // cancel previous submit if user double-clicks
  sub?.unsubscribe()
  sub = null

  isSubmitting.value = true

  const payload = { emailsender: emailsender.value.trim(), message: message.value.trim() }

  sub = lunaService
      .post<ContactResponse>('/contact', payload)
      .subscribe({
        next: () => {
          success.value = t('contacts.sentOk');
          message.value = ''
          isSubmitting.value = false
        },
        error: (e) => {
          error.value = extractErrorMessage(e)
          isSubmitting.value = false
        }
      })
}

onUnmounted(() => {
  sub?.unsubscribe()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-10">
    <!-- Header -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          {{ $t('contacts.title') }}
        </h1>
        <p class="text-gray-600 max-w-2xl">
          {{ $t('contacts.subMessage') }}
        </p>
      </div>

      <!-- Form card -->
      <div class="w-full max-w-2xl">
        <div class="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div class="p-6 md:p-8">
            <form class="flex flex-col gap-4" @submit.prevent="submit">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900">{{ $t('contacts.send') }}</h2>
                <span class="text-xs text-gray-500">{{ message.trim().length }}/2000</span>
              </div>

              <!-- Email -->
              <div>
                <label for="emailsender" class="block text-sm font-medium text-gray-800">
                  {{ $t('contacts.email') }}
                </label>

                <input
                    id="emailsender"
                    v-model="emailsender"
                    type="email"
                    autocomplete="email"
                    inputmode="email"
                    required
                    :disabled="isSubmitting"
                    :placeholder="$t('contacts.emailPlaceholder')"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                    :title="$t('contacts.emailInvalid')"
                    class="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-800">
                  {{ $t('contacts.message') }}
                </label>
                <textarea
                    id="message"
                    v-model="message"
                    rows="6"
                    :disabled="isSubmitting"
                    :placeholder="$t('contacts.write')"
                    required
                    class="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>

              <!-- Alerts -->
              <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {{ error }}
              </div>

              <div
                  v-if="success"
                  class="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              >
                {{ success }}
              </div>

              <div class="flex items-center gap-3 pt-2">
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span v-if="!isSubmitting">{{ $t('contacts.send') }}</span>
                  <span v-else>{{ $t('contacts.sending') }}</span>
                </button>

                <button
                    type="button"
                    :disabled="isSubmitting"
                    @click="() => { emailsender = ''; message = ''; error = null; success = null }"
                    class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {{ $t('contacts.clear') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  button {
      cursor: pointer;
  }
</style>

