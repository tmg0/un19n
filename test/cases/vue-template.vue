<script setup lang="ts">
const { t } = useI18n()

const message = computed(() => {
  return t('__un19n.en:banana')
})
</script>

<template>
  <div>
    <span>{{ t('__un19n.en:apple') }}</span>
    <span>{{ t('__un19n.en:I_have_a_pineapple') }}</span>
  </div>
</template>
