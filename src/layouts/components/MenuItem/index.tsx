import {
  defineComponent, PropType,
} from 'vue';

export interface IMenuTreeProps {
  id: string
  icon: string
  name: string
  parentId: string
  routePath: string
  children?: Array<IMenuTreeProps>
}

export default defineComponent({
  name: 'MenuItem',
  props: {
    item: {
      type: Object as PropType<IMenuTreeProps>,
    },
  },
  setup(props) {
    const { item } = props;
    return () => (
      item?.children && item.children.length
        ? <a-sub-menu
          key={item.id}
          title={item.name}
          icon={<i class={`iconfont ${item.icon}`}/>}
        >
          {
            item.children
              .map((subItem) => <menu-item key={subItem.id} item={subItem} />)
          }
        </a-sub-menu>
        : <a-menu-item
          key={item?.id}
          icon={<i class={`iconfont ${item?.icon}`}/>}
          >
          <span>{item?.name || ''}</span>
        </a-menu-item>
    );
  },
});
