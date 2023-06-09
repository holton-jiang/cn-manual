# openSUSE Leap 15.5 发行说明

openSUSE Leap 是一款免费的基于 Linux 的操作系统，适用于您的 PC、笔记本电脑或服务器。您可以上网冲浪、管理您的电子邮件和照片、处理办公室工作、播放视频或音乐，尽情享受！

发行日期: 2023-06-06, 版本: 15.5.20230606.ccef8cb

这是即将发布的 openSUSE Leap 15.5 发行说明的初始版本。

如果您从旧版本升级到此 openSUSE Leap 版本，请参阅此处列出的以前的发行说明：[https://en.opensuse.org/openSUSE:Release_Notes](https://en.opensuse.org/openSUSE:Release_Notes) 。

此公开 Beta 测试是 openSUSE 项目的一部分。有关该项目的信息，请访问 [https://www.opensuse.org](https://www.opensuse.org/) 。

在 openSUSE Bugzilla 中报告您使用 openSUSE Leap 15.5 预发行版遇到的所有错误。有关详细信息，请参阅 [https://en.opensuse.org/Submitting_Bug_Reports](https://en.opensuse.org/Submitting_Bug_Reports) 。如果您希望看到任何添加到发行说明中的内容，请针对组件“发行说明”提交错误报告。

## 1 安装

本节包含与安装相关的说明。有关详细的安装说明，请参阅 [https://doc.opensuse.org/documentation/leap/startup/html/book.opensuse.startup/part-basics.html](https://doc.opensuse.org/documentation/leap/startup/html/book.opensuse.startup/part-basics.html) 上的文档。

### 1.1 使用原子对操作系统事务服务器更新

安装程序支持操作系统事务服务器。此系统角色具有一个更新系统，该系统以原子方式应用更新（作为单个操作）并使它们在必要时易于恢复。这些功能基于所有其他 SUSE 和 openSUSE 发行版也依赖的包管理工具。这意味着绝大多数与 openSUSE Leap 15.5 的其他系统角色一起工作的 RPM 包也与系统角色 Transactional Server 一起工作。

::: info 注意：不兼容的包
某些软件包在其 RPM `%post` 脚本中修改了 `/var` 或 `/srv` 的内容。这些软件包不兼容。如果您找到这样的包，请提交错误报告。
:::

为了提供这些功能，此更新系统依赖于：

* Btrfs 快照。在开始系统更新之前，会创建根文件系统的新 Btrfs 快照。然后，更新中的所有更改都会安装到该 Btrfs 快照中。要完成更新，您可以重新启动系统进入新的快照。
    要恢复更新，只需从之前的快照启动即可。
* 一个只读的根文件系统。为避免更新引起的问题和数据丢失，不得以其他方式写入根文件系统。因此，根文件系统在正常操作期间以只读方式挂载。  
    为了使这个设置工作，需要对文件系统进行两个额外的更改：为了允许在 `/etc` 中写入用户配置，该目录自动配置为使用 OverlayFS。 `/var` 现在是一个单独的子卷，可以由进程写入。

::: warning 重要：事务服务器至少需要 12 GB 的磁盘空间
系统角色 Transactional Server 需要至少 12 GB 的磁盘大小来容纳 Btrfs 快照。
:::

::: warning 重要：YaST 不工作事务模式
目前，YaST 不支持事务性更新。这是因为 YaST 会立即执行操作，而且它无法编辑只读文件系统。
:::

要使用事务更新，请始终使用命令 `transactional-update` 而不是 YaST 和 Zypper 来进行所有软件管理：

* 更新系统： `transactional-update up`
* 安装软件包： `transactional-update pkg in PACKAGE_NAME`
* 删除软件包： `transactional-update pkg rm PACKAGE_NAME`
* 要还原最后一个快照，即根文件系统的最后一组更改，请确保您的系统已启动到倒数第二个快照并运行： `transactional-update rollback`  
   （可选）在命令末尾添加快照 ID 以回滚到特定 ID。

使用此系统角色时，默认情况下，系统将在凌晨 03:30 到 05:00 之间执行每日更新和重启。这两个操作都是基于 systemd 的，如有必要，可以使用 `systemctl` 禁用：
``` bash
systemctl disable --now transactional-update.timer rebootmgr.service
```

有关事务更新的更多信息，请参阅 openSUSE Kubic 博客文章 [https://kubic.opensuse.org/blog/2018-04-04-transactionalupdates/](https://kubic.opensuse.org/blog/2018-04-04-transactionalupdates/) 和 [https://kubic.opensuse.org/blog/2018-04-20-transactionalupdates2/](https://kubic.opensuse.org/blog/2018-04-20-transactionalupdates2/) 。

### 1.2 在容量小于 12 GB 的硬盘上安装 #

如果可用硬盘大小大于 12 GB，安装程序只会建议分区方案。例如，如果要设置非常小的虚拟机映像，请使用引导式分区程序手动调整分区参数。

### 1.3 UEFI——统一的可扩展固件接口

在使用 UEFI（统一可扩展固件接口）引导的系统上安装 openSUSE 之前，强烈建议您检查硬件供应商推荐的任何固件更新，如果可用，安装此类更新。预安装 Windows 8 或更高版本表明您的系统使用 UEFI 启动。

_背后的原因:_ 某些 UEFI 固件存在错误，如果向 UEFI 存储区域写入过多数据，这些错误会导致固件崩溃。但是，没有明确的数据表明多少是“太多”。

openSUSE 通过不编写超过启动操作系统所需的最低限度的内容来最大限度地降低风险。最小值意味着告诉 UEFI 固件关于 openSUSE 引导装载程序的位置。使用 UEFI 存储区域存储引导和崩溃信息 ( `pstore` ) 的上游 Linux 内核功能已默认禁用。尽管如此，还是建议安装硬件供应商推荐的任何固件更新。

### 1.4 UEFI、GPT 和 MS-DOS 分区

随着 EFI/UEFI 规范的出现，出现了一种新的分区方式：GPT（GUID 分区表）。此新模式使用全局唯一标识符（以 32 位十六进制数字显示的 128 位值）来识别设备和分区类型。

此外，UEFI 规范还允许传统的 MBR (MS-DOS) 分区。 Linux 引导加载程序（ELILO 或 GRUB 2）尝试为那些遗留分区自动生成 GUID，并将它们写入固件。这样的 GUID 可能会频繁更改，从而导致固件重写。重写包括两个不同的操作：删除旧条目和创建一个新条目来替换第一个条目。

现代固件有一个垃圾收集器，可以收集已删除的条目并释放为旧条目保留的内存。当有故障的固件不收集和释放这些条目时，就会出现问题。这可能会导致系统无法启动。

要解决此问题，请将旧版 MBR 分区转换为 GPT。

## 2 系统升级
本节列出了与系统升级相关的注意事项。有关支持的方案和详细的升级说明，请参阅以下的文档链接：
- [https://en.opensuse.org/SDB:System_upgrade](https://en.opensuse.org/SDB:System_upgrade)
- [https://doc.opensuse.org/documentation/leap/startup/html/book-startup/cha-update-osuse.html](https://doc.opensuse.org/documentation/leap/startup/html/book-startup/cha-update-osuse.html)

请确保同时查看本文档的以下部分： 
- [[3 软件包变化]]
- [[7.1 4096 位 RSA RPM 和存储库签名密钥的使用]]

## 3 软件包变化

### 3.1 弃用的包

已弃用的软件包仍作为分发的一部分提供，但计划在下一版本的 openSUSE Leap 中删除。这些软件包的存在是为了帮助迁移，但不鼓励使用它们，并且它们可能不会收到更新。

要检查已安装的包是否不再维护，请确保安装了 lifecycle-data-openSUSE 包，然后使用命令：

``` bash
zypper lifecycle
```

### 3.2 删除的软件包

删除的包不再作为分发的一部分运送。

* gnome-todo：gnome-todo 已被 Endeavour 包取代。  
msgpack：msgpack 被 msgpack-c 和 msgpack-cxx 取代。  
nodejs-electron：这个旧版本的 Electron 已经停更，由于频繁的 ABI 中断，我们无法在 Leap 的整个生命周期内支持。当前版本的 Electron 仍然可以从 OBS 上的 devel:languages:nodejs 存储库中获得。

## 4 驱动程序和硬件

### 4.1 安全启动：第三方驱动需要正确签名

从 openSUSE Leap 15.2 开始，现在启用了对第三方驱动程序 ( `CONFIG_MODULE_SIG=y` ) 的内核模块签名检查。这是避免在内核中运行不受信任的代码的重要安全措施。

如果启用了 UEFI 安全启动，这可能会阻止加载第三方内核模块。来自官方 openSUSE 存储库的内核模块包 (KMP) 不受影响，因为它们包含的模块是使用 openSUSE 密钥签名的。签名检查具有以下行为：

* 未签名或使用已知为不受信任或无法根据系统的受信任密钥数据库进行验证的密钥签名的内核模块将被阻止。

可以生成自定义证书，将其注册到系统的机器所有者密钥 (MOK) 数据库中，并使用该证书的密钥对本地编译的内核模块进行签名。以这种方式签名的模块既不会被阻止也不会引起警告。请参阅 https://en.opensuse.org/openSUSE:UEFI 。

由于这也会影响 NVIDIA 图形驱动程序，因此我们在 openSUSE 的官方软件包中解决了这个问题。但是，您需要在安装后手动注册新的 MOK 密钥才能使新软件包正常工作。有关如何安装驱动程序和注册 MOK 密钥的说明，请参阅 https://en.opensuse.org/SDB:NVIDIA\_drivers#Secureboot 。

### 4.2 网络安装映像在 Raspberry Pi 4 上启动时挂起

从 Raspberry Pi 4 上的 存储卡引导网络安装映像在引导时挂起。要解决此问题，请添加 `console=tty` 引导参数。请参阅我们的 [Raspberry Pi 4 硬件兼容性列表](https://en.opensuse.org/HCL:Raspberry_Pi4#Boot_from_USB_in_Net_install_image_of_Leap_15.4_hangs_on_boot) 的已知问题部分中的详细信息。

## 5 桌面

本节列出了 openSUSE Leap 15.5 中的桌面问题和更改。

### 5.1 KDE 4 和 Qt 4 删除

KDE 4 软件包将不会成为 openSUSE Leap 15.4 的一部分。请将您的系统更新到 Plasma 5 和 Qt 5。出于兼容性原因，一些 Qt 4 软件包可能仍然存在。 [https://bugzilla.opensuse.org/show_bug.cgi?id=1179613](https://bugzilla.opensuse.org/show_bug.cgi?id=1179613) 。

### 5.2 `nouveau` 禁用 Nvidia Turing 和 Ampere GPU / openGPU 建议

`nouveau` 驱动程序仍被认为是 Nvidia Turing 和 Ampere GPU 的实验性驱动程序。因此，在具有这些 GPU 的系统上默认情况下它已被禁用。

我们建议使用 Nvidia 的新 openGPU 驱动程序，而不是使用 `nouveau` 驱动程序。通过安装以下软件包来安装此驱动程序：

* `nvidia-open-driver-G06-signed-kmp-default`
* `kernel-firmware-nvidia-gsp-G06`

然后取消注释 `/etc/modprobe.d/50-nvidia-default.conf` 文件中的 `options nvidia` 行，使其看起来像下面这样：

```
### Enable support on *all* Turing/Ampere GPUs: Alpha Quality!
options nvidia NVreg_OpenRmEnableUnsupportedGpus=1
```

如果您更喜欢使用 `nouveau` 驱动程序，请将 `nouveau.force_probe=1` 添加到您的内核启动参数中，并且不要安装上面的 openGPU 包。

## 6 一般

### 6.1 `iotop` 支持

`iotop` does not display values for SWAPIN and IO %.  
`iotop` 不显示 SWAPIN 和 IO % 的值。

从 Linux 内核 5.14 开始，需要指定内核引导参数 `delayacct` 或需要启用 `kernel.task_delayacct` sysctl。

## 7 安全

本节列出了 openSUSE Leap 15.5 中安全功能的更改。

### 7.1 4096 位 RSA RPM 和存储库签名密钥的使用

我们将 openSUSE Leap 15.5 的 RPM 和存储库签名密钥从 2048 位 RSA 更改为 4096 位 RSA 密钥。此密钥之前在维护更新中引入给 openSUSE Leap 15.4 用户。从旧版本升级的用户需要手动导入新密钥，如 [https://en.opensuse.org/SDB:System_upgrade#0._New_4096_bit_RSA_signing_key](https://en.opensuse.org/SDB:System_upgrade#0._New_4096_bit_RSA_signing_key) 中所述。

## 8 更多信息和反馈

* 阅读媒体上的 `README` 文档。
* 从其 RPM 查看有关特定包的详细变更日志信息：  

``` bash
rpm --changelog -qp _FILENAME_.rpm  
```

 将 FILENAME 替换为 RPM 的名称。
* 检查介质顶层的 `ChangeLog` 文件，以获取对更新包所做的所有更改的按时间顺序排列的日志。
* 在介质上的 `docu` 目录中查找更多信息。
* 有关其他或更新的文档，请参阅 https://doc.opensuse.org/ 。
* 有关 openSUSE 的最新产品新闻，请访问 https://www.opensuse.org 。

版权所有 © 2023 SUSE LLC
