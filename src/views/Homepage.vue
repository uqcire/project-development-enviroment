<script setup>
const title = 'Hello world!'
const message = 'This is a message from the script setup block'
import { ref } from 'vue';

const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
          @select="handleSelect">
          <el-menu-item index="0">
            <img style="width: 100px" src="https://element-plus.org/images/element-plus-logo.svg" alt="Element logo" />
          </el-menu-item>
          <el-menu-item index="1">Processing Center</el-menu-item>
          <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-header>
      <el-main>
        <div class="m-12">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="mb-4">
                <el-button>Default</el-button>
                <el-button type="primary">Primary</el-button>
                <el-button type="success">Success</el-button>
                <el-button type="info">Info</el-button>
                <el-button type="warning">Warning</el-button>
                <el-button type="danger">Danger</el-button>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content ep-bg-purple">
                <p class="text-center text-2xl">
                  {{ message }}
                </p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content ep-bg-purple">
                <h1 class="text-center text-6xl font-bold underline">
                  {{ title }}
                </h1>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </el-container>
  </div>


</template>

<style>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
