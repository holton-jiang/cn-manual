# 安全与加固指南

[[toc]]

# 第1章 安全与保密性
## 1.1 概述
Linux 的一大主要特性是支持多用户同时使用系统（多用户机制），允许多位用户在同一台计算机上同时执行各项任务（多任务机制）。对用户而言，访问本地存储的数据与访问网络上的数据，体验上并无差别。

正因为具备多用户能力，必须对不同用户的数据进行隔离存储，以此保障安全性与隐私性。另外，即便存储介质（例如硬盘）发生损坏、数据丢失，也必须保障数据可用，这一点同样十分重要。

本章主要聚焦保密性与隐私。但一套完备的安全方案，必须包含一套定期更新、可用且经过验证的备份策略。一旦数据遭到篡改或是发生硬件故障，如果没有备份，想要恢复数据将会十分困难。

安全工作应当采用**深度防御**的思路：不要指望某一种威胁缓解手段可以完全保护你的系统与数据，多层防护叠加会让攻击者的入侵难度大幅提升。深度防御策略包含以下组成部分：
- 对密码做哈希处理（例如使用 PBKDF2、bcrypt 或 scrypt 算法）并加盐
- 数据加密（例如 AES）
- 日志记录、监控以及入侵检测
- 防火墙
- 防病毒扫描程序
- 成文并经过演练的应急处置流程
- 数据备份
- 物理安全防护
- 安全审计、安全扫描以及渗透测试

openSUSE Leap 内置了实现上述需求的各类软件。下面各小节将为你提供加固系统的着手点。

## 1.2 密码
在 Linux 系统中，仅会存储密码的哈希值。哈希是一类单向算法，会将原始数据转换为一串数字指纹，该过程难以逆向还原出原始密码。

哈希值保存在 `/etc/shadow` 文件中，普通用户无法读取该文件。由于借助高性能计算机可以破解哈希密码，哈希后的密码绝不能向普通用户暴露。

美国国家标准与技术研究院（NIST）发布了密码相关指南，可访问：https://pages.nist.gov/800‑63‑3/sp800‑63b.html#sec5。

如需了解如何配置密码策略，请参见第17.3节「密码设置」。关于 Linux 身份认证的通用信息，请参阅第一部分《身份认证》。

## 1.3 备份
如果系统遭到入侵，可利用备份恢复系统到之前的状态。当程序缺陷或是人为误操作发生时，同样可以借助备份，将当前系统状态与旧版本做比对。对于生产环境，部分备份应当进行异地存储，用来应对灾难事故（例如磁带/可读写介质异地存放，或是异地备份任务）。

出于合规法律要求，部分企业和组织必须谨慎把控备份的数据范围以及备份文件的保存时长。如果你们组织存在销毁纸质旧文档的制度，那么同样需要把这套制度延伸应用到 Linux 的备份磁带。

服务器物理安全的相关规则，对备份介质同样适用。除此之外，建议对备份数据进行加密。加密可以针对单个备份归档文件，也可以对整个备份文件系统开启加密（视实际场景而定）。一旦备份介质在运输途中丢失，加密能够防止未授权人员读取数据。当备份服务器本身被攻陷时，加密同样可以起到防护作用。在一定程度上，加密还能够保障备份数据的完整性。但要注意，必须确保相关人员在紧急场景下能够解密备份数据。同时还要考虑加密密钥本身泄露后，如何完成密钥替换。

如果已知或者怀疑系统已经被入侵，就必须核查备份的完整性。倘若系统被攻陷后很长一段时间都没有被发现，那么备份文件内很可能已经混入被篡改的配置文件或是恶意程序。保留足够久的备份历史记录，就可以用来排查异常改动。

即便没有发生已知的安全漏洞，定期比对备份中重要配置文件的差异，也有助于发现安全问题（甚至是无意造成的配置错误）。这种方式尤其适合内容不会频繁变更的文件与业务环境。

## 1.4 系统完整性
如果攻击者可以物理接触计算机硬件，就能够篡改固件与启动流程，在授权人员开机时获取系统访问权限。并非所有计算机都可以放置在无法接触的机房，但首要措施应当是把服务器机房上锁管控。

同时要注意，淘汰旧设备时，必须采取安全处置流程。保护引导加载程序、限制可移动介质的启动权限，同样是有效的物理安全防护手段。更多信息参见第9章《物理安全》。

还可以采取下面这些额外防护措施：
1. 配置系统，禁止从可移动设备引导启动。
2. 使用 UEFI 密码、安全启动（Secure Boot）以及 GRUB2 密码保护引导流程。

Linux 系统由引导加载程序启动，引导加载程序允许向正在启动的内核传递额外参数。设置引导加载程序密码，能够阻止其他人在开机阶段使用这些内核参数。这一点对系统安全至关重要。内核本身就以 root 权限运行，并且是系统启动阶段第一个授予 root 权限的组件。

关于如何设置引导密码，请参阅参考手册第12章「GRUB 2引导加载程序」的12.2.6节「设置引导密码」。

3. 启用磁盘加密。更多信息参见第12章《对分区与文件进行加密》。
4. 使用 cryptctl 对托管存储进行加密。更多信息参见第13章《使用 cryptctl 实现托管应用的存储加密》。
5. 使用 AIDE 检测系统配置的任何变更。更多信息参见第20章《使用 AIDE 实现入侵检测》。

## 1.5 文件访问
Linux 秉持「一切皆文件」的设计理念，文件权限对于管控绝大多数资源的访问权限至关重要。也就是说，通过文件权限，你可以控制普通文件、目录以及硬件设备的访问。默认情况下，绝大多数硬件设备仅允许 root 用户访问。但部分设备（例如串口）普通用户也可以访问。

通用安全准则：完成任务时，始终使用权限约束最严格的账号。举例来说，读取、撰写邮件完全不需要使用 root 账号。如果邮件程序存在漏洞，漏洞就可以利用程序运行时所拥有的权限发起攻击。遵循这条准则，能够最大限度降低潜在攻击造成的破坏。更多内容请参阅19.1节「传统文件权限」与19.2节「访问控制列表（ACL）的优势」。

AppArmor 和 SELinux 可以对应用程序与用户施加约束。详情请参阅第四部分《使用 AppArmor 进行权限约束》以及第五部分《SELinux》。

如果存在绕过操作系统直接读取硬盘的风险（例如启动 live 系统，或是拆下硬盘硬件），务必对数据加密。openSUSE Leap 支持对存放数据与操作系统的分区加密。详见第12章《对分区与文件进行加密》。

## 1.6 网络
保障网络服务安全是一项关键工作。应当尽可能对 OSI 模型多层做安全加固。

所有通信都应当使用现代加密算法在传输层或应用层完成身份认证与加密。可以在物理网络之上，额外部署虚拟专用网络（VPN）作为一层安全防护。

openSUSE Leap 提供多种工具来加固网络安全：
- 使用 openssl 生成 X509 证书。证书可用于各类服务的加密与身份认证。你可以搭建属于自己的证书颁发机构（CA），作为网络内的信任源。详情参阅 `man openssl`。
- 网络中总有部分网段暴露在公网互联网。通过防火墙规则关闭端口、卸载或禁用非必需服务，以此缩小攻击面。详情参见第23章《地址伪装与防火墙》。
- 使用 OpenVPN 在不安全的物理网络上保护通信通道。详情参见第24章《配置VPN服务器》。
- 为网络服务启用强身份认证。详情参阅第一部分《身份认证》。

## 1.7 软件漏洞
软件漏洞指软件中可被利用，用来获取未授权访问权限或是滥用系统的缺陷。远程服务（例如 HTTP 服务器）存在漏洞时风险尤其高。计算机系统十分复杂，因此软件总会存在一定数量的漏洞。

当漏洞被公开披露后，软件开发者必须修复该问题，之后系统管理员需要及时、稳妥地在受影响系统上安装对应的更新包。

漏洞会在集中数据库中发布，例如由美国政府维护的国家漏洞数据库。你可以订阅信息推送，及时获取新披露漏洞。部分情况下，在补丁发布之前，可以采取缓解措施规避漏洞风险。漏洞会分配一个CVE（通用漏洞披露）编号，同时附带 CVSS（通用漏洞评分系统）分值，分值用来评估漏洞的严重等级。

SUSE 提供安全公告推送，访问地址：https://www.suse.com/en‑us/support/update/。同时也提供按 CVE 编号检索的安全更新清单：https://www.suse.com/support/security/。

管理员应当为系统的高危漏洞做好预案。包括对所有计算机进行最大程度的安全加固。同时建议制定预先流程，用于快速安装高危漏洞补丁。

使用严格的文件权限，降低攻击带来的破坏。参见19.1节「传统文件权限」。

其他有用链接：
- http://lists.opensuse.org/opensuse‑security‑announce/：openSUSE 安全公告邮件列表
- https://nvd.nist.gov/：美国国家漏洞数据库
- https://cve.mitre.org/：MITRE 的 CVE 数据库
- https://www.bsi.bund.de/SiteGlobals/Forms/Suche/BSI/Sicherheitswarnungen/Sicherheitswarnungen_Formular.html：德国联邦信息安全局漏洞推送
- https://www.first.org/cvss/：通用漏洞评分系统相关资料

## 1.8 恶意软件
恶意软件指用于干扰计算机正常运行或是窃取数据的程序，包含病毒、蠕虫、勒索软件、rootkit 等。部分恶意软件利用软件漏洞入侵计算机，但很多时候是由用户误执行导致，尤其是从未知来源安装第三方软件的场景。

openSUSE Leap 的软件源提供海量程序包，降低了下载第三方软件的需求。SUSE 发布的所有软件包均做签名处理。openSUSE Leap 的包管理器下载软件包后，会校验签名，验证完整性。命令 `rpm --checksig RPM_FILE` 可以查看软件包的校验和与签名是否正确。签名公钥可在 openSUSE Leap 第一张 DVD，以及全球绝大多数密钥服务器上获取。

你可以使用 ClamAV 杀毒软件检测系统中的恶意软件。ClamAV 可以集成进多种服务，例如邮件服务器、HTTP 代理服务器，在恶意软件抵达用户之前完成过滤。

严格限制用户权限，可以降低意外执行恶意代码带来的风险。

## 1.9 重要安全提示
下面的提示是对以上各小节的简要汇总：
1. 持续跟进最新安全问题，收到安全公告推送后尽快获取并安装推荐更新包。
2. 尽可能避免使用 root 权限操作；设置严格的文件权限。
3. 网络通信只使用加密协议。
4. 禁用所有非业务必需的网络服务。
5. 定期开展安全审计，例如扫描网络开放端口。
6. 使用 AIDE（高级入侵检测环境）监控系统文件完整性。
7. 安装任何第三方软件时务必谨慎。
8. 定期校验你的全部备份。
9. 检查系统日志文件，可以使用 Logwatch 等工具。
10. 配置防火墙，拦截所有未显式加入白名单的端口。
11. 安全防护措施要做到冗余备份。
12. 在合适场景下启用加密，例如笔记本电脑硬盘。

## 1.10 报告安全问题
如果你发现了安全相关问题，请先确认是否已有可用更新包。如果没有，请写邮件发送至 security@suse.de。邮件中详细描述问题，同时写明对应软件包的版本号。建议使用 GPG 加密邮件。

SUSE 当前的 GPG 公钥可在此获取：https://www.suse.com/support/security/contact/。

# 第一部分 认证

# 第2章 使用PAM进行身份认证

Linux 在身份认证流程中使用 PAM（可插拔身份验证模块，Pluggable Authentication Modules）作为介于用户和应用程序之间的中间层。PAM 模块是系统全局可用的，任意应用程序都可以调用它们。本章将介绍该模块化身份认证机制的工作原理以及配置方式。

## 2.1 什么是PAM？

系统管理员和开发人员常常需要限制对系统特定部分的访问，或是限制应用程序某些功能的使用。在没有 PAM 的情况下，每当引入新的身份认证机制（例如 LDAP、Samba 或者 Kerberos），应用程序就必须随之修改。但这个过程既耗费时间，又容易出错。有一种方法可以规避这些弊端：将应用程序与身份认证机制解耦，把身份认证交由集中管理的模块处理。每当需要一种新的身份认证方案时，只需要适配或者编写一个合适的 PAM 模块供对应程序调用即可。

PAM 的概念由以下部分组成：

- **PAM模块**：一组用于特定身份认证机制的共享库。
- **模块栈**：由一个或多个PAM模块构成。
- **PAM感知服务**：需要借助模块栈或者PAM模块完成身份认证的服务。通常服务名就是对应的应用程序的熟知名称，例如 `login` 或者 `su`。保留字 `other` 用于存放默认规则。
- **模块参数**：用于控制单个PAM模块执行行为的参数。
- **结果评估机制**：对每一个PAM模块的执行返回结果进行处理。返回成功则执行下一个PAM模块；处理失败返回值的行为取决于配置：从“不产生影响、继续执行”到“立刻终止”，以及介于二者之间的行为均为合法配置。

## 2.2 PAM配置文件的结构

PAM 有两种配置方式：

1. **基于文件配置（`/etc/pam.conf`）**
每个服务的配置全部存放在 `/etc/pam.conf`。但是出于维护性和易用性考量，openSUSE Leap 并不使用该配置方案。
2. **基于目录配置（`/etc/pam.d/`）**
每一个依赖 PAM 机制的服务（或者程序），在 `/etc/pam.d/` 目录下都拥有独立的配置文件。例如，sshd 的服务配置文件就是 `/etc/pam.d/sshd`。

`/etc/pam.d/` 下的文件定义身份认证所使用的PAM模块。每个文件由若干行组成，每一行最多包含四个组件：
`类型 控制标记 模块路径 模块参数`

各组件含义如下：

### TYPE（类型）

声明服务的类型。PAM模块以栈的形式依次处理。不同类型模块用途各不相同。例如一个模块校验密码，另一个校验访问来源，还有的读取用户自定义设置。PAM一共有四种模块类型：

- **auth**
校验用户身份，传统方式是询问密码。但也可以通过芯片卡或者生物识别（例如指纹、虹膜扫描）完成。
- **account**
该类型模块检查用户是否具备使用请求服务的通用权限。例如，执行这类检查，确保账户过期的用户无法登录。
- **password**
该类型模块的用途是修改身份认证令牌，一般就是修改密码。
- **session**
该类型模块负责管理与配置用户会话。它们会在身份认证的前后运行，用来记录登录尝试，配置用户专属环境（邮件账户、家目录、系统限制等）。

### CONTROL（控制标记）

指明PAM模块的行为。每个模块可以设置如下控制标记：

- **required**
设置该标记的模块必须处理成功，身份认证流程才可以继续。当标记为`required`的模块处理失败后，会继续处理其余所有标记同为`required`的模块，全部执行完毕之后，用户才会收到身份认证失败的提示。
- **requisite**
该标记的模块同样必须处理成功，行为和`required`类似。但是一旦失败，`requisite`模块会立刻向用户返回结果，不再执行后续模块。处理成功之后，则继续处理其余模块，和`required`模块行为一致。`requisite`标记可以用作基础过滤，用来校验身份认证所必需满足的前置条件。
- **sufficient**
标记为`sufficient`的模块处理成功之后，只要前面没有出现`required`模块的失败，请求的应用程序会立刻收到成功结果，不再处理后续模块。标记为`sufficient`的模块处理失败不会产生直接影响，会按顺序继续处理后续模块。
- **optional**
标记为`optional`的模块无论成功还是失败，都不会产生直接影响。适合仅用于输出提示信息的模块（例如提示用户收到邮件），而不执行进一步操作。
- **include**
使用该标记时，会将指定的文件插入到本行所在位置。

### MODULE_PATH（模块路径）

存放PAM模块完整文件名。如果模块存放在默认目录下，则无需显式指定。openSUSE Leap 支持的64位平台默认目录为 `/lib64/security`。

### MODULE_ARGS（模块参数）

由空格分隔的选项列表，用来控制PAM模块的行为，例如`debug`（开启调试）或者`nullok`（允许空密码）。

另外，PAM模块的全局配置文件存放在 `/etc/security` 目录下，定义这些模块的具体行为（例如 `pam_env.conf`、`time.conf`）。每一个调用PAM模块的应用程序，都会调用一组PAM函数，这些函数读取配置文件信息，再将结果返回给发起请求的应用程序。

为简化PAM模块的创建与维护，系统提供了`auth`、`account`、`password`、`session`类型的通用默认配置文件。每一个应用程序的PAM配置都会引用这些通用文件。对全局PAM配置模块`common‑*`文件的更新，会自动同步到所有PAM配置文件，管理员不再需要逐个修改每一份应用配置。

全局PAM配置文件由工具`pam‑config`维护。该工具自动向配置中添加新模块、修改现有模块配置，或是从配置中删除模块（或参数）。最大程度减少甚至不再需要管理员手动修改PAM配置。

> 
> 注意：64位与32位混合安装
> 在64位操作系统中，也可以安装32位应用程序运行时环境。这种情况下，请务必同时安装PAM模块的32位版本。

## 2.3 sshd的PAM配置

以sshd的PAM配置作为示例：

> 
> 示例2.1：sshd 的PAM配置（`/etc/pam.d/sshd`）

```
#%PAM‑1.0
auth       requisite pam_nologin.so
auth       include  common‑auth
account    requisite pam_nologin.so
account    include  common‑account
password   include  common‑password
session    required pam_loginuid.so
session    include  common‑session
session    optional pam_lastlog.so silent noupdate showfailed
```

1. `#%PAM‑1.0`：声明该配置文件遵循PAM‑1.0版本。这只是约定标记，未来版本可用来校验版本。
2. 检查是否存在 `/etc/nologin` 文件。如果该文件存在，除root之外的所有用户都禁止登录。
3. 引用四类模块的配置文件：`common‑auth`、`common‑account`、`common‑password`、`common‑session`。这四份文件保存每种模块类型的默认配置。
4. 为经过身份认证的进程设置login UID进程属性。
5. 展示用户上一次登录的相关信息。

通过include引入配置文件，而不是把每个模块逐条写进sshd配置。当管理员修改默认配置后，sshd的PAM配置会自动更新。旧的处理方式是：PAM发生改动或者安装新应用时，管理员必须手动调整全部应用的配置文件。现在使用全局配置文件，所有服务的PAM配置自动继承变更。

第一个include文件 `common‑auth` 调用三个auth类型模块：`pam_env.so`、`pam_gnome_keyring.so`、`pam_unix.so`。

> 
> 示例2.2：auth段的默认配置（`common‑auth`）

```
auth    required pam_env.so
auth    optional pam_gnome_keyring.so
auth    required pam_unix.so try_first_pass
```

`pam_env.so` 读取 `/etc/security/pam_env.conf` 加载环境变量。它可以正确设置`DISPLAY`变量，因为pam_env模块可以识别登录的来源位置。
`pam_gnome_keyring.so` 将用户登录密码与GNOME密钥环做校验。
`pam_unix` 将用户登录密码与 `/etc/passwd` 和 `/etc/shadow` 文件做校验。
会完整执行全部auth模块栈之后，sshd才收到登录是否成功的反馈。所有标记为`required`的模块全部处理成功之后，sshd才收到成功结果。只要其中一个模块失败，仍然会完整走完整个模块栈，之后sshd才收到失败通知。

当全部auth类型模块处理成功后，处理下一条include语句，也就是示例2.3 account段的默认配置文件`common‑account`。`common‑account`里面只有一个模块`pam_unix`。如果`pam_unix`返回该用户存在，sshd收到成功提示，接着处理password模块栈，见示例2.4。

> 
> 示例2.3：account段的默认配置（`common‑account`）

```
account    required pam_unix.so try_first_pass
```

> 
> 示例2.4：password段的默认配置（`common‑password`）

```
password   requisite pam_cracklib.so
password   optional pam_gnome_keyring.so use_authtok
password   required pam_unix.so use_authtok nullok shadow try_first_pass
```

sshd 的PAM配置仅通过include引用`common‑password`里面password模块的默认配置。每当应用程序请求修改身份认证令牌，这些模块必须全部处理成功（`requisite`与`required`控制标记）。

修改密码或者其他身份令牌需要安全校验，由`pam_cracklib`模块完成。后续`pam_unix`模块接收来自`pam_cracklib`的旧密码、新密码，用户无需再次输入密码。该机制保证无法绕过`pam_cracklib`执行的密码检查。当`account`或者`auth`配置检测到密码过期时，password模块栈也必须被调用。

最后执行`session`类型模块（打包在`common‑session`文件内），依据当前用户的设置配置会话。

> 
> 示例2.5：session段的默认配置（`common‑session`）

```
session    required pam_limits.so
session    required pam_unix.so try_first_pass
session    optional pam_umask.so
session    optional pam_systemd.so
session    optional pam_gnome_keyring.so auto_start only_if=gdm,gdm‑password,lxdm,lightdm
session    optional pam_env.so
```

`pam_limits`模块读取 `/etc/security/limits.conf` 文件，该文件定义部分系统资源使用限制。再次执行`pam_unix`模块。`pam_umask`模块设置文件创建掩码。由于标记是`optional`，该模块执行失败，不会影响整个session模块栈执行结果。用户注销的时候，session模块会再次被调用。

## 2.4 PAM模块的配置

部分PAM模块支持自定义配置，配置文件存放于 `/etc/security`。本节简要介绍sshd示例中涉及的配置文件——`pam_env.conf` 和 `limits.conf`。

### 2.4.1 pam_env.conf

`pam_env.conf` 用于为用户设置标准化环境变量，当调用`pam_env`模块时生效。使用下面的语法预设环境变量：
`变量名 [DEFAULT=值] [OVERRIDE=值]`

- **VARIABLE（变量名）**：要设置的环境变量名称。
- **[DEFAULT=VALUE]**：管理员设置的默认值。
- **[OVERRIDE=VALUE]**：可被`pam_env`读取并覆盖默认值的值。

典型场景：远程登录时修改`DISPLAY`变量，参见示例2.6。

> 
> 示例2.6：pam_env.conf

```
REMOTEHOST DEFAULT=localhost OVERRIDE=@{PAM_RHOST}
DISPLAY DEFAULT=${REMOTEHOST}:0.0 OVERRIDE=${DISPLAY}
```

第一行设置`REMOTEHOST`变量默认值为`localhost`；当`pam_env`可以获取其他值时则覆盖。`DISPLAY`变量引用`REMOTEHOST`的值。更多说明查看 `/etc/security/pam_env.conf` 文件注释。

### 2.4.2 pam_mount.conf.xml

`pam_mount` 的用途：在登录过程挂载用户家目录，用户注销的时候卸载家目录。适用场景：中央文件服务器保存所有用户家目录。该方式不需要挂载完整的 `/home`，只会挂载即将登录用户的家目录。

安装`pam_mount`后，模板文件`pam_mount.conf.xml`位于 `/etc/security`。参数说明参考手册页 `man 5 pam_mount.conf`。

可以通过 YaST 完成该功能的基础配置：选择「网络设置」→「Windows 域成员身份」→「高级设置」，添加文件服务器。

### 2.4.3 limits.conf

`pam_limits`模块读取`limits.conf`，可以针对用户或者用户组设置系统限制。该文件可以设置**硬限制**（不可突破）与**软限制**（可以临时超出）。语法和选项参见 `/etc/security/limits.conf` 文件注释。

## 2.5 使用pam‑config配置PAM

工具`pam‑config`维护全局PAM配置文件（`/etc/pam.d/common‑*`），同时维护部分应用配置。查看支持模块列表执行命令：

```
pam‑config --list‑modules
```

使用`pam‑config`维护PAM配置文件：添加新模块、删除模块、修改模块参数。修改全局PAM配置文件时，不需要逐个调整各个应用程序的PAM配置。

`pam‑config`典型使用步骤：

1. **自动生成全新unix风格PAM配置**。让pam‑config生成最简基础配置，后续按需扩展。

```
pam‑config --create
```

该命令创建简单的Unix身份认证配置。原本不由`pam‑config`维护的配置文件会被覆盖，但是会生成备份，后缀为`*.pam‑config‑backup`。

2. **添加新的身份认证方式**。例如，将SSSD添加到PAM模块栈。

```
pam‑config --add --sss
```

SSSD会被添加到所有`common‑*-pc`PAM配置文件对应的合适位置。

3. **开启调试用于测试**。确认新身份认证流程工作正常，为全部PAM相关操作打开调试。

```
pam‑config --add --sss‑debug
```

SSSD相关PAM调试输出写入systemd日志（参考参考手册第11章journalctl：查询systemd日志）。

4. **查询配置**。正式应用配置之前，检查是否已经包含你想要的全部参数。

```
pam‑config --query -- MODULE
```

该命令输出被查询PAM模块的类型和参数。

5. **关闭调试选项**。确认全部功能正常之后移除调试选项。

```
pam‑config --delete --sss‑debug
```

关闭pam_ssh.so模块调试；如果给别的模块开启过调试，使用类似命令关闭。

更多`pam‑config`命令与选项，参考手册 `man 8 pam‑config`。

## 2.6 手动配置PAM

如果你想要手动创建、维护PAM配置文件，需要对这些文件禁用`pam‑config`管理。

执行 `pam‑config --create` 时，它会创建指向`common‑*‑pc`文件的符号链接。`pam‑config`只会修改`common‑*‑pc`配置文件。删除这些符号链接就会禁用`pam‑config`，因为没有符号链接，`common‑*‑pc`的修改不会生效。

> 
> ⚠️警告：配置务必包含pam_systemd.so
> 如果你完全手动编写PAM配置，必须加入 `session optional pam_systemd.so`。缺少该模块会引发systemd任务限制相关故障。详情查看`man pam_systemd.so`手册。

## 2.7 为本地登录配置U2F密钥

为提升本地登录安全性，你可以使用`pam‑u2f`框架配合YubiKey或者安全密钥实现双因素身份认证。

配置U2F需要两步：把密钥与你的账户进行关联；之后修改系统配置启用该密钥。下面章节描述完整流程。

### 2.7.1 将U2F密钥关联至你的账户

将U2F密钥绑定账户，操作步骤：

1. 登录本机系统。
2. 插入你的U2F密钥。
3. 创建U2F密钥配置目录：

```
sudo mkdir -p ~/.config/Yubico
```

4. 执行`pamu2fcfg`输出配置行：

```
sudo pamu2fcfg > ~/.config/Yubico/u2f_keys
```

5. 设备指示灯闪烁时，触碰金属触点确认绑定。

建议准备备用U2F设备，配置备用密钥执行下面命令：

1. 执行：

```
sudo pamu2fcfg -n >> ~/.config/Yubico/u2f_keys
```

2. 设备闪烁，触碰金属触点确认绑定。

可以将配置文件从默认家目录路径迁移到需要sudo权限修改的目录，提升安全性，例如移动到 `/etc`：

1. 在/etc创建目录：

```
sudo mkdir /etc/Yubico
```

2. 移动配置文件：

```
sudo mv ~/.config/Yubico/u2f_keys /etc/Yubico/u2f_keys
```

> 
> 注意：u2f_keys放置在非默认路径
> 如果将u2f_keys移到非默认路径（`$HOME/.config/Yubico/u2f_keys`），你需要在 `/etc/pam.d/login` 配置文件使用`authfile`参数，详见2.7.2节 更新PAM配置。

### 2.7.2 更新PAM配置

创建U2F密钥配置文件之后，修改系统PAM配置。

1. 编辑 `/etc/pam.d/login`。
2. 添加一行 `auth required pam_u2f.so`，示例如下：

```
#%PAM‑1.0
auth       include      common‑auth
auth       required     pam_u2f.so
account    include      common‑account
password   include      common‑password
session    optional     pam_keyinit.so revoke
session    include      common‑session
#session optional pam_xauth.so
```

3. 如果`u2f_keys`不在默认路径，在`/etc/pam.d/login`使用`authfile`选项指定绝对路径：

```
#%PAM‑1.0
auth       requisite    pam_nologin.so
auth       include      common‑auth
auth       required     pam_u2f.so authfile=<u2f_keys的绝对路径>
```

## 2.8 更多参考信息

安装`pam‑doc`软件包后，在目录 `/usr/share/doc/packages/pam` 可以获取更多文档：

- **README文档**
该目录顶层下的`modules`子目录存放各个可用PAM模块的说明文档。
- **Linux‑PAM系统管理员指南**
涵盖PAM全部内容：配置文件语法、安全考量。
- **Linux‑PAM模块开发者手册**
面向开发人员，介绍编写符合规范PAM模块相关内容。
- **Linux‑PAM应用开发者指南**
面向应用开发人员，讲解如何调用PAM库。
- **PAM手册页**
PAM本身和各个独立模块的man手册，提供功能概览。


# 第3章 使用NIS
当网络中的多套Unix系统需要访问公共资源时，就必须保证网络内所有机器上的用户与用户组标识保持完全一致。对用户来说，网络应当是透明的：无论登录到哪一台机器，自身的操作环境都不应发生变化。借助NIS与NFS服务就可以实现该目标。

NIS（网络信息服务，Network Information Service）可以视作一种类数据库服务，能够在网络中分发 `/etc/passwd`、`/etc/shadow`、`/etc/group` 的内容。NIS也可用于其他用途（例如，让 `/etc/hosts`、`/etc/services` 这类文件的内容在网络内可用），但这超出了本章介绍的范畴。人们常把NIS称作YP，因为它的工作机制就如同网络中的“黄页”。

## 3.1 配置NIS服务器
要在网络中分发NIS信息，可以部署一台服务器充当主服务器（master）为全部客户端提供服务；也可以部署NIS从服务器（slave server），从主服务器获取信息，再转发给各自的客户端。

如果仅需要配置网络中的一台NIS服务器，请参阅3.1.1节「配置NIS主服务器」。

如果你的NIS主服务器需要把数据导出给其他子网内的NIS从服务器，请先按照3.1.1节「配置NIS主服务器」配置主服务器，再按照3.1.2节「配置NIS从服务器」配置从服务器。

### 3.1.1 配置NIS主服务器
若要使用YaST管理NIS服务器功能，请以root身份执行以下命令安装软件包 `yast2‑nis‑server`：
```bash
zypper in yast2‑nis‑server
```

按照下面的步骤配置网络中的一台NIS主服务器：
1. 启动 YaST → 网络服务 → NIS服务器。



> 图3.1：NIS服务器设置
2. 如果你的网络只需要一台NIS服务器，或者该服务器要充当其他NIS从服务器的主服务器，请选择**安装并设置NIS主服务器（Install and set up an NIS Master Server）**。YaST会自动安装所需软件包。

> 提示：已安装NIS服务器软件
> 如果本机已经安装了NIS服务器软件，点击**创建NIS主服务器（Create NIS Master Server）**即可开始创建NIS主服务器。

3. 配置NIS基础选项：



> 图3.2：主服务器设置

a. 输入NIS域名。
b. 勾选**本机同时作为NIS客户端（This Host is also a NIS Client）**，决定本机是否同时作为NIS客户端，允许用户登录并访问来自NIS服务器的数据。
c. 如果本服务器需要向其他子网中的NIS从服务器提供服务，请勾选**存在活跃的NIS从服务器（Active Slave NIS Server Exists）**。

> 选项「快速映射分发（Fast Map Distribution）」仅在勾选「存在活跃的NIS从服务器」时生效。该选项可以加快向从服务器传输映射数据库的速度。

d. 勾选**允许修改密码（Allow Changes to Passwords）**，允许网络中的用户（包括本地用户以及NIS服务器管理的用户）通过命令 `yppasswd` 在NIS服务器上修改密码。该选项启用后，「允许修改GECOS字段（Allow Changes to GECOS Field）」与「允许修改登录Shell（Allow Changes to Login Shell）」选项才可用。“GECOS”字段允许用户通过命令 `ypchfn` 修改自己的姓名与地址信息；“Shell”允许用户使用命令 `ypchsh` 修改默认登录Shell（例如从Bash切换至sh）。所设置的新Shell必须是 `/etc/shells` 中预先定义好的条目之一。

