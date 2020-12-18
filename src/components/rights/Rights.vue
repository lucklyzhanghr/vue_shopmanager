<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" replace>
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容主体区 -->
    <el-card>
      <el-table
        :data="rightsList"
        border
        stripe
        style="width: 100%"
        max-height="560px"
        size="normal"
      >
        <el-table-column type="index" label="序号" width="65px">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">等级二</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == 2">等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 全部权限数据
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      let { data: result } = await this.$axios.get('/rights/list')
      this.rightsList = result.data
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped></style>
