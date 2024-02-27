<script setup lang="ts">
const { t } = useI18n()

const message = computed(() => {
  return t('en:banana')
})
</script>

<template>
  <div>
    <span>{{ t('en:apple') }}</span>
    <span>{{ t('en:I_have_a_pineapple') }}</span>
  </div>
</template>
