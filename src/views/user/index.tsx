import {
  defineComponent, reactive, computed, ref, Ref, onMounted,
} from 'vue';
import type { IPagination, IUser, IUserQueryParam } from '@/server/interface';
import UserDetailsModal from './components/UserDetailsModal';
import userServer from '@/server/user';

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
    title: '出生日期',
    dataIndex: 'dateOfBirth',
    key: 'dateOfBirth',
    width: 160,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    key: 'avatar',
    width: 100,
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
      selectedRowKeys: string[];
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

    const onSelectChange = (selectedRowKeys: any) => {
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

    const onSubmit = (isEdit: boolean) => {
      refresh(isEdit);
    };

    const onEdit = (record: IUser) => {
      userModalInfo.value = {
        ...record,
      };
    };

    const onChangeUserStatus = async (id: string, status: number) => {
      state.loading = true;
      const changeFn = status === 1 ? userServer.disable : userServer.enable;
      try {
        await changeFn(id);
        state.loading = false;
        refresh(false);
      } catch (error) {
        state.loading = false;
        console.error(error);
      }
    };

    const onDelete = async (id: string) => {
      state.loading = true;
      try {
        await userServer.remove(id);
        state.loading = false;
        refresh(state.data.length === 1);
      } catch (error) {
        state.loading = false;
        console.error(error);
      }
    };

    const onBatchDelete = async () => {
      state.loading = true;
      try {
        await userServer.batchDelete(state.selectedRowKeys);
        state.loading = false;
        refresh(state.data.length === state.selectedRowKeys.length);
      } catch (error) {
        state.loading = false;
        console.error(error);
      }
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
                disabled={!hasSelected.value}
                loading={state.loading}
                onClick={() => onBatchDelete()}
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
                allowClear={true}
                onSearch={onSearch}
              />
            </div>
          </div>

          {/* 表单 */}
          <a-table
            rowKey="id"
            columns={columns}
            data-source={state.data}
            row-selection={{
              selectedRowKeys: state.selectedRowKeys,
              onChange: onSelectChange,
            }}
            scroll={{ x: 1000, y: 'calc(100vh - 350px)' }}
            onChange={onChange}
            pagination={state.pagination}
          >
            {{
              bodyCell: ({ column, text, record }: any) => {
                switch (column.key) {
                  case 'gender':
                    return text === 1 ? '男' : '女';

                  case 'avatar':
                    return (
                      <img
                        src={`/avatar/${text}`}
                        alt={text}
                        class="w-12 h-12"
                      />
                    );

                  case 'action':
                    return (
                      <span>
                        <a-button
                          type="primary"
                          size="small"
                          class="mr-5"
                          onClick={() => onEdit(record)}
                        >
                          编辑
                        </a-button>

                        <a-popconfirm
                          title={`确认${
                            record.status === 1 ? '禁用' : '启用'
                          }当前用户？`}
                          ok-text="确认"
                          cancel-text="取消"
                          onConfirm={() => onChangeUserStatus(record.id, record.status)
                          }
                          class="mr-5"
                        >
                          <a-button
                            type="primary"
                            size="small"
                            ghost
                            danger={record.status === 1}
                          >
                            {record.status === 1 ? '禁用' : '启用'}
                          </a-button>
                        </a-popconfirm>

                        <a-popconfirm
                          title="确认删除当前用户？"
                          ok-text="确认"
                          cancel-text="取消"
                          onConfirm={() => onDelete(record.id)}
                        >
                          <a-button type="primary" size="small" danger>
                            删除
                          </a-button>
                        </a-popconfirm>
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
          <UserDetailsModal
            modelValue={userModalInfo.value}
            onSubmit={onSubmit}
          />
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
