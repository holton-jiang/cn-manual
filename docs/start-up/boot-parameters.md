# 第 2 章 启动参数
<center>摘要</center>
openSUSE Leap 允许在引导期间设置多个参数，例如选择安装数据的来源或设置网络配置。

[[toc]]

使用一组适当的引导参数有助于简化安装过程。许多参数也可以稍后使用 **linuxrc** 例程进行配置，但使用引导参数更容易。在某些自动设置中，可以使用 **initrd** 或 **info** 文件提供引导参数。

安装时系统的启动方式取决于体系结构 —— 例如，PC (AMD64/Intel 64) 或大型机的系统启动方式不同。如果您在 KVM 或 Xen 管理程序上将 openSUSE Leap 作为 VM Guest 安装，请按照 AMD64/Intel 64 架构的说明进行操作。

::: tip 注意：引导选项和引导参数
引导参数术语和引导选项经常互换使用。在本文档中，我们主要使用引导参数术语。
:::

## 2.1 使用默认引导参数
通常，选择“安装”会启动安装引导过程。

如果出现问题，请使用 安装——禁用 ACPI 或 安装——安全设置。有关安装过程故障排除的更多信息，请参阅《第 4 章 故障排除》。

屏幕底部的菜单栏提供了某些设置所需的一些高级功能。使用功能键（`F1` ... `F12`），您可以指定附加选项以传递给安装例程，而无需了解这些参数的详细语法（请参阅《第 2 章 引导参数》）。有关可用功能键的详细说明，请参阅 “具有传统 BIOS 的计算机上的引导屏幕” 部分。

## 2.2 PC (AMD64/Intel 64/Arm AArch64)
本节介绍更改 AMD64、Intel 64 和 Arm AArch64 的引导参数。

##### 2.2.1 具有传统 BIOS 的计算机上的启动屏幕
屏幕显示引导安装过程的几个选项。 *Boot from Hard Disk* 引导安装的系统，默认选择。使用箭头键`↑ ↓ ← →`选择其他选项之一，然后按 `Enter` 键启动它。相关选项是：

###### 安装
正常安装模式。启用所有现代硬件功能。如果安装失败，请参阅  `F5` 内核，以获取禁用可能存在问题的功能的引导参数。

###### 更多 > Boot Linux System
引导已安装的 Linux 系统。系统将询问您从哪个分区引导系统。

###### 更多 > 查看安装介质
仅当您从下载的 ISO 创建的媒体进行安装时，此选项才可用。在这种情况下，建议检查安装介质的完整性。此选项会在自动检查媒体之前启动安装系统。如果检查成功，则正常安装程序开始。如果检测到损坏的媒体，则安装过程中止。更换损坏的介质并重新启动安装过程。

###### 更多 > 内存测试
使用重复的读写周期测试您的系统 RAM。通过重新启动来终止测试。有关详细信息，请参阅《第4.4章节 引导失败》的部分。

