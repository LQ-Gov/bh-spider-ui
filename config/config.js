import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      dll: {
        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
        exclude: ['@babel/runtime', 'netlify-lambda'],
      },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
  [
    'babel-plugin-import',
    {
      libraryName: 'ant-design-pro',
      libraryDirectory: 'lib',
      style: true,
      camel2DashComponentName: false,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push([
    'umi-plugin-pro',
    {
      serverUrl: 'https://ant-design-pro.netlify.com',
    },
  ]);
}
process.env.PUBLIC_PATH = process.env.NODE_ENV == 'production' ? '/public/' : '';

export default {
  plugins,
  block: {
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      Routes: ['src/pages/Authorized'],
      authority: ['admin', 'user'],
      routes: [
        {
          path: '/',
          name: 'welcome',
          icon: 'smile',
          component: './Welcome',
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          icon: 'dashboard',
          component: './dashboard/Index', // routes: [
          //   {
          //     name: 'state',
          //     path: '/dashboard/resource',
          //     component: './dashboard/Resource',
          //   },
          // ],
        }, // {
        //   component: './404',
        // },
        {
          path: '/component',
          name: 'component',
          icon: 'profile',
          component: './component/Component',
        },
        {
          path: '/rule',
          name: 'rule',
          icon: 'form',
          routes: [
            {
              name: 'list',
              path: '/rule/list',
              component: './rule/Rule',
            },
            {
              name: 'content',
              path: '/rule/content/:id',
              component: './rule/Content',
              // hideInMenu:true
            },
            {
              name: 'create',
              path: '/rule/create',
              redirect: '/rule/create/1',
              component: './rule/Create',
            },
            {
              name: 'edit',
              path: '/rule/:operation',
              component: './rule/Create',
              hideInMenu: true,
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/rule/:operation',
                  redirect: '/rule/:operation/1',
                },
                {
                  path: '/rule/:operation/1',
                  name: '1',
                  component: './rule/Create-1',
                },
                {
                  path: '/rule/:operation/2',
                  name: '2',
                  component: './rule/Create-2',
                },
                {
                  path: '/rule/:operation/3',
                  name: '3',
                  component: './rule/Create-3'
                }
              ],
            }
          ],
        },
        {
          path: '/node',
          name: 'node',
          icon: 'laptop',
          component: './node/Node',
        },
        {
          component: './404',
        },
      ],
    },
    {
      name: 'exception-403',
      path: '/exception-403',
      component: './exception-403',
    },
    {
      name: 'exception-404',
      path: '/exception-404',
      component: './exception-404',
    },
    {
      name: 'exception-500',
      path: '/exception-500',
      component: './exception-500',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://localhost:9933',
      changeOrigin: true,
      pathRewrite: { '^/server': '' }
    },
  },

  devServer: {
    compress: false,
  },


  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
  publicPath: process.env.PUBLIC_PATH,
  outputPath: '../bh-spider/scheduler-ui/src/main/resources/public/',
};
