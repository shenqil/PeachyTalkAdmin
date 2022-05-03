import { defineComponent,ref,onMounted,reactive } from 'vue'
import { UserOutlined, LockOutlined, ExportOutlined } from "@ant-design/icons-vue";
import {getCaptchaid,getCaptcha,login} from '@/server/login';
import {ILoginParams} from '@/server/interface'
import {md5Hash} from '@/utils/security'
import {useRouter,useRoute} from 'vue-router'
import logo from '@/assets/logo.png'
import styles from './index.module.scss';

export default defineComponent({
  name: 'login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const formRef = ref();
    const loading = ref(false);
    const formState = reactive({
      userName: "",
      password: "",
      captchaId: "",
      captchaCode: "",
    })

    const captcha = useCaptcha(formState);
    const rules = useValidator();

    //  登录函数
    async function handleLogin() {
      loading.value = true;

      try {
        await login({
          userName: formState.userName.trim(),
          password: md5Hash(formState.password.trim()),
          captchaId: formState.captchaId,
          captchaCode: formState.captchaCode,
        });

        if (typeof route.query.redirect === "string") {
          window.location.href = decodeURIComponent(route.query.redirect);
        } else {
          router.push({
            name: "dashboard",
          });
        }
      } catch (error) {
        captcha.refreshCaptcha();
      }

      loading.value = false;
    }

    return () => (
      <div class={styles.login}>
        <div class="login_title">
          <img class="login_title-logo" src={logo} alt="" />
          <h1 class="login_title-text">IM 后台管理系统</h1>
        </div>
        <div class="login_container">
          <a-form
            ref={formRef}
            layout="vertical"
            model={formState}
            rules={rules}
            finish={()=>handleLogin()}
          >
            <a-form-item name="userName" label="用户名称">
              <a-input
                v-model:value={formState.userName}
                size="large"
                placeholder="请输入用户名称"
              >
                <prefix>
                  <user-outlined />
                </prefix>
              </a-input>
            </a-form-item>
    
            <a-form-item name="password" label="密码">
              <a-input-password
                v-model:value={formState.password}
                size="large"
                placeholder="请输入用户密码"
              >
                <prefix>
                  <LockOutlined />
                </prefix>
              </a-input-password>
            </a-form-item>
    
            <a-form-item name="captchaCode" label="验证码">
              <a-input
                class="login_captcha-input"
                v-model:value={formState.captchaCode}
                size="large"
                placeholder=""
              />
    
              <a-tooltip title="点击刷新图片" color="#108ee9">
                <img 
                  class="login_captcha-img" 
                  src={captcha.captchaUrl?.value||''} 
                  onClick={()=>captcha.refreshCaptcha()}
                />
              </a-tooltip>
            </a-form-item>
    
            <div class="login_submit">
              <a-button
                loading={loading.value}
                class="login_submit-btn"
                type="primary"
                html-type="submit"
                size="large"
              >
                <icon>
                  <ExportOutlined />
                </icon>
                登录
              </a-button>
            </div>
          </a-form>
        </div>
      </div>
    )
  }
})

/**
 * 验证码处理函数
 * */ 
function useCaptcha(formState:ILoginParams){
  let captchaUrl = ref("");

  // 刷新二维码
  async function refreshCaptcha() {
    // 获取图片id
    formState.captchaId = await getCaptchaid();
    // 获取图片
    captchaUrl.value = getCaptcha(formState.captchaId);
  }

  onMounted(() => {
    refreshCaptcha();
  });

  return {
    captchaUrl,
    refreshCaptcha,
  };
}

/**
 * 校验器规则
 * */
 function useValidator() {
  return {
    userName: {
      required: true,
      validator: (rule: any, value: string) => {
        if (!value) {
          return Promise.reject("请输入用户名");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
    password: {
      required: true,
      validator(rule: any, value: string) {
        if (!value) {
          return Promise.reject("请输入密码");
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(value)) {
          return Promise.reject("需要8-16个包含大小写字母和数字的字符");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
    captchaCode: {
      required: true,
      validator(rule: any, value: string) {
        if (!value) {
          return Promise.reject("请输入验证码");
        } else if (!/^\d{4}$/.test(value)) {
          return Promise.reject("验证码不合法");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  };
}