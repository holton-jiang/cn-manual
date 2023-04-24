# 测试页面

[[toc]]

## openSUSE 软件仓库镜像使用帮助
> 禁用官方软件源

```bash
sudo zypper mr -da
```

> 添加清华大学镜像源

```bash
sudo zypper ar -cfg 'https://mirrors.tuna.tsinghua.edu.cn/opensuse/distribution/leap/$releasever/repo/oss/' mirror-oss
sudo zypper ar -cfg 'https://mirrors.tuna.tsinghua.edu.cn/opensuse/distribution/leap/$releasever/repo/non-oss/' mirror-non-oss
sudo zypper ar -cfg 'https://mirrors.tuna.tsinghua.edu.cn/opensuse/update/leap/$releasever/oss/' mirror-update
sudo zypper ar -cfg 'https://mirrors.tuna.tsinghua.edu.cn/opensuse/update/leap/$releasever/non-oss/' mirror-update-non-oss
```

## 图形界面下配置方法
以 openSUSE Leap 15.5 为例：

- 打开 YaST；
- 点击 Software 分组中的 Software Repositories；
- 在打开的窗口上方的列表中点击 Main Repository，点击 Edit；
- 将 download.opensuse.org 替换为

```
mirrors.tuna.tsinghua.edu.cn/opensuse
```

点 OK；再用同样的方法编辑 Non-OSS Repository, Main Update Repository, Update Repository (Non-Oss) 和 Update repository with updates from SUSE Linux Enterprise 15。
### 关于
openSUSE 项目是一个由 Novell 赞助的社区项目。该项目旨在推进 Linux 的广泛应用，提供自由、易于入手和美观实用的 openSUSE Linux 发行版。openSUSE 使用 zypper 作为包管理器。
