<template>
  <el-container class="container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="@/assets/heima.png" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideCollapse ? '64px' : '200px'">
        <div
          class="toggle"
          :title="asideCollapse ? '展开' : '收起'"
          @click="toggleCollapse"
        >
          |||
        </div>
        <el-menu
          :default-active="'1'"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="asideCollapse"
          :collapse-transition="false"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :key="item.id"
            :index="item.id.toString()"
            v-for="item in asideMenuData"
          >
            <template slot="title">
              <i :class="iconImages[item.authName]"></i>
              <span class="">{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="secItem in item.children"
              :key="secItem.id"
              :index="
                secItem.authName == '用户列表' ? '1' : secItem.id.toString()
              "
              @click="jumpTo(secItem.path)"
            >
              <template>
                <i class="el-icon-menu"></i>
                <span>{{ secItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      asideMenuData: [],
      iconImages: {
        用户管理: 'iconfont icon-users',
        权限管理: 'iconfont icon-lock_fill',
        商品管理: 'iconfont icon-shangpin',
        订单管理: 'iconfont icon-danju',
        数据统计: 'iconfont icon-baobiao'
      },
      activeIndex: '',
      asideCollapse: false
    }
  },
  methods: {
    logout () {
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getAsideMenuData () {
      let { data: result } = await this.$axios.get('/menus').catch(err => {
        this.$message.error(err.message)
        throw err
      })
      this.asideMenuData = result.data
    },
    jumpTo (path) {
      this.$router.push('/' + path)
    },
    // 切换侧边栏收放状态
    toggleCollapse () {
      this.asideCollapse = !this.asideCollapse
    }
  },
  // 生命周期函数,这个时候data render  watch/event 事件回调等都已完成,可以请求初始化数据挂载到data上
  created () {
    this.getAsideMenuData()
    this.$router.push('/home')
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
  }

  span {
    margin-left: 10px;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: 0;
  }
  .toggle {
    background-color: #4a5064;
    color: #fff;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    padding-bottom: 3px;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-submenu__title span {
  margin-left: 10px;
}
.el-menu--popup {
  padding: 0 !important;
}
</style>
