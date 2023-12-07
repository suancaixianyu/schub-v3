<template>
  <ul class="navigation animate__backInDown" v-if="config.setup.showNavigation">
    <li class="logo hidden-xs-only">
      <router-link to="/cate/0">
        <button>
          <span class="iconfont" style="font-size: 2rem">&#xe617;</span>
          <el-text class="title">SC中文社区</el-text>
        </button>
      </router-link>
    </li>
    <li class="logo hidden-sm-and-up">
      <button @click="drawer = true">
        <span class="iconfont" style="font-size: 2rem">&#xe617;</span>
      </button>
    </li>

    <li style="width: 100%; flex: 2"></li>
    <li class="right">
      <ul class="tools">
        <li>
          <button>
            <span class="iconfont" style="font-size: 1.5rem">&#xe616;</span>
          </button>
        </li>

        <li>
          <div style="display: flex; align-items: center" @click="openmenu()" class="hidden-xs-only">
            <el-image class="head" v-if="userInfo.state.isLogin && userInfo.data.headurl" :src="userInfo.data.headurl" />
            <span class="head bj" v-else :title="userInfo.data.nickname">
              <span>{{ userInfo.state.isLogin ? userInfo.data.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] : '游' }}</span>
            </span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </div>
          <div style="display: flex; align-items: center" class="hidden-sm-and-up">
            <el-image class="head" v-if="userInfo.state.isLogin && userInfo.data.headurl" :src="userInfo.data.headurl" />
            <span class="head bj" v-else :title="userInfo.data.nickname" @click="openlogin">
              <span>{{ userInfo.state.isLogin ? userInfo.data.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] : '游' }}</span>
            </span>
          </div>
        </li>
      </ul>
    </li>
  </ul>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer" direction="ltr" :with-header="true" title="菜单" size="65%">
    <div style="margin: -20px">
      <el-menu
        style="background-color: var(--el-bg-color)"
        @select="handleSelect"
        :router="true"
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        @open="true"
        :unique-opened="true"
      >
        <el-sub-menu index="1">
          <template #title>
            <span>
              <span class="iconfont" style="font-size: 20px; margin-left: 3px"> &#xe649; </span>
              工具
            </span>
          </template>
          <el-menu-item-group title="外部工具" style="background-color: var(--el-bg-color)">
            <a href="http://suancaixianyu.gitee.io/sss">
              <el-menu-item index="1">
                <el-icon> <Paperclip /> </el-icon>简谱转换
              </el-menu-item>
            </a>

            <a href="https://schub.wiki/gpt">
              <el-menu-item index="2">
                <el-icon> <Paperclip /> </el-icon>白嫖gpt(需科学上网)
              </el-menu-item>
            </a>
          </el-menu-item-group>
          <el-menu-item-group title="MOD制作" style="background-color: var(--el-bg-color)">
            <a href="https://www.yuque.com/u589148/wf2knt" target="_blank">
              <el-menu-item index="3">
                <el-icon> <Paperclip /> </el-icon>Mod开发教程
              </el-menu-item>
            </a>

            <a href="https://schub.wiki/scapi" target="_blank">
              <el-menu-item index="4">
                <el-icon> <Paperclip /> </el-icon>SC-API文档(建设中)
              </el-menu-item>
            </a>
          </el-menu-item-group>
        </el-sub-menu>

        <el-sub-menu index="2">
          <template #title>
            <el-icon><Expand /></el-icon>
            <span>板块列表</span>
          </template>

          <el-menu-item index="#" v-if="catelist.length == 0" style="background-color: var(--el-bg-color)"> 什么也没有 </el-menu-item>
          <el-menu-item :index="`/cate/${index}`" v-for="(x, index) of catelist" :key="x" style="background-color: var(--el-bg-color)"
            ><span class="iconfont" v-html="config.cateicon[`${x.id}`] + ' ' + x.name"></span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="#">
          <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between" @click="switchTheme()">
            <span class="iconfont" v-if="config.setup.currentSkin">&#xe614; 深色模式</span>
            <span class="iconfont" v-else>&#xe615; 深色模式</span>
            <el-switch
              style="margin-left: auto"
              @click="switchTheme()"
              v-model="config.setup.currentSkin"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
          </div>
        </el-menu-item>

        <el-menu-item index="/setup">
          <el-icon>
            <setting />
          </el-icon>
          <span>设置</span>
        </el-menu-item>

        <el-menu-item index="/user">
          <el-icon>
            <setting />
          </el-icon>
          <span>用户中心</span>
        </el-menu-item>
      </el-menu>
    </div>
  </el-drawer>

  <!-- 遮罩 -->
  <div class="bg" v-if="bgshow" :class="bgstate" @click="start"></div>
  <!-- 用户菜单 -->
  <div class="usercard" :class="menustate" v-if="menu">
    <!-- https://files.superbed.cn/store/superbed/1c/e8/64eb64df661c6c8e549e1ce8.png -->
    <!-- <el-image fit="none" :lazy="true" src="../../../public/imgs/{2FB1489E-9572-4803-9114-850E04589092}.png" class="headimg"></el-image> -->
    <img
      loading="lazy"
      :src="userInfo.data.background ? userInfo.data.background : '../../../public/imgs/{2FB1489E-9572-4803-9114-850E04589092}.png'"
      alt="主页背景图"
      class="headimg"
    />
    <div class="body">
      <div class="head">
        <el-image class="headimage" v-if="userInfo.state.isLogin && userInfo.data.headurl" :src="userInfo.data.headurl" />
        <span class="headimage bj" v-else :title="userInfo.data.nickname" @click="openlogin">
          <span>{{ userInfo.state.isLogin ? userInfo.data.nickname?.replace(/[^\u4e00-\u9fa5a-zA-Z]+/, '')[0] : '游' }}</span>
        </span>
      </div>
      <div class="nackname">
        <el-text tag="b" size="large">
          {{ userInfo.data.nickname }}
        </el-text>
        <UserRole :role="userInfo.data.role" />
      </div>
      <div class="uid">
        <el-text size="small">{{ userInfo.data.account }}</el-text>
      </div>

      <div class="hr"></div>

      <div class="item" @click="switchTheme()">
        <span class="iconfont" v-if="config.setup.currentSkin" style="color: var(--el-text-color-primary)">&#xe614; 深色模式</span>
        <span class="iconfont" v-else>&#xe615; 深色模式</span>
        <el-switch class="switch" @click="switchTheme()" v-model="config.setup.currentSkin" inline-prompt active-text="是" inactive-text="否" />
      </div>

      <router-link to="/setup">
        <div class="item" style="justify-content: left">
          <b class="iconfont" tag="b">&#xe892;</b>&#160;
          <span class="iconfont" style="padding-bottom: 3px">设置</span>
        </div>
      </router-link>

      <router-link to="/user" v-if="userInfo.state.isLogin">
        <div class="item" style="justify-content: left">
          <b class="iconfont" tag="b">&#xe9d4;</b>&#160;
          <span class="iconfont" style="padding-bottom: 3px">用户中心</span>
        </div>
      </router-link>

      <div class="hr"></div>

      <div class="group">
        <div class="title">外部工具</div>
        <div class="item">
          <a href="http://suancaixianyu.gitee.io/sss" class="iconfont"> &#xe621; 简谱转换 </a>
        </div>
        <div class="item">
          <a href="https://schub.wiki/gpt" class="iconfont"> &#xe621; 白嫖gpt(需科学上网) </a>
        </div>
      </div>

      <div class="group">
        <div class="title">Mod制作</div>
        <div class="item">
          <a href="https://www.yuque.com/u589148/wf2knt" class="iconfont"> &#xe621; Mod开发教程 </a>
        </div>
        <div class="item">
          <a href="https://schub.wiki/scapi" class="iconfont"> &#xe621; SC-API文档(建设中) </a>
        </div>
      </div>

      <a @click="out" v-if="userInfo.state.isLogin">
        <div class="item" style="justify-content: left">
          <b class="iconfont" tag="b">&#xe9d4;</b>&#160;
          <span class="iconfont" style="padding-bottom: 3px">退出登录</span>
        </div>
      </a>

      <el-divider>诶嘿</el-divider>
    </div>
  </div>
  <!-- 登录卡片 -->
  <div class="bg" style="pointer-events: none">
    <div class="loginbody" v-if="signin" :class="loginstate">
      <el-image src="../../../public/imgs/b432c72abcc127e589f71160dcec7b12.jpg" class="hidden-xs-only titleimg"></el-image>
      <el-form :model="loginconfig.login" class="form" label-width="4rem" label-position="top" v-if="page == '登录'">
        <el-form-item>
          <span class="title">{{ page }}</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="user">
          <el-input v-model="loginconfig.login.user" type="email" placeholder="输入邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="pass">
          <el-input @keyup.enter="onlogin" v-model="loginconfig.login.pass" type="password" placeholder="输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="remember" label="记住账号" size="large" />
        </el-form-item>

        <el-form-item label="">
          <span>没有账号？</span>
          <el-button type="primary" link @click="loginswitch('注册')">点击注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginswitch('验证码')">登录</el-button>
          <el-button @click="start">取消</el-button>
        </el-form-item>
      </el-form>

      <el-form :rules="rules" :model="loginconfig.regitser" class="form" label-width="4.5rem" label-position="top" v-if="page == '注册'" status-icon>
        <el-form-item>
          <span class="title">{{ page }}</span>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="loginconfig.regitser.nickname" type="text" placeholder="输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginconfig.regitser.email" type="email" placeholder="输入邮箱" />
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="loginconfig.regitser.pass" type="password" placeholder="输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="repass">
          <el-input v-model="loginconfig.regitser.repass" type="password" placeholder="输入密码" show-password />
        </el-form-item>
        <el-form-item label="邀请码" prop="invitation">
          <el-input v-model="loginconfig.regitser.invitation" type="text" placeholder="邀请码" />
        </el-form-item>
        <el-form-item label="">
          <span>已有账号？</span>
          <el-button type="primary" link @click="loginswitch('登录')">点击登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loginswitch('验证码')">注册</el-button>
          <el-button @click="start">取消</el-button>
        </el-form-item>
      </el-form>

      <div v-if="page == '验证码'" class="captcha">
        <div class="item">
          <el-input v-model="imgcode" type="text" style="max-width: 300px" placeholder="图片验证码" />
        </div>
        <div class="item">
          <div v-if="codeSrc == ''" style="width: 250px; height: 62px"></div>
          <img v-else :src="codeSrc" @click="refreshCode" />
        </div>

        <div class="item">
          <vue-hcaptcha sitekey="ebc1a1c0-79d5-4979-839f-c32e938f3629" @verify="addHcaptchaToken"></vue-hcaptcha>
        </div>

        <div class="item">
          <el-button type="primary" @click="onlogin" :loading="loadingbutton"> 确定 </el-button>
          <el-button @click="loginswitch(backpage)">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { themes } from '@style/themes.ts'
