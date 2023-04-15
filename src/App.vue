<script setup>
import { RouterView } from 'vue-router'
import AppProvider from '@/components/AppProvider/index.vue'
</script>

<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>
