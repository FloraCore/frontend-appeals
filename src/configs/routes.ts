/**
 * 路由
 * 配置参考：https://umijs.org/docs/max/layout-menu#%E6%89%A9%E5%B1%95%E7%9A%84%E8%B7%AF%E7%94%B1%E9%85%8D%E7%BD%AE
 */
export default [{
    name: '主页',
    path: '/',
    component: 'index',
}, {
    name: '处罚申诉',
    path: '/appeal',
    component: 'appeal',
}, {
    name: '异常申诉',
    hideInMenu: true,
    path: '/appeal-abnormal',
    component: 'appeal/abnormal',
}, {
    name: '查询',
    path: '/query',
    component: 'query',
}, {
    path: '/user',
    hideInMenu: true,
    headerRender: false,
    routes: [{
        name: '用户登录',
        path: '/user/login',
        component: 'user/login',
    }],
}, {
    path: '/staff',
    name: 'STAFF',
    wrappers: ['@/wrappers/auth',],
    access: 'canUser',
    routes: [{
        name: '申诉总览',
        path: '/staff/appeal/overview',
        component: 'staff/appeal/overview',
    }, {
        name: '设置',
        path: '/staff/settings',
        component: 'staff/settings',
    },],
}, {
    path: '/admin',
    name: '管理',
    wrappers: ['@/wrappers/auth',],
    access: 'canAdmin',
    routes: [{
        name: '用户管理',
        path: '/admin/user',
        component: 'admin/user',
    }, {
        name: 'MarkDowns管理',
        path: '/admin/markdowns',
        component: 'admin/markdowns',
    }, {
        name: '推荐理由管理',
        path: '/admin/reasons',
        component: 'admin/reasons',
    },],
}, {
    name: '规则',
    path: '/rules',
    component: 'rules',
}, {
    name: '黑名单',
    path: '/blacklist',
    component: 'blacklist',
}, {
    name: '404',
    path: '/*',
    component: '@/pages/404.tsx',
    hideInMenu: true,
}];