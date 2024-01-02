<template>
  <ul class="navigation animate__backInDown" v-if="config.setup.showNavigation">
    <!-- 标题 -->
    <li class="logo hidden-xs-only">
      <router-link to="/cate/0">
        <button>
          <span class="iconfont" style="font-size: 2rem">&#xe617;</span>
          <el-text class="title">{{ $t('title') }}</el-text>
        </button>
      </router-link>
    </li>
    <li class="logo hidden-sm-and-up">
      <button @click="drawer = true">
        <span class="iconfont" style="font-size: 2rem">&#xe617;</span>
      </button>
    </li>

    <li style="width: 100%; flex: 2"></li>

    <!-- 头像 -->
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
        <!-- 工具 -->
        <el-sub-menu index="1">
          <template #title>
            <span>
              <span class="iconfont" style="font-size: 20px; margin-left: 3px"> &#xe649; </span>
              {{ $t('usercard.6') }}
            </span>
          </template>
          <el-menu-item-group
            v-for="(item, i) in tools"
            :key="i"
            :title="item.title"
            style="background-color: var(--el-bg-color)"
          >
            <a :href="x.href" v-for="(x, j) in item.url" :key="j">
              <el-menu-item index="1">
                <el-icon> <Paperclip /> </el-icon>{{ x.name }}
              </el-menu-item>
            </a>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 板块列表 -->
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Expand /></el-icon>
            <span>{{ $t('usercard.11') }}</span>
          </template>

          <el-menu-item index="#" v-if="catelist.length == 0" style="background-color: var(--el-bg-color)">
            {{ $t('usercard.10') }}
          </el-menu-item>
          <el-menu-item
            :index="`/cate/${index}`"
            v-for="(x, index) of catelist"
            :key="x"
            style="background-color: var(--el-bg-color)"
            ><span class="iconfont" v-html="config.cateicon[`${x.id}`] + ' ' + x.name"></span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 主题切换 -->
        <el-menu-item index="#">
          <div
            style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between"
            @click="setTheme"
          >
            <span class="iconfont" v-if="config.setup.currentSkin" style="margin-left: 4px">
              &#xe614; {{ $t('usercard.2') }}</span
            >
            <span class="iconfont" v-else style="margin-left: 4px"> &#xe615; {{ $t('usercard.2') }}</span>
            <el-switch
              style="margin-left: auto"
              @click="setTheme"
              v-model="config.setup.currentSkin"
              inline-prompt
              :active-text="$t('usercard.13')"
              :inactive-text="$t('usercard.14')"
            />
          </div>
        </el-menu-item>

        <!-- 设置 -->
        <el-menu-item index="/setup">
          <el-icon>
            <setting />
          </el-icon>
          <span>{{ $t('usercard.3') }}</span>
        </el-menu-item>

        <!-- 用户中心 -->
        <el-menu-item index="/user" v-if="userInfo.state.isLogin">
          <el-icon class="iconfont"> &#xe6a4; </el-icon>
          <span>{{ $t('usercard.4') }}</span>
        </el-menu-item>

        <el-sub-menu index="3">
          <template #title>
            <span>{{ $t('usercard.8') }}: {{ langname }}</span>
          </template>

          <el-menu-item class="item" @click="setlang('zh-CN')">简体中文</el-menu-item>
          <el-menu-item class="item" @click="setlang('en-US')">English</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </el-drawer>

  <!-- 遮罩 -->
  <div class="bg" v-if="bgshow" :class="bgstate" @click="start"></div>

  <!-- 卡片菜单 -->
  <div class="usercard" :class="menustate" v-if="menu">
    <!-- 背景 -->
    <!-- https://files.superbed.cn/store/superbed/1c/e8/64eb64df661c6c8e549e1ce8.png -->
    <!-- <el-image fit="none" :lazy="true" src="../../../public/imgs/{2FB1489E-9572-4803-9114-850E04589091}.png" class="headimg"></el-image> -->
    <img
      loading="lazy"
      :src="userInfo.data.background ? userInfo.data.background : '../../../public/imgs/b1.png'"
      :alt="$t('usercard.0')"
      class="headimg"
    />
    <div class="body">
      <!-- 头像 -->
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

      <div class="item" @click="setTheme">
        <span class="iconfont" v-if="config.setup.currentSkin" style="color: var(--el-text-color-primary)"
          >&#xe614; {{ $t('usercard.2') }}</span
        >
        <span class="iconfont" v-else>&#xe615; {{ $t('usercard.2') }}</span>
        <el-switch
          class="switch"
          @click="setTheme"
          v-model="config.setup.currentSkin"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </div>

      <router-link to="/setup">
        <div class="item" style="justify-content: left">
          <b class="iconfont" tag="b">&#xe892;</b>&#160;
          <span class="iconfont" style="padding-bottom: 3px">{{ $t('usercard.3') }}</span>
        </div>
      </router-link>

      <router-link to="/user" v-if="userInfo.state.isLogin">
        <div class="item" style="justify-content: left">
          <b class="iconfont" tag="b">&#xe6a4;</b>&#160;
          <span class="iconfont" style="padding-bottom: 3px">{{ $t('usercard.4') }}</span>
        </div>
      </router-link>

      <div class="hr"></div>

      <!-- 外部工具 -->
      <div class="group" v-for="(item, i) in tools" :key="i">
        <div class="title">{{ item.title }}</div>
        <div class="item" v-for="(x, j) in item.url" :key="j">
          <a :href="x.href" class="iconfont"> &#xe621; {{ x.name }} </a>
        </div>
      </div>

      <div class="group">
        <div class="title">{{ $t('usercard.8') }}: {{ langname }}</div>
        <div class="item" @click="setlang('zh-CN')">简体中文</div>
        <div class="item" @click="setlang('en-US')">English</div>
      </div>

      <a @click="out" v-if="userInfo.state.isLogin">
        <div class="item" style="justify-content: left">
          <b class="iconfont" tag="b">&#xe9d4;</b>&#160;
          <span class="iconfont" style="padding-bottom: 3px">{{ $t('usercard.5') }}</span>
        </div>
      </a>

      <el-divider>{{ $t('usercard.9') }}</el-divider>
    </div>
  </div>

  <!-- 登录卡片 -->
  <div class="bg" style="pointer-events: none">
    <div class="loginbody" v-if="signin" :class="loginstate">
      <el-image src="../../../public/imgs/109834519_p0.jpg" class="hidden-xs-only titleimg"></el-image>

      <!-- 登录 -->
      <el-form :model="loginconfig.login" class="form" label-width="4rem" label-position="top" v-if="pageid == 1">
        <el-form-item>
          <span class="title">{{ page[pageid] }}</span>
        </el-form-item>
        <!-- 账号 -->
        <el-form-item :label="$t('login.2')" prop="user">
          <el-input v-model="loginconfig.login.user" type="email" :placeholder="$t('login.3')" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item :label="$t('login.4')" prop="pass">
          <el-input
            @keyup.enter="onlogin"
            v-model="loginconfig.login.pass"
            type="password"
            :placeholder="$t('login.5')"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <!-- 记住账号 -->
          <el-checkbox v-model="remember" :label="$t('login.6')" size="large" />
        </el-form-item>

        <!-- 去注册 -->
        <el-form-item label="">
          <span>{{ $t('login.8') }}</span>
          <el-button type="primary" link @click="loginswitch(2)">{{ $t('login.11') }}</el-button>
        </el-form-item>
        <!-- 按钮组 -->
        <el-form-item>
          <el-button type="primary" @click="showVcode = true">{{ $t('login.0') }}</el-button>
          <el-button @click="start">{{ $t('login.10') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 注册 -->
      <el-form
        :rules="rules"
        :model="loginconfig.regitser"
        class="form"
        label-width="4.5rem"
        label-position="top"
        v-if="pageid == 2"
        status-icon
      >
        <el-form-item>
          <span class="title">{{ page[pageid] }}</span>
        </el-form-item>
        <el-form-item :label="$t('login.12')" prop="nickname">
          <el-input v-model="loginconfig.regitser.nickname" type="text" :placeholder="$t('login.13')" />
        </el-form-item>
        <el-form-item :label="$t('login.2')" prop="email">
          <el-input v-model="loginconfig.regitser.email" type="email" :placeholder="$t('login.3')" />
        </el-form-item>
        <el-form-item :label="$t('login.4')" prop="pass">
          <el-input v-model="loginconfig.regitser.pass" type="password" :placeholder="$t('login.5')" show-password />
        </el-form-item>
        <el-form-item :label="$t('login.14')" prop="repass">
          <el-input v-model="loginconfig.regitser.repass" type="password" :placeholder="$t('login.5')" show-password />
        </el-form-item>
        <!-- 记住账号 -->
        <el-form-item label="">
          <span>{{ $t('login.17') }}</span>
          <el-button type="primary" link @click="loginswitch(1)">{{ $t('login.16') }}</el-button>
        </el-form-item>
        <!-- 按钮组 -->
        <el-form-item>
          <el-button type="primary" @click="showVcode = true">{{ $t('login.1') }}</el-button>
          <el-button @click="start">{{ $t('login.10') }}</el-button>
        </el-form-item>
      </el-form>

      <!-- 验证码 -->
      <Vcode :show="showVcode" @success="onlogin" @close="showVcode = false" :imgs="captcha.src" />
    </div>
  </div>
</template>

<script lang="ts">
import { themes } from '@style/themes.ts'
import { getcate, writePools, config, getHostUrl, login, loginOut, localSet, getCaptcha } from '@/api'
import { cateList } from '@/types'
import UserHead from '@comps/user/UserHead.vue'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'
import { ElMessageBox } from 'element-plus'
import UserRole from '@comps/user/UserRole.vue'
import i18n from '@/i18n.ts'
import { setup } from '@/config'

import Vcode from 'vue3-puzzle-vcode'

export default {
  name: 'Navigation',
  data() {
    let src = getHostUrl('/captcha')
    const $t = i18n.t
    return {
      $t,
      langname: '简体中文',
      langs: {
        'zh-CN': '简体中文',
        'en-US': 'English',
      } as { [key: string]: string },
      drawer: false,
      userInfo: config.userInfo,
      config,
      themeObj: {} as any,
      catelist: [] as cateList[],
      activeIndex: '/',
      menu: false,
      isPassing: false,
      showVcode: false,
      page: {
        1: '登录',
        2: '注册',
      },
      pageid: 1,
      bgshow: false,
      menustate: '', // 卡片菜单状态
      bgstate: '', // 背景黑幕状态
      loginstate: '',
      remember: false, // 记住账号
      loadingbutton: false, // 登录按钮加载
      signin: false, // 显示登录卡片
      baseCodeSrc: src,
      signintitle: '',
      captcha: {
        show: false,
        y: '',
        src: [] as string[],
      },
      /** 外部工具 */
      tools: [
        {
          title: $t('usercard.7'),
          url: [
            {
              href: 'https://www.schub.wiki/scapi',
              name: 'SC-API文档(建设中)',
            },
            {
              href: 'https://www.yuque.com/u589148/wf2knt',
              name: 'Mod开发教程',
            },
          ],
        },
        {
          title: $t('usercard.6'),
          url: [
            {
              href: 'http://suancaixianyu.gitee.io/sss',
              name: '简谱转换工具',
            },
          ],
        },
      ],
      /** 登录配置 */
      loginconfig: {
        regitser: {
          pass: '',
          repass: '',
          email: '',
          nickname: '',
          captcha_code: '',
        },
        login: {
          user: '',
          pass: '',
          captcha_code: '',
        },
      },
      /** 输入框错误提示 */
      rules: {
        email: [
          {
            required: true,
            message: $t('login.prompt.0'),
            trigger: 'blur',
          },
          {
            type: 'email',
            message: $t('login.prompt.1'),
            trigger: ['blur', 'change'],
          },
          {
            validator: (_rule: any, value: any, callback: any) => {
              if (value && !/(@qq\.com|@gmail\.com|@outlook\..*)$/.test(value)) {
                callback(new Error($t('login.prompt.2')))
              }
            },
            trigger: 'blur',
          },
        ],
        pass: [
          {
            required: true,
            message: $t('login.prompt.3'),
            trigger: 'blur',
          },
        ],
        repass: [
          {
            required: true,
            message: $t('login.prompt.3'),
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
            message: $t('login.prompt.6'),
            trigger: 'blur',
          },
          {
            min: 2,
            max: 10,
            message: $t('login.prompt.7'),
            trigger: 'blur',
          },
          {
            validator: (_rule: any, value: any, callback: any) => {
              if (value && !/^[\u4E00-\u9FA5A-Za-z0-9_]+$/.test(value)) {
                callback(new Error($t('login.prompt.8')))
              }
            },
            trigger: 'blur',
          },
        ],
        invitation: [
          {
            required: true,
            message: $t('login.prompt.9'),
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
    Vcode,
  },
  async mounted() {
    this.switchTheme()
    const list = await getcate()
    await this.onFinish()
    if (list) {
      this.catelist = [
        {
          id: 0,
          name: this.$t('usercard.12'),
          interaction: 0,
          introduce: this.$t('usercard.12'),
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
    async onFinish() {
      let captcha = await getCaptcha()
      if (captcha) {
        this.captcha.src = captcha.imgUrl
        this.captcha.show = true
        this.captcha.y = captcha.y
      }
    },
    setlang(lang: string) {
      i18n.setLocale(lang)
      setup.lang = lang
      this.langname = this.langs[lang]
      localSet('setup', setup)
    },
    /** 退出登录 */
    out() {
      ElMessageBox.alert(this.$t('login.21'), this.$t('login.22'), {
        confirmButtonText: this.$t('login.19'),
        callback: async () => {
          await loginOut()
          this.$router.push({ path: '/cate/0' })
        },
      })
    },
    /** 密码验证 */
    pass2(_rule: any, value: any, callback: any) {
      if (value && value != this.loginconfig.regitser.pass) {
        callback(new Error(this.$t('login.prompt.4')))
      }
      callback()
    },
    /** 页面切换 */
    loginswitch(id: number) {
      this.pageid = id
      this.showVcode = true
    },
    /** 登录 */
    async onlogin() {
      this.showVcode = false
      if (this.loadingbutton) return
      this.loadingbutton = true
      console.log('this.captcha.y', this.captcha.y)
      switch (this.pageid) {
        case 1:
          this.loginconfig.login.captcha_code = this.captcha.y
          this.loadingbutton = await login('/user/login', this.loginconfig.login, this.remember)
          break
        case 2:
          this.loginconfig.regitser.captcha_code = this.captcha.y
          this.loadingbutton = await login('/user/register', this.loginconfig.regitser, this.remember)
          break
      }
      if (this.loadingbutton) {
        this.loadingbutton = false
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

    setTheme() {
      setup.currentSkin = !setup.currentSkin
      this.switchTheme()
    },

    /** 根据不同的主题类型，获取不同主题数据 */
    switchTheme() {
      // themes 对象包含 defaultTheme、darkTheme 两个属性即默认主题与深色主题
      let currentSkinName = setup.currentSkin ? 'darkTheme' : 'defaultTheme'
      this.themeObj = themes[currentSkinName]
      // 设置css 变量
      Object.keys(this.themeObj).map((item) => {
        document.documentElement.style.setProperty(item, this.themeObj[item])
      })
      localSet('setup', setup)
    },
  },
}
</script>

<style scoped>
@import url('../../styles/style.scss');
</style>