e. 勾选**在防火墙中开放端口（Open Port in Firewall）**，让YaST自动适配NIS服务器的防火墙配置。

f. 点击「下一步」离开该对话框，或者点击**其他全局设置（Other global settings）**进行更多配置。其他全局设置包括修改NIS服务器的源目录（默认为 `/etc`）。同时可以在这里设置密码合并。该选项应当设置为Yes，用于从系统认证文件 `/etc/passwd`、`/etc/shadow`、`/etc/group` 创建用户数据库。另外还需要设置NIS向外提供服务的最小用户ID与组ID。点击「确定」保存配置，返回上一级界面。



> 图3.3：修改NIS服务器目录与同步文件

4. 如果之前勾选了「存在活跃的NIS从服务器」，请输入用作从服务器的主机名，点击下一步。如果不存在从服务器，则跳过该配置步骤。
5. 进入数据库配置对话框，指定NIS服务器映射（NIS Server Maps），也就是NIS服务器要传输给客户端的部分数据库。默认设置已经可以满足绝大多数场景，点击「下一步」继续。



> 图3.4：NIS服务器映射设置

6. 确认需要启用的映射条目，点击「下一步」继续。
7. 设置允许向NIS服务器发起查询的主机。你可以点击对应按钮新增、编辑或者删除主机。指定哪些网络可以向NIS服务器发送请求。通常填写内网网段。示例配置包含下面两条：
```
255.0.0.0 127.0.0.0
0.0.0.0 0.0.0.0
```
第一条允许本机（NIS服务器自身）访问；第二条允许所有主机向服务器发起请求。



> 图3.5：设置NIS服务器查询权限

8. 点击「完成」保存配置，退出设置向导。

### 3.1.2 配置NIS从服务器
要在你的网络中配置额外的NIS从服务器，请执行以下步骤：
1. 启动 YaST → 网络服务 → NIS服务器。
2. 选择**安装并设置NIS从服务器（Install and Set Up NIS Slave Server）**，点击「下一步」。

> 提示
> 如果本机已经安装NIS服务器软件，点击**创建NIS从服务器（Create NIS Slave Server）**即可。

3. 完成NIS从服务器基础配置：
a. 输入NIS域名。
b. 输入NIS主服务器的主机名或者IP地址。
c. 勾选**本机同时作为NIS客户端（This Host is also a NIS Client）**，允许用户在这台服务器上登录。
d. 勾选**在防火墙中开放端口（Open Ports in Firewall）**适配防火墙设置。
e. 点击「下一步」。
4. 设置允许向NIS从服务器发起查询的主机。你可以新增、编辑或者删除主机条目。指定所有允许发送请求的网络。如果允许全部网络访问，使用如下配置：
```
255.0.0.0 127.0.0.0
0.0.0.0 0.0.0.0
```
第一条允许NIS服务器本机访问；第二条允许同一网络内所有主机发起请求。
5. 点击「完成」保存修改并退出配置。

## 3.2 配置NIS客户端
工作站若要使用NIS，请执行下面操作：
1. 启动 YaST → 网络服务 → NIS客户端。
2. 勾选**使用NIS（Use NIS）**。
3. 填写NIS域名。该域名由管理员分配，也可以是DHCP分配的静态外部IP地址。关于DHCP，请参阅参考手册第20章《DHCP》。



> 图3.6：设置NIS服务器域名与地址

4. 填写NIS服务器地址，多个服务器地址使用空格隔开。如果你不清楚NIS服务器地址，点击「查找（Find）」，让YaST在当前域内搜索NIS服务器。根据局域网规模，该操作可能耗时较长。「广播（Broadcast）」选项：当填写的服务器全部无响应之后，在本地网络广播查找NIS服务器。
5. 根据本地部署情况，可以勾选**启动自动挂载器（Start Automounter）**。勾选后如需要会自动安装相关软件包。
6. 如果不希望其他主机查询本机正在使用哪台NIS服务器，请进入**高级设置（Expert settings）**，取消勾选**应答远程主机（Answer Remote Hosts）**。勾选「旧版服务器（Broken Server）」，允许客户端接收来自非特权端口服务器的响应。更多信息参见 `man ypbind`。
7. 点击「完成」保存配置，回到YaST控制面板。至此，你的客户端已经完成NIS配置。。

# 第4章 使用YaST设置身份认证客户端
Kerberos 用于身份认证，LDAP 用于授权与身份识别。二者可以协同工作。关于 LDAP，请参阅第5章《使用389 Directory Server的LDAP》；关于 Kerberos，请参阅第6章《网络身份认证之Kerberos》。

## 4.1 使用YaST配置身份认证客户端
YaST 提供多个模块，可用于设置客户端身份认证：

**用户登录管理（User logon management）**
同时使用身份服务（通常为LDAP）和用户身份认证服务（通常为Kerberos）。该模块基于SSSD实现，绝大多数场景下最适合加入Active Directory域。
该模块的说明参见7.3.2节《使用用户登录管理加入Active Directory》。

**Windows域成员身份（Windows domain membership）**
加入Active Directory（会用到Kerberos与LDAP）。该模块基于winbind实现，如果需要支持NTLM或者跨林信任，该方案最适合加入Active Directory域。
该模块的说明参见7.3.3节《使用Windows域成员身份加入Active Directory》。

## 4.2 SSSD
YaST 的两个模块基于 SSSD：**用户登录管理**以及 **LDAP和Kerberos身份认证**。

SSSD 全称 System Security Services Daemon（系统安全服务守护进程）。SSSD 与提供用户数据的远程目录服务通信，提供 LDAP、Kerberos、Active Directory（AD）等身份认证方式。它同时提供 NSS（名称服务交换）接口以及 PAM（可插拔认证模块）接口。

SSSD 可以在本地缓存用户数据，即便真实的目录服务暂时不可用，用户依旧可以使用这份数据完成操作。

### 4.2.1 检查运行状态
运行任意一个 YaST 身份认证模块之后，可以使用下面命令检查 SSSD 是否正在运行：
```bash
# systemctl status sssd
sssd.service - System Security Services Daemon
Loaded: loaded (/usr/lib/systemd/system/sssd.service; enabled)
Active: active (running) since Thu 2015‑10‑23 11:03:43 CEST; 5s ago
[...]
```

### 4.2.2 缓存
为了在后端身份服务不可用时依旧允许用户登录，即便缓存已经失效，SSSD仍然会使用缓存内容，直到后端服务恢复可用。

使缓存失效，执行：
```bash
sss_cache -E
```
> 注：`sss_cache` 属于软件包 `sssd‑tools`。

完整删除 SSSD 缓存，执行：
```bash
> sudo systemctl stop sssd
> sudo rm -f /var/lib/sss/db/*
> sudo systemctl start sssd
```

# 第5章 使用389 Directory Server实现LDAP

轻量目录访问协议（LDAP）是一套用于访问和维护信息目录的协议。LDAP可用于用户与用户组管理、系统配置管理、地址管理等任务。在openSUSE Leap 15.6中，LDAP服务由**389 Directory Server**提供，替代了原有的OpenLDAP。

理想情况下，一台中央服务器将数据存储在目录中，通过一套定义完善的协议分发给全部客户端。这种结构化数据可供大量应用程序访问。集中存储的方式能够降低管理开销。使用LDAP这类开放标准化协议，能够让尽可能多的客户端应用访问这些信息。

这里所说的目录，是一类针对快速高效读取与搜索做了优化的数据库。目录中存储的数据通常生命周期长、变更不频繁。因此LDAP服务针对高并发读取做性能优化；而传统数据库则针对短时间内处理大量写入操作做优化。

## 5.1 LDAP目录树的结构

本节介绍LDAP目录树的布局，讲解相关基础术语。如果你已经熟悉LDAP，请直接跳转至5.3.1节「新建389 Directory Server实例」。

LDAP目录采用树形结构。目录里的全部条目（称作对象）在这套层级结构中都拥有确定位置。这套层级叫做**目录信息树（DIT，Directory Information Tree）**。指向目标条目、能够唯一标识该条目的完整路径，叫做**可分辨名称（DN，distinguished name）**。树中的对象由**相对可分辨名称（RDN，relative distinguished name）**标识。可分辨名称由通往该条目的所有条目的RDN拼接而成。

LDAP目录树内部的关系可以参考下图示例。

（图5.1：LDAP目录结构）
该示意图为一套虚构的目录信息树，展示三层条目。每个条目对应图中一个方框。虚构员工Geeko Linux的完整有效可分辨名称为：
`cn=Geeko Linux,ou=doc,dc=example,dc=com`
它由RDN `cn=Geeko Linux`，拼接上级条目 `ou=doc,dc=example,dc=com` 的DN组合而成。

DIT中可以存储的对象类型，由**模式（Schema）**全局定义。对象的类型由**对象类（object class）**决定。对象类规定该对象必须具备、可以具备哪些属性。模式包含所有可供LDAP服务器使用的对象类与属性。属性属于结构化数据类型；其语法、排序规则以及其他行为均由模式定义。LDAP服务器自带一套核心模式，适用于绝大多数业务场景。如果需要自定义模式，可以将自定义模式上传到LDAP服务器。

表5.1「常用对象类与属性」，展示来自`00core.ldif`与`06inetorgperson.ldif`的部分对象类，包含必填属性（Req. Attr.）与合法属性取值。安装完389 Directory Server之后，这些模式文件存放在 `/usr/share/dirsrv/schema`。

> 
> 示例5.1：取自CN=schema的片段

```
attributetype (1.2.840.113556.1.2.102 NAME 'memberOf'
DESC 'Group that the entry belongs to'
SYNTAX 1.3.6.1.4.1.1466.115.121.1.12
X‑ORIGIN 'Netscape Delegated Administrator')

objectclass (2.16.840.1.113730.3.2.333 NAME 'nsPerson'
DESC 'A representation of a person in a directory server'
SUP top STRUCTURAL
MUST ( displayName $ cn )
MAY ( userPassword $ seeAlso $ description $ legalName $ mail \
$ preferredLanguage )
X‑ORIGIN '389 Directory Server Project'
```

- 属性类型定义：属性的名称、唯一对象标识符（OID，数字格式），属性缩写。
- DESC：简短描述属性；同时会提及该定义所依据的对应RFC文档。
- SYNTAX：该属性存储的数据类型。本例中为大小写不敏感的目录字符串。
- X‑ORIGIN：模式元素的来源（例如项目名称）。
- 对象类`nsPerson`的定义以OID与对象名称开头。
- DESC：对象类简短描述。
- `SUP top`：代表该对象类不从其他对象类继承。
- `MUST`：列出使用该对象类时**必须提供**的全部属性。
- `MAY`：列出该对象类允许使用的**可选属性**。

## 5.2 为389 Directory Server创建与管理Docker容器

> 
> 注意：本节为可选内容；如果你使用物理部署的389 Directory Server实例，请跳过本节阅读后续章节。本节讲解把389 Directory Server部署为Docker容器的场景。

拉取最新389 Directory Server镜像：

```
docker pull 389ds/dirsrv:latest
```

新建数据卷：

```
docker volume create VOLUME
```

创建具备基础配置的容器：

```
docker create \
‑u USERNAME \
‑e SUFFIX_NAME="dc=example,dc=com" \
‑e DS_DM_PASSWORD=PASSWORD \
‑m 1024M \
‑p 3389:3389 ‑p 3636:3636 \
‑v VOLUME:/data \
‑‑name INSTANCE \
389ds/dirsrv:latest
```

启动389 Directory Server的Docker容器：

```
docker start INSTANCE
```

在运行中的389 Directory Server容器内执行命令：
前提：容器主进程PID 1正常运行。语法：

```
sudo docker exec ‑u USERNAME ‑i ‑t INSTANCE COMMAND
```

> 
> 注意：COMMAND必须是容器内部可执行程序。
> 如果要执行多条命令或者带引号的命令，先在容器内部启动shell会话：

```
> sudo docker exec ‑u USERNAME ‑i ‑t INSTANCE sh ‑c "COMMAND"
```

停止Docker容器：

```
docker stop INSTANCE
```

删除Docker容器：

```
docker rm INSTANCE
```

## 5.3 安装389 Directory Server

执行下面命令安装389 Directory Server：

```
> sudo zypper install 389‑ds
```

安装完成后，参考5.3.1节「新建389 Directory Server实例」部署服务器。

### 5.3.1 新建389 Directory Server实例

使用`dscreate`命令创建新的389 Directory Server实例；使用`dsctl`命令干净地删除实例。

有两种方式配置创建实例：使用自定义配置文件，或者使用自动生成的模板文件。测试环境可以直接使用自动生成模板；生产环境务必仔细审阅模板并按需修改。

部署完成后配置管理员凭据、管理用户与用户组、配置身份识别服务。

389 Directory Server主要由三条命令管控：

1. **dsctl**：管理本地实例，需要root权限。需要连接运行目录服务器实例的终端。用于启动、停止、数据库备份等操作。
2. **dsconf**：服务器配置的主要管理工具。通过外部接口管理实例配置，可以远程修改实例配置。
3. **dsidm**：身份管理（用户、用户组、密码等管理）。访问控制列表决定权限；例如用户可以重置自身密码、修改账号信息。

下面流程搭建一套简易测试开发实例，内置少量示例条目。

1. 使用自定义配置文件创建389 Directory Server实例
2. 使用模板创建389 Directory Server实例
3. 配置本地管理管理员凭据
4. 管理LDAP用户与用户组
5. 使用SSSD管理LDAP身份认证
6. 管理插件
7. 导入TLS服务器证书与密钥

### 5.3.2 使用自定义配置文件创建389 Directory Server实例

你可以编写简单自定义INF格式配置文件创建实例，文件名可自定义。
默认实例名称为`localhost`；实例名称创建完成后不可修改。建议自定义实例名，避免混淆，便于排错。下面示例使用实例名`LDAP1`，后缀`suffix`为`dc=LDAP1,dc=COM`。

> 
> 示例5.2：最小化389 Directory Server实例配置文件 LDAP1.inf

```
# LDAP1.inf
[general]
config_version = 2

[slapd]
root_password = PASSWORD
self_sign_cert = True
instance_name = LDAP1

[backend‑userroot]
sample_entries = yes
suffix = dc=LDAP1,dc=COM
```

1. 该行必不可少，代表这是版本2的setup INF配置文件。
2. 为`cn=Directory Manager` ldap用户设置高强度root密码，该用户用于绑定连接目录。
3. 在 `/etc/dirsrv/slapd‑LDAP1` 生成本地自签名服务器证书。
4. 向新实例填充示例用户、用户组条目。

将示例文件`LDAP1.inf`复制到家目录，执行命令创建实例：

```
> sudo dscreate ‑v from‑file LDAP1.inf | \
tee LDAP1‑OUTPUT.txt
```

该命令打印实例创建全过程日志，同时把日志保存到`LDAP1‑OUTPUT.txt`，约一分钟完成LDAP服务部署。不需要保存日志可以删掉 `| tee LDAP1‑OUTPUT.txt`。

如果`dscreate`报错，日志会给出原因。修正问题之后，删除实例再重新创建。

安装成功输出：`Completed installation for LDAP1`。检查实例状态：

```
> sudo dsctl LDAP1 status
Instance "LDAP1" is running
```

删除实例命令。第一条为演练模式，不会实际删除；确认无误添加`‑‑do‑it`真正删除实例。

```
sudo dsctl LDAP1 remove
Not removing: if you are sure, add ‑‑do‑it

> sudo dsctl LDAP1 remove ‑‑do‑it
```

该命令可以清理部分安装失败或者损坏的实例。

忘记实例名称，列出全部实例：

```
> sudo dsctl ‑l
slapd‑LDAP1
```

### 5.3.3 使用模板创建389 Directory Server实例

使用`dscreate`自动生成实例模板，测试环境可以直接使用模板；生产环境需要审阅并修改参数。模板内参数均带有注释，被分号`;`注释。需要修改时去掉分号填入值。

将模板打印输出到标准输出：

```
sudo dscreate create‑template
```

输出保存为文件（例如`TEMPLATE.txt`）：

```
> sudo dscreate create‑template TEMPLATE.txt
```

模板片段示例：

```
# full_machine_name (str)
# Description: Sets the fully qualified hostname (FQDN) of this system. When
# installing this instance with GSSAPI authentication behind a load balancer, set
# this parameter to the FQDN of the load balancer and, additionally, set
# "strict_host_checking" to "false".
# Default value: ldapserver1.test.net
;full_machine_name = ldapserver1.test.net

# selinux (bool)
# Description: Enables SELinux detection and integration during the installation
# of this instance. If set to "True", dscreate auto‑detects whether SELinux is
# enabled. Set this parameter only to "False" in a development environment.
# Default value: True
;selinux = True
```

部分参数会自动读取本机现有环境，例如系统完全限定主机名FQDN。

直接使用模板文件创建实例：

```
> sudo dscreate from‑file TEMPLATE.txt
```

创建名为`localhost`实例，创建完毕自动启动。

```
sudo dsctl localhost status
Instance "localhost" is running
```

实例创建后名称**不能修改**，强烈建议自定义实例名。取消注释`;instance_name = localhost`，修改为你需要的名字（示例`LDAP1`）。
也可以开启示例用户组：取消注释`;sample_entries = no`，修改为`sample_entries = yes`。
设置管理员密码：取消注释`;root_password`填入自定义密码。
必须配置`suffix`后缀，例如：
`suffix = dc=LDAP1,dc=COM`。

删除实例：

```
> sudo dsctl LDAP1 remove ‑‑do‑it
```

### 5.3.4 启停389 Directory Server

下面示例使用实例名`LDAP1`。使用systemd管理实例。

查看实例完整状态：

```
> systemctl status ‑‑no‑pager ‑‑full dirsrv@LDAP1.service
● dirsrv@LDAP1.service ‑ 389 Directory Server LDAP1.
Loaded: loaded (/usr/lib/systemd/system/dirsrv@.service; enabled; vendor preset: disabled)
Active: active (running) since Thu 2021‑03‑11 08:55:28 PST; 2h 7min ago
Process: 4451 ExecStartPre=/usr/lib/dirsrv/ds_systemd_ask_password_acl /etc/dirsrv/slapd‑LDAP1/dse.ldif (code=exited, status=0/SUCCESS)
Main PID: 4456 (ns‑slapd)
Status: "slapd started: Ready to process requests"
Tasks: 26
CGroup: /system.slice/system‑dirsrv.slice/dirsrv@LDAP1.service
└─4456 /usr/sbin/ns‑slapd ‑D /etc/dirsrv/slapd‑LDAP1 ‑i /run/dirsrv/slapd‑LDAP1.pid
```

启动、停止、重启LDAP服务：

```
> sudo systemctl start dirsrv@LDAP1.service
> sudo systemctl stop dirsrv@LDAP1.service
> sudo systemctl restart dirsrv@LDAP1.service
```

dsctl同样可以启停实例：

```
> sudo dsctl LDAP1 status
> sudo dsctl LDAP1 stop
> sudo dsctl LDAP1 restart
> sudo dsctl LDAP1 start
```

### 5.3.5 配置本地管理管理员凭据

在`/root`目录创建`.dsrc`配置文件，root与sudo用户执行管理命令时，无需每次输入连接参数。示例实例`LDAP1`，后缀`dc=LDAP1,dc=COM`。

> 
> 示例5.3：用于本地管理的 .dsrc 文件

```
# /root/.dsrc file for administering the LDAP1 instance
[LDAP1]
uri = ldapi://%%2fvar%%2frun%%2fslapd‑LDAP1.socket
basedn = dc=LDAP1,dc=COM
binddn = cn=Directory Manager
```

1. 必须填写你的实例确切名称。
2. ldapi协议会检测尝试登录用户UID/GID；UID/GID为0/0或者dirsrv:dirsrv时，自动绑定为目录服务器root dn `cn=Directory Manager`。
3. URI中的斜杠转义为`%%2f`；本例实际路径 `/var/run/slapd‑LDAP1.socket`。

创建完`/root/.dsrc`之后，可以执行管理命令，例如新建用户，参见5.6节「管理LDAP用户和用户组」。

> 
> 重要：sudoers.ldap中新取反语法特性
> sudo版本低于1.9.9时，在`sudoers.ldap`中，针对`sudoUser`、`sudoRunAsUser`、`sudoRunAsGroup`属性的取反语法不生效。

```
# 不会匹配除joe之外所有人，实际不会匹配任何人
sudoUser: !joe
# 不会匹配除joe之外所有人，实际会匹配所有人（包含joe）
sudoUser: ALL
sudoUser: !joe
```

sudo 1.9.9及更高版本才支持`sudoUser`属性的取反。参考手册`man 5 sudoers.ldap`。

## 5.4 防火墙配置

389 Directory Server默认TCP端口：**389**（非加密连接、STARTTLS），**636**（TLS加密LDAPS）。

openSUSE Leap默认防火墙后端为firewalld。执行命令启用ldap、ldaps服务：

```
> sudo firewall‑cmd ‑‑add‑service=ldap ‑‑zone=internal
> sudo firewall‑cmd ‑‑add‑service=ldaps ‑‑zone=internal
> sudo firewall‑cmd ‑‑runtime‑to‑permanent
```

根据服务器实际场景替换zone参数。TLS证书导入见5.10节；firewalld基础见23.3节。

## 5.5 389 Directory Server备份与恢复

389 Directory Server支持离线备份与在线备份。
`dsctl`执行离线数据库备份；`dsconf`执行在线数据库备份。同时备份LDAP服务器配置目录，重大故障时完成完整恢复。

### 5.5.1 备份LDAP服务器配置

LDAP服务器配置存放在目录 `/etc/dirsrv/slapd‑INSTANCE_NAME`，包含证书、密钥与`dse.ldif`。使用tar压缩备份：

```
> sudo tar caf \
config_slapd‑INSTANCE_NAME‑$(date +%Y‑%m‑%d_%H‑%M‑%S).tar.gz \
/etc/dirsrv/slapd‑INSTANCE_NAME/
```

> 
> 小提示：tar输出`Removing leading '/' from member names`属于无害提示信息。

恢复旧配置：
1.（可选）备份当前原有配置：

```
> sudo mv /etc/dirsrv/slapd‑INSTANCE_NAME/ /etc/dirsrv/slapd‑INSTANCE_NAME.old
```

2. 解压备份归档：

```
> sudo tar ‑xvzf \
config_slapd‑INSTANCE_NAME‑DATE.tar.gz
```

3. 将文件复制回 `/etc/dirsrv/slapd‑INSTANCE_NAME`：

```
> sudo cp ‑r etc/dirsrv/slapd‑INSTANCE_NAME \
/etc/dirsrv/slapd‑INSTANCE_NAME
```

### 5.5.2 LDAP数据库离线备份与恢复

使用dsctl执行离线备份，需要停止服务器：

```
> sudo dsctl INSTANCE_NAME stop
Instance "INSTANCE_NAME" has been stopped
```

执行备份，备份文件生成路径 `/var/lib/dirsrv/slapd‑INSTANCE_NAME/bak/INSTANCE_NAME‑DATE`

```
> sudo dsctl INSTANCE_NAME db2bak
db2bak successful
```

示例实例ldap1：`/var/lib/dirsrv/slapd‑ldap1/bak/ldap1‑2021_10_25_13_03_17`

从该备份目录恢复数据库：

```
> sudo dsctl INSTANCE_NAME bak2db \
/var/lib/dirsrv/slapd‑INSTANCE_NAME/bak/INSTANCE_NAME‑DATE/
bak2db successful
```

恢复完成启动服务器：

```
sudo dsctl INSTANCE_NAME start
Instance "INSTANCE_NAME" has been started
```

也可以导出LDIF格式备份：

```
sudo dsctl INSTANCE_NAME db2ldif ‑‑replication userRoot
ldiffile: /var/lib/dirsrv/slapd‑INSTANCE_NAME/ldif/INSTANCE_NAME‑userRoot‑DATE.ldif
db2ldif successful
```

从LDIF备份恢复：

```
> sudo dsctl ldif2db userRoot \
/var/lib/dirsrv/slapd‑INSTANCE_NAME/ldif/INSTANCE_NAME‑userRoot‑DATE.ldif
> sudo dsctl INSTANCE_NAME start
```

### 5.5.3 LDAP数据库在线备份与恢复

使用dsconf执行在线备份，服务器无需停机：

```
> sudo dsconf INSTANCE_NAME backup create
The backup create task has finished successfully
```

备份路径 `/var/lib/dirsrv/slapd‑INSTANCE_NAME/bak/INSTANCE_NAME‑DATE`

在线备份恢复：

```
> sudo dsconf INSTANCE_NAME backup restore \
/var/lib/dirsrv/slapd‑INSTANCE_NAME/bak/INSTANCE_NAME‑DATE
```

## 5.6 管理LDAP用户与用户组

使用`dsidm`命令新建、删除、管理用户与用户组。示例使用实例`LDAP1`，操作时替换为你的实例名。

### 5.6.1 查询已有LDAP用户、用户组

列出全部用户：

```
> sudo dsidm LDAP1 user list
```

列出全部用户组：

```
> sudo dsidm LDAP1 group list
```

查看单个用户完整信息：

```
> sudo dsidm LDAP1 user get USER
```

查看单个用户组完整信息：

```
sudo dsidm LDAP1 group get GROUP
```

查看用户组成员列表：

```
> sudo dsidm LDAP1 group members GROUP
```

### 5.6.2 创建用户与管理密码

下面示例新建用户wilber；实例`LDAP1`，后缀`dc=LDAP1,dc=COM`。

> 
> 流程5.1：创建LDAP用户

1. 创建用户wilber Fox

```
> sudo dsidm LDAP1 user create ‑‑uid wilber \
‑‑cn wilber ‑‑displayName 'Wilber Fox' ‑‑uidNumber 1001 ‑‑gidNumber 101 \
‑‑homeDirectory /home/wilber
```

2. 查询新用户的DN（全局唯一完全限定对象名）

```
> sudo dsidm LDAP1 user get wilber
dn: uid=wilber,ou=people,dc=LDAP1,dc=COM
[...]
```

修改密码需要使用该DN。

3. 设置用户wilber密码
a.

```
> sudo dsidm LDAP1 account reset_password \
uid=wilber,ou=people,dc=LDAP1,dc=COM
```

b. 输入两遍新密码。成功输出提示：
`reset password for uid=wilber,ou=people,dc=LDAP1,dc=COM`
修改已有用户密码同样使用该命令。

4. 验证密码有效性：

```
> ldapwhoami ‑D uid=wilber,ou=people,dc=LDAP1,dc=COM ‑W
Enter LDAP Password: PASSWORD
dn: uid=wilber,ou=people,dc=LDAP1,dc=COM
```

### 5.6.3 创建与管理用户组

创建用户之后，新建用户组，把用户加入组。示例实例LDAP1，后缀dc=LDAP1,dc=COM。

> 
> 流程5.2：创建LDAP用户组并添加用户

1. 创建用户组：

```
> sudo dsidm LDAP1 group create
```

提示输入cn值，输入组名`SERVER_ADMINS`。

2. 将wilber用户加入SERVER_ADMINS组：

```
> sudo dsidm LDAP1 group add_member SERVER_ADMINS \
uid=wilber,ou=people,dc=LDAP1,dc=COM
added member: uid=wilber,ou=people,dc=LDAP1,dc=COM
```

### 5.6.4 删除用户、用户组；从组中移除用户

将wilber从SERVER_ADMINS组移除：

```
> sudo dsidm LDAP1 group remove_member SERVER_ADMINS \
uid=wilber,ou=people,dc=LDAP1,dc=COM
```

删除用户：

```
> sudo dsidm LDAP1 user delete \
uid=wilber,ou=people,dc=LDAP1,dc=COM
```

删除用户组：

```
> sudo dsidm LDAP1 group delete SERVER_ADMINS
```

## 5.7 管理插件

列出全部插件（启用、禁用）；示例服务器主机名LDAPSERVER1：

```
> sudo dsconf ‑D "cn=Directory Manager" ldap://LDAPSERVER1 plugin list
Enter password for cn=Directory Manager on ldap://LDAPSERVER1: PASSWORD
7‑bit check
Account Policy Plugin
Account Usability Plugin
ACL Plugin
ACL preoperation
[...]
```

启用MemberOf插件（5.8节SSSD会用到）。MemberOf插件可以一条命令直接返回用户所属全部用户组；不开启该插件客户端要多次查询。

```
> sudo dsconf ‑D "cn=Directory Manager" ldap://LDAPSERVER1 plugin memberof enable
```

> 
> 注意：命令内插件名称为小写，与list展示名称大小写不同。输入错误会提示可选列表：

```
dsconf instance plugin: error: invalid choice: 'MemberOf' (choose from
'memberof', 'automember', 'referential‑integrity', 'root‑dn', 'usn',
'account‑policy', 'attr‑uniq', 'dna', 'linked‑attr', 'managed‑entries',
'pass‑through‑auth', 'retro‑changelog', 'posix‑winsync', 'contentsync', 'list',
'show', 'set')
```

启用插件后，重启服务器实例：

```
> sudo systemctl restart dirsrv@LDAPSERVER1.service
```

配置MemberOf插件，设置搜索范围：

```
sudo dsconf LDAP1 plugin memberOf set ‑‑scope dc=example,dc=com
Successfully changed the cn=MemberOf Plugin,cn=plugins,cn=config
```

> 
> 重要：MemberOf插件启用后，**新创建**的用户、用户组会自动生效；启用插件之前已经存在的旧用户不会自动处理，需要手动修改。
> 修改已有用户suzanne启用memberOf：

```
> sudo dsidm LDAP1 user modify suzanne add:objectclass:nsmemberof
Successfully modified uid=suzanne,ou=people,dc=ldap1,dc=com
```

修改后查询用户信息即可直接看到memberOf属性：

```
> sudo dsidm LDAP1 user get suzanne
dn: uid=suzanne,ou=people,dc=ldap1,dc=com
cn: suzanne
displayName: Suzanne Geeko
gidNumber: 102
homeDirectory: /home/suzanne
memberOf: cn=SERVER_ADMINS,ou=groups,dc=ldap1,dc=com
```

批量为存量旧用户启用memberOf：

```
> sudo dsconf LDAP1 plugin memberof fixup ‑f '(objectClass=*)' dc=LDAP1,dc=COM
```

### 5.7.1 389 Directory Server不支持的插件

- Distributed Numeric Assignment (DNA) 插件
- Managed Entries Plug‑in (MEP)
- Posix Winsync 插件

## 5.8 使用SSSD管理LDAP身份认证

SSSD（System Security Services Daemon）管理远程用户的身份认证、身份识别与访问控制。SSSD充当LDAP服务器与客户端中间层，支持LDAP、Active Directory、Kerberos多种后端；对外提供SSH、PAM、NSS、sudo服务。SSSD本地缓存用户ID与凭据，提升性能；后端LDAP服务不可用时，依旧可以提供身份服务。

> 
> 提示：如果本机运行nscd，建议关闭或卸载。nscd只缓存基础名称服务，会与SSSD发生冲突。

LDAP服务器为provider（服务提供方）；SSSD实例为该服务的客户端。SSSD可以部署在389‑DS服务器本机，也可以部署在独立机器，提升后端故障容灾能力。下面以实例LDAP1演示部署SSSD客户端。

1. 安装sssd与sssd‑ldap软件包：

```
> sudo zypper in sssd sssd‑ldap
```

2. 如果已有`/etc/sssd/sssd.conf`，先备份：

```
> sudo cp /etc/sssd/sssd.conf /etc/sssd/sssd.conf.bak
```

3. 进入/etc/sssd目录，使用dsidm生成sssd.conf客户端配置模板：

```
> sudo cd /etc/sssd
> sudo dsidm LDAP1 client_config sssd.conf
```

