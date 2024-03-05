<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const pen = computed(() => t('__un19n.pen'))
</script>

<template>
  <div>
    <h1>APPA</h1>
    <h2>{{ t('__un19n.en:I_have_a_pen') }}</h2>
    <h2>{{ t('__un19n.en:I_have_an_apple') }}</h2>
    <h2>{{ t('__un19n.en:apple') }}</h2>
    <h2>{{ t('__un19n.pineapple') }}</h2>
    <h2>{{ pen }}</h2>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  padding: 60px;
}
</style>
