//导入来自于node_modules目录中vitepress的默认主题和本地配置。
import { DefaultTheme, LocaleConfig } from "vitepress";

//导入来自common目录下的common.ts文件。
import * as common from "./common";

//配置默认主题
export const themeConfig: DefaultTheme.Config = {
  //衔接配置好的common主题
  ...common.themeConfig,

  //显示编辑内容的控件。
  editLink: {
    //转跳到对应的源文本。
    pattern:
      "https://github.com/holton-jiang/cn-manual/edit/main/docs/:path",
    //翻译编辑页面的控件。
    text: "在 GitHub 中改进此页面的内容",
  }, //编辑内容的控件代码结束。
  
  darkModeSwitchLabel: '主题',
  sidebarMenuLabel: '目录',
  returnToTopLabel: '回到顶部',

  contributorsText: '贡献者',
  //toggleSidebar: '全目录',
  lastUpdatedText: '最后更新时间',
  //翻译上下页控件
  docFooter: { prev: '上一页', next: '下一页', },
  outlineTitle: '此页的章节',
  
  //脚注内容
  footer: {
      message: '由 Apache 许可证 2.0 发布。',
      copyright: '版权所有 © 2023-至今 openSUSE 中文手册',
    },
  
  //侧边栏代码开始
  sidebar: [
      //发行说明
      {
        text: "发行说明",
        //collapsible: true, //隐藏和显示子菜单。
        //collapsed: true, //初始页面加载时关闭。
        items: [
          { text: "测试页面0_0", link: "/using/indexs0" },
          { text: "测试页面0_1", link: "/using/indexs" },
        ],
      },

      {
        text: "入门指南",
        items: [
        // { text: "入门指南", link: "/using/index10" },
        ],
      },
      
      {
        text: "GNOME 用户指南",
        items: [
        // { text: "GNOME 用户指南", link: "/using/index0" },
        ],
      },
      
      {
        text: "参考指南",
        items: [
        //  { text: "参考指南", link: "/using/index0" },
        ],
      },
      
      {
        text: "安全指南",
        items: [
        //  { text: "安全指南", link: "/using/index0" },
        ],
      },
      
      {
        text: "优化指南",
        items: [
        //  { text: "优化指南", link: "/using/index0" },
        ],
      },
      
      {
        text: "虚拟化指南",
        items: [
        //  { text: "虚拟化指南", link: "/using/index0" },
        ],
      },
      
      {
        text: "AutoYaST 指南",
        items: [
        //  { text: "AutoYaST 指南", link: "/using/index0" },
        ],
      },

      //关于
      {
        text: "关于",
        items: [
          { text: "关于成员与贡献者", link: "/about/about-members" },
        ],
      },
    
    ], //侧边栏代码结束
  
  //头部导航栏
    nav: [
      {
        text: "相关网站与留言反馈",
        items: [
          { text: "openSUSE 官网", link: "https://www.opensuse.org" },
          { text: "openSUSE 软件", link: "https://software.opensuse.org/zh_CN" },
          { text: "openSUSE 官方社区", link: "https://forums.opensuse.org" },
          { text: "openSUSE 中文论坛", link: "https://forum.suse.org.cn" },
          { text: "openSUSE 中文维基", link: "https://zh.opensuse.org" },
          { text: "发送邮件留言反馈此站", link: "mailto:holton.jiang@gmail.com" },
        ],
      },],  //头部导航栏代码结束。
  
}; //DefaultTheme代码结束

//标题和描述
export const title = "openSUSE 中文手册";
export const description = "openSUSE 中文手册 - 文档。";

//脚注
export interface Footer {
  message?: string
  copyright?: string
}

//切换语言，由默认英文全部翻译为简体中文，所以目前仅有简体中文。
export const en: LocaleConfig<DefaultTheme.Config>[string] = {
  label: "简体中文",
  lang: "en",
  title,
  description,
  themeConfig,
};
