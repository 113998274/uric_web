const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,

    // 主题色
    // vue.config.js for less-loader@6.0.0, please run: cnpm install less-loader@6.0.0
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#1DA57A', // 全局主色
                        'link-color': '#1890ff', // 链接色
                        'success-color': '#1DA57A', // 成功色
                        'warning-color': '#faad14', // 警告色
                        'error-color': '#f5222d', // 错误色
                        'heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
                        'text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
                        'text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
                        'disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
                        'border-color-base': '#d9d9d9', // 边框色
                        'font-size-base': '14px', // 主字号
                        'border-radius-base': '2px', // 组件/浮层圆角
                        'box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
                    },
                    javascriptEnabled: true,
                },
            },
        },
    },
})
