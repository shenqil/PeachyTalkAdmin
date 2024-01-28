import {
  defineComponent, ref,
} from 'vue';
import { DownOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';
import { useUserStore, useAuthStore } from '@/store';
import PasswordModal from '@/components/PasswordModal';

export default defineComponent({
  name: 'ToUser',
  setup() {
    const { userInfo } = storeToRefs(useUserStore());
    const { signOut } = useAuthStore();
    const { passwordModal } = usePasswordModal();

    return () => (
      <div>
        <a-dropdown
          trigger={['click']}
          overlay={
            <a-menu>
              {/* <a-menu-item key="modifyPassword" onclick={handleOpenPasswordModal}>
                修改密码
              </a-menu-item> */}

              <a-menu-divider />

              <a-menu-item key="signOut" onclick={signOut}>
                退出登录
              </a-menu-item>
            </a-menu>
          }
        >
          <div class="cursor-pointer">
            <span class="px-2">
              {userInfo.value?.realName || ''}
            </span>
            <DownOutlined />
          </div>

        </a-dropdown>

        <PasswordModal v-model={passwordModal.value} />
      </div>
    );
  },
});

/**
 * 密码弹窗
 * */
function usePasswordModal() {
  const passwordModal = ref(false);
  function handleOpenPasswordModal() {
    passwordModal.value = true;
  }

  return {
    passwordModal,
    handleOpenPasswordModal,
  };
}
