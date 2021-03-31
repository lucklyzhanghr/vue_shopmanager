<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center> </el-alert>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped></style>
