# 关于本手册

[[toc]]

> 
> 文档来源：`book‑startup_en.epub`
> 版权 ©2006‑2024 SUSE有限责任公司及其贡献者，保留所有权利。
> 在GNU自由文档许可证1.2（或自选1.3）条款下，允许复制、分发、修改；版权声明与许可证为不变章节。完整许可证文本见附录A。
> SUSE商标参阅官网法律页面；第三方商标归各自所有者所有。本文尽力保证准确，但不对错误及其后果承担责任。

## 关于本指南

本手册带你初次接触 openSUSE® Leap，学习系统安装、日常使用。

1. **安装**：完整引导系统安装与基础配置。快速入门提供默认参数快速安装流程；后续章节详解每一步安装操作。
2. **系统管理**：介绍YaST（openSUSE核心配置工具），讲解系统初始化、关键组件配置修改。
3. **软件管理与更新**：使用YaST或命令行安装、删除软件；了解一键安装，掌握系统更新方法。
4. **Bash Shell**：openSUSE Leap默认命令行解释器，熟悉常用Linux命令，理解Linux基础概念。
5. **帮助与故障排查**：获取帮助文档的渠道；汇总高频故障，教你自主排查问题。

### 可用文档

**在线文档**
官方在线文档：[https://doc.opensuse.org，支持多格式浏览下载。](https://doc.opensuse.org%EF%BC%8C%E6%94%AF%E6%8C%81%E5%A4%9A%E6%A0%BC%E5%BC%8F%E6%B5%8F%E8%A7%88%E4%B8%8B%E8%BD%BD%E3%80%82)

> 
> 提示：最新内容优先更新英文版。

**SUSE知识库**
遇到故障查阅技术文档TID：[https://www.suse.com/support/kb/，查找基于实际客户问题整理的解决方案。](https://www.suse.com/support/kb/%EF%BC%8C%E6%9F%A5%E6%89%BE%E5%9F%BA%E4%BA%8E%E5%AE%9E%E9%99%85%E5%AE%A2%E6%88%B7%E9%97%AE%E9%A2%98%E6%95%B4%E7%90%86%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E3%80%82)

**本机离线文档**
发行说明路径：`/usr/share/doc/release‑notes`
软件包自带文档：`/usr/share/doc/packages`
命令手册：执行`man 命令名`查看手册。未安装man工具执行：`sudo zypper install man`

### 改进本文档

1. **提交缺陷Bug报告**
访问 [https://bugzilla.opensuse.org/。HTML文档标题旁点击「报告问题」自动预填产品、分类和页面链接，填写描述即可，需要Bugzilla账号。](https://bugzilla.opensuse.org/%E3%80%82HTML%E6%96%87%E6%A1%A3%E6%A0%87%E9%A2%98%E6%97%81%E7%82%B9%E5%87%BB%E3%80%8C%E6%8A%A5%E5%91%8A%E9%97%AE%E9%A2%98%E3%80%8D%E8%87%AA%E5%8A%A8%E9%A2%84%E5%A1%AB%E4%BA%A7%E5%93%81%E3%80%81%E5%88%86%E7%B1%BB%E5%92%8C%E9%A1%B5%E9%9D%A2%E9%93%BE%E6%8E%A5%EF%BC%8C%E5%A1%AB%E5%86%99%E6%8F%8F%E8%BF%B0%E5%8D%B3%E5%8F%AF%EF%BC%8C%E9%9C%80%E8%A6%81Bugzilla%E8%B4%A6%E5%8F%B7%E3%80%82)
2. **文档贡献**
英文版页面点击「编辑源文档」跳转GitHub提交Pull Request（仅英文版提供该按钮）；其他语言版本提交Bug报告。需要GitHub账号。
3. **邮件反馈**
发送邮件至 `<doc‑team@suse.com>`，写明文档标题、产品版本、发布日期、章节标题/网页链接，简洁描述问题。

openSUSE社区支持门户：[https://en.opensuse.org/Portal:Support](https://en.opensuse.org/Portal:Support)

### 文档排版约定

- `/etc/passwd`：目录、文件名
- `占位符`：替换为实际值
- `PATH`：环境变量
- `ls`、`‑‑help`：命令、选项、参数
- `user`：用户名、组名
- `package_name`：软件包名
- `Alt`、`Alt+F1`：键盘按键组合
- `文件 → 另存为`：菜单、按钮
- 第1章《示例章节》：文档内部交叉引用

root权限命令两种写法：

```
# 命令
> sudo 命令
```

普通用户命令：

```
> 命令
```

行尾`\`表示命令换行输入：

```
> echo a b \
c d
```

代码块同时显示提示符+输出：

```
> 命令
程序输出
```

提示标识

- **警告**：执行前必读；安全风险、数据丢失、硬件损坏风险
- **重要**：操作前需要了解的关键信息
- **注释**：补充信息，版本差异说明
- **提示**：实操建议

> 
> 注释：补充信息，例如版本差异。
> 提示：实用操作指引。

### 源代码

openSUSE全部源码公开：[https://en.opensuse.org/Source_code](https://en.opensuse.org/Source_code)

### 致谢

全球大量开发者志愿参与Linux开发，感谢所有贡献者，特别感谢Linus Torvalds。