4. 审阅生成的配置，根据实际环境修改。一份可用参考示例：

```
[sssd]
services = nss, pam, ssh, sudo
config_file_version = 2
domains = default

[nss]
homedir_substring = /home

[domain/default]
# 如果你的组内成员数量很大（例如50人以上）建议开启True
ignore_group_members = False
debug_level=3
cache_credentials = True

id_provider = ldap
auth_provider = ldap
access_provider = ldap
chpass_provider = ldap

ldap_schema = rfc2307bis
ldap_search_base = dc=example,dc=com
# 强烈建议使用ldaps加密协议
ldap_uri = ldaps://ldap.example.com
ldap_tls_reqcert = demand
ldap_tls_cacert = /etc/openldap/ldap.crt

ldap_access_filter = (|(memberof=cn=<login group>,ou=Groups,dc=example,dc=com))
enumerate = false

access_provider = ldap
ldap_user_member_of = memberof
ldap_user_gecos = cn
ldap_user_uuid = nsUniqueId
ldap_group_uuid = nsUniqueId
ldap_account_expire_policy = rhds
ldap_access_order = filter, expire

# /etc/ssh/sshd_config 需要增加两行
# AuthorizedKeysCommand /usr/bin/sss_ssh_authorizedkeys
# AuthorizedKeysCommandUser nobody
ldap_user_ssh_public_key = nsSshPublicKey
```

> 
> 重要：LDAP访问过滤器依赖MemberOf插件完成配置，见5.7节。

5. 设置文件权限，仅root读写：

```
> sudo chown root:root /etc/sssd/sssd.conf
> sudo chmod 600 /etc/sssd/sssd.conf
```

6. 修改`/etc/nsswitch.conf`，增加sss模块：

```
passwd: compat sss
group: compat sss
shadow: compat sss
```

7. 使用pam-config一次性修改全部PAM公共配置文件：

```
> sudo pam‑config ‑a ‑‑sss
```

8. 校验PAM配置修改结果：

```
> sudo pam‑config ‑q ‑‑sss
auth:
account:
password:
session:
```

9. 从389‑DS服务器复制CA证书到SSSD客户端机器`/etc/openldap/certs`，并执行c_rehash处理证书哈希：

```
> sudo c_rehash /etc/openldap/certs
```

10. 启用并启动sssd服务：

```
> sudo systemctl enable ‑‑now sssd
```

SSSD服务状态管理参见第4章。

### 5.8.1 不支持的密码哈希与身份认证方案

在`dse.ldif`的`nsslapd‑rootpwstoragescheme`、`passwordStorageScheme`，以及账户策略对象的`passwordStorageScheme`配置中，**以下哈希算法不被支持**：

- SHA
- SSHA
- SHA256
- SSHA256
- SHA384
- SSHA384
- SHA512
- SSHA512
- NS‑MTA‑MD5
- clear
- MD5
- SMD5

> 
> 注意：数据库导入LDIF数据时，如果开启`nsslapd‑enable‑upgrade‑hash`（默认为on），导入包含上述旧哈希值的数据是允许的。

## 5.9 从OpenLDAP迁移到389 Directory Server

OpenLDAP已经废弃，被389 Directory Server替代。SUSE在`389‑ds`软件包提供迁移工具`openldap_to_ds`，尽量自动化迁移流程。

> 
> 重要：阅读帮助文档。迁移前务必执行 `openldap_to_ds ‑‑help`，了解工具能力与限制，避免错误预期。

每套LDAP部署环境都不一样，迁移工具无法覆盖全部场景，必要时需要手动干预。**生产环境迁移前，必须完整测试迁移流程**。

### 5.9.1 OpenLDAP迁移测试

OpenLDAP和389 Directory Server之间存在大量差异，迁移需要反复测试与调优。

前置条件：

1. 一套正常运行的389 Directory Server实例
2. OpenLDAP slapd配置文件，或者动态ldif格式配置目录
3. OpenLDAP数据库的ldif备份文件

如果slapd配置不是动态ldif格式，用`slaptest`转换生成`slapd.d`目录：

```
> sudo slaptest ‑f /etc/openldap/slapd.conf ‑F /root/slapd.d
```

生成 `/root/slapd.d/*` 一系列配置文件。

按suffix生成LDIF备份文件，示例后缀`dc=LDAP1,dc=COM`

```
> sudo slapcat ‑f /etc/openldap/slapd.conf ‑b dc=LDAP1,dc=COM \
‑l /root/LDAP1‑COM.ldif
```

执行迁移工具**演练模式（dry‑run，不改动任何数据）**：

```
> sudo openldap_to_ds LDAP1\
/root/slapd.d /root/LDAP1‑COM.ldif
```

输出会列出将要执行的迁移步骤示例：

```
Examining OpenLDAP Configuration ...
Completed OpenLDAP Configuration Parsing.
Examining Ldifs ...
Completed Ldif Metadata Parsing.
The following migration steps will be performed:
* Schema Skip Unsupported Attribute ‑> otherMailbox (0.9.2342.19200300.100.1.22)
* Schema Skip Unsupported Attribute ‑> dSAQuality (0.9.2342.19200300.100.1.49)
* Schema Skip Unsupported Attribute ‑> singleLevelQuality (0.9.2342.19200300.100.1.50)
* Schema Skip Unsupported Attribute ‑> subtreeMinimumQuality (0.9.2342.19200300.100.1.51)
* Schema Skip Unsupported Attribute ‑> subtreeMaximumQuality (0.9.2342.19200300.100.1.52)
* Schema Create Attribute ‑> suseDefaultBase (SUSE.YaST.ModuleConfig.Attr:2)
* Schema Create Attribute ‑> suseNextUniqueId (SUSE.YaST.ModuleConfig.Attr:3)
[...]
* Schema Create ObjectClass ‑> suseDhcpConfiguration (SUSE.YaST.ModuleConfig.OC:10)
* Schema Create ObjectClass ‑> suseMailConfiguration (SUSE.YaST.ModuleConfig.OC:11)
* Database Reindex ‑> dc=example,dc=com
* Database Import Ldif ‑> dc=example,dc=com from example.ldif ‑
excluding entry attributes = [{'structuralobjectclass', 'entrycsn'}]
No actions taken. To apply migration plan, use '‑‑confirm'
```

增加`‑‑confirm`参数正式执行迁移：

```
> sudo openldap_to_ds LDAP1 /root/slapd.d /root/LDAP1‑COM.ldif ‑‑confirm
```

迁移完成后，工具输出一份迁移后待检查任务清单：

```
# Migration complete!
You should now review your instance configuration and data:
* [ ] ‑ Create/Migrate Database Access Controls (ACI)
* [ ] ‑ Enable and Verify TLS (LDAPS) Operation
* [ ] ‑ Schedule Automatic Backups
* [ ] ‑ Verify Accounts Can Bind Correctly
* [ ] ‑ Review Schema Inconistent ObjectClass ‑> pilotOrganization
(0.9.2342.19200300.4.20)
* [ ] ‑ Review Database Imported Content is Correct ‑> dc=ldap1,dc=com
```

> 
> 重要：准备回滚预案。
> 必须设计故障回滚方案：定义迁移成功标准、排查故障点、哪些步骤可以推迟、回滚操作、涉及哪些团队。

生产迁移实操建议：

1. 迁移48小时前，把DNS TTL调小到5分钟，方便快速回滚。
2. 暂停全部数据同步、入站数据任务，迁移期间OpenLDAP数据不再变更。
3. 提前准备全部389‑DS主机。
4. 保存完整测试迁移文档。

### 5.9.2 迁移使用saslauthd的OpenLDAP服务器

OpenLDAP部署中，经常使用`saslauthd`做透传身份认证。组件交互流程：
LDAP客户端 → OpenLDAP服务器 → saslauthd → 外部身份认证。

OpenLDAP开启透传认证条件：

1. 用户的`userPassword`属性格式为 `{SASL}USERNAME@REALM`
2. OpenLDAP编译开启`‑‑enable‑spasswd`选项。

