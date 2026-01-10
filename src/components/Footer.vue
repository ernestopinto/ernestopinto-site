<template>
  <footer class="fixed bottom-0 left-0 w-full bg-white border-t py-2 z-50">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-gray-500 text-sm">
        &copy;
        {{ new Date().getFullYear() === 2026 ? '2026' : '2025 - 2026' }}
        {{ $t('footer.copyright') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
</script>
