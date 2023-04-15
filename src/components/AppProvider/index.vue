<script setup>
const themeOverrides = {
  common: {
    primaryColor: '#092147',
    secondaryColor: '#c2d730',
    primaryColorHover: '#316C72E3',
    primaryColorPressed: '#2B4C59FF',
    primaryColorSuppl: '#316C7263',
  },
}
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <slot />
  </n-config-provider>
</template>
