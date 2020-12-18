<template>
  <div>
    <!-- 顶部面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" replace>
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="always">
      <el-row :gutter="45">
        <el-col :span="7">
          <el-input
            placeholder="请输入姓名"
            v-model="queryInfo.query"
            @keyup.native.13="search"
            @clear="getData"
            clearable
            size="small"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            class="addUser"
            @click="addUserDialogVisible = true"
            size="small"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 添加用户对话框区域 -->
      <el-dialog
        title="添加用户"
        width="50%"
        :visible.sync="addUserDialogVisible"
        @close="closeAddUserDialog"
      >
        <el-card class="box-card" shadow="always">
          <el-form
            :model="addUserForm"
            :rules="addUserRoles"
            ref="addUserFormRef"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-col :span="16">
                <el-input
                  v-model="addUserForm.username"
                  placeholder="请输入用户名"
                  clearable
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-col :span="16">
                <el-input
                  v-model="addUserForm.password"
                  placeholder="请输入密码"
                  :show-password="true"
                  clearable
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-col :span="16">
                <el-input
                  v-model="addUserForm.email"
                  placeholder="请输入邮箱"
                  clearable
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-col :span="16">
                <el-input
                  v-model="addUserForm.mobile"
                  placeholder="请输入手机号"
                  clearable
                ></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>

      <div style="height:440px; " id="scrollbar">
        <el-scrollbar style="height:100%">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            stripe
            size="normal"
          >
            <el-table-column
              type="index"
              label="序号"
              width="61px"
            ></el-table-column>
            <el-table-column prop="username" label="姓名" min-width="2">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="2">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" min-width="2">
            </el-table-column>
            <el-table-column prop="role_name" label="角色" min-width="2">
            </el-table-column>
            <el-table-column prop="mg_state" label="状态" min-width="2">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  @change="changeStatus(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" min-width="2">
              <template slot-scope="scope">
                <el-button
                  class="el-icon-edit"
                  type="primary"
                  size="mini"
                  @click="editUserFn(scope.row.id)"
                ></el-button>

                <el-button
                  class="el-icon-delete"
                  type="danger"
                  size="mini"
                  @click="delUser(scope.row.id)"
                ></el-button>
                <el-button
                  class="el-icon-setting"
                  type="warning"
                  size="mini"
                  @click="editUserRole(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改用户对话框区域 -->
    <el-dialog
      title="修改用户信息"
      width="36%"
      :visible.sync="editUserDialogVisibal"
      @close="closeEditUserDialog"
    >
      <el-card class="box-card" shadow="always" style="height=65%">
        <el-form
          :model="editUserForm"
          :rules="addUserRoles"
          ref="editUserFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名">
            <el-col :span="18">
              <el-input v-model="editUserForm.username" disabled></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-col :span="18">
              <el-input
                v-model="editUserForm.email"
                placeholder="请输入邮箱"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-col :span="18">
              <el-input
                v-model="editUserForm.mobile"
                placeholder="请输入手机号"
                clearable
              ></el-input>
            </el-col>
          </el-form-item>
        </el-form>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisibal = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配用户角色对话框 -->
    <el-dialog
      title="分配角色"
      width="36%"
      :visible.sync="assignRoleDialogVisibale"
      @close="closeAssignRoleDialog"
      destroy-on-close
    >
      <el-card class="box-card" shadow="always" style="height=65%">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="currentEditUser"
          class="form-assign-role"
        >
          <el-form-item label="当前用户">
            <el-input v-model="currentEditUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="当前角色">
            <el-input v-model="currentEditUser.role_name" disabled></el-input>
          </el-form-item>
          <el-form-item label="新角色">
            <el-select v-model="newRoleId" placeholder="请选择">
              <el-option
                v-for="item in allroles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignRoleDialogVisibale = false">取 消</el-button>
        <el-button type="primary" @click="saveUserNewRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 自定义form表单校验规则
    let checkUsername = (rule, value, callback) => {
      let regex = /([\w]|[-_]){4,16}$/
      const flag = regex.test(value)
      if (!flag) callback(new Error('请输入4-16位 字母、数字、下划线、减号'))
      callback()
    }
    let checkPassword = (rule, value, callback) => {
      let regex = /[\w]{6,16}$/
      const flag = regex.test(value)
      if (!flag) callback(new Error('请输入6-16位 字母、数字'))
      callback()
    }
    let checkEmail = (rule, value, callback) => {
      let regex = /^\w{3,}(\.\w+)*@[A-z 0-9]+(\.[A-z]{2,5}){1,2}$/
      const flag = regex.test(value)
      if (!flag) callback(new Error('请输入正确的邮箱'))
      callback()
    }
    let checkPhone = (rule, value, callback) => {
      let regex = /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/
      const flag = regex.test(value)
      if (!flag) callback(new Error('请输入正确的手机号'))
      callback()
    }

    return {
      tableData: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      addUserDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRoles: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: checkUsername, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      editUserDialogVisibal: false,
      editUserForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      assignRoleDialogVisibale: false,
      labelPosition: 'right', // 分配角色表单文字对齐方式,
      currentEditUser: {},
      allroles: [],
      newRoleId: ''
    }
  },
  methods: {
    async getData () {
      let { data: result } = await this.$axios
        .get('/users', {
          params: this.queryInfo
        })
        .catch(err => {
          this.$message.error(err.message)
          throw err
        })
      this.tableData = result.data.users
      this.total = result.data.total
    },
    // 改变状态事件
    async changeStatus (value) {
      let { data: result } = await this.$axios
        .put(`/users/${value.id}/state/${value.mg_state}`)
        .catch(err => {
          value.mg_state = !value.mg_state
          this.$message.error(err.message)
          throw err
        })

      if (!result || result.meta.status !== 200) {
        value.mg_state = !value.mg_state
      }
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getData()
    },
    search () {
      this.getData()
    },
    clearSearch () {
      this.queryInfo.query = ''
      this.getData()
    },
    addUser () {
      this.$refs.addUserFormRef.resetField = true
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        // 向后台发送请求添加用户
        let { data: result } = await this.$axios
          .post('/users', this.addUserForm)
          .catch(err => {
            throw err
          })
        this.$message.success(result.meta.msg)
        this.getData()
        this.addUserDialogVisible = false
      })
    },
    delUser (id) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$axios.delete(`/users/${id}`).catch(err => {
          throw err
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        let totalPage = Math.ceil((this.total - 1) / this.queryInfo.pagesize)
        this.queryInfo.pagenum =
          this.queryInfo.pagenum > totalPage
            ? totalPage
            : this.queryInfo.pagenum
        this.getData()
      })
    },
    closeAddUserDialog () {
      this.$refs.addUserFormRef.resetFields()
    },
    closeEditUserDialog () {
      this.$refs.editUserFormRef.resetFields()
    },
    async editUserFn (id) {
      // 获取id对应用户信息
      let { data: result } = await this.$axios.get('/users/' + id)
      this.editUserForm = result.data
      // 当成功获取到对应用户信息后才弹出对话框
      this.editUserDialogVisibal = true
    },
    editUser () {
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        let { data: result } = await this.$axios.put(
          '/users/' + this.editUserForm.id,
          this.editUserForm
        )
        this.$message.success(result.meta.msg)
        this.getData()
        this.editUserDialogVisibal = false
      })
    },
    // 获取当前系统所有角色
    async getAllroles () {
      let { data: result } = await this.$axios.get('/roles')
      this.allroles = result.data
    },
    // 分配用户角色方法
    editUserRole (user) {
      this.getAllroles()
      this.currentEditUser = user
      this.assignRoleDialogVisibale = true
    },
    async saveUserNewRole () {
      if (!this.newRoleId) return this.$message.error('请选择新角色')
      let { data: result } = await this.$axios.put(
        `users/${this.currentEditUser.id}/role`,
        {
          rid: this.newRoleId
        }
      )
      this.$message.success(result.meta.msg)
      this.getData()
      this.assignRoleDialogVisibale = false
    },
    //  关闭分配角色对话框
    closeAssignRoleDialog () {
      this.newRoleId = ''
    }
  },
  created () {
    this.getData()
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-pagination {
  margin: 20px 0;
}
//  设置底部分页组件水平居中
.el-pagination {
  display: flex;
  justify-content: center;
}
.el-card__body {
  padding: 35px;
}
.el-dialog .el-form-item {
  padding: 6px;
}
</style>
