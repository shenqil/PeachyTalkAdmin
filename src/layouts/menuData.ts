import { IMenuTreeProps } from './components/MenuItem';

export default ():IMenuTreeProps[] => [
  {
    id: 'dashboard',
    icon: 'icon-shouye',
    name: 'dashboard',
    parentId: '',
    routePath: '/dashboard',
  },
  {
    id: 'user',
    icon: 'icon-yonghuguanli',
    name: '用户管理',
    parentId: '',
    routePath: '/user',
  },
  // {
  //   id: 'test',
  //   icon: 'icon-shouye',
  //   name: '测试一级',
  //   parentId: '',
  //   routePath: '/dashboard',
  //   children: [
  //     {
  //       id: 'test1',
  //       icon: 'icon-shouye',
  //       name: '测试二级1',
  //       parentId: 'test',
  //       routePath: '/dashboard',
  //     },
  //     {
  //       id: 'test2',
  //       icon: 'icon-shouye',
  //       name: '测试二级2',
  //       parentId: 'test',
  //       routePath: 'https://www.antdv.com/components/layout',
  //     },
  //   ],
  // },
];
