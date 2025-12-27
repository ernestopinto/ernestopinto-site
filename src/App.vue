<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen">
    <nav class="flex gap-4 p-4 border-b">
      <RouterLink to="/" class="font-medium hover:underline">
        Home
      </RouterLink>
      <RouterLink to="/contacts" class="font-medium hover:underline">
        Contacts
      </RouterLink>
    </nav>

    <RouterView />
  </div>
</template>


