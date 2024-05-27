<script setup>
const title = 'Hello world!'
</script>

<template>
  <div m-60>
    <h1 text-normal font-900>
      {{ title }}
    </h1>
    <n-flex>
      <n-button>Default</n-button>
      <n-button type="tertiary">
        Tertiary
      </n-button>
      <n-button type="primary">
        Primary
      </n-button>
      <n-button type="info">
        Info
      </n-button>
      <n-button type="success">
        Success
      </n-button>
      <n-button type="warning">
        Warning
      </n-button>
      <n-button type="error">
        Error
      </n-button>
    </n-flex>
    <n-space>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, dicta dignissimos? Mollitia nulla distinctio qui voluptate dolor sit totam officiis officia accusantium, iste nisi assumenda perferendis tempore cum quo maiores!</p>
    </n-space>
  </div>
</template>
