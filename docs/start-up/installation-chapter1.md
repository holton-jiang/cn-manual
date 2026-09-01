# 入门指南

[[toc]]

---

# 第一部分 安装

## 第1章 快速安装指南

> 
> 摘要
> 本章节演示全新安装 openSUSE® Leap 15.6。以x86‑64架构默认选项快速安装。
> 完整步骤见第3章《完整安装步骤》；AArch64、POWER平台参考网页：
> [https://en.opensuse.org/Portal:ARM](https://en.opensuse.org/Portal:ARM)
> [https://en.opensuse.org/Portal:PowerPC](https://en.opensuse.org/Portal:PowerPC)

### 获取 openSUSE Leap

下载页面：[https://get.opensuse.org/leap/](https://get.opensuse.org/leap/)
提供不同架构镜像：

- Intel/AMD 64位台式机、笔记本、服务器（AMD64/Intel 64）
- UEFI Arm64服务器、台式机、开发板（AArch64）
- PowerPC小端服务器（ppc64le）
- IBM Z、IBM LinuxONE大型机（s390x）

镜像分为**离线镜像**和**网络镜像**，下载页《选择下载介质》文档有详细说明；同时提供制作启动盘教程《轻松切换到openSUSE Leap》。

### 最低系统硬件要求

- AMD64 / Intel EM64T处理器（**不支持32位CPU**）
- 内存：最低1GB；使用在线软件源建议至少1.5GB；强烈建议4GB以上
- 磁盘空间：最小化安装至少10GB；图形桌面建议16GB以上。**启用Btrfs快照，根分区建议至少40GB。**
- 支持绝大多数现代声卡显卡；显示器最低分辨率1024×768，推荐更高。

### 安装 openSUSE Leap

适用于机器无Linux系统，或需要替换现有Linux系统。

#### 启动安装程序

插入DVD或者制作完成的U盘启动盘，重启电脑启动安装。传统BIOS出现图形启动界面；UEFI设备界面略有不同，支持UEFI安全启动Secure Boot。

![[install_boot_osuse.png]](./image/install_boot_osuse.png)

> 
> BIOS机器：F2修改安装程序语言，自动匹配键盘布局。BIOS与UEFI更多启动参数参考对应小节。UEFI机器语言键盘在后续界面设置。

选中`Installation（安装）`回车，加载openSUSE Leap安装程序。

#### 语言、键盘与许可协议

BIOS机器继承启动界面选择的语言；默认未修改或UEFI机器为美式英语。按需修改语言、键盘布局；文本框测试键盘输入。阅读许可协议，可以切换许可翻译语言。确认后点击**下一步（Next）**。

#### 网络设置

![[install_network_osuse.png]](./image/install_network_osuse.png)

如果DHCP自动配置网络失败，弹出网络设置窗口。选中网卡，点击**编辑（Edit）**配置；也可以点击**添加（Add）**手动新增网卡。详情参考第3章网络设置，以及参考手册《使用YaST配置网络连接》。
不需要网络安装，直接点下一步跳过。

#### 在线软件源

系统探测硬件磁盘，扫描本机已存在操作系统。如果可以访问互联网，询问是否启用在线软件源，选择**Yes**开启。无网络环境直接跳过本步骤。

![[install_onlinerepos_ask_osuse.png]](./image/install_onlinerepos_ask_osuse.png)

在线软件源是openSUSE官方软件仓库，提供安装介质未收录软件包，同时提供安全补丁与Bug修复。**强烈建议启用主更新源Main Update Repository，确保安装时打上最新安全补丁。**

仓库说明：

1. **Main Repository（OSS主开源软件源）**：开源软件集合，相比DVD介质提供大量额外软件包，包含多种桌面环境。
2. **SUSE Linux Enterprise 15更新源、openSUSE Backports更新源**：为主源提供更新，所有安装场景建议勾选。
3. **Non‑OSS（非开源软件源）**：存放专有许可证软件包；普通桌面安装非必需。
4. **Update Repository (Non‑OSS)非开源更新源**：开启Non‑OSS后建议同时勾选，提供专有软件安全更新。

其余仓库面向高级用户、开发者。点击仓库名称查看描述。配置完成点下一步；确认许可协议，一路下一步进入系统角色页面。

#### 系统角色

![[install_ui_osuse.png]](./image/install_ui_osuse.png)

本步骤选择软件集合与系统基础配置，对应桌面或服务器场景。

桌面选项：

- **Desktop with KDE Plasma**：KDE Plasma桌面，适合工作站、台式、笔记本，风格接近Windows。
- **Desktop with GNOME**：GNOME桌面，交互创新，适合工作站台式笔记本。
- **Desktop with Xfce**：轻量传统Xfce桌面。
- **Generic Desktop通用桌面**：精简图形系统，后续可自定义LXDE、MATE等桌面。

服务器选项：

- **Server服务器**：最小软件包集合，文本模式无图形界面，适合服务器。
- **Transactional Server事务型服务器**：服务器配置，根文件系统只读，支持原子自动更新，openSUSE Kubic的基础。

> 
> 高级：选择Custom自定义，跳转到软件选择页面手动勾选软件模式集patterns；点击Details可以单独勾选软件包。

> 
> 提示：安装全程任意界面都可以点击`Release Notes发行说明`阅读版本注意事项。

#### 推荐分区方案

![[install_partitioner_osuse.png]](./image/install_partitioner_osuse.png)

定义磁盘分区布局。审阅系统给出的分区方案，按需修改。提供两种操作入口：

1. **Guided Setup引导式设置**：向导一步步调整分区方案。多磁盘机器可以选择使用哪块磁盘，根分区存放位置；磁盘已有分区时可以删除或者调整分区大小。后续还可以开启LVM逻辑卷、磁盘加密；修改根分区文件系统；选择是否独立/home家目录分区。
2. **Expert Partitioner专家分区器**：面向高级用户，完全自定义磁盘分区布局。

> 
> 说明：默认方案**不再单独创建/home分区**。把家目录放在独立分区，重装系统可以保留用户数据，也支持多Linux系统共用/home。
> 如果想要独立/home分区：进入Guided Setup向导，到文件系统选项界面，勾选`Propose Separate Home Partition（建议独立家目录分区）`，默认XFS，也可以更换其他文件系统。一路下一步保存。

认可默认方案直接点**Next下一步**继续。

#### 时钟与时区

![[install_timezone_osuse.png]](./image/install_timezone_osuse.png)

选择地区与时区。点击`Other Settings 其他设置`手动修改时间或者配置NTP网络时间同步。完成点下一步。

> 
> 硬件时钟：Windows+Linux双系统建议取消勾选「Hardware Clock Set to UTC」（硬件时钟使用本地时间）；纯Linux系统强烈建议硬件时钟设置UTC。

#### 本地用户

![[install_user_osuse.png]](./image/install_user_osuse.png)

填写用户全名、登录用户名、用户密码。密码最少8位，大小写+数字；最大72字符，区分大小写。

安全建议：**不要勾选自动登录Automatic Login；不建议勾选“使用该密码作为管理员密码”，下一步单独设置root密码。**

如果检测到旧Linux系统，可以从旧系统导入用户数据。
NIS、LDAP集中账号管理的环境，可以选择`Skip User Creation 跳过创建本地用户`。

填写完成点下一步。

#### 系统管理员root身份认证

![[install_root_osuse.png]](./image/install_root_osuse.png)

设置超级管理员root账户密码。**务必记住root密码，丢失无法找回。**

> 
> 建议密码只使用ASCII英文字符。系统故障救援模式键盘可能没有本地化布局。
> 可以导入SSH公钥实现SSH免密登录；如果只导入密钥、不设置root密码，则root只能SSH密钥登录，禁止密码登录。

填写完毕点下一步。

#### 安装设置

![[install_summary_osuse.png]](./image/install_summary_osuse.png)

本界面汇总全部安装配置，点击标题即可修改对应项。防火墙、SSH等选项可以直接点击链接调整。

- **Booting引导**：GRUB2引导加载器配置，非必要不建议修改。
- **Software软件**：软件模式集patterns，点击进入修改软件选择；Details进入完整YaST软件管理器。
- **Default systemd target默认系统目标单元**：桌面环境默认图形界面；无桌面服务器则是文本多用户模式。
- **System系统硬件**：查看硬件信息，修改内核参数。
- **Security安全**：CPU侧信道攻击缓解配置；防火墙默认全部网卡归入public区域，端口全部关闭；SSH服务默认关闭，22端口防火墙拦截，远程无法登录。
- **Network Configuration网络配置**：修改网络参数。> 
> 远程访问：安装完毕就需要远程连接，要在安全设置打开SSH端口。

#### 开始安装

确认全部配置，点击`Install安装`。部分软件会弹出许可协议确认。此时磁盘尚未修改；再次点击Install正式执行安装。

#### 安装过程

Details标签页查看完整安装日志；Release Notes标签阅读发行说明。
安装结束机器自动重启，进入刚装好的系统。登录后启动YaST工具进行系统微调。无图形桌面或者远程环境，参考参考手册《文本模式YaST》使用终端版YaST。

## 第2章 启动参数

> 
> 摘要
> openSUSE Leap在安装启动阶段可以设置各类参数，例如指定安装源、配置网络。合适的启动参数可以简化安装流程。很多参数后期也可以用linuxrc配置，但启动参数设置更方便。自动化部署可以把启动参数放到initrd或者info配置文件。

不同硬件架构启动流程不一样；KVM/Xen虚拟机AMD64/Intel64架构参考PC平台说明。

> 
> 术语：文档内Boot Parameters（启动参数）与Boot Options（启动选项）经常混用，本文统一叫启动参数。

### 使用默认启动参数

直接选择Installation执行标准安装。遇到故障尝试`Installation‑ACPI Disabled`或者`Installation‑Safe Settings`，故障详见第4章。
屏幕底部F1‑F12功能快捷键，不用记忆复杂内核参数，图形界面修改安装选项。

### PC平台（AMD64/Intel 64/AArch64）

#### 传统BIOS设备的启动界面

菜单选项说明：

1. **Installation安装**：标准安装模式，启用全部现代硬件功能。安装失败，参考F5内核选项关闭有问题硬件特性。
2. **Upgrade升级**：系统版本升级，详见第12章。
3. **More更多**
   - Rescue System救援系统：极简无图形Linux救援环境，Live镜像无该选项。
   - Boot Linux System：启动本机已经安装好的Linux，需要选择分区。
   - Check Installation Media校验安装介质：ISO刻录的U盘/DVD，校验镜像完整性。校验成功回到安装流程；校验失败终止安装，更换介质。
   - Memory Test内存测试：循环读写测试内存，重启终止测试。排查硬件内存故障。

底部快捷键：

- F1 帮助：上下文帮助，方向键浏览，回车跳转，Esc退出。
- F2 Language语言：设置安装程序显示语言和键盘布局，默认美式英语。
- F3 Video Mode视频模式：图形安装显示模式。默认KMS内核模式设置。显卡异常选择No KMS；图形报错切换Text Mode文本模式安装。
- F4 Source源：选择安装介质来源，FTP/NFS等网络源，配置代理。
- F5 Kernel内核：硬件故障时关闭ACPI、APIC；Safe Settings安全设置关闭DMA、电源管理。不确定优先尝试`ACPI Disabled`或者`Safe Settings`。也可以在`Boot Options`输入框手动填写内核参数。
- F6 Driver驱动：加载厂商额外驱动更新，本地文件或者URL地址；选择Yes，安装流程会提示插入驱动介质。

#### UEFI设备的启动界面

UEFI（统一可扩展固件接口）替代传统BIOS。Secure Boot安全启动只允许签名引导程序运行，阻止恶意代码启动。

> 
> BIOS使用的GRUB2不支持UEFI；UEFI使用GRUB2 for EFI。开启Secure Boot，YaST自动选用EFI版本GRUB2。文档统一简称GRUB2。

> 
> Secure Boot安全启动限制：没有随openSUSE发布的驱动不能直接加载。想要加载第三方驱动，两种方式：
> 
> 
> 1. 在固件管理界面预先导入需要的密钥。
> 2. 使用专用ISO镜像，首次启动将密钥注册到MOK安全密钥列表。

![[install_boot_uefi_osuse.png]](./image/install_boot_uefi_osuse.png)

UEFI图形界面**没有F1‑F12快捷键**。需要修改启动参数：光标选中`Installation`，按下`E`编辑启动项。只有英文键盘可用。

编辑界面示例：

```
setparams 'Installation'
   set gfxpayload=keep
   echo 'Loading kernel ...'
   linuxefi /boot/x86_64/loader/linux splash=silent
   echo 'Loading initial ramdisk ...'
   initrdefi /boot/x86_64/loader/initrd
```

在`linuxefi`这一行末尾空格后追加启动参数。编辑完成按`F10`启动；串口控制台使用`Esc+0`。完整参数列表：[https://en.opensuse.org/Linuxrc。](https://en.opensuse.org/Linuxrc%E3%80%82)

### 重要启动参数总览

#### 通用启动参数

| 参数 | 说明 |
| --- | --- |
| `autoyast=URL` | AutoYaST无人值守自动安装，指定autoinst.xml配置文件网络地址 |
| `manual=<0\|1>` | manual=0：全部参数直接生效，不再弹窗交互；autoyast会隐含manual=0 |
| `Info=URL` | 读取外部配置文件，载入额外安装选项 |
| `upgrade=<0\|1>` | upgrade=1执行系统升级操作 |
| `dud=URL` | 驱动更新，dud=1启动时询问URL；也可填写ftp/http地址 |
| `language=zh_CN` | 设置安装程序语言，zh_CN简体中文，zh_TW繁体中文，de_DE德语等 |
| `acpi=off` | 关闭ACPI高级电源管理 |
| `noapic` | 关闭APIC高级可编程中断控制器 |
| `nomodeset` | 禁用KMS内核模式设置 |
| `textmode=1` | 文本模式运行安装程序 |
| `console=ttyS0,9600n8` | 串口控制台，设置串口设备、波特率；支持多个控制台 |

#### 配置网络接口

> 
> 注意：这些参数**仅作用于安装阶段的网络**。系统安装完毕之后网卡配置在YaST网络模块设置。

- `netsetup=dhcp`强制DHCP获取IP
- `netsetup=-dhcp`配合hostip/gateway/nameserver手动静态IP
- `netsetup=hostip,netmask,gateway,nameserver`启动时交互式输入网络参数

`ifcfg`强大网络配置参数，支持指定网卡、VLAN标签，dhcp或者静态CIDR地址：

```
ifcfg=*="10.0.0.10/24,10.0.0.1,10.0.0.1 10.0.0.2,example.com"
```

示例DHCP网卡自定义MTU：
`ifcfg=eth0=dhcp,MTU=1500`

其余网络参数：
`hostname=host.example.com`主机全名
`domain=example.com`DNS搜索域
`hostip=192.168.1.2/24`静态IP地址
`gateway=192.168.1.3`网关
`nameserver=192.168.1.4`DNS服务器

#### 指定安装源

`install=源地址`，支持cd、hd、nfs、smb、ftp、http、https协议。
https加密源，如果证书校验失败，附加参数 `sslcerts=0`关闭证书校验。
带账号密码示例：
`install=https://USER:PASSWORD@SERVER/DIRECTORY/DVD1/`
Samba CIFS示例：
`install=smb://WORKDOMAIN;USER:PASSWORD@SERVER/DIRECTORY/DVD1/`

#### 指定远程访问

> 
> 同一时间只启用一种远程访问方式（SSH/VNC/X）

1. `vnc=1`开启VNC服务；`vncpassword=密码`设置VNC密码
2. `ssh=1`开启SSH安装；`ssh.password=密码`设置安装阶段root的ssh密码
3. `display_ip=IP`连接远端X‑Server（现已不推荐，优先VNC/SSH）

#### 高级配置

##### 安装启用IPv6

- `ipv6=1`同时支持IPv4+IPv6
- `ipv6only=1`仅使用IPv6协议

##### 安装使用代理服务器

BIOS：启动界面按F4图形界面填写代理。
UEFI：按E编辑启动项，linuxefi行末尾追加代理参数：
`proxy=https://USER:PASSWORD@proxy.example.com:PORT`
证书问题附加`sslcerts=0`关闭SSL校验。

![[grub_cmdline_proxy_osuse.png]](./image/grub_cmdline_proxy_osuse.png)

##### 启用SELinux

`security=selinux selinux=1`安装阶段就启用SELinux，安装完成直接生效无需重启。

##### 安装程序自更新

`self_update=1`开启安装器自更新；
`self_update=https://updates.example.com/`指定自定义更新仓库地址。

##### 复用LVM卷

> 
> SUSE Linux Enterprise 15 SP6起，引导式安装不再自动复用旧LVM；想要强制复用，使用参数`YAST_REUSE_LVM=1`，也可以在专家分区器手动配置。

##### 高DPI界面缩放

`QT_AUTO_SCREEN_SCALE_FACTOR=1`Qt界面适配高分屏。

##### CPU侧信道漏洞缓解

`mitigations=auto|nosmt|off`

- auto：启用CPU所需全部缓解，不关闭超线程SMT，会带来部分性能损耗
- nosmt：全部安全缓解，同时关闭超线程SMT，安全性最高，性能下降更大
- off：关闭全部CPU漏洞缓解，性能不受影响，但存在侧信道攻击风险。

##### LUKS2加密支持

`YAST_LUKS2_AVAILABLE`显式开启YaST对LUKS2磁盘加密支持；也可以在YaST专家控制台开启。

> 
> 更多启动参数查阅openSUSE维基：[https://en.opensuse.org/SDB:Linuxrc#Parameter_Reference](https://en.opensuse.org/SDB:Linuxrc#Parameter_Reference)

## 第3章 完整安装步骤

> 
> 摘要
> 本章完整描述openSUSE Leap安装流程，安装程序复制系统文件，同时配置基础系统参数。图形向导引导操作，文本模式安装步骤完全一致，界面不同。无人值守自动化安装参阅AutoYaST手册。
> 鼠标失效：Tab、方向键导航，回车确认；按钮带有下划线字母，`Alt+字母`直接点击按钮。

### 流程总览

1. 可选：安装程序自更新（联网环境）
2. 语言、键盘、许可协议
3. 网络配置（DHCP失败才会弹出）
4. 在线软件源（可选，联网）
5. 选择系统角色
6. 磁盘分区
7. 设置时区时钟
8. 创建本地用户
9. 可选，单独设置root管理员密码
10. 安装总览页面，修改各项配置
11. 复制文件，执行安装

### 安装程序自更新

联网环境，YaST安装器可以下载更新修复发布后发现的Bug。默认开启；启动参数`self_update=0`关闭。

> 
> 更新需要网络，默认DHCP；静态IP需要ifcfg启动参数配置。
> ⚠自更新发生在语言选择界面之前，所以报错、进度默认英文；BIOS启动界面F2设置language参数修改语言。

#### 自更新流程

1. 获取更新仓库地址：优先读取`self_update`启动参数；其次AutoYaST配置；最后使用安装介质内置默认地址。**只能填写安装器更新源，不能填普通系统软件源。**
2. 下载并且应用rpm更新包，校验签名。签名异常会弹窗确认。
3. 更新完成重启YaST安装器；没有可用更新直接继续安装。

> 
> 临时仓库：部分更新包会提供安装默认配置文件，会创建本地临时SelfUpdate0仓库，仅安装过程使用，安装结束删除，不会写入目标硬盘系统。

#### 自定义自更新仓库

支持http/https/ftp；`relurl://`相对路径写法，相对于主安装源，方便制作自定义介质。
示例：安装介质根目录，更新包放在`self_update`子目录，启动参数写：
`self_update=relurl://self_update`

> 
> 限制：**只能指定一个自更新仓库**；软件包不解压完整脚本，不做依赖检查，按字母顺序覆盖原有文件。

### 语言、键盘与许可协议

继承启动界面语言；可以手动修改语言，会自动匹配键盘布局，也可以手动修改键盘；文本框测试键盘输入。语言会预设时区，系统后续仍可修改。
阅读许可协议，可以切换许可协议语言翻译。不同意点`Abort中止安装`。

> 
> 辅助视力：`Shift+F3`切换界面主题；`Shift+F4`高对比度无障碍配色。

### 网络设置

启动安装后，会尝试DHCP自动配置网卡。DHCP失败弹出网络设置窗口。
列表选中网卡点Edit编辑；配置DNS、路由标签页。

> 
> 如果已经通过启动参数ifcfg配置网卡，则自动DHCP会被关闭，直接使用启动参数的网络配置。

> 
> 访问SAN存储、RAID磁盘：按`Ctrl+Alt+F2`切换控制台，执行`extend libstoragemgmt`，使用`lsmcli`命令；`Alt+F7`切回图形安装界面。支持Netapp、SMI‑S SAN、LSI MegaRAID。

### 在线软件源

联网状态系统探测硬件完成后询问是否启用在线仓库。建议选Yes。

- Main Repository(OSS)开源主仓库：大量额外桌面软件包。
- SUSE Enterprise15更新源、openSUSE Backports更新源：强烈启用，给主仓库打补丁。
- Non‑OSS非开源仓库：存放专有许可证软件包；安装普通桌面不是必需。开启则同步启用Non‑OSS更新源。

其余仓库面向开发者。勾选完成下一步，确认许可协议，进入系统角色页面。

### 系统角色

预设软件集合，适配不同使用场景。可用选项取决于扩展模块。

- **Desktop with KDE Plasma**：功能完备桌面，邮件日历小组件等。
- **Desktop with GNOME**：重视易用性创新桌面。
- **Desktop with Xfce**：轻量传统桌面。
- **Generic Desktop通用桌面**：后续软件选择界面可以选Enlightenment、LXDE、LXQT、MATE。**前提需要开启Main OSS源。**
- **Server服务器**：精简软件包，文本模式无图形。
- **Transactional Server事务服务器**：只读根分区，事务自动更新，openSUSE Kubic基础。

### 磁盘分区

#### 重要说明

> 
> UEFI设备**必须创建EFI系统分区，挂载点`/boot/efi`，文件系统FAT32**。Windows原有EFI分区可以直接复用，不要格式化；没有EFI分区必须新建，只能普通物理分区或者RAID1，不支持LVM。

> 
> Btrfs快照与Snapper：根分区大于16GB默认开启快照，用于系统回滚；小于等于16GB自动关闭快照，避免占满磁盘。快照要求`/usr` `/var`等目录位于同一个Btrfs子卷；`/tmp` `/var/log` `/usr/local`可以独立分区排除快照。**开启快照建议根分区至少30‑40GB。**

> 
> Windows双系统：安装程序会尝试收缩Windows NTFS/FAT分区腾出空间。安装Windows端务必先磁盘碎片整理，做好数据备份。

> 
> 默认方案**不再自动创建独立/home分区**。需要独立/home，Guided Setup向导中勾选`Propose Separate Home Partition`，默认XFS文件系统。

> 
> 单位说明：分区界面显示容量是二进制GiB。1 GiB=1073741824字节，不等于十进制GB。

#### 推荐分区方案

向导给出分区提案，三种操作：

1. **Next下一步**：直接接受系统给出分区提案。
2. **Guided Setup引导设置**：向导；选择磁盘；开启LVM；开启磁盘加密；设置文件系统；是否独立/home；是否swap交换分区；休眠需要swap，勾选Enlarge to RAM Size for Suspend。Btrfs快照开关。
3. **Expert Partitioner专家分区器**：完全手动分区；支持LVM、RAID、磁盘加密、NFS挂载、Btrfs子卷高级配置。

### 时钟与时区

根据安装语言预填地区时区；地图点击选择地区。
硬件CMOS时钟设置：

- Windows+Linux双系统：取消勾选`Hardware Clock Set to UTC`（硬件时钟使用本地时间）
- **仅Linux系统：强烈建议硬件时钟设置UTC，夏令时自动切换；NTP时间同步也依赖该设置。**

点击Other Settings：手动设置时间，或者配置NTP服务器网络同步时间。确认点Accept。

### 新建用户账户

填写全名、登录用户名（只能小写字母数字、`.` `-` `_`，禁止特殊字符），两次输入密码。密码强度会做检查。

选项：

1. **Use this password for system administrator**：用户密码复用为root密码；单机家用工作站适合；不推荐生产环境。不勾选，则下一步设置独立root密码。
2. **Automatic Login自动登录**：开机直接进桌面，没有密码弹窗。多人共用电脑不要开启，有安全风险。
3. Skip User Creation跳过创建本地用户：NIS/LDAP集中账号环境。

旧Linux系统存在，可以导入旧系统用户数据。

### 系统管理员root身份认证

没有勾选复用用户密码，则进入该页面设置root密码，输入两次确认。

> 
> root是UID=0超级管理员，系统全部权限。⚠️不要遗忘root密码，丢失无法找回。**禁止日常登录使用root账号，操作失误极易损坏系统。SUSE不支持修改root用户名**，/etc/passwd普通用户可读，改名无法隐藏UID0账号，安全上无意义。

> 
> SSH公钥导入：U盘存放`.pub`公钥，浏览选中导入。只导入密钥不填密码，则root只能SSH密钥登录。如果导入密钥同时设置密码，并且需要安装完远程SSH登录，需要在安装总览安全页面打开22端口。

### 安装设置

点击各个标题进入修改配置。

1. **Software软件**：软件模式集patterns，选择桌面、服务器组件；Details打开完整YaST软件包管理器。还可以在这里添加系统次要语言包。

![[install_software_osuse.png]](./image/install_software_osuse.png)

2. **Booting引导**：GRUB2 EFI配置，自动识别Windows、其他Linux系统。软件RAID1可以把boot放在RAID1；RAID级别不等于1不支持/boot。
3. **Security安全**
   - CPU Mitigations：CPU漏洞缓解策略。
   - Firewall防火墙：默认全部网卡归入public区域，所有端口默认关闭。安装阶段可以选择打开SSH22端口。VNC远程安装则需要同时设置默认target为图形模式。
   - SSH服务：默认关闭，端口防火墙拦截。
   - 安全模块AppArmor，可以设置为None关闭。
4. **Network Configuration网络配置**：跳转YaST网络设置界面。桌面环境默认NetworkManager；服务器默认wicked。
5. **Default systemd target**：`graphical`图形桌面目标；`multi‑user`纯文本控制台目标。VNC远程安装必须图形目标。
6. **Import SSH host keys**：检测到旧Linux系统，可以导入旧机器的SSH主机密钥，避免SSH连接报主机密钥变更警告。可以同时导入/etc/ssh其他配置文件。
7. **System系统硬件**：硬件信息浏览；高级选项修改PCI ID、内核I/O调度器；开启SysRq魔术键。

全部确认完成点击Install；部分软件会弹出许可协议确认，确认后再次点击Install正式写入磁盘。

### 执行系统安装

软件安装耗时约15‑30分钟，取决于硬件与软件包多少。切换Details查看完整日志；Release Notes阅读版本重要提示。
安装结束，机器自动重启。登录系统后，打开YaST继续系统调优。无图形桌面或者远程环境，请参考参考手册《文本模式YaST》使用终端版YaST。

## 第4章 故障排查

### 校验安装介质

遇到安装异常，优先校验介质完整性。

- 启动U盘/DVD，More菜单选择Check Installation Media校验介质。
- 已经进入系统：YaST → Software → Media Check。
校验报错，介质损坏。刻录DVD建议低速4倍速刻录。

### 无可用启动驱动器

机器无法U盘/DVD启动，可选方案：

1. 外接USB光驱/U盘。部分固件更新可以修复兼容性。
2. PXE网络启动：机器有网卡，无U盘光驱。
3. U盘启动，无光驱无网络。

### 无法从安装介质启动

BIOS内启动顺序没有把U盘/DVD放在第一位。
进入BIOS修改启动顺序，把U盘/DVD调整到启动列表首位。AWARD BIOS、SCSI BIOS修改步骤文档提供操作。BIOS设置界面键盘一般是美式键盘布局。

![[keyboard_us.svg]](./image/keyboard_us.svg)

### 启动故障（内核加载失败硬件不兼容）

标准安装失败，介质保留，`Ctrl+Alt+Del`重启。BIOS启动界面按F5，选择No ACPI关闭ACPI；或者Safe Settings安全设置。
依旧失败，手动填写内核启动参数。常用内核参数：
`acpi=off`完全关闭ACPI；`acpi=force`强制开启；`pci=noacpi`关闭PCI‑ACPI中断；`notsc`关闭时间戳计数器等。

> 
> 内存硬件故障：启动菜单Memory Test内存测试，报错代表硬件内存损坏。

### 图形化安装程序无法启动

方案：

1. F3降低视频分辨率。
2. F3选择Text Mode文本模式安装。
3. VNC远程安装：启动参数输入 `vnc=1 vncpassword=你的密码`，选择Installation回车启动。安装系统会给出IP地址，浏览器访问`http://IP:5801`或者VNC客户端连接，远程图形界面安装。

### 只有极简启动界面

显卡显存不足以渲染图形启动界面，会进入文本提示符。直接输入对应关键词（Installation、Upgrade、Rescue System）执行功能；F1‑F12快捷键依旧可用。

---

# 第二部分 系统管理

## 第5章 使用YaST管理用户

> 
> 打开工具：YaST → Security and Users → User and Group Management；或者命令 `sudo yast2 users &`。

![[yast2_users_main_kde.png]](./image/yast2_users_main_kde.png)

界面包含标签页：Users用户、Groups组、Defaults for New Users新建用户默认配置、Authentication Settings身份认证设置。

- Users标签页：新增、修改、删除、禁用本地用户；密码策略；磁盘配额。
- Defaults for New Users：新建用户默认家目录路径、umask权限掩码、默认所属用户组。
- Groups标签页：新增、修改、删除用户组，管理组成员。
- Authentication Settings：配置NIS/LDAP/SSSD/Samba网络账号。

> 
> 注意：修改UID用户ID，文件属主会自动更新家目录内文件；但是家目录以外的文件属主不会自动修改，需要手动处理。
> root账号**不支持改名**。UID=0任何人可读/etc/passwd，改名无法隐藏管理员账号。

### 用户账户管理

1. **新增/编辑用户**
点击Add新增；选中用户Edit编辑。填写用户名、全名、密码。勾选`Receive System Mail`接收系统邮件。Details标签修改UID、家目录路径；移动旧家目录数据勾选`Move to New Location`。Password Settings设置密码过期策略。完成OK保存。可以菜单`Expert Options‑>Write Changes Now`立即保存不关闭窗口。
2. **禁用/删除用户**
Edit，勾选`Disable User Login`临时禁用账号；Delete删除，可以选择保留或者删除家目录数据。

### 用户账户附加配置项
#### 自动登录与无密码登录
如果你使用GNOME桌面，可以为特定用户配置**自动登录**，也可以开启全部用户的**无密码登录**。自动登录同一时间仅允许一个账号生效。开启无密码登录后，用户只需要输入用户名就可以进入系统，不用输入密码。

⚠**安全风险**
开启自动登录或者无密码登录会带来安全隐患。如果本机还会被其他人访问，不要启用这两个选项。

#### 强制密码策略
在「密码设置」标签页可以配置密码过期规则：
- **下次登录强制修改密码**：用户登录时必须重置密码
- 密码最长有效期、最短修改间隔
- 密码过期告警天数
- 密码过期后的宽限登录天数
- 账号到期日期（YYYY‑MM‑DD格式）

#### 磁盘配额管理
磁盘配额用来限制单个用户可以占用的磁盘块数量、inode（文件节点）数量。区分**软配额**（达到阈值发出告警）和**硬配额**（达到阈值直接禁止写入），还可以配置宽限时间。

启用步骤：
1. 打开专家分区器，编辑分区，在Fstab选项里勾选**启用配额支持**，系统需要预先安装`quota`软件包。
2. 执行`sudo systemctl start quotaon.service`启动配额服务。
3. 在用户编辑界面的插件标签页，打开「管理用户配额」，为每个文件系统设置块软硬限制、inode节点限制。

配套命令行工具：`repquota`查看配额统计、`warnquota`配额告警、`quota_nld`配额通知守护进程。

#### 修改本地用户默认配置
切换到「新建用户默认配置」标签页。在这里修改新建用户时的默认主用户组、家目录父路径、家目录的umask权限掩码。

#### 将用户加入用户组
Edit → Details，可以修改 Default Group 用户的**主组**，同时在附加组列表勾选需要归属的附属用户组。

### 管理用户组

![[yast2_groups_edit_kde.png]](./image/yast2_groups_edit_kde.png)

切换到「Groups（用户组）」标签页。
点击Add新建用户组；选中组点Edit编辑；填写组名、GID组ID，勾选该组包含的成员。
> 删除用户组前，必须先把组内所有成员移出，不允许删除还有成员的组。
通过「专家选项 → 立即写入更改」保存修改，不用关闭窗口。

### 修改用户身份认证方式
切换到「Authentication Settings（身份认证设置）」标签页，可以配置NIS、SSSD、Samba等网络账号服务。点击配置按钮，跳转对应客户端配置模块。

### 系统内置默认用户
这些账号是系统后台服务使用，**不要修改、不要删除**：
`root`、`bin`、`daemon`、`gdm`、`lp`、`mail`、`messagebus`、`nobody`、`polkitd`、`postfix`、`pulse`、`sshd`等。

### 系统内置默认用户组
系统内置组同样供服务使用，常见：`root`、`bin`、`daemon`、`audio`、`gdm`、`kvm`、`libvirt`、`lp`、`mail`等。

## 第6章 使用YaST修改语言与地区设置
locale 用来定义系统语言、区域格式。openSUSE Leap支持系统内共存多套locale语言环境。

> 启动YaST：「系统 → 语言」；命令行：`sudo yast2 language &`。

![[yast2_language.png]](./image/yast2_language.png)

### 修改系统语言
#### 通过YaST修改系统语言
- **主语言**：整个系统（YaST、全部桌面程序）的默认语言。修改完成需要注销重新登录；想要全部系统服务生效，建议重启主机。
- **次级语言**：额外安装其他语言包，部分应用可以单独切换次级语言。

点击Details按钮，可以设置root管理员账号是否跟随普通用户的语言环境。勾选次级语言，确认后系统会自动下载对应语言软件包。

#### 切换系统默认语言
直接在YaST界面选择主语言，保存，注销重登录生效。

#### 为X、GNOME应用单独切换语言
> 在GNOME桌面设置修改语言，只会改变桌面应用语言，**不会修改系统全局locale**。YaST这类系统工具仍然使用系统主语言。

终端临时让单个程序使用别的语言：
```bash
LANG=de_DE.UTF‑8 程序名
locale -av # 查看本机全部可用locale
```

### 修改国家与时间设置
YaST路径：「系统 → 日期和时间」；命令行：`sudo yast2 timezone &`

![[yast2_timezone.png]](./image/yast2_timezone.png)

1. 选择地区与时区。
2. **硬件时钟设置**
    - Windows+Linux双系统：取消勾选「硬件时钟设置为UTC」，硬件时钟使用本地时间。
    - 纯Linux：强烈建议硬件时钟设置为UTC，夏令时自动切换，NTP时间同步依赖此设置。
3. 其他设置：手动设置系统时间；配置NTP服务器实现网络时间同步。

![[yast2_timezone_ntp.png]](./image/yast2_timezone_ntp.png)

> NTP生效前提：硬件时钟与系统时间差值小于15分钟，否则不会自动同步。

## 第7章 打印机管理操作
### CUPS工作流程
1. 用户把打印作业（PDF/PS/ASCII）提交打印队列。
2. 过滤器Filter：将文档转换为打印机可识别指令，读取PPD打印机描述文件，定义分辨率、双面打印等参数。
3. 后端Backend：把处理完成的数据发送到物理打印机。

### 打印机连接方式与协议
- USB本地打印机：支持热插拔；串口、并口打印机建议断电插拔。
- 网络打印机协议：
    1. socket：TCP直连打印，端口9100，示例URI `socket://192.168.2.100:9100`
    2. LPD：RFC1179协议，端口515
    3. IPP：互联网打印协议，CUPS原生协议，端口631
    4. SMB：Windows共享打印机

### 安装所需软件包
如果系统缺少打印相关组件，需要安装`cups`、对应PPD驱动包，例如`gutenprint`。
硬件兼容性查询网站：openprinting.org

### 网络打印机配置
图形界面YaST硬件→打印机，添加打印机，选择网络类型，填写地址、协议，选择PPD驱动。

### 使用命令行工具配置CUPS

```bash
# 列出本机识别到的打印设备
sudo lpinfo -v
# 添加打印机队列
sudo lpadmin -p myprinter -v socket://192.168.2.100:9100 -P /usr/share/cups/model/generic.ppd.gz -E
# 查看队列选项
sudo lpoptions -p myprinter -l
# 修改默认打印参数
sudo lpadmin -p myprinter -o Resolution=600dpi
```
> `-E`放在末尾表示启用打印机；放在开头代表加密连接。

### 命令行打印操作
```bash
lp -d 打印机队列名 test.pdf
```

### openSUSE Leap中的特殊功能
#### CUPS与防火墙
firewalld默认public区域全部端口拦截。内网打印服务器建议网卡放入internal信任域，放行ipp、mdns服务。

#### 浏览发现网络打印机
需要启用`cups‑browsed`；Bonjour/zeroconf网络发现需要`avahi‑daemon`
```bash
sudo systemctl enable --now cups‑browsed avahi‑daemon
```

#### PPD打印机描述文件
PPD文件存放路径`/usr/share/cups/model`；相关软件包：`gutenprint`、`splix`、`OpenPrintingPPDs‑*`。

### 故障排查
1. **无标准打印语言的GDI打印机**：这类打印机完全依赖Windows专有驱动，Linux兼容性差。优先更换支持PostScript/PDF的打印机。
2. **PostScript打印机缺少适配PPD**：去厂商官网下载PPD；使用`cupstestppd`校验PPD文件语法正确性。
3. **网络打印机连接故障**：先用USB直连测试打印机是否正常；使用`nc`测试网络端口连通性；检查cups服务状态。
4. **无报错但是打印输出损坏乱码**：清空打印队列，关闭打印机电源重启硬件。
5. **打印队列被禁用**：出错后CUPS会自动禁用队列；执行`cupsenable 队列名`重新启用。
6. **CUPS浏览模式删除作业**：跨主机浏览打印机，打印任务需要在**服务端**执行cancel删除，客户端操作无效。
7. **损坏打印任务、数据传输错误**：取消作业，重启cups。
8. **CUPS调试**：修改`/etc/cups/cupsd.conf`，设置`LogLevel debug`，重启cups；查看日志`/var/log/cups/error_log`。

更多参考资料：cups官方文档、man cupsd。

## 第8章 通过FUSE访问各类文件系统
FUSE（用户态文件系统），普通非root用户就可以挂载各类文件系统，不需要修改内核模块。

### FUSE配置
安装软件包`fuse`；建议单独创建挂载目录，例如`~/mounts`。

#### 挂载NTFS磁盘分区（ntfs‑3g）
```bash
# 读写挂载
sudo ntfs‑3g /dev/sdXX ~/mounts/win
# 只读挂载
sudo ntfs‑3g /dev/sdXX ~/mounts/win -o ro
# 指定文件属主uid/gid
sudo ntfs‑3g /dev/sdXX ~/mounts/win -o uid=1000,gid=1000
# 卸载
fusermount -u ~/mounts/win
```

#### SSHFS挂载远程SSH文件系统
安装包`sshfs`
```bash
sshfs user@remote‑ip: ~/mounts/remote
fusermount -u ~/mounts/remote
```

#### 挂载ISO镜像
安装包`fuseiso`
```bash
fuseiso test.iso ~/mounts/iso
fusermount -u ~/mounts/iso
```

### 常用FUSE插件列表
|插件 |用途 |
|---|---|
|curlftpfs |挂载FTP服务器 |
|encfs |加密文件系统 |
|fuseiso |挂载ISO镜像 |
|fusepod |iPod设备 |
|fusesmb |Samba Windows共享 |
|gphotofs |数码相机 |
|ntfs‑3g |NTFS读写支持 |
|obexfs |蓝牙OBEX设备 |
|sshfs |SSH远程文件系统 |
|wdfs |WebDAV网盘 |

更多参考：libfuse项目GitHub主页。

# 第三部分 软件安装与系统更新
## 第9章 软件安装与卸载
### 术语释义
- **Repository 软件源**：存放RPM包和元数据的本地/远程仓库。
- **Pattern 模式集**：一组相关软件包集合，实现一键安装整套功能，例如笔记本、Web服务器模式集。
- **Package 软件包**：RPM格式软件归档。
- **Patch补丁包**：安全/错误修复包；delta‑rpm增量包只保存新旧版本差异，下载体积更小。
- **Recommends 推荐依赖**：弱依赖，非强制；默认zypper会安装，可以关闭。
- **Requires 必需依赖**：硬性依赖，缺少则软件无法运行。

### YaST软件管理器

![[yast2_sw_manager.png]](./image/yast2_sw_manager.png)

YaST → 软件 → 软件管理
视图菜单可以切换查看模式：Pattern模式集、软件分组、语言包、按软件源筛选、搜索框。
- 搜索：包名、描述、提供能力、依赖、文件路径都可以检索。
- 右键包：安装/删除。Pattern只能整体安装，不能直接删除，需要手动删除内部软件包。
- 选项菜单：删除包时自动清理不再需要的依赖。
- 依赖菜单：开关依赖自动处理、是否安装推荐包。

> 出现依赖冲突弹窗，优先使用YaST给出的解决方案，不建议手动强制操作。

![[yast2_package_conflict.png]](./image/yast2_package_conflict.png)

### 软件源与服务管理
YaST → 软件 → 软件源
支持介质：DVD、U盘、本地目录、ISO镜像、FTP/HTTP/HTTPS/NFS/SMB。
添加第三方源会导入GPG签名密钥校验包完整性。
仓库属性：启用/禁用、自动刷新、是否缓存下载包、优先级（数字越小优先级越高）、URL、别名。

![[yast2_addon_new.png]](./image/yast2_addon_new.png)

> ⚠第三方软件源风险：SUSE不对第三方源稳定性、安全性做担保，只添加可信源。

### GNOME包更新工具
![[gupdater_updates.png]](./image/gupdater_updates.png)
1. **GNOME Package Updater**：托盘通知更新，区分安全更新、推荐更新、可选更新。
2. **GNOME Software软件商店**：同时支持RPM、Flatpak、固件LVFS、GNOME扩展。

![[gnome-software-updates.png]](./image/gnome-software-updates.png)

## 第10章 安装附加组件产品
YaST → 软件 → 附加组件产品。
附加组件用来扩展系统，语言包、第三方驱动介质。支持CD、U盘、ISO镜像、网络源。
点击Add选择介质，导入GPG密钥，确认许可协议，跳转到软件管理器。

> 二进制专有驱动，请阅读发行说明确认硬件支持状态。

## 第11章 YaST在线更新
![[yast2_autoupdate.png]](./image/yast2_autoupdate.png)

YaST →软件 →在线更新；命令行`yast2 online_update`

![[yast2_you_osuse.png]](./image/yast2_you_osuse.png)

补丁分类：安全补丁、推荐补丁、可选补丁。
- **Needed Patches 需要安装的补丁**：本机软件对应的未安装补丁。
- **Unneeded Patches 不适用补丁**：本机软件不需要的补丁。
- **All Patches全部补丁**：仓库全部补丁。

右键设置每个补丁动作；安全补丁默认自动安装；部分补丁需要重启系统。

![[yast2_retracted_patches.png]](./image/yast2_retracted_patches.png)

**撤回补丁Retracted Patches**：存在严重Bug的补丁会被标记撤回，阻止继续安装。

## 第12章 系统升级与系统变更
### 系统大版本升级

![[install_boot_upgrade_osuse.png]](./image/install_boot_upgrade_osuse.png)

升级前操作：备份全部重要数据；保证磁盘空间充足；**禁用全部第三方软件源，只保留官方源**。

![[upgrade_partition_osuse.png]](./image/upgrade_partition_osuse.png)

![[upgrade_oldrepos_osuse.png]](./image/upgrade_oldrepos_osuse.png)

两种升级途径：
1. YaST图形界面升级。
2. Zypper发行版升级：`zypper dup`。

> ⚠升级存在风险，务必阅读Release Notes发行说明。升级不等于单个软件包更新，单个包更新直接使用`zypper update`。

### 升级潜在问题
- 第三方软件源包版本冲突。
- 配置文件变更，`.rpmsave`备份文件需要人工合并。
- 自定义服务、内核模块、第三方驱动可能不兼容新版本。

### 单独升级软件包
`zypper update 包名`，只升级指定包，不做整个发行版迁移。

更多参考：zypper手册、openSUSE维基SDB系统升级文档。

# 第四部分 Bash Shell
## 第13章 Shell基础
### 启动Shell
打开终端模拟器；物理机可以使用虚拟控制台`Ctrl‑Alt‑F1~F6`。

### 输入执行命令
不带参数：`ls`
带选项参数：`ls -lh /home`

### Bash快捷键
- `Ctrl + C`终止正在运行程序
- `Ctrl + D`退出shell
- `Ctrl + L`清屏
- Tab自动补全命令、文件名

### 获取帮助
```bash
man ls
info ls
ls --help
```

### 文件与目录操作
```bash
pwd #查看当前目录
cd /tmp #切换目录
ls #列出目录
mkdir testdir #创建目录
rm file #删除文件
rm -r testdir #删除目录
cp src dst #复制
mv old new #移动/重命名
```

### 切换至root管理员身份
1. su 切换完整root环境：`su -`，输入root密码。
2. sudo：普通用户临时提权：`sudo ls /root`

> 安全提示：尽量日常使用普通账号，只有管理操作才提权root。

### 文件访问权限
- 用户(user)：文件属主
- 组(group)：所属用户组
- 其他(other)：其余所有用户
```bash
chmod 755 test.sh #修改权限
chown tux:users test.sh #修改属主属组
```

### Bash高效实用特性
1. 历史命令：上下方向键调取历史；`history`查看全部历史命令。
2. Tab补全。
3. 通配符：`*`匹配任意字符；`?`匹配单个字符。

### 文本编辑 vi编辑器
vi三种模式：命令模式、输入模式、末行模式。
```
vi test.txt
i 进入编辑
Esc回到命令模式
:wq 保存退出
:q! 不保存强制退出
```

### 文件与内容搜索
```bash
find /home -name "*.txt" #按文件名搜索
grep "error" /var/log/messages #搜索文本内容
```

### 查看文本文件
```bash
cat file
less file
head file
tail -f file #实时跟踪日志
```

### 重定向与管道符
`>`覆盖输出；`>>`追加输出；`|`管道，把前一个命令输出交给后一个命令输入。
```bash
ls > list.txt
dmesg | grep usb
```

### 运行程序与进程管理
```bash
ps aux #查看进程
top #实时进程监控
kill PID #结束进程
kill -9 PID #强制杀死进程
```

### 归档与数据压缩
```bash
tar -cvf test.tar dir/ #打包
tar -xvf test.tar #解包
tar -zcvf test.tar.gz dir #gzip压缩打包
tar -zxvf test.tar.gz #解压
```

### Linux常用重要命令
**文件操作**：ls、cd、cp、mv、rm、mkdir、rmdir、chmod、chown、ln软链接。
**系统操作**：uname、free、df、du、mount、umount、systemctl。

man命令查看每个命令详细手册。

## 第14章 Bash与Bash脚本
### 什么是Shell
Shell是命令解释器，Bash是openSUSE默认shell。

### Bash配置文件
- `~/.bashrc`：交互式shell用户配置
- `~/.bash_profile`：登录shell加载
- `/etc/bash.bashrc`系统全局bash配置

### 目录结构
Linux根目录树，`/`是根；`/bin`系统基础命令；`/etc`配置；`/home`用户家目录；`/usr`应用程序；`/var`可变数据日志。

### 编写Shell脚本
脚本第一行必须声明解释器：`#!/bin/bash`
示例简单脚本
```bash
#!/bin/bash
echo "Hello openSUSE"
```
赋予可执行权限：`chmod +x test.sh`，运行：`./test.sh`

### 命令事件重定向
`> stdout输出`；`2>`标准错误输出；`&>`全部输出重定向。

### 使用别名alias
```bash
alias ll='ls -lh'
unalias ll #删除别名
```
写进`~/.bashrc`实现永久别名。

### Bash中的变量使用
```bash
NAME="tux"
echo $NAME
```
**位置参数变量**：脚本执行传入参数 `$1 $2 $@ $#`。
**变量替换**：`${VAR}`，字符串截取、替换。

### 命令分组与组合
`()`子shell执行；`{}`当前shell执行；`&&`前面成功才执行后面；`||`前面失败才执行后面。

### 常用流程控制语句
#### if条件控制
```bash
if [ -f /etc/passwd ]; then
  echo "文件存在"
fi
```

#### for循环语句
```bash
for i in 1 2 3; do
 echo $i
done
```

更多参考：`man bash`。

# 第五部分 硬件配置
## 第15章 设置系统键盘布局
YaST →硬件 →系统键盘布局
> 此设置修改**虚拟控制台TTY键盘**；GNOME/KDE图形桌面键盘需要在桌面设置内修改，两者互不影响。
命令行：`sudo yast keyboard set layout=us`。

## 第16章 声卡配置
YaST →硬件 →声卡
- 自动检测声卡硬件；设置音量；测试播放声音。
- 多声卡环境选择默认音频设备。
- 故障：无声音，可重新运行声卡配置模块，重新加载ALSA音频驱动。

## 第17章 设置打印机
YaST →硬件 →打印机
1. **添加驱动（YaST）**：添加打印机，选择本地USB /网络打印机，匹配PPD驱动。
2. **编辑本地打印机配置**：修改纸张、分辨率、双面选项。
3. **网络打印机配置**
    - 使用CUPS：填写IP、协议，选择驱动。
    - 非CUPS打印服务器：LPD等第三方打印服务器。
4. **网络共享打印机**：把本机打印机共享给局域网其他电脑；开启CUPS浏览、防火墙放行对应端口。

## 第18章 设置扫描仪
openSUSE使用SANE子系统支持扫描仪。
1. **HP一体机**：安装`hplip`软件包，YaST扫描仪模块配置。
2. **网络共享扫描仪**：配置saned服务，防火墙放行，允许其他主机访问本机扫描仪。
3. **网络远程扫描**：客户端配置sane‑net，使用网络上的扫描仪设备。

## 第19章 持久内存 NVDIMM / PMEM
### 简介
持久内存（非易失内存NVDIMM）断电数据不丢失。两种主要模式：
1. **DAX模式**：直接访问，绕过页缓存，低延迟；适合数据库。
2. **BTT模式**：块转换层，模拟普通块设备，防止断电出现撕裂写。

### 术语
- NVDIMM：物理持久内存硬件
- PMEM namespace：逻辑命名空间，硬件资源划分出来的逻辑设备。
- DAX：Direct Access直接访问
- BTT：Block Translation Table块转换表。

### 使用场景
1. PMEM‑DAX：数据库、低延迟存储。
2. PMEM‑BTT：普通块设备，兼容传统文件系统。

### 持久内存管理工具
`ndctl`工具集，管理NVDIMM硬件，创建、修改namespace命名空间。

### 设置持久内存
1. 查看本机可用NVDIMM设备：`ndctl list`
2. 创建DAX模式PMEM命名空间；
3. 创建BTT模式PMEM命名空间；
4. 将文件系统日志放到PMEM/BTT设备，提升普通磁盘文件系统性能。

> 参考man ndctl文档。

# 第六部分 帮助与故障排查
## 第20章 帮助与文档资源
### 文档目录
1. **发行说明Release Notes**：`/usr/share/doc/release‑notes`
2. **软件包自带文档**：`/usr/share/doc/packages`，每个软件包自带示例、README。
3. **man手册页**：`man command`，传统Unix手册。
4. **info文档页**：`info command`，GNU超文本格式文档。
5. **在线资源**：doc.opensuse.org官方文档；en.opensuse.org维基知识库。

## 第21章 常见问题及解决办法
### 信息收集与获取
排查故障先收集日志：`dmesg`内核日志；`/var/log/`目录系统日志；`journalctl`查看systemd日志。

### 启动相关故障

![[rescue_select_disk.png]](./image/rescue_select_disk.png)

1. **GRUB2引导加载程序加载失败**
原因：引导分区损坏、GPT/MBR分区表问题、EFI分区丢失。
救援方式：使用openSUSE救援系统，重新安装GRUB2引导。

2. **无登录界面、无命令提示符**
系统启动完成，但是无法出现登录。可能磁盘满、损坏、显示管理器故障。切换虚拟控制台`Ctrl‑Alt‑F2`登录排查。

3. **图形登录界面无法显示**
显示管理器（GDM）崩溃；显卡驱动问题；磁盘100%占满。TTY登录，查看`journalctl -u gdm`日志。

4. **Btrfs根分区挂载失败**
断电导致Btrfs文件系统出错。救援系统启动，执行btrfs‑check做文件系统校验。⚠不要频繁执行btrfs‑check，大磁盘耗时很长。

5. **强制检测根文件系统**
修改内核启动参数，添加`fsck.mode=force`强制开机磁盘检查。

6. **关闭swap交换分区实现启动**
swap分区损坏导致启动失败，可以临时内核参数`noswap`，启动系统后修复swap。

7. **双系统环境重启时GRUB2故障**
Windows更新经常覆盖EFI引导。进入BIOS，把openSUSE grub设置为第一启动项；或者救援系统重装GRUB2 EFI。

### 登录相关故障
1. **正确账号密码无法登录**
- 家目录磁盘已满；权限错乱；`.bashrc`配置脚本出错。TTY登录，清理磁盘空间。
2. **加密家目录分区登录失败**
ecryptfs家目录加密，密钥丢失、家目录底层磁盘损坏。

3. **GNOME桌面异常**
扩展冲突；配置文件损坏。可以重命名`~/.config`重置桌面配置。

### 网络相关故障
**NetworkManager网络管理器故障**
服务崩溃；配置文件损坏；网卡固件问题。
```bash
systemctl status NetworkManager
journalctl -u NetworkManager
```
可以切换wicked网络服务测试。

### 数据相关故障
1. **管理分区镜像**：使用`dd`做磁盘镜像备份。
2. **使用救援系统Rescue System**：安装介质启动菜单选择More → Rescue System。可以挂载本机磁盘，修改配置文件、重置密码、修复引导、备份数据。