![[install_boot_osuse.png](./image/install_boot_osuse.png)
<center>图2.1 传统 BIOS 的电脑上启动
</center>
使用屏幕底部显示的功能键更改语言、屏幕分辨率、安装源或添加硬件供应商提供的额外驱动程序：

**F1 帮助**
	获取启动屏幕活动元素的上下文相关帮助。使用箭头键进行导航，使用 `Enter` 跟随链接，使用 `Esc` 离开帮助屏幕。

**F2 语言**
	为安装选择显示语言和相应的键盘布局。默认语言为英语（美国）。

**F3 视频模式**
	为安装选择各种图形显示模式。默认情况下，视频分辨率是使用 KMS（“内核模式设置”）自动确定的。如果此设置在您的系统上不起作用，请选择“无 KMS”，并且可以选择在引导命令行上指定 vga=ask 以提示输入视频分辨率。如果图形安装导致问题，请选择文本模式。

**F4 安装软件源**
	通常，安装是从插入的安装介质执行的。在这里，选择其他来源，如 FTP 或 NFS 服务器，或配置代理服务器。

**F5 内核**
	如果您在常规安装中遇到问题，此菜单会提供禁用一些可能有问题的功能。如果您的硬件不支持 ACPI（高级配置和电源接口），请选择无 ACPI 以在没有 ACPI 支持的情况下进行安装。没有本地 APIC 会禁用对 APIC（高级可编程中断控制器）的支持，这可能会导致某些硬件出现问题。安全设置在 DMA 模式（用于 CD/DVD-ROM 驱动器）和禁用电源管理功能的情况下引导系统。
	如果您不确定，请先尝试以下选项：安装——禁用ACPI 或 安装——安全设置。专家也可以使用命令行（Boot Options）输入或更改内核参数。

**F6 驱动**
	按此键通知系统您有一个可选的 openSUSE Leap 驱动程序更新。使用文件或 URL，在安装开始前直接加载驱动程序。如果选择是，系统会提示您在安装过程中的适当位置插入更新磁盘。

##### 2.2.2 配备 **UEFI** 的计算机上的启动屏幕
UEFI（Unified Extensible Firmware Interface）是一种新的行业标准，它替代和扩展了传统的 BIOS。最新的 UEFI 实现包含“安全引导”扩展，它通过只允许执行签名的引导加载程序来防止引导恶意代码。

用于引导具有传统 BIOS 的机器的引导管理器 GRUB 2 不支持 UEFI，因此 GRUB 2 被替换为 GRUB 2 for EFI。如果启用了安全启动，YaST 将自动选择 GRUB 2 for EFI 进行安装。从管理和用户的角度来看，两种引导管理器实现的行为相同，在下文中称为 **GRUB 2** 。

::: tip 提示：将其他驱动程序与安全启动一起使用
在启用安全启动的情况下进行安装时，您无法加载 openSUSE Leap 未附带的驱动程序。对于通过 SolidDriver 提供的驱动程序也是如此，因为它们的签名密钥在默认情况下不受信任。

要加载 openSUSE Leap 未附带的驱动程序，请执行以下任一操作：
- 在安装之前，通过固件/系统管理工具将所需的密钥添加到固件数据库中。
- 使用可引导的 ISO，它将在第一次引导时在 MOK 列表中注册所需的密钥。
:::

引导屏幕显示安装过程的几个选项。使用箭头键更改所选选项，然后按 `Enter` 键启动它。相关选项是：

**安装**
	正常安装模式。启用所有现代硬件功能。如果安装失败，请参阅 F5 内核，以获取禁用可能有问题的功能的引导参数。

**升级**
	执行系统升级。

**更多 > 救援系统**
	启动没有图形用户界面的最小 Linux 系统。有关详细信息，请参阅此选项在 Live CD 上不可用。

**更多 > Boot Linux System**
	引导已安装的 Linux 系统。系统将询问您从哪个分区引导系统。

**更多 > 查看安装介质**
	仅当您从下载的 ISO 创建的媒体进行安装时，此选项才可用。在这种情况下，建议检查安装介质的完整性。此选项会在自动检查媒体之前启动安装系统。如果检查成功，则正常安装程序开始。如果检测到损坏的媒体，则安装过程中止。

![[install_boot_uefi_osuse.png](./image/install_boot_uefi_osuse.png)
<center>图2.2：带有 UEFI 的电脑上引导</center>

openSUSE Leap 上用于 EFI 的 GRUB 2 不支持用于添加引导参数的引导提示或功能键。默认情况下，安装将以美国英语和引导媒体作为安装源启动。将执行 DHCP 查找以配置网络。要更改这些默认值或添加引导参数，您需要编辑相应的引导条目。使用箭头键突出显示它并按 `E`。请参阅屏幕上的帮助以获取编辑提示（请注意，现在只有英文键盘可用）。安装条目将类似于以下内容：

```
setparams 'Installation'  
  
   set gfxpayload=keep  
   echo 'Loading kernel ...'  
   linuxefi /boot/x86_64/loader/linux splash=silent  
   echo 'Loading initial ramdisk ...'  
   initrdefi /boot/x86_64/loader/initrd
```

将以空格分隔的参数添加到以 **linuxefi** 开头的行的末尾。要引导编辑的条目，请按 `F10`。如果通过串行控制台访问计算机，请按 `Esc + 0` 。 https://en.opensuse.org/Linuxrc 上提供了完整的参数列表。

## 2.3 重要引导参数列表
本节包含一些重要的引导参数。

###### 2.3.1 一般启动参数
**autoyast=_URL_**
	**autoyast** 参数指定用于自动安装的 **autoinst.xml** 控制文件的位置。

**manual=<0|1>**
	**manual** 参数控制其他参数是否只是仍必须由用户确认的默认值。如果应接受所有值且不询问任何问题，则将此参数设置为 **0** 。设置 **autoyast** 意味着将 **manual** 设置为 **0** 。

**Info= _URL_**
	指定从中读取附加选项的文件的位置。

**upgrade=<0|1>**
	要升级 openSUSE Leap，请指定 **Upgrade=1** 。

**dud= _URL_**
	从 URL 加载驱动程序更新。
	设置 dud=ftp://ftp.example.com/PATH_TO_DRIVER 或 dud=http://www.example.com/PATH_TO_DRIVER  以从 URL 加载驱动程序。当 **dud=1** 时，系统会在引导期间要求您提供 URL。

**language= _LANGUAGE_**
	设置安装语言。一些支持的值是 **cs_CZ** 、 **de_DE** 、 **es_ES** 、 **fr_FR** 、 **ja_JP** 、 **pt_BR** 、 **pt_PT** 、 **ru_RU** 、 **zh_CN** 和 **zh_TW** 。

**acpi=off**
	禁用 ACPI 支持。

**noapic**
	无逻辑 APIC。

**nomodeset**
	禁用 KMS。

**textmode=1**
	以文本模式启动安装程序。

**console=SERIAL_DEVICE[,MODE]**
	SERIAL_DEVICE 可以是实际的串行或并行设备（例如 ttyS0 ）或虚拟终端（例如 tty1 ）。 MODE 是波特率、奇偶校验和停止位（例如 9600n8 ）。此设置的默认值由主板固件设置。如果您在显示器上看不到输出，请尝试设置 console=tty1 。可以定义多个设备。

###### 2.3.2 配置网络接口
::: tip 重要：配置网络接口
本节中讨论的设置仅适用于安装期间使用的网络接口。
:::

只有在安装过程中需要时才会配置网络。要强制配置网络，请使用 **netsetup** 或 **ifcfg** 参数。

**netsetup=_VALUE_**
	**netsetup=dhcp** 通过 DHCP 自动配置。使用引导参数 **hostip** 、 **gateway** 和 **nameserver** 配置网络时设置 **netsetup=-dhcp** 。使用选项**netsetup=hostip,netmask,gateway,nameserver** ，安装程序会在引导期间询问网络设置。

**ifcfg=INTERFACE[.VLAN]=[.try,]SETTINGS**
**INTERFACE** 可以是 * 以匹配所有接口，或者例如 <u>eth*</u> 以匹配以 **eth** 开头的所有接口。也可以使用 MAC 地址作为值。

（可选）可以在接口名称后面设置一个 VLAN，以句点分隔。
如果 **SETTINGS** 为 **dhcp** ，则所有匹配的接口都将配置为DHCP。如果添加 **try** 选项，则当可以通过配置的接口之一访问安装库时，配置将停止。

或者，您可以使用静态配置。使用静态参数时，只会配置第一个匹配的接口，除非您添加 **try** 选项。这将配置所有接口，直到可以访问存储库。

静态配置的语法是：

```
ifcfg=*="IPS_NETMASK,GATEWAYS,NAMESERVERS,DOMAINS"
```

每个逗号分隔值又可以包含一个空格字符分隔值列表。 **IPS_NETMASK** 采用 CIDR 表示法，例如 **10.0.0.1/24** 。只有在使用空格字符分隔的列表时才需要引号。具有两个名称服务器的示例：

```
ifcfg=*="10.0.0.10/24,10.0.0.1,10.0.0.1 10.0.0.2,example.com"
```

::: tip 提示：其他网络参数
**ifcfg** 引导参数非常强大，几乎可以设置所有网络参数。除了上面提到的参数之外，您还可以为 **/etc/sysconfig/network/ifcfg.template**  和 **/etc/sysconfig/network/config** 中的所有配置选项（以逗号分隔）设置值。以下示例在通过 DHCP 配置的接口上设置自定义 MTU 大小：
```
ifcfg=eth0=dhcp,MTU=1500
```
:::

**hostname=host.example.com**
	输入标准主机名。

**domain=example.com**
	DNS 的域搜索路径。允许您使用短主机名而不是完全限定的主机名。

**hostip=192.168.1.2[/24]**
	输入要配置的接口的 IP 地址。 IP 可以包含子网掩码，例如 **hostip=192.168.1.2/24** 。只有在安装过程中需要网络时才会评估此设置。

**gateway=192.168.1.3**
	指定要使用的网关。只有在安装过程中需要网络时才会评估此设置。

**nameserver=192.168.1.4**
	指定负责的 DNS 服务器。只有在安装过程中需要网络时才会评估此设置。

**domain=example.com**
	域搜索路径。只有在安装过程中需要网络时才会评估此设置。

###### 2.3.3 指定安装源
如果您不使用 DVD 或 USB 闪存驱动器进行安装，请指定替代安装源。

**install=SOURCE**
	指定要使用的安装源的位置。可能的协议是 **cd** 、 **hd** 、 **slp** 、 **nfs** 、 **smb** (Samba/CIFS)、 **ftp** 、 **tftp** 、 **http** 和 **https** 。默认选项是 **cd** 。
	要通过加密连接安装，请使用 **https** URL。如果无法验证证书，请使用 **sslcerts=0** 引导参数禁用证书检查。
	如果提供了 **http** 、 **https** 、 **ftp** 、 **tftp** 或 **smb** URL，您可以通过使用 URL 指定用户名和密码来进行身份验证。例子：

```
install=https://USER:PASSWORD@SERVER/DIRECTORY/DVD1/
```

如果是 Samba 或 CIFS 安装，您还可以指定应该使用的域：

```
install=smb://WORKDOMAIN;USER:PASSWORD@SERVER/DIRECTORY/DVD1/
```

要使用 cd 、 hd 或 slp ，请将它们设置为以下示例：

```
install=cd:/
install=hd:/?device=sda/PATH_TO_ISO
install=slp:/
```

###### 2.3.4 指定远程访问
一次只能指定一种不同的远程控制方法。不同的方法是：SSH、VNC、远程 X 服务器。

display_ip= IPADDRESS
Display_IP 使安装系统尝试连接到给定地址的 X 服务器。

::: tip 重要：X 认证机制
X Window System 的直接安装依赖于基于主机名的原始身份验证机制。当前的 openSUSE Leap 版本禁用了该机制。首选使用 SSH 或 VNC 安装。
:::

vnc=1
	在安装期间启用 VNC 服务器。

vncpassword= PASSWORD
	设置 VNC 服务器的密码。

ssh=1
	ssh 启用 SSH 安装。

ssh.password= PASSWORD
	在安装期间为 root 用户指定 SSH 密码。

## 2.4 高级设置
要为安装配置对本地 RMT 或 supportconfig 服务器的访问，您可以指定引导参数以在安装期间设置这些服务。如果您在安装过程中需要 IPv6 支持，这同样适用。

###### 2.4.1 使用 IPv6 进行安装
默认情况下，您只能为您的机器分配 IPv4 网络地址。要在安装期间启用 IPv6，请在引导提示符处输入以下参数之一：

**接受 IPv4 和 IPv6**

```
ipv6=1
```

**仅接受 IPv6**

```
ipv6only=1
```

###### 2.4.2 使用代理进行安装
在强制使用代理服务器访问远程网站的网络中，只有在配置代理服务器时才能在安装期间进行注册。

在具有传统 BIOS 的系统上，在引导屏幕上按 `F4` 并在 HTTP 代理对话框中设置所需的参数。

在具有 UEFI BIOS 的系统上，在引导提示符处提供引导参数 **proxy** ：

1. 在启动屏幕上，按 `E` 编辑启动菜单。
2. 按以下格式将 **proxy** 参数附加到 **linux** 行：

```
proxy=https://proxy.example.com:PORT  
```

如果代理服务器需要身份验证，请按如下方式添加凭据：

```
proxy=https://USER:PASSWORD@proxy.example.com:PORT
```

如果无法验证代理服务器的 SSL 证书，请使用 **sslcerts=0** 引导参数禁用证书检查。

结果将类似于以下内容：

![[grub_cmdline_proxy_osuse.png](./image/grub_cmdline_proxy_osuse.png)
<center>图 2.3：GRUB 选项编辑器</center>
3. 按 `F10` 以使用新的代理设置启动。

###### 2.4.3 启用 SELinux 支持
在安装启动时启用 SELinux 使您可以在安装完成后配置它而无需重新启动。使用以下参数：

```
security=selinux selinux=1
```

###### 2.4.4 启用安装程序自动更新
在安装和升级过程中，YaST 可以按照“安装程序自动更新”一节中的描述进行自动更新，以解决发布后发现的潜在错误。 **self_update** 参数可用于修改此功能的行为。

要启用安装程序自动更新，请将参数设置为 **1** ：

```
self_update=1
```

要使用用户定义的存储库，请指定一个 URL：

```
self_update=https://updates.example.com/
```

###### 2.4.5 缩放高 DPI 的用户界面
如果您的屏幕使用非常高的 DPI，请使用引导参数 **QT_AUTO_SCREEN_SCALE_FACTOR** 。这会将字体和用户界面元素缩放到屏幕 DPI。

```
QT_AUTO_SCREEN_SCALE_FACTOR=1
```

###### 2.4.6 使用 CPU 缓解措施
引导参数 **mitigations** 可让您控制针对受影响 CPU 的边信道攻击的缓解选项。它的可能值是：

**auto.** 启用您的 CPU 模型所需的所有缓解措施，但不防止跨 CPU 线程攻击。此设置可能会在一定程度上影响性能，具体取决于工作负载。

**nosmt.** 提供全套可用的安全缓解措施。启用您的 CPU 型号所需的所有缓解措施。此外，它还禁用同步多线程 (SMT) 以避免跨多个 CPU 线程的旁路攻击。此设置可能会进一步影响性能，具体取决于工作负载。

**off.** 禁用所有缓解措施。根据 CPU 型号，可能会对您的 CPU 进行边信道攻击。此设置对性能没有影响。

每个值都带有一组特定参数，具体取决于 CPU 架构、内核版本以及需要缓解的漏洞。有关详细信息，请参阅《内核》文档。

## 2.5 更多信息
您可以在 openSUSE wiki 中找到有关引导参数的更多信息，网址为 https://en.opensuse.org/SDB:Linuxrc#Parameter_Reference。