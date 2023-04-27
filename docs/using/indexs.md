# 测试页面

[[toc]]

## opensuse 帮助文档

openSUSE 项目是一个由 Novell 赞助的社区项目。该项目旨在推进 Linux 的广泛应用，提供自由、易于入手和美观实用的 openSUSE Linux 发行版。openSUSE 使用 `zypper` 作为包管理器。

* 项目地址：[https://www.opensuse.org](https://www.opensuse.org/)
* 镜像地址：<https://mirror.nju.edu.cn/opensuse>

openSUSE 默认使用 [MirrorBrain](https://zh.opensuse.org/MirrorBrain) 技术统一镜像入口，通过在下载时自动分配镜像站点，从而给用户提供更好的安全性，通常情况下使用默认配置即可。

由于使用 MirrorBrain 需要从位于德国的 openSUSE 主服务器上获取元信息，所以若在使用默认软件源时获取元信息较慢，可以使用 NJU 镜像软件源替换默认软件源。

### openSUSE Leap 15.5 或更新版本使用方法

禁用官方软件源

```bash
zypper mr -d repo-oss
zypper mr -d repo-non-oss
```

需要注意的是，官方镜像源名称可能并不严格为上述名称，但一般含有上述名称（如`download.opensuse.org-non-oss`）。通过`zypper lr`命令可以查看，并以其中的名称为准。

添加 NJU 镜像源

```bash
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/distribution/leap/$releasever/repo/oss/' nju-oss
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/distribution/leap/$releasever/repo/non-oss/' nju-non-oss
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/update/leap/$releasever/oss/' nju-update
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/update/leap/$releasever/non-oss/' nju-update-non-oss
```

Leap 15.5 用户还需添加 sle 和 backports 源

```bash
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/update/leap/$releasever/sle/' nju-sle-update
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/update/leap/$releasever/backports/' nju-backports-update
```

Leap 15.3 注：若在安装时**没有**启用在线软件源， sle 源和 backports 源将在系统首次更新后引入，请确保系统在更新后仅启用了**六个**所需软件源。可使用 `zypper lr` 检查软件源状态，并使用 `zypper mr -d` 禁用多余的软件源。

packman：
```bash
sudo zypper ar -cfg 'https://mirrors.tuna.tsinghua.edu.cn/packman/suse/openSUSE_Leap_15.4/' packman
```

### openSUSE Tumbleweed 使用方法

禁用官方软件源

```bash
zypper mr -d repo-oss
zypper mr -d repo-non-oss
```

添加 NJU 镜像源

```bash
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/tumbleweed/repo/oss/' nju-oss
sudo zypper ar -cfg 'https://mirror.nju.edu.cn/opensuse/tumbleweed/repo/non-oss/' nju-non-oss
```

刷新软件源

```bash
sudo zypper ref
```

Tumbleweed 注： Tumbleweed 安装后默认会启用 oss, non-oss, update, 3 个官方软件源， 其中 oss 及 non-oss 源用于发布 Tumbleweed 的每日构建快照，快照中已包含系统所需的全部软件包及更新。 update 源仅用于推送临时安全补丁，如当日快照已发布但仍有临时安全补丁时，会首先推送至 update 源，并在次日合入下一版快照。 由于 update 源存在较强的时效性，上游镜像并未同步 update 源， NJU 亦无法提供该源的镜像。 禁用 update 源并不会使系统缺失任何功能或安全更新，仅会导致极少数更新晚些推送，如有需求可以重新启用官方 update 源。
