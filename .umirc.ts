import {defineConfig} from '@umijs/max';
import routes from './src/configs/routes';
import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
    antd: {},
    access: {},
    model: {},
    initialState: {},
    request: {},
    layout: {}, // @ts-ignore
    mock: false,
    routes,
    npmClient: 'yarn',
    links: [// href的图片你可以放在public里面，直接./图片名.png 就可以了，也可以是cdn链接
        {
            rel: 'icon',
            href: './favicon.ico'
        },], // https://umijs.org/zh-CN/guide/boost-compile-speed#monaco-editor-%E7%BC%96%E8%BE%91%E5%99%A8%E6%89%93%E5%8C%85
    // @ts-ignore
    chainWebpack: (memo: any) => {
        // 更多配置 https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        memo.plugin('monaco-editor-webpack-plugin').use(MonacoEditorWebpackPlugin, [// 按需配置
            {languages: ['sql', 'json', 'java', 'typescript']},]);
        return memo;
    },
    headScripts: [
        {
            src: 'https://turing.captcha.qcloud.com/TCaptcha.js', // 这是 Geetest 的 SDK 地址
            defer: true, // 如果需要延迟加载，可以添加 defer 属性
        },
        // 可以继续添加其他需要引入的脚本
    ],
});
