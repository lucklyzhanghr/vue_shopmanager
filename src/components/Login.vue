<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头部图标区域 -->
      <div class="login_box_img">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表格 -->
      <el-form class="login_form" :model="form" :rules="rules" ref="form_ref">
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            ref="password"
            :type="type"
            prefix-icon="iconfont icon-3702mima"
            placeholder="请输入密码"
            v-model="form.password"
            :suffix-icon="showclass"
            @focus="showpassword"
          ></el-input>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-row class="buttons">
          <el-button type="primary" round @click="login">登陆</el-button>
          <el-button type="info" round @click="resetting">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      showclass: '',
      type: 'password'
    }
  },
  methods: {
    // 登录方法
    login () {
      this.$refs.form_ref.validate(async valid => {
        if (!valid) return // 没通过校验则不能提交登录
        // 通过校验则调用后台接口进行用户名 密码验证
        let { data: result } = await this.$axios
          .post('/login', this.form)
          .catch(err => {
            return alert(err)
          })
        // 失败
        if (result.meta.status !== 200 && result.meta.msg !== '登录成功') {
          return this.$message.error(result.meta.msg)
        }
        // 成功,把token存入sessionstorage中
        sessionStorage.setItem('token', result.data.token)
        this.$message.success('登录成功!')
        // 跳转到Home页
        this.$router.push('/home')
      })
    },
    // 重置form
    resetting () {
      this.$refs.form_ref.resetFields()
    },
    // 控制显示图标显隐
    showpassword () {
      this.showclass = 'iconfont icon-showpassword'
      this.$nextTick(() => {
        document
          .querySelector('.icon-showpassword')
          .addEventListener('mouseover', () => {
            this.type = 'input'
          })
        document
          .querySelector('.icon-showpassword')
          .addEventListener('mouseout', () => {
            this.type = 'password'
          })
      })
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    .login_box_img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      position: absolute;
      padding: 7px;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ddd;
      border: 1px solid #eee;
      box-shadow: 0 0 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 28px;
    box-sizing: border-box;
    .buttons {
      width: 165px;
      left: 50%;
      transform: translate(-50%);
    }
  }
}
</style>
