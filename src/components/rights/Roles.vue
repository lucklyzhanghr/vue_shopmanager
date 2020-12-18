<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" replace>
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色页面右侧主体区 -->
    <el-card shadow="always">
      <el-button
        type="primary"
        size="medium"
        class="addUserBtn"
        @click="addRoleDialogVisibal = true"
      >
        添加角色
      </el-button>
      <el-table
        :data="rolesList"
        border
        stripe
        style="width: 100%"
        max-height="470px"
        size="normal"
        @expand-change="openOne"
        ref="openOne"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="[
                'tag-border-bottom',
                index === 0 ? 'tag-border-top' : ''
              ]"
              v-for="(item1, index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 角色对应一级权限 -->
              <el-col :span="5">
                <el-tag
                  size="medium"
                  type="closable"
                  closable
                  @close="delUserRight(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 角色对应二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="index2 === 0 ? '' : 'tag-border-top'"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      size="medium"
                      type="success"
                      closable
                      @close="delUserRight(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="16">
                    <span v-for="item3 in item2.children" :key="item3.id">
                      <el-tag
                        size="medium"
                        type="info"
                        closable
                        @close="delUserRight(scope.row, item3.id)"
                      >
                        {{ item3.authName }}
                      </el-tag>
                    </span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="65px">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editRoleFn(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="editUserRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      width="38%"
      :visible.sync="editUserRolesDialogVisibale"
      @close="closeEditUserDialog"
      destroy-on-close
    >
      <!-- 可选择树形控件 -->
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedKeysList"
        :props="editUserProps"
        style="height:350px;"
        ref="editUserTreeRef"
        default-expand-all
      >
      </el-tree>

      <!-- 底部确定取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserRolesDialogVisibale = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="confirmEditUserRights"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 修改角色对话框区域 -->
    <el-dialog
      title="修改角色信息"
      width="36%"
      :visible.sync="editRoleDialogVisibal"
      @close="closeEditRoleDialog"
    >
      <el-card class="box-card" shadow="always">
        <el-form
          :model="editRoleForm"
          ref="editUserFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称">
            <el-col :span="18">
              <el-input
                v-model="editRoleForm.roleName"
                placeholder="请输入角色名称"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-col :span="18">
              <el-input
                v-model="editRoleForm.roleDesc"
                placeholder="请输入角色描述"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisibal = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加角色对话框区域 -->
    <el-dialog
      title="添加角色"
      width="36%"
      :visible.sync="addRoleDialogVisibal"
    >
      <el-card class="box-card" shadow="always">
        <el-form :model="addRoleForm" ref="editUserFormRef" label-width="100px">
          <el-form-item label="角色名称">
            <el-col :span="18">
              <el-input
                v-model="addRoleForm.roleName"
                placeholder="请输入角色名称"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-col :span="18">
              <el-input
                v-model="addRoleForm.roleDesc"
                placeholder="请输入角色描述"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisibal = false">取 消</el-button>
        <el-button type="primary" @click="saveNewRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      openRow: {},
      editUserRolesDialogVisibale: false,
      // 所有权限
      rightsList: [],
      editUserProps: {
        children: 'children',
        label: 'authName'
      },
      checkedKeysList: [],
      editUserId: '',
      editRoleDialogVisibal: false,
      editRoleForm: {},
      addRoleDialogVisibal: false,
      addRoleForm: {}
    }
  },
  methods: {
    // 获取角色信息列表(并包含该角色的权限信息)
    async getRolesList () {
      let { data: result } = await this.$axios.get('/roles')
      this.rolesList = result.data
    },
    // 设置只能同事打开一行的方法
    openOne (row) {
      if (!this.openRow || this.openRow === row) {
        this.openRow = row
        return
      }
      this.$refs.openOne.toggleRowExpansion(this.openRow, false)
      this.openRow = row
    },
    // 获取所有权限
    async getRightsList () {
      let { data: result } = await this.$axios.get('/rights/tree')
      this.rightsList = result.data
    },
    // 用递归获取树形结构中该角色对应权限
    getUserCheckedRights (user, arr) {
      if (!user.children) {
        return arr.push(user.id)
      }
      user.children.forEach(item => this.getUserCheckedRights(item, arr))
    },
    editUserRights (user) {
      this.checkedKeysList = []
      // 保存要修改的角色的ID
      this.editUserId = user.id
      this.getRightsList() // 获取所有权限
      // 用递归获取树形结构中该角色对应权限
      this.getUserCheckedRights(user, this.checkedKeysList)
      this.editUserRolesDialogVisibale = true
    },
    closeEditUserDialog () {
      this.checkedKeysList = []
      // 重置要修改的角色的ID为空
      this.editUserId = ''
    },
    // 保存修改后的角色权限信息
    async confirmEditUserRights () {
      // 获取dialog中新的被选中的权限ID
      let currentCheckedKey = this.$refs.editUserTreeRef.getCheckedKeys()
      // 获取dialog中被半选中的权限ID,也就是父节点底ID
      let halfCheckedKey = this.$refs.editUserTreeRef.getHalfCheckedKeys()
      let { data: res } = await this.$axios.post(
        `roles/${this.editUserId}/rights`,
        {
          rids: [...currentCheckedKey, ...halfCheckedKey].join()
        }
      )
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.editUserRolesDialogVisibale = false
    },
    // 删除角色权限
    delUserRight (role, rightId) {
      this.$confirm('此操作将删除该权限, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let { data: result } = await this.$axios
          .delete(`roles/${role.id}/rights/${rightId}`)
          .catch(err => {
            this.$message.error(err.message)
          })
        this.$message.success(result.meta.msg)
        role.children = result.data
      })
    },
    async editRoleFn (role) {
      let { data: result } = await this.$axios.get('/roles/' + role.id)
      this.editRoleForm = result.data
      this.editRoleDialogVisibal = true
    },
    // 关闭弹出对话框事件
    closeEditRoleDialog () {
      this.editRoleForm = {}
    },
    async saveRole () {
      if (!this.editRoleForm.roleName || !this.editRoleForm.roleDesc) {
        return this.$message.error('请输入角色信息')
      }
      console.log(this.editRoleForm)
      let { data: result } = await this.$axios.put(
        `/roles/${this.editRoleForm.roleId}`,
        {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        }
      )
      this.$message.success('修改角色信息成功')
      this.editRoleDialogVisibal = false
      this.getRolesList()
    },
    async delRole (id) {
      let flag = await this.$confirm('此操作将删除该角色, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (flag === 'confirm') {
        let { data: result } = await this.$axios.delete(`/roles/${id}`)
        this.$message.success(result.meta.msg)
        this.getRolesList()
      }
    },
    async saveNewRole () {
      let { data: result } = await this.$axios.post('/roles', this.addRoleForm).catch(err => {
        throw err
      })
      this.$message.success(result.meta.msg)
      this.getRolesList()
      this.addRoleDialogVisibal = false
      this.addRoleForm = {}
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.addUserBtn {
  float: right;
  margin-right: 155px;
  margin-bottom: 20px;
}

.el-tag {
  margin: 10px;
}

.el-row {
  display: flex;
  align-items: center;
}

.tag-border-top {
  border-top: 2px solid #eee;
}

.tag-border-bottom {
  border-bottom: 2px solid #eee;
}

.el-tree {
  overflow-y: scroll;
  overflow-x: hidden;
}

.el-card__body {
  padding: 35px;
}
.el-dialog .el-form-item {
  padding: 6px;
}
</style>
