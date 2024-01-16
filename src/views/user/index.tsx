import {
  defineComponent, reactive, computed, ref, Ref, onMounted,
} from 'vue';
import type { IPagination, IUser, IUserQueryParam } from '@/server/interface';
import UserDetailsModal from './components/UserDetailsModal';
import userServer from '@/server/user';

type Key = string | number;

const columns = [
  {
    title: '用户名称',
    dataIndex: 'userName',
    key: 'userName',
    ellipsis: true,
    fixed: 'left',
  },
  {
    title: '真实名称',
    dataIndex: 'realName',
    key: 'realName',
    ellipsis: true,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
  },
  {
    title: '出生日期', dataIndex: 'dateOfBirth', key: 'dateOfBirth', width: 160,
  },
  {
    title: '头像', dataIndex: 'avatar', key: 'avatar', width: 100,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 260,
  },
];

export default defineComponent({
  setup() {
    const state = reactive<{
      selectedRowKeys: Key[];
      loading: boolean;
      queryParam: IUserQueryParam;
      data: IUser[];
      pagination: IPagination;
    }>({
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      queryParam: {
        queryValue: '',
        current: 1,
        pageSize: 10,
      },
      data: [],
    });

    const queryParam = computed<IUserQueryParam>(() => ({
      current: state.pagination.current,
      pageSize: state.pagination.pageSize,
      queryValue: state.queryParam.queryValue?.trim(),
    }));
    const hasSelected = computed(() => state.selectedRowKeys.length > 0);
    const userModalInfo = ref<IUser>({} as any);

    const { onAddUser } = useAddUser(userModalInfo);

    // const delete = ()=> {

    // }

    const refresh = async (reset = false) => {
      if (state.loading) {
        return;
      }

      if (reset) {
        state.pagination.current = 1;
      }

      state.loading = true;

      try {
        const { list, pagination } = await userServer.query(queryParam.value);
        state.data = list;
        state.pagination = pagination;
      } catch (error) {
        console.error(error);
      }
      state.loading = false;
    };

    const onSelectChange = (selectedRowKeys: Key[]) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      state.selectedRowKeys = selectedRowKeys;
    };

    const onSearch = () => {
      refresh(true);
    };

    const onChange = (pagination: IPagination) => {
      if (pagination.current !== state.pagination.current) {
        state.pagination.current = pagination.current;
      }

      if (pagination.pageSize !== state.pagination.pageSize) {
        state.pagination.pageSize = pagination.pageSize;
        state.pagination.current = 1;
      }

      refresh();
    };

    const onSubmit = (isEdit:boolean) => {
      if (!isEdit && state.pagination.total === state.pagination.pageSize) {
        state.pagination.current += 1;
      }

      refresh();
    };

    const onEdit = (record:IUser) => {
      userModalInfo.value = {
        ...record,
      };
    };

    onMounted(() => {
      refresh(true);
    });

    return () => (
      <div>
        <a-spin spinning={state.loading}>
          <div class="flex justify-between content-center m-5">
            {/* 功能区 */}
            <div>
              <a-button
                type="primary"
                size="large"
                class="mr-5"
                onClick={onAddUser}
              >
                添加
              </a-button>
              <a-button
                type="primary"
                size="large"
                danger
                disabled={!hasSelected}
                loading={state.loading}
                // onClick={() => delect()}
              >
                删除
              </a-button>
            </div>
            <div>
              <a-input-search
                v-model:value={state.queryParam.queryValue}
                placeholder="请输入用户名称"
                enter-button="搜索"
                size="large"
                onSearch={onSearch}
              />
            </div>
          </div>

          {/* 表单 */}
          <a-table
            columns={columns}
            data-source={state.data}
            row-selection={{
              selectedRowKeys: state.selectedRowKeys,
              onChange: onSelectChange,
            }}
            scroll={{ x: 1000 }}
            onChange={onChange}
            pagination={state.pagination}
          >
            {{
              bodyCell: ({ column, text, record }: any) => {
                switch (column.key) {
                  case 'gender':
                    return text === 0 ? '女' : '男';

                  case 'avatar':
                    return <img src={`/avatar/${text}`} alt={text} class="w-12 h-12"/>;

                  case 'action':
                    return (
                      <span>
                        <a-button type="primary" size="small" class="mr-5" onClick={() => onEdit(record)}>
                          编辑
                        </a-button>

                        <a-button type="primary" size="small" danger class="mr-5">
                          删除
                        </a-button>

                        <a-button
                          type="dashed"
                          size="small"
                          danger
                        >
                          禁用
                        </a-button>
                      </span>
                    );

                  default:
                    break;
                }
                return undefined;
              },
            }}
          </a-table>

          {/* 模态框 */}
          <UserDetailsModal modelValue={userModalInfo.value} onSubmit={onSubmit}/>
        </a-spin>
      </div>
    );
  },
});

function useAddUser(userModalInfo: Ref<IUser>) {
  const defaultUser: IUser = {
    id: '',
    avatar: '',
    userName: '',
    password: '',
    realName: '',
    gender: 1,
    dateOfBirth: '',
    phone: '',
    email: '',
    status: 1,
  };

  const onAddUser = () => {
    userModalInfo.value = {
      ...defaultUser,
    };
  };

  return {
    onAddUser,
  };
}
