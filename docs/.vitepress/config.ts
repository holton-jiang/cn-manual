//导入来自于node_modules目录中vitepress的自定义配置
import { defineConfig } from "vitepress";

//导入locales目录中en.ts文件。
import {en} from './locales/en'

//下拉列表中显示的语言名称,仅在主题配置项 locales 内部有效。
//自定义配置
export default defineConfig({
  base: '/cn-manual/', //GitHub部署需要设置该项目的名称(目录)。
  lastUpdated: true, //页面底部显示最后更新时间。
  contributors: true, //页面底部显示文档贡献者列表。

  //显示代码块的行数
  markdown: {
    lineNumbers: true,
  },

  //默认语言为locales目录下的en.ts。
  locales: {
    root: en,
    en: en
  }

}); //该文件的defineConfig代码结束。