OpenLDAP连接saslauthd配置文件：`/usr/lib/sasl2/slapd.conf`；saslauthd后端模块参数配置在`/etc/sysconfig/saslauthd`，参考`man saslauthd`手册。OpenLDAP官方文档：[https://openldap.org/doc/admin24/security.html#Pass‑Through%20authentication](https://openldap.org/doc/admin24/security.html#Pass%E2%80%91Through%20authentication)

#### 5.9.2.1 将SASL透传认证从OpenLDAP迁移至389 Directory Server

最佳实践步骤：

1. 在原OpenLDAP服务器上确认`saslauthd`工作正常：

```
> sudo testsaslauthd ‑u USERNAME@REALM ‑p PASSWORD
```

REALM把认证路由到saslauthd对应后端，用户名用于身份校验。

2. 安装`pam_saslauthd`软件包，让389‑DS可以对接saslauthd：

```
> sudo zypper install ‑y pam_saslauthd
```

3. 使用`openldap_to_ds`执行迁移，参考5.9.1。

> 
> 迁移工具检测到格式`userPassword: {SASL}USERNAME@REALM`，会把该属性移除，转换为`nsSaslauthId: USERNAME@REALM`，并且自动增加`objectClass: nsSaslauthAccount`对象类。
4. 迁移完成，查看PAM透传认证插件配置状态：

```
> sudo dsconf INSTANCE plugin pam‑pass‑through‑auth show
> sudo dsconf INSTANCE plugin pam‑pass‑through‑auth list
```

迁移成功之后，新的认证链路：
LDAP客户端 → 389‑DS服务器 → pam_saslauthd → saslauthd → 外部身份认证。

#### 5.9.2.2 saslauthd透传认证排错

排错检查清单：

1. 使用`testsaslauthd ‑u USERNAME@REALM`验证saslauthd本身正常。
2. 检查`/etc/sysconfig/saslauthd`后端模块配置。开启调试：`SASLAUTHD_PARAMS="-d"`，日志查看`journalctl`。
3. 验证PAM saslauthd组件正常。可使用第三方工具`pam_tester`（非官方支持）。
4. 确认PAM Pass Through Auth插件已启用：

```
> sudo dsconf INSTANCE plugin pam‑pass‑through‑auth status
> sudo dsconf INSTANCE plugin pam‑pass‑through‑auth enable
```

5. 查看插件配置：

```
sudo dsconf INSTANCE plugin pam‑pass‑through‑auth show
```

6. 查看实例错误日志：`/var/lib/SERVER_USER_NAME/INSTANCE/errors`。

### 5.9.3 迁移规划

OpenLDAP组件自由度很高，没有万能迁移方案。需要评估现有环境：复制拓扑、高可用负载均衡、外部数据同步、Overlay（对应389‑DS插件）、客户端配置、自定义Schema、TLS配置。

规划目标389 Directory Server部署架构。建议OpenLDAP与389‑DS并行部署一段时间，方便切换回旧环境。

> 
> 重要提示：OpenLDAP迁移到389 Directory Server是单向迁移，没有反向迁移路径。

| 功能 | OpenLDAP | 389 Directory Server | 是否兼容 |
| --- | --- | --- | --- |
| 双向复制 | SyncREPL | 389 DS专有复制系统 | 否 |
| MemberOf | Overlay | 插件 | 仅简单配置兼容 |
| 外部认证 | Proxy | ‑ | 否 |
| AD同步 | ‑ | Winsync插件 | 否 |
| 内置Schema | OpenLDAP Schema | 389 Schema | 迁移工具支持兼容 |
| 自定义Schema | OpenLDAP Schema | 389 Schema | 迁移工具支持兼容 |
| LDIF数据库导入 | LDIF | LDIF | 兼容 |
| 密码哈希 | 多种 | 多种 | 除Argon2以外全部支持 |
| OpenLDAP向389‑DS复制 | ‑ | ‑ | 无复制机制 |
| TOTP一次性密码 | TOTP overlay | ‑ | 暂不支持 |
| entryUUID | 属性 | 插件 | 兼容 |

## 5.10 导入TLS服务器证书与密钥

389 Directory Server证书密钥管理工具：`certutil`、`openssl`、`pk12util`。
测试环境可以使用dscreate生成的自签名证书，路径：`/etc/dirsrv/slapd‑INSTANCE‑NAME/ca.crt`。

生产环境强烈建议使用第三方CA（例如Let's Encrypt），申请服务器证书、客户端证书、根证书。

> 
> Mozilla NSS证书库使用**nickname别名**；服务器证书别名固定为`Server‑Cert`。

1. 删除实例中原有的自签名CA与服务器证书：

```
> sudo dsctl INSTANCE_NAME tls remove‑cert Self‑Signed‑CA
> sudo dsctl INSTANCE_NAME tls remove‑cert Server‑Cert
```

2. 导入签发证书的根CA证书（PEM格式）：

```
> sudo dsctl INSTANCE_NAME tls import‑ca \
/path/to/CA/in/PEM/format/CA.pem NICKNAME_FOR_CA
```

3. 导入服务器证书与私钥（PEM）：

```
> sudo dsctl INSTANCE_NAME tls import‑server‑key‑cert \
/path/to/SERVER.pem /path/to/SERVER.key
```

4. 重启实例加载新证书：

```
> sudo systemctl restart dirsrv@INSTANCE‑NAME.service
```

## 5.11 配置复制

389 Directory Server支持多台服务器之间复制数据库内容。复制带来的收益：

- 性能与响应速度提升
- 故障容错、故障转移
- 负载均衡
- 高可用

数据库是复制最小单元：复制对象为完整数据库，**不能复制数据库内部某个子树**；一个数据库对应一个suffix后缀；不能把一个suffix拆分到多个数据库再复制。

角色定义：

- **供应方（supplier）**：向其他副本发送数据
- **消费方（consumer）**：接收来自供应方的数据。
复制总是由供应方发起。一台供应方可以向多台消费方推送。
供应方副本默认可读写；消费方只读；**多供应方（multi‑supplier）模式下双方同时具备读写与消费角色**。

### 5.11.1 异步写入

389‑DS复制属于异步复制，最终一致性模型。

1. 单台服务器上写操作会立刻被接受。
2. 写操作完成，经过延迟之后复制到其他服务器，其他节点才能看到变更。
3. 如果多节点发生写冲突，未来某个时间冲突变更会被回滚。
4. 同一时刻不同服务器的数据视图不完全一致。

LDAP属于低写入场景，大部分日常业务感知不到复制延迟。

### 5.11.2 拓扑设计

设计复制拓扑需要考量：

1. 搭建复制的目的：高可用、多机房、读请求横向扩容，或组合需求。
2. 拓扑中副本（节点）数量。
3. 数据流向（拓扑内部、流入拓扑）。
4. 客户端如何在多节点间做请求分发（多LDAP URI、DNS‑SRV、负载均衡）。

### 5.11.3 复制拓扑示例

支持最多20个供应方副本；实践经验最优效率上限8个供应方节点。

1. **双副本双向供应拓扑**：S1 ↔ S2。两台节点互相供应消费，高可用最简拓扑。客户端可以负载均衡访问。单台故障另一台承担全部业务。适合作为默认拓扑，后续按需扩展。
2. **四供应方副本**四台节点两两互相复制；可以部署两个机房，每机房两台。单机房故障，剩余节点承担全部业务。
3. **六副本拓扑（混合）**
S1、S2双向互为主从；S3↔S4，S5↔S6；S1/S2向S3‑S6推送。S3‑S6可以写入，但是绝大多数复制流量由S1、S2处理，实现多机房高可用。
4. **六副本，只读消费节点**
S1、S2双向互为主从；S3、S4、S5、S6全部只读消费副本。全部写操作发生S1/S2，变更推送到4台只读副本。可以部署DMZ fractional只读副本，只存储部分条目，就算泄露，也无法反向传播变更。

### 5.11.4 术语

- **Replica副本**：挂载数据库的389‑DS实例
- **Read‑write replica读写副本**：完整数据库副本，读写都接受
- **Read‑only replica只读副本**：完整数据库副本，仅接受读
- **Fractional read‑only replica部分只读副本**：存储数据库子集，只读
- **Supplier供应方**：向其他副本输出数据
- **Consumer消费方**：接收来自供应方的数据写入本地数据库
- **Replication agreement复制协定**：服务器上定义与其他副本供应/消费关系的配置
- **Topology拓扑**：复制协定连接起来的全部副本集合
- **Replica ID副本ID**：复制拓扑中每个实例唯一数字标识
- **Replication manager复制管理员账号**：拥有复制权限的账号。

### 5.11.5 配置复制

示例：RW1、RW2两台读写双向副本，RO1只读副本。所有服务器backend需要相同suffix；初始数据仅RW1拥有。

> 
> 警告：复制管理器密码强度至关重要，该账号权限等价于Directory Manager。多节点场景，不同节点密码需要记录维护。配置RW1对外连接协定的时候，要填写RW2的复制管理器密码。

1. 配置RW1

```
> sudo dsconf INSTANCE‑NAME replication create‑manager
> sudo dsconf INSTANCE‑NAME replication enable \
‑‑suffix dc=example,dc=com \
‑‑role supplier ‑‑replica‑id 1 ‑‑bind‑dn "cn=replication manager,cn=config"
```

2. 配置RW2

```
> sudo dsconf INSTANCE‑NAME replication create‑manager
> sudo dsconf INSTANCE‑NAME replication enable \
‑‑suffix dc=example,dc=com \
‑‑role supplier ‑‑replica‑id 2 ‑‑bind‑dn "cn=replication manager,cn=config"
```

> 
> replica‑id两台节点必须不一样；创建复制管理员账号。

3. 创建RW1向RW2输出的复制协定

```
> sudo dsconf INSTANCE‑NAME repl‑agmt create \
‑‑suffix dc=example,dc=com \
‑‑host=RW2 ‑‑port=636 ‑‑conn‑protocol LDAPS ‑‑bind‑dn "cn=replication manager,cn=config"
‑‑bind‑passwd PASSWORD ‑‑bind‑method SIMPLE RW1_to_RW2
```

4. 触发初始化同步reinit，RW2数据重置对齐RW1

```
> sudo dsconf INSTANCE‑NAME repl‑agmt init \
‑‑suffix dc=example,dc=com RW1_to_RW2
```

查看初始化状态：

```
> sudo dsconf INSTANCE‑NAME repl‑agmt init‑status \
‑‑suffix dc=example,dc=com RW1_to_RW2
```

输出`Agreement successfully initialized`代表初始化完成，RW2与RW1数据一致。

5. 创建RW2到RW1的反向协定，实现双向复制：

```
> sudo dsconf INSTANCE‑NAME repl‑agmt create \
‑‑suffix dc=example,dc=com \
‑‑host=RW1 ‑‑port=636 ‑‑conn‑protocol LDAPS \
‑‑bind‑dn "cn=replication manager,cn=config" ‑‑bind‑passwd PASSWORD \
‑‑bind‑method SIMPLE RW2_to_RW1
```

查看复制协定状态：

```
> sudo dsconf INSTANCE‑NAME repl‑agmt status \
‑‑suffix dc=example,dc=com \
‑‑bind‑dn "cn=replication manager,cn=config" \
‑‑bind‑passwd PASSWORD RW2_to_RW1
```

#### 配置只读消费节点RO3

> 
> 警告：复制管理器使用高强度密码。

```
> sudo dsconf INSTANCE_NAME replication create‑manager
> sudo dsconf INSTANCE_NAME \
replication enable ‑‑suffix dc=EXAMPLE,dc=COM \
‑‑role consumer ‑‑bind‑dn "cn=replication manager,cn=config"
```

> 
> consumer角色不需要replica‑id。

在RW1上创建指向RO3的协定：

```
> sudo dsconf INSTANCE_NAME \
repl‑agmt create ‑‑suffix dc=EXAMPLE,dc=COM \
‑‑host=RO3 ‑‑port=636 ‑‑conn‑protocol LDAPS \
‑‑bind‑dn "cn=replication manager,cn=config" ‑‑bind‑passwd PASSWORD
‑‑bind‑method SIMPLE RW1_to_RO3
```

RW2创建指向RO3协定：

```
> sudo dsconf INSTANCE_NAME repl‑agmt create \
‑‑suffix dc=EXAMPLE,dc=COM \
‑‑host=RO3 ‑‑port=636 ‑‑conn‑protocol LDAPS \
‑‑bind‑dn "cn=replication manager,cn=config" ‑‑bind‑passwd PASSWORD \
‑‑bind‑method SIMPLE RW2_to_RO3
```

从RW2初始化RO3：

```
> sudo dsconf INSTANCE_NAME repl‑agmt init
‑‑suffix dc=EXAMPLE,dc=COM RW2_to_RO3
```

### 5.11.6 监控与健康检查

dsconf可以监控本地或者远程副本状态：

```
> sudo dsconf ‑D "cn=Directory Manager" ldap://RW2 replication monitor
> sudo dsconf ‑D "cn=Directory Manager" ldap://RO3 replication monitor
> sudo dsconf ‑D "cn=Directory Manager" ldap://RW1 replication monitor
```

dsctl健康检查：

```
> sudo dsctl INSTANCE_NAME healthcheck ‑‑check replication
> sudo dsctl ‑v INSTANCE_NAME healthcheck ‑‑check replication
> sudo dsctl INSTANCE_NAME healthcheck
> sudo dsctl INSTANCE_NAME healthcheck ‑‑list‑checks
```

单独执行指定检查项：

```
> sudo dsctl INSTANCE_NAME healthcheck \
‑‑check monitor‑disk‑space:disk_space tls:certificate_expiration
```

### 5.11.7 备份

开启复制后备份策略需要调整。使用`db2ldif`必须带上`‑‑replication`参数，保证复制元数据一并备份。**拓扑内全部服务器都要备份**。恢复时，先恢复单台节点，其余全部节点重新初始化。

### 5.11.8 暂停、恢复复制

维护窗口时可以暂停复制。节点离线时间不能超过changelog最大保留时长。

暂停复制协定：

```
> sudo dsconf INSTANCE_NAME repl‑agmt disable \
‑‑suffix dc=EXAMPLE,dc=COM RW2_to_RW1
```

恢复复制协定：

```
> sudo dsconf INSTANCE_NAME repl‑agmt enable \
‑‑suffix dc=EXAMPLE,dc=COM RW2_to_RW1
```

### 5.11.9 changelog max‑age（变更日志最大保存时长）

max‑age定义changelog里面记录的最长存活时间，超过时限旧记录自动清理。
副本离线超过max‑age，再次上线无法同步，**必须执行完全重新初始化**。设置7天示例：

```
> sudo dsconf INSTANCE_NAME \
replication set‑changelog ‑‑max‑age 7d \
‑‑suffix dc=EXAMPLE,dc=COM
```

### 5.11.10 删除副本

1. 隔离节点，阻止新读写请求。
2. 在**所有其他拥有指向该节点复制协定的服务器上，删除复制协定**。
示例删除RW2节点：
在RW1删除向外指向RW2协定：

```
> sudo dsconf INSTANCE_NAME repl‑agmt delete \
‑‑suffix dc=EXAMPLE,dc=COM RW1_to_RW2
```

在RW2删除全部向外协定：

```
> sudo dsconf INSTANCE_NAME repl‑agmt delete \
‑‑suffix dc=EXAMPLE,dc=COM RW2_to_RW1
> sudo dsconf INSTANCE_NAME repl‑agmt delete \
‑‑suffix dc=EXAMPLE,dc=COM RW2_to_RO3
```

停止RW2实例：

```
sudo systemctl stop dirsrv@INSTANCE_NAME.service
```

在RW1执行`cleanallruv`，清理拓扑中的replica‑id=2：

```
> sudo dsconf INSTANCE_NAME repl‑tasks cleanallruv \
‑‑suffix dc=EXAMPLE,dc=COM ‑‑replica‑id 2
> sudo dsconf INSTANCE_NAME repl‑tasks list‑cleanruv‑tasks
```

### 5.11.11 复制能力限制

- 读写供应副本最大8台
- 复制Hub节点最大20台
- 只读消费副本最大100台
- Winsync AD消费副本最多1台读写成员

## 5.12 和Microsoft Active Directory同步

389 Directory Server支持从微软Active Directory同步部分用户与用户组数据。Linux客户端使用389‑DS获取身份信息，不需要客户端直接加入AD域。同时可以复用389‑DS的其他能力。

> 
> 重要限制：**密码不能同步**，未来版本可能会支持AD→389‑DS单向密码同步。

拓扑限制：一次同步链路只能一对一：一台389‑DS服务器 ↔ 一台AD域控制器；不能使用只读域控制器RODC。全局GC非必需。
数据流方向可选：AD→389‑DS；389‑DS→AD；双向同步。

### 5.12.1 拓扑规划

### 5.12.2 Active Directory前置条件

1. 需要一个安全组，授予「Replicating Directory Changes」权限。组内账号权限接近域管理员，必须使用高强度随机密码，审计组成员。
2. AD服务器必须配置LDAPS证书，保证通信安全；**GSSAPI/Kerberos不能用于Winsync同步**。

### 5.12.3 389 Directory Server前置条件

1. 后端数据库已经建好，准备好接收同步条目的OU。
2. 实例配置replica‑id，当作读写副本配置。

### 5.12.4 创建AD到389‑DS同步协定

在389‑DS执行命令，创建winsync复制协定，AD→389‑DS单向同步示例：

```
> sudo dsconf INSTANCE‑NAME repl‑winsync‑agmt create ‑‑suffix dc=example,dc=com \
‑‑host AD‑HOSTNAME ‑‑port 636 ‑‑conn‑protocol LDAPS \
‑‑bind‑dn "cn=SERVICE‑ACCOUNT,cn=USERS,dc=AD,dc=EXAMPLE,dc=COM" \
‑‑bind‑passwd "PASSWORD" ‑‑win‑subtree "cn=USERS,dc=AD,dc=EXAMPLE,dc=COM" \
‑‑ds‑subtree ou=AD,dc=EXAMPLE,dc=COM ‑‑one‑way‑sync fromWindows \
‑‑sync‑users=on ‑‑sync‑groups=on ‑‑move‑action delete \
‑‑win‑domain AD‑DOMAIN adsync_agreement
```

执行初始化同步：

```
> sudo dsconf INSTANCE‑NAME repl‑winsync‑agmt init ‑‑suffix dc=example,dc=com
adsync_agreement
```

查看初始化状态：

```
> sudo dsconf INSTANCE‑NAME repl‑winsync‑agmt init‑status ‑‑suffix dc=example,dc=com
adsync_agreement
```

查看协定状态：

```
> sudo dsconf INSTANCE‑NAME repl‑winsync‑agmt status ‑‑suffix dc=example,dc=com
adsync_agreement
```

暂停同步协定：

```
> sudo dsconf INSTANCE‑NAME repl‑winsync‑agmt disable ‑‑suffix dc=example,dc=com
adsync_agreement
```

恢复同步协定：

```
> sudo dsconf INSTANCE‑NAME repl‑winsync‑agmt enable ‑‑suffix dc=example,dc=com
adsync_agreement
```

## 5.13 更多参考信息

上游官方文档：[https://www.port389.org/docs/389ds/documentation.html](https://www.port389.org/docs/389ds/documentation.html)
手册页：

- man dsconf
- man dsctl
- man dsidm
- man dscreate

# 第6章 使用Kerberos实现网络身份认证
Kerberos 是一套网络身份认证协议，同时还可提供加密能力。本章介绍如何搭建 Kerberos，以及如何将 LDAP、NFS 这类服务与它集成。

## 6.1 概念概述
开放的网络环境本身没有可靠手段，能够让工作站正确核验用户身份，只能依靠常规密码机制。在常见部署环境中，用户每次访问网络内部的某项服务，都必须重新输入密码。Kerberos 提供一种身份认证方式：用户只需完成一次登录，在整个会话周期内，即可在整个网络中获得信任。

要实现安全的网络，需要满足下面这些要求：
- 所有用户访问目标服务时，必须证明自身身份，并且确保他人无法冒用该用户身份。
- 每台网络服务器同样必须证明自己的身份。否则攻击者有可能伪装成服务器，获取传输到服务器的敏感信息。该概念称为**双向身份认证（mutual authentication）**，客户端向服务器认证自己，服务器也向客户端认证自己。

Kerberos 可以帮助你满足以上要求，提供高强度加密的身份认证。本章只讲解 Kerberos 的基础原理。想要了解详细技术操作，请查阅 Kerberos 相关文档。

## 6.2 Kerberos术语
下面的词汇表定义了 Kerberos 的相关术语。

**凭证（credential）**
用户或客户端需要出示凭证，以此申请服务访问权限。Kerberos 包含两类凭证：票据（ticket）与认证器（authenticator）。

**票据（ticket）**
票据是每台服务器对应的凭证，客户端使用它向所请求服务的服务器完成认证。票据内包含：服务器名称、客户端名称、客户端互联网地址、时间戳、有效期、随机会话密钥。全部数据使用服务器的密钥加密。

**认证器（authenticator）**
认证器配合票据一起使用，用来证明出示票据的客户端确实是它所声称的身份。认证器由客户端名称、工作站IP地址、工作站当前时间组成，全部使用只有客户端与对应服务器知晓的会话密钥加密生成。和票据不同，一张认证器只能使用一次。客户端可以自行生成认证器。

**主体（principal）**
Kerberos 主体是一个唯一实体（用户或者服务），可以为其分配票据。主体由以下几部分组成：
`USER/INSTANCE@REALM`
- primary（主要部分）：主体的第一部分。对用户来说，这就是用户名。
- instance（实例，可选）：用于描述primary的附加信息。该字符串用 `/` 和 primary 分隔。
例如 `tux@example.org` 和 `tux/admin@example.org` 可以在同一套Kerberos系统中共存，二者被视作完全不同的主体。
- realm（域）：指定 Kerberos 域。惯例上，realm 使用大写的域名。

**双向身份认证（mutual authentication）**
Kerberos 保证客户端与服务器都可以确认对方身份。双方共享会话密钥，可以使用它实现安全通信。

**会话密钥（session key）**
会话密钥是由 Kerberos 生成的临时私钥。客户端持有该密钥，用来加密客户端与所请求服务器之间的通信。

**重放（replay）**
网络传输的几乎所有消息都可以被窃听、捕获并重放。放在 Kerberos 的语境下，该风险尤为突出：攻击者截获你的服务请求（内含票据与认证器），重放报文来冒充你的身份。但 Kerberos 实现了数种机制来防范该类问题。

**服务器或服务（server or service）**
service 指代需要执行的特定操作；完成该操作的进程称作 server。

## 6.3 Kerberos工作原理
Kerberos 常被称作**第三方可信身份认证服务**：所有客户端都信任 Kerberos 对其他客户端身份的判定结果。Kerberos 维护一份数据库，保存全部用户及其私钥。

务必把身份认证服务器与票据授予服务器部署在一台专用机器上。仅允许管理员物理访问与网络访问这台机器。在这台机器上，尽量少运行网络服务，甚至不要运行 sshd。

### 6.3.1 首次交互
你与 Kerberos 的首次交互，和普通网络系统的登录流程类似。输入你的用户名。用户名以及票据授予服务的名称，会发送给身份认证服务器（Kerberos）。
如果身份认证服务器识别该用户，就会生成一个随机会话密钥，用于后续客户端和票据授予服务器之间的通信。接着身份认证服务器为票据授予服务器生成一张票据。该票据包含如下信息，全部使用只有身份认证服务器与票据授予服务器知晓的会话密钥加密：
- 客户端与票据授予服务器二者的名称
- 当前时间
- 分配给该票据的有效期
- 客户端IP地址
- 新生成的会话密钥

该票据连同会话密钥，以加密形式回传给客户端。这次加密使用**客户端的私钥**，该私钥只有 Kerberos 和客户端知晓，它由用户密码推导而来。

客户端收到这条响应之后，会提示你输入密码。密码会被转换成密钥，解密来自身份认证服务器的数据包。数据包“拆包”完成后，密码与密钥会从工作站内存中清除。只要用于获取其他票据的这张票据还没有过期，你的工作站就可以证明你的身份。

### 6.3.2 请求一项服务
客户端应用程序向网络内任意服务器请求服务时，需要向服务器证明自身身份。因此应用程序会生成一个认证器。认证器由下面组件构成：
- 客户端主体
- 客户端IP地址
- 当前时间
- 校验和（由客户端自行选择）

全部信息使用客户端已经获取的、对应这台特定服务器的会话密钥加密。认证器连同该服务器的票据，一同发送给服务器。服务器使用自己所持有的会话密钥解密认证器，从中获得请求服务的客户端的全部相关信息，并将其和票据内信息做比对。服务器会校验票据与认证器是否来自同一个客户端。

如果服务器没有采取安全防护手段，该环节就会成为重放攻击的理想目标。攻击者可以复用之前从网络截获的请求报文。为防范该问题，服务器不会接收时间戳与票据曾经出现过的请求。时间戳与接收请求的时间相差过大的请求，会直接被丢弃。

### 6.3.3 双向身份认证
Kerberos身份认证支持双向。不只是客户端要证明自己是谁，服务器同样要向请求服务的客户端证明自身身份。因此服务器也会生成一份认证器。服务器会在客户端发来的认证器的校验和上加一，再使用客户端与服务器共享的会话密钥加密。客户端收到该响应，就可以确认服务器身份，随后双方开始协作。

### 6.3.4 票据授予——与全部服务器建立通信
每张票据一次只能用于一台服务器。因此，每次请求另一项服务，都需要获取一张新票据。Kerberos 通过票据授予服务实现为各个服务器获取票据的机制。

每当应用程序需要一张尚未获取的票据，就会联系票据授予服务器。该请求包含如下组件：
- 目标主体
- 票据授予票据
- 认证器

和其他服务器一样，票据授予服务器会校验票据授予票据与认证器。校验通过之后，票据授予服务器生成一组新的会话密钥，供原始客户端与新服务器之间使用。接着生成目标服务器的票据，票据包含：
- 客户端主体
- 服务器主体
- 当前时间
- 客户端IP地址
- 新生成的会话密钥

这张新票据拥有有效期，取值取下面二者中更小的那一个：票据授予票据的剩余有效期、服务的默认有效期。客户端收到票据与会话密钥，该响应由原始票据授予票据附带的会话密钥加密。客户端解密该响应，**无需再次输入用户密码**，就可以访问新服务。这样 Kerberos 就可以为客户端接连获取多张票据，无需打扰用户。

## 6.4 用户视角下的Kerberos
理想情况下，用户只需要在工作站登录阶段和 Kerberos 交互。登录流程会获取一张票据授予票据。用户注销时，Kerberos票据会被自动销毁，防止他人冒用该用户身份。

票据会自动过期。如果用户登录会话持续时间超过票据授予票据的最大有效期（合理设置一般为10小时），就会出现问题。不过用户可以运行 `kinit` 获取新的票据授予票据。再次输入密码之后，Kerberos 就可以访问所需服务，无需额外身份认证。

运行 `klist`，可以查看 Kerberos 为你静默获取的全部票据。

下面列出部分支持 Kerberos 身份认证的应用。安装软件包 `krb5‑apps‑clients` 之后，可以在 `/usr/lib/mit/bin` 与 `/usr/lib/mit/sbin` 找到这些程序。它们拥有普通Unix/Linux程序的全部功能，还额外提供由 Kerberos 透明管理的身份认证能力：
`telnet`、`telnetd`、`rlogin`、`rsh`、`rcp`、`rshd`、`ftp`、`ftpd`、`ksu`。

你不再需要输入密码来使用这些应用，因为 Kerberos 已经完成你的身份核验。如果 OpenSSH 在编译时开启了 Kerberos 支持，它甚至可以把你在一台工作站上的票据转发到另一台工作站。使用 SSH 连接另一台工作站时，SSH 会调整票据加密内容，适配新环境。**简单地把票据复制到其他工作站是行不通的**，因为票据内包含工作站专属信息。XDM、GDM 同样支持 Kerberos。

更多关于 Kerberos 网络应用的内容，可参阅 MIT Kerberos V5 UNIX 用户指南：https://web.mit.edu/kerberos。

## 6.5 安装与管理Kerberos
一套 Kerberos 环境由多个组件构成。密钥分发中心（KDC）存放包含全部 Kerberos 相关数据的中央数据库。所有客户端依靠 KDC，完成跨网络身份认证。KDC 和客户端都需要按照你的部署环境完成配置。

### 通用准备工作
1. 检查你的网络部署，满足6.5.1节《Kerberos网络拓扑》提出的最低要求。
2. 为你的 Kerberos 部署选择合适的 realm，见6.5.2节《选择Kerberos域》。
3. 妥善配置充当KDC的机器，强化安全防护，见6.5.3节《KDC硬件部署》。
4. 在网络内部搭建可靠时间源，保证票据的时间戳合法有效，见6.5.4节《配置时间同步》。

### 基础配置
1. 配置KDC与客户端，见6.5.5节《配置KDC》和6.5.6节《配置Kerberos客户端》。
2. 开启 Kerberos 远程管理，这样你就不需要物理访问KDC机器，见6.5.7节《配置Kerberos远程管理》。
3. 为域内每一项服务创建服务主体，见6.5.8节《创建Kerberos服务主体》。

### 启用Kerberos身份认证
- 如果要让应用程序使用 PAM 完成 Kerberos 密码校验，请参阅6.5.9节《启用Kerberos的PAM支持》。
- SSH、LDAP如何配合Kerberos身份认证，请参阅6.5.10节《为SSH配置Kerberos身份认证》、6.5.11节《LDAP与Kerberos协同》。

### 6.5.1 Kerberos网络拓扑
想要 Kerberos 完整可用，你的环境必须满足如下条件：
1. 部署一台DNS服务器，用于全网名称解析，让客户端与服务器可以互相定位。DNS配置相关，参阅参考手册第19章《域名系统》。
2. 网络内部部署一台时间服务器。精确的时间戳对 Kerberos 部署至关重要，因为合法的 Kerberos 票据必须携带正确时间戳。NTP相关，参阅参考手册第18章《使用NTP完成时间同步》。
3. 部署密钥分发中心KDC，作为Kerberos架构的核心。KDC存放Kerberos数据库。这台机器要执行最高等级安全策略，防止KDC被攻陷之后，你的整套基础设施遭到破坏。
4. 配置客户端机器，使用Kerberos身份认证。

> 提示：配置子网路由
> 如果你的部署和图6.1类似，存在 `192.168.1.0/24` 与 `192.168.2.0/24` 两个子网，请配置子网间路由。更多信息，参阅参考手册第13章《基础网络》13.4.1.5节《使用YaST配置路由》。

### 6.5.2 选择Kerberos域（realm）
Kerberos 的部署域称作 realm，由一个名称标识，例如 `EXAMPLE.COM`，也可以简单写成 `ACCOUNTING`。
Kerberos 区分大小写，`example.com` 和 `EXAMPLE.COM` 属于两个完全不同的域。大小写可以自由选择，但行业惯例是使用大写字母命名 realm。

推荐把你的 DNS 域名（或者子域，例如 `ACCOUNTING.EXAMPLE.COM`）用作 realm 名称。如果你把 realm 设置为 DNS 域的子域，客户端就可以借助 DNS 自动定位 KDC 和其他 Kerberos 服务，大幅降低管理员工作量。

Kerberos 的域名空间**不是层级继承**。如果你有一个 `EXAMPLE.COM` 主域，下面还有 `DEVELOPMENT`、`ACCOUNTING` 两个“子域”，这些子域并不会从 `EXAMPLE.COM` 继承主体。三者是互相独立的 realm，需要为每一对 realm 配置跨域信任关系，域内用户才可以互相访问对方域的服务。

为简化后续说明，本章剩余部分全部使用 `EXAMPLE.COM` 作为示例 realm，假设整个组织只部署一个域。

### 6.5.3 KDC硬件部署
想要使用 Kerberos，第一件事就是准备充当密钥分发中心（KDC）的机器。KDC 保存完整的 Kerberos 用户数据库，包含密码与全部相关信息。

KDC 是安全基础设施中最重要的一环。如果攻击者攻陷KDC，就可以冒充数据库内任意主体。请尽可能强化这台机器的安全防护：
1. 将服务器放置在物理受保护的位置，例如上锁的服务器机房，仅少数人员可以访问。
2. 除KDC本身服务之外，不要运行任何网络应用程序。包括服务器与客户端——例如，KDC不要通过NFS挂载文件系统，也不要使用DHCP获取网络配置。
3. 首先安装最小化系统，检查已安装软件包列表，删除所有非必需软件包。包括inetd、portmap、CUPS这类服务，以及任何X窗口相关组件。即便安装SSH服务器，也应当视作潜在安全风险。
4. 该机器上不提供图形登录界面，X服务器会带来潜在安全风险。Kerberos自身提供管理接口。
5. 配置 `/etc/nsswitch.conf`，用户与组查询仅使用本地文件。passwd与group行配置如下：
```
passwd: files
group: files
```
编辑 `/etc/passwd`、`/etc/group`、`/etc/shadow`，删除所有以 `+` 开头的行（这些行用于NIS查询）。
6. 编辑 `/etc/shadow`，将除root之外所有用户账户的密码哈希替换为`*`或者`!`，禁用普通用户账号。

### 6.5.4 配置时间同步
要让 Kerberos 正常工作，组织内部所有系统时钟的偏差必须控制在一定范围内。这点至关重要，因为 Kerberos 要防范凭证重放攻击。攻击者可以捕获网络中的 Kerberos 凭证，重放报文实施攻击。Kerberos 的防护手段之一就是在票据中写入时间戳。服务器收到票据，如果票据时间戳和当前系统时间偏差过大，就会拒绝该票据。

但是计算机时钟并不完美，PC 时钟一周快/慢半小时的情况并不少见。因此，配置网络内所有主机，向同一台中央时间源同步时钟。

简单方案：一台机器上部署NTP时间服务器，所有客户端机器运行 chronyd 作为NTP客户端，同步该服务器时间。KDC自身也需要同步公共时间源。但在KDC上运行NTP守护进程本身存在安全风险，推荐使用cron定时任务执行 `chronyd -q` 完成时间同步。

想要把机器配置成NTP客户端，请参阅参考手册第18章《使用NTP完成时间同步》18.1节《使用YaST配置NTP客户端》。

另一种兼顾安全的时间方案：为专用NTP服务器接入硬件参考时钟，KDC机器同样接入另一套硬件参考时钟。

你也可以修改 Kerberos 允许的最大时间偏差（称作 clock skew），该参数在 `krb5.conf` 中配置，见6.5.6.3节《调整时钟偏差》。

### 6.5.5 配置KDC
本节讲解KDC的初始安装与配置，包含管理主体的创建。整套流程分为数步：
1. 在指定作为KDC的机器上，安装RPM软件包：`krb5`、`krb5‑server`、`krb5‑client`。
2. 修改配置文件：`/etc/krb5.conf` 和 `/var/lib/kerberos/krb5kdc/kdc.conf`，按照你的环境调整。这两份文件保存KDC的全部信息。参阅6.5.5.1节《服务器配置》。
3. 创建Kerberos数据库。Kerberos维护数据库，保存全部主体标识，以及所有需要身份认证的主体的密钥。参阅6.5.5.2节《设置数据库》。
4. 修改ACL文件，添加管理员。KDC上的Kerberos数据库支持远程管理。为防止未授权主体篡改数据库，Kerberos 使用访问控制列表。你必须显式开启管理员主体的远程访问权限。参阅6.5.7节《配置Kerberos远程管理》。
5. 修改Kerberos数据库，添加管理员。你至少需要一个管理员主体，来运行与管理Kerberos。该主体必须在启动KDC之前创建。参阅6.5.5.3节《创建主体》。
6. 启动Kerberos守护进程。KDC软件安装、配置完成后，启动Kerberos守护进程，为你的realm提供Kerberos服务。参阅6.5.5.4节《启动KDC》。
7. 为你自己创建一个主体。你需要属于自己的主体。参阅6.5.5.3节《创建主体》。

#### 6.5.5.1 服务器配置
Kerberos服务器配置高度依赖你的网络架构、DNS/DHCP配置、realm等环境。你必须配置默认realm，以及域名‑realm映射。下面给出最小配置示例，该示例不能直接复制粘贴使用。更多详情查阅MIT官方文档：https://web.mit.edu/kerberos/krb5‑latest/doc/admin/conf_files/index.html

> 示例6.1：KDC配置示例，`/etc/krb5.conf`
```ini
[libdefaults]
dns_canonicalize_hostname = false
rdns = false
default_realm = example.com
ticket_lifetime = 24h
renew_lifetime = 7d

[realms]
example.com = {
kdc = kdc.example.com.:88
admin_server = kdc.example.com
default_domain = example.com
}

[logging]
kdc = FILE:/var/log/krb5kdc.log
admin_server = FILE:/var/log/kadmind.log
default = SYSLOG:NOTICE:DAEMON

[domain_realm]
.example.com = example.com
example.com = example.com
```

#### 6.5.5.2 设置数据库
下一步初始化数据库，Kerberos 在其中保存全部主体信息。数据库主密钥由密码短语生成，存放在**stash文件**。stash文件的作用：重启KDC时，不再需要手动输入数据库主密码。

⚠️重要：备份Kerberos数据库（路径 `/var/lib/kerberos/krb5kdc/principal`）的时候，**不要备份stash文件**（路径 `/var/lib/kerberos/krb5kdc/.k5.EXAMPLE.COM`）。否则拿到备份磁带的人可以解密数据库。请把主密码妥善保存在保险柜或者其他安全位置，系统故障从磁带恢复数据库时，你会需要它。

创建stash文件与数据库，执行：
```bash
sudo kdb5_util create -r EXAMPLE.COM -s
```
输出内容：
```
Initializing database '/var/lib/kerberos/krb5kdc/principal' for realm 'EXAMPLE.COM',
master key name 'K/M@EXAMPLE.COM'
You are prompted for the database Master Password.
It is important that you NOT FORGET this password.
Enter KDC database master key:
Re‑enter KDC database master key to verify:
```
输入数据库主密码，再次确认。

使用 `kadmin.local` 查看数据库主体列表：
```bash
kadmin.local
kadmin> listprincs
```
你会看到若干系统内部使用的主体：
```
K/M@EXAMPLE.COM
kadmin/admin@EXAMPLE.COM
kadmin/changepw@EXAMPLE.COM
krbtgt/EXAMPLE.COM@EXAMPLE.COM
```

#### 6.5.5.3 创建主体
为你自己创建两个Kerberos主体：一个日常工作普通主体，一个用于Kerberos管理任务的管理主体。假设你的登录用户名是 suzanne，操作如下：
```bash
kadmin.local
kadmin> ank suzanne
```
输出：
```
suzanne@EXAMPLE.COM's Password:
Verifying password:
```
输入 suzanne 的密码，再次确认。

接着创建管理角色主体 `suzanne/admin`，在 kadmin 提示符输入：`ank suzanne/admin`。
用户名后面的 `/admin` 代表角色。后续你执行 Kerberos 数据库管理操作时，就使用这个角色。同一个用户可以拥有多个不同用途的角色。

#### 6.5.5.4 启动KDC
手动启动KDC守护进程与kadmin守护进程：
```bash
sudo systemctl start krb5kdc
sudo systemctl start kadmind
```

设置开机自启，服务器重启后自动运行这两个服务：
```bash
sudo systemctl enable krb5kdc kadmind
```
也可以使用YaST服务管理器完成设置。

### 6.5.6 配置Kerberos客户端
DNS、NTP基础环境就绪，KDC安装配置并启动完成后，配置客户端机器。

配置Kerberos客户端有两种方式：在 `/etc/krb5.conf` 做静态配置；或者依靠DNS做动态配置。
- **DNS配置**：借助DNS SRV记录，Kerberos应用自动定位KDC服务。配置工作量小，但要求 realm 名称和DNS域名（或者子域）一致。DNS也带来安全风险：攻击者可以操纵DNS，造成服务中断。最坏结果只是拒绝服务。
- **静态配置**：在配置文件内写死KDC主机名。KDC主机名发生变动，就要修改所有客户端配置。如果直接写IP地址，可以规避DNS带来的部分风险。

#### 6.5.6.1 静态配置
编辑 `/etc/krb5.conf`。默认自带示例条目，请全部删除。配置文件由多个 `[ ]` 包裹的节组成。

写入下面片段，`kdc.example.com` 替换成你的KDC主机名：
```ini
[libdefaults]
default_realm = EXAMPLE.COM

[realms]
EXAMPLE.COM = {
kdc = kdc.example.com
admin_server = kdc.example.com
}
```

`[domain_realm]` 节，用来告诉应用程序主机名对应哪个Kerberos域。例如，客户端连接远程主机时，Kerberos库需要判断目标主机属于哪个realm。
```ini
[domain_realm]
.example.com = EXAMPLE.COM
www.example.org = EXAMPLE.COM
```
上面配置：所有 `example.com` DNS域下主机属于 `EXAMPLE.COM`；外部主机 `www.example.org` 同样视作该域成员。

#### 6.5.6.2 基于DNS的配置
DNS方式大量使用SRV记录，参考RFC2052。
SRV记录格式：`_service._proto.realm`。realm为Kerberos域。DNS域名大小写不敏感，而Kerberos realm区分大小写，因此该方式不能混用大小写不同的realm。

`_service` 代表服务名称；`_proto` 是传输协议，`_udp` 或者 `_tcp`，不是全部服务同时支持两种协议。

MIT Kerberos会查询下面名称：
1. **_kerberos**：定位身份认证、票据授予服务器。示例记录：
```
_kerberos._udp.EXAMPLE.COM. IN SRV 0 0 88 kdc.example.com.
_kerberos._tcp.EXAMPLE.COM. IN SRV 0 0 88 kdc.example.com.
```
2. **_kerberos‑adm**：定位远程管理服务。kadmind 不支持UDP协议，因此只写tcp：
```
_kerberos‑adm._tcp.EXAMPLE.COM. IN SRV 0 0 749 kdc.example.com.
```

如果你需要把不属于该DNS域的主机映射到指定Kerberos realm，可以添加TXT记录，格式 `_kerberos.主机名`。
```
_kerberos.www.example.org. IN TXT "EXAMPLE.COM"
```

#### 6.5.6.3 调整时钟偏差
clock skew（时钟偏差）代表：允许票据时间戳与本机系统时钟存在的最大时间差。默认值300秒（5分钟），票据时间可以比系统时间最多早5分钟，最多晚5分钟。

全网使用NTP同步时钟的情况下，可以把该值缩小到约60秒。在 `/etc/krb5.conf` 修改：
```ini
[libdefaults]
clockskew = 60
```

### 6.5.7 配置Kerberos远程管理
想要不登录KDC控制台，就可以增删主体，需要修改 `/var/lib/kerberos/krb5kdc/kadm5.acl` 访问控制列表文件，指定各个主体拥有的权限。详细看 `man 8 kadmind`。

示例，赋予 suzanne 完整管理权限：
```
suzanne/admin *
```
把用户名替换为你自己的账号。修改完成后重启 kadmind 服务，配置生效。

现在你可以远程使用 kadmin 工具管理Kerberos数据库。首先获取管理员角色的票据，连接kadmin服务器：
```bash
kadmin -p suzanne/admin
Authenticating as principal suzanne/admin@EXAMPLE.COM with password.
Password for suzanne/admin@EXAMPLE.COM:
kadmin: getprivs
current privileges: GET ADD MODIFY DELETE
kadmin:
```

使用 `getprivs` 确认你拥有的权限，上面输出代表全部权限。

示例，修改主体 suzanne 的最大票据生命周期：
```bash
kadmin: modify_principal -maxlife "8 hours" suzanne
Principal "suzanne@EXAMPLE.COM" modified.
kadmin: getprinc suzanne
Principal: suzanne@EXAMPLE.COM
Expiration date: [never]
Last password change: Wed Jan 12 17:28:46 CET 2005
Password expiration date: [none]
Maximum ticket life: 0 days 08:00:00
Maximum renewable life: 7 days 00:00:00
Last modified: Wed Jan 12 17:59:49 CET 2005 (suzanne/admin@EXAMPLE.COM)
Last successful authentication: [never]
Last failed authentication: [never]
Failed password attempts: 0
Number of keys: 2
Key: vno 1, Triple DES cbc mode with HMAC/sha1, no salt
Key: vno 1, DES cbc mode with CRC‑32, no salt
Attributes:
Policy: [none]
kadmin:
```

更多 kadmin 命令选项，查看软件包 `krb5‑doc` 或者 `man 8 kadmin`。

### 6.5.8 创建Kerberos服务主体
到目前为止只讲了用户凭证。但是兼容Kerberos的服务同样要向客户端证明自己身份。因此，域内每一项提供的服务，都必须在Kerberos数据库中拥有专门的**服务主体**。

服务主体命名约定格式：`SERVICE/主机全称@REALM`。

|服务描述符 |服务 |
| ---- | ---- |
| host | Telnet、RSH、SSH |
| nfs | 支持Kerberos的NFSv4 |
| HTTP | HTTP（开启Kerberos身份认证） |
| imap | IMAP |
| pop | POP3 |
| ldap | LDAP |

服务主体和用户主体有明显区别。用户主体密钥受密码保护：用户获取票据授予票据时，输入密码解密。
服务主体不能每8小时就由管理员手动输入密码。解决方案：管理员从KDC导出密钥，保存在本地文件 **keytab**。服务进程读取该文件，自动按需获取票据。默认keytab文件路径：`/etc/krb5.keytab`，文件归超级用户所有。

示例，为主机 `jupiter.example.com` 创建 host 服务主体，进入kadmin会话：
```bash
kadmin -p suzanne/admin
Authenticating as principal suzanne/admin@EXAMPLE.COM with password.
Password for suzanne/admin@EXAMPLE.COM:
kadmin: addprinc -randkey host/jupiter.example.com
WARNING: no policy specified for host/jupiter.example.com@EXAMPLE.COM; defaulting to no policy
Principal "host/jupiter.example.com@EXAMPLE.COM" created.
```
`‑randkey` 参数，告诉kadmin生成随机密钥。服务器账号，不需要人工交互密码。

接着导出密钥写入本地keytab文件 `/etc/krb5.keytab`。该操作需要root权限，依旧在kadmin shell中执行：
```bash
kadmin: ktadd host/jupiter.example.com
Entry for principal host/jupiter.example.com with kvno 3, encryption type Triple DES cbc mode with HMAC/sha1 added to keytab WRFILE:/etc/krb5.keytab.
Entry for principal host/jupiter.example.com with kvno 3, encryption type DES cbc mode with CRC‑32 added to keytab WRFILE:/etc/krb5.keytab.
kadmin:
```

操作完成，执行 `kdestroy`，销毁刚才获取的管理员票据。

### 6.5.9 启用PAM对Kerberos的支持
> ⚠️警告：配置不全有账户锁定风险
> Kerberos配置不完整，有可能会把包括root在内的用户锁在系统之外。为避免该情况，将 `pam_krb5` 模块加入PAM配置之后，请添加 `ignore_unknown_principals` 参数。
```bash
sudo pam‑config --add --krb5‑ignore_unknown_principals
```
该指令让 `pam_krb5` 忽略会造成account阶段失败的错误。

openSUSE Leap 自带PAM模块 `pam_krb5`，支持Kerberos登录与密码修改。控制台登录、su、GDM图形登录这类应用都可以使用它。也就是说，当用户输入密码登录，该模块可以为用户自动获取初始Kerberos票据。

使用下面命令开启PAM的Kerberos支持：
```bash
sudo pam‑config --add --krb5
```
该命令会把 `pam_krb5` 模块添加到已有PAM配置文件，并且保证调用顺序正确。如果你需要精细调整 `pam_krb5`，编辑 `/etc/krb5.conf`。更多参考 `man 5 pam_krb5`。

> 注意：`pam_krb5` 专门用于用户输入密码登录场景。**不适合接收Kerberos票据作为身份凭证的网络服务**，二者是完全不同的处理流程。

### 6.5.10 为SSH配置Kerberos身份认证
OpenSSH 协议版本1与版本2均支持Kerberos身份认证。版本1使用专门协议报文传输Kerberos票据；版本2不再直接使用Kerberos，而是依靠GSSAPI（通用安全服务应用程序接口）。GSSAPI是一套编程接口，并不专属于Kerberos，但是这里配套的GSSAPI库仅支持Kerberos。

编辑 `/etc/ssh/sshd_config`，添加配置：
```
# 下面是协议版本1相关
# KerberosAuthentication yes
# KerberosTicketCleanup yes

# 推荐使用版本2
GSSAPIAuthentication yes
GSSAPICleanupCredentials yes
```

重启sshd服务：
```bash
sudo systemctl restart sshd
```

客户端同样开启该功能，编辑系统全局配置 `/etc/ssh/ssh_config`，或者用户个人配置 `~/.ssh/config`：
```
GSSAPIAuthentication yes
```

现在就可以使用Kerberos身份认证连接SSH。先用 `klist` 确认你拥有有效票据，再连接SSH服务器。使用 `-1` 参数强制使用协议版本1。

> 提示：更多信息
> 文件 `/usr/share/doc/packages/openssh/README.kerberos`，详细讲解OpenSSH与Kerberos交互逻辑。

> 补充提示：协议版本2额外支持GSSAPIKeyExchange（RFC4462）。该指令控制主机密钥交换。更多查看 `man sshd_config`。

### 6.5.11 LDAP与Kerberos协同
Kerberos 负责身份认证；LDAP 负责授权与身份识别。二者可以协同工作。

389 Directory Server支持多种加密方式：SSL/TLS连接、Start TLS连接、SASL身份认证。SASL（简单身份认证与安全层）是一套网络协议，用于身份认证。openSUSE Leap 的SASL实现是 `cyrus‑sasl`。Kerberos身份认证借助GSS‑API完成，软件包为 `cyrus‑sasl‑gssapi`。

使用GSS‑API时，389 Directory Server依靠Kerberos票据完成会话身份认证与数据加密。Kerberos双向认证：不仅客户端向389‑DS证明身份，389‑DS同样向客户端证明自己身份。防范攻击者搭建冒牌服务器。

想要让Kerberos绑定到389 Directory Server：需要创建 `ldap/ldap.example.com` 主体，并写入keytab。389‑DS通过keytab获得凭证。使用环境变量 `KRB5_KTNAME` 指定keytab路径。

配置步骤：
1. 执行：
```bash
sudo systemctl edit dirsrv@INSTANCE
```
`INSTANCE` 替换为你的实例名，默认实例写 `localhost`。

2. 添加下面内容：
```ini
[Service]
Environment=KRB5_KTNAME=/etc/dirsrv/slapd‑INSTANCE/krb5.keytab
```

3. keytab文件必须由运行389‑DS服务的账号（dirsrv）可读：
```bash
sudo chown dirsrv:dirsrv /etc/dirsrv/slapd‑INSTANCE/krb5.keytab
sudo chmod 600 /etc/dirsrv/slapd‑INSTANCE/krb5.keytab
```

#### 6.5.11.1 使用Kerberos身份认证访问LDAP
使用6.5.5.3节创建的主体，获取初始票据授予票据：
```bash
kinit suzanne@EXAMPLE.COM
```

测试GSSAPI身份认证是否可用：
```bash
ldapwhoami -Y GSSAPI -H ldap://ldapkdc.example.com
dn: uid=testuser,ou=People,dc=example,dc=com
```
GSSAPI 使用凭证缓存，用户不需要输入密码就完成LDAP服务器身份认证。

#### 6.5.11.2 配置SASL身份映射
当处理SASL绑定请求时，389 Directory Server 会把SASL身份ID映射为服务器内部LDAP条目。Kerberos场景下，SASL用户ID格式为 `userid@REALM`，例如 `tux@example.com`。该ID需要转换为用户的DN，例如 `uid=tux,ou=people,dc=example,dc=com`。

389‑DS自带适用于绝大多数常见环境的默认映射。但你可以自定义映射规则。

> 流程6.1：管理映射
1. 列出现有的SASL映射：
```bash
dsconf INSTANCE sasl list
```
输出示例：
```
Kerberos uid mapping
rfc 2829 dn syntax
rfc 2829u syntax
uid mapping
```

2. 查看映射详情：
```bash
sudo dsconf INSTANCE sasl get "Kerberos uid mapping"
```
输出：
```
dn: cn=Kerberos uid mapping,cn=mapping,cn=sasl,cn=config
cn: Kerberos uid mapping
nsSaslMapBaseDNTemplate: dc=\2,dc=\3
nsSaslMapFilterTemplate: (uid=\1)
nsSaslMapRegexString: \(.*\)@\(.*\)\.\(.*\)
objectClass: top
objectClass: nsSaslMapping
```

3. 如果默认映射不满足你的环境，删除映射：
```bash
sudo dsconf INSTANCE sasl delete "Kerberos uid mapping"
```

4. 创建新的映射：
```bash
sudo dsconf localhost sasl create --cn=bhgssapi --nsSaslMapRegexString "\(.*\)@EXAMPLE.NET.DE" --nsSaslMapBaseDNTemplate="dc=example,dc=net,dc=de" --nsSaslMapFilterTemplate="(uid=\1)"
```
接着输入 `nsSaslMapPriority` 的数值。

5. 查看新建映射：
```bash
sudo dsconf localhost sasl get "bhgssapi"
```
输出会展示完整映射配置。

该示例只匹配特定realm `EXAMPLE.NET.DE` 的用户，映射到对应的dc路径。默认映射只适配两段dc域名，遇到三段dc域名（EXAMPLE.NET.DE）就会失效。

## 6.6 Kerberos与NFS
大多数NFS服务器可以混合使用多种安全模式：传统的“信任网络”模式 `sec=sys`，以及三种基于Kerberos的安全模式：`sec=krb5`、`sec=krb5i`、`sec=krb5p`。sec参数在客户端作为挂载选项。

部署通常先使用 `sec=sys`，之后再引入Kerberos安全。这时服务器会同时支持 `sec=sys` 和某一种Kerberos模式。全部客户端迁移完成后，再移除 `sec=sys`，实现真正安全。迁移过程有序操作，对用户透明。但是NFS在Kerberos模式下行为有一处细微差别，需要理解与处理，见6.6.1节《用户组成员关系》。

三种Kerberos安全模式安全等级依次升高，安全越强，加密解密消耗CPU资源越多。规划NFS的Kerberos部署时，需要权衡性能与安全。
- **krb5**：仅身份认证。服务器确认请求发起者身份，客户端确认服务器身份。**报文内容不加密**。物理网络上的攻击者可以篡改请求、应答报文，也可以读取传输内容。攻击者不能直接读取或者修改该用户本无权访问的文件，但理论上存在其他攻击可能性。
- **krb5i**：报文完整性校验。攻击者无法修改请求与应答报文，但是攻击者可以读取全部传输数据，窃取文件内容。
- **krb5p**：提供隐私保护。除身份认证、完整性校验之外，报文全部加密。攻击者只能看到双方在通信，无法直接提取传输内容。但是报文时间相关信息，Kerberos无法防护。

### 6.6.1 用户组成员关系
`sec=sys` 和Kerberos安全模式之间一处可见行为差异来自用户组。

在 `sec=sys` 模式下，每一次NFS请求，客户端都会把uid、gid，最多16个附加组ID发送给服务器。
如果用户属于超过16个附加组，超出的组信息会丢失，NFS访问会出现非预期权限问题。因此大多数使用NFS的站点，会限制所有用户最多拥有16个附加用户组。

如果用户执行 `newgrp` 或者运行set‑gid程序，会立刻改变进程的用户组列表，该变更会立刻在NFS访问中生效。

使用Kerberos模式，**组信息不会随请求报文发送**。只传递用户主体身份。服务器本地查询，获取该主体对应的UID与完整组列表。
优势：用户即便属于超过16个用户组，全部组信息都会参与判定文件访问权限。
缺点：客户端上修改有效组ID，服务器感知不到，不会影响NFS文件权限判断。

可以支持更多用户组是实实在在的收益；而客户端修改组ID不生效的影响，大多数场景下用户感知不到。但管理员规划Kerberos+NFS部署时，必须知晓该区别，避免引发故障。

### 6.6.2 性能与可扩展性
Kerberos安全会带来额外CPU开销，用于报文加解密。硬件不同，性能影响各不相同。如果服务器或客户端CPU已经满载，切换到Kerberos模式，会观测到性能下降；如果CPU资源充足，吞吐量可能不会变化。唯一确定影响的方式，就是在你的硬件上做测试。

部分配置选项可以降低负载，但会牺牲安全防护等级。例如 `sec=krb5` 的开销显著低于 `sec=krb5p`。Kerberos密码套件默认经过审慎选择，若无充分评估，不要随意修改。

另一个性能关注点：KDC（密钥分发中心）的可用性与峰值负载。启用NFS使用Kerberos之后，每次客户端和服务建立会话，客户端就要和KDC协商会话密钥。会话建立完成之后，数小时内（取决于 `ticket_lifetime`）客户端服务器通信不再依赖KDC。

和DNS、LDAP这类核心服务一样，每一个客户端“就近”拥有两套KDC实例，可用性最好。KDC负载只有登录高峰期才会冲高。数千用户集中在早上9:00‑9:05登录，每分钟请求数会暴涨。KDC负载会高于LDAP，但不会高出数个数量级。行业经验：像部署LDAP副本一样部署KDC副本，监控性能，判断是否超出负载。

### 6.6.3 主KDC、多域以及信任关系
KDC 处理密码修改、新建用户这类写操作，必须由**单一主KDC**处理。

写操作发生频率通常不高，但是主KDC如果远在异地，临时不可用会带来困扰。

组织地理分布广，本地需要独立管理，就适合部署多个Kerberos域。每个域拥有本地主KDC。不同域之间配置信任关系，各个域的主体就可以访问对方域的资源。

简单架构：全局域（例如 `EXAMPLE.COM`），搭配多个本地子域（`ASIA.EXAMPLE.COM`、`EUROPE.EXAMPLE.COM`）。全局域与各个本地域双向互相信任，任意主体就可以建立安全连接。文件访问权限取决于用户名称解析服务，已经超出Kerberos范畴。

## 6.7 更多参考信息
MIT Kerberos官方网站：https://web.mit.edu/kerberos，上面可以找到Kerberos相关链接，管理员手册、用户手册。

书籍：《Kerberos‑‑A Network Authentication System》作者 Brian Tung，ISBN 0‑201‑37924‑4。

# 第7章 Active Directory支持

Active Directory*（AD）是一套基于LDAP、Kerberos以及其他服务的目录服务。微软Windows系统使用它来管理资源、服务和用户。openSUSE Leap允许你加入现有的Active Directory域，将Linux计算机集成进Windows环境中。

## 7.1 将Linux与Active Directory环境集成

将Linux客户端配置为Active Directory客户端，并加入已有的Active Directory域之后，可以获得纯openSUSE Leap Linux客户端所不具备的各类功能：

- **通过SMB浏览共享文件和目录**
GNOME 文件管理器（旧称 Nautilus）支持通过 SMB 浏览共享资源。
- **通过SMB共享文件和目录**
GNOME 文件管理器支持像 Windows 一样共享目录与文件。
- **访问并操作 Windows 服务器上的用户数据**
通过 GNOME 文件管理器，用户可以访问 Windows 用户数据，在 Windows 服务器上创建、编辑和删除文件及目录。用户无需反复输入密码即可访问自己的数据。
- **离线身份认证**
即使用户离线或者Active Directory服务器暂时不可用，用户依旧可以登录并访问本机本地数据。
- **Windows密码修改**
Linux上的Active Directory支持会强制执行存储在Active Directory中的企业密码策略。显示管理器和控制台均支持密码变更提示，并接收你的输入。你甚至可以使用Linux的`passwd`命令来设置Windows密码。
- **通过支持Kerberos的应用实现单点登录**
许多桌面应用支持Kerberos（kerberized），意味着用户访问Web服务器、代理、群组软件或者其他位置时，应用可以透明地完成身份认证，无需重复输入密码。

> 
> 注意：Windows Server 2016及更高版本管理Unix属性
> 在Windows Server 2016及更高版本中，微软移除了IDMU/NIS服务器角色，同时也移除了Active Directory用户和计算机MMC管理单元中的Unix属性插件。
> 
> 
> 但是，在Active Directory用户和计算机MMC管理单元中开启高级选项后，仍然可以手动管理Unix属性。更多信息参阅：[https://blogs.technet.microsoft.com/activedirectoryua/2016/02/09/identity-management-for-unix-idmu-is-deprecated-in-windows-server/。](https://blogs.technet.microsoft.com/activedirectoryua/2016/02/09/identity-management-for-unix-idmu-is-deprecated-in-windows-server/%E3%80%82)
> 
> 
> 或者使用7.3.2节「使用用户登录管理加入Active Directory域」中描述的流程，在客户端侧补齐属性（尤其参阅步骤6.c）。

本章后续小节介绍上述大部分功能背后的技术原理。关于文件与打印机共享，请参阅《GNOME用户指南》。

## 7.2 Linux对Active Directory提供支持的背景信息

要将Linux客户端集成进已有的Windows Active Directory域，大量系统组件必须无缝协同工作。下面的小节聚焦关键事件中，客户端与Active Directory服务器交互的底层流程。

客户端至少要和服务器共用两套协议才能和目录服务通信：

1. **LDAP**
LDAP是专门用来管理目录信息的协议。搭载Active Directory的Windows域控制器可以使用LDAP协议和客户端交换目录信息。关于LDAP，参阅第5章《使用389 Directory Server实现LDAP》。
2. **Kerberos**
Kerberos是受第三方信任的身份认证服务。所有客户端信任Kerberos对其他客户端身份的授权，以此实现支持Kerberos的单点登录（SSO）方案。Windows实现了Kerberos，所以即使是Linux客户端，也可以实现Kerberos单点登录。关于Linux环境下的Kerberos，请参阅第6章《网络身份认证——Kerberos》。

根据你在YaST中选用的不同模块配置Kerberos身份认证，会有不同的客户端组件处理账户与身份认证数据。

### 基于SSSD的方案

`sssd`守护进程是这套方案的核心。它负责和Active Directory服务器的全部通信。

- 名称服务信息由`sssd_nss`获取。
- 用户身份认证使用PAM模块`pam_sss`。
- Active Directory用户在Linux客户端上创建家目录，由`pam_mkhomedir`处理。
更多PAM相关信息参阅第2章《使用PAM进行身份认证》。

### 基于Winbind（Samba）的方案

`winbindd`守护进程是这套方案的核心。它负责和Active Directory服务器的全部通信。

- 名称服务信息由`nss_winbind`获取。
- 用户身份认证使用PAM模块`pam_winbind`。
- Active Directory用户在Linux客户端上创建家目录，由`pam_mkhomedir`处理。
更多PAM相关信息参阅第2章《使用PAM进行身份认证》。

> 
> 图7.1：基于Winbind的Active Directory身份认证架构
> 支持PAM的应用程序（如登录程序、GNOME显示管理器GDM），通过PAM、NSS层，完成对Windows服务器的身份认证。支持Kerberos的应用程序（文件管理器、网页浏览器、邮件客户端等）使用Kerberos凭证缓存，获取用户的Kerberos票据，以此构成单点登录框架。

### 7.2.1 域加入

加入域的过程中，服务器和客户端会建立安全关联。在客户端上需要完成如下任务，以此接入Windows域控制器提供的LDAP与Kerberos SSO环境。整个加入流程由YaST的「域成员身份」模块处理，该模块可以在系统安装阶段，或是已经装好的系统中运行。

1. 定位同时提供LDAP和KDC（密钥分发中心）服务的Windows域控制器。
2. 在目录服务中，为将要加入域的客户端创建一台计算机账户。
3. 获取客户端的初始票据授予票据（TGT），并存入本地Kerberos凭证缓存。客户端需要这张TGT才能获取后续票据，用来访问其他服务，例如向目录服务器发起LDAP查询。
4. 修改NSS与PAM配置，让客户端可以向域控制器完成身份认证。

客户端开机时，`winbind`守护进程启动，获取计算机账户的初始Kerberos票据。`winbindd`会自动刷新计算机票据，保证票据始终有效。为了持续跟踪当前账户策略，`winbindd`会定期查询域控制器。

### 7.2.2 域登录与用户家目录

GNOME的登录管理器（GDM）已经做了扩展，支持Active Directory域登录。用户既可以选择登录本机所加入的主域，也可以登录主域信任的受信域。

身份认证由第7.2节介绍的多个PAM模块协同完成。如出现错误，错误代码会转换为可读提示，PAM会通过GDM、控制台以及SSH等各类登录方式向用户展示：

- **密码已过期**：提示用户密码已过期，需要修改。系统提示输入新密码，如果新密码不符合企业密码策略（例如太短、过于简单，或是已经在历史密码列表中），会给出提示。如果密码修改失败，会告知失败原因，再次提示输入新密码。
- **账户已禁用**：提示账户已被禁用，请联系系统管理员。
- **账户已锁定**：提示账户被锁定，请联系系统管理员。
- **必须修改密码**：用户可以登录，但会收到密码即将过期的警告。该警告会在密码到期前三天弹出。密码彻底过期之后，用户将无法登录。
- **工作站受限**：当用户被限制只能从特定工作站登录，而当前openSUSE Leap机器不在允许列表中时，提示无法从该主机登录。
- **登录时段受限**：当用户仅允许工作时段登录，而在非工作时间尝试登录时，提示此时不允许登录。
- **账户已到期**：管理员为特定用户账户设置过期时间，用户在过期后尝试登录，会提示账户已到期，无法使用。

身份认证成功之后，客户端从Active Directory的Kerberos服务器获取票据授予票据（TGT），存入用户凭证缓存。后台会自动续期TGT，不需要用户操作。

openSUSE Leap支持为Active Directory用户生成本地家目录。如果在YaST中按7.3节配置好，Windows/Active Directory用户第一次登录Linux客户端时就会自动创建家目录。这些家目录的表现和标准Linux用户家目录完全独立，不依赖Active Directory域控制器。

使用本地家目录，配合离线身份认证配置，就算Active Directory服务器断开连接，用户依旧可以访问本机数据。

### 7.2.3 离线服务与策略支持

企业环境下的用户需要可以作为漫游用户（例如切换网络，甚至完全断开网络）。为了支持断开网络时登录机器，`winbind`守护进程内置大量缓存机制。就算处于离线状态，`winbind`依旧强制执行密码策略。它会跟踪登录失败次数，并按照Active Directory配置的策略做出响应。离线支持默认关闭，必须在YaST的「域成员身份」模块手动开启。

域控制器不可用时，用户依旧可以凭借断网前获取的有效Kerberos票据访问其他网络资源（和Windows行为一致）。但密码修改操作必须等到域控制器在线才能执行。断开网络时，用户无法访问存储在Active Directory服务器上的数据。之后重新接入企业网络，当用户锁屏再解锁桌面（例如屏幕保护程序）时，openSUSE Leap会重新获取新的Kerberos票据。

## 7.3 将Linux客户端配置为Active Directory客户端

客户端加入Active Directory域之前，必须调整网络配置，保证客户端与服务器正常交互。

1. **DNS**
配置客户端机器，使用可以把DNS请求转发给Active Directory DNS服务器的DNS服务器。或者直接将Active Directory DNS服务器作为本机名称服务数据源。
2. **NTP**
要让Kerberos身份认证正常工作，客户端时间必须准确。建议使用一台中央NTP时间服务器（可以直接使用Active Directory域控制器上运行的NTP服务）。如果Linux主机和域控制器之间时钟偏差超过阈值，Kerberos认证失败，客户端会降级使用安全性更弱的NTLM（NT LAN Manager）身份认证。更多关于Active Directory时间同步，参阅7.3.3节「使用Windows域成员身份加入Active Directory域」。
3. **防火墙**
浏览网络邻居时，要么完全关闭防火墙，要么把浏览所用网络接口划入内部区域。

修改客户端防火墙设置的操作：以root登录，启动YaST防火墙模块，选择「接口」，在列表选中网络接口，点击修改，选择内部区域，确定保存，点击下一步、完成。如果要关闭防火墙，取消勾选「防火墙自动启动」，点击下一步、完成。

4. **Active Directory账户**
没有Active Directory管理员提供的合法用户账户，你无法登录Active Directory域。请使用Active Directory用户名和密码，从Linux客户端登录域。

### 7.3.1 选择YaST模块连接Active Directory

YaST提供多个模块，用来连接Active Directory：

1. **用户登录管理（User logon management）**
同时使用身份服务（一般为LDAP）和用户身份认证服务（一般为Kerberos）。该模块基于SSSD，绝大多数场景下最适合加入Active Directory域。
该模块参阅7.3.2节「使用用户登录管理加入Active Directory域」。
2. **Windows域成员身份（Windows domain membership）**
加入Active Directory域（同时使用Kerberos与LDAP）。该模块基于winbind，如果你需要NTLM支持或者跨林信任，则优先选用本模块。
该模块参阅7.3.3节「使用Windows域成员身份加入Active Directory域」。

### 7.3.2 使用用户登录管理加入Active Directory域

YaST的「用户登录管理」模块支持对Active Directory进行身份认证。同时也支持下面相关的身份识别与身份认证提供程序。

**身份识别提供程序**

- 委托给第三方软件库
- 通过代理支持传统NSS提供程序
- FreeIPA：FreeIPA与红帽企业身份管理提供程序
- 通用目录服务（LDAP）：LDAP提供程序，参阅`man 5 sssd‑ldap`
- SSSD本地文件数据库：SSSD内部本地用户提供程序

**身份认证提供程序**

- 委托给第三方软件库，通过代理中继身份认证到另一个PAM目标
- FreeIPA：FreeIPA与红帽企业身份管理提供程序
- 通用目录服务（LDAP）：LDAP提供程序
- 通用Kerberos服务：Kerberos身份认证
- SSSD本地文件数据库：SSSD内部本地用户
- 此域不提供身份认证服务：显式关闭身份认证

> 
> 流程7.1：使用用户登录管理模块加入Active Directory域

1. 打开YaST。
2. 如需后续DNS自动发现，将Active Directory域控制器设置为客户端的名称服务器。
 a. 在YaST中点击「网络设置」。
 b. 选择「主机名/DNS」，在名称服务器1填入Active Directory域控制器IP地址。
 c. 点击确定保存设置。
3. 在YaST主界面，启动「用户登录管理」模块。界面展示本机不同网络属性以及当前正在使用的身份认证方式。

> 
> 图7.2：用户登录管理主窗口

4. 点击「更改设置（Change Settings）」开始编辑。
5. 加入域：
 a. 点击「添加域（Add Domain）」。
 b. 在弹出对话框填写正确的域名。身份识别数据与身份认证服务均选择**Microsoft Active Directory**。勾选「启用该域（Enable the domain）」。点击确定。
 c.（可选）后续对话框可以保留默认值，但以下场景需要修改：
 - 如果本机主机名和域控制器上登记的主机名不一致：执行`hostname`查看本机主机名，和Active Directory域控制器上登记的主机名对比。如果两者不同，在AD hostname填入域控制器登记的主机名。如不需要，留空。
 - 如果不想使用DNS自动发现：填写Active Directory服务器主机名，多台服务器使用逗号分隔。
 d. 点击确定继续。
 如果缺少软件包，系统会自动安装缺失组件，之后检查配置的Active Directory域控制器是否可达。
 e. 配置无误后，对话框显示已经发现Active Directory服务器，状态为尚未注册（Not yet enrolled）。填入Active Directory管理员账户（Administrator）的用户名与密码。
 如需让Samba和这个AD协同工作，勾选「覆盖Samba配置以适配此AD」。点击确定完成注册。

> 
> 图7.3：注册加入域

```
f. 弹出注册成功提示，点击确定完成。
```

6. 注册完成之后，在「管理域用户登录」窗口配置客户端。

> 
> 图7.4：域用户登录管理配置窗口

```
a. 勾选「允许域用户登录（Allow Domain User Logon）」，允许使用Active Directory提供的登录凭证登录本机。
b.（可选）在「启用域数据源」下，按需开启额外数据源，例如sudo相关用户信息、网络驱动器、SSH公钥等。
c. 勾选「创建家目录（Create Home Directories）」，让Active Directory用户拥有本地家目录。家目录路径可以在客户端配置，也可以在服务器配置，两者均可。
    - 在域控制器配置家目录路径：为每个用户设置`UnixHomeDirectory`属性。确保该属性会复制到全局编录。参阅微软知识库文章 https://support.microsoft.com/en‑us/kb/248717。
    - 客户端侧配置，优先使用服务器设置的路径：使用`fallback_homedir`选项。
    - 客户端侧配置，强制覆盖服务器路径：使用`override_homedir`选项。

域控制器侧配置不在本文档范围内，下面只描述客户端配置：
在侧边栏选中「服务选项」→「名称切换」，点击「扩展选项（Extended Options）」。选中`fallback_homedir`或者`override_homedir`，点击添加。填入对应值。例如格式`/home/%u`代表`/home/用户名`。更多变量参阅手册`man 5 sssd.conf`中`override_homedir`小节。
点击确定。
```

7. 点击确定保存全部修改，确认显示的值无误。点击取消关闭对话框。

### 7.3.3 使用Windows域成员身份加入Active Directory域

> 
> 流程7.2：使用Windows域成员身份模块加入Active Directory域

1. 以root登录，启动YaST。
2. 打开「网络服务」→「Windows域成员身份」。

> 
> 图7.5：设置Windows域成员身份

3. 在「域或工作组」输入要加入的域。如果本机DNS设置和Windows DNS服务器集成良好，填写Active Directory域的DNS格式域名（`mydomain.mycompany.com`）。如果填写Windows 2000之前的短域名，YaST只能依靠NetBIOS名称解析查找域控制器。
4. 勾选「同时使用SMB信息进行Linux身份认证」。
5. 勾选「登录时创建家目录」，让Active Directory用户登录Linux机器时自动创建本地家目录。
6. 勾选「离线身份认证」，即便是Active Directory服务器临时不可达、本机没有网络，域用户依旧可以登录。
7. 点击「高级设置」，可以修改Samba用户与用户组的UID/GID范围。只有部分机器只能靠WINS解析，才需要让DHCP获取WINS服务器。
8. 点击「NTP配置」配置Active Directory环境的NTP时间同步，填写合适的服务器主机名或者IP。如果你已经在独立的YaST NTP配置完成设置，本步骤可以跳过。
9. 点击确定。出现提示时确认加入域。
10. 输入Windows管理员在Active Directory服务器上的密码，点击确定。

> 
> 图7.6：提供管理员凭证

> 
> 重要：域名
> 如果域名以`.local`结尾，加入域可能失败。`.local`是多播DNS（MDNS）的保留后缀，会产生冲突。

> 
> 注意：只有管理员账户可以将计算机加入域
> 必须使用域管理员账户，例如Administrator，才能将openSUSE Leap机器加入Active Directory域。

### 7.3.4 检查Active Directory连接状态

想要确认是否成功注册加入Active Directory域，可以使用下面命令：

- `klist`：查看当前用户是否持有有效的Kerberos票据。
- `getent passwd`：查看所有已经发布的LDAP用户数据。

## 7.4 登录Active Directory域

只要机器配置完成Active Directory身份认证，并且你拥有合法Windows用户身份，就可以使用Active Directory凭证登录本机。GNOME图形会话、控制台、SSH，以及所有支持PAM的应用都支持该登录方式。

> 
> 重要：离线身份认证
> openSUSE Leap支持离线身份认证，就算机器离线，也可以登录客户端。参阅7.2.3节「离线服务与策略支持」。

### 7.4.1 GDM图形登录

在GNOME客户端向Active Directory服务器做身份认证，操作步骤：

1. 点击「未列出（Not listed）」。
2. 在用户名输入框，按照格式 `域名\用户名` 输入。
3. 输入Windows密码。

配置开启后，每个Active Directory用户第一次登录时，openSUSE Leap会在本地创建家目录。这样既可以使用Active Directory，同时机器依旧是功能完整的Linux系统。

### 7.4.2 控制台登录

除图形界面登录，也可以在文本控制台或者远程SSH登录。

控制台登录：在登录提示符输入 `域名\用户名`，再输入密码。

SSH远程登录：

1. 执行命令：

```
ssh DOMAIN_NAME\\USER_NAME@HOST_NAME
```

反斜杠需要再写一个反斜杠完成转义。
2. 输入用户密码。

## 7.5 修改密码

openSUSE Leap帮助用户设置符合企业安全策略的新密码。底层PAM模块从域控制器读取当前密码策略，登录时向用户展示密码质量要求。

除非全部策略条件满足，否则密码修改操作无法成功。图形显示管理器和控制台都会反馈密码状态。

GDM会处理密码过期提示和新密码交互。

可以直接使用Linux标准工具`passwd`修改Windows密码，无需操作服务器。修改Windows密码步骤：

1. 在控制台登录。
2. 执行`passwd`。
3. 输入当前密码。
4. 输入新密码。
5. 再次输入新密码确认。

如果新密码不符合Windows服务器策略，会给出提示，要求重新输入。

从GNOME桌面修改Windows密码：

1. 点击左侧面板计算机图标。
2. 选择控制中心。
3. 在「个人」分类，选择「关于我」→「修改密码」。
4. 输入旧密码。
5. 输入并确认新密码。
6. 点击关闭保存修改。

## 7.6 Active Directory证书自动注册

证书自动注册允许网络设备（包括openSUSE Leap主机）无需人工干预，自动从Active Directory证书服务申请获取证书。该功能通过Active Directory组策略，使用Samba的`samba‑gpupdate`命令完成管理。

### 7.6.1 在服务器端配置证书自动注册

Windows服务器必须安装角色：证书颁发机构、证书注册策略Web服务、证书注册Web服务、网络设备注册服务。

按照微软官方文档配置组策略自动注册：
[https://docs.microsoft.com/en‑us/windows‑server/networking/core‑network‑guide/cncg/server‑certs/configure‑server‑certificate‑autoenrollment](https://docs.microsoft.com/en%E2%80%91us/windows%E2%80%91server/networking/core%E2%80%91network%E2%80%91guide/cncg/server%E2%80%91certs/configure%E2%80%91server%E2%80%91certificate%E2%80%91autoenrollment)

### 7.6.2 在客户端启用证书自动注册

> 
> 流程：在客户端启用证书自动注册

1. 安装软件包`samba‑gpupdate`。该包会自动安装依赖`certmonger`、`cepces`、`sscep`。Samba使用sscep下载CA根证书链，再结合certmonger与cepces监控主机证书模板。
2. 机器必须已经加入Active Directory域（域控制器已经配置好证书颁发机构）。
3. 如果是通过winbind加入域：修改`smb.conf`全局配置，添加一行：

```
apply group policies = yes
```

4. 如果是SSSD加入域：安装`oddjob‑gpupdate`，项目地址：[https://github.com/openSUSE/oddjob‑gpupdate。](https://github.com/openSUSE/oddjob%E2%80%91gpupdate%E3%80%82)
5. 执行下面命令验证证书自动注册配置：

```
/usr/sbin/samba‑gpupdate --rsop
```

输出示例代表配置正常：

```
Resultant Set of Policy
Computer Policy
GPO: Default Domain Policy
==========================================================
CSE: gp_cert_auto_enroll_ext
Policy Type: Auto Enrollment Policy
[ <CA NAME> ] =
[ CA Certificate ] =
----BEGIN CERTIFICATE----
<CERTIFICATE>
----END CERTIFICATE----
[ Auto Enrollment Server ] = <DNS NAME>
```

6. 使用命令查看已安装证书：

```
getcert list
```

输出示例：

```
Number of certificates and requests being tracked: 1.
Request ID 'Machine':
status: MONITORING
stuck: no
key pair storage: type=FILE,location='/var/lib/samba/private/certs/Machine.key'
certificate: type=FILE,location='/var/lib/samba/certs/Machine.crt'
CA: <CA NAME>
issuer: CN=<CA NAME>
subject: CN=<HOSTNAME>
expires: 2017‑08‑15 17:37:02 UTC
dns: <hostname>
key usage: digitalSignature,keyEncipherment
eku: id‑kp‑clientAuth,id‑kp‑serverAuth
certificate template/profile: Machine
```

证书安装路径：

- 证书：`/var/lib/samba/certs`
- 私钥：`/var/lib/samba/private/certs`

更多信息参阅手册 `man samba‑gpupdate`。

# 第二部分 本地安全
# 第9章 物理安全
物理安全十分重要。Linux生产服务器应当放置在经过安检人员管控、上锁的数据中心内。同时还需要思考一些问题：
- 谁可以物理接触这台主机？
- 这些接触人员是否应当拥有这种权限？
- 能否保护系统免遭篡改，是否应当这么做？

一套系统所需要的物理安全防护级别取决于实际场景，可用资金不同，防护程度也会差异巨大。

## 9.1 系统锁
数据中心内绝大多数服务器机柜都带有锁具。机柜前门上装有搭扣式圆柱锁，插入钥匙就可以上锁或者解锁，以此准许/拒绝人员访问机柜内部。机柜笼锁可以防止有人篡改、窃取设备与存储介质，或是打开机箱直接对硬件进行破坏、蓄意破坏服务器。同时也要防范服务器被重启，或是从外接设备（例如CD、DVD、闪存U盘）引导启动。

部分服务器配备机箱锁。机箱锁根据厂商设计不同，实现的功能也各不相同。许多系统在未解锁状态下尝试打开机箱会自行禁用部分功能。另一些机箱锁会禁止插拔键盘鼠标。虽然锁具备一定防护作用，但质量参差不齐，很容易被有心攻击者绕过。

## 9.2 锁定BIOS
> 提示：安全启动
> 本节描述保护引导流程的基础方法。想要了解使用UEFI安全启动实现更高级别的引导防护，请参阅参考手册第14章《UEFI（统一可扩展固件接口）》14.1节「安全启动」。

BIOS（基本输入输出系统）或者它的继任者UEFI（统一可扩展固件接口）是PC类系统层级最低的软件/固件。其他硬件架构（POWER、IBM Z）上运行的Linux也有执行类似功能的底层固件。本文档中提到BIOS时，同时指代BIOS和/或UEFI。BIOS完成系统配置，将系统设置为定义好的状态，并提供访问底层硬件的例程。BIOS会执行配置好的Linux引导加载程序（例如GRUB 2），以此启动主机。

绝大多数BIOS实现都可以配置，阻止未授权用户篡改系统与引导设置。典型手段是设置BIOS管理员密码或者引导密码。管理员密码用于修改系统配置；引导密码则在每一次正常开机启动时都要求输入。大多数场景，只需要设置管理员密码，并限制仅能从本机内置硬盘引导。这样攻击者就无法简单地通过Linux Live光盘、闪存U盘启动系统。虽然这无法实现最高等级安全（BIOS可以被重置、拆除或是篡改，前提是攻击者能够接触机箱），但依然可以起到威慑作用。

很多BIOS固件还包含其他安全相关设置。查阅硬件厂商系统文档，或是开机时进入BIOS查看，了解更多相关选项。

> 重要：设置BIOS引导密码后的开机行为
> 如果系统设置了引导密码，主机将无法无人值守开机启动（例如发生系统重启、断电故障时）。这是需要权衡取舍的弊端。

> 重要：遗忘BIOS管理员密码
> 系统初次部署完成后，BIOS管理员密码并不需要频繁使用。千万不要遗忘该密码，否则你可能需要通过硬件操作清除BIOS内存，才能重新获得访问权限。

## 9.3 通过引导加载程序实现安全防护
openSUSE Leap 默认使用的Linux引导加载程序 GRUB 2 可以设置引导密码。该密码功能可以做到：只有管理员才可以执行交互式操作（例如编辑菜单项、进入命令行界面）。

如果设置了密码，在按下C或者E进行交互操作前，GRUB 2会要求输入正确密码。

可以参考GRUB 2的手册页查看示例。

务必记住，设置密码只是延缓入侵行为，不一定能够完全阻止入侵。攻击者依旧可以从可移动介质启动，挂载你的根分区。如果你同时使用BIOS安全设置与引导加载程序密码，建议在BIOS中禁用从可移动设备启动，并且给BIOS本身设置密码。

同时需要保护引导加载程序配置文件，将权限修改为600（仅root可读可写），否则其他人可以读取你的密码与哈希值。

## 9.4 淘汰存有敏感数据的Linux服务器
安全策略会规定处理即将退役、待处置存储介质的流程。磁盘擦除操作是经常被要求执行的操作，也可以对介质做物理销毁。互联网上可以找到许多免费工具。搜索“dod disk wipe utility”可以找到多种实现版本。

淘汰存有敏感数据的服务器时，必须确保硬盘上的数据无法被恢复。为彻底抹除所有数据痕迹，可以使用擦除工具，例如 `scrub`。很多擦除工具会对磁盘执行多次覆写。这样即便攻击者使用复杂手段，也很难恢复被擦除的数据。部分工具可以从可引导移动介质运行，依据美国国防部（DoD）标准完成数据擦除。

许多政府机构制定了自己的数据安全标准。部分标准防护强度更高，但执行耗时也更长。

> 重要：具备损耗均衡功能的设备擦除注意事项
> SSD这类设备使用损耗均衡技术，数据不一定会写入相同物理位置。这类设备拥有自身专用擦除功能。

### 9.4.1 scrub：磁盘覆写工具
`scrub`可以使用重复模式覆写硬盘、文件和其他块设备，增大从这些设备恢复数据的难度。它支持三种基础工作模式：字符/块设备模式、文件模式、指定目录模式。更多信息参阅手册页 `man 1 scrub`。

**scrub支持的擦除方法**
- nnsa
4‑轮 NNSA 政策文件 NAP‑14.1‑C (XVI‑8)，用于清理可移动与非可移动硬盘：两次伪随机模式覆写，一次0x00，最后校验：随机（2次）、0x00、校验。
- dod
4‑轮 DoD 5220.22‑M 第8‑306节流程(d)，清理可移动与非可移动刚性磁盘。对全部可寻址位置依次写入一个字符、其按位取反值、随机字符，之后执行校验。注意：scrub会优先执行随机轮次，简化校验：随机、0x00、0xff、校验。
- bsi
德国联邦信息安全局推荐的9轮覆写方案：0xff, 0xfe, 0xfd, 0xfb, 0xf7, 0xef, 0xdf, 0xbf, 0x7f。
- gutmann
Gutmann论文中描述的经典35轮覆写序列。
- schneier
Bruce Schneier在《应用密码学》(1996)提出的7‑轮方案：0x00、0xff、随机（5次）。
- pfitzner7
Roy Pfitzner的7次随机覆写方案：随机（7次）。
- pfitzner33
Roy Pfitzner的33次随机覆写方案：随机（33次）。
- usarmy
美国陆军 AR380‑19 方案：0x00、0xff、随机。（与DoD 5220.22‑M流程(e)清理磁芯内存的方案一致）
- fillzero
单轮覆写：全部写入0x00。
- fillff
单轮覆写：全部写入0xff。
- random
单轮覆写：全部写入随机数据。
- random2
两轮覆写：全部写入随机数据（2次）。
- old
1.7版本之前的旧版6轮scrub方案：0x00，0xff，0xaa，0x00，0x55，校验。
- fastold
5轮旧方案：0x00，0xff，0xaa，0x55，校验。
- custom=string
单轮自定义模式。字符串支持C语言数字转义格式：八进制 `\nnn` 或者十六进制 `\xnn`。

## 9.5 限制可移动介质访问
部分业务环境需要限制对USB存储、光盘等可移动介质的访问。`udisks2`软件包附带的工具可以完成该配置。

1. 创建用户组，授予该组内用户挂载与弹出可移动设备的权限，例如组名为`mmedia_all`：
```bash
sudo groupadd mmedia_all
```
2. 将指定用户tux加入新建用户组：
```bash
sudo usermod -a -G mmedia_all tux
```
3. 创建 `/etc/polkit‑1/rules.d/10‑mount.rules` 文件，内容如下：
```javascript
polkit.addRule(function(action, subject) {
if (action.id =="org.freedesktop.udisks2.eject-media"
&& subject.isInGroup("mmedia_all")) {
return polkit.Result.YES;
}
});

polkit.addRule(function(action, subject) {
if (action.id =="org.freedesktop.udisks2.filesystem-mount"
&& subject.isInGroup("mmedia_all")) {
return polkit.Result.YES;
}
});
```

> 重要：规则文件命名
> 规则文件名必须以数字开头，否则会被忽略。
> 规则文件按字母顺序处理。函数按添加顺序执行，直到返回某个结果。因此，如果希望你的授权规则优先于其他规则，文件名排序要比其他规则靠前，例如 `/etc/polkit‑1/rules.d/10‑mount.rules`。每个函数返回值为 `polkit.Result` 的其中一种。

4. 重启udisks2服务：
```bash
systemctl restart udisks2
```
5. 重启polkit服务：
```bash
systemctl restart polkit
```

## 9.6 通过USBGuard强制USB设备授权，实现系统防护
USBGuard软件框架借助强制USB设备授权机制保护你的系统。它可以基于设备属性实现白名单与黑名单功能。

USBGuard具备以下特性：
- 命令行接口，用于与正在运行的USBGuard守护进程交互
- 守护进程组件，带有进程间通信（IPC）接口，实现动态交互与策略强制生效
- 用于编写USB设备授权策略的规则语言
- 以共享库实现、与守护进程交互的C++ API

### 9.6.1 安装USBGuard
USBGuard守护进程依据策略内定义的一组规则，决定哪些USB设备获得授权。使用下面命令安装配置USBGuard：

1. 安装USBGuard：
USBGuard及其所需依赖会被安装。如果你希望与USBGuard服务交互，可以额外安装`usbguard‑tools`工具包。

2. 基于当前已经连接的USB设备生成一套规则集，切换至root身份：
```bash
usbguard generate-policy > /etc/usbguard/rules.conf
```

> 注意
> 你可以编辑 `/etc/usbguard/rules.conf` 文件来自定义USBGuard策略。

3. 启动USBGuard守护进程，设置开机自启，root下执行：
```bash
systemctl enable --now usbguard.service
```

4. 你可以授权或者取消授权设备与系统交互。行为取决于配置文件`usbguard‑daemon.conf`内`ImplicitPolicyTarget`选项的值。
```bash
usbguard allow-device 6
usbguard block-device 6
```
也可以使用`reject‑device`选项，取消授权并且把设备从系统移除。

> 提示：执行 `usbguard --help` 查看全部选项。

### 9.6.2 USBGuard使用方法
你可以配置安全策略，基于设备属性实现黑白名单，强制USB设备授权，以此保护系统。

#### 9.6.2.1 USBGuard配置文件
USBGuard守护进程解析完命令行参数后，加载配置文件`usbguard‑daemon.conf`。该文件默认路径为 `/etc/usbguard/usbguard‑daemon.conf`。部分配置选项说明：

**OPTIONS 选项**
- `RuleFile=PATH`
USBGuard守护进程从该文件加载策略规则集，同时也会通过IPC接口把新规则写入该文件。默认值：`%sysconfdir%/usbguard/rules.conf`。

- `ImplicitPolicyTarget= TARGET`
如何处理策略中没有匹配到任何规则的设备。
`allow` — 授权所有当前接入设备
`block` — 取消授权所有当前接入设备
`reject` — 从系统逻辑上移除设备节点

- `PresentDevicePolicy= POLICY`
守护进程启动时已经接入系统的设备如何处理。
`allow` — 授权所有已接入设备
`block` — 取消授权所有已接入设备
`reject` — 移除所有已接入设备
`keep` — 同步内部状态
`apply‑policy` — 对全部已接入设备评估规则集

- `IPCAllowedUsers= USERNAME`
空格分隔用户名列表，守护进程接受来自这些用户的IPC连接。

- `IPCAllowedGroups= GROUPNAME`
空格分隔用户组名列表，守护进程接受来自这些用户组的IPC连接。

- `IPCAccessControlFiles= PATH`
IPC访问控制定义文件路径。

> 示例9.1：配置片段
```
IPCAllowedUsers=root joe
IPCAllowedGroups=wheel
```
该示例允许root、joe用户，以及wheel组全部成员完整访问IPC接口。

### 9.6.3 更多参考资料
更多USBGuard相关资料：
- 上游官方文档：https://usbguard.github.io/
- 手册页：
`man usbguard`
`man usbguard‑rules.conf`
`man usbguard‑daemon`
`man usbguard‑daemon.conf`

# 第10章 软件管理
## 10.1 移除不必要的软件包（RPM软件包）
加固Linux系统的一项重要步骤，就是明确Linux服务器的主要功能或角色。如果做不到这一点，就很难确定需要保护哪些内容，针对这些Linux系统开展安全加固工作也会收效甚微。因此，务必仔细审视软件包的默认安装列表，移除任何不必要的软件包，或是不符合既定安全策略的软件包。

一般而言，一个RPM软件包由以下几部分构成：
1. 软件包元数据：安装时写入RPM数据库。
2. 软件包包含的文件与目录。
3. 在安装前、安装后以及卸载时执行的脚本。

软件包本身通常并不会带来安全风险，除非它包含以下任意一种情况：
1. 已安装文件上设置了SUID或者SGID权限位
2. 具备组可写或全局可写权限的文件或目录
3. 安装完成即自动激活、或是默认启用的服务

假设以上三种情况均不存在，那么软件包就仅仅是一批文件的集合。安装或卸载这类软件包不会对系统的安全状态造成任何影响。

即便如此，将系统上安装的软件包数量控制在最低限度仍是一项最佳实践。这样做会减少需要更新的软件包数量，在收到安全预警和安全补丁时，简化维护工作。对于生产服务器，最佳实践是不要安装开发软件包或者桌面软件包（例如X服务器）。如果业务不需要，也不应当安装Apache网页服务器、Samba文件共享服务器等软件。

> 重要：第三方安装程序的依赖需求
> 许多第三方厂商（例如Oracle、IBM）的安装程序，都要求系统具备桌面环境以及开发库。为避免这一点对生产服务器安全造成影响，很多组织会在开发测试环境创建静默应答安装文件。

另外，除非有合理业务理由，否则不应安装FTP、Telnet守护进程。应当改用ssh、scp或sftp作为替代。

首要操作之一，就是生成一份Linux镜像，该镜像仅包含系统与应用必需的RPM软件包，同时包含用于维护和故障排查所需的工具软件。

一种可行方案：从最小化RPM软件包列表开始，再按需添加软件包。

生成全部已安装软件包的列表，请使用下面的命令：
```bash
zypper packages -i
```

查看某个特定软件包的详细信息，请执行：
```bash
zypper info PACKAGE_NAME
```

在删除软件包前，检查并报告潜在冲突与依赖关系：
```bash
# zypper rm -D PACKAGE_NAME
```
如果不先做测试，直接执行删除命令，经常会输出大量报错，还需要人工递归处理依赖关系，该命令对此十分有用。

> 重要：移除系统必需软件包
> 删除软件包时务必要小心，不要移除系统必需软件包。这有可能让系统陷入损坏状态，导致系统无法启动、无法修复。如果你没有把握，在开始删除操作之前，最好对系统做完整备份。

若要最终移除一个或多个软件包，使用带 `-u` 参数的zypper命令，该参数会同时删除不再被依赖的无用依赖包：
```bash
# zypper rm -u PACKAGE_NAME
```

## 10.2 给Linux系统打补丁
搭建补丁管理基础设施，是主动保障Linux生产环境安全的另一项重要工作。

建议编写书面的安全策略与处理流程，用于处理Linux安全更新和各类安全问题。例如，安全策略中应当写明评估、测试、上线补丁的时间周期。涉及网络的安全漏洞优先级最高，需要在短时间内立即处理。评估阶段应当在测试实验室完成，初始上线操作优先在开发系统执行。单独的安全日志文件，应当记录收到过哪些Linux安全公告、哪些补丁已经调研评估、补丁的安装时间等内容。

SUSE将补丁分为三类：安全类、推荐类、可选类。有多种方式可以保持系统打补丁、版本最新、保障安全。每一套系统完成注册后，就可以通过SUSE更新网站获取更新，使用内置的YaST工具——YaST在线更新。SUSE还开发了RMT（仓库镜像工具），这是一套高效工具，用于维护本地补丁/更新/修复程序仓库，让系统从本地拉取更新，减少互联网流量。SUSE还提供SUSE Manager，用于对Linux系统（不只是SUSE发行版，还包括其他发行版）做维护、打补丁、报告、集中管理。

### 10.2.1 YaST在线更新
单台服务器可以使用YaST在线更新工具完成重要更新与功能改进。openSUSE Leap的当前更新，存放在产品专属更新目录，目录中包含各类补丁。使用YaST执行安装，在软件分组中选择「在线更新」。除可选补丁外，当前可用的全部新补丁，都会被标记为待安装。点击「接受」，就会自动安装这些补丁。

### 10.2.2 自动在线更新
YaST还支持配置自动更新。选择「软件」→「自动在线更新」。配置为每日更新或者每周更新。部分补丁（例如内核更新）需要人工交互，会导致自动更新流程中断。勾选「跳过交互式补丁」，更新流程就可以自动继续执行。

在这种情况下，需要不定期手动执行在线更新，安装那些需要交互的补丁。如果勾选「仅下载补丁」，补丁只会在指定时间下载，不会安装，必须使用rpm或者zypper手动安装。

# 第11章 文件管理
## 11.1 磁盘分区
服务器至少应当为 `/`、`/boot`、`/var`、`/tmp` 和 `/home` 使用独立文件系统。这样可以防止例如 `/var` 和 `/tmp` 下的日志空间、临时空间占满根分区。第三方应用程序也应当放置在独立的文件系统上，例如放在 `/opt` 下。

使用独立文件系统的另一个优势是可以为文件系统层级中的某些部分选择合适的特殊挂载选项。挂载选项包括：
- `noexec`：禁止执行文件。
- `nodev`：禁止字符或块特殊设备生效。
- `nosuid`：禁止 set‑user‑ID 或 set‑group‑ID 位生效。
- `ro`：将文件系统以只读方式挂载。

在应用这些分区挂载选项前，必须仔细斟酌。应用之后，应用程序可能会停止工作，也可能会违反技术支持状态。正确使用挂载选项可以抵御某些类型的安全攻击或错误配置。例如，`/tmp` 目录下不应当存在 set‑UID 二进制程序。

理解区分那些会影响正在运行的系统的分区十分重要（例如，`/var/log` 日志文件写满根分区，就是将 `/var` 与 `/` 分开的充分理由）。另外，你需要使用 LVM 或其他卷管理器，或者至少使用扩展分区类型，来规避 PC 架构最多只能有4个主分区的限制。

openSUSE Leap 还支持对分区甚至单个目录或文件作为容器进行加密。更多信息参见第12章《加密分区和文件》。

## 11.2 修改特定系统文件的权限
许多文件，尤其是 `/etc` 目录下的文件，对全部用户可读，代表非特权用户可以读取其内容。通常这不会造成问题，但为了更高的安全级别，可以移除敏感文件的全局可读或组可读权限位。

openSUSE Leap 提供 `permissions` 软件包，方便应用文件权限。该软件包自带三套预定义系统配置文件：
- **easy**：面向需要图形用户交互的系统，是默认配置文件。
- **secure**：面向没有完整图形界面的服务器系统。
- **paranoid**：追求最高安全性。除 secure 配置之外，它会移除所有特殊权限，例如 setuid/setgid 以及能力位（capability bits）。

> ⚠️警告：非特权用户可能无法使用系统
> 如果没有特殊权限，除简单任务（例如修改密码）外，非特权用户可能无法正常使用系统。
> 不要直接原样使用 paranoid 配置文件，应把它作为自定义权限的模板。更多信息参见 permissions.paranoid 文件。

若要定义自定义文件权限，请编辑 `/etc/permissions.local`，或在 `/etc/permissions.d/` 目录下创建补充配置文件。
```conf
# Additional custom hardening
/etc/security/access.conf root:root 0400
/etc/sysctl.conf root:root 0400
/root/ root:root 0700
```
- 第一列指定文件名；目录名称必须以斜杠 `/` 结尾。
- 第二列指定所有者和所属用户组。
- 第三列指定权限模式。
更多配置文件格式信息，参见 `man permissions`。

在 `/etc/sysconfig/security` 中选择配置文件。若要使用 easy 配置以及来自 permissions.local 的自定义权限，请设置：
```conf
PERMISSION_SECURITY="easy local"
```

执行以下命令应用设置：
```bash
chkstat --system --set
```

软件包更新过程中也会通过 zypper 应用权限设置。你也可以通过 cron 或 systemd 定时器定期调用 chkstat。

> 重要：自定义文件权限
> 系统自带的配置文件经过充分测试，但自定义权限配置可能会破坏标准应用程序。SUSE 不会为此类场景提供技术支持。
> 在生产环境应用自定义权限前，务必先测试，确认所有功能符合预期。

## 11.3 将家目录权限从755修改为700
默认情况下，系统上所有用户都可以读取、执行其他用户的家目录。这会造成潜在的信息泄露，家目录应当仅允许其所有者访问。下面的命令会将 `/home` 下所有已存在家目录权限设置为 700（仅所有者可访问目录）：
```bash
sudo chmod 755 /home
sudo bash -c 'for dir in /home/*; do \
echo "Changing permissions of directory $dir"; chmod 700 "$dir"; done'
```

若要确保新创建的家目录使用安全权限，请编辑 `/etc/login.defs`，设置 `HOME_MODE` 为 `0700`。
```conf
# HOME_MODE is used by useradd(8) and newusers(8) to set the mode for new
# home directories.
# If HOME_MODE is not set, the value of UMASK is used to create the mode.
HOME_MODE 0700
```

> 注意：HOME_MODE 指定的是要使用的权限，而不是像 umask 那样用来删除权限的掩码。更多关于 umask 的信息参见11.4节《默认 umask》。

你可以创建测试用户验证配置变更：`useradd -m testuser`，使用 `ls -l /home` 查看目录权限。测试完成后删除该测试用户。

> ⚠️重要：测试权限变更
> 用户将不再能够访问其他用户的家目录。这对于用户和软件来说可能是非预期行为。
> 在投入生产使用前测试该变更，并通知受影响的用户。

## 11.4 默认 umask
`umask`（用户文件创建模式掩码）是 shell 内置命令，它决定新创建文件和目录的默认权限。部分系统调用可以覆盖该设置，但很多程序和工具会使用 umask。

默认 umask 值为 `022`。当至少有一位比特位被设置时，该值会从访问模式 777 中减去。

使用 umask 命令查看当前生效值：
```bash
umask
022
```

在默认 umask 下，可以看到大多数用户所期望的行为：
```bash
touch a
mkdir b
ls -on
total 16
-rw-r--r--. 1 17086 0 Nov 29 15:05 a
drwxr-xr-x. 2 17086 4096 Nov 29 15:05 b
```

你可以根据自身需求指定任意 umask 值：
```bash
umask 111
touch c
mkdir d
ls -on
total 16
-rw-rw-rw-. 1 17086 0 Nov 29 15:05 c
drw-rw-rw-. 2 17086 4096 Nov 29 15:05 d
```

基于你的威胁模型，可以使用更加严格的 umask，例如 `037`，用来防止意外的数据泄露。
```bash
umask 037
touch e
mkdir f
ls -on
total 16
-rw-r-----. 1 17086 0 Nov 29 15:06 e
drwxr-----. 2 17086 4096 Nov 29 15:06 f
```

> 💡提示：最高安全性
> 若追求最高安全性，可以使用 umask `077`。该设置强制新创建的文件和目录，对组用户和其他用户完全没有权限。
> 但这对于用户和软件来说可能是非预期行为，可能会增加支持团队的负担。

### 11.4.1 调整默认 umask
修改 `/etc/login.defs` 文件内的 `UMASK` 值，可以全局修改所有用户的 umask。
```conf
# Default initial "umask" value used by login(1) on non‑PAM enabled systems.
# Default "umask" value for pam_umask(8) on PAM enabled systems.
# UMASK is also used by useradd(8) and newusers(8) to set the mode for new
# home directories.
# 022 is the default value, but 027, or even 077, could be considered
# for increased privacy. There is no One True Answer here: each sysadmin
# must make up their mind.
UMASK 022
```

针对单个用户，可以在 `/etc/passwd` 的 gecos 字段中添加 umask，示例如下：
```
tux:x:1000:100:Tux Linux,UMASK=022:/home/tux:/bin/bash
```

你也可以通过 YaST 用户模块，在用户详情的「附加用户信息」中填入 `UMASK=022`。

`/etc/login.defs` 和 `/etc/passwd` 的设置由 PAM 模块 `pam_umask.so` 生效。更多配置选项参见 `man pam_umask`。

修改完成后，用户需要注销并重新登录，变更才会生效。登录后使用 umask 命令验证设置是否正确。

## 11.5 SUID / SGID 文件
当可执行文件设置了 SUID（设置用户ID）或 SGID（设置组ID）位，该程序会以文件所有者的 UID 或 GID 执行，而不是运行该程序的用户的UID/GID。

举例：所有者为 root 的带 SUID 位的可执行文件，运行时就会以 root 用户 UID 执行。典型例子是 passwd 命令，普通用户可以使用它更新 `/etc/shadow` 中属于 root 的密码字段。

当可执行程序存在安全漏洞时，SUID/SGID 位会被恶意利用。因此，应当在整个系统中搜索 SUID/SGID 可执行文件并做好记录。

使用下面命令，在指定目录下搜索设置 SUID 或 SGID 的文件：
```bash
find /bin /boot /etc /home /lib /lib64 /opt /root /sbin \
/srv /tmp /usr /var -type f -perm /6000 -ls
```
如果你的文件系统结构不同，需要扩展搜索目录列表。

SUSE 仅在确有必要的二进制程序上设置 SUID/SGID 位。务必确保开发人员，若非绝对必要，不要在程序上设置 SUID/SGID 位。通常可以采用变通方案，移除其他用户的执行权限。但更好的做法是修改软件设计，或者使用文件能力（capabilities）。

openSUSE Leap 支持文件能力，可以给程序授予细粒度权限，而不是完整的 root 权限。
```bash
getcap -v /usr/bin/ping
/usr/bin/ping = cap_net_raw+eip
```
上面这条命令为 ping 程序授予 CAP_NET_RAW 能力。即便 ping 存在漏洞，攻击者最多只能获取该能力，而不是完整的 root 权限。只要可行，优先选择文件能力，而不是 root 的 SUID。但这不适用于所有者不是 root 的 SUID，例如 news、lp 等用户。

## 11.6 全局可写文件
全局可写文件属于安全风险，系统上任意用户都可以修改这类文件。全局可写目录允许任何人新增或删除文件。

使用以下命令查找全局可写的普通文件和目录：
```bash
find /bin /boot /etc /home /lib /lib64 /opt /root /sbin \
/srv /tmp /usr /var -type f -perm -2 ! -type l -ls
```
根据你的文件系统结构，可能需要扩展搜索目录列表。

`! -type l` 参数排除符号链接。符号链接本身总是全局可写，但上面这条命令会校验链接指向的目标文件是否为全局可写，所以符号链接本身不会报警。

带粘滞位（sticky bit）的全局可写目录（例如 `/tmp`），除文件所有者之外，其他用户不能删除或重命名目录内的文件。粘滞位让文件“粘”在创建它的用户名下，阻止其他用户删除或重命名这些文件。因此，视目录用途而定，带粘滞位的全局可写目录不一定是问题。

示例查看 /tmp 权限：
```bash
ls -ld /tmp
drwxrwxrwt 18 root root 16384 Dec 23 22:20 /tmp
```
输出模式中的 `t` 代表粘滞位。

## 11.7 孤儿文件 / 无属主文件
没有被任何用户或用户组拥有的文件，本身不一定代表安全问题。但是无属主文件未来可能引发安全风险。举例：如果新建一个用户，恰好分配到和无属主文件相同的 UID，那么这个新用户会自动成为这些文件的所有者。

查找无用户属主、无组属主文件的命令：
```bash
find /bin /boot /etc /home /lib /lib64 /opt /root /sbin /srv /tmp /usr /var -nouser -o -nogroup
```
视你的文件系统结构，需要扩展搜索目录列表。

另一类问题：没有通过软件包管理器安装的文件，它们不会收到更新。使用下面命令找出这类文件：
```bash
find /bin /lib /lib64 /usr -path /usr/local -prune -o -type f -a -exec /bin/sh -c "rpm -qf {} &> /dev/null || echo {}" \;
```

> 提示：以非信任用户（例如 nobody）运行这条命令。因为精心构造的文件名可能触发命令执行。虽然这些目录只能由 root 写入，但采取这一步属于安全防范。

该命令输出 `/bin`、`/lib`、`/lib64`、`/usr` 下（排除 `/usr/local`）不受软件包管理器跟踪的所有文件。这些文件不一定代表安全问题，但你需要清楚哪些文件不受包管理器管理，并采取必要措施保持它们为最新状态。

# 第12章 对分区和文件进行加密
对文件、分区乃至整块磁盘加密，可以阻止未授权人员访问你的数据，保护你的机密文档。

你可以在以下加密方案之间做出选择：
- **加密硬盘分区**
可以在系统安装期间，或是已经运行的系统上，使用 YaST 创建加密分区。更多信息参见 12.1.1「安装期间创建加密分区」以及 12.1.2「在正在运行的系统上创建加密分区」。该方案同样可以用于可移动介质，例如外置硬盘，参见 12.1.3「加密可移动介质的内容」。
- **使用 GPG 加密单个文件**
如果需要快速加密一个或多个文件，可以使用 GPG 工具。参见 12.2「使用 GPG 加密文件」。
- **使用 Rage 加密单个文件**
你可以使用 Rage 加密工具加密一个或多个文件。参见 12.3「使用 Rage 加密文件」。

> ⚠️警告：加密的防护能力有限
本章所描述的加密手段，**无法保护已经遭到入侵的正在运行的系统**。加密卷成功挂载之后，拥有对应权限的所有人都可以访问其中内容。但是，当你的计算机丢失、被盗，或是想要防止未授权人员读取你的机密数据时，加密介质可以发挥防护作用。

## 12.1 使用 YaST 设置加密文件系统
你可以在安装阶段，或是已经完成安装的系统中，使用 YaST 对分区或部分文件系统进行加密。不过，在已经运行的系统中加密分区难度更高，因为需要调整大小、改动现有分区。遇到这种情况，创建一个指定大小的加密文件容器，在里面存放其他文件或者部分文件系统，会更加方便。

想要对整个分区加密，需要在分区布局中专为加密划分一个分区。YaST 默认的分区方案不会自动生成加密分区。你需要在分区对话框中手动添加加密分区。

### 12.1.1 安装期间创建加密分区
> ⚠️警告：密码输入
务必牢记加密分区的密码。没有该密码，你无法访问或恢复加密数据。

YaST 的专家分区对话框提供创建加密分区所需的全部选项。按以下步骤创建新的加密分区：
1. 打开 YaST 专家分区器：系统 › 分区器。
2. 选中一块硬盘，点击**添加**，选择主分区或者扩展分区。
3. 设置该分区的大小，以及在磁盘上的占用范围。
4. 选择该分区的文件系统，设置挂载点。
5. 勾选 **加密设备（Encrypt device）** 复选框。

> 注意：需要额外软件包
勾选「加密设备」后，会弹出窗口，提示安装额外软件。确认安装全部需要的软件包，保证加密分区正常工作。

6. 在 Fstab 选项中，如果加密分区不需要开机自动挂载，请启用**不挂载分区（Do not mount partition）**。否则启用**挂载分区**，并输入挂载点。
7. 点击下一步，输入用于加密该分区的密码。密码不会回显。为避免输入错误，你需要输入两次密码。
8. 点击完成，结束操作。至此新的加密分区创建完毕。

在开机引导阶段，系统会在挂载 `/etc/fstab` 中设置为自动挂载的加密分区之前，要求输入密码。分区挂载完成后，所有用户都可以访问该分区。

如果你想要跳过开机挂载加密分区，在提示输入密码时按下回车键，然后拒绝再次输入密码的提示。此时不会挂载加密文件系统，系统继续启动，你的数据无法被访问。
若要挂载开机未挂载的加密分区，打开文件管理器，点击面板中列出的常用位置里的该分区条目。系统会提示输入密码，之后完成挂载。

如果你是在机器上已经存在分区的情况下执行安装，同样可以在安装阶段加密现有分区。参考 12.1.2「在正在运行的系统上创建加密分区」，注意该操作会销毁分区上的全部数据。

### 12.1.2 在正在运行的系统上创建加密分区
> ⚠️警告：在运行的系统上启用加密
虽然可以在正在运行的系统上创建加密分区，但是加密现有分区会销毁分区上**所有数据**，还需要调整大小、重构现有分区结构。

在运行的系统中，打开 YaST 控制中心的「系统 › 分区器」，点击「是」继续。在专家分区器里选中要加密的分区，点击编辑。其余操作流程与 12.1.1「安装期间创建加密分区」完全一致。

### 12.1.3 加密可移动介质的内容
YaST 将可移动介质（例如外置硬盘、闪存盘）和其他存储设备同等对待。可以像上面描述的一样，对虚拟磁盘或分区加密。但是应当**禁用开机挂载**，因为可移动介质是在系统已经运行的时候接入的。

如果你使用 YaST 加密可移动设备，GNOME 桌面会自动识别加密分区，设备接入时提示输入密码。
如果你在 GNOME 中插入一个 FAT 格式的可移动设备，输入密码的桌面用户会自动成为该设备的所有者。对于非 FAT 文件系统的设备，除 root 用户以外的用户，需要显式修改所有权，才能获得读写权限。

## 12.2 使用 GPG 加密文件
GNU Privacy Guard（GPG）加密软件，可用于加密单个文件和文档。

想要使用 GPG 加密文件，首先要生成密钥对。运行 `gpg --gen‑key`，按照屏幕提示完成操作。生成密钥对时，GPG 会根据你的真实姓名、备注信息、电子邮件地址生成用户ID（UID），用来标识该密钥。你需要这个UID（或者UID的一部分，例如你的名字或邮箱）来指定要用于加密文件的密钥。
使用命令 `gpg --list‑keys` 查看已有密钥的UID。

使用下面命令加密文件：
```bash
gpg -e -a --cipher‑algo AES256 -r UID FILE
```
将 `UID` 替换为UID的一部分（例如你的名字），`FILE` 替换为你要加密的文件名。示例：
```bash
gpg -e -a --cipher‑algo AES256 -r Tux secret.txt
```
该命令生成加密文件，后缀为 `.asc`（本示例为 `secret.txt.asc`）。
- `-a` 参数将文件格式化为 ASCII 文本，方便复制内容。如果想要生成二进制文件，省略 `-a`。上面示例中，二进制输出文件为 `secret.txt.gpg`。

解密加密文件使用命令：
```bash
gpg -d -o DECRYPTED_FILE ENCRYPTED_FILE
```
将 `DECRYPTED_FILE` 替换为解密之后的目标文件名，`ENCRYPTED_FILE` 替换为加密文件。

记住：解密加密文件，需要加密时使用的同一套密钥。如果要把加密文件分享给其他人，你需要使用对方的公钥来加密该文件。

## 12.3 使用 Rage 加密文件
Rage 是一款安全文件加密软件，用于加密文件。它的密钥便于和其他人交换，并且具备安全的默认设置，避免误操作造成敏感数据泄露。我们推荐使用 Rage 加密文件。

安装 Rage：
```bash
sudo zypper install rage‑encryption
```

接收方必须首先生成密钥对，才可以加密文件：
```bash
rage‑keygen -o ~/rage.key ~/rage.pub
```
该命令生成两个文件：`rage.pub` 和 `rage.key`。

`rage.pub` 示例内容：
```
Public key: age17e4g67cs07jk3lmylyq6gduv26uf7tz7nm9jrsaxn8xxx9uc9amsdg4a5e
```

`rage.key` 示例内容：
```
# created: 2023‑05‑30T16:29:20+05:30
# public key: age17e4g67cs07jk3lmylyq6gduv26uf7tz7nm9jrsaxn8xxx9uc9amsdg4a5e
```

> ⚠️重要提示
`rage.key` 是私钥，必须严格保密。

### 加密
加密文件，需要使用生成的公钥：
```bash
rage -e -r PUBLIC_KEY -o ENCRYPTED_FILE FILE
```

示例：
```bash
rage -e -r age17e4g67cs07jk3lmylyq6gduv26uf7tz7nm9jrsaxn8xxx9uc9amsdg4a5e -o test.txt.age test.txt
```

### 解密
接收方持有对应的私钥，才可以解密加密文件。想要与他人共享加密文件，你必须使用接收方的公钥加密文件。
```bash
rage -d -i ~/rage.key -o DECRYPTED_FILE ENCRYPTED_FILE
```

示例：
```bash
rage -d -i ~/rage.key -o test.txt.decrypted test.txt.age
```

### 使用密码短语（Passphrases）加密
使用 `-p` 或 `--passphrase` 参数，可以使用密码短语加密文件。默认情况下，Rage 会自动生成安全的密码短语，你也可以手动输入密码短语。
```bash
rage -e -p -o ENCRYPTED_FILE FILE
```

示例：
```bash
rage -e -p -o test.txt.age test.txt
```

### 使用 SSH 密钥加密文件
Rage 支持使用 ssh‑rsa 和 ssh‑ed25519 公钥加密文件，使用对应的私钥解密文件。**不支持 ssh‑agent 和 ssh‑sk(FIDO)**。

先生成 ed25519 SSH 密钥：
```bash
ssh‑keygen -t ed25519
```

加密：
```bash
rage -e -a -R PUBLIC_KEY_FILE -o ENCRYPTED_FILE FILE
```
示例：
```bash
rage -e -a -R id_ed25519.pub -o test.txt.age test.txt
```

解密：
```bash
rage -d -i SSH_PRIVATE_KEY_FILE -o DECRYPTED_FILE ENCRYPTED_FILE
```
示例：
```bash
rage -d -i id_ed25519 -o test.txt.decrypted test.txt.age
```

> ⚠️重要提示
你必须填写密钥与文件的完整路径。

### 多身份加密
可以同时针对多个接收方身份加密文件，任意一个接收方的私钥都可以完成解密。
```bash
rage -e -a -R FIRST_SSH_PUBLIC_KEY -r FIRST_RAGE_PUBLIC_KEY ... -o ENCRYPTED_FILE FILE
```

示例：
```bash
rage -e -a -R id_ed25519.pub \
‑r age1h8equ4vs5pyp8ykw0z8m9n8m3psy6swme52ztth0v66frgu65ussm8gq0t \
‑r age1y2lc7x59jcqvrpf3ppmnj3f93ytaegfkdnl5vrdyv83l8ekcae4sexgwkg \
‑o test.txt.age test.txt
```

> 💡提示
使用 `-h` 或者 `--help` 参数，查看 Rage 的全部命令参数。

### 12.3.1 补充参考资源
- https://github.com/str4d/rage Rage 加密项目 GitHub 仓库
- https://github.com/C2SP/C2SP/blob/main/age.md Age 加密规范 GitHub 仓库

# 第13章 使用cryptctl实现托管应用的存储加密

数据库以及类似应用经常托管在第三方人员运维的外部服务器上。某些数据中心维护工作，需要第三方人员直接访问受影响的系统。在此类场景中，隐私方面的要求就需要磁盘加密作为保障。

cryptctl可以使用LUKS对敏感目录进行加密，并提供以下额外功能：

- 加密密钥存放于一台中央服务器，该服务器可部署在客户自有环境内。
- 非计划重启之后，加密分区可以自动重新挂载。

cryptctl包含两个组件：

- **客户端**：拥有一个或多个加密分区，但不会永久存储解密所需密钥的机器。例如云主机或者其他托管机器。
- **服务器**：保存加密密钥，客户端可以向其请求密钥来解锁加密分区。

你也可以将cryptctl服务器配置为把密钥存放在兼容KMIP 1.3（密钥管理互操作协议）的服务器上。这种情况下，cryptctl服务器本身并不保存客户端加密密钥，而是依赖兼容KMIP的服务器来提供密钥。

> 
> ⚠️警告：cryptctl服务器的维护注意事项
> cryptctl服务器负责处理加密磁盘的超时逻辑，并且视配置情况，还会保管加密密钥。该服务器必须置于你的直接管控之下，由受信任人员进行管理。
> 此外，需要定期对服务器做备份。如果服务器数据丢失，就意味着客户端加密分区将无法访问。

cryptctl采用带512位密钥的aes‑xts‑256算法的LUKS来处理加密。密钥通过带证书校验的TLS协议进行传输。

## 13.1 设置cryptctl服务器

cryptctl服务器保存解锁客户端LUKS卷所需的密钥。客户端会向该服务器请求密钥。服务器可以部署在本地机房，也可以部署在虚拟机上。

> 
> 注意：时间同步至关重要
> cryptctl服务器与所有客户端之间必须保持时间同步。TLS会校验时间戳，时间偏差过大将导致连接失败。建议使用NTP服务。

### 安装软件包

在要充当cryptctl‑server的机器上安装软件包：

```
zypper in cryptctl-server
```

### 生成服务器证书与密钥

cryptctl的客户端‑服务器通信依赖TLS。需要一套证书：服务器证书、服务器私钥、CA根证书。

> 
> 提示：生产环境建议使用由正式CA签发的证书。测试环境可使用自签名证书。

1. 创建存放证书的目录：

```
mkdir -p /etc/cryptctl/pki
cd /etc/cryptctl/pki
```

2. 生成CA私钥与CA证书：

```
openssl genrsa -out ca.key 4096
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt
```

3. 生成服务器私钥与证书签名请求CSR：

```
openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr
```

> 
> 填写CSR时，**Common Name必须填写cryptctl服务器的主机名（客户端用来连接的那个主机名）**。

4. 使用CA对服务器证书进行签发：

```
openssl x509 -req -days 3650 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
```

5. 设置正确权限：

```
chmod 600 *.key
chown root:root *
```

### 编辑cryptctl服务器配置文件 `/etc/cryptctl/server.conf`

配置文件示例：

```
[tls]
server-cert = /etc/cryptctl/pki/server.crt
server-key  = /etc/cryptctl/pki/server.key
ca-cert     = /etc/cryptctl/pki/ca.crt

[general]
# 服务器监听地址，0.0.0.0表示监听所有网卡
listen = 0.0.0.0
port = 8080

# 密钥数据库存放路径
db-path = /var/lib/cryptctl/server/db

# 解锁超时：客户端成功获取密钥后，多长时间内可以重复使用该密钥解锁磁盘（单位秒）
unlock-timeout = 3600

# 是否需要客户端出示证书做身份认证
require-client-cert = true
```

> 
> 如果`require‑client‑cert = true`，每个客户端都必须拥有一份由该CA签发的客户端证书。

### 防火墙配置

cryptctl默认使用TCP 8080端口。使用firewalld开放端口：

```
firewall-cmd --add-port=8080/tcp --zone=internal
firewall-cmd --runtime-to-permanent
```

### 启动并启用cryptctl‑server服务

```
systemctl enable --now cryptctl-server
systemctl status cryptctl-server
```

> 
> 提示：查看服务器日志：`journalctl -u cryptctl-server`

## 13.2 设置cryptctl客户端

cryptctl客户端运行在托管主机上，其上存在LUKS加密卷，但本机**不持久保存解密密钥**。开机解密密钥需要向cryptctl服务器索取。

> 
> ⚠️警告：客户端仍然需要至少一次手动输入密码完成LUKS卷初始化。cryptctl只负责之后的解锁，**不能用来创建全新的LUKS加密卷**。

### 安装客户端软件包

```
zypper in cryptctl
```

### 生成客户端证书（当服务器开启`require‑client‑cert = true`时）

把服务器端的CA私钥 `ca.key`、`ca.crt`临时复制过来签发客户端证书，完成后务必把`ca.key`放回服务器、不要留在客户端。

1. 在客户端创建证书目录：

```
mkdir -p /etc/cryptctl/pki
cd /etc/cryptctl/pki
```

2. 生成客户端私钥与CSR：

```
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr
```

> 
> Common Name填写客户端主机名。
> 
> 
> 3. 将`client.csr`传到cryptctl服务器，用CA签名：

```
openssl x509 -req -days 3650 -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt
```

4. 将生成好的 `client.crt`、`ca.crt`传回客户端的`/etc/cryptctl/pki`目录，设置权限：

```
chmod 600 *.key
chown root:root *
```

### 客户端配置文件 `/etc/cryptctl/client.conf`

```
[tls]
client-cert = /etc/cryptctl/pki/client.crt
client-key  = /etc/cryptctl/pki/client.key
ca-cert     = /etc/cryptctl/pki/ca.crt

[general]
# cryptctl服务器地址与端口
server = cryptctl‑server‑hostname:8080

# 本地缓存解锁密钥？false：不缓存，每次重启都向服务器拿密钥
cache‑secret = false

# 连接超时，单位秒
connect‑timeout = 10
```

### 将现有LUKS卷注册到cryptctl客户端

> 
> 前提：你已经有一个LUKS加密分区，例如 `/dev/sdb1`。cryptctl会生成新密钥段（key slot）并把密钥上传保存到cryptctl服务器。

执行注册命令：

```
cryptctl register /dev/sdb1
```

交互过程：

1. 输入该LUKS卷**已经存在的一个密码**，用于添加新的cryptctl密钥槽。
2. 客户端生成新随机密钥，把密钥发送到cryptctl服务器存储。
3. 服务器记录该磁盘的元数据（磁盘UUID）。
4. 新密钥写入LUKS的一个密钥槽。

> 
> ⚠️重要：`cryptctl register`不会删除你原有的LUKS密码。原有密码仍然有效。你仍然可以在紧急情况下使用原来的密码手动解密磁盘。

查看本机已注册的设备：

```
cryptctl list
```

## 13.3 在/etc/fstab配置LUKS卷

cryptctl提供systemd单元，在启动阶段向服务器获取密钥、打开LUKS设备。

> 
> 注意：不要使用标准`/etc/crypttab`。cryptctl拥有自己的systemd服务。

1. 获取LUKS卷的UUID：

```
blkid /dev/sdb1
```

记下UUID值，例如 `UUID="1234‑abcd‑5678‑ef01"`。

2. 在 `/etc/fstab` 添加挂载条目，使用解密之后的设备名 `/dev/mapper/CRYPTCTL‑UUID`：

```
/dev/mapper/CRYPTCTL‑1234‑abcd‑5678‑ef01   /data   ext4    defaults  0  2
```

> 
> cryptctl的systemd单元会自动处理解密，无需修改crypttab。

3. 重新加载systemd配置：

```
systemctl daemon‑reload
```

> 
> 重启客户端机器进行测试：系统启动过程中，cryptctl客户端连接服务器获取密钥，自动打开LUKS卷并挂载 `/data`。
> 如果服务器不可达，**该加密卷不会被自动解密和挂载，你必须手动解锁，见13.5节**。

## 13.4 使用服务器端命令查看分区解锁状态

登录cryptctl服务器，查看所有注册过的客户端加密卷：

```
cryptctl‑server list‑volumes
```

输出示例：

```
UUID: 1234‑abcd‑5678‑ef01
Registered client: client‑host.example.com
Unlock‑timeout: 3600 seconds
Last unlock: 2026‑08‑20 10:22:11
```

你可以吊销一个卷的密钥（客户端将不再能够自动解锁）：

```
cryptctl‑server revoke‑volume <UUID>
```

> 
> 吊销之后，原有LUKS密码仍然可以手动解锁磁盘；只是cryptctl服务器不再提供该密钥。

## 13.5 手动解锁加密分区

当cryptctl服务器不可达（网络故障、服务器停机），客户端**无法自动解密**。此时你需要手动解密LUKS分区，使用原始LUKS密码：

1. 打开LUKS卷（输入你最初设置的LUKS密码）：

```
cryptsetup luksOpen /dev/sdb1 CRYPTCTL‑1234‑abcd‑5678‑ef01
```

2. 执行挂载：

```
mount /dev/mapper/CRYPTCTL‑1234‑abcd‑5678‑ef01 /data
```

> 
> ⚠️注意：手动解锁并不会把密钥缓存给cryptctl。下次系统重启，如果服务器依旧不可达，仍然需要重复手动解锁操作。

## 13.6 维护停机流程

当cryptctl服务器需要停机维护时：

1. 评估所有客户端的`unlock‑timeout`（例如3600秒=1小时）。
2. 在timeout窗口时间内，已经成功拿到密钥的客户端还可以继续自动解锁。**新启动的客户端无法解锁，因为连不上服务器**。

维护停机操作步骤：

1. 通知业务，新启动的客户端将无法自动解密加密磁盘。
2. 停止cryptctl‑server服务：

```
systemctl stop cryptctl‑server
```

3. 执行服务器维护操作。
4. 维护完成后，重新启动服务：

```
systemctl start cryptctl‑server
```

5. 验证客户端可以正常获取密钥，重启一台测试客户端确认自动解锁功能正常。

> 
> 如果停机超过unlock‑timeout时间，所有客户端重启后都无法自动解锁，全部需要人工手动输入LUKS密码。

## 13.7 为cryptctl‑server服务配置HA高可用环境

为了消除cryptctl服务器的单点故障，可以部署高可用集群。openSUSE Leap使用pacemaker+corosync实现HA。

> 
> 前提条件
> 
> 
> - 两台HA节点，都安装`cryptctl‑server`软件包。
> - 共享存储（iSCSI / LUN），用来存放cryptctl的密钥数据库目录 `/var/lib/cryptctl/server/db`。数据库必须存放在集群资源管理的共享存储上，同一时间只能在一个节点挂载。
> - 虚拟IP（集群浮动IP），客户端配置文件中填写该虚拟IP，而不是物理主机IP。
> - 两套节点都具备完整的TLS证书文件（服务器证书、私钥、CA证书），证书文件保存在本地，不在共享存储。

### Pacemaker资源规划

1. **存储资源**：共享LUN，挂载点 `/var/lib/cryptctl/server/db`。该资源只能在集群一个节点运行。
2. **虚拟IP资源**：浮动VIP。
3. **systemd服务资源**：`cryptctl‑server`服务。

资源启动顺序：挂载共享存储 → 分配虚拟IP → 启动cryptctl‑server。故障转移时顺序反向：停止服务 → 释放VIP → 卸载共享存储，再在另一节点启动。

> 
> ⚠️关键注意事项
> cryptctl‑server不是原生支持pacemaker的代理服务，使用systemd简单资源代理管理。**同一时刻只能有一个节点运行cryptctl‑server**，绝对不允许双节点同时挂载共享数据库，否则数据库文件会损坏。

### 简要配置步骤

1. 在两个HA节点安装HA套件与cryptctl‑server：

```
zypper in pacemaker corosync pcs cryptctl‑server
```

2. 按照HA文档初始化pacemaker集群。
3. 将整套TLS PKI文件（server.crt、server.key、ca.crt）复制到两台HA节点的 `/etc/cryptctl/pki`，权限保持`root:root`，私钥权限`600`。两个节点的`/etc/cryptctl/server.conf`配置文件完全一致，监听虚拟IP或者`0.0.0.0`。
4. 创建pacemaker资源：
   - 共享块设备/文件系统资源挂载到 `/var/lib/cryptctl/server/db`。
   - 虚拟IP地址资源。
   - systemd服务资源 `cryptctl‑server`。
5. 设置资源的排列约束、顺序约束，保证启动顺序：存储挂载 → VIP → 服务启动。设置位置约束保证资源全部在同一个节点运行。
6. 客户端配置文件的`server=`参数填写**集群虚拟IP/虚拟主机名**，而不是物理节点主机名。
7. 故障转移测试：
   - 查看当前资源所在节点；手动把该节点设置为standby，观察资源切换到备用节点。
   - 测试客户端依旧可以向虚拟IP获取密钥解锁磁盘。

> 
> ⚠️警告：共享存储必须做好备份。cryptctl服务器密钥数据库丢失，所有对应的LUKS卷只能依靠原始LUKS密码解锁。

### 13.8 更多信息

- man 8 cryptctl
- man 8 cryptctl‑server
- `/usr/share/doc/packages/cryptctl`目录下的文档。
- KMIP相关：cryptctl支持将密钥后端对接KMIP兼容密钥管理服务器，详情查阅手册。

# 第14章 用户管理

## 14.1 各类账户检查

### 未锁定账户

需要定期检查系统上的账户状态，识别未锁定、但长期无人使用的账户。

### 未使用账户

应当定期找出系统中长期未使用的账户。闲置账户是重大安全隐患：攻击者有可能利用这类账户闯入系统。找出这类账户之后，要么将其锁定，要么直接删除。

## 14.2 启用密码老化

密码老化（密码有效期）强制用户定期修改密码。该功能通过 `/etc/shadow` 文件进行控制。可使用命令 `chage` 对各个用户配置密码老化参数。

> 
> 示例：查看用户 tux 的密码老化设置

```
chage -l tux
```

可设置的密码老化参数如下：

- **密码最后一次修改日期**：记录上次修改密码的时间。
- **密码可更改的最小天数**：设置两次修改密码之间必须间隔的最短天数。设置为 0，表示用户可以随时修改密码。
- **密码必须更改的最大天数**：密码的有效最大天数。到期之后，用户必须修改密码。
- **密码到期前的警告天数**：密码过期之前，提前多少天向用户发出修改密码的警告。
- **密码过期之后的宽限天数**：密码过期之后，账户还能保留多久可用状态。过了这个宽限期，账户会被锁定。
- **账户失效日期**：账户彻底失效的具体日期。到该日期，无论密码状态如何，账户都会被禁用。

> 
> 示例：设置 tux 用户密码策略：最少7天改一次，最多90天必须改密码，过期前14天发出警告，密码过期后保留7天宽限期，账户2025‑12‑31过期。

```
chage -m 7 -M 90 -W 14 -I 7 -E 2025‑12‑31 tux
```

若要为新创建的用户设置默认密码老化策略，请编辑 `/etc/login.defs`。该文件中的以下参数控制新建账户的默认设置：

- `PASS_MIN_DAYS`：两次改密码的最小间隔天数
- `PASS_MAX_DAYS`：密码最大有效天数
- `PASS_WARN_AGE`：密码到期警告提前天数

> 
> 注意：`/etc/login.defs` 的设置**仅对新建用户生效**，不会修改系统上已经存在的老用户。已有用户必须使用 `chage` 命令逐个配置。

## 14.3 强化密码强制策略

简单密码极易被暴力破解。openSUSE Leap 借助 PAM 的 `pam_cracklib` 模块强制实施强密码规则。该模块会检查新密码的复杂度，拒绝弱密码。可配置的检查项包含：

- 密码最小长度
- 密码必须包含的字符类别（大写字母、小写字母、数字、特殊符号）
- 新密码与旧密码的差异程度
- 拒绝使用字典中能查到的常见单词作为密码

相关配置文件为 `/etc/pam.d/common‑password`。详细说明参见14.4节「使用PAM进行密码与登录管理」。

> 
> 提示：YaST 安全设置模块
> 也可以通过 YaST 的安全设置界面配置密码策略。参阅第17.3节「密码设置」。

## 14.4 使用PAM进行密码与登录管理

借助PAM模块可以实现各类登录与密码管控策略，例如密码强度校验、禁止重复使用旧密码、多次登录失败锁定账户等。

### 14.4.1 密码强度

`pam_cracklib` 模块负责校验密码强度。它在用户修改密码时触发，拒绝不符合复杂度要求的密码。配置位于 `/etc/pam.d/common‑password`。

```
password  requisite  pam_cracklib.so [...]
```

`pam_cracklib.so` 的常用参数：

- `minlen=N`：设置密码最小长度
- `dcredit=N`：数字字符要求
- `ucredit=N`：大写字母要求
- `lcredit=N`：小写字母要求
- `ocredit=N`：特殊符号要求
- `difok=N`：新密码与旧密码至少要有N个字符不同
- `reject_username`：拒绝把用户名用作密码的一部分

> 
> 注意：`pam_cracklib` 仅在修改密码阶段生效，**不会校验登录时输入的现有密码**。它只管控新设置的密码。

### 14.4.2 限制历史旧密码复用

`pam_unix` 模块支持记录历史密码，阻止用户重复使用之前用过的密码。编辑 `/etc/pam.d/common‑password`，给 `pam_unix.so` 添加参数 `remember=N`，N代表要保存多少条历史旧密码。

示例：保存5条历史密码，不允许复用：

```
password  required  pam_unix.so use_authtok remember=5
```

历史旧密码哈希会保存在 `/etc/security/opasswd` 文件。该文件必须严格保护，权限设置为 `root:root 0600`。

> 
> 警告：`remember` 参数仅适用于本地 `/etc/shadow` 用户。LDAP、Active Directory、NIS这类远程身份源不支持该功能。密码历史记录保存在本地机器，不会同步到远程目录服务器。

### 14.4.3 多次登录失败后锁定用户账户

使用 `pam_tally2` 模块，配置密码多次输入错误之后锁定账户，防范暴力密码攻击。编辑 `/etc/pam.d/common‑auth`。

在 auth 栈靠前位置添加：

```
auth  required  pam_tally2.so  deny=5  unlock_time=3600
```

- `deny=5`：连续5次登录失败后锁定账户
- `unlock_time=3600`：锁定时长，单位秒；3600代表锁定1小时。省略该参数则需要管理员手动解锁。

再在 `common‑account` 中增加账户校验：

```
account  required  pam_tally2.so
```

查看用户的失败计数：

```
pam_tally2 --user tux
```

管理员手动解锁账户：

```
pam_tally2 --user tux --reset
```

> 
> ⚠️警告：配置错误会导致全部用户（含root）无法登录。修改PAM配置前，务必备份配置文件，并且保留一个已经登录的root终端会话，方便配置出错时回滚。

## 14.5 限制root登录

应尽可能禁止root账号直接登录系统，所有管理员操作优先使用普通用户配合 `sudo` 完成。可以分别限制本地控制台登录、图形会话登录、SSH远程登录。

### 14.5.1 限制本地文本控制台登录

编辑 `/etc/securetty` 文件。该文件列出允许root直接登录的终端设备。若要完全禁止root本地终端登录，把文件内全部tty行注释或者删除。

> 
> 示例 /etc/securetty，禁止root本地登录：

```
#tty1
#tty2
#tty3
#tty4
#tty5
#tty6
```

> 
> 注意：如果 `/etc/securetty` 文件不存在，root允许在**所有本地终端**登录。

### 14.5.2 限制图形会话登录

GDM、SDDM这类显示管理器可以禁止root图形登录。
对于GDM：编辑 `/etc/gdm/custom.conf`，在 `[security]` 段添加：

```
[security]
AllowRoot=false
```

修改完成后重启显示管理器服务。

### 14.5.3 限制SSH登录

编辑 `/etc/ssh/sshd_config`，设置：

```
PermitRootLogin no
```

保存配置，重启sshd服务：

```
systemctl restart sshd
```

> 
> 提示：若你临时需要root SSH访问，不要直接改回 `PermitRootLogin yes`。优先配置公钥登录，或者使用普通账号sudo提权。

## 14.6 限制sudo用户

`sudo` 允许指定普通用户以其他用户身份（通常为root）执行命令。配置文件为 `/etc/sudoers`，建议使用命令 `visudo` 编辑，该命令会做语法校验，避免写错配置文件导致sudo完全失效。

- 允许用户 tux 执行全部root权限命令：

```
tux  ALL=(ALL)  ALL
```

- 仅允许用户执行指定几条命令，不开放全部权限：

```
tux  ALL=(ALL)  /bin/systemctl restart apache2, /bin/journalctl
```

- 允许用户执行命令不需要输入自己的密码（谨慎使用，安全风险较高）：

```
tux  ALL=(ALL) NOPASSWD: ALL
```

最佳实践：

1. 遵循最小权限原则，只分配用户真正需要的命令权限。
2. 不要滥用 `NOPASSWD`。
3. 将用户归入 `wheel` 用户组，在 sudoers 中对组授权，方便批量管理管理员。

```
%wheel  ALL=(ALL) ALL
```

把用户加入wheel组：

```
usermod -aG wheel tux
```

> 
> 提示：为防止语法错误破坏 sudo，永远使用 `visudo`，不要直接用文本编辑器修改 `/etc/sudoers`。还可以把片段配置放到 `/etc/sudoers.d/` 目录下，便于管理。

## 14.7 为交互式shell会话设置非活动超时时间

可以设置shell空闲超时，当终端闲置一段时间之后自动登出用户，防范用户离开工作站没有锁屏的风险。该功能通过环境变量 `TMOUT` 实现，单位为**秒**。

> 
> 注意：`TMOUT` 既属于shell内置变量，又属于环境变量，需要同时设置才能完整生效。

全局对所有用户生效，编辑 `/etc/profile` 和 `/etc/bash.bashrc`，添加：

```
export TMOUT=600
readonly TMOUT
```

示例设置为600秒（10分钟）无操作自动登出。`readonly` 阻止普通用户在自己的shell会话中覆盖、取消该变量。

> 
> 说明：
> 
> 
> - `/etc/profile`：适用于登录shell
> - `/etc/bash.bashrc`：适用于交互式非登录shell

用户也可以在自己家目录的 `~/.bashrc`、`~/.profile` 设置 `TMOUT`，会覆盖全局设置。若全局设置了 `readonly TMOUT`，普通用户就无法在自己的配置中修改。

> 
> ⚠️警告：`TMOUT` 仅对bash交互式shell生效。并不影响图形桌面会话、screen/tmux多路复用器会话。桌面环境请使用屏幕锁屏，不要只依赖shell超时。

## 14.8 防范意外拒绝服务

资源限制可以防止单个用户过度消耗系统CPU、内存、进程数、打开文件数等资源，避免出现拒绝服务。可以通过PAM的 `pam_limits` 模块读取 `/etc/security/limits.conf` 实现。

> 
> 示例14‑1：限制系统资源示例（/etc/security/limits.conf）

```
# <domain>  <type>  <item>     <value>
tux        soft    nproc      100
tux        hard    nproc      200
@users     soft    nofile     2048
@users     hard    nofile     4096
*          soft    core       0
```

字段说明：

1. **domain（域）**：用户名、用户组（`@组名`），`*` 代表全部用户。
2. **type（类型）**
   - `soft`：软限制，用户可以在会话内自行调高，最高不超过hard限制。
   - `hard`：硬限制，内核强制上限，普通用户无法突破。
3. **item（限制项）**
   - `nproc`：最大进程数量
   - `nofile`：最大打开文件描述符数量
   - `core`：core转储文件大小；设置0禁止生成core dump，防止泄露敏感内存信息
   - `cpu`：CPU时间，单位分钟
   - `memlock`：可锁定内存大小

`limits.conf` 的变更对**已经登录的会话不会生效**。用户需要重新登录会话，pam_limits模块才会加载新限制。

> 
> 注意：systemd管理的服务进程不受 `limits.conf` 管控。systemd服务资源限制需要在service单元配置文件中设置。

## 14.9 显示登录横幅

可以在用户登录之前展示警告横幅消息，例如合规声明、系统使用条款。

- **文本控制台 / 串行终端**：编辑 `/etc/issue`。该文件内容会显示在本地登录提示符之前。
- **远程telnet（不推荐）**：编辑 `/etc/issue.net`。
- **SSH**：sshd_config 参数 `Banner /etc/banner`，设置后重启sshd。

> 
> 示例 /etc/banner

```
WARNING: This is a private system.
Unauthorised access is prohibited.
All activities may be logged and monitored.
```

> 
> 重要：**不要在登录横幅中展示系统版本、内核版本、服务器名称等详细系统信息**。避免向潜在攻击者泄露系统指纹。只放警告与合规声明。

图形登录管理器（GDM）也支持显示登录提示横幅，可在 YaST 安全设置模块或者对应显示管理器配置中设置。

## 14.10 连接记账工具

openSUSE Leap 提供工具记录、审计用户登录会话历史：

1. **last**：读取 `/var/log/wtmp`，列出过去登录记录，显示登录用户、来源IP、登录登出时间。

```
last
last tux
last -i
```

2. **lastb**：读取 `/var/log/btmp`，展示**登录失败记录**，排查暴力破解攻击。> 
> 注意：`/var/log/btmp` 默认可能不会轮转，文件会持续增长，需要配置logrotate。
3. **who**：查看当前系统已经登录的用户。
4. **w**：查看当前登录用户，同时显示用户正在执行的活动以及系统负载。
5. **ac**：统计用户总登录时长，来自wtmp日志。

```
ac
ac -p
```

> 
> 提示：wtmp、btmp 文件如果被删除，会丢失全部历史登录统计数据。应当做好日志轮转与备份。部分系统会把wtmp放在 `/var/log/wtmp‑*` 轮转归档。

# 第15章 限制 cron 与 at
## 15.1 限制 cron 守护进程
`cron` 守护进程用于按预定的时间执行任务。在默认情况下，系统中所有用户都能够创建自己的 cron 任务。为了限制哪些用户有权使用 `cron`，可以使用两个文件：
- `/etc/cron.allow`
- `/etc/cron.deny`

运行 cron 的权限遵循以下规则：
1. 如果存在 `/etc/cron.allow` 文件，那么**只有该文件内列出的用户**才被允许使用 cron。此时会完全忽略 `cron.deny` 文件。
2. 如果不存在 `/etc/cron.allow`，系统会去读取 `/etc/cron.deny`。写在该文件中的用户**禁止使用 cron**。所有未出现在此文件中的用户均可使用 cron。
3. 如果两个文件都不存在，则只有 `root` 用户可以使用 cron。

> 注意：文件格式
> 在 `cron.allow` 和 `cron.deny` 中，每行只能填写一个用户名。不允许使用空格。

示例 `/etc/cron.allow`：
```
root
tux
wilber
```
在该示例中，仅 root、tux、wilber 这三位用户能够创建 cron 任务。

> 提示：用户生效无需重启
> 修改完 `cron.allow` 或 `cron.deny` 之后，无需重启 cron 守护进程。这些文件会在每次用户调用 `crontab` 命令时读取。

## 15.2 限制 at 调度器
`at` 调度器用于在将来某个指定时刻执行一次性任务。和 cron 相类似，可以通过以下两个文件控制哪些用户可以使用 `at`：
- `/etc/at.allow`
- `/etc/at.deny`

使用 at 的权限规则：
1. 如果存在 `/etc/at.allow` 文件，**仅该文件内列出的用户**被允许使用 at，`at.deny` 文件会被忽略。
2. 如果不存在 `/etc/at.allow`，系统读取 `/etc/at.deny`。写在此文件中的用户**禁止使用 at**，其余所有未列入该文件的用户都可以使用 at。
3. 如果两个文件均不存在，只有 root 用户可以使用 at。

> 注意：文件格式
> 在 `at.allow` 与 `at.deny` 中，每行填写一个用户名，不可包含空格。

示例 `/etc/at.allow`：
```
root
tux
```
该示例中，只有 root 和 tux 可以提交 at 任务。

> 提示：无需重启服务
> 修改 `at.allow` / `at.deny` 之后，不需要重启 atd 服务。每当用户执行 at 命令时，系统会实时读取这两个文件。

> 补充说明（来自原文档上下文）
> cron 处理重复周期性任务；at 处理单次未来任务。二者均通过 allow/deny 访问控制列表实现用户粒度权限管控，不需要守护进程重载配置，规则文件每行一个用户名。

# 第16章 Spectre/Meltdown checker（幽灵/熔断漏洞检测工具）
## 16.1 使用 spectre‑meltdown‑checker
Spectre（幽灵）与 Meltdown（熔断）是一类利用CPU推测执行机制的硬件侧信道漏洞。`spectre‑meltdown‑checker` 工具用于检测系统是否容易受到这一系列漏洞的影响，同时检查当前系统已采取的缓解措施是否生效。

> 注意：该工具仅做检测，**不会修复漏洞**。它只会报告漏洞风险与缓解状态。想要完成修复，需要安装对应的内核微码更新、系统补丁。

运行该工具需要 root 权限。openSUSE Leap 默认并未预装该工具。安装命令：
```bash
zypper install spectre‑meltdown‑checker
```

执行检测：
```bash
# spectre‑meltdown‑checker
```

工具会输出大量检测结果，涵盖各类变种漏洞：
- Meltdown（CVE‑2017‑5754）
- Spectre v1 边界检查绕过（CVE‑2017‑5753）
- Spectre v2 分支目标注入（CVE‑2017‑5715）
- Spectre v4 推测存储绕过（CVE‑2018‑36393）
- L1TF 一级缓存终端故障（CVE‑2018‑3620）
- MDS 微架构数据采样系列漏洞（CVE‑2019‑11091、CVE‑2019‑11090、CVE‑2019‑11098）
- SRBDS 特殊寄存器缓冲区数据采样（CVE‑2020‑0549）
等其他推测执行相关漏洞。

输出的每一项包含三种状态：
1. **VULNERABLE（存在漏洞）**：系统容易遭受该漏洞攻击，缺少对应的缓解措施。
2. **MITIGATED（已缓解）**：系统已启用缓解手段，该漏洞风险得到控制。
3. **NOT VULNERABLE（不受漏洞影响）**：硬件本身不存在该漏洞。

> 重要：缓解措施存在性能代价
> 很多针对推测执行漏洞的缓解手段会带来CPU性能损耗。管理员需要在安全防护与业务性能之间做权衡取舍。部分缓解措施可以通过内核启动参数关闭。

如需生成机器可解析的JSON格式输出，使用参数`--json`：
```bash
# spectre‑meltdown‑checker --json
```

> 提示：工具检测的依据
> `spectre‑meltdown‑checker` 通过读取 `/sys/devices/system/cpu/smt/`、`/proc/cpuinfo`、`/boot/config‑*`、内核dmesg日志、CPU微码版本等系统信息完成判断。因此必须使用root执行，才能完整读取全部所需信息。

## 16.2 更多信息
- 工具项目主页：https://github.com/speed47/spectre‑meltdown‑checker
- `man spectre‑meltdown‑checker`：工具手册页，全部参数与输出字段说明。
- SUSE安全公告数据库，查询openSUSE/SLES针对Spectre、Meltdown以及后续推测执行漏洞的补丁：https://www.suse.com/support/security/
- 内核文档，内核各类缓解机制的说明，位于 `/usr/src/linux/Documentation/admin-guide/hw-vuln/`（需要安装内核源码包）。

> 补充文档原文对应提示：
> 该工具仅做本地检测，无法做渗透测试。检测结果仅反映本机当前内核、微码、BIOS配置状态；部分漏洞的完整防护还依赖于固件/BIOS更新，操作系统层面补丁不能完全替代固件更新。

# 第17章 使用YaST配置安全设置
## 17.1 安全总览
YaST 的安全设置模块提供一份系统安全相关设置的概览。打开 YaST，选择**安全设置**。该界面展示系统当前的安全配置状态。

设置划分为多个类别：预定义安全配置、密码设置、引导设置、登录设置、用户新增、杂项设置。修改完设置后，点击「确定」保存变更并退出模块。点击「取消」会直接放弃所有改动。

## 17.2 预定义安全配置
openSUSE Leap 提供若干套预定义安全配置文件，可用来快速应用一套完整的安全策略。

- **easy（简易）**：面向需要图形用户交互的桌面系统。这是默认配置文件。
- **secure（安全）**：面向没有完整图形界面的服务器系统。
- **paranoid（偏执）**：最高安全等级。除 secure 的设置之外，还会移除所有特殊权限，例如 setuid / setgid 以及能力位。

> ⚠️警告：非特权用户的系统可能变得不可用
> 除了简单任务（例如修改密码）之外，去掉特殊权限的系统，普通用户将无法使用。
> 不要直接原样使用 paranoid 配置文件，应当把它当作自定义权限的模板。更多信息参见 `permissions.paranoid` 文件。

选择其中一个预定义配置文件，会自动填充其余各个标签页的设置。应用预定义配置后，你依旧可以单独修改各项参数。
> 注意：选择预定义配置不会立即应用设置。只有点击「确定」，变更才会写入系统。

## 17.3 密码设置
使用该标签页配置密码策略。
1. **密码最小长度**：设置密码的最少字符数。过短的密码容易被暴力破解。
2. **密码过期设置**
    - 密码有效期（天）：密码多少天后过期。
    - 密码过期警告（天）：密码到期之前，提前多少天向用户发出警告。
    - 密码修改最短间隔（天）：密码修改后，必须等待多少天才允许再次修改。用于阻止用户快速循环复用旧密码。
3. **保留旧密码数量**：系统保存多少条历史旧密码，阻止用户复用旧密码。设置为`0`代表不限制旧密码复用。

> 提示：这些设置会修改 `/etc/login.defs`。部分程序不会读取此文件。密码复杂度检查由 PAM 模块 `pam_cracklib` 处理。

## 17.4 引导设置
引导设置包含和系统开机流程相关的安全选项。

1. **禁止从可移动介质引导**
> 注意：该选项**不会修改 BIOS 或者 UEFI 固件设置**。该选项仅在操作系统内部生效，无法阻止计算机硬件层面直接从U盘或光盘启动。要彻底禁用可移动介质引导，必须进入机器的 BIOS/UEFI 设置。

2. **引导加载程序密码**
设置 GRUB2 密码，防止未授权用户修改内核启动参数。
- 设置密码：点击「设置密码」，输入并确认密码。
- 删除密码：点击「删除密码」移除现有GRUB密码。

> 重要：设置GRUB密码仅保护引导菜单的交互编辑，**不会加密磁盘上的数据**。如需保护磁盘数据，请使用LUKS分区加密，请参阅第12章《加密分区和文件》。

3. **内核参数**
填写要传递给内核的安全相关参数，例如缓解 Spectre/Meltdown 漏洞的内核参数。

## 17.5 登录设置
该标签页控制系统登录相关安全策略。

1. **禁止本地root登录**
禁止root账户直接从物理控制台登录。管理员需要使用普通账户登录，再执行`su`或者`sudo`切换到root。
> 注意：该设置**不影响SSH远程root登录**。SSH禁止root登录需要修改 `/etc/ssh/sshd_config`。

2. **禁止root图形登录**
禁止root账户通过GDM、KDM等图形登录管理器登录图形会话。

3. **登录失败锁定账户**
启用后，多次密码输入错误会临时锁定账户。
- 失败尝试次数：触发锁定的密码错误次数阈值。
- 锁定时长（秒）：账户保持锁定的秒数，到期自动解锁。

> 说明：该功能依靠PAM模块 `pam_tally2` 实现。

4. **显示登录横幅**
设置登录时展示的提示文本。该文本会在文本控制台以及图形登录界面显示。你可以直接编辑输入框内容，也可以导入外部文本文件。

## 17.6 用户新增
控制 YaST 创建新用户时使用的默认参数。

1. **家目录 umask**
设置新建用户家目录的 umask。例如设置为 `077`，新建家目录权限为700，其他用户完全无法访问。

> 提示：此设置写入 `/etc/login.defs` 的 `HOME_MODE` 参数。**仅对新创建用户生效，不会修改已经存在的家目录权限**。已存在的家目录，你需要手动执行`chmod`修改权限。

2. **普通用户最小UID**
普通本地用户的UID起始编号，小于该数值的UID留给系统账号。

3. **普通用户最小GID**
普通本地用户组的GID起始编号，小于该数值的GID留给系统账号。

## 17.7 杂项设置
不属于前面分类的其他安全设置全部放在这个标签页。

1. **核心转储（Core dump）**
控制程序崩溃时生成核心转储文件。核心转储文件可能在内存转储中包含密码、密钥等敏感信息。
- 完全禁用核心转储：不生成任何core dump。
- 仅允许所有者读取核心转储：生成core dump文件，但只有文件所有者可以读取。
- 无限制：使用系统默认行为生成core dump。

2. **允许SUID / SGID程序**
控制系统上是否允许存在SUID、SGID权限的二进制文件。
> ⚠️警告：如果禁用SUID/SGID，大量系统工具（如 passwd、su）将无法正常工作。只在极高安全等级环境才考虑该选项。

3. **系统资源限制**
设置全局系统资源限制。这些设置写入 `/etc/security/limits.conf`。你可以限制进程最大打开文件数、最大进程数量等。
> 更多细节，参见第14.8节「防止意外拒绝服务」。

4. **启用AIDE**
AIDE（高级入侵检测环境）用来监控关键系统文件是否被篡改。
- 勾选启用AIDE；
- 点击初始化AIDE数据库，生成系统基线快照。
> 注意：初始化AIDE数据库需要耗费时间，完成之后才能执行完整性检查。参阅第20章《使用AIDE实现入侵检测》。

5. **Linux审计框架**
快速开关Linux审计子系统。开启后系统记录大量安全审计事件。参见第40、41章《Linux审计框架》。

> 重要：在本模块中做的所有修改，只有点击主界面的「确定」按钮，才会真正写入系统配置文件。部分更改需要用户重新登录或者重启系统才会生效。

# 第18章 Polkit 认证框架

## 18.1 概念总览

Polkit 是一套认证框架，用于管控非特权进程与特权进程之间的交互。借助 Polkit，普通用户可以执行通常只允许 root 用户执行的操作，而不必授予完整的 root 权限。Polkit 通过定义规则，判断是否允许某个进程执行特权操作。

Polkit 的概念组成部分：

- **认证代理（The authentication agent）**：运行在用户会话内部的程序。当某个操作需要用户确认身份时，该代理提示用户输入密码。图形会话会自动启动认证代理；控制台会话则需要手动启动。
- **Polkit 的配置（Configuration of Polkit）**：由权限定义文件以及授权规则共同构成。权限定义文件描述系统提供的各个动作；授权规则定义哪些用户和会话可以执行这些动作。
- **Polkit 工具集（Polkit Utilities）**：一组用于查询特权、测试以及调试 Polkit 策略的命令行工具。

### 认证代理

Polkit 守护进程运行在系统后台，它本身不会向用户显示密码输入对话框。该任务由运行在用户会话中的认证代理完成。

当图形会话启动时，桌面环境会自动启动一个认证代理。
对于控制台登录会话，不会自动启动认证代理，必须手动运行，例如 `pkttyagent`。如果没有运行认证代理，需要身份验证的 Polkit 请求就会直接失败。

### Polkit 的配置

Polkit 配置分为两个部分。权限定义文件描述系统提供的各个动作（action）。这些文件一般由软件包提供，存放于 `/usr/share/polkit‑1/actions/`。**不要编辑该目录中的文件，软件包更新时会被覆盖。**

授权规则定义哪些用户可以执行哪些动作。自定义规则放在 `/etc/polkit‑1/rules.d/` 目录。规则文件使用 JavaScript 语法。文件必须以数字作为文件名开头，Polkit 会按字母顺序依次处理这些文件。

### Polkit 工具集

Polkit 提供若干命令行工具，用来查询权限、测试以及调试策略。

`pkcheck`

> 
> 检查进程是否被允许执行某个动作。

`pkexec`

> 
> 借助 Polkit 授权运行程序。

`pkttyagent`

> 
> 面向终端会话的认证代理。

`pkla‑admin`

> 
> 用于传统本地授权库的配置，现已废弃。

## 18.2 授权类型

Polkit 定义了多种授权判定结果，用来描述用户可以对某个动作拥有的权限。

- `no`：拒绝，绝不允许执行该操作。
- `yes`：允许，无需身份验证，直接执行。
- `auth_self`：要求验证执行操作的当前用户密码，验证通过方可执行。
- `auth_self_keep`：验证当前用户密码，成功后，在会话的短时间有效期内，再次执行同类操作无需重复输入密码。
- `auth_admin`：需要管理员用户的密码进行验证。
- `auth_admin_keep`：验证管理员密码，短时间会话有效期内复用授权，无需重复输入。

### 隐式授权

隐式授权写在动作定义文件内部。如果没有被自定义规则覆盖，系统就使用该内置授权。软件包在安装动作（action）文件时就附带该设置。

### SUSE 默认特权

openSUSE Leap 自带一套默认 Polkit 规则，文件位于 `/usr/share/polkit‑1/rules.d/50‑default‑privileges.rules`。
这套规则定义桌面环境常见行为的权限，例如挂载可移动介质、修改网络设置、电源管理操作等。该文件属于软件包提供的文件，禁止直接编辑。

## 18.3 查询特权

可以使用 `pkcheck` 工具查询某个动作对应的授权策略。

示例命令：

```
pkcheck --action-id org.freedesktop.udisks2.filesystem‑mount --process $(pidof nautilus)
```

`--action‑id` 指定要查询的动作ID。`--process PID` 用来指定待检查的进程ID。命令会输出该进程对应的授权结果（`yes` / `auth_admin` / `no` 等）。

如果想要模拟某个用户的权限进行测试，可以切换到该用户运行 `pkcheck`。

> 
> 提示：查找可用的动作ID
> 所有可用动作ID都存放在 `/usr/share/polkit‑1/actions/*.policy`。你可以使用 grep 命令检索。

```
grep "<action id" /usr/share/polkit‑1/actions/*.policy
```

## 18.4 修改 Polkit 配置

> 
> ⚠️警告：永远不要直接修改 `/usr/share/polkit‑1/rules.d/` 以及 `/usr/share/polkit‑1/actions/` 下的原始文件。软件包升级会覆盖这些修改，你的改动将会丢失。
> 所有自定义配置，都放置到 `/etc/polkit‑1/rules.d/` 目录，软件包更新不会覆盖该目录内的文件。

有两种修改策略的方式：

1. **覆盖Polkit策略文件**：使用 `.policy` XML策略文件。
2. **添加JavaScript授权规则**：使用 `.rules` JavaScript规则文件。

### 18.4.1 覆盖 Polkit 策略文件

`.policy` XML策略文件定义动作的元信息：动作描述、提示文本、隐式授权设置。

> 
> 重要：官方文档说明，不推荐用此方式改写权限，优先使用JavaScript规则。
> 如果你需要覆盖某个action，**不要修改 `/usr/share/polkit‑1/actions/xxx.policy`**。你要在 `/etc/polkit‑1/actions/` 目录创建一份同名策略文件，该文件会被优先读取。

### 18.4.2 添加 JavaScript 授权规则

规则文件放在 `/etc/polkit‑1/rules.d/`。文件名必须以数字开头，后缀为 `.rules`。Polkit 会按文件名的字母数字顺序依次加载规则，先加载的规则优先匹配。

示例文件 `/etc/polkit‑1/rules.d/90‑mycustom.rules`

```
polkit.addRule(function(action, subject) {
    if (action.id == "org.freedesktop.udisks2.filesystem‑mount" &&
        subject.isInGroup("wheel")) {
        return polkit.Result.YES;
    }
});
```

对象参数说明：

- `action` 对象：`action.id` 返回动作ID。
- `subject` 对象，描述发起请求的会话与用户。
  - `subject.user`：用户名。
  - `subject.isInGroup("groupname")`：判断用户是否属于指定用户组。
  - `subject.local`：布尔值，是否为本地会话。
  - `subject.active`：布尔值，会话是否处于激活状态。

可返回结果：

- `polkit.Result.YES`：直接允许操作
- `polkit.Result.NO`：拒绝操作
- `polkit.Result.AUTH_SELF`：验证当前用户密码
- `polkit.Result.AUTH_SELF_KEEP`：验证当前用户密码，短时间缓存授权
- `polkit.Result.AUTH_ADMIN`：验证管理员密码
- `polkit.Result.AUTH_ADMIN_KEEP`：验证管理员密码，短时间缓存授权
- `null`：当前规则不作处理，交由后续规则继续判断。

> 
> 重要提示
> 
> 
> 1. 文件必须是合法JavaScript。一旦存在语法错误，整个规则文件全部失效，Polkit会回退为拒绝权限。
> 2. 修改规则文件**不需要重启任何服务**，Polkit会自动重新加载规则。
> 3. 文件所有者应当设置为`root:root`，权限模式设置为`0644`，普通用户不可写入。

### 18.4.3 修改 SUSE 默认特权

SUSE默认规则文件位于`/usr/share/polkit‑1/rules.d/50‑default‑privileges.rules`，禁止直接编辑。
如果想要修改默认行为，请在`/etc/polkit‑1/rules.d/`创建数字编号更大的自定义规则，以此覆盖前面的规则，例如 `99‑override‑suse‑defaults.rules`。

## 18.5 恢复 SUSE 默认特权

如果你添加了很多自定义规则，想要完全恢复SUSE出厂默认Polkit配置：

1. 删除`/etc/polkit‑1/rules.d/`目录下所有自定义`.rules`文件。
2. 删除`/etc/polkit‑1/actions/`目录下所有自定义`.policy`文件。

> 
> 不需要修改`/usr/share`目录，该目录存放软件包提供的原始文件。删除自定义文件之后，Polkit会自动读取系统默认规则。

# 第19章 Linux中的访问控制列表（ACL）
## 19.1 传统文件权限
Linux 使用一套权限系统来管控文件与目录的访问权限。这套系统将访问权限划分为三类主体：文件所有者(user)、所属组(group)、其他所有用户(other)。每一类主体都具备读、写、执行三种权限。可以使用`ls -l`命令查看文件的传统权限。

### setuid位
当可执行文件设置了setuid（设置用户ID）位，该程序运行时将以**文件所有者**的身份执行，而不是运行该程序的用户身份。
举个例子：`/usr/bin/passwd` 文件拥有setuid位，文件所有者为root。普通用户执行 passwd 修改密码时，进程会临时获得root权限，从而可以修改仅root可写的 `/etc/shadow` 文件。

> 警告：setuid程序存在重大安全风险。如果setuid程序存在漏洞，攻击者就可以利用它获取文件所有者的权限；若所有者是root，则会直接获取root权限。因此系统上的setuid文件数量应当尽可能少。

### setgid位
setgid（设置组ID）位的作用分为两种场景：
1. **作用于可执行文件**：程序运行时，使用**文件所属组**的权限运行，而非执行用户的有效组。
2. **作用于目录**：在该目录下新建的文件和子目录，会自动继承该目录的所属组，而不是继承创建文件用户的默认组。
该功能常用于协作目录：多个用户属于同一个组，把setgid开启在共享目录，所有用户新建的文件自动归属该共享组。

### sticky位
sticky（粘滞位）主要用于目录。目录开启粘滞位之后，目录内的文件**仅允许文件所有者、目录所有者、root用户删除或者重命名**；即便是目录拥有写权限的其他用户，也无法删除别人创建的文件。

典型示例：`/tmp` 临时目录。所有用户都拥有对/tmp目录的读写执行权限，但开启sticky位，普通用户不能删除其他用户创建的临时文件。
使用`ls -ld /tmp`可以观察到权限末尾的`t`字符，代表sticky位已启用。

## 19.2 ACL的优势
传统的ugo（user‑group‑other）权限模型存在局限，只能针对所有者、所属组、其他用户设置权限。在现实场景经常遇到更复杂的访问需求：
> 示例：一个目录归用户alice所有，所属组为staff组。希望：
> 1. alice：读写执行
> 2. staff组成员：读执行，**禁止写**
> 3. 用户bob（不属于staff组）：读写执行
> 4. 其余所有人：无任何访问权限

传统ugo权限无法直接实现上面的需求：bob不属于所有者，也不属于staff组，只能归到other类别，而other权限是全局的，无法单独给bob授权。

**访问控制列表ACL(Access Control List)** 可以弥补传统权限的不足。ACL能够为任意数量的用户、用户组单独设置权限，不受ugo三类主体的限制。可以对不同用户/组分配差异化的读(r)、写(w)、执行(x)权限。

> 注意：ACL是对传统ugo权限的扩展，**不会替代传统权限**。传统权限仍然生效，二者共同决定最终访问结果。

## 19.3 定义
ACL由多条**ACL条目(entry)**组成。每条条目定义一个主体（用户或组）以及分配给该主体的权限。

条目类型分为：
1. **访问ACL(Access ACL)**：管控文件/目录本身的访问权限。
2. **默认ACL(Default ACL)**：**仅对目录生效**。目录设置默认ACL之后，该目录下**新建的文件和子目录会自动继承这套默认ACL规则**。已经存在的旧文件不会自动应用默认ACL。

每条ACL条目的格式：
`类型:标识符:权限`
- 类型：`u`代表用户(user)，`g`代表组(group)，`o`代表其他用户(other)，`m`代表掩码(mask)
- 标识符：用户名/UID，组名/GID；o类型没有标识符字段
- 权限：`r`读，`w`写，`x`执行；`-`代表无对应权限

示例：
```
u:bob:rwx     # 用户bob，读写执行
g:staff:r-x   # 组staff，读、执行，无写权限
o::---        # 其他用户无任何权限
m::rwx        # mask掩码 rwx
```

## 19.4 使用ACL
操作ACL使用工具：
- `getfacl FILE`：查看文件/目录的ACL条目
- `setfacl`：设置、修改ACL

> 基础示例：给用户bob对文件project.txt赋予读写权限
```bash
setfacl -m u:bob:rw- project.txt
getfacl project.txt
```

### ACL条目与文件模式权限位
当文件配置了ACL之后，传统`ls -l`展示的组权限位置，不再代表文件所属组的真实权限，**而是代表ACL的mask掩码**。
mask是ACL的上限阈值：所有用户条目、所有组条目的有效权限，**不能超过mask中定义的权限**。mask不影响文件所有者(u)，也不影响other(o)。

> 举例：
> mask设置为`r-x`；某一条ACL给用户bob设置`rwx`。那么bob实际生效权限只有`r‑x`，写权限会被mask截断。

当使用`setfacl -m`新增/修改ACL条目时，默认会自动重新计算更新mask。如果手动指定`-n`参数，则不会自动更新mask，需要管理员手动维护mask。

> ⚠️重要：`ls -l`看到的group字段显示的是mask，**不是原文件所属组的权限**。必须使用`getfacl`才可以看到真实ACL权限。

### 带有ACL的目录
举一个目录示例，目录`/srv/project`，所有者alice，组staff。
执行命令：
```bash
setfacl -m u:bob:rwx,g:staff:r-x,o::--- /srv/project
getfacl /srv/project
```
getfacl输出示例：
```
# file: srv/project
# owner: alice
# group: staff
user::rwx
user:bob:rwx
group::r-x
group:staff:r-x
mask::rwx
other::---
```
解析每一行：
1. `user::rwx`：空标识符，代表**文件所有者alice**的权限 rwx。
2. `user:bob:rwx`：专门给用户bob分配 rwx。
3. `group::r‑x`：空标识符，代表**文件原始所属组staff**的ugo传统组权限。
4. `group:staff:r‑x`：ACL针对staff组设置 r‑x。
5. `mask::rwx`：掩码上限，所有ACL用户、组最大可用权限rwx。
6. `other::---`：其他用户无权限。

执行`ls -ld /srv/project`，组权限列会显示`rwx`，这是mask的值，**不代表staff组拥有rwx权限**，staff实际权限是r‑x，以getfacl为准。

### 配置带默认ACL的目录
**Default ACL仅作用于目录**，用于给目录内后续新建文件、子目录自动继承ACL规则。
默认ACL的条目格式开头带`d:`。

示例：给目录`/srv/project`设置默认ACL，让后续新建对象自动继承权限：
```bash
setfacl -m d:u:bob:rwx,d:g:staff:r-x,d:o::--- /srv/project
getfacl /srv/project
```
输出会出现以`d:`开头的条目：
```
# file: srv/project
# owner: alice
# group: staff
user::rwx
user:bob:rwx
group::r-x
group:staff:r-x
mask::rwx
other::---
default:user::rwx
default:user:bob:rwx
default:group::r-x
default:group:staff:r-x
default:mask::rwx
default:other::---
```

> 关键点：
> 1. 已经存在的旧文件、旧子目录，**不会自动应用default ACL**，需要手动setfacl批量更新。
> 2. 新建子目录：同时继承访问ACL + 默认ACL（子目录继续把default ACL传递给自己内部的新建文件）。
> 3. 新建普通文件：只会继承访问ACL；普通文件会自动移除default部分，因为普通文件不能拥有默认ACL。
> 4. mask同样会被继承，新建对象会根据自身ACL自动计算mask。

> 批量递归设置（谨慎使用）：`setfacl -R -m ...`，-R递归，会遍历全部现有子对象。递归不会修改已经存在文件的default ACL，仅设置目标目录本身的default。

### ACL判定算法
当进程访问带有ACL的文件时，系统按照固定顺序判定是否允许访问：
1. 如果进程的有效UID与**文件所有者UID完全匹配** → 使用所有者(user::)的权限，算法结束。
2. 否则，如果进程的有效UID匹配**任意一条命名用户ACL条目(user:xxx)** → 使用该条目的权限，算法结束。
3. 否则，检查进程所属的全部组：
    a. 如果进程的任意一个组匹配**任意一条命名组ACL条目(g:xxx)**；或者匹配文件原始组(group::)。
    b. 收集所有命中的组条目的权限，取这些权限的**并集**。
    c. 将得到的权限集合和mask掩码做按位与运算，得到最终组权限。算法结束。
4. 如果上面全部都不命中 → 使用other(other::)的权限。

> 重点规则：
> - 用户条目优先级 > 组条目 > other。只要UID命中用户条目，完全不会再看组权限。
> - 多条组同时匹配时取权限并集；再受mask限制。
> - mask**不会限制文件所有者权限，也不会限制other权限**。仅约束命名用户ACL、命名组ACL、原始组ACL。

## 19.5 应用程序对ACL的支持
部分传统应用程序没有感知ACL的能力，仅操作传统ugo权限：
1. 文件复制命令`cp`：默认不复制ACL。如需复制ACL，需要加参数`-p`或者`--preserve=mode,acl`。
```bash
cp -p source.txt dest.txt
```
2. `mv`移动文件：在同一个文件系统内移动，ACL保留；跨文件系统移动等价于复制+删除，此时ACL可能丢失。
3. 归档工具tar：默认不备份ACL。备份ACL需要参数`--acls`，解压还原同样需要`--acls`。
```bash
tar --acls -cvf archive.tar directory/
tar --acls -xvf archive.tar
```

> 注意：如果把带有ACL的文件拷贝至**不支持ACL的文件系统**（部分老旧文件系统、U盘FAT32），ACL信息会直接丢失，仅保留传统ugo权限。openSUSE默认的btrfs、ext4完全支持ACL。
> 文件系统挂载时需要开启acl挂载选项；openSUSE默认安装的ext4/btrfs已经默认开启acl支持。

## 19.6 更多信息
手册页参考：
- `man 5 acl`：ACL文件格式、概念完整说明
- `man getfacl`：查看ACL命令手册
- `man setfacl`：设置ACL命令手册

> /usr/share/doc/packages/acl/ 目录下，安装acl文档包之后，可以找到额外的示例文档。

# 第20章 使用AIDE实现入侵检测
## 20.1 为什么要使用AIDE？
AIDE（高级入侵检测环境，Advanced Intrusion Detection Environment）是一个文件完整性检查工具。它会创建系统文件的数据库，之后可以利用该数据库将当前文件状态与数据库中记录的原始状态进行比对。

AIDE会记录文件的各类属性：权限、inode号、文件大小、文件的修改时间、创建时间、链接计数，以及多种加密校验和（例如SHA‑256）。

当系统遭受入侵时，攻击者常常会修改系统二进制程序、配置文件。攻击者修改这些文件后，会留下可被AIDE检测到的痕迹。AIDE并不能阻止入侵行为，但可以在入侵发生后帮助你发现系统篡改。

> 重要提醒：AIDE数据库本身也有可能遭到篡改。为了获取可靠的检测结果，请将初始化后的AIDE数据库副本保存到只读介质（例如DVD或者U盘）。

## 20.2 搭建AIDE数据库
> 重要：最佳实践
> 在系统刚刚完成安装、尚未接入网络的时候就初始化AIDE数据库。如果系统已经暴露在网络中，在生成数据库之前，要先确认系统没有被攻陷。

1. 安装软件包：
```bash
zypper in aide
```

2. AIDE的主配置文件为 `/etc/aide.conf`。该配置文件定义：
    - 需要监控哪些文件与目录
    - 需要忽略哪些文件与目录
    - 要对哪些文件属性做校验
    - 数据库文件的存放路径

打开 `/etc/aide.conf` 审阅配置。配置文件中包含大量注释，详细说明了各个选项。配置规则由**选择行（selection lines）**组成。选择行语法格式如下：
`文件路径 规则组[+‑属性]`

示例：
```conf
/etc    R
/bin    R
/sbin   R
/tmp    !
```
- `/etc R`：对 `/etc` 目录应用规则组`R`。
- `/bin R`：对 `/bin` 目录应用规则组`R`。
- `/sbin R`：对 `/sbin` 目录应用规则组`R`。
- `/tmp !`：完全排除 `/tmp` 目录，不做任何检查。

> 规则组：是一组预定义的检查项集合。配置文件内置了若干规则组，例如`R`代表“严格检查”。
> ```conf
> R = p+i+n+u+g+s+m+c+sha256
> ```
> - `p`：权限（文件模式）
> - `i`：inode编号
> - `n`：链接计数
> - `u`：属主用户
> - `g`：属主用户组
> - `s`：文件大小
> - `m`：修改时间 mtime
> - `c`：创建/变更时间 ctime
> - `sha256`：SHA256加密哈希值

你可以在规则组后使用 `+` / `-` 运算符，针对单一路径增加或者移除部分检查项。例如：
`/etc/shadow R‑sha256`
含义：对 `/etc/shadow` 使用规则组R，但是**不校验sha256哈希**。密码文件会频繁变更哈希，因此该设置很实用。

> 提示：路径通配符
> AIDE支持正则表达式形式的路径通配符。阅读配置文件注释了解完整语法。谨慎使用通配符，错误的通配规则会导致漏检文件。

3. 初始化AIDE数据库。
> 警告：请确保此时系统是干净未被入侵的。初始化会采集当前系统文件状态作为基准。
```bash
aide‑init
```
该命令读取 `/etc/aide.conf`，生成初始数据库，默认输出文件：`/var/lib/aide/aide.db.new`。

4. 将新生成的数据库重命名，作为正式的基准数据库。AIDE执行比对时读取 `aide.db`。
```bash
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```

> ⚠️强烈建议：将该基准数据库复制一份保存到只读介质（DVD、写保护U盘）。如果攻击者获得root权限，可以篡改磁盘上的 `/var/lib/aide/aide.db`，导致AIDE检测失效。
> ```bash
> cp /var/lib/aide/aide.db /media/read‑only‑usb/
> ```

5. （可选）配置定期自动检查。openSUSE Leap自带systemd定时器单元 `aidecheck.timer`。
启用定时器：
```bash
systemctl enable --now aidecheck.timer
```
默认配置：每周运行一次AIDE完整性校验。检查结果会写入系统日志，同时发送邮件给root用户。

你可以编辑 `/etc/sysconfig/aidecheck` 修改定时器行为：
- 修改执行周期：编辑 `/usr/lib/systemd/system/aidecheck.timer` 的 `OnCalendar` 字段，执行 `systemctl daemon‑reload` 生效。
- 修改邮件接收人、邮件参数：修改 `/etc/sysconfig/aidecheck`。

## 20.3 在本地执行AIDE检查
执行文件完整性比对，将当前系统文件与基准数据库 `/var/lib/aide/aide.db` 做对比：
```bash
aide‑check
```

命令退出码含义：
| 退出码 | 说明 |
| ---- | ---- |
| 0 | 没有发现任何变更，一切正常 |
| 1 | 发现文件存在不一致（文件被修改、新增或者删除） |
| 其他 | 发生错误（配置问题、文件无法读取等） |

> 提示：如果启用了systemd定时器，查看最近一次自动检查结果：
> ```bash
> journalctl -u aidecheck.service
> ```

输出报告会列出：
- 被修改的文件：变更了哪些属性（权限、大小、哈希、mtime等）
- 新增的文件
- 被删除的文件

### 更新AIDE基准数据库
当你做了合法系统变更（软件升级、修改配置文件），旧的基准数据库就过时了，需要更新基准数据库。
1. 执行检查，确认所有变更全部为预期的合法变更，**没有入侵迹象**。
2. 生成新数据库：
```bash
aide‑update
```
该命令生成 `/var/lib/aide/aide.db.new`。
3. 替换当前基准数据库：
```bash
mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db
```
4. 再次把新的数据库副本备份到你的只读存储介质。

> 警告：千万不要在怀疑系统已经被入侵的情况下执行 `aide‑update`。一旦系统已经被攻陷，更新数据库就会把攻击者篡改的文件记录作为合法基准，彻底丢失原始参考。这种场景应当使用入侵前保存到只读介质的旧基准数据库做比对，而不要更新本机数据库。

## 20.4 独立于系统的检查
> 重要安全加固手段：离线检测
> 如果怀疑系统已经被入侵，攻击者可能已经修改了本机的AIDE二进制程序或者本机数据库。此时直接在被入侵系统上运行aide‑check，输出结果可能是伪造的。

正确做法：使用**外部救援环境**（Live USB/DVD）启动计算机，挂载本地磁盘，使用一份来自干净介质的AIDE二进制程序 + 之前保存在只读介质的基准数据库，对磁盘文件做完整性校验。

操作步骤简述：
1. 使用openSUSE Live介质启动机器。
2. 将本地系统磁盘挂载到某个挂载点，例如 `/mnt`。
3. 挂载存放旧基准数据库的只读U盘/DVD。
4. 使用Live环境的aide，指定配置文件指向挂载磁盘、指定外部只读介质中的基准数据库，执行比对。
```bash
aide‑check‑c /mnt/etc/aide.conf‑‑database=file:/media/readonly‑usb/aide.db‑‑root=/mnt
```
> 注意：需要调整配置文件中的文件路径，适配chroot/mnt根目录，或者使用 `‑‑root` 参数。

通过这种方式，就算原系统的AIDE二进制、本机数据库已经被Rootkit篡改，也无法欺骗检测结果。

## 20.5 更多信息
安装 `aide‑doc` 软件包，可以获取完整文档：
```bash
zypper in aide‑doc
```
文档存放路径：`/usr/share/doc/packages/aide/`

参考资源：
- man aide：AIDE主手册页
- man aide.conf：配置文件参考手册页
- AIDE上游项目官网：https://aide.github.io
