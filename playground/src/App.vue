<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const pen = computed(() => t('__un19n.pen'))
</script>

<template>
  <div>
    <h1>{{ t('__un19n.en:apple') }}</h1>
    <h1>{{ t('__un19n.pineapple') }}</h1>
    <h1>{{ pen }}</h1>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