import { getcate, writePools, config, getHostUrl, login, loginOut } from '@/api'
import { cateList } from '@/types'
import UserHead from '@comps/user/UserHead.vue'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { ElMessageBox } from 'element-plus'
import UserRole from '@comps/user/UserRole.vue'

export default {
  name: 'Navigation',
  data() {
    let src = getHostUrl('/captcha')
    return {
      drawer: false,
      userInfo: config.userInfo,
      config,
      themeObj: {} as any,
      catelist: [] as cateList[],
      activeIndex: '/',
      menu: false,
      page: '登录',
      backpage: '',
      bgshow: false,
      menustate: '',
      bgstate: '',
      loginstate: '',
      remember: false, // 记住账号
      loadingbutton: false, // 登录按钮加载
      signin: false, // 显示登录卡片
      codeSrc: '', // 图片验证
      captcha_code: '', // 人机验证
      imgcode: '', // 图片验证马链接
      baseCodeSrc: src,
      signintitle: '',
      loginconfig: {
        regitser: {
          pass: '',
          repass: '',
          email: '',
          nickname: '',
          captcha_code: '',
          pass_uuid: '',
          invitation: '',
        },
        login: {
          user: '',
          pass: '',
          captcha_code: '',
          pass_uuid: '',
        },
      },
      rules: {
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change'],
          },
          {
            validator: (_rule: any, value: any, callback: any) => {
              if (value && !/(@qq\.com|@gmail\.com|@outlook\..*)$/.test(value)) {
                callback(new Error('仅支持@qq.com、@gmail.com、@outlook.com邮箱'))
              }
            },
            trigger: 'blur',
          },
        ],
        pass: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
        ],
        repass: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
          },
          {
            validator: this.pass2,
            trigger: 'blur',
          },
        ],
        nickname: [
          {
            required: true,
            message: '昵称不能为空',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: '昵称长度只能是2到10',
            trigger: 'blur',
          },
          {
            validator: (_rule: any, value: any, callback: any) => {
              if (value && !/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)) {
                callback(new Error('昵称只能由汉字、英文字母、数字、下划线组成'))
              }
            },
            trigger: 'blur',
          },
        ],
        invitation: [
          {
            required: true,
            message: '邀请码不能为空',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  components: {
    UserHead,
    VueHcaptcha,
    UserRole,
  },
  async mounted() {
    const list = await getcate()
    if (list) {
      this.catelist = [
        {
          id: 0,
          name: '全部板块',
          interaction: 0,
          introduce: '全部板块',
          postnum: 0,
          stat: 1,
        },
        ...list,
      ]
      // 将列表存入存储池
      if (this.catelist.length > 1) {
        writePools('catelist', this.catelist)
      }
    }
  },
  methods: {
    /** 退出登录 */
    out() {
      ElMessageBox.alert('确定要退出登录吗？', '退出登录', {
        confirmButtonText: '确定',
        callback: async () => {
          await loginOut()
          this.$router.push({ path: '/cate/0' })
        },
      })
    },
    /** 密码验证 */
    pass2(_rule: any, value: any, callback: any) {
      if (value && value != this.loginconfig.regitser.pass) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    /** 刷新图片验证码 */
    refreshCode() {
      this.imgcode = ''
      this.codeSrc = this.baseCodeSrc + '?t=' + new Date().getTime()
    },
    /** 页面切换 */
    loginswitch(title: string) {
      this.backpage = this.page
      this.page = title
      if (title == '验证码') this.refreshCode()
    },
    addHcaptchaToken(token: string) {
      this.captcha_code = token
    },
    /** 登录 */
    async onlogin() {
      if (this.loadingbutton) return
      if (!this.captcha_code || !this.imgcode) {
        alert('验证码不能为空')
        return
      }
      this.loadingbutton = true
      switch (this.backpage) {
        case '登录':
          this.loginconfig.login.captcha_code = this.imgcode
          this.loginconfig.login.pass_uuid = this.captcha_code
          this.loadingbutton = await login('/user/login', this.loginconfig.login, this.remember)
          break
        case '注册':
          this.loginconfig.regitser.captcha_code = this.imgcode
          this.loginconfig.regitser.pass_uuid = this.captcha_code
          this.loadingbutton = await login('/user/register', this.loginconfig.regitser, this.remember)
          break
      }
      if (this.loadingbutton) {
        this.loadingbutton = false
        this.refreshCode()
        // this.loginswitch(this.backpage)
      } else {
        this.start()
      }
    },
    /** 关闭窗口 */
    start() {
      if (this.signin) this.openlogin()
      if (this.menu) this.openmenu()
    },
    openlogin() {
      if (this.signin) {
        this.bgstate = 'bgoff'
        this.loginstate = 'loginoff'
        setTimeout(() => {
          this.signin = false
          this.bgshow = false
        }, 300)
      } else {
        this.menustate = 'usercardoff'
        this.loginstate = 'loginon'
        this.bgstate = 'bgon'
        this.bgshow = true
        this.signin = true
        setTimeout(() => {
          this.menu = false
        }, 300)
      }
    },
    openmenu() {
      if (this.menu) {
        this.menustate = 'usercardoff'
        this.bgstate = 'bgoff'
        setTimeout(() => {
          this.menu = false
          this.bgshow = false
        }, 300)
      } else {
        this.menustate = 'usercardon'
        this.bgstate = 'bgon'
        this.menu = true
        this.bgshow = true
      }
    },
    handleSelect(index: string) {
      this.activeIndex = index
    },

    // 根据不同的主题类型 获取不同主题数据
    switchTheme() {
      // themes 对象包含 defaultTheme、darkTheme 两个属性即默认主题与深色主题
      let currentSkinName = this.config.setup.currentSkin ? 'defaultTheme' : 'darkTheme'
      this.themeObj = themes[currentSkinName]
      // 设置css 变量
      Object.keys(this.themeObj).map((item) => {
        document.documentElement.style.setProperty(item, this.themeObj[item])
      })
      this.config.setup.currentSkin = !this.config.setup.currentSkin
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
