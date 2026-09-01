[[toc]]

# 第一部分 高级系统管理

## 第1章 文本模式下的YaST

![[yast2_ncurses_main.png]](./image/yast2_ncurses_main.png)

ncurses伪图形YaST界面，专门用于没有X图形服务器的系统。相比GUI有诸多优势：全部操作使用键盘；资源占用极低，可以运行在配置较低硬件；支持SSH远程管理服务器。

> 
> 终端窗口最小支持尺寸80×25字符。

> 
> 图1‑1：文本模式YaST主界面

启动文本模式YaST，终端执行：`sudo yast2`。
使用方向键在控件之间切换。几乎全部按钮菜单项都有快捷键。

- F9：取消当前操作
- F10：确认保存变更。
界面标签上高亮字母代表快捷键，例如Q高亮，按`Alt+Q`激活按钮。

> 
> 窗口缩放导致界面错乱，按`Ctrl+L`刷新重绘界面。

### 在模块中导航

> 
> 下面操作前提：功能键、Alt快捷键没有被终端/窗口管理器抢占，详见后面“按键组合限制”。

**按钮、选择框跳转**
Tab键切换按钮与列表框；反向跳转使用`Alt+Tab`或者`Shift+Tab`。

**列表框内移动**
上下方向键浏览列表；条目过长使用`Shift+→` / `Shift+←`横向滚动。方向键跳转到其他框时改用`Ctrl+A`跳到行首，`Ctrl+E`跳到行尾。

**复选框、单选框**
空格键或者回车键选中；也可以直接`Alt+高亮字母`直接切换，无需回车确认。Tab定位到按钮，回车执行操作。

**功能键F1‑F12**
屏幕底部显示可用功能键。F1帮助；F10确认/下一步/完成。不同模块可用按钮不同。

**导航树（部分模块）**
左侧树形菜单，上下方向键移动；空格键展开折叠树节点；ncurses模式选中后**必须按回车**才会加载对应配置页面，减少频繁重绘。

**软件安装模块选择软件**
左侧筛选框搜索包；已安装包标记字母`i`；空格键修改软件包状态；也可以打开Actions菜单选择：安装、删除、更新、锁定、禁止安装。

![[yast2_ncurses_inst.png]](./image/yast2_ncurses_inst.png)
> 图1‑2：软件安装模块界面

### 高级快捷键

- `Shift+F1`：列出全部高级热键
- `Shift+F4`：切换配色方案
- `Ctrl+Q`：退出程序
- `Ctrl+L`：刷新屏幕
- `Ctrl+D Shift+F1`：列出高级热键
- `Ctrl+D Shift+D`：将当前界面截图保存到日志
- `Ctrl+D Shift+Y`：打开YDialogSpy查看控件层级

### 按键组合限制

如果窗口管理器抢占Alt快捷键，YaST的Alt组合会失效。终端设置也可能占用Shift/Alt。

**使用Esc替代Alt**
Alt+H → 按`Esc`松开，再按H。

**Ctrl+F / Ctrl+B 前后跳转**
Alt/Shift被抢占时，使用`Ctrl+F`向前，`Ctrl+B`向后。

**功能键限制**
F1‑F12也会被终端占用；**纯文本控制台中，Alt与功能键全部可用**。

### YaST命令行选项

查看帮助：

```
> sudo yast -h
```

#### 命令行安装软件包

知道包名，且源已启用，`‑i`参数安装：

```
> sudo yast -i package_name
> sudo yast --install package_name
```

包名可以是简短包名（自动处理依赖），也可以是本地RPM完整路径（不做依赖检查）。

> 
> 提示：简单软件管理优先使用zypper，yast仅提供基础命令行包管理。

#### 直接启动单个模块

```
> sudo yast module_name
```

查看本机全部模块列表：`yast -l` / `yast --list`

### YaST模块的命令行参数

部分模块支持非交互式命令行，用于脚本自动化；不是全部模块支持。
查看模块支持的子命令：

```
> sudo yast lan help
```

不支持命令行的模块会直接启动文本模式，提示：`This YaST module does not support the command line interface.`

**所有模块通用子命令**

1. `help`：列出可用子命令及说明

```
sudo yast lan help
```

2. `longhelp`：详细全部选项

```
sudo yast lan longhelp
```

3. `xmlhelp`：输出XML格式帮助，重定向文件

```
sudo yast lan xmlhelp xmlfile=/tmp/yast_lan.xml
```

4. `interactive`：进入交互式shell，直接输入子命令，`exit`退出。

#### yast add‑on

添加附加产品源，支持http、ftp、nfs、disk、cd、dvd协议。

```
sudo yast add-on http://server.name/directory/Lang-AddOn-CD1/
```

#### yast audit‑laf（Linux审计框架）

参阅《安全与加固指南》。

```
# 设置参数
sudo yast audit-laf set log_file=/tmp/audit.log
# 查看配置
sudo yast audit-laf show diskspace
```

#### yast dhcp‑server 管理DHCP服务

```
sudo yast dhcp-server disable          # 禁用服务
sudo yast dhcp-server enable           # 启用
sudo yast dhcp-server interface current # 监听网卡
sudo yast dhcp-server options help
sudo yast dhcp-server subnet help
sudo yast dhcp-server status           # 查看状态
sudo yast dhcp-server host help
```

#### yast dns‑server BIND DNS服务器

```
sudo yast dns-server acls show
sudo yast dns-server dnsrecord add zone=example.org query=office.example.org type=NS value=ns3
sudo yast dns-server forwarders add ip=10.0.0.100
sudo yast dns-server host show zone=example.org
sudo yast dns-server logging set updates=no transfers=yes
sudo yast dns-server mailserver add zone=example.org mx=mx1 priority=100
sudo yast dns-server nameserver add zone=example.com ns=ns1
sudo yast dns-server soa set zone=example.org serial=2006081623 ttl=2D3H20S
sudo yast dns-server startup atboot
sudo yast dns-server zones add name=example.org zonetype=master
```

#### yast disk 磁盘信息

```
sudo yast disk list disks
sudo yast disk list partitions
```

#### yast ftp‑server vsftpd FTP服务器

```
sudo yast ftp-server SSL enable
sudo yast ftp-server TLS disable
sudo yast ftp-server access authen_only
sudo yast ftp-server anon_access can_upload
sudo yast ftp-server anon_dir set_anon_dir=/srv/ftp
sudo yast ftp-server chroot enable
sudo yast ftp-server idle-time set_idle_time=15
sudo yast ftp-server logging enable
sudo yast ftp-server max_clients set_max_clients=1500
sudo yast ftp-server max_clients_ip set_max_clients=20
sudo yast ftp-server max_rate_anon set_max_rate=10000
sudo yast ftp-server max_rate_authen set_max_rate=10000
sudo yast ftp-server port_range set_min_port=20000 set_max_port=30000
sudo yast ftp-server show
sudo yast ftp-server startup atboot
sudo yast ftp-server umask set_umask=177:077
sudo yast ftp-server welcome_message set_message="hello everybody"
```

#### yast http‑server Apache2网页服务器

```
sudo yast http-server configure host=main servername=www.example.com serveradmin=admin@example.com
sudo yast http-server hosts create servername=www.example.com serveradmin=admin@example.com documentroot=/var/www
sudo yast http-server listen add=81
sudo yast http-server listen list
sudo yast http-server listen delete=80
sudo yast http-server mode wizard=on
sudo yast http-server modules enable=php5,rewrite
sudo yast http-server modules disable=ssl
sudo yast http-server modules list
```

#### yast kdump 内核崩溃转储配置

参阅《系统分析与调优指南》Kexec与Kdump章节。

```
sudo yast kdump copykernel
sudo yast kdump customkernel kernel=kdump
sudo yast kdump dumpformat dump_format=ELF
sudo yast kdump dumplevel dump_level=24
sudo yast kdump dumptarget target=ssh server=name_server port=22 dir=/var/log/dump user=user_name
sudo yast kdump immediatereboot enable
sudo yast kdump keepolddumps no=5
sudo yast kdump kernelcommandline command="ro root=LABEL=/"
sudo yast kdump kernelcommandlineappend command="ro root=LABEL=/"
sudo yast kdump notificationcc email="user1@example.com user2@example.com"
sudo yast kdump notificationto email="user1@example.com user2@example.com"
sudo yast kdump show
sudo yast kdump smtppass pass=/path/to/file
sudo yast kdump smtpserver server=smtp.server.com
sudo yast kdump smtpuser user=smtp_user
sudo yast kdump startup enable alloc_mem=128,256
sudo yast kdump startup disable
```

#### yast keyboard 控制台键盘布局

> 
> 只修改虚拟控制台，不修改GNOME/KDE图形桌面键盘。

```
sudo yast keyboard list
sudo yast keyboard set layout=czech
sudo yast keyboard summary
```

#### yast lan 网卡网络配置

```
sudo yast lan add name=vlan50 ethdevice=eth0 bootproto=dhcp
sudo yast lan delete id=0
sudo yast lan edit id=0 bootproto=dhcp
sudo yast lan list
```

#### yast language 系统语言

```
sudo yast language list
sudo yast language set lang=cs_CZ languages=en_US,es_ES no_packages
```

#### yast mail 邮件系统摘要

```
sudo yast mail summary
```

#### yast nfs NFS客户端挂载

```
sudo yast nfs add spec=remote_host:/path/to/nfs/share file=/local/mount/point
sudo yast nfs delete spec=remote_host:/path/to/nfs/share file=/local/mount/point
sudo yast nfs edit spec=remote_host:/path/to/nfs/share file=/local/mount/point type=nfs4
sudo yast nfs list
```

#### yast nfs‑server NFS服务端

```
sudo yast nfs-server add mountpoint=/nfs/export hosts=*.allowed_hosts.com
sudo yast nfs-server delete mountpoint=/nfs/export
sudo yast nfs-server set enablev4=yes security=yes
sudo yast nfs-server start
sudo yast nfs-server stop
sudo yast nfs-server summary
```

#### yast nis NIS客户端

```
sudo yast nis configure server=nis.example.com broadcast=yes
sudo yast nis disable
sudo yast nis enable server=nis.example.com broadcast=yes automounter=yes
sudo yast nis find domain=nisdomain.com
sudo yast nis summary
```

#### yast nis‑server NIS服务端

```
sudo yast nis-server master domain=nisdomain.com yppasswd=yes
sudo yast nis-server slave domain=nisdomain.com master_ip=10.100.51.65
sudo yast nis-server stop
sudo yast nis-server summary
```

#### yast proxy 代理设置

```
sudo yast proxy authentication username=tux password=secret
sudo yast proxy enable
sudo yast proxy disable
sudo yast proxy set https=proxy.example.com
sudo yast proxy summary
```

#### yast rdp 远程桌面

```
sudo yast rdp allow set=yes
sudo yast rdp list
```

#### yast samba‑client Samba客户端

```
sudo yast samba-client configure workgroup=FAMILY
sudo yast samba-client isdomainmember domain=SMB_DOMAIN
sudo yast samba-client joindomain domain=SMB_DOMAIN user=username password=pwd
sudo yast samba-client winbind enable
sudo yast samba-client winbind disable
```

#### yast samba‑server Samba服务端

```
sudo yast samba-server backend smbpasswd
sudo yast samba-server configure workgroup=FAMILY description='Home server'
sudo yast samba-server list
sudo yast samba-server role standalone
sudo yast samba-server service enable
sudo yast samba-server service disable
sudo yast samba-server share name=movies browseable=yes guest_ok=yes
```

#### yast security 系统安全等级

```
sudo yast security level server
sudo yast security set passwd=sha512 crack=yes
sudo yast security summary
```

#### yast sound 声卡配置

```
sudo yast sound add card=0 volume=75
sudo yast sound channels card=0
sudo yast sound modules
sudo yast sound playtest card=0
sudo yast sound remove card=0
sudo yast sound remove all
sudo yast sound set card=0 volume=80
sudo yast sound show card=0
sudo yast sound summary
sudo yast sound volume card=0 play
```

#### yast sysconfig 修改 /etc/sysconfig 配置变量

```
sudo yast sysconfig clear=POSTFIX_LISTEN
sudo yast sysconfig clear=CONFIG_TYPE$/etc/sysconfig/mail
sudo yast sysconfig details variable=POSTFIX_LISTEN
sudo yast sysconfig list all
sudo yast sysconfig set DISPLAYMANAGER=gdm
sudo yast sysconfig set CONFIG_TYPE$/etc/sysconfig/mail=advanced
```

#### yast tftp‑server TFTP服务器

```
sudo yast tftp-server directory path=/srv/tftp
sudo yast tftp-server directory list
sudo yast tftp-server status disable
sudo yast tftp-server status show
sudo yast tftp-server status enable
```

#### yast timezone 时区配置

```
sudo yast timezone list
sudo yast timezone set timezone=Europe/Prague hwclock=local
sudo yast timezone summary
```

#### yast users 用户账号管理

```
sudo yast users add username=user1 password=secret home=/home/user1
sudo yast users delete username=user1 delete_home
sudo yast users edit username=user1 password=new_secret
sudo yast users list system
sudo yast users show username=wwwrun
```

---

## 第2章 使用命令行工具管理软件

> 
> 本章介绍Zypper与RPM两套命令行软件管理工具。术语参考《安装指南》“软件安装卸载”章节。

### Zypper包管理器

Zypper是openSUSE命令行包管理器，安装、更新、删除软件，管理软件源。适合远程服务器、shell脚本自动化。

通用语法：

```
zypper [全局选项] 子命令 [子命令选项] [参数]
```

`zypper help`查看总帮助；`zypper help 子命令`查看单个命令帮助。

示例，打全部系统补丁：

```
> sudo zypper patch
```

**全局选项示例**
`--non‑interactive`非交互模式，自动确认所有提示：

```
> sudo zypper --non-interactive patch
```

**子命令专属选项**，示例自动接受许可证：

```
> sudo zypper patch --auto-agree-with-licenses
```

**包安装示例**

```
> sudo zypper install mplayer
```

`--from`：指定从某个软件源安装包，其余源仍然用于解决依赖。别名`--repo`。

```
> sudo zypper -v install --from factory mc vim
```

大部分zypper子命令支持`--dry‑run`模拟执行，用于测试。

```
> sudo zypper remove --dry-run MozillaFirefox
```

`--userdata`写入自定义字符串到日志，用于标记事务：

```
> sudo zypper --userdata "数据库服务器升级" patch
```

#### Zypper子命令

子命令存放路径默认`/usr/lib/zypper/commands`，找不到会遍历PATH。子命令**不支持zypper shell交互模式、全局选项**。

查看可用子命令：

```
> zypper help subcommand
> zypper help appstream-cache
```

### 使用Zypper安装删除软件

```
> sudo zypper install 包名
> sudo zypper remove 包名
```

> 
> ⚠警告：不要删除glibc、zypper、kernel这类核心系统包，系统会损坏无法启动。

**多种指定包的方式**

1. 完整包名

```
sudo zypper install MozillaFirefox
```

2. 包名+版本

```
sudo zypper install MozillaFirefox-52.2
```

3. 指定源别名+包名

```
sudo zypper install mozilla:MozillaFirefox
```

4. 通配符

```
sudo zypper install 'Moz*'
sudo zypper remove '*-debuginfo'
```

5. 虚拟能力（不需要精确包名）

```
sudo zypper install firefox
```

6. 能力+架构+版本

```
sudo zypper install 'firefox.x86_64'
sudo zypper install 'firefox>=74.2'
sudo zypper install 'firefox.x86_64>=74.2'
```

7. RPM本地/远程URL路径

```
sudo zypper install /tmp/install/MozillaFirefox.rpm
sudo zypper install http://download.example.com/MozillaFirefox.rpm
```

**同时安装+删除，使用`+ / ‑`修饰符**
安装emacs，同时卸载vim

```
sudo zypper install emacs -vim
```

卸载emacs，同时安装vim

```
sudo zypper remove emacs +vim
```

> 
> 注意：以`‑`开头的参数必须放在第二位，或者前面加`--`。

```
sudo zypper install -- -emacs +vim
```

**删除同时清理不再需要的依赖**

```
sudo zypper rm --clean-deps PACKAGE_NAME
```

**脚本中使用Zypper**
`--non‑interactive`关闭交互确认，适合cron、脚本。

```
sudo zypper --non-interactive install PACKAGE_NAME
```

**源码包操作**

```
zypper source-install PACKAGE_NAME          # 安装源码包+构建依赖
zypper source-install -D PACKAGE_NAME      # 只装源码，不装构建依赖
zypper source-install -d PACKAGE_NAME      # 仅安装构建依赖
zypper search -t srcpackage                # 列出源包
zypper source-download                     # 下载本机已安装包的源码
```

source‑download参数：`--directory`指定下载目录；`--status`只检查；`--delete`删除多余源码包。

**临时启用调试源**
`--plus‑content TAG`本次会话临时启用源，执行完自动禁用。

```
sudo zypper --plus-content debug install "debuginfo(build-id)=eb844a5c20c70a59fc693cd1061f851fb7d046f4"
```

> 
> 也可以使用该选项读取安装介质DVD源。

**校验依赖完整性**

```
zypper verify
```

**安装新增推荐包**（新增硬件后，补齐推荐驱动包）

```
sudo zypper install-new-recommends
```

### Zypper更新软件

三种更新方式：打补丁`zypper patch`、升级单个包`zypper update`、发行版大升级`zypper dist‑upgrade`。发行版升级参阅《启动指南》。

#### 安装全部系统补丁patch

> 
> patch优先打官方补丁，保证包版本正确性，避免冲突包。第三方源补丁默认不处理。

```
sudo zypper patch
```

附加选项：

```
sudo zypper patch --with-update          # 同时处理第三方源补丁
sudo zypper patch --with-optional         # 安装可选补丁
sudo zypper patch --bugzilla=972197      # 安装指定Bugzilla编号相关补丁
sudo zypper patch --cve=CVE-2010-2713    # 安装指定CVE安全漏洞补丁
sudo zypper patch --updatestack-only     # 只更新zypper包管理器本身
```

**查看补丁信息**

```
zypper patch-check                 # 统计需要安装的补丁数量
zypper list-patches                # 列出需要打的补丁
zypper patches                     # 列出源中全部补丁（含已安装）
zypper list-patches --bugzilla=12345
zypper list-patches --cve=CVE‑2022‑1234
```

#### 更新软件包版本 update

`zypper update`：将已安装包升级到源中可用新版本，**忽略被锁定包**。`zypper patch`遇到受漏洞影响的锁定包会报冲突。

```
sudo zypper update                # 更新全部已安装包
sudo zypper update PACKAGE_NAME    # 更新单个包
sudo zypper install PACKAGE_NAME   # install同样可以升级已有包

zypper list-updates                # 列出可升级包
zypper list-updates --all          # 全部可用包，含不满足依赖无法安装的
zypper packages --orphaned         # 列出孤儿包（没有任何源提供）
```

### 识别使用已删除文件的进程

软件更新后，部分进程仍然持有已经被删除的库文件，需要重启服务。

```
zypper ps
zypper ps -s        # 简短输出
zypper ps -ss       # 只显示系统服务进程
zypper ps -sss      # 只显示使用删除文件的系统服务
zypper ps --print "systemctl status %s" # 输出重启服务命令
```

### Zypper软件源管理

```
zypper repos                     # 列出源
zypper repos -d                  # 完整详情（URI，优先级）
sudo zypper addrepo URI 别名     # 添加源
sudo zypper refresh              # 刷新源元数据缓存
sudo zypper --plus-content refresh
sudo zypper removerepo 编号|别名 # 删除源
sudo zypper modifyrepo -er -p 20 'updates' # 修改源启用、自动刷新、优先级
sudo zypper renamerepo '旧别名' '新别名'
```

modifyrepo筛选参数：`‑a`全部源，`‑l`本地源，`‑t`远程源，`‑m TYPE`指定源类型http/https/ftp/cd/dvd/dir/nfs等。

### 查询源和包

```
zypper products
zypper patterns
zypper packages
zypper patches
zypper search "fire"
zypper search --match-exact "MozillaFirefox"
zypper search -d fire                 # 同时搜索描述
zypper search -u fire                 # 只显示未安装包
zypper what-provides 'perl(SVN::Core)' # 查询哪个包提供某个能力
zypper info --requires MozillaFirefox # 查看包依赖、推荐
```

### Zypper配置文件

全局配置：`/etc/zypp/zypper.conf`；用户私有配置：`~/.zypper.conf`。复制全局配置作为模板修改。

### 故障排查

源元数据异常强制重建缓存：

```
sudo zypper refresh -fdb
```

### Btrfs下Zypper回滚特性

根分区Btrfs并且安装snapper，zypper执行事务时自动创建快照，可以回滚zypper/YaST变更，详见第3章Snapper。

### 更多参考

`zypper help`、`man 8 zypper`；openSUSE维基 SDB:Zypper_usage。

---

### RPM包管理器

RPM(RPM Package Manager)管理rpm软件包；核心命令`rpm`、`rpmbuild`。RPM数据库保存本机全部已安装包信息。

rpm五大模式：安装、卸载/升级、重建数据库、查询RPM包、校验签名；rpmbuild编译源码生成RPM。

> 
> 开发库包一般后缀`‑devel`，存放头文件、库文件。

### 校验RPM包GPG签名

```
rpm --checksig PACKAGE-1.2.3.rpm
```

### RPM安装、更新、卸载

```
rpm -i PACKAGE.rpm      # 安装包，依赖不满足直接报错
rpm -U PACKAGE.rpm      # 升级，包不存在就安装
rpm -F PACKAGE.rpm      # freshen：只升级本机已经存在的包
rpm -e PACKAGE          # 卸载包，依赖冲突报错
```

> 
> rpm直接安装不会自动解决依赖，优先使用zypper。

> 
> RPM升级处理配置文件规则：

1. 管理员未修改配置：直接替换为新版本。
2. 管理员修改过配置：旧配置备份`.rpmsave`/`.rpmorig`，安装新版本`.rpmnew`。升级完成对比，手动合并修改，清理备份文件。

### Delta RPM增量RPM

只保存新旧版本差异，下载体积更小，但本地CPU开销大。工具包`deltarpm`。

```
makedeltarpm old.rpm new.rpm new.delta.rpm
applydeltarpm new.delta.rpm new.rpm
applydeltarpm -r old.rpm new.delta.rpm new.rpm
```

文档参考：`/usr/share/doc/packages/deltarpm/README`

### RPM查询

```
rpm -q 包名                 # 查询已安装包版本
rpm -qp file.rpm            # 查询rpm文件
rpm -qi wget                # 包详细信息
rpm -ql wget                # 列出包安装文件
rpm -qf /bin/wget           # 查询文件属于哪个包
rpm -qd wget                # 列出文档文件
rpm -qc wget                # 列出配置文件
rpm -q --changelog wget     # 查看变更日志
rpm -Va                     # 校验本机全部包文件改动
```

校验输出标记含义：
`5` MD5校验和、`S`文件大小、`L`符号链接、`T`修改时间、`D`设备号、`U`属主、`G`属组、`M`权限模式。配置文件会输出`c`标记。

RPM数据库存放于`/var/lib/rpm`。数据库损坏重建：

```
rpm --rebuilddb
```

### 源码包安装编译

src.rpm源码包。源码包目录约定`/usr/src/packages/`

- SOURCES：原始源码、补丁
- SPECS：spec构建描述文件
- BUILD：解压编译工作目录
- RPMS：编译完成二进制rpm
- SRPMS：生成源码rpm

```
rpmbuild -bp xxx.spec    # 解压打补丁
rpmbuild -bc xxx.spec    # 解压+编译
rpmbuild -bi xxx.spec    # 编译+安装
rpmbuild -bb xxx.spec    # 编译生成二进制RPM
rpmbuild -ba xxx.spec    # 全部，生成二进制+源码RPM
```

`build`工具提供隔离chroot编译环境。
Midnight Commander(mc)可以浏览rpm包内部文件。

## 第3章 使用Snapper进行系统恢复与快照管理

**摘要**
Snapper工具能够创建并管理文件系统快照。文件系统快照可以保存某一时间点的文件系统状态副本。Snapper的默认配置用于实现撤销系统变更。同时，你也可以借助它在磁盘上生成用户数据备份。该功能依赖Btrfs文件系统，或者配置了XFS/Ext4文件系统的精简配置LVM卷。

Snapper同时提供命令行接口与YaST图形接口。你可以使用Snapper在以下类型文件系统上创建、管理快照：

1. **Btrfs**：Linux支持写时复制的文件系统，原生支持对子卷创建快照（子卷是物理分区内可以独立挂载的文件系统）。Btrfs支持从快照直接引导系统，详见“通过快照引导实现系统回滚”小节。
2. **配置XFS或Ext4的精简配置LVM卷**。

借助Snapper，你可以完成以下任务：

- 撤销Zypper、YaST所做的系统更改，参见“使用Snapper撤销变更”
- 从历史快照恢复文件，参见“使用Snapper恢复文件”
- 通过快照引导执行系统整体回滚，参见“通过快照引导实现系统回滚”
- 在正在运行的系统中手动创建、管理快照，参见“手动创建和管理快照”

### 默认配置

openSUSE Leap中的Snapper被配置为系统变更的撤销与恢复工具。如果根分区（`/`）空间大于约16GB，系统会自动启用快照功能；根分区以外的其他分区，默认关闭快照。

#### 在已安装系统中启用Snapper

如果你在系统安装阶段关闭了Snapper，后续可以随时开启。为根文件系统创建默认Snapper配置，执行命令：

```
sudo snapper -c root create-config /
```

完成之后，按照“启用/关闭快照”小节描述开启各类快照类型。

> 
> 前提条件：Btrfs根文件系统必须拥有安装程序预设的子卷布局，并且分区大小至少16GB。

创建快照时，快照与原始文件系统指向磁盘上相同的数据块，**初始快照不会占用额外磁盘空间**。当原始文件系统的数据被修改，变更的数据块会被复制保留给快照。因此快照占用磁盘空间大小等于被修改的数据量。随着时间推移，快照占用空间会持续增长。

> 
> 重要：在含有快照的Btrfs文件系统上删除文件，不一定会释放磁盘空间。

#### 快照存放位置

快照始终存放在创建该快照的同一个分区/子卷内，**不能把快照存储到其他分区或者子卷**。
因此存放快照的分区容量需要比普通分区更大。实际占用空间高度取决于保存快照数量与数据修改量。经验法则：分区容量设置为普通需求的两倍。为避免磁盘耗尽，旧快照会被自动清理，详见“快照归档控制”。

#### 默认设置

- 磁盘大于16GB
配置文件：`/etc/snapper/configs/root``USE_SNAPPER=yes`，`TIMELINE_CREATE=no`
- 磁盘小于16GB
不会自动生成配置文件
`USE_SNAPPER=no`，`TIMELINE_CREATE=yes`

#### 快照的类型

快照本身技术实现没有区别，根据触发生成的事件，分为3类快照：

1. **时间线快照（Timeline snapshots）**
每小时生成一份快照，旧快照自动删除。默认保留最近10天、月、年的首个快照。openSUSE默认安装配置下，根文件系统**关闭**时间线快照，其余分区开启。
2. **安装快照（Installation snapshots）**
每次通过YaST或者Zypper安装软件包，会生成一对快照：安装前快照（Pre），安装结束后快照（Post）。如果安装内核这类重要系统组件，该快照对会标记为`important=yes`。旧快照自动清理。默认保存10个重要快照、10个普通快照。安装快照默认启用。
3. **管理快照（Administration snapshots）**
每次使用YaST执行系统管理操作，生成一对快照：模块启动前（Pre），模块关闭后（Post）。旧快照自动清理。默认保存10个重要快照、10个普通快照。管理快照默认启用。

#### 排除在快照之外的目录

出于多种原因，部分目录不会纳入快照备份，完整列表如下：

- `/boot/grub2/i386‑pc`、`/boot/grub2/x86_64‑efi`、`/boot/grub2/powerpc‑ieee1275`、`/boot/grub2/s390x‑emu`

> 
> 不支持回滚引导加载程序配置。以上目录是架构专属。前两个用于AMD64/Intel64机器，后两个分别用于IBM POWER、IBM Z架构。
- `/home`
如果`/home`不在独立分区，会被排除，防止执行回滚时造成用户数据丢失。
- `/opt`
第三方软件通常安装到此目录，排除避免回滚时卸载这些程序。
- `/srv`
存放Web、FTP服务器数据，防止回滚丢失业务数据。
- `/tmp`
所有存放临时文件、缓存的目录全部排除。
- `/usr/local`
手动编译安装软件的目录，避免回滚删除手动部署的程序。
- `/var`
包含大量动态文件：日志、临时缓存、`/var/opt`下第三方程序、虚拟机镜像、数据库。因此创建独立子卷，关闭写时复制，全部排除在快照之外。

#### 自定义配置

openSUSE Leap自带一套合理默认配置，大多数场景直接使用即可。但快照自动生成、快照保留策略全部都可以按需修改。

#### 启用/关闭快照

时间线、安装、管理三类快照可以独立开启或者关闭。

**开启/关闭时间线快照**
开启：

```
snapper -c root set-config "TIMELINE_CREATE=yes"
```

关闭：

```
snapper -c root set-config "TIMELINE_CREATE=no"
```

> 
> openSUSE默认安装，根文件系统关闭时间线快照，其他分区开启。

**开启/关闭安装快照**
开启：安装软件包`snapper‑zypp‑plugin`
关闭：卸载软件包`snapper‑zypp‑plugin`

> 
> 默认启用。

**开启/关闭管理快照**
开启：修改`/etc/sysconfig/yast2`设置`USE_SNAPPER=yes`
关闭：修改`/etc/sysconfig/yast2`设置`USE_SNAPPER=no`

> 
> 默认启用。

#### 控制安装快照

YaST/Zypper执行包安装时生成快照对，由`snapper‑zypp‑plugin`处理。配置文件`/etc/snapper/zypp‑plugin.conf`定义触发快照的规则。默认配置：

```
<?xml version="1.0" encoding="utf-8"?>
<snapper-zypp-plugin-conf>
 <solvables>
  <solvable match="w" important="true">kernel-*</solvable>
  <solvable match="w" important="true">dracut</solvable>
  <solvable match="w" important="true">glibc</solvable>
  <solvable match="w" important="true">systemd*</solvable>
  <solvable match="w" important="true">udev</solvable>
  <solvable match="w">*</solvable>
 </solvables>
</snapper-zypp-plugin-conf>
```

- `match`属性：`w`代表shell通配符；`re`代表Python正则表达式。
- 如果模式匹配包名，同时`important="true"`，该快照对标记为重要快照。
- 最后一行`<solvable match="w">*</solvable>`匹配所有软件包。

可以注释该行，不安装每一个包都生成快照：

```
<!-- <solvable match="w">*</solvable> -->
```

#### 创建并挂载新子卷

支持在`/`层级下面新建子卷并永久挂载。**千万不要在已经存在的快照内部创建子卷**，否则后续执行回滚操作之后，子卷将无法删除。

openSUSE Leap预置`/@`子卷，`/opt`、`/srv`、`/home`等永久子卷全部创建于此初始根文件系统下。
示例，从`/dev/sda2`创建`/usr/important`子卷：

```
sudo mount /dev/sda2 -o subvol=@ /mnt
sudo btrfs subvolume create /mnt/usr/important
sudo umount /mnt
```

`/etc/fstab`对应配置行：

```
/dev/sda2 /usr/important btrfs subvol=@/usr/important 0 0
```

**关闭写时复制CoW**
子卷存放频繁变更文件（虚拟机磁盘镜像、数据库、日志），建议关闭写时复制，避免磁盘块大量复制。在`/etc/fstab`使用挂载参数`nodatacow`：

```
/dev/sda2 /usr/important btrfs nodatacow,subvol=@/usr/important 0 0
```

也可以对单个文件/目录执行命令关闭CoW：

```
chattr +C PATH
```

#### 快照归档控制

快照占用磁盘空间。为了防止磁盘占满引发系统故障，旧快照会被自动删除。默认最多保留10个重要安装/管理快照，10个普通快照。如果快照占用空间超过根分区50%，继续删除多余快照。系统始终最少保留4个重要快照、2个普通快照。
修改参数参见“管理现有配置”小节。

#### 在精简配置LVM卷上使用Snapper

Snapper除Btrfs之外，也支持**精简配置LVM卷**创建快照（普通LVM卷不支持），文件系统支持XFS、Ext4、Ext3。

在LVM上使用Snapper，创建配置时必须指定文件系统类型：

```
sudo snapper -c lvm create-config --fstype="lvm(xfs)" /thin_lvm
```

然后按照“管理现有配置”修改配置参数。

### 使用Snapper撤销变更

openSUSE Leap的Snapper预先配置，用来撤销Zypper与YaST产生的系统变更。每次运行Zypper或者YaST，会自动生成Pre（操作前）与Post（操作后）一对快照。同时也可以恢复误删除、被修改的系统文件。做文件恢复需要开启根分区的时间线快照。

> 
> 默认自动快照只针对根分区与其子卷生效。`/home`等其他分区需要手动新建Snapper配置。

#### “撤销变更”对比“系统回滚”

使用快照恢复数据，区分两种完全不同场景：

1. **撤销变更（Undoing changes）**
对比两份快照，只把两份快照之间发生改动的部分进行回退。该模式还可以选择性恢复部分文件，不需要全部回滚。
2. **系统回滚（Rollback）**
把整个系统重置到快照拍摄时刻的完整状态。

> 
> 建议系统整体故障修复优先使用**从快照引导执行回滚**，速度更快，并且执行回滚前可以预览系统状态。

⚠️ **数据一致性提醒**
快照机制没有办法保证文件数据一致性。当快照生成瞬间，某个文件（数据库）正在写入，快照保存下来会是损坏、半写入状态。恢复这类文件会引发故障。同时，部分系统文件，例如`/etc/mtab`**绝对不允许恢复**。恢复文件前务必仔细对比变更列表与差异，只恢复确实需要回退的文件。

#### 撤销YaST与Zypper变更

安装阶段根分区采用Btrfs，Snapper会自动安装。每次启动YaST模块或者Zypper事务，生成Pre‑Post快照对。
可以使用YaST Snapper模块或者snapper命令，从Pre快照恢复文件，实现撤销变更；同时可以查看哪些文件发生修改，查看文件diff差异。

#### 操作流程3.1 使用YaST Snapper模块撤销变更

1. 在YaST的杂项分类打开Snapper模块，或者执行命令`yast2 snapper`。
2. 当前配置保持为`root`（没有手动新增配置就默认root）。
3. 在列表选中一组Pre‑Post快照对。YaST操作快照描述栏标记为`zypp(y2base)`，Zypper操作标记为`zypp(zypper)`。
4. 点击【显示变更（Show Changes）】，查看两份快照之间有差异的全部文件。
5. 浏览变更列表，选中文件可以查看两份快照版本之间diff差异。
6. 勾选想要恢复的文件或目录，点击【恢复选中项（Restore Selected）】，确认选择【Yes】。

恢复单个文件：点击文件名打开diff视图，点击【从第一个快照恢复（Restore from First）】确认Yes。

#### 操作流程3.2 使用snapper命令行撤销变更

1. 列出YaST/Zypper快照对：

```
sudo snapper list -t pre-post
```

输出示例：

```
Pre # | Post # | Pre Date                      | Post Date                     | Description
------+--------+-------------------------------+-------------------------------+--------------
311   | 312    | Tue 06 May 2018 14:05:46 CEST | Tue 06 May 2018 14:05:52 CEST | zypp(y2base)
340   | 341    | Wed 07 May 2018 16:15:10 CEST | Wed 07 May 2018 16:15:16 CEST | zypp(zypper)
```

2. 查看快照对变更文件，`PRE..POST`替换为实际编号：

```
sudo snapper status 350..351
```

- `+` 新增文件；`-` 删除文件；`c` 文件内容变更。

3. 查看单个文件差异：

```
sudo snapper diff 350..351 /usr/share/fonts/truetype/fonts.scale
```

4. 执行撤销变更。指定文件名只恢复部分文件，不写文件名恢复全部变更文件：

```
sudo snapper -v undochange 350..351
```

> 
> ⚠️ 不建议用Snapper撤销用户账号新增/删除操作。部分目录被排除快照，对应文件不会被回滚。如果新建一个和已删除用户UID相同的账号，会继承旧用户遗留文件。删除用户优先使用YaST用户组管理工具。

### 使用Snapper恢复文件

除安装、管理快照之外，Snapper还可以生成时间线快照。你可以利用这些备份快照恢复误删除文件，或者还原文件旧版本。同时diff工具可以查看某个时间点文件做了哪些修改。

> 
> `/home`等默认不做快照的子卷，如果想要恢复文件，需要单独为此目录创建Snapper配置并开启时间线快照，参见“创建和修改Snapper配置”。

> 
> 区分：根文件系统快照可以做系统回滚。**推荐使用从快照引导的方式完成系统整体回滚**。虽然也可以通过恢复全部文件实现回滚，但不推荐，仅适合恢复个别配置文件，不适合完整系统重置。该限制仅针对根分区快照。

#### 操作流程3.3 使用YaST Snapper模块恢复文件

1. 打开Snapper模块：`yast2 snapper`。
2. 切换到对应需要恢复文件的Snapper配置。
3. 选中一条类型为`Single`、描述为`timeline`的时间线快照，点击【显示变更】。
4. 在列表点击文件名，查看快照版本和当前系统版本差异。勾选需要恢复的文件。
5. 点击【恢复选中项】，确认Yes。

#### 操作流程3.4 使用snapper命令行恢复文件

1. 列出指定配置的全部时间线快照：

```
sudo snapper -c CONFIG list -t single | grep timeline
```

把`CONFIG`替换为你的配置名称；`snapper list‑configs`查看全部配置。

2. 查看快照与当前系统之间变更文件（`SNAPSHOT_ID..0`代表快照对比当前系统）：

```
sudo snapper -c CONFIG status SNAPSHOT_ID..0
```

3. 查看文件差异：

```
sudo snapper -c CONFIG diff SNAPSHOT_ID..0 FILE_NAME
```

4. 执行恢复，多个文件空格隔开，不写文件名恢复全部变更文件：

```
sudo snapper -c CONFIG -v undochange SNAPSHOT_ID..0 FILENAME1 FILENAME2
```

#### 通过快照引导执行系统回滚

openSUSE Leap内置的GRUB2支持从Btrfs快照启动。配合Snapper回滚功能，可以修复配置损坏的系统。**只有root配置生成的快照支持引导启动**。

#### 支持条件

openSUSE Leap 15.6起，系统回滚功能仅支持根分区保持安装程序默认Btrfs子卷布局。

- 从快照启动时，快照内文件系统部分以只读挂载；被排除快照的其他目录读写挂载，可以正常修改。

> 
> 区分两个概念
> 
> 
> - **撤销变更**：对比两份快照，只回退两者之间的改动，可选择性恢复部分文件。
> - **系统回滚**：将整个系统重置到快照拍摄时刻的完整状态。

执行可引导快照回滚，需要满足：

1. 根文件系统必须是Btrfs；LVM卷快照**不支持引导**。
2. 根文件系统位于单个磁盘设备，执行命令 `sudo /sbin/btrfs filesystem show`，输出必须显示`Total devices 1`。多块设备Btrfs不支持。
3. 被排除快照的目录（如`/srv`）可以放在独立磁盘设备。
4. 系统可以通过本机引导器正常启动。
5. 只回滚`/`子卷的内容；其他子卷不受回滚操作影响。

#### 执行回滚操作步骤

1. 启动计算机，在GRUB菜单选择【可引导快照（Bootable snapshots）】，选中目标快照。快照列表按时间排序，最新的排在最上方。
2. 登录系统，仔细检查各项业务是否正常。> 
> 注意：快照内的目录是只读。写入被排除快照的目录中的数据不会丢失。
3. 根据检查结果选择后续动作：
   - 如果不想执行回滚，直接重启，回到当前系统运行状态，重新选择别的快照或者救援模式。
   - 如果确认执行回滚：

```
sudo snapper rollback
```

执行完毕重启计算机。在GRUB默认引导项启动，进入已经回滚完成的系统。回滚操作执行前会生成一份操作前系统状态快照。原来的根默认子卷被替换为一份全新读写快照。

> 
> 安装结束时会自动生成一份可引导快照，描述文字为`after installation`，你随时可以回退到刚安装完成的状态。系统升级大版本或者Service Pack同样会生成可引导快照，前提是快照功能没有关闭。

#### 回滚之后的快照

执行回滚操作前，会生成一份记录回滚前系统状态的快照。快照描述会记录本次回滚所恢复快照的编号。
回滚生成快照的清理属性设置为`number`，达到保留数量上限会被自动清理。如果快照内有重要业务数据，需要在快照被自动删除前导出保存。

示例回滚之后快照列表：

```
# snapper --iso list
Type   | # |     | Cleanup | Description           | Userdata
-------+---+ ... +---------+-----------------------+--------------
single | 0 |     |         | current               |
single | 1 |     |         | first root filesystem |
single | 2 |     | number  | after installation    | important=yes
single | 3 |     | number  | rollback backup of #1 | important=yes
single | 4 |     |         |                       |
```

#### 访问、识别快照引导项

重启机器，在GRUB菜单选择【从只读快照启动引导器】，页面列出全部可引导快照，最新快照排在最上面，使用上下箭头选择，回车确认。

> 
> ⚠️已知问题：在UEFI环境从Btrfs快照启动Xen目前会失败，参考SUSE知识库文档ID：000020602。

每个快照引导条目命名格式：
`[*] OS (KERNEL, DATE T TIME, DESCRIPTION)`

- `*`：快照标记为important时显示星号
- OS：操作系统标签
- DATE：格式`YYYY‑MM‑DD`
- TIME：格式`HH:MM`
- DESCRIPTION：快照描述文本。自动生成快照显示调用工具名称如`zypp(zypper)`、`yast_sw_single`；手动快照显示`--description`设置字符串。引导屏幕空间有限，过长描述会被截断。

**设置快照引导自定义描述**
可以修改快照描述字段，自定义显示文字。限制不超过25字符，否则引导界面无法完整显示。

```
sudo snapper modify --userdata "bootloader=STRING" NUMBER
```

`NUMBER`替换为快照编号，`STRING`替换自定义文字。

#### 功能限制

系统回滚**无法做到将系统完全还原到快照拍摄时刻一模一样的状态**。

1. **被排除快照的目录**`/opt`、`/srv`、`/home`、`/var`等目录不纳入快照，回滚不会恢复这些目录内容，带来以下后果：
   - 附加组件、第三方软件可能失效：程序主体被回滚，但程序数据目录保留新版本数据，版本不匹配。解决方案：重装对应软件。
   - 文件访问异常：快照与当前系统之间权限属主发生变化，需要手动修复权限。
   - 不兼容数据格式：服务生成新版本数据文件，回滚到老版本程序无法读取，造成故障。
   - 混合代码与数据的子卷，例如`/srv`，回滚后业务代码版本和数据版本不一致。
   - 用户数据：回滚删除系统用户，但被排除目录下面该用户的文件还会残留。如果新建UID相同用户，直接继承旧文件。需要`find`命令查找孤儿文件清理。
2. **引导加载程序无法回滚**`/boot`相关各阶段引导组件必须版本匹配。回滚不能保证引导器组件兼容，因此引导程序不会被回滚。

### 在用户家目录启用Snapper

可以为用户`/home`目录开启快照，适用场景：

- 普通用户自行管理快照、执行回滚；
- 系统账号（数据库、运维账号）需要对配置文件、文档做版本留存；
- Btrfs后端的Samba家目录共享。

每个用户家目录为独立Btrfs子卷，可以手动配置，也可以使用`pam_snapper`自动处理。`pam_snapper`提供与`useradd`、PAM认证模块、Snapper集成。默认在用户登录、注销时生成快照；用户长时间登录也会生成时间快照。配置可以通过Snapper命令与配置文件修改。

#### 安装pam_snapper并创建用户

前提：`/home`使用Btrfs文件系统，还没有创建普通用户。

1. 安装软件包

```
zypper in pam_snapper
```

2. 修改`/etc/pam.d/common‑session`增加一行：

```
session optional pam_snapper.so
```

3. 修改脚本`/usr/lib/pam_snapper/pam_snapper_useradd.sh`，把`DRYRUN=1`改为`DRYRUN=0`，关闭模拟运行。
4. 创建新用户：

```
/usr/lib/pam_snapper/pam_snapper_useradd.sh username group passwd=password
```

> 
> 用户首次登录时，`/etc/skel`模板文件才会复制到家目录。
> 
> 
> 5. 查看生成的Snapper配置：

```
snapper list --all
```

#### 删除用户

修改脚本`/usr/lib/pam_snapper/pam_snapper_userdel.sh`，`DRYRUN=1`改为`DRYRUN=0`。执行命令删除用户、家子卷、全部快照、Snapper配置：

```
/usr/lib/pam_snapper/pam_snapper_userdel.sh username
```

#### 手动在家目录启用快照

前提条件：`/home`格式化为Btrfs，用户尚未创建。

```
btrfs subvol create /home/username
snapper -c home_username create-config /home/username
sed -i -e "s/ALLOW_USERS=\"\"/ALLOW_USERS=\"username\"/g" /etc/snapper/configs/home_username
yast users add username=username home=/home/username password=password
chown username:group /home/username
chmod 755 /home/username/.snapshots
```

### 创建和修改Snapper配置

Snapper行为由针对分区/Btrfs子卷的独立配置文件控制，配置文件存放路径`/etc/snapper/configs/`。
openSUSE安装时，如果根分区容量大于约12GB，会自动为根`/`生成名为`root`的配置，管理YaST/Zypper生成快照。

> 
> 根分区开启快照最低空间约12GB。计算公式：`ROOT_BASE_SIZE*(1+BTRFS_INCREASE_PERCENTAGE/100)`，数值来自安装介质`control.xml`。建议实际部署预留两倍空间。

你可以为其他Btrfs子卷创建自定义配置。下面示例为挂载在`/srv/www`的Web服务器数据分区新建Snapper配置：

```
sudo snapper -c www-data create-config /srv/www
```

该命令会读取模板`/etc/snapper/config‑templates/default`生成配置。你也可以自定义模板文件：

```
sudo snapper -c www-data create-config -t MY_DEFAULTS /srv/www
```

#### 管理现有配置

- 列出全部配置

```
snapper list-configs
```

- 查看指定配置参数

```
snapper -c root get-config
```

- 修改配置项：

```
snapper -c CONFIG set-config OPTION=VALUE
```

- 删除配置：

```
snapper -c CONFIG delete-config
```

#### 配置参数说明

| 参数 | 说明 |
| --- | --- |
| ALLOW_GROUPS、ALLOW_USERS | 允许普通用户操作快照的组、用户，默认空字符串 |
| BACKGROUND_COMPARISON | 创建Pre‑Post快照之后是否后台比对差异，默认yes |
| EMPTY_* | 控制无差异Pre‑Post快照对的清理策略 |
| FSTYPE | 文件系统类型，不要手动修改。默认btrfs |
| NUMBER_* | 安装/管理（numbered）快照的自动清理参数 |
| QGROUP / SPACE_LIMIT | Btrfs配额组、快照磁盘空间上限 |
| SUBVOLUME | 快照对应的挂载点/子卷，不要手动修改 |
| SYNC_ACL | 是否自动同步ACL，让普通用户可以读取`.snapshots`目录，默认no |
| TIMELINE_CREATE | 是否开启每小时时间线快照，默认no(root配置) |
| TIMELINE_CLEANUP / TIMELINE_LIMIT_* | 时间线快照保留清理规则 |

> 
> **普通用户使用Snapper**：默认只有root可以操作快照。如果需要普通用户管理快照，设置`ALLOW_USERS` / `ALLOW_GROUPS`，并且开启`SYNC_ACL="yes"`。

#### 操作流程3.5 授予普通用户Snapper权限（root执行）

1. 为目标分区创建Snapper配置（如还没有）。
2. 设置允许用户，示例授予`www_admin`用户权限：

```
snapper -c web_data set-config "ALLOW_USERS=www_admin" SYNC_ACL="yes"
```

3. 用户测试：

```
www_admin:~ > snapper -c web_data list
```

#### 手动创建和管理快照

Snapper不限于自动触发快照，你可以使用YaST模块或者命令行手动创建Pre‑Post快照对，或者独立single快照。所有操作都基于已存在的Snapper配置。不指定配置默认使用root。

#### 快照元数据

每一份快照包含快照本体和元数据。修改快照只能修改元数据，**快照的文件内容不可修改**。
查看快照列表与元数据：

```
snapper list
snapper -c home list
snapper list -a
snapper list -t pre-post
snapper list -t single
```

元数据字段：

- **Type**：快照类型 pre / post / single；不可修改
- **Number**：快照唯一编号；不可修改
- **Pre Number**：post快照对应的pre快照编号；仅post类型，不可修改
- **Description**：快照描述文本
- **Userdata**：自定义键值对，例如`important=yes`，`bootloader=xxx`
- **Cleanup‑Algorithm**：自动清理算法 `number` / `timeline` / `empty‑pre‑post`

快照三种类型：

1. `pre`：变更前快照，与post成对，用于Zypper/YaST；
2. `post`：变更完成后快照，与pre配对；
3. `single`：独立快照，用于时间线、手动快照。

自动清理算法：

1. `number`：达到快照最大数量就删除旧快照；
2. `timeline`：按时间保留小时、日、月、年快照，超期删除；
3. `empty‑pre‑post`：删除两份之间没有发生任何改动的pre/post快照对。

#### 创建快照

创建独立single快照：

```
snapper create --description "Weekly backup"
snapper --config home create --description "Home backup" --cleanup-algorithm timeline
```

创建Pre‑Post成对快照（执行某个操作前后）：

```
snapper create --type pre --print-number --description "Before Apache config edit" --userdata "important=yes"
snapper create --type post --pre-number 30 --description "After Apache config edit" --userdata "important=yes"
```

直接运行一条命令，自动执行命令并生成前后快照：

```
snapper create --command COMMAND --description "before and after run command"
```

#### 修改快照元数据

只可以修改描述、userdata、cleanup‑algorithm。

```
snapper modify --cleanup-algorithm "timeline" 10
snapper modify --userdata "bootloader=Upgrade‑2025‑04‑01" 12
```

#### 删除快照

```
snapper delete NUMBER
snapper -c home delete 89 90
snapper delete --sync 23
```

> 
> 不能删除代表当前系统的默认子卷快照。删除快照后Btrfs后台进程回收磁盘空间，空间释放不会立刻生效，`--sync`参数强制立即回收。
> 如果只存在Btrfs子卷，Snapper元数据XML丢失，快照不会被snapper list列出，需要手动删除子卷：

```
btrfs subvolume delete /.snapshots/NUMBER/snapshot
rm -rf /.snapshots/NUMBER
```

### 快照自动清理

快照持续占用磁盘，Snapper提供自动清理策略，由每日cron定时任务执行。分为`number`编号快照清理、`timeline`时间线快照清理、空快照对清理、手动快照清理，还支持磁盘配额。

#### 清理编号快照（number快照）

配置参数：

- `NUMBER_CLEANUP=yes/no` 是否开启清理
- `NUMBER_LIMIT` / `NUMBER_LIMIT_IMPORTANT`：普通、重要快照保留数量（支持范围格式`2‑10`用于开启配额模式）
- `NUMBER_MIN_AGE`：快照最小存活秒数，不足时间不会被删除。

示例配置，无论快照生成多久，最多保留10份快照：

```
NUMBER_CLEANUP=yes
NUMBER_LIMIT_IMPORTANT=10
NUMBER_LIMIT=10
NUMBER_MIN_AGE=0
```

只保留10天以内快照：

```
NUMBER_CLEANUP=yes
NUMBER_LIMIT_IMPORTANT=0
NUMBER_LIMIT=0
NUMBER_MIN_AGE=864000
```

#### 清理时间线快照（timeline）

参数：

- `TIMELINE_CLEANUP` 开启/关闭
- `TIMELINE_LIMIT_HOURLY`、`TIMELINE_LIMIT_DAILY`、`TIMELINE_LIMIT_WEEKLY`、`TIMELINE_LIMIT_MONTHLY`、`TIMELINE_LIMIT_YEARLY`
- `TIMELINE_MIN_AGE`：最小存活秒数。

示例时间线配置：

```
TIMELINE_CLEANUP="yes"
TIMELINE_CREATE="yes"
TIMELINE_LIMIT_DAILY="7"
TIMELINE_LIMIT_HOURLY="24"
TIMELINE_LIMIT_MONTHLY="12"
TIMELINE_LIMIT_WEEKLY="4"
TIMELINE_LIMIT_YEARLY="2"
TIMELINE_MIN_AGE="1800"
```

含义：保留最近24小时每小时快照；保留7天的每日首快照；保留4周每周首快照；保留12个月每月首快照；保留2年每年首快照；快照至少存活30分钟才允许被清理。

#### 清理无差异快照对

当pre与post快照之间没有发生任何文件变更，自动删除这一组快照。

```
EMPTY_PRE_POST_CLEANUP="yes"
EMPTY_PRE_POST_MIN_AGE="1800"
```

#### 清理手动创建快照

手动快照不会自动清理。创建快照时可以指定`--cleanup‑algorithm number`或者`timeline`，让它纳入对应自动清理规则。

```
snapper create --description "test manual snapshot" --cleanup-algorithm number
snapper modify --cleanup-algorithm "timeline" 25
```

#### 添加磁盘配额支持

Btrfs qgroup配额，限制快照占用子卷磁盘空间百分比。

> 
> 配额针对Btrfs子卷，不是操作系统用户。

如果安装时开启Snapper，配额自动初始化。手动开启：

```
snapper setup-quota
```

配置参数：

- `QGROUP`：Btrfs配额组ID，由setup‑quota生成，不建议手动修改
- `SPACE_LIMIT`：快照允许占用空间占子卷总空间的比例，取值0‑1（0.5代表50%）

> 
> 逻辑：首先执行number/timeline清理，如果清理完成之后快照占用空间仍然超过SPACE_LIMIT，再次执行第二轮清理。即便超过配额，配置的最小保留数量的快照一定会被保留。
> 如果配置为范围限制，例如`NUMBER_LIMIT=5‑20`：最多保留20份；空间不足时逐步删除，最少保留5份。

#### 查看快照独占磁盘占用

普通`du`、`df`无法区分快照共享数据与独占数据。Snapper0.6及以上版本`snapper --iso list`会显示`Used Space`（快照独占占用）。

```
snapper --iso list
```

也可以直接使用btrfs qgroup命令查看子卷独占空间：

```
btrfs qgroup show -p /
btrfs subvolume list -st /
```

### 常见问题

**Q：为什么`/var/log`、`/tmp`等目录看不到快照变更？**
A：这些目录被创建独立子卷，从快照机制排除，避免回滚带来问题。

**Q：可以从引导器直接启动快照吗？**
A：可以，参考“通过快照引导执行系统回滚”章节。

**Q：能否让某些快照不会被自动清理删除？**
A：Snapper没有开关阻止手动删除快照。但是可以清除快照的cleanup‑algorithm字段，自动清理任务就不会处理这份快照。

```
snapper list -a
snapper modify --cleanup-algorithm "" #快照编号
```

**Q：在哪里获取更多Snapper资料？**
A：官方网站 [http://snapper.io/](http://snapper.io/)

## 第4章 VNC远程图形会话

> 摘要
> 虚拟网络计算（VNC）让你可以通过图形桌面访问远程计算机，在远端主机上运行图形应用。VNC具备跨平台特性，可以在任意操作系统上访问远程机器。本章介绍如何使用`vncviewer`与Remmina桌面客户端连接VNC服务器，同时讲解VNC服务器的运维操作。

openSUSE Leap支持两类VNC会话：
- **一次性会话（one‑time sessions）**：客户端保持连接时会话存活；客户端断开，会话随即终止。
- **持久会话（persistent sessions）**：除非显式终止，否则会话会一直保持运行。

一台VNC服务器可以在不同端口同时提供两种会话。但已经运行的会话，无法在一次性会话与持久会话之间互相转换。

### vncviewer客户端
#### 受支持的显示管理器
机器只有运行支持XDMCP协议的显示管理器，才可以稳定接收VNC连接。gdm、lxdm、lightdm支持XDMCP；KDE5默认显示管理器`sddm`**不支持XDMCP**。
如果更换默认显示管理器，请注销当前X会话，重启显示管理器服务：
```bash
sudo systemctl restart xdm.service
```

想要连接VNC服务，需要客户端程序。openSUSE Leap默认的vncviewer由`tigervnc`软件包提供。

#### 使用vncviewer命令行连接
启动VNC查看器并连接服务器，执行命令：
```bash
vncviewer jupiter.example.com:1
```
除显示号之外，也可以使用两个冒号直接指定端口号：
```bash
vncviewer jupiter.example.com::5901
```
> 注意：VNC客户端填写的显示号/端口，必须和VNC服务器配置时设置的显示号/端口保持一致，详见「配置持久VNC服务器会话」小节。

#### 使用vncviewer图形界面连接
运行`vncviewer`时，不填写监听参数、也不指定主机，会弹出图形窗口，输入连接信息。在VNC服务器输入框填写主机地址，点击连接。



#### 未加密连接提示
VNC协议支持多种加密连接模式，加密不等同于密码认证。如果连接没有启用TLS加密，vncviewer窗口标题会显示文字：`(Connection not encrypted!)`。

### Remmina：远程桌面客户端
Remmina是功能丰富的现代远程桌面客户端，支持多种访问协议，例如VNC、SSH、RDP、Spice。

#### 安装
确认`remmina`软件包已经安装，如未安装，执行安装，同时需要VNC插件：
```bash
zypper in remmina remmina-plugin-vnc
```

#### 主窗口
在终端输入`remmina`启动程序。



主窗口展示已经保存的远程会话列表。你可以新增并保存会话、快速开启临时会话、启动已保存会话，或者修改Remmina全局首选项。

#### 添加远程会话
点击主窗口左上角新建按钮，打开远程桌面首选项窗口。



填写新建会话配置文件关键字段：
- **Name（名称）**：会话配置的名字，会显示在主会话列表。
- **Protocol（协议）**：选择通信协议，此处选择VNC‑VNC viewer。
- **Server（服务器）**：服务器IP或DNS地址加上显示编号。
- **User name、password（用户名、密码）**：远程认证凭据，不需要认证则留空。
- **Color depth、quality（色深、画质）**：根据网络带宽选择合适参数。

切换到【Advanced（高级）】标签页设置更多选项。
> 如果客户端‑服务器通信没有加密，需要勾选`Disable encryption（禁用加密）`，否则连接会失败。

切换【SSH Tunnel（SSH隧道）】配置SSH隧道与认证参数。
配置完成点击`Save`保存，新会话会出现在主窗口列表。

#### 启动远程会话
- **快速临时会话**：无需保存配置，在主窗口顶部下拉选择协议，输入服务器地址与显示号，回车即可连接。
- **打开已保存会话**：在会话列表双击目标条目。

远程会话会在独立窗口的标签页内打开。左侧工具栏可以切换全屏模式、适配窗口大小、发送特殊按键、截图、修改图像画质。



#### 编辑、复制、删除已保存会话
1. **编辑会话**：右键会话名称，选择Edit，修改参数后保存。
2. **复制会话**：右键选择Copy，修改会话名称与参数，保存生成新配置。
3. **删除会话**：右键选择Delete，确认Yes。

#### 在命令行运行远程会话
不需要打开Remmina图形主界面，直接从命令行启动保存的会话：
```bash
remmina -c profile_name.remmina
```
Remmina的配置文件存放在家目录路径：`.local/share/remmina/`。
可以在Remmina主界面选中会话，窗口底部状态栏查看对应配置文件完整路径。



Remmina未运行时，可以重命名配置文件，也可以复制到其他目录，通过命令行指定文件直接打开会话。

### 在VNC服务器配置一次性会话
一次性会话由远程客户端发起。服务器端弹出图形登录界面，可以选择登录用户、桌面环境（前提是显示管理器支持）。客户端断开连接后，该会话内运行的所有程序全部终止。一次性VNC会话不支持多用户共享，但是一台主机可以同时运行多个一次性会话。

#### 操作流程4.1：启用一次性VNC会话
1. 打开YaST，依次进入「网络服务 › 远程管理（VNC）」。



2. 勾选 **Allow Remote Administration Without Session Management（允许不带会话管理的远程管理）**。
3. 如果计划使用浏览器访问VNC会话，勾选 **Enable access using a web browser（启用浏览器访问）**。
4. 按需勾选 **Open Port in Firewall（防火墙打开端口）**。如果有多块网卡，点击防火墙详情，限制端口仅在指定网卡开放。
5. 点击Next确认设置。
6. 如果系统缺少相关软件包，确认安装缺失包。
7. 注销当前图形会话，重启显示管理器，使配置生效。

#### 可用配置
openSUSE Leap默认配置：会话分辨率1024×768，色深16位。普通VNC客户端监听端口`5901`（对应VNC显示号:1）；浏览器访问端口`5801`。
你可以在其他端口新增配置。一次性会话中VNC显示编号与X显示编号互相独立。VNC显示编号手动分配给服务端每一套配置；每当客户端发起连接，会自动分配空闲的X显示编号。

> 默认VNC客户端与服务器之间使用安装后自动生成的自签名SSL证书进行加密通信。首次连接时，无论vncviewer还是Web浏览器，都需要确认证书指纹。

> 提示：部分VNC客户端不接受自签名证书，例如Vinagre。这类场景可以选择非x509加密模式，或者生成正规签名证书，导入客户端系统信任库。

#### 发起一次性VNC会话
需要安装vncviewer客户端工具。或者使用支持JavaScript的浏览器访问地址：
`http://jupiter.example.com:5801`

#### 配置一次性VNC会话
不需要修改配置可以直接跳过本小节。
一次性VNC会话依靠systemd socket单元`xvnc.socket`管理。默认内置三组普通VNC配置（vnc1‑vnc3）、三组浏览器访问配置（vnchttpd1‑vnchttpd3），默认只启用vnc1、vnchttpd1。

开机启用socket单元：
```bash
sudo systemctl enable xvnc.socket
```
立即启动socket单元：
```bash
sudo systemctl start xvnc.socket
```
Xvnc服务器参数通过`server_args`选项配置，完整参数参考`Xvnc --help`。
新增自定义配置，确认端口没有被其他服务占用。修改配置后重载服务：
```bash
sudo systemctl reload xvnc.socket
```

> 通过YaST开启远程管理时，防火墙自动开放5801与5901端口。手动新增其他VNC端口，需要在防火墙中手动放行端口。参考安全加固手册的「伪装与防火墙」章节。

### 配置持久VNC服务器会话
持久会话支持多个客户端同时接入，适合演示场景：一个客户端完全控制，其他客户端仅查看。培训场景中讲师也可以使用持久会话访问学员桌面。

#### 使用vncmanager发起VNC会话
#### 操作流程4.2：启用持久VNC会话
1. YaST进入「网络服务 › 远程管理(VNC)」。
2. 勾选 **Allow Remote Administration With Session Management（允许带会话管理的远程管理）**。
3. 需要浏览器访问则勾选 **Enable access using a web browser**。
4. 按需勾选防火墙开放端口；多网卡则限定网卡。
5. Next确认，安装缺失软件包。
6. 注销会话，重启显示管理器。

配置完成，使用vncviewer或者Remmina连接远程主机。登录后桌面托盘会出现VNC图标。点击图标打开VNC会话设置窗口。如果桌面环境没有系统托盘，手动运行`vncmanager‑controller`。



VNC会话可用选项说明：
- **Non‑persistent, private（非持久、私有）**：等价一次性会话。断开连接会话直接销毁。
- **Persistent, visible（持久、可见）**：断开连接后会话继续在后台运行，其他用户可以接入该会话。
- **Session name（会话名称）**：给持久会话命名，方便重连识别。
- **No password required（无需密码）**：任何人都可以接入会话，不需要账号密码。
- **Require user login（需要用户登录）**：接入会话必须提供合法用户名密码，在`Allowed users`填写允许的账号。
- **Allow one client at a time（同一时间只允许一个客户端）**：禁止多人同时接入。
- **Allow multiple clients at a time（允许多客户端同时接入）**，适合远程演示、培训。

设置完成点击Apply，再点击OK保存。

#### 接入持久VNC会话
客户端连接服务器之后，弹出管理器界面，可以选择新建会话，或者接入已经存在的持久会话。



点击现有会话名称，根据会话安全设置，会要求输入登录凭据。

#### 在VNC服务器配置加密
VNC服务器配置正确时，服务器与客户端之间全部通信加密。认证发生在会话建立初期，之后才传输实际业务数据。

一次性会话与持久会话，都通过`/usr/bin/Xvnc`命令的`‑securitytypes`参数设置安全选项，该参数同时指定认证方式和加密方式。
可用认证类型：
- `None, TLSNone, x509None`：无认证
- `VncAuth, TLSVnc, x509Vnc`：自定义VNC密码认证
- `Plain, TLSPlain, x509Plain`：使用PAM校验系统用户密码

可用加密类型：
- `None, vncAuth, plain`：不加密
- `TLSNone, TLSVnc, TLSPlain`：匿名TLS加密。传输数据加密，但不校验服务端身份。防御被动窃听，无法防御中间人攻击。
- `X509None, x509Vnc, x509Plain`：带证书的TLS加密。使用自签名证书时，首次连接确认证书指纹，后续证书变更才告警，和SSH机制类似；使用权威CA签发证书，可以完整抵御中间人攻击，等价HTTPS安全级别。

> 提示：多个安全类型使用逗号分隔，客户端与服务端取双方都支持的第一项。这样可以配置机会型加密，兼容不支持加密的旧客户端。
> 客户端侧同样可以限定允许的安全类型，防止降级攻击；vncviewer在不安全连接时也会给出窗口标题警告。

X509加密模式，通过`‑X509Cert`与`‑X509Key`指定证书与私钥文件路径。

#### 与Wayland兼容性
远程管理VNC功能依赖X11。如果启用Wayland，会出现黑屏空画面。
显示管理器必须切换使用X11而不是Wayland。以gdm为例，编辑`/etc/gdm/custom.conf`，在`[daemon]`段添加配置：
```ini
WaylandEnable=false
```
登录系统时，同样需要选择X11兼容会话。想要GNOME完全移除Wayland选项，可以卸载并锁定`gnome‑session‑wayland`软件包。

## 第5章 专家分区器
**摘要**
复杂的系统配置需要特殊的磁盘布局。大部分分区任务可以在系统安装阶段完成。
块设备若要获得稳定持久设备命名，优先使用`/dev/disk/by‑id`或者`/dev/disk/by‑uuid`路径。

逻辑卷管理（LVM）是一种磁盘分区方案，相比传统物理分区更加灵活。它的快照功能可以便捷实现数据备份。独立磁盘冗余阵列（RAID）可以提升数据完整性、读写性能以及故障容错能力。openSUSE Leap 同时支持多路径I/O，也支持iSCSI网络磁盘。

> 磁盘容量单位说明：分区工具使用**二进制单位**，不是十进制单位。例如输入`1GB`、`1GiB`、`1G`，全部代表 1 GiB（Gibibyte），不等于十进制的 1 GB（Gigabyte）。
> - 二进制：1 GiB = 1 073 741 824 字节
> - 十进制：1 GB = 1 000 000 000 字节
> - 换算关系：1 GiB ≈ 1.07 GB

### 使用专家分区器
通过YaST专家分区器，你可以新增、删除、调整大小、编辑分区，还可以配置软件RAID与LVM逻辑卷。

> ⚠️在正在运行的系统上重新分区风险极高，极易造成数据丢失。尽量避免对已经安装好的系统执行重分区操作，操作前务必备份全部数据。

专家分区器界面会列出本机所有硬盘上已存在/空闲的分区。整块硬盘显示为不带数字的设备名，例如`/dev/sda`；分区是设备的子项，例如`/dev/sda1`。列表同时展示设备大小、分区类型、加密状态、文件系统、挂载点。挂载点代表该分区在Linux文件树中的访问位置。

左侧【系统视图】提供多种功能视图，可以查看现有存储配置、配置RAID、逻辑卷、加密文件系统，查看Btrfs、NFS、TMPFS等特殊文件系统。

如果在系统安装过程打开专家分区器，所有硬盘空闲空间会自动选中。要为openSUSE释放磁盘空间，从分区列表靠下的条目开始删除不需要的分区。

### 分区表
openSUSE Leap支持创建和使用多种分区表，分区表也被称为磁盘标签。分区表对系统引导至关重要。若要从新分区表的磁盘启动，固件必须支持该分区表格式。

修改分区表：在系统视图选中磁盘名称，点击【专家 › 创建新分区表】。

#### MBR（主引导记录）
MBR是IBM PC传统遗留分区表，也被称为MS‑DOS分区表。MBR最多支持**4个主分区**。
如果磁盘使用MBR，想要超过4个分区，需要创建一个扩展分区。扩展分区本身属于主分区，内部可以划分多个逻辑分区。
UEFI固件可以在传统兼容模式下从MBR磁盘引导。

#### GPT（GUID分区表）
UEFI计算机默认使用GPT分区表。磁盘没有任何分区表时，openSUSE Leap会自动新建GPT分区表。
老式BIOS固件**不支持从GPT磁盘启动**。

GPT适用场景：
- 需要4个以上主分区
- UEFI安全启动
- 容量大于2 TB的磁盘

> Parted 3.1及更早版本创建的GPT分区，会使用微软基本数据分区类型标识，并设置`msftdata`标志，很多磁盘工具会将其识别为Windows数据分区。清除该标志执行：
```bash
parted DEVICE set PARTITION_NUMBER msftdata off
```

### 分区
YaST分区器可以创建、格式化多种文件系统。openSUSE Leap默认文件系统为Btrfs。其他常用文件系统：Ext2、Ext3、Ext4、FAT、XFS、Swap、UDF。

#### 创建分区
1. 选择【硬盘】，选中一块拥有空闲空间的磁盘。
2. 点击【添加】新建分区。MBR磁盘需要选择主分区或者扩展分区；扩展分区内部再创建逻辑分区。
3. 设置分区大小，可以占用全部未分配空间，也可以手动输入自定义容量。
4. 选择文件系统类型与挂载点。YaST会自动推荐挂载点。
5. 需要持久设备命名等高级选项，打开【Fstab选项】进行配置。
6. 设置其他文件系统参数，完成后点击【完成】应用配置。
> 如果处于系统安装流程，会返回安装概览界面。

#### Btrfs分区
根分区默认使用Btrfs文件系统。更多Btrfs信息，参见**第3章 使用Snapper进行系统恢复与快照管理**。根文件系统本身就是默认子卷，不会在子卷列表单独显示，可以像普通文件系统一样挂载。

###### 加密根分区下的Btrfs
默认分区方案建议根分区使用Btrfs，`/boot`作为普通目录。
如果要对根分区加密，必须使用GPT分区表，不能使用MS‑DOS(MBR)，否则GRUB2引导程序没有足够空间存放第二阶段引导代码。

Btrfs子卷说明（安装程序自动创建）：
- `/boot/grub2/i386‑pc`，`/boot/grub2/x86_64‑efi`，`/boot/grub2/powerpc‑ieee1275`，`/boot/grub2/s390x‑emu`
> 引导加载程序配置不支持回滚。目录和CPU架构绑定，AMD64/Intel64使用前两个，IBM POWER、IBM Z使用后两个。

- `/home`
> 如果不在独立分区，设置为独立子卷，避免系统回滚操作删除用户数据。

- `/opt`
> 存放第三方软件，排除在快照之外，防止回滚卸载第三方应用。

- `/srv`
> Web、FTP服务数据目录，排除快照，防止业务数据丢失。

- `/tmp`
> 临时文件目录，排除快照。

- `/usr/local`
> 手动编译安装软件目录，排除快照，防止回滚删除手动部署程序。

- `/var`
> 存放日志、缓存、`/var/opt`第三方数据、虚拟机镜像、数据库。创建独立子卷，并且**关闭写时复制（Copy‑On‑Write）**。

> Btrfs分区容量建议：开启快照功能，根分区最小16 GB；openSUSE官方建议至少32 GB。如果`/home`不在独立分区，建议分配更大空间。

#### 使用YaST管理Btrfs子卷
可以在专家分区器中新增、删除Btrfs子卷。

###### 操作流程：使用YaST创建Btrfs子卷
1. 在左侧面板选中Btrfs。
2. 选中需要操作的Btrfs分区。
3. 根据需求选择编辑、添加子卷、删除子卷：
    - **编辑子卷**：选中子卷，点击【编辑】，可以开启/关闭`noCoW`（关闭写时复制），限制子卷大小。点击【接受】保存。
    - **添加子卷**：点击【添加子卷】，输入子卷路径，按需开启`noCoW`、设置大小限制，点击【接受】。
    - **删除子卷**：选中目标子卷，点击【删除】，确认Yes。

### 编辑分区
选中分区后点击【编辑】，可以修改文件系统、挂载点、fstab参数、标签等配置。

### 专家选项
专家选项页面可以设置：分区ID、标志位、调整文件系统参数。

### 高级选项
配置加密、LVM、软件RAID，下面小节详细说明。

### 更多分区小提示
1. 系统关键分区建议独立分开：`/boot`、`swap`；数据库、虚拟机镜像建议放到关闭CoW的Btrfs子卷。
2. 加密磁盘优先使用GPT分区表。
3. 生产环境尽量避免在运行中的系统调整分区大小。

### 分区与LVM
LVM（逻辑卷管理）把底层物理磁盘抽象为存储池。物理磁盘先创建**物理卷(PV)**；多个物理卷组成**卷组(VG)**；卷组内划分多个**逻辑卷(LV)**，逻辑卷作为系统使用的块设备。逻辑卷可以动态扩容、缩容，支持精简配置与快照。

#### 创建物理卷
将磁盘或分区初始化为LVM物理卷。可以整块磁盘作为PV，也可以单个分区作为PV。

#### 创建卷组
把一个或多个物理卷加入同一个卷组，卷组整合所有磁盘空间形成统一存储池。设置物理扩展块大小，一般使用默认值即可。

#### 配置逻辑卷
在卷组中创建逻辑卷，指定大小、文件系统、挂载点。逻辑卷后续可以扩容；部分文件系统支持缩容。
> 注意：精简配置LVM才支持Snapper快照；普通LVM不支持Snapper。

### 软件RAID
软件RAID由内核md模块实现，不需要RAID硬件卡。可以组合多块磁盘实现冗余、性能提升。

#### 软件RAID配置
1. 在专家分区器左侧选择【RAID】。
2. 创建RAID设备，选择RAID级别（RAID0、RAID1、RAID5、RAID6、RAID10）。
3. 选择加入RAID的磁盘/分区。
4. 设置文件系统、挂载点。
> RAID0没有冗余，一块磁盘损坏全部数据丢失；RAID1镜像适合系统盘；RAID5/6适合大容量存储。

#### 故障排查
- RAID降级：磁盘故障，RAID进入降级模式，需要更换磁盘，重新同步重建阵列。
- 不要混用不同品牌、不同容量磁盘；RAID阵列所有磁盘容量尽量保持一致。
- 监控`/proc/mdstat`查看软件RAID状态。

### 更多信息
- `man yast2‑partitioner`：专家分区器手册
- `man lvm`：LVM文档
- `man mdadm`：软件RAID管理工具
- Btrfs官方文档，Snapper文档（见第3章）

## 第6章 安装多个内核版本
**摘要**
openSUSE Leap 支持在系统上同时安装多个内核版本。该功能可以用来在更新内核之后保留旧内核，当新内核出现问题时，可以在GRUB引导菜单选择旧内核作为回退备选。本章介绍如何启用多版本内核支持、配置内核保留策略，以及使用YaST和Zypper安装、删除内核。还会说明如何从`Kernel:HEAD`软件源安装最新内核。

### 启用和配置多版本支持
openSUSE Leap默认只会保留**两个内核版本**：当前正在使用的内核，以及上一个旧内核。系统软件包更新脚本会自动删除更老的内核。你可以修改配置，调整系统保留内核的数量，改变内核自动清理行为。

多内核版本功能配置文件：`/etc/zypp/zypp.conf`。相关配置项：
- `multiversion.kernels`：控制保留哪些内核版本。

> ⚠️注意：修改此配置文件前务必备份原文件。错误配置会导致内核被误删除，造成系统无法启动。

`multiversion.kernels`支持以下取值模式：
1. `latest`：仅保留最新安装的内核。
2. `latest‑n`：保留最新的n个内核。例如`latest‑2`，保存最新2个内核。
3. `running`：保留当前正在运行的内核。
4. `all`：保留**全部已安装内核**，不会自动删除任何旧内核。
5. 完整内核版本字符串：可以指定固定版本，强制永久保留该版本内核，例如`5.14.21‑150400.24.66‑default`。

多条规则使用逗号`,`分隔。

#### 用例1：重启之后才删除旧内核
> 需求：内核升级完成后，**不立刻删除旧内核**；系统重启、确认新内核可以正常工作之后，再清理旧内核。

配置示例（`zypp.conf`）：
```ini
multiversion.kernels = latest,latest-1,running
```
规则解释：
- `latest`：保留最新版本内核；
- `latest‑1`：保留上一个版本内核；
- `running`：保留当前正在运行的内核。

效果：升级内核后，旧内核会暂时保留。重启系统，如果新内核运行正常，下次软件包操作时，会删除不在规则列表中的老旧内核。

#### 用例2：将旧内核作为回退备选进行保留
> 需求：希望系统保留更多旧内核，用于故障回退。

示例，保留最新3个内核，同时保留当前正在运行内核：
```ini
multiversion.kernels = latest,latest-2,running
```

#### 用例3：保留指定的特定内核版本
> 需求：强制保留某一个特定内核版本，无论其他清理规则，永远不会被自动移除。

```ini
multiversion.kernels = latest,latest-1,running,5.14.21‑150400.24.66‑default
```
> 注意：填写完整准确的内核版本字符串，版本号错误将不会生效。可以用`zypper se -i kernel‑default`查看本机已安装内核版本。

### 使用YaST安装/删除多个内核版本
1. 启动YaST，打开【软件管理】模块。
2. 在搜索框输入`kernel‑default`（或者`kernel‑preempt`、`kernel‑rt`等内核变体）。
3. 在结果列表中，可以看到软件源中全部可用的内核版本。
4. 勾选想要安装的多个内核版本；取消勾选需要卸载的旧内核。
5. 点击【接受】，确认依赖解析，完成变更。

> 提示：YaST软件管理界面不会自动删除旧内核，删除行为完全由`/etc/zypp/zypp.conf`的`multiversion.kernels`规则控制。

### 使用Zypper安装/删除多个内核版本
#### 安装指定版本内核
```bash
# 安装最新默认内核
sudo zypper in kernel-default

# 安装指定完整版本内核
sudo zypper in kernel-default=5.14.21‑150400.24.66
```

> ⚠️重要：如果`multiversion.kernels`设置为只保留`latest`，安装新内核的瞬间，所有其他旧内核会被立刻删除。想要同时保存多个内核，必须提前修改`zypp.conf`配置。

#### 手动删除内核
Zypper不会自动删除配置规则之外的内核时，可以手动移除不需要的内核包：
```bash
sudo zypper rm kernel-default‑5.14.21‑150400.24.50
```
> ⚠️千万不要删除当前正在运行的内核。查看正在运行内核版本命令：
```bash
uname -r
```

### 从Kernel:HEAD软件源安装最新内核版本
`Kernel:HEAD`项目是openSUSE的实验性内核软件仓库，提供尚未正式发布的最新上游内核。
> ⚠️警告：该源中的内核属于测试版本，稳定性没有保障，**不建议生产环境使用**，可能会出现硬件兼容、系统崩溃问题。

1. 添加Kernel:HEAD软件仓库
```bash
sudo zypper ar https://download.opensuse.org/repositories/Kernel:/HEAD/standard/ openSUSE_Kernel_HEAD
```
2. 导入仓库GPG密钥：
```bash
sudo zypper ref
```
3. 安装该源的内核：
```bash
sudo zypper in kernel-default‑‑repo openSUSE_Kernel_HEAD
```

> 补充：Kernel:HEAD仓库更新非常频繁。如果不再使用，建议移除该软件源，防止意外升级到测试内核。
```bash
sudo zypper rr openSUSE_Kernel_HEAD
```

## 第7章 图形用户界面
**摘要**
本章介绍X Window系统，讲解字体的安装、查看与配置；提供面向管理员的GNOME系统级配置；同时说明如何使用SUSE Prime在Intel集成显卡与NVIDIA独立显卡之间切换Optimus双显卡。

### 7.1 X Window System（X窗口系统）
X Window System（常简称为X11）是Linux平台的底层图形框架，负责图形输出、鼠标键盘输入事件处理。桌面环境（GNOME、KDE Plasma）运行在X11之上。现代系统同时提供Wayland作为替代显示服务器。

> 注意：部分旧应用、驱动、管理工具仅支持X11会话。部分硬件功能在Wayland会话下会受到限制。登录界面可以选择使用X11会话还是Wayland会话。

### 7.2 安装与配置字体
#### 7.2.1 显示已安装字体
使用`fc‑list`命令列出系统全部已注册字体：
```bash
fc-list
```
过滤只查看某一类字体，例如只显示中文字体：
```bash
fc-list :lang=zh
```

#### 7.2.2 查看字体
图形工具`font‑viewer`可以打开字体文件（`.ttf`、`.otf`）预览字形样式。
```bash
font-viewer /usr/share/fonts/truetype/DejaVuSans.ttf
```

#### 7.2.3 查询字体
`fc‑match`命令查询字体配置，查看系统实际选用的字体。例如查询sans‑serif无衬线字体：
```bash
fc-match sans-serif
```

#### 7.2.4 安装字体
字体分为**系统全局字体**与**用户个人字体**。
1. **系统全局字体（所有用户可用，需要root权限）**
将字体文件复制到 `/usr/share/fonts/` 下新建子目录，例如`/usr/share/fonts/myfonts`。
复制完成之后刷新字体缓存：
```bash
fc-cache -fv
```

2. **单用户字体（仅当前登录用户生效，无需root）**
把字体放到家目录路径 `~/.local/share/fonts/`，执行缓存刷新：
```bash
fc-cache -fv ~/.local/share/fonts/
```

> 提示：字体文件权限建议设置为644，目录权限755。权限错误会导致字体无法被识别。

#### 7.2.5 配置字体显示效果
字体配置文件为 `/etc/fonts/fonts.conf`，该文件由软件包管理维护，**不要直接编辑**。
自定义字体规则请放到 `/etc/fonts/local.conf`。常见配置用途：设置字体替换、调整抗锯齿、微调Hinting字体微调渲染参数。

> 说明：`local.conf`修改完成后，执行`fc-cache -fv`使配置生效。

### 7.3 面向管理员的GNOME配置
#### 7.3.1 dconf系统
GNOME桌面使用dconf作为后端配置存储系统，存储桌面的各项设置：面板、主题、快捷键、电源管理、文件管理器行为等。
- 用户个人配置：保存在用户家目录数据库，`~/.config/dconf/user`
- 系统预设、强制全局配置：放在 `/etc/dconf/` 目录。

> gsettings是dconf的前端命令行工具，普通用户日常修改桌面设置优先使用gsettings。

查看可用配置项：
```bash
gsettings list-schemas
gsettings list-keys org.gnome.desktop.interface
```
读取某一项配置值：
```bash
gsettings get org.gnome.desktop.interface gtk-theme
```
设置配置项：
```bash
gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita‑dark'
```

#### 7.3.2 系统级配置
管理员可以推送全局默认配置，作用于所有新用户，分为两种模式：
1. **defaults（默认值）**：用户登录会继承该值，但用户可以在图形界面手动修改覆盖。
配置路径：`/etc/dconf/db/local.d/`，编写INI格式配置片段。
执行更新生效：`dconf update`

2. **locks（锁定配置）**：强制锁定配置项，普通用户图形界面无法修改该设置。
配置路径：`/etc/dconf/db/local.d/locks/`，填写需要锁定的dconf键名。

> 重要：全局dconf配置不会改变已经存在的老用户设置，**只对新建用户生效**。已有用户需要手动重置对应配置。

示例，新建 `/etc/dconf/db/local.d/00‑my‑desktop`
```ini
[org/gnome/desktop/interface]
gtk‑theme='Adwaita‑dark'
icon‑theme='Adwaita'
```
运行命令使全局配置生效：
```bash
sudo dconf update
```

#### 7.3.3 更多信息
- `man dconf`、`man gsettings` 查看手册
- GNOME官方管理员文档

### 7.4 使用SUSE Prime在Intel与NVIDIA Optimus显卡之间切换
#### 7.4.1 前置条件
SUSE Prime用于Optimus双显卡笔记本：主板自带Intel核显 + NVIDIA独立显卡。
> 硬件前提：笔记本支持Optimus技术。BIOS内不要屏蔽集成Intel显卡。
软件前提：必须安装openSUSE官方提供的NVIDIA驱动包。

#### 7.4.2 安装并使用SUSE Prime
1. 安装`suse‑prime`软件包：
```bash
sudo zypper in suse-prime
```
2. 查看当前正在使用的显卡模式：
```bash
prime-select query
```
输出可选模式：`intel`、`nvidia`。

3. 切换显卡模式
- 切换到Intel集成显卡（省电模式）
```bash
sudo prime-select intel
```
- 切换到NVIDIA独立显卡（高性能模式）
```bash
sudo prime-select nvidia
```
> ⚠️切换显卡之后**必须重启系统，更改才会生效**。

#### 7.4.3 安装NVIDIA驱动
> 注意：不要使用NVIDIA官网.run格式驱动包，优先使用openSUSE软件源的RPM包。
1. 添加NVIDIA官方软件仓库；
2. 安装对应的驱动软件包；
3. 运行`prime‑select`选择显卡；
4. 重启系统。

> 故障提示：
> - Wayland会话对NVIDIA支持有限；切换到NVIDIA显卡时系统会自动使用X11会话。
> - 如果图形界面无法启动，切换到文本控制台，执行`prime‑select intel`切回核显排查。

## 第8章 64位系统环境中的32‑位应用程序
**摘要**
本章介绍在64‑位openSUSE系统中运行32‑位应用程序的相关知识，包含运行时支持与内核规格说明。

### 8.1 运行时支持
64位的openSUSE Leap系统默认支持执行32位二进制程序。要运行32位程序，不仅需要程序本体，还必须安装对应的32位版本共享库。

> 说明：64位系统的软件包架构标记为`x86_64`；对应的32位软件包架构标记为`i586`。

部分基础32位库不会默认安装。当你启动一个缺少依赖库的32位程序时，会报类似`error while loading shared libraries: libxxx.so: cannot open shared object file: No such file or directory`的错误。

#### 安装32位库依赖
- 方式1：如果你清楚缺失的库名称，可以直接安装该库的i586版本。
示例，安装32位libcurl库：
```bash
sudo zypper in libcurl4-32bit
```
openSUSE中，多数32位库软件包命名规则：库包名后追加后缀`‑32bit`。

- 方式2：安装完整的基础32位运行环境元包，一次性安装大量常用32位基础库：
```bash
sudo zypper in patterns‑openSUSE‑32bit
```
> `patterns‑openSUSE‑32bit`是模式元包，会拉入一整套基础32位运行库，适合需要频繁运行各类32位软件的场景。

> ⚠️注意：
> 1. 32位和64位软件包可以共存，但是**可执行程序文件不能同名共存**。同一个程序不能同时安装i586与x86_64两个版本。
> 2. 源代码编译安装的第三方32位程序，包管理器无法解析它的依赖，需要手动排查缺失库。

### 8.2 内核规格
openSUSE Leap的64位内核默认开启对32位用户空间系统调用的支持，该特性名称为`CONFIG_COMPAT`。该内核配置项提供兼容层，允许内核接收、处理来自32位用户态进程的系统调用。

> 该内核选项默认开启，普通用户不需要修改。
> - 如果编译定制内核，必须启用`CONFIG_COMPAT`，否则系统完全无法运行任何32位应用程序。
> - ARM64/aarch64架构系统，对应的兼容配置是`CONFIG_COMPAT`，用于运行ARM32程序；本章节针对x86‑64平台。

查看当前内核是否启用32位兼容支持：
```bash
zcat /proc/config.gz | grep CONFIG_COMPAT
```
输出`CONFIG_COMPAT=y`代表已启用兼容层。

#### 限制说明
1. 32位进程依然受32位地址空间限制，单进程最大可用内存约4GB，即便运行在64位内核上也无法突破该限制。
2. 内核本身是纯64位，内核内存全部使用64位寻址，不受32位限制。
3. 部分内核特性、高级系统接口，32位用户态程序无法使用。

## 第9章 引导流程简介
**摘要**
本章介绍Linux系统开机引导过程中使用的专业术语，并完整描述Linux引导的各个阶段：初始化与引导加载程序阶段、内核阶段、initramfs中的初始化阶段，以及systemd阶段。

### 9.1 术语
- **固件（Firmware）**：主板内置软件。BIOS或者UEFI，计算机上电后最先执行的程序。固件负责初始化基础硬件，读取磁盘，找到并启动引导加载程序。
- **引导加载程序（Boot loader）**：磁盘上的程序，由固件启动。openSUSE Leap使用GRUB 2作为引导加载程序。引导加载程序负责加载Linux内核到内存，并向内核传递启动参数。
- **内核（Kernel）**：Linux操作系统核心。完成硬件初始化，挂载根文件系统，启动用户空间第一个进程。
- **initramfs**：初始RAM文件系统，压缩的小型文件系统镜像，内核启动早期挂载到内存。它包含必要内核模块与工具，用来完成真正根文件系统的挂载。
- **systemd**：Linux用户空间的第一个进程（PID 1），负责启动和管理全部系统服务、挂载点、目标单元。

### 9.2 Linux引导流程
Linux引导流程分为四个依次执行的阶段：
1. 初始化与引导加载程序阶段
2. 内核阶段
3. initramfs内初始化阶段
4. systemd阶段

#### 9.2.1 初始化和引导加载程序阶段
1. 计算机上电，固件（BIOS或UEFI）执行硬件自检。
2. 固件根据启动设置，读取磁盘，启动GRUB 2引导加载程序。
3. GRUB 2执行：显示引导菜单（如果配置开启）；加载Linux内核镜像与initramfs镜像到内存；把预先配置好的内核命令行参数传递给内核；把CPU控制权交给内核。

> BIOS与UEFI行为差异：
> - BIOS：读取磁盘MBR主引导记录，执行其中的引导代码。
> - UEFI：读取ESP EFI系统分区，运行`.efi`格式的GRUB2可执行文件。

#### 9.2.2 内核阶段
内核获得CPU控制权，完成以下工作：
1. 初始化CPU、内存以及基础硬件。
2. 解压并挂载initramfs镜像到内存，作为临时根文件系统。
3. 在initramfs环境中执行`/init`，将流程交给initramfs初始化脚本。

> 在这个阶段，真正磁盘上的根文件系统**尚未挂载**。所有磁盘驱动、加密磁盘解密工具都存放在initramfs中。

#### 9.2.3 initramfs上的init阶段
initramfs的`/init`脚本执行，完成挂载真实根文件系统前的准备工作：
1. 解析内核命令行参数，读取根分区位置、加密参数、LVM参数等引导选项。
2. 加载存储相关内核模块：磁盘控制器、文件系统驱动；如果使用LUKS加密，执行解密；处理LVM逻辑卷。
3. 找到并挂载磁盘上**真正的根文件系统**。
4. 执行切换根（switch_root）操作：丢弃内存中的initramfs临时文件系统，将根切换到磁盘上的真实根文件系统。
5. 启动真实根文件系统上的`/usr/lib/systemd/systemd`，systemd成为PID 1进程。

> 重要：initramfs只负责挂载根文件系统。网络、日志、其他服务不会在此阶段启动。

#### 9.2.4 systemd阶段
systemd作为用户空间第一个进程，接管系统初始化：
1. 读取单元配置，处理挂载点（`/etc/fstab`），挂载其他文件系统。
2. 启动基础系统服务：日志服务journald、udev设备管理。
3. 按照target目标单元的依赖关系，依次启动系统网络、系统守护进程。
4. 完成目标启动，启动显示管理器（如gdm）或者文本控制台，供用户登录。

> 故障排查提示：
> - 内核报错、磁盘找不到：问题大多发生在**initramfs阶段**，检查内核启动参数、initramfs镜像完整性、磁盘驱动。
> - 系统能挂载根分区，但服务启动失败：问题大多发生在**systemd阶段**，使用`journalctl`查看日志。

## 第10章 systemd守护进程
**摘要**
`systemd`是openSUSE Leap采用的系统与服务管理器。它既是PID 1的初始化进程，同时还管理系统服务、挂载点、设备、套接字、定时器等系统资源。本章讲解systemd的核心概念、单元文件、基础操作、system‑V兼容模式、自定义配置、高级用法以及systemd定时器单元。

### 10.1 systemd概念
#### 单元文件（Unit file）
systemd使用**单元文件**描述系统资源。单元是systemd管理的对象，分为多种类型：
- `.service`：系统服务，守护进程应用程序
- `.mount`：文件系统挂载点
- `.socket`：进程间通信套接字（本地套接字或网络套接字），支持套接字激活
- `.target`：一组单元的集合，用于分组管理系统启动状态，替代传统runlevel运行级别
- `.device`：内核设备，由udev管理
- `.swap`：swap交换分区/交换文件
- `.path`：文件系统路径监控，当文件/目录状态变化时触发其他单元
- `.timer`：定时器单元，用于定时触发服务单元，替代cron部分使用场景

每个单元文件由多个配置段组成，例如`[Unit]`、`[Service]`、`[Install]`。

#### 基础用法
###### 在运行的系统中管理服务
`systemctl`是systemd的主管理命令。

查看服务状态：
```bash
systemctl status <服务名>.service
```
示例：
```bash
systemctl status sshd.service
```

- `active (running)`：服务正在正常运行
- `active (exited)`：一次性执行完成的服务，执行完毕已退出
- `inactive (dead)`：服务未运行
- `failed`：服务启动失败

启动、停止、重启、重新加载配置：
```bash
systemctl start <单元>
systemctl stop <单元>
systemctl restart <单元>
systemctl reload <单元>
```
> `reload`：不停止进程，让程序重新读取配置文件；不是所有服务都支持reload。

查看全部已加载单元状态：
```bash
systemctl list-units
```

只查看服务类型单元：
```bash
systemctl list-units --type=service
```

###### 永久启用 / 禁用服务
`enable`：设置开机自启，写入`[Install]`段定义的符号链接，**不会立刻启动服务**。
```bash
systemctl enable <单元>
```

`disable`：取消开机自启，删除对应符号链接，**不会停止当前正在运行的服务**。
```bash
systemctl disable <单元>
```

同时设置开机启动并且立刻启动服务：
```bash
systemctl enable --now <单元>
```

屏蔽单元`mask`：完全禁止单元启动，建立指向`/dev/null`的链接，无论手动或者开机都无法启动。
```bash
systemctl mask <单元>
```

解除屏蔽`unmask`：
```bash
systemctl unmask <单元>
```

#### 系统启动与目标管理
###### Target对比传统运行级别
传统SysVinit使用0‑6数字运行级别；systemd使用`*.target`单元实现等价功能。

| SysV运行级别 | systemd target | 说明 |
|---|---|---|
| 0 | `poweroff.target` | 关机 |
| 1 / S | `rescue.target` | 单用户救援模式 |
| 3 | `multi‑user.target` | 多用户文本控制台，无图形界面 |
| 5 | `graphical.target` | 图形登录多用户模式 |
| 6 | `reboot.target` | 重启 |

查看当前默认启动目标：
```bash
systemctl get-default
```

修改默认启动目标：
```bash
systemctl set-default multi-user.target
```

切换运行时目标（不修改开机默认）：
```bash
systemctl isolate multi-user.target
```

###### 调试系统启动流程
查看全部单元启动耗时，定位启动慢的组件：
```bash
systemd-analyze blame
```

输出系统整体启动时间统计：
```bash
systemd-analyze
```

生成图形SVG启动分析图：
```bash
systemd-analyze plot > boot.svg
```

#### System V 兼容性
systemd提供兼容层，可以运行传统SysV init脚本（`/etc/init.d/`下脚本）。
> 注意：优先使用原生`.service`单元；只有没有对应systemd单元时，systemd才会调用SysV脚本。

#### 使用YaST管理服务
YaST → 系统 → 服务管理器。图形界面可以完成启动、停止、启用、禁用服务，等价于systemctl命令。

### 10.2 自定义systemd
#### 单元文件存放位置
systemd会按优先级顺序读取单元文件，后加载的配置会覆盖前面：
1. `/usr/lib/systemd/system/`：软件包自带单元文件，软件升级会覆盖，**禁止直接编辑**。
2. `/etc/systemd/system/`：管理员自定义单元，优先级最高，软件包更新不会修改。
3. `/run/systemd/system/`：运行时动态生成单元，临时生效，重启全部丢失。

> ⚠️永远不要直接修改`/usr/lib/systemd/system/`下原始单元文件。包升级会覆盖你的修改。

#### 使用drop‑in（片段覆盖文件）
drop‑in是单元配置片段，用于**扩展/覆盖原有单元的部分配置**，不需要复制完整service文件。
针对`sshd.service`创建drop‑in目录：
```bash
mkdir -p /etc/systemd/system/sshd.service.d/
```
在该目录新建配置文件，例如`override.conf`，写入需要覆盖的配置段。
示例 `override.conf`：
```ini
[Service]
Environment="DEBUG=1"
```

修改完成后，必须重载systemd配置，识别新增/修改的单元与drop‑in：
```bash
systemctl daemon-reload
```

> 提示：`systemctl edit sshd.service`命令可以自动创建drop‑in文件，不需要手动建目录。

#### 手动创建drop‑in文件
1. 创建`单元名.d`目录；
2. 创建`xxx.conf`配置片段；
3. 写入需要修改的配置项；
4. `systemctl daemon‑reload`重载配置。

#### 将xinetd服务转换为systemd套接字单元
传统xinetd是超级服务，监听端口，收到连接后启动服务进程。
systemd使用`.socket` + `.service`单元实现套接字激活，替代xinetd。
- `.socket`单元负责监听网络/本地套接字；
- 有连接进来时，systemd启动对应的`.service`服务进程，把套接字文件描述符传递给进程。

#### 创建自定义target
可以新建自定义`.target`单元，把一组相关服务聚合到一起。
示例`/etc/systemd/system/mycustom.target`
```ini
[Unit]
Description=My custom target
Requires=multi-user.target
After=multi-user.target
```
之后在各个服务单元的`[Install]`中设置`WantedBy=mycustom.target`，启用服务就会加入该target。

### 10.3 高级用法
#### 清理临时目录
systemd‑tmpfiles工具管理临时目录（如`/tmp`）的清理、目录权限创建。
配置文件位置：
- `/usr/lib/tmpfiles.d/*.conf`：软件自带
- `/etc/tmpfiles.d/*.conf`：管理员自定义配置，优先级更高

手动执行临时目录清理：
```bash
systemd-tmpfiles --clean
```

#### 系统日志
systemd自带journald日志系统，详见**章 journalctl：查询systemd日志**。

#### 快照
systemd支持对服务做快照，保存进程状态。快照功能多用于调试。
```bash
systemctl snapshot myservice
```

#### 加载内核模块
可以通过`.module`单元，或者在`/etc/modules‑load.d/`目录放置配置文件，开机自动加载内核模块。
示例 `/etc/modules-load.d/my‑modules.conf`
```
nfs
vboxdrv
```

#### 在服务启动前执行动作
使用`ExecStartPre=`在服务主程序启动前执行额外命令；`ExecStartPost=`在主程序启动成功后执行。
```ini
[Service]
ExecStartPre=/usr/bin/echo "准备启动服务"
ExecStart=/usr/sbin/sshd -D
```

#### 内核控制组 cgroups
cgroups用来限制一组进程的CPU、内存、IO资源。systemd每个service单元默认拥有独立cgroup。
可以在service单元中配置CPUWeight、MemoryMax等参数限制资源占用。
查看cgroup资源：
```bash
systemd-cgtop
```

#### 终止服务（发送信号）
`systemctl kill`向服务的全部进程发送信号。
```bash
# 发送SIGTERM正常终止
systemctl kill sshd.service
# 发送SIGKILL强制杀死
systemctl kill -s SIGKILL sshd.service
```

> 区分：`systemctl stop`会执行单元定义的停止逻辑；`systemctl kill`直接发送信号。

#### D‑Bus服务重要说明
很多systemd服务依赖D‑Bus总线。修改D‑Bus相关单元后，除`daemon‑reload`，部分场景需要重启dbus服务。

#### 调试服务
查看服务全部完整单元配置（包含所有drop‑in合并后的最终生效配置）：
```bash
systemctl cat sshd.service
```

查看服务失败原因，配合journalctl查看日志：
```bash
journalctl -u sshd.service
```

### 10.4 systemd定时器单元
#### systemd定时器类型
定时器（`.timer`）单元，用来定时触发对应的`.service`服务单元，替代cron。
定时器分为两类：
1. **实时日历定时器（Calendar timer）**：类似crontab，按具体时间点触发（年月日时分）。
2. **单调定时器（Monotonic timer）**：系统启动之后经过指定时长触发，例如开机后2小时执行一次；重启系统计时器重置。

#### systemd定时器与服务单元关系
每个`.timer`单元必须对应一个同名`.service`单元。例如`backup.timer`触发`backup.service`。
timer单元负责时间调度；service单元存放要执行的任务脚本/程序。

#### 实操示例
创建`/etc/systemd/system/backup.service`
```ini
[Unit]
Description=Data backup service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/my‑backup‑script.sh
```

创建定时器单元`/etc/systemd/system/backup.timer`
```ini
[Unit]
Description=Run backup every day at 01:00

[Timer]
# 每天凌晨1点触发
OnCalendar=*-*-* 01:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

> `Persistent=true`：如果系统关机错过了触发时间，开机之后立刻补执行一次任务。

启用定时器（**只需要enable .timer单元，不需要enable .service**）：
```bash
systemctl daemon-reload
systemctl enable --now backup.timer
```

查看定时器状态：
```bash
systemctl list-timers
```

#### 管理systemd定时器
- `systemctl start xxx.timer`：启动定时器
- `systemctl enable xxx.timer`：开机启用定时器
- `systemctl list‑timers`：列出所有定时器，显示下一次触发时间
- 查看定时器单元内容：`systemctl cat xxx.timer`
- 查看定时器任务执行日志：`journalctl -u xxx.service`

### 10.5 更多信息
- `man systemd`、`man systemctl`、`man systemd.service`、`man systemd.timer`
- `/usr/share/doc/packages/systemd` 软件包文档

## 第11章 journalctl：查询 systemd 日志
**摘要**
`journalctl` 是用来读取由 `journald` 服务收集的系统日志的工具。journald 是 systemd 内置的日志守护进程。本章介绍如何将日志持久化存储、journalctl 的常用参数、各类日志过滤方式、排查 systemd 报错，以及 journald 的配置。同时还会介绍 YaST 和 GNOME 中查看日志的方式。

### 11.1 使日志持久保存
默认情况下，openSUSE Leap 的 journald 日志保存在 `/run/log/journal`，该目录位于临时内存文件系统（tmpfs）。**系统重启之后所有日志就会全部丢失**。

如果需要跨重启保留系统日志，开启持久存储模式：
1. 编辑配置文件 `/etc/systemd/journald.conf`
2. 修改 `Storage=` 参数：
```ini
Storage=persistent
```
设置为 `persistent` 后，journald 会在 `/var/log/journal` 目录存放日志数据。即便目录尚不存在，服务会自动创建该目录。

其他可选 Storage 值：
- `volatile`：仅存放在内存 `/run/log/journal`，重启丢失（默认）
- `auto`：如果 `/var/log/journal` 目录存在就持久保存，否则使用内存存储
- `none`：完全丢弃所有日志输出

修改配置后，重启 journald 服务使更改生效：
```bash
sudo systemctl restart systemd-journald
```

> 注意：切换为持久模式之后，**之前内存中的历史日志会丢失**，新日志才会写入磁盘。

### 11.2 journalctl：实用参数
直接不带参数运行 `journalctl`，会按时间顺序输出全部日志，最旧的日志显示在最上方。
```bash
journalctl
```

常用基础参数：
- `-f`：实时跟踪日志输出，新日志到来立刻打印，类似 `tail -f`
```bash
journalctl -f
```
- `-e`：直接跳到日志文件末尾，从最新日志开始查看
```bash
journalctl -e
```
- `-r`：反向输出，最新日志放在最开头
```bash
journalctl -r
```
- `-b`：显示本次开机以来产生的全部日志
```bash
journalctl -b
```
- `-b -1`：显示**上一次开机**的完整日志（只有开启持久存储才可用）
```bash
journalctl -b -1
```
- `--no-pager`：不使用分页器，一次性完整输出，适合脚本捕获输出
```bash
journalctl --no-pager
```

### 11.3 过滤日志输出
可以基于启动序号、时间范围、日志字段对日志做过滤筛选。

#### 11.3.1 根据启动序号过滤
每一次系统开机都会分配一个启动 ID。
查看全部可用的开机记录：
```bash
journalctl --list-boots
```
输出示例：
```
-1  f587a…  2025‑11‑05 08:10:03  Wed 2025‑11‑05 18:20:45
 0  28bc4…  2025‑11‑06 09:05:11  Wed 2025‑11‑06 17:42:12
```
数字 `0` 代表当前本次启动；`‑1` 代表上一次启动。

查看某次开机全部日志：
```bash
journalctl -b 0
journalctl -b -1
```
也可以直接使用完整启动ID：
```bash
journalctl -b f587axxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 11.3.2 根据时间区间过滤
使用 `--since`（起始时间）、`--until`（结束时间）限定时间范围。

查看今天0点至今的日志：
```bash
journalctl --since today
```

限定具体时刻：
```bash
journalctl --since "2025‑11‑06 10:00:00" --until "2025‑11‑06 12:00:00"
```

支持相对时间，例如过去一小时：
```bash
journalctl --since "1 hour ago"
```

#### 11.3.3 根据字段过滤日志
journald 的每一条日志都附带结构化字段，可以按字段筛选日志。

查看指定 systemd 单元（服务）的日志，最常用：
```bash
journalctl -u sshd.service
```

查看某个进程PID产生的日志：
```bash
journalctl _PID=1234
```

查看指定用户ID输出的日志：
```bash
journalctl _UID=1000
```

查看可执行程序对应的全部日志：
```bash
journalctl /usr/sbin/sshd
```

按日志优先级过滤：优先级 emerg、alert、crit、err、warning、notice、info、debug。
只输出错误及更高级别的日志：
```bash
journalctl -p err..emerg
```

可以把多个过滤条件组合，条件之间为“与”逻辑。
示例：查看本次开机 sshd 服务的错误日志
```bash
journalctl -b -u sshd.service -p err..emerg
```

### 11.4 排查 systemd 错误
当 systemd 单元启动失败，先用 `systemctl status 服务名` 快速查看简短报错摘要：
```bash
systemctl status sshd.service
```

如果摘要信息不足，使用 journalctl 查看该服务完整日志：
```bash
journalctl -u sshd.service
```

如果需要查看系统全局故障，查看本次启动全部错误级别以上日志：
```bash
journalctl -b -p err..emerg
```

### 11.5 journald 配置
配置文件路径：`/etc/systemd/journald.conf`

#### 修改日志大小上限
`SystemMaxUse` 控制磁盘上journal日志最大占用空间。示例设置最多占用2G磁盘空间：
```ini
SystemMaxUse=2G
```
当日志达到该上限，journald 会自动删除最旧的日志文件释放空间。

修改配置后重启服务：
```bash
sudo systemctl restart systemd-journald
```

#### 将日志转发到 /dev/ttyX
可以将指定优先级的日志直接输出到物理控制台终端。
例如把所有err及以上严重级别日志输出到tty12虚拟控制台：
```ini
ForwardToConsole=yes
ConsoleTTY=tty12
ConsoleLevel=err
```

#### 将日志转发给 syslog 服务
journald 可以把日志转发给传统 syslog 守护进程（rsyslog）。
```ini
ForwardToSyslog=yes
```
> 注意：openSUSE Leap 默认会安装 rsyslog，同时启用该转发。journal 保存一份，syslog 在 `/var/log/` 保存传统文本日志。

### 11.6 使用 YaST 过滤 systemd 日志
YaST 提供图形日志查看模块。
打开 YaST → 系统 → **系统日志**。
界面可以做过滤：按时间、服务单元、日志级别筛选，支持搜索字符串。

### 11.7 在 GNOME 中查看日志
GNOME 桌面使用“日志（Logs）”图形应用浏览 journald 日志。
可以按类别（硬件、应用、安全、系统）筛选，支持时间线视图、搜索。
在应用菜单打开「日志」，或者终端执行命令：
```bash
gnome‑logs
```

## 第12章 GRUB 2引导加载程序
**摘要**
本章对比传统GRUB（GRUB Legacy）与GRUB 2的主要差异，讲解配置文件结构、`/boot/grub2/grub.cfg`、`/etc/default/grub`、`/etc/grub.d`脚本；BIOS磁盘与Linux设备名称映射；引导过程中编辑菜单项；设置引导密码；配置YaST引导加载程序；常用GRUB 2命令；救援模式，以及更多参考信息。

### 12.1 GRUB Legacy与GRUB 2的主要差异
1. **配置生成方式**
GRUB Legacy直接编辑静态配置文件`menu.lst`。
GRUB 2**不直接编辑`grub.cfg`**，该文件由一系列脚本自动生成；用户修改的是`/etc/default/grub`以及`/etc/grub.d/`目录下脚本片段，执行`grub2‑mkconfig`生成最终`grub.cfg`。

2. **设备命名**
GRUB Legacy磁盘计数从**0**开始：`hd0`第一块硬盘，`hd0,0`第一硬盘第一个分区。
GRUB 2磁盘同样从0开始，但**分区编号从1开始**：`hd0,gpt1`代表第一块磁盘GPT格式的1号分区。

3. **模块机制**
GRUB 2大量使用动态模块，按需加载文件系统、加密、终端模块，缩小引导镜像体积。

4. **更多新特性**
支持Btrfs、GPT分区表、LUKS加密、UEFI安全启动、从Btrfs快照启动系统（Snapper快照引导）。

### 12.2 配置文件结构
#### 12.2.1 文件 `/boot/grub2/grub.cfg`
> ⚠️**禁止手动编辑本文件**。执行`grub2‑mkconfig`命令自动生成。软件包更新、系统内核升级时，系统会自动重新生成。
`grub.cfg`包含完整引导菜单定义、内核条目、模块加载、环境变量。
- BIOS系统路径：`/boot/grub2/grub.cfg`
- UEFI系统路径：`/boot/efi/EFI/opensuse/grub.cfg`

#### 12.2.2 文件 `/etc/default/grub`
这是**用户主要修改的配置文件**，设置全局变量，`grub2‑mkconfig`读取该文件生成`grub.cfg`。
常用配置项：
- `GRUB_TIMEOUT`：引导菜单等待超时，单位秒；`0`不显示菜单直接启动。
- `GRUB_DEFAULT`：默认启动菜单项。
- `GRUB_CMDLINE_LINUX`：传递给内核的命令行参数。
- `GRUB_CMDLINE_LINUX_DEFAULT`：普通模式内核参数，安全模式不使用。
- `GRUB_TERMINAL`：终端输出设置。

> 修改完成之后，必须执行生成命令：
```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```
> UEFI平台：
```bash
sudo grub2-mkconfig -o /boot/efi/EFI/opensuse/grub.cfg
```

#### 12.2.3 `/etc/grub.d`中的脚本
`/etc/grub.d/`目录存放shell脚本，`grub2‑mkconfig`按文件名数字顺序依次执行脚本，输出内容合并进`grub.cfg`。
文件名数字前缀决定执行顺序，数字越小越先执行：
- `00_header`：生成头部全局设置，读取`/etc/default/grub`
- `10_linux`：检测本机已安装内核，生成普通Linux启动菜单项
- `20_linux_xen`：生成Xen虚拟化内核条目
- `30_os‑prober`：探测磁盘上其他操作系统，生成多系统引导菜单（Windows、其他Linux）
- `40_custom`：管理员自定义启动条目，在这里添加自定义菜单。
- `41_custom`：加载`/boot/grub2/custom.cfg`，存放手动补充配置。

> 脚本可执行权限必须开启；不需要某个脚本可以移除执行权限，脚本就会被`grub2‑mkconfig`跳过：
```bash
sudo chmod -x /etc/grub.d/30_os-prober
```

### 12.3 BIOS驱动器与Linux设备之间的映射
GRUB 2内部磁盘命名（`hd0`、`hd1`）和Linux内核`/dev/sda`、`/dev/sdb`不一定一一对应。BIOS磁盘顺序由主板固件决定，与Linux内核识别顺序可能不一致。

查看GRUB识别到的磁盘映射关系：
在GRUB引导菜单按`c`进入GRUB命令行：
```grub
ls
ls (hd0)
lsdev
```
`hd0`是BIOS识别的第一块硬盘，但Linux中可能对应`/dev/sdb`。
> 故障场景：更换磁盘顺序后，引导失败。优先使用UUID引用分区，不要依靠设备名`/dev/sda`。内核参数中使用`root=UUID=xxxxxxx`。

### 12.4 在引导过程中编辑菜单项
在GRUB引导菜单界面：
1. 选中想要启动的条目，按 **`e`** 进入编辑模式。
2. 使用方向键移动光标，修改内核行、initramfs路径，追加内核参数。
> 例如进入救援模式：在内核行末尾添加 `systemd.unit=rescue.target`
3. 按 **Ctrl‑X** 使用本次临时修改启动系统。
> ⚠️该修改仅本次启动生效，不会写入磁盘配置，重启恢复原有配置。
4. 按ESC放弃编辑，回到主菜单。

> 此功能可以用于修复系统：忘记root密码、内核参数错误，临时修改参数启动。

### 12.5 设置引导密码
可以设置GRUB密码，限制未授权用户：禁止未经认证编辑引导菜单项、禁止进入GRUB命令行。
> ⚠️设置密码不会保护正常启动已存在的菜单条目，仅阻止编辑、命令行。

1. 使用`grub2‑mkpasswd‑pbkdf2`生成PBKDF2加密哈希密码：
```bash
grub2-mkpasswd-pbkdf2
```
输入密码，复制输出完整的`grub.pbkdf2.……`哈希字符串。

2. 编辑`/etc/grub.d/00_header`，添加下面片段：
```
set superusers="root"
password_pbkdf2 root 粘贴生成的完整pbkdf2哈希字符串
```
`superusers`定义GRUB管理员用户名。

3. 重新生成grub.cfg
```bash
sudo grub2‑mkconfig -o /boot/grub2/grub.cfg
```

设置完成：
- 直接启动已有菜单条目不需要密码。
- 想要按e编辑条目、按c进入命令行，必须输入superusers管理员密码。

#### 12.6 对引导菜单条目授权访问
如果希望**启动菜单条目本身也需要密码**，在自定义菜单条目中加入`--users`参数。
示例，在`40_custom`中定义受密码保护的启动项：
```
menuentry "Secret System" --users root {
    ……内核启动配置……
}
```
只有列表内用户可以选择该菜单项启动。

### 12.7 使用YaST配置引导加载程序
打开YaST → 系统 → 引导加载程序。
图形界面可以完成：
- 查看/修改`/etc/default/grub`参数：超时时间、默认启动项、内核命令行参数。
- 设置引导代码安装位置（MBR、GPT分区ESP分区）。
- 调整磁盘顺序。
- 设置GRUB密码。
- 高级选项：启用os‑prober探测其他系统、Btrfs快照引导支持。

修改完成保存，YaST会自动执行`grub2‑mkconfig`重新生成配置。

#### 引导加载程序位置与引导代码选项
- BIOS平台：引导代码写入磁盘MBR，或者写入分区引导扇区。
- UEFI平台：引导代码存放在EFI系统分区ESP。

#### 调整磁盘顺序
对应BIOS磁盘映射问题，YaST界面可以调整GRUB识别磁盘顺序。

#### 高级选项
- 启用Btrfs可引导快照（Snapper快照菜单）
- 开启操作系统探测os‑prober
- 自定义GRUB终端输出、图形主题

### 12.8 实用GRUB 2命令
在GRUB菜单按`c`进入GRUB命令行：
- `help`：查看帮助
- `ls`：列出所有磁盘与分区
- `ls (hd0,gpt1)/`：查看指定分区根目录文件
- `set`：查看当前环境变量
- `search --fs‑uuid XXXX`：按UUID搜索分区
- `configfile (hd0,gpt1)/boot/grub2/grub.cfg`：手动加载配置文件

### 12.9 救援模式
当系统无法正常引导，可以使用救援模式修复。
1. openSUSE安装介质（U盘/DVD）启动，选择「救援系统 Rescue System」。
2. 挂载本机的根分区、`/boot`（UEFI还要挂载ESP分区）。
3. 使用`chroot`切换到已安装系统环境。
4. 在chroot环境重新安装引导代码，重新生成grub.cfg。

BIOS示例操作：
```bash
mount /dev/sda2 /mnt
mount /dev/sda1 /mnt/boot
chroot /mnt
grub2-install /dev/sda
grub2‑mkconfig -o /boot/grub2/grub.cfg
exit
umount -R /mnt
```

UEFI示例操作：
```bash
mount /dev/sda2 /mnt
mount /dev/sda1 /mnt/boot/efi
chroot /mnt
grub2‑mkconfig -o /boot/efi/EFI/opensuse/grub.cfg
exit
```

### 12.10 更多信息
- `man grub2‑mkconfig`
- `man grub2‑mkpasswd‑pbkdf2`
- GRUB2官方文档
- Snapper文档（Btrfs快照引导）

## 第13章 基础网络
**摘要**
本章讲解IP地址与路由、子网掩码、IPv6下一代互联网、名称解析；介绍使用YaST配置网络连接；讲解NetworkManager与wicked；手动网络配置；基础路由器配置；绑定设备（bond）；网络组设备（team）；Open vSwitch软件定义网络。

### 13.1 IP地址和路由
#### 13.1.1 IP地址
IP地址是网络中用于唯一标识一台主机的标识符。IPv4地址由32位二进制组成，通常使用点分十进制表示，例如`192.168.1.10`。IPv6地址使用128位，采用冒分十六进制格式。

IP地址包含两部分：**网络位**与**主机位**。网络位标识主机所处的网段，主机位标识网段内的单台设备。同一局域网内所有主机必须拥有相同的网络位。

#### 13.1.2 子网掩码和路由
**子网掩码**用来区分IP地址中的网络位与主机位。IPv4子网掩码同样是32位，连续的1代表网络位，0代表主机位。也支持CIDR前缀长度表示法，例如`192.168.1.0/24`，`/24`代表前24位为网络位。

**路由**：定义数据包转发路径。当主机需要访问不在本地子网的目标IP时，数据包转发给**默认网关**，网关负责把数据包转发到其他网络。
查看本机路由表：
```bash
ip route
```

#### 13.1.3 IPv6——下一代互联网
###### 优势
1. 巨大地址空间：128位地址，彻底解决IPv4地址枯竭问题。
2. 内置网络层安全IPsec。
3. 支持即插即用（无状态地址自动配置SLAAC），主机可以自动获取地址，不需要DHCP服务器。
4. 多宿主支持，一台设备可以同时拥有多个IPv6地址。

###### 地址类型与结构
- **单播地址（Unicast）**：一对一通信，分配给网络接口。
- **链路本地地址（Link‑local）**：以`fe80::`开头，仅在同一二层链路内有效，不会被路由器转发。**链路本地地址必须绑定网络接口**，书写格式示例 `fe80::aabb:ccff:fedd:eeff%eth0`。
- **唯一本地地址（Unique‑local）**：类似IPv4私网地址，`fc00::/7`，内网使用，不会在公网路由。
- **多播地址（Multicast）**：`ff00::/8`，一对多，向一组主机发送数据包。IPv6不再使用广播（broadcast）。

> IPv6地址可以对连续的0段使用`::`进行压缩，**整个地址只允许出现一次`::`**。

###### IPv4与IPv6共存
openSUSE Leap默认启用双栈（Dual‑Stack）：网络接口同时拥有IPv4与IPv6地址。系统根据目标地址自动选择协议栈。
如果网络不提供IPv6，链路本地地址依然会生成，但不会访问外网。可以按需禁用IPv6模块。

###### 配置IPv6
配置方式分为：
1. SLAAC无状态自动配置（路由器通告RA）
2. DHCPv6（有状态，分配地址、DNS）
3. 静态手动指定IPv6地址、网关。

### 13.2 名称解析
名称解析：将主机域名（例如`www.opensuse.org`）转换为对应的IP地址。Linux使用解析器库完成该工作。
配置文件 `/etc/resolv.conf` 存放DNS服务器地址、搜索域。

> 在使用wicked或者NetworkManager的系统，**不要直接手动编辑resolv.conf**，该文件会被网络服务覆盖。应当通过网络管理工具配置DNS服务器。

`/etc/nsswitch.conf` 文件控制名称解析顺序：优先DNS、优先本地`/etc/hosts`主机表。
示例配置行：
```
hosts: files dns
```
含义：先读取本地`/etc/hosts`，查询不到再查询DNS服务器。

### 13.3 使用YaST配置网络连接
YaST提供图形与ncurses文本模式配置网卡。
打开YaST → 网络设备 → 网络设置。

#### 使用YaST配置网卡
可以为每一块网卡设置：
- IP获取方式：静态IP / DHCP
- IP地址、子网掩码、网关
- DNS服务器、搜索域
- 高级选项：MTU、VLAN、bond、team设备。

> 修改完成保存，网络服务自动应用配置。

### 13.4 NetworkManager
#### NetworkManager与wicked
openSUSE Leap提供两套网络管理后端：
1. **NetworkManager**：面向桌面、笔记本、移动设备。优先处理动态网络环境：Wi‑Fi、VPN、热插拔网络，适合经常切换网络的终端设备。
2. **wicked**：面向服务器，静态网络环境，适合服务器、固定机房设备，对bond、team、桥接、VLAN企业网络特性支持完善。

> 同一时间只能启用其中一套网络服务，两套服务不要同时运行。

#### NetworkManager功能与配置文件
NetworkManager管理配置存放于：
- `/etc/NetworkManager/system‑connections/`：持久保存网络连接配置文件。
- `/etc/sysconfig/network` 全局开关，选择使用`NETWORKMANAGER="yes/no"`。

命令行工具`nmcli`，文本交互工具`nmtui`。
```bash
nmcli connection show
nmtui
```

#### 控制和锁定NetworkManager功能
管理员可以通过配置文件`/etc/NetworkManager/conf.d/*.conf`锁定功能，限制普通用户修改网络设置。例如禁止普通用户修改VPN、禁止修改Wi‑Fi。

### 13.5 手动配置网络连接（wicked）
#### wicked网络配置
wicked是openSUSE传统网络管理服务。每一个网络接口对应一份配置文件，存放于 `/etc/sysconfig/network/ifcfg‑*`。例如网卡`eth0`对应文件`ifcfg‑eth0`。

#### 配置文件
关键参数示例（静态IP）
```ini
BOOTPROTO='static'
IPADDR='192.168.1.100'
NETMASK='255.255.255.0'
GATEWAY='192.168.1.1'
DNS1='192.168.1.1'
```
DHCP模式：`BOOTPROTO='dhcp'`。

wicked控制命令：
```bash
wicked show
wicked ifup eth0
wicked ifdown eth0
```

#### 测试配置
修改完ifcfg配置文件，执行：
```bash
wicked ifreload eth0
```
检查IP、路由是否生效：
```bash
ip a
ip route
```

#### Unit文件与启动脚本
wicked由systemd单元`wicked.service`管理。

### 13.6 基础路由器设置
一台openSUSE主机可以配置为简单路由器。
1. 开启内核IP转发：
临时开启：
```bash
sysctl -w net.ipv4.ip_forward=1
```
永久开启，编辑 `/etc/sysctl.conf`
```ini
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```
执行生效：`sysctl -p`。
2. 配置防火墙转发、NAT伪装（firewalld）。
3. 配置网卡：内网网卡、外网网卡分别配置IP。

### 13.7 设置绑定设备bond
网卡绑定（bonding），将多张物理网卡聚合为一个逻辑bond接口。
模式支持：主备容错、负载均衡。

#### bond端口热插拔
wicked支持bond成员端口热插拔，不需要重启服务。
配置文件示例 `/etc/sysconfig/network/ifcfg‑bond0`
```ini
BOOTPROTO='static'
IPADDR='10.0.0.10'
NETMASK='255.255.255.0'
BONDING_MASTER='yes'
BONDING_SLAVE0='eth0'
BONDING_SLAVE1='eth1'
BONDING_MODULE_OPTS='mode=active‑backup miimon=100'
```

### 13.8 设置Network Teaming网络组设备
Network Teaming（网络组），新一代网卡聚合实现，替代bonding。提供更灵活的链路监控、故障切换。
> Teaming由`teamd`守护进程管理，支持多种运行模式：负载均衡、故障转移。

#### 用例：负载均衡
多网卡同时分担流量，提升总带宽。

#### 用例：故障转移（failover）
主链路工作；链路故障，流量自动切换到备用网卡。

#### 用例：VLAN over team device
在team逻辑接口之上再配置VLAN子接口。

### 13.9 使用Open vSwitch实现软件定义网络
Open vSwitch（OVS）是开源的多层虚拟交换机，多用于虚拟化、云平台。

#### Open vSwitch优势
- 支持大量虚拟网络高级特性：VLAN、隧道、流表转发、QoS。
- 广泛和KVM、libvirt虚拟化集成。

#### 安装Open vSwitch
```bash
zypper in openvswitch
systemctl enable --now openvswitch
```

#### OVS概览：守护进程与工具
- `ovs‑vswitchd`：主守护进程，实现虚拟交换机。
- `ovsdb‑server`：数据库，存储交换机配置。
- `ovs‑vsctl`：命令行管理工具。

#### 创建网桥
```bash
ovs‑vsctl add‑br br0
# 将物理网卡eth0加入ovs网桥
ovs‑vsctl add‑port br0 eth0
```

#### 直接和KVM一起使用Open vSwitch
虚拟机网卡直接接入OVS网桥。

#### 使用libvirt使用Open vSwitch
libvirt可以定义OVS网桥，虚拟机域配置直接引用ovs网桥。

### 13.10 更多信息
- `man ip`，`man nmcli`，`man wicked`
- `/etc/sysconfig/network` 相关手册
- Open vSwitch官方文档

## 第14章 UEFI（统一可扩展固件接口）
**摘要**
本章介绍UEFI安全启动（Secure Boot），讲解openSUSE Leap上的实现方式、MOK（机器所有者密钥）、自定义内核引导、非官方驱动的使用，以及该功能的特性与限制。

### 14.1 安全启动（Secure boot）
安全启动是UEFI固件的一项安全机制。它的核心目标：阻止未签名的恶意二进制文件在计算机开机阶段执行。固件只会加载、验证带有可信密钥签名的固件驱动、引导加载程序、内核镜像。
引导链每一环都需要校验签名：UEFI固件 → GRUB2引导程序 → Linux内核。
如果某个二进制没有可信签名，固件会拒绝执行该文件。

#### openSUSE Leap上的实现
openSUSE Leap的官方EFI二进制文件、GRUB2、内核，全部使用Microsoft UEFI CA证书进行签名，该证书预置在绝大多数商用主板UEFI固件数据库中。
因此出厂默认设置下，**开启Secure Boot时openSUSE可以直接正常启动**，不需要修改固件密钥库。

> 注意：部分老旧主板固件存在兼容性bug，开启安全启动后会出现启动异常。遇到这类问题可以临时在BIOS/UEFI设置中关闭Secure Boot排查故障。

#### MOK（Machine Owner Key，机器所有者密钥）
MOK机制，用于在安全启动开启状态下，加载第三方内核模块。
官方发行版内核本身已经完成签名，但外部编译的内核模块（例如DKMS驱动：显卡、VirtualBox等）没有内置签名。
MOK流程：
1. 生成本地私钥，对第三方内核模块进行签名。
2. 将对应公钥导入UEFI固件的MOK密钥数据库。MOK数据库独立于固件内置的安全启动密钥库。
3. 重启主机，开机阶段会弹出蓝色MOK管理界面，确认导入公钥。确认之后该签名过的内核模块就可以被内核加载。

相关工具包：`mokutil`，用来管理MOK密钥。
查看当前MOK状态：
```bash
mokutil --sb-state
```

> 重要：MOK密钥存储在NVRAM固件存储区域。清除UEFI设置、恢复出厂设置会清空MOK密钥，所有已经导入的第三方模块签名失效，需要重新导入密钥。

#### 启动自定义内核
如果你自己编译、构建自定义内核镜像。在Secure Boot开启环境下，有两种方式：
1. 使用MOK私钥对内核EFI镜像签名，将公钥注册到MOK；
2. 在UEFI固件设置界面，关闭Secure Boot。

> 直接编译生成的未签名内核，开启安全启动时会被固件拒绝，无法引导。

#### 使用非预装驱动
DKMS构建的外部驱动模块（VirtualBox、NVIDIA等）：
- openSUSE软件源内部分DKMS包自带MOK签名脚本；安装软件包时会提示执行MOK密钥注册流程。
- 安装完成重启，UEFI MOK管理界面出现，确认导入公钥。确认完成模块才能正常加载。
- 如果跳过MOK注册，`modprobe`加载模块会报权限拒绝。

#### 功能与限制
1. Secure Boot仅校验EFI二进制（引导程序、内核镜像）；**不会校验initramfs、内核模块之外的系统文件**。它无法防御系统已经被入侵之后的攻击。
2. MOK密钥泄露会破坏安全启动防护效果，请妥善保管MOK私钥。
3. 部分老旧硬件固件对MOK支持不完善，会出现导入密钥失败、MOK界面不弹出的问题。
4. 重置UEFI恢复出厂，MOK密钥全部丢失，第三方模块失效，需要重新签名注册。

### 14.2 更多信息
- `man mokutil`：mokutil手册页
- openSUSE官方文档：安全启动专题文档
- UEFI规范文档

## 第15章 特殊系统功能
**摘要**
本章介绍一批重要系统软件包的相关信息：bash包与`/etc/profile`、cron软件包、logrotate日志轮转、locate命令、ulimit命令、free命令；man与info手册；GNU Emacs设置；虚拟控制台；键盘映射；语言与国家区域设置（locale）。

### 15.1 关于特殊软件包的信息
#### bash软件包与 /etc/profile
`bash`是openSUSE默认的登录shell。当用户登录交互式shell时，会读取一系列配置脚本设置shell环境变量。
- `/etc/profile`：**系统全局登录shell配置**，所有用户登录时执行。在这里设置全局PATH、环境变量、umask等。
> ⚠️不要直接把命令写在`/etc/profile`，优先放到`/etc/profile.d/*.sh`脚本片段目录，软件升级不会覆盖。
- `/etc/profile.d/*.sh`：系统全局脚本片段，登录时自动执行。管理员新增自定义环境配置在此处创建`.sh`脚本。
- 用户个人配置：`~/.bash_profile`、`~/.bashrc`，仅对当前用户生效。

> 区别：
> - 登录shell（login shell）：用户从控制台、SSH登录，读取`/etc/profile`。
> - 非登录shell：图形终端窗口打开的bash，只读取`~/.bashrc`，**不会加载/etc/profile**。

#### cron软件包
cron守护进程执行定时计划任务，详情参考安全加固指南第15章限制cron和at。

###### 关闭cron状态消息
cron默认会把每一项任务执行结果以邮件发送给root用户。如果不需要这类状态邮件，可以在crontab条目中重定向标准输出、标准错误输出到`/dev/null`。
示例：
```
0 2 * * * /usr/local/bin/backup.sh >/dev/null 2>&1
```

#### logrotate软件包（日志文件）
`logrotate`用于日志文件轮转、压缩、删除旧日志，防止日志文件无限膨胀占满磁盘。
主配置文件：`/etc/logrotate.conf`。
自定义轮转配置片段存放目录：`/etc/logrotate.d/`，各个服务把自己的日志轮转配置放到该目录。

常用逻辑：日志达到指定大小，或者到达时间周期（每日、每周），触发轮转；旧日志压缩归档；保留指定份数之后删除过期日志。

#### locate命令
`locate`快速查找文件。它并不实时扫描磁盘，而是查询预生成的数据库。
数据库由`updatedb`定时任务生成。
```bash
locate filename
```
> 注意：新创建的文件不会立刻被locate查到，需要等待`updatedb`执行更新数据库。可以手动运行`sudo updatedb`刷新。
> 默认会排除部分目录：挂载的网络文件系统、临时目录。

#### ulimit命令
`ulimit`用来查看、修改shell以及该shell派生进程的资源限制。限制项包含：打开文件数、进程数量、内存大小、栈大小、core‑dump转储文件大小。
查看全部限制：
```bash
ulimit -a
```
临时修改（仅当前shell会话生效）：
```bash
ulimit -n 4096
```
永久系统级限制配置文件：`/etc/security/limits.conf`。该配置会被PAM读取，用户登录时应用限制。

#### free命令
查看系统物理内存、交换分区使用情况。
```bash
free -h
```
`‑h`以人类可读单位（GiB/MiB）输出。输出会区分：总内存、已用、空闲、缓冲区缓存、可用内存。

#### man手册与info手册
###### 使用man命令选择man手册页
man是传统Unix手册查看工具。手册分为多个章节：
1 用户命令 | 2系统调用 | 3库函数 | 4设备文件 | 5配置文件格式 | 6游戏 |7杂项 |8系统管理命令。

查看手册：
```bash
man ls
man 5 passwd
```
> 数字代表章节，`man 5 passwd`读取配置文件格式手册，而不是passwd命令手册。

info是GNU项目的文档系统，很多GNU工具完整文档只存在info，man手册只是简短摘要。
```bash
info bash
```

#### GNU Emacs设置
系统全局Emacs配置文件：`/etc/emacs/site‑start.el`。
用户个人配置：`~/.emacs` 或者 `~/.emacs.d/init.el`。

#### 虚拟控制台（Virtual consoles）
Linux默认提供多个虚拟文本控制台。图形桌面之外，可以切换到纯文本控制台登录。
快捷键：`Ctrl+Alt+F1`~`Ctrl+Alt+F6`；F7/F8切回图形会话。
> 在部分Wayland环境，虚拟控制台切换行为可能会变化。

#### 键盘映射（Keyboard mapping）
控制台的键盘布局配置独立于GNOME/KDE图形桌面。图形桌面设置不影响TTY文本控制台。
查看可用键盘布局：
```bash
localectl list-keymaps
```
设置控制台键盘布局（永久）：
```bash
sudo localectl set-keymap de-latin1
```

#### 语言与国家区域设置（Locale）
locale定义系统语言、字符编码、日期时间格式、货币、数字格式。openSUSE默认使用UTF‑8编码。

###### 系统全局locale设置
查看当前生效locale：
```bash
locale
```
列出系统已生成的可用locale：
```bash
localectl list-locales
```
设置系统全局locale：
```bash
sudo localectl set-locale LANG=en_US.UTF-8
```
该命令修改配置文件`/etc/locale.conf`。重启登录会话后生效。

###### 部分示例
- `de_DE.UTF‑8`：德语（德国）
- `zh_CN.UTF‑8`：简体中文（中国）
- `en_US.UTF‑8`：美式英文

###### ~/.i18n内的locale设置
> `~/.i18n`是旧版配置文件。现代systemd系统优先读取`/etc/locale.conf`。部分老应用还会读取用户家目录的`~/.i18n`覆盖全局locale。

#### 语言支持设置
安装额外语言包：部分翻译包通过`zypper`安装。如果缺少翻译文本，检查对应语言包是否已经安装。

### 15.2 更多信息
- `man bash`、`man ulimit`、`man localectl`、`man logrotate`
- `/etc/profile`、`/etc/profile.d/`、`/etc/locale.conf` 注释文档


## 第16章 使用udev进行内核动态设备管理
**摘要**
udev是Linux用户空间设备管理子系统。内核检测到硬件设备发生变化（插入、移除）时，会发出内核uevent事件。udev守护进程接收这些事件，创建设备节点`/dev`下文件、加载对应驱动内核模块、设置设备权限、运行自定义规则脚本。本章介绍`/dev`目录、内核uevent、驱动与模块、设备初始化、监控udev守护进程、udev规则编写语法、持久化设备命名，以及相关配置文件。

### 16.1 /dev目录
传统静态`/dev`会预先创建全部可能的设备文件节点。
udev采用动态管理：**只有当前系统实际存在的硬件设备，才会在`/dev`下生成对应的设备节点**。设备拔出，节点随即删除。

`/dev`同时还生成符号链接，提供稳定持久设备名称，存放在子目录：
- `/dev/disk/by‑id/`
- `/dev/disk/by‑uuid/`
- `/dev/disk/by‑path/`

> 编写fstab推荐使用`/dev/disk/by‑uuid`或者`by‑id`路径，避免硬盘设备名`/dev/sda`、`/dev/sdb`因磁盘插拔顺序发生变化导致系统无法挂载。

### 16.2 内核uevent与udev
内核识别硬件变更，产生uevent事件，发送到用户空间。
`systemd‑udevd`守护进程接收uevent事件，执行处理流程：
1. 解析事件携带设备属性。
2. 匹配`/etc/udev/rules.d/`、`/usr/lib/udev/rules.d/`下udev规则。
3. 根据规则执行动作：创建设备节点、设置权限属主、创建符号链接、加载内核模块、运行自定义程序。

> 规则文件优先级：`/etc/udev/rules.d/`优先级高于`/usr/lib/udev/rules.d/`。管理员自定义规则放到`/etc/udev/rules.d/`，软件包升级不会覆盖。

### 16.3 驱动、内核模块与设备
大部分硬件驱动以可加载内核模块形式提供。
udev检测到新硬件，可以自动加载匹配的内核模块。
内核模块信息查看：
```bash
lsmod          # 列出已加载内核模块
modinfo xxx    # 查看模块详细信息
```

### 16.4 启动与初始设备设置
系统启动早期，内核探测硬件，产生大量uevent。
`systemd‑udev‑trigger`在启动阶段重放设备事件，保证开机时所有硬件完整执行udev规则，完成设备初始化。

### 16.5 监控运行中的udev守护进程
监控udev处理设备事件，调试udev规则：
```bash
udevadm monitor
```
插入U盘、拔掉USB设备，可以实时打印内核uevent以及udev处理事件。

查询已经存在设备的udev属性，例如查询磁盘`sda`：
```bash
udevadm info /dev/sda
```
输出大量设备属性，这些属性是编写udev规则的匹配依据。

### 16.6 使用udev规则处理内核设备事件
udev规则文件后缀`.rules`，一行代表一条规则。一条规则由多个**匹配键（match key）**和**赋值键（assign key）**组成。
> 匹配键：条件判断，条件全部满足，才执行本条规则的赋值动作。
> 赋值键：条件匹配成功之后，设置设备属性、权限、符号链接、执行程序。

#### 在udev规则中使用操作符
不同操作符用于匹配键和赋值键：

| 操作符 | 含义 | 用于 |
|---|---|---|
| `==` | 判断相等 | 匹配键，相等才命中规则 |
| `!=` | 判断不相等 | 匹配键，不相等才命中规则 |
| `=` | 设置值，覆盖旧值 | 赋值键 |
| `+=` | 添加，追加值（列表） | 赋值键 |
| `:=` | 最终赋值，不可被后续规则修改 | 赋值键 |

#### 在udev规则中使用替换变量（substitutions）
可以使用`$变量名`或者`%k`这类占位符，代表设备的动态属性。
常用：
- `%k`：内核设备名，例如`sda`
- `$devpath`：内核设备devpath路径
- `$id_serial`：设备序列号

示例片段：
```
SYMLINK+="disk/by‑serial/$id_serial"
```

#### udev匹配键 match keys
用于做条件判断，从设备属性筛选设备。常用匹配键：
- `KERNEL`：内核设备名匹配，例如`KERNEL=="sd*"`匹配全部SATA/SCSI磁盘
- `SUBSYSTEM`：子系统，如`block`块设备、`net`网络设备、`usb`USB子系统
- `DRIVER`：驱动模块名称
- `ATTR{filename}`：读取sysfs下设备属性文件做匹配，例如`ATTR{idVendor}=="1234"`匹配USB厂商ID
- `ENV{变量名}`：匹配udev环境变量

示例规则，匹配特定USB供应商ID的块设备：
```rules
SUBSYSTEM=="block", KERNEL=="sd*", ATTRS{idVendor}=="0781", MODE="0660"
```

#### udev赋值键 assign keys
条件匹配成功之后执行设置动作：
- `MODE`：设置设备节点权限，例如`MODE="0660"`
- `OWNER`：设置设备属主用户
- `GROUP`：设置设备属组
- `SYMLINK+=`：创建/追加符号链接
- `RUN+="程序路径"`：执行外部程序脚本
- `ENV{key}=value`：设置udev环境变量

### 16.7 持久化设备命名
udev最常用场景：生成不受硬件插拔顺序影响的稳定设备名称。
块磁盘设备，系统已经自带规则，自动在`/dev/disk/by‑id`、`by‑uuid`、`by‑path`生成符号链接。

> 强烈建议fstab、crypttab中**不要写`/dev/sda`、`/dev/sdb`这类内核设备名**，磁盘检测顺序发生变化名字就会错乱，改用by‑uuid / by‑id。

网络网卡也可以实现持久命名，openSUSE使用udev规则实现网卡一致性命名（enp0s3这类新式网卡名），避免eth0、eth1顺序漂移。

### 16.8 uevd使用的各类文件
1. `/usr/lib/udev/rules.d/*.rules`：发行版自带系统udev规则，软件包升级会覆盖。不要编辑。
2. `/etc/udev/rules.d/*.rules`：管理员自定义规则，优先级更高，软件更新不会修改。
3. `/lib/udev/`：udev调用的辅助脚本、帮助程序。
4. `/sys`：sysfs虚拟文件系统，内核把全部硬件设备属性导出到这里，udev读取sysfs获取设备信息。

> 写完或者修改udev规则，不需要重启系统，触发设备重新加载测试：
```bash
udevadm control --reload-rules
udevadm trigger --subsystem-match=block
```

### 16.9 更多信息
```bash
man 7 udev
man systemd‑udevd
man udevadm
```
- `/usr/lib/udev/rules.d/`下自带规则样例参考。

## 第17章 SLP（服务定位协议）
**摘要**
SLP（Service Location Protocol，服务定位协议）是一种网络协议，允许网络中的设备广播、发现网络服务。客户端无需预先知道服务主机的主机名或IP地址，就能够自动检索网络内可用服务。openSUSE中使用`slptool`作为SLP前端工具，本章讲解使用SLP提供服务、搭建SLP安装服务器。

### 17.1 SLP前端工具 slptool
`slptool`是openSUSE提供的SLP命令行客户端，用于查询网络上通过SLP通告的服务。

列出网络中全部可用服务类型：
```bash
slptool findsrvtypes
```

查询某一类服务的所有实例，例如查找网络内所有SLP通告的安装源服务：
```bash
slptool findsrvs service:install.opensuse
```

获取指定服务的详细属性信息：
```bash
slptool findattrs service:install.opensuse
```

> 提示：SLP使用多播，需要本地网络防火墙允许SLP多播数据包。SLP默认使用UDP 427端口。

### 17.2 通过SLP提供服务
系统可以配置为向外通告自身提供的网络服务。服务描述配置文件存放于 `/etc/slp.reg.d/` 目录，后缀`.reg`。

注册文件格式示例 `/etc/slp.reg.d/my-service.reg`
```
service:myservice://server.example.com:8080
# 服务属性
(description=My test service)
```
修改注册文件之后，重启slpd服务生效：
```bash
systemctl restart slpd
```
slpd守护进程会读取`.reg`注册文件，向本地子网广播服务信息。

### 17.3 搭建SLP安装服务器
可以搭建openSUSE SLP安装服务器，把本地软件仓库通过SLP对外通告。网络中的其他计算机在安装系统时，可以通过SLP自动发现该安装源，无需手动输入服务器地址。

1. 准备完整openSUSE安装介质仓库，通过HTTP、NFS或者FTP对外提供访问。
2. 在SLP注册目录创建安装服务注册文件 `/etc/slp.reg.d/install.reg`
```
service:install.opensuse://ftp.example.com/pub/opensuse/Leap-15.6
(distribution=openSUSE Leap 15.6,version=15.6)
```
3. 重启`slpd`服务。
4. 客户端安装openSUSE时，在安装源界面选择「SLP查找」，即可自动发现该服务器。

> 注意：跨子网环境，SLP多播无法跨路由器，需要配置SLP目录代理（Directory Agent）。普通小型局域网无需配置。

### 17.4 更多信息
- `man slptool`、`man slpd`
- `/etc/slp.conf` SLP主配置文件

---

## 第18章 使用NTP实现时间同步
**摘要**
NTP（Network Time Protocol，网络时间协议）用于同步计算机系统时钟，让多台主机时间保持一致。对于日志、数据库、集群环境，准确系统时间至关重要。openSUSE Leap使用`chrony`作为NTP实现。本章介绍YaST配置NTP客户端、chrony运行时配置、动态时间同步、搭建本地参考时钟。

### 18.1 使用YaST配置NTP客户端
打开YaST → 网络服务 → NTP客户端。

#### NTP守护进程启动
- **开机启动**：系统开机自动启动chrony，持续同步时间。
- **仅手动同步**：开机不运行守护进程，只执行一次性时间同步之后退出。适合离线偶尔同步时间的主机。

#### 配置源类型
两种获取时间源的模式：
1. **公共NTP服务器池**：使用公网NTP池服务器（例如`pool.ntp.org`）。
2. **本地参考时钟**：连接硬件时钟接收机，适用于隔离内网，没有外网的环境。

#### 配置时间服务器
在服务器列表添加NTP服务器主机名或IP。可以添加多个服务器，chrony自动选择质量最优的源。
- 勾选「iburst」：开机快速完成初次时间同步。
- 勾选「prefer」：优先信任该服务器。

保存设置，YaST自动修改chrony配置文件`/etc/chrony.conf`。

### 18.2 在网络中手动配置NTP
直接编辑chrony主配置文件 `/etc/chrony.conf`。
添加NTP服务器示例：
```ini
server 0.opensuse.pool.ntp.org iburst
server 1.opensuse.pool.ntp.org iburst
```

修改配置后重启chrony：
```bash
systemctl restart chronyd
```

### 18.3 使用chronyc在运行时配置chronyd
`chronyc`是chrony交互式命令行工具，可以不重启服务，实时查询、调整时间同步状态。

进入交互控制台：
```bash
chronyc
```

常用子命令：
- `sources`：查看所有配置的NTP源，显示每个源的状态。
- `tracking`：查看系统时钟当前同步状态、偏移、抖动。
- `burst`：触发一轮快速时间测量。
- `add server ntp.example.com iburst`：运行时临时增加NTP服务器（重启失效）。
- `remove server ntp.example.com`：移除临时添加的服务器。
- `manual`：允许手动设置系统时间。
- `makestep`：时间偏差很大时，直接步进修正系统时间，而不是缓慢调速。

> 注意：`chronyc`运行时修改不会写入`/etc/chrony.conf`，重启服务会丢失。永久修改需要编辑配置文件。

### 18.4 运行时动态时间同步
chronyd持续平滑微调系统时钟。如果系统时钟偏差巨大，默认不会跳变时间，而是缓慢把时间校准回来。
当偏差超过阈值，可以使用`makestep`执行跳变校正。

> 数据库服务运行环境，尽量避免时间跳变。优先让chrony慢慢调速。

### 18.5 设置本地参考时钟
内网隔离环境，没有外网NTP服务器，可以将本机硬件时钟作为本地参考时钟，内网其他主机同步这台机器。

在`/etc/chrony.conf`开启本地参考：
```ini
local stratum 10
allow 192.168.1.0/24
```
- `local stratum 10`：把本机时钟当作stratum‑10层级时间源。
- `allow`：允许指定网段主机向本机做NTP查询。

重启chronyd，内网其他机器把NTP服务器指向这台主机IP。

### 18.6 更多信息
- `man chronyd`，`man chronyc`
- `/etc/chrony.conf`配置文件注释文档

## 第19章 域名系统（DNS）
**摘要**
DNS（Domain Name System，域名系统）负责将人类可读的域名解析为IP地址，同时支持反向解析，把IP地址转换回域名。openSUSE Leap使用BIND作为DNS服务器软件。本章介绍DNS术语、软件安装、YaST向导模式与专家模式配置、BIND主配置文件、日志、区域配置、区域文件、动态更新、安全事务以及DNS安全相关内容。

### 19.1 DNS术语
- **递归查询（Recursive query）**：DNS服务器替客户端完成完整域名查询，直接返回最终结果。普通内网客户端一般向递归DNS服务器发起查询。
- **迭代查询（Iterative query）**：服务器返回下一步应当查询的其他DNS服务器地址，由请求方继续发起查询。DNS服务器之间通信使用迭代查询。
- **区域（Zone）**：DNS管理的域名管辖范围，例如`example.org`就是一个DNS区域。
- **主服务器（Master / Primary）**：保存该区域权威原始数据，区域记录在此维护。
- **从服务器（Slave / Secondary）**：从主服务器通过区域传输获取区域副本，提供相同解析服务，用于冗余备份。
- **资源记录RR（Resource Record）**：区域文件内单条数据，例如A记录、AAAA记录、CNAME、MX、NS记录。
- **SOA记录（Start of Authority）**：区域起始授权记录，每个区域必须有一条SOA，定义区域管理参数：序列号、刷新、重试、过期、TTL生存时间。

### 19.2 安装
BIND软件包名为`bind`。安装后系统会启用`named`服务。
```bash
zypper in bind
systemctl enable --now named
```
> 服务进程名称为`named`，配置用户为`named`。

### 19.3 使用YaST进行配置
打开YaST → 网络服务 → DNS服务器。

#### 向导配置（Wizard configuration）
向导模式适合快速搭建基础DNS服务器。按步骤设置：
1. 设置是否启用递归查询。
2. 添加正向解析区域（域名到IP）。
3. 添加反向解析区域（IP到域名）。
4. 设置允许递归的客户端网段。
完成后YaST自动生成`named.conf`与区域文件。

#### 专家配置（Expert configuration）
专家模式可以访问BIND全部配置选项，适合复杂部署。可以直接编辑配置片段、管理多条区域、调整日志、安全访问控制。

### 19.4 配置文件 /etc/named.conf
这是BIND的主配置文件。

#### 重要配置选项
- `listen‑on`：指定IPv4地址与端口，BIND监听的网卡地址。
- `listen‑on‑v6`：指定IPv6监听地址。
- `allow‑query`：允许哪些主机向本服务器发起DNS查询。
- `allow‑recursion`：允许哪些客户端使用递归查询功能。公网DNS服务器通常禁止外部递归，防止被用作DNS放大攻击。
- `forwarders`：上游转发DNS服务器地址，本服务器收到查询，转发给上游服务器。
- `dnssec‑enable yes`：开启DNSSEC域名安全扩展。

#### 日志配置
`logging{}`配置段定义日志输出位置、日志级别。可以输出到文件或者syslog系统日志。
示例：
```conf
logging {
    channel default_log {
        file "/var/log/named.log" versions 3 size 100m;
        severity info;
    };
    category default { default_log; };
};
```

#### Zone entries（区域条目）
每一个zone块定义一个DNS区域。
主区域示例：
```conf
zone "example.org" {
    type master;
    file "db.example.org";
};
```
从区域示例：
```conf
zone "example.org" {
    type slave;
    masters { 192.168.1.10; };
    file "slave.db.example.org";
};
```

#### Zone files（区域文件）
区域文件存放在`/var/lib/named/`目录。文件内包含SOA、NS、A、AAAA、CNAME、MX等各类资源记录。
> 区域文件修改完成后，**必须增大SOA的序列号**，否则从服务器不会同步更新数据。
修改配置重载服务：
```bash
systemctl reload named
```

#### 区域数据动态更新（Dynamic update of zone data）
BIND支持动态更新，不需要手动编辑区域文本文件，客户端可以通过DNS协议更新记录。常用于DHCP服务器同步主机A记录。
在zone配置开启动态更新：
```conf
zone "example.org" {
    type master;
    file "db.example.org";
    allow‑update { 192.168.1.0/24; };
};
```
> 安全提醒：不要向不受信任的网络开放动态更新权限。

#### Secure transactions（安全事务）
使用TSIG密钥对区域传输、动态更新做身份认证。生成TSIG密钥，主从服务器配置相同密钥，只有持有合法密钥才允许执行区域传输与动态更新。

#### DNS安全
1. 公网服务器限制`allow‑recursion`，拒绝外部递归查询，防护DNS放大攻击。
2. 使用TSIG保护区域传输，不允许任意主机请求AXFR区域全量传输。
3. 启用DNSSEC对区域记录签名，校验域名记录没有被篡改。
4. 使用防火墙，只开放UDP 53，TCP 53端口给可信地址。

### 19.5 更多信息
- `man named.conf`
- `man named`
- `/usr/share/doc/packages/bind` 软件包文档
- `dig`、`nslookup`、`host` 测试DNS查询工具

---

## 第20章 DHCP服务器
**摘要**
DHCP（Dynamic Host Configuration Protocol，动态主机配置协议）服务器，为局域网内客户端自动分配IP地址、子网掩码、网关、DNS服务器、搜索域等网络参数。openSUSE Leap使用`dhcpd`作为DHCP服务端程序。本章讲解YaST向导与专家模式配置DHCP服务器，软件包说明、固定IP地址分配等内容。

### 20.1 使用YaST配置DHCP服务器
打开YaST → 网络服务 → DHCP服务器。

#### 初始配置（向导模式 Initial configuration）
向导模式引导完成基础配置：
1. 选择DHCP服务监听的网络接口。
2. 设置子网网段、子网掩码。
3. 配置地址池：可以分配给客户端的IP地址范围。
4. 分配网关、DNS服务器、NTP服务器、域名搜索域。
5. 设置租约时间：客户端IP地址的有效期。
保存配置，YaST自动生成`/etc/dhcpd.conf`，启动dhcpd服务。

#### DHCP服务器专家配置（Expert）
专家模式可以访问全部高级DHCP选项：
- 定义多个子网；
- 设置静态地址绑定（MAC地址映射固定IP）；
- 定义BOOTP、PXE网络启动参数；
- 配置不同类别的客户端不同参数；
- 调整租约时间、日志选项。

### 20.2 DHCP软件包 dhcpd
主配置文件：`/etc/dhcpd.conf`。
DHCP租约数据库文件记录已经分配出去的IP，路径：`/var/lib/dhcp/db/dhcpd.leases`。

启动、重启、查看状态：
```bash
systemctl enable --now dhcpd
systemctl restart dhcpd
systemctl status dhcpd
```

> 防火墙需要放行DHCP：UDP 67端口（服务器），UDP 68端口客户端。

#### 给客户端分配固定IP地址
根据客户端MAC硬件地址，分配固定不变IP，也叫静态绑定。
在`dhcpd.conf`配置主机声明：
```conf
host pc‑workstation {
    hardware ethernet 00:11:22:33:44:55;
    fixed‑address 192.168.1.50;
}
```
保存配置，重载dhcpd服务生效。

#### openSUSE Leap版本说明
openSUSE Leap使用ISC DHCP。ISC DHCP项目已经停止维护。新项目推荐使用kea‑dhcp作为替代实现。

### 20.3 更多信息
- `man dhcpd.conf`
- `man dhcpd`
- `/etc/dhcpd.conf`配置文件自带注释样例

## 第21章 Samba
**摘要**
Samba软件套件让Linux可以实现SMB/CIFS协议，能够与Windows系统互相访问文件与打印机共享。本章讲解Samba术语、安装、启停服务；YaST与手动两种方式配置Samba服务；Samba客户端配置；将Samba作为登录服务器；与Active Directory活动目录域集成；高级主题：systemd自动挂载CIFS、Btrfs透明压缩、快照等。

### 21.1 术语
- **SMB / CIFS**：服务器消息块协议，Windows用于文件、打印机共享的网络协议。CIFS是SMB的公开版本。
- **Samba**：Linux上SMB/CIFS协议开源实现，包含两个核心守护进程：
  - `smbd`：处理文件共享、身份认证。
  - `nmbd`：NetBIOS名称解析，提供Windows网上邻居浏览功能。
- **工作组（Workgroup）**：对等网络模式，没有集中域控制器。
- **Active Directory(AD)**：Windows活动目录，集中式域管理服务。
- **winbind**：将Windows域用户、组映射到Linux系统用户与组。

### 21.2 安装Samba服务器
安装Samba服务端软件包：
```bash
sudo zypper in samba samba‑client
```

### 21.3 启动和停止Samba
```bash
# 开机自启并立刻启动
sudo systemctl enable --now smb nmb

# 停止服务
sudo systemctl stop smb nmb

# 查看状态
sudo systemctl status smb nmb
```
> 防火墙需要放行Samba服务端口：UDP137、UDP138，TCP139、TCP445。

### 21.4 配置Samba服务器
#### 21.4.1 使用YaST配置Samba服务器
打开YaST → 网络服务 → Samba服务器。
1. 设置工作组名称。
2. 选择安全模式：工作组模式，或者加入Active Directory域。
3. 添加共享：设置共享名称、本地目录、读写权限、访客是否允许访问。
4. 设置全局选项：是否允许访客浏览、打印机共享启用与否。
保存后YaST会写入主配置文件`/etc/samba/smb.conf`，重启Samba服务。

#### 21.4.2 手动配置服务器
主配置文件`/etc/samba/smb.conf`，分为`[global]`全局段，以及各个共享段。

**全局配置示例 [global]**
```ini
[global]
    workgroup = WORKGROUP
    netbios name = openSUSE‑Server
    security = user
    map to guest = Bad User
```

**文件共享示例**
```ini
[public]
    path = /srv/samba/public
    writable = yes
    guest ok = yes
    create mask = 0644
    directory mask = 0755
```

> Samba不直接使用系统/etc/passwd密码，需要为Linux用户创建Samba专用密码：
```bash
sudo smbpasswd -a tux
```
修改配置完成后，校验配置语法：
```bash
testparm
```
校验无误后重启服务：
```bash
sudo systemctl restart smb nmb
```

### 21.5 配置客户端
#### 21.5.1 使用YaST配置Samba客户端
YaST → 网络服务 → Samba客户端。设置工作组，配置用于访问共享的账号。

#### 21.5.2 在客户端挂载SMB/CIFS共享
临时挂载：
```bash
sudo mount -t cifs //server/public /mnt/smb -o username=tux,password=xxx
```
写入`/etc/fstab`实现开机自动挂载：
```
//server/public  /mnt/smb  cifs  credentials=/etc/samba/creds,uid=1000,gid=1000  0 0
```
> `credentials=/etc/samba/creds`文件保存用户名密码，文件权限设置`600`。

#### 21.6 将Samba作为登录服务器
Samba可以充当NT‑域登录服务器（NT4域），提供Windows机器域登录。
> 注意：这是旧版NT4域，**不是Active Directory**。在`smb.conf`的global段设置：
```ini
security = user
domain logons = yes
```
配置域登录脚本、用户配置文件路径。

### 21.7 与Active Directory网络中的Samba服务器
openSUSE主机可以加入Windows Active Directory域。有两种方式：使用`realmd`工具，或者配置winbind。

#### 使用realmd管理Active Directory
`realmd`简化AD域加入流程，自动配置winbind、PAM、nsswitch。
安装工具包：
```bash
sudo zypper in realmd samba‑winbind
```
查看可发现的域：
```bash
realm discover example.com
```
加入域：
```bash
sudo realm join example.com -U Administrator
```
成功后，AD域用户可以登录本机，Samba可以使用AD账号做访问认证。

退出域：
```bash
sudo realm leave example.com
```

### 21.8 高级主题
#### 使用systemd自动挂载CIFS文件系统
不使用传统fstab，编写`.mount`单元配合`.automount`单元实现按需自动挂载Samba共享。空闲一段时间自动卸载，访问时自动挂载。

#### Btrfs上的透明文件压缩
Samba共享Btrfs子卷，开启Btrfs透明压缩，对SMB客户端完全透明，不需要客户端做任何设置。
```bash
chattr +c /srv/samba/share
```

#### 快照
如果共享目录位于Btrfs，结合Snapper快照，Samba可以导出快照副本，Windows客户端可以访问以前版本文件。

### 21.9 更多信息
- `man smb.conf`
- `man smbpasswd`
- `man mount.cifs`
- `testparm`命令校验配置

---

## 第22章 使用NFS共享文件系统
**摘要**
NFS（Network File System，网络文件系统），Unix/Linux之间的经典文件共享协议。本章讲解NFS概览、安装NFS服务端；YaST与手动两种导出共享配置；Kerberos安全NFS；客户端配置；并行NFS(pNFS)；防火墙下运行NFS4.x与NFS3；NFSv4 ACL管理；NFS故障排查信息。

### 22.1 概览
NFS是面向类Unix系统的网络文件共享协议。
- NFSv4：现代版本，只需要TCP 2049单个端口，更容易穿越防火墙，支持Kerberos安全认证，推荐优先使用。
- NFSv3：旧版本，依赖多个随机端口的RPC服务，防火墙配置复杂。

NFS服务端把本地目录**导出(export)**；客户端将其**导入(mount)**挂载到本地目录。NFS原生支持Unix用户ID、组ID权限模型。

### 22.2 安装NFS服务器
```bash
sudo zypper in nfs‑kernel‑server
sudo systemctl enable --now nfs‑server
```

### 22.3 配置NFS服务器（导出文件系统）
#### 22.3.1 使用YaST导出文件系统
YaST → 网络服务 → NFS服务器。
1. 添加导出目录（要共享的本地目录）。
2. 设置允许访问的主机/网段。
3. 设置挂载选项：读写/只读、root_squash、no_root_squash等。
4. 如需Kerberos安全模式勾选对应的安全选项。
保存配置，YaST会更新`/etc/exports`，重启NFS服务。

#### 22.3.2 手动导出文件系统
NFS导出主配置文件：`/etc/exports`。
语法：`共享目录 主机(选项)`

示例：
```
/srv/nfs/share  192.168.1.0/24(rw,sync,root_squash)
```
常用选项：
- `rw`：读写；`ro`：只读
- `sync`：写入磁盘完成后才返回成功；`async`先返回再刷写磁盘（存在数据丢失风险）
- `root_squash`：客户端root用户映射为匿名nfsnobody用户（**默认开启，强烈建议保留**）
- `no_root_squash`：不映射root，客户端root拥有服务端root权限，不安全，内网谨慎使用
- `all_squash`：全部客户端用户映射为匿名用户

修改`/etc/exports`之后应用配置：
```bash
sudo exportfs -r
```
查看当前生效导出列表：
```bash
exportfs -v
```

#### 22.3.3 带Kerberos的NFS
NFSv4支持RPCSEC‑GSS（Kerberos）认证加密，用户身份由Kerberos票据验证，不再依赖UID数字匹配。
exports中增加`sec=krb5`选项。需要部署Kerberos KDC服务，服务端客户端都要获取主机票据。

### 22.4 配置客户端（导入文件系统）
#### 22.4.1 使用YaST导入文件系统
YaST → 网络服务 → NFS客户端，添加NFS挂载项，设置挂载点、服务器地址、NFS版本、挂载参数。写入`/etc/fstab`实现开机挂载。

#### 22.4.2 手动导入文件系统
临时挂载NFS：
```bash
sudo mount server.example.com:/srv/nfs/share /mnt/nfs
```

写入`/etc/fstab`开机自动挂载：
```
server.example.com:/srv/nfs/share  /mnt/nfs  nfs  defaults,_netdev 0 0
```
> `_netdev`标记该挂载为网络文件系统，系统启动网络就绪之后才执行挂载。

#### 22.4.3 并行NFS（pNFS）
pNFS是NFSv4.1扩展。支持数据元数据分离，多存储设备并行IO，提升大规模存储环境性能。需要服务端硬件支持pNFS。

### 22.5 在防火墙之后运行NFS服务器和客户端
#### NFS 4.x
NFSv4仅使用TCP端口2049。防火墙放行TCP 2049即可，不需要其他端口。

#### NFS 3
NFSv3除2049，还依赖portmap、mountd、nlockmgr等RPC服务随机端口。
需要在`/etc/sysconfig/nfs`把各个RPC服务设置为固定端口，再在防火墙放行全部固定端口。**强烈建议优先使用NFSv4，规避该复杂问题。**

#### 在NFSv4上管理访问控制列表ACL
NFSv4支持NFS本机ACL，不同于传统POSIX ACL。客户端挂载时开启`nfs4acl`选项，可对共享设置细粒度访问权限。

### 22.6 NFS故障排查收集信息
#### 普通故障排查
1. 服务端：确认`exportfs -v`导出配置正确；检查防火墙；确认目录本地权限。
2. 客户端：`showmount -e server`查看服务器导出列表；检查网络连通性。
3. 查看日志：`journalctl -u nfs‑server`，客户端查看`dmesg`内核消息。

> NFS常见故障：客户端UID/GID与服务器不匹配，出现权限异常。使用Kerberos NFSv4可以规避UID匹配问题。

#### 高级NFS调试
开启NFS内核调试跟踪，会产生大量日志，仅用于故障排查，排错完成关闭调试。

### 22.7 更多信息
- `man exports`
- `man nfs`
- `man mount.nfs`
- `showmount`、`exportfs`工具手册


## 第23章 使用autofs实现按需挂载

**摘要**
autofs是按需自动挂载工具。它不会在系统启动时就挂载全部网络文件系统，而是在用户访问挂载点的时候才执行挂载；空闲超时之后自动卸载文件系统。本章介绍软件安装、配置、主映射文件、子映射文件；运行调试；NFS自动挂载示例；高级主题：`/net`挂载点、通配符子目录自动挂载、CIFS自动挂载。

### 23.1 安装

安装autofs软件包：

```
sudo zypper in autofs
```

启用并启动autofs服务：

```
sudo systemctl enable --now autofs
```

### 23.2 配置

autofs的配置分为**主映射文件（master map）**和各类映射文件（map files）。
autofs守护进程读取主映射，主映射指向各个子映射配置。

#### 23.2.1 主映射文件

默认主映射文件为`/etc/auto.master`。
每一行格式：
`挂载点  映射文件路径  [挂载选项]`

示例条目：

```
/mnt/nfs    /etc/auto.nfs    --timeout=60
```

含义：

- 挂载根目录：`/mnt/nfs`
- 映射配置文件：`/etc/auto.nfs`
- 选项`--timeout=60`：空闲60秒之后自动卸载。

> 
> 修改`auto.master`之后，需要重载autofs服务：

```
sudo systemctl reload autofs
```

#### 23.2.2 映射文件（Map files）

映射文件定义各个子挂载项，格式：
`挂载子目录  [挂载选项]  服务器:/共享路径`

示例 `/etc/auto.nfs`：

```
store  -rw,sync  nfs-server.example.com:/srv/nfs/store
backup -ro       nfs-server.example.com:/srv/nfs/backup
```

当访问`/mnt/nfs/store`，autofs自动挂载`nfs‑server.example.com:/srv/nfs/store`到此目录；60秒无访问自动卸载。

### 23.3 运行与调试

#### 控制autofs服务

```
# 查看状态
systemctl status autofs
# 重载配置
systemctl reload autofs
# 完全重启
systemctl restart autofs
```

#### 调试automounter问题

开启调试模式：编辑`/etc/sysconfig/autofs`，设置`DEBUG="-d"`，重启autofs。
查看调试日志：

```
journalctl -u autofs
```

#### 自动挂载NFS共享示例

1. 编辑`/etc/auto.master`加入一行：

```
/mnt/nfs    /etc/auto.nfs    --timeout=120
```

2. 创建`/etc/auto.nfs`：

```
media  -rw,sync  192.168.1.10:/srv/nfs/media
```

3. 重载autofs：`systemctl reload autofs`
4. 直接访问`/mnt/nfs/media`，无需手动执行mount命令。

> 
> ⚠️不要手动mkdir创建`/mnt/nfs/media`，autofs会动态管理子目录，手动创建会引发冲突。父目录`/mnt/nfs`autofs会自行生成。

### 23.4 高级主题

#### 23.4.1 /net挂载点

autofs内置特殊挂载点`/net`。启用之后，格式`/net/服务器名/共享名`即可访问任意NFS导出，无需编写单独映射配置。
在`/etc/auto.master`默认已经包含：

```
/net    -hosts
```

示例：访问`/net/nfs‑server/srv/nfs/store`，autofs自动挂载对应NFS共享。

#### 23.4.2 使用通配符自动挂载子目录

映射文件中支持`*`通配符，以及`&`占位符。
示例`/etc/auto.home`，自动挂载各个用户的NFS家目录：

```
*   -rw,sync    nfs-server.example.com:/home/&
```

访问`/mnt/home/tux`，就挂载服务器的`/home/tux`。`*`匹配本地子目录名，`&`把匹配的值代入远程路径。

#### 23.4.3 CIFS文件系统自动挂载

autofs同样支持SMB/CIFS共享。映射示例：

```
winshare  -fstype=cifs,username=tux,password=SecretPass  ://win‑srv/public
```

> 
> 出于安全，密码不建议直接写在映射文件，可使用credentials凭证文件。

```
winshare  -fstype=cifs,credentials=/etc/smb.cred  ://win‑srv/public
```

凭证文件`/etc/smb.cred`权限设置为`600`。

### 23.5 更多信息

```
man 5 auto.master
man autofs
```

---

## 第24章 Apache HTTP服务器

**摘要**
Apache2（httpd）是开源、广泛使用的Web服务器软件。本章快速入门；软件安装启动；Apache配置文件体系；YaST与手动配置；启停服务；模块管理；CGI脚本配置；SSL安全Web服务器；多实例运行；规避安全问题；故障排查，更多参考资料。

### 24.1 快速开始

#### 24.1.1 前提条件

- 网络正常；防火墙放行TCP 80（HTTP），如需HTTPS放行TCP 443。

#### 24.1.2 安装

安装Apache2软件包：

```
sudo zypper in apache2
```

#### 24.1.3 启动

```
sudo systemctl enable --now apache2
```

浏览器访问本机地址`http://localhost`，出现openSUSE Apache默认欢迎页面代表服务运行正常。

### 24.2 Apache配置

#### 24.2.1 Apache配置文件

openSUSE上Apache2配置采用分片包含式结构：

1. 主配置文件：`/etc/apache2/httpd.conf`
2. 模块配置目录：`/etc/apache2/mod‑available‑conf/`，可用模块配置片段
3. 启用模块符号链接目录：`/etc/apache2/mod‑enabled‑conf/`
4. 虚拟主机配置目录：`/etc/apache2/vhosts.d/`，存放各个虚拟主机`.conf`配置。

> 
> openSUSE使用`a2enmod`、`a2dismod`脚本启用/禁用模块，不要手动创建符号链接。

#### 24.2.2 手动配置Apache

修改配置文件之后，务必检查配置语法：

```
apache2ctl configtest
```

语法无报错，重载配置：

```
systemctl reload apache2
```

#### 24.2.3 使用YaST配置Apache

YaST → 网络服务 → HTTP服务器。向导引导配置基础设置：服务器名称、文档根目录、启用模块、虚拟主机、SSL证书。保存后自动写入配置文件。

### 24.3 启动和停止Apache

```
# 启动
systemctl start apache2
# 停止
systemctl stop apache2
# 重载配置（不中断现有连接）
systemctl reload apache2
# 完全重启
systemctl restart apache2
# 查看状态
systemctl status apache2
```

### 24.4 安装、激活和配置模块

#### 24.4.1 模块安装

Apache模块分为软件包，例如`apache2‑mod_ssl`、`apache2‑mod_rewrite`。需要先zypper安装模块包。

#### 24.4.2 启用和停用模块

`a2enmod`启用模块，`a2dismod`禁用模块。
示例启用rewrite、ssl模块：

```
sudo a2enmod rewrite ssl
sudo a2dismod status
```

启用禁用模块后执行`systemctl reload apache2`。

#### 24.4.3 基础模块与扩展模块

- 基础模块：httpd核心自带，无需单独安装RPM包。
- 扩展模块：独立软件包，需要zypper安装。

#### 24.4.4 多处理模块（MPM）

MPM（Multi‑Processing Module）多处理模块，定义Apache处理并发连接的工作模型。

- `prefork`：多进程模型，每个请求一个独立进程，兼容老旧非线程安全脚本。
- `worker`：多进程+多线程。
- `event`：高性能事件驱动MPM，openSUSE默认。

切换MPM模块：

```
sudo a2enmod mpm_event
sudo a2dismod mpm_prefork
systemctl reload apache2
```

#### 24.4.5 外部模块

第三方提供的Apache模块，安装对应rpm包，再a2enmod启用。

#### 24.4.6 编译

自行编译第三方模块，编译完成使用`apxs2`工具安装到Apache模块目录。

### 24.5 启用CGI脚本

#### 24.5.1 Apache配置

启用cgi模块：

```
sudo a2enmod cgi
systemctl reload apache2
```

两种CGI运行方式：

1. ScriptAlias映射，默认目录`/srv/www/cgi‑bin/`，放置cgi脚本。访问`http://localhost/cgi‑bin/script.pl`。
2. 目录内开启ExecCGI选项，允许DocumentRoot目录下执行cgi脚本。

#### 24.5.2 运行示例脚本

示例简单shell脚本`/srv/www/cgi‑bin/test.sh`

```
#!/bin/bash
echo "Content‑type: text/plain"
echo ""
echo "CGI测试正常工作"
```

赋予可执行权限：

```
chmod +x /srv/www/cgi‑bin/test.sh
```

浏览器访问 `http://localhost/cgi‑bin/test.sh`。

#### 24.5.3 CGI故障排查

- 脚本缺少可执行权限
- 脚本第一行shebang错误
- 输出必须先打印`Content‑type`头部，之后输出空行
- 查看Apache错误日志：`/var/log/apache2/error_log`

### 24.6 搭建安全Web服务器（SSL）

#### 24.6.1 创建SSL证书

两种方式：

1. 自签名证书，内部测试使用；
2. 公开CA签发证书（例如Let’s Encrypt），互联网正式站点使用。

openSUSE可以使用`openssl`生成自签名证书。证书配置示例虚拟主机放到`/etc/apache2/vhosts.d/`。

#### 24.6.2 使用SSL配置Apache

启用ssl模块 `a2enmod ssl`。HTTPS虚拟主机示例片段：

```
<VirtualHost *:443>
    ServerName www.example.com
    DocumentRoot /srv/www/htdocs
    SSLEngine on
    SSLCertificateFile /etc/apache2/ssl/server.crt
    SSLCertificateKeyFile /etc/apache2/ssl/server.key
</VirtualHost>
```

### 24.7 在同一服务器运行多个Apache实例

可以启动多套独立apache2实例，监听不同IP/端口。每个实例拥有独立配置文件、日志目录。需要复制一套完整配置，使用`-f`参数指定不同配置文件启动httpd。

### 24.8 规避安全问题

1. **保持软件更新**：及时zypper更新apache2及模块，修补安全漏洞。
2. **DocumentRoot目录权限**：网站根目录，Web进程只需要读权限，**禁止写权限**，防止上传篡改文件。
3. **文件系统访问限制**：使用`<Directory>`配置段严格限定Apache能够访问的目录，不要给访问整个文件系统的权限。
4. **CGI脚本安全**：不信任的CGI脚本存在极大风险，严格校验输入，防止命令注入。
5. **用户目录（UserDir）**：用户家目录网页功能，谨慎开启，注意目录权限。

### 24.9 故障排查

- 语法检查：`apache2ctl configtest`
- 错误日志：`/var/log/apache2/error_log`
- 访问日志：`/var/log/apache2/access_log`
- 确认防火墙放行80/443端口。

### 24.10 更多信息

- `man apache2ctl`
- `man httpd.conf`
- Apache 2.4官方文档
- `/usr/share/doc/packages/apache2`本地文档

## 第25章 使用YaST搭建FTP服务器
**摘要**
本章介绍如何借助YaST配置vsftpd FTP服务器，涵盖服务启动、通用设置、性能参数、认证选项、专家高级设置，以及参考文档。openSUSE Leap默认采用vsftpd作为FTP服务后台程序。

> 说明：本章全部配置均基于`vsftpd`，是openSUSE推荐的安全FTP服务器实现。

### 启动FTP服务器
打开YaST → 网络服务 → FTP服务器。
首次打开模块时，如果系统尚未安装vsftpd软件包，YaST会提示自动安装。

进入模块之后，首先可以控制服务启停：
- **开机启动（Start‑Up）**：勾选则vsftpd开机自启；取消勾选代表仅手动运行。
- 点击「启动/停止」按钮，立即开启或者关闭FTP服务。

> 防火墙提示：FTP协议需要21端口。主动模式、被动模式还会用到额外端口范围。YaST可以选择自动在防火墙放行FTP相关端口。

### FTP通用设置（FTP general settings）
该页面配置基础访问行为。
1. **允许匿名访问（Anonymous access）**
    - 启用匿名：任何人无需本机用户账号即可登录FTP。匿名用户登录用户名一般为`ftp`。
    - 禁用匿名访问：只允许系统本地有效账号登录。
2. **匿名根目录（Anonymous root directory）**
    指定匿名用户登录之后所处的根目录，例如`/srv/ftp`。目录必须提前存在。匿名用户会被chroot禁锢在此目录，无法跳出。
3. **本地用户根目录（Local user chroot）**
    开启chroot禁锢本地系统用户，登录之后限制在自己家目录，禁止访问系统其他目录。
> ⚠️chroot安全注意：chroot根目录**不能属于该用户可写**，否则存在安全漏洞。家目录权限建议设置为755。
4. **允许上传（Allow upload）**
    全局开关，控制是否允许客户端上传文件。可以分别对匿名用户、本地用户独立开启上传权限。
5. **ASCII模式启用**
FTP支持二进制与ASCII传输模式。默认建议关闭ASCII模式，避免文本文件换行符自动转换带来文件损坏问题。

### FTP性能设置（FTP performance settings）
调整并发、带宽、被动模式端口范围，优化服务器负载。
1. **最大并发客户端数量（Maximum number of clients）**
服务器全局最大同时连接数。超出的客户端连接会被拒绝。
2. **每个IP最大并发连接（Maximum clients per IP address）**
限制同一个IP地址最多建立多少条FTP连接，防止单用户耗尽服务器连接资源。
3. **被动模式端口范围（Passive mode port range）**
定义被动模式使用的端口上下限，例如最小端口`20000`，最大端口`30000`。需要把该段端口在防火墙放行。
> 被动模式PASV是现代客户端、防火墙环境优先使用的工作模式。

### 认证（Authentication）
1. **本地系统账号（System users）**：使用`/etc/passwd`中的本机用户密码认证。
2. **虚拟用户（Virtual users）**：vsftpd独立虚拟账号，不需要在操作系统创建真实本地用户。虚拟用户账号信息存储在独立的数据库文件。
> 使用虚拟用户需要额外配置PAM模块。YaST模块可以辅助配置基础参数，复杂虚拟用户场景建议直接编辑`vsftpd.conf`。

### 专家设置（Expert settings）
高级调优选项，直接对应vsftpd配置参数。
- **空闲超时 Idle time**：客户端长时间没有操作，服务器自动断开会话的超时时间，单位分钟。
- **umask权限掩码**：上传新文件、新建目录的权限掩码。
  - 示例：`022`，新建文件权限644，目录755。匿名与本地用户可以分开设置umask。
- **欢迎消息 Welcome message**：客户端成功连接FTP服务器展示的提示文本。
- **日志选项 Logging**：开启FTP访问日志，日志默认输出到`/var/log/vsftpd.log`。
- **SSL/TLS加密设置**：开启FTPS（FTP over TLS）。指定证书文件与私钥路径，支持显式FTPS和隐式FTPS。
> 注意：普通FTP明文传输账号密码，强烈建议启用TLS加密。部分老旧客户端不支持FTPS。

完成全部配置，点击确定保存。YaST会写入`/etc/vsftpd.conf`，并且重载vsftpd服务。

### 更多信息
- `man vsftpd`：vsftpd手册
- `/etc/vsftpd.conf`：主配置文件，包含全部参数注释
- `/usr/share/doc/packages/vsftpd`：软件包附带文档

> 安全提醒：
> 1. 匿名开启上传存在高风险，除非业务刚需，不要开启匿名上传。
> 2. 尽量启用FTPS加密，避免账号密码明文在网络传输。
> 3. chroot目录权限必须严格管控，防止本地用户逃逸chroot环境。

---

## 第26章 Squid缓存代理服务器
**摘要**
Squid是高性能缓存代理服务器。可以充当Web代理，缓存HTTP/HTTPS/FTP访问内容；可以配置透明代理；实现访问控制策略过滤网页访问。本章介绍代理服务器基础概念、安全注意事项、多缓存、系统软硬件需求；启停管理；YaST图形模块；squid.conf配置；访问控制；透明代理；cachemgr.cgi缓存管理器；Calamaris报告生成工具。

### 代理服务器相关概念（Facts about proxy servers）
代理服务器处于客户端和外网Web服务器中间。客户端请求不直接访问互联网，全部发送给代理服务器。代理服务器代为请求资源，返回给客户端。同时会把资源缓存到本地磁盘。后续其他客户端请求相同资源，直接读取本地缓存，节省外网带宽，提升访问速度。

#### Squid和安全（Squid and security）
- Squid依靠访问控制列表ACL管控哪些客户端可以使用代理。**默认配置拒绝全部客户端访问**，安装完成后必须手动添加允许的内网网段，否则客户端无法使用代理。
- 不要把Squid直接暴露公网且开放任意访问，会被滥用成为开放转发代理，被用来做网络攻击。严格限制允许访问的源IP网段。

#### 多个缓存（Multiple caches）
Squid支持缓存层级部署：多台squid之间建立父子缓存关系。子缓存未命中，向上游父缓存请求资源。适合大型企业多分支机构网络。

#### 缓存互联网对象（Caching Internet objects）
Squid主要缓存HTTP、HTTPS、FTP对象。HTTPS CONNECT隧道模式不会缓存内容，只做转发。动态网页、带Cache‑Control: no‑cache标记的资源不会被缓存。

#### 系统需求（System requirements）
###### RAM内存
内存用于缓存热点对象、索引、访问列表。内存越大，热点对象越可以放在内存，性能越高。生产环境建议至少2GB以上内存。

###### CPU CPU
Squid大量做哈希计算、ACL规则匹配。高并发场景需要性能较好CPU。

###### 磁盘缓存大小（Size of the disk cache）
磁盘缓存目录存放缓存的网页资源。磁盘越大，可以缓存的对象越多。但磁盘缓存不是越大越好：缓存过大，索引查找开销上升，命中率反而下降。

###### 硬盘/SSD架构（Hard disk/SSD architecture）
- SSD固态硬盘：磁盘缓存放在SSD，IO性能会大幅提升。
- 机械硬盘：尽量使用多块独立磁盘分别存放缓存，分散IO压力，不要把缓存和系统根分区共用磁盘。

### 基础用法（Basic usage of Squid）
#### 启动Squid
```bash
sudo systemctl enable --now squid
```
Squid默认监听端口 **3128**。

#### 检查Squid是否正常工作
服务器本机测试代理：
```bash
curl -x http://127.0.0.1:3128 https://www.opensuse.org
```
返回网页内容代表代理工作正常。

#### 停止、重载、重启Squid
```bash
# 停止
sudo systemctl stop squid
# 重载配置，不中断已有连接
sudo systemctl reload squid
# 完全重启
sudo systemctl restart squid
```

#### 删除Squid
```bash
sudo zypper remove squid
```
> 卸载软件包不会自动删除缓存目录`/var/cache/squid`和配置文件`/etc/squid/squid.conf`，需要手动删除。

#### 本地DNS服务器（Local DNS server）
Squid需要DNS解析域名。Squid自带DNS解析客户端，也可以指向本地DNS服务器提升解析性能。

### YaST Squid模块（The YaST Squid module）
YaST → 网络服务 → Squid缓存代理服务器。
图形界面完成大部分配置：
1. 设置监听端口。
2. 配置磁盘缓存大小、缓存目录。
3. 配置访问控制ACL，允许/拒绝哪些内网网段使用代理。
4. 设置父代理服务器。
5. 配置透明代理模式。
保存设置后，YaST修改`/etc/squid/squid.conf`，重载squid服务。

### Squid配置文件（The Squid configuration file）
主配置文件路径：`/etc/squid/squid.conf`。配置项数量非常多，自带大量注释示例。

#### 通用配置选项（General configuration options）
- `http_port 3128`：代理监听端口。开启透明代理格式为`http_port 3128 intercept`。
- `cache_dir ufs /var/cache/squid 10000 16 256`
    - ufs：Squid默认缓存存储格式；
    - `/var/cache/squid`缓存目录；
    - `10000`磁盘缓存总大小，单位MB；
    - `16`一级子目录数量；
    - `256`二级子目录数量。
> 修改cache_dir之后，需要执行`squid -z`初始化缓存目录结构。

#### 访问控制选项（Options for access controls）
Squid访问控制流程：先定义acl，再用http_access做允许/拒绝。
ACL语法：
```
acl 名称 类型 匹配值
http_access allow|deny acl名称
```

示例：
```conf
acl localnet src 192.168.1.0/24
http_access allow localnet
http_access deny all
```
> 规则从上往下顺序匹配，匹配第一条规则即生效。一定要写`http_access deny all`作为最后兜底规则，拒绝所有未匹配的客户端。

#### 配置透明代理（Configuring a transparent proxy）
透明代理：客户端不需要浏览器手动配置代理，网关把HTTP流量重定向到Squid。Squid intercept模式接收重定向流量。
> 需要本机防火墙（firewalld/iptables）做流量DNAT重定向，仅支持HTTP，HTTPS无法做透明缓存。

#### 使用cachemgr.cgi缓存管理器CGI接口（Using the Squid cache manager CGI interface）
`cachemgr.cgi`是CGI脚本，通过Web页面查看Squid运行状态：缓存命中率、内存使用、对象统计。
需要Apache HTTP服务器运行该CGI程序，配置允许访问的客户端IP。访问地址：`http://服务器地址/cgi‑bin/cachemgr.cgi`。

#### 使用Calamaris生成缓存报告（Cache report generation with Calamaris）
Calamaris工具分析Squid访问日志`/var/log/squid/access.log`，生成统计报告：访问计数、热门站点、缓存命中率。

安装：
```bash
sudo zypper in calamaris
```
执行分析日志生成报告。

### 更多信息（More Information）
- `man squid.conf` 配置手册
- `man squid` 服务手册
- `/etc/squid/squid.conf`配置内自带大量注释样例
- Squid官方文档 https://www.squid‑cache.org

## 第27章 Linux下的移动计算
**摘要**
本章介绍笔记本电脑等移动设备相关主题：电源节能、在不断变化的运行环境中适配集成、软件选型、数据安全，以及移动硬件与移动终端（智能手机、平板）。

### 27.1 笔记本电脑
#### 电源节能
笔记本最重要的需求之一就是电池续航。openSUSE提供多种电源管理工具，用来降低硬件功耗、延长电池使用时间。
主要手段包含：CPU调频、屏幕亮度调节、闲置硬盘降速、蓝牙/Wi‑Fi按需关闭、挂起到内存（待机suspend‑to‑RAM）、挂起到磁盘（休眠hibernate suspend‑to‑disk）。

> 休眠（hibernate）要求系统拥有足够大小的swap交换分区/交换文件，用来保存完整内存内容。swap空间不足时休眠功能会直接失败。

图形桌面环境GNOME、KDE Plasma自带电源管理图形界面；命令行环境可以使用`powertop`分析功耗来源，识别耗电进程与硬件组件。
```bash
powertop
```
`powertop`可以显示设备的功耗统计，给出调优建议。

#### 在变化的运行环境中集成
笔记本经常在多种网络环境之间切换：家里Wi‑Fi、公司局域网、公共Wi‑Fi、手机USB共享网络。**NetworkManager是笔记本首选网络管理服务**，可以保存多套网络配置，一键切换。详见第28章。

硬件热插拔：外接显示器、USB鼠标、U盘、扩展坞。udev自动识别外接硬件，桌面环境自动弹出配置提示。
- 外接显示器：GNOME/KDE提供图形工具设置多屏；命令行使用`xrandr`。
- 扩展坞：部分笔记本插入扩展坞会自动切换网卡、显示输出。

#### 软件选项
移动设备常用软件：
- 网络：NetworkManager，nmcli/nmtui
- 电源管理：powertop、systemd‑sleep配置休眠/待机行为
- 同步工具：rsync、syncthing，用于在多设备同步个人数据
- VPN客户端：集成于NetworkManager，用于接入企业内网

#### 数据安全
笔记本丢失、被盗是高频风险。
1. **全盘加密LUKS**：安装系统时对根分区全盘加密。设备丢失之后，没有密码无法读取磁盘内部全部数据。
2. 重要数据定期备份，避免硬件损坏或丢失造成数据彻底丢失。
3. 屏幕自动锁屏，设置自动锁屏超时，离开设备自动锁定会话。
4. 谨慎使用公共Wi‑Fi，优先启用VPN保护传输流量。

#### 移动硬件
笔记本硬件存在大量特殊硬件：
- 可切换显卡（Optimus Intel/NVIDIA双显卡，参考第7章SUSE‑Prime）
- 特殊键盘热键、亮度调节、无线开关
- 电池传感器，读取电池剩余电量
> 部分老旧笔记本需要内核固件包，才能完整支持全部热键、电源事件。

#### 移动设备（智能手机与平板电脑）
Linux笔记本和手机平板之间的数据交互：
1. MTP协议：挂载安卓设备存储，拷贝文件。软件包`mtp‑tools`。
2. USB网络共享：手机USB tethering，NetworkManager识别为网络接口。
3. KDE Connect：跨设备工具，实现文件推送、通知同步、远程控制。
4. SSH/SFTP网络传输，通过局域网传输文件。

> iOS苹果设备MTP支持有限，需要特殊工具。

### 27.2 更多信息
- 第28章 NetworkManager
- 第29章 电源管理
- `man powertop`
- `man systemd‑sleep.conf`

---

## 第28章 使用NetworkManager
**摘要**
NetworkManager主要面向笔记本、移动设备，用于处理不断变化的网络环境。本章介绍适用场景、启用与禁用NetworkManager；配置有线、无线Wi‑Fi连接；把Wi‑Fi/蓝牙网卡作为无线接入点；VPN集成；网络安全；用户与系统连接配置；密码凭据存储；常见问题排查，更多参考信息。

### 28.1 使用场景
NetworkManager适合这类场景：
1. 笔记本电脑，频繁切换Wi‑Fi网络（家庭、办公、公共场所）。
2. 使用VPN，需要快速启用/禁用VPN隧道。
3. 使用USB手机共享网络、4G/5G调制解调器移动宽带。
4. 需要创建Wi‑Fi热点，把本机网卡作为AP接入点。

> 固定服务器机房，网络基本不变，推荐使用wicked而不是NetworkManager。同一台主机不要同时启用两套网络服务。

### 28.2 启用或禁用NetworkManager
全局开关配置文件 `/etc/sysconfig/network`
```ini
NETWORKMANAGER="yes"    # 启用NetworkManager
# NETWORKMANAGER="no"  # 禁用，使用wicked
```

修改之后，停止旧网络服务，启用NetworkManager：
```bash
sudo systemctl stop wicked
sudo systemctl enable --now NetworkManager
```

> 图形桌面GNOME、KDE Plasma默认使用NetworkManager。

### 28.3 配置网络连接
#### 管理有线网络连接
有线以太网：插上网线，NetworkManager自动创建连接配置。
命令行工具`nmcli`，文本交互工具`nmtui`。

查看所有连接配置：
```bash
nmcli connection show
```

创建静态IP有线连接示例：
```bash
nmcli connection add type ethernet con‑name "Static‑LAN" ifname eth0 ipv4.method manual ipv4.addresses 192.168.1.100/24 ipv4.gateway 192.168.1.1 ipv4.dns "192.168.1.1,8.8.8.8"
```

启用指定连接：
```bash
nmcli connection up "Static‑LAN"
```

#### 管理无线网络连接（Wi‑Fi）
列出附近可用Wi‑Fi：
```bash
nmcli device wifi list
```

连接WPA2/WPA3受保护Wi‑Fi：
```bash
nmcli device wifi connect "SSID名称" password="Wi‑Fi密码"
```

连接成功后配置会自动保存，下次开机自动重连该无线网络。

#### 将Wi‑Fi/蓝牙网卡配置为访问点（AP热点）
可以把本机无线网卡配置成Wi‑Fi热点，其他手机、笔记本连接本机上网。
> 硬件要求：无线网卡必须支持AP模式。部分廉价网卡硬件不支持。

使用nmcli创建热点：
```bash
nmcli connection add type wifi con‑name "My‑Hotspot" ifname wlan0 wifi.mode ap wifi.ssid "MyOpenSuseAP" wifi‑security.key‑mgmt wpa‑psk wifi‑security.psk "热点密码" ipv4.method shared
```
`ipv4.method shared`开启NAT共享互联网。启动连接：
```bash
nmcli connection up "My‑Hotspot"
```

#### NetworkManager与VPN
NetworkManager支持管理多种VPN类型：WireGuard、OpenVPN、IPsec。
需要安装对应VPN插件软件包，例如`NetworkManager‑openvpn`。
可以导入VPN配置文件，一键启用、断开VPN隧道，保存VPN密码凭据。

### 28.4 NetworkManager与安全
#### 用户连接与系统连接
- **用户连接（User connections）**：保存在当前登录用户家目录，只有该用户可见，用户断开会话连接随之消失。图形界面默认创建用户连接。
- **系统连接（System connections）**：存放在`/etc/NetworkManager/system‑connections/`，需要root权限编辑，系统开机就可以激活，不依赖用户登录。适合开机自动启用的Wi‑Fi、VPN。

> 将用户连接转为系统连接：
```bash
nmcli connection modify 连接名 connection.permissions ""
```

#### 存储密码与凭据
NetworkManager密码凭据存储后端：
1. GNOME环境使用`gnome‑keyring`密码环；
2. KDE环境使用`kwallet`；
3. 无图形环境，可配置把密码明文保存在系统连接配置文件。

> 系统连接配置文件内如果保存明文密码，文件权限会设置为`‑rw‑‑‑‑‑‑‑‑ (600)`，只有root可读。普通用户无法读取密码。

### 28.5 常见问题排查
查看NetworkManager服务状态：
```bash
systemctl status NetworkManager
```

查看日志：
```bash
journalctl -u NetworkManager
```

查看设备状态：
```bash
nmcli device status
```

> 故障排查小提示：
1. Wi‑Fi识别不到网络：确认无线内核固件已安装；检查硬件无线开关。
2. 连接保存但是无法自动重连：检查连接配置的`autoconnect`自动连接开关。
3. 切换网络DNS不更新：检查是否使用systemd‑resolved。

### 28.6 更多信息
```bash
man nmcli
man nmtui
man NetworkManager
```
配置文件参考：`/etc/NetworkManager/conf.d/*.conf`

## 第29章 电源管理
**摘要**
本章介绍openSUSE的各项省电功能，讲解高级配置与电源接口ACPI；CPU性能管控；硬盘休眠；故障排查。同时说明常见故障：CPU调频不生效、硬盘相关问题。

### 29.1 省电功能
系统提供多种电源节能机制，适用于笔记本与部分低功耗台式设备：
1. **CPU频率缩放（调频）**：根据负载动态调整CPU工作频率，空闲时降低频率减少耗电；负载升高自动提升频率保证性能。
2. **屏幕亮度控制**：降低显示器背光亮度，显著节约电池电量。图形桌面提供亮度滑块；命令行可操作`/sys/class/backlight/`调节。
3. **硬盘待机休眠**：硬盘空闲一段时间后磁头归位，磁盘电机降速，降低功耗。
4. **设备电源管理**：闲置的USB、蓝牙、Wi‑Fi设备可进入低功耗状态。
5. **挂起到内存（S3，待机/Suspend‑to‑RAM）**：系统状态保存到内存，整机进入低功耗；内存保持供电。唤醒后快速恢复会话。
6. **挂起到磁盘（S4，休眠Hibernate / Suspend‑to‑disk）**：把全部内存内容写入swap交换空间，整机完全断电。开机从swap恢复之前会话。
> ⚠️休眠功能要求swap分区/swap文件大小至少大于本机物理内存，swap不足休眠直接失败。LUKS加密磁盘场景swap也需要加密。

systemd负责管控待机、休眠行为，配置文件`/etc/systemd/sleep.conf`，可以启用/禁用待机、休眠，设置休眠后行为。

图形桌面GNOME/KDE Plasma提供图形电源管理面板：设置电池阈值、自动挂起、屏幕自动熄灭、盖子合上动作。

命令行下可使用`powertop`工具分析整机功耗，找出耗电进程、硬件设备，给出调优建议：
```bash
sudo powertop
```

### 29.2 高级配置和电源接口（ACPI）
ACPI（Advanced Configuration and Power Interface，高级配置与电源接口）是主板固件与操作系统交互电源管理的标准接口。操作系统通过ACPI读取电池状态、处理笔记本盖子开关、热键、温度传感器，执行待机休眠。

> 少数老旧或者兼容性差的笔记本BIOS/UEFI存在ACPI bug，会造成：休眠失败、电池读数错误、热键无效、随机死机。这类故障可以尝试内核启动参数`acpi=`做兼容调试。

#### CPU性能管控
现代Linux使用`cpufreq`子系统管控CPU频率。openSUSE根据固件支持情况自动选用对应的调控驱动：
- `intel_pstate`：Intel处理器默认驱动
- `amd_pstate`：AMD新一代处理器
- `acpi‑cpufreq`：通用ACPI调频驱动

调控策略（governor）：
1. **performance**：CPU始终运行最高频率，追求性能，耗电高。
2. **ondemand**：负载升高瞬间拉升到高频；负载下降降频。传统策略。
3. **powersave**：尽量维持最低频率，最大限度省电。
4. **schedutil**：现代推荐，调度器驱动调频，兼顾性能与功耗，openSUSE默认策略。

查看当前CPU调频驱动与调控策略：
```bash
cpufreq-info
```
或者查看sysfs接口：
```bash
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
```

> 注意：部分现代CPU（Intel/AMD）硬件固件控制频率，内核cpufreq调控有限，由硬件固件自主管理功耗。

#### 故障排查
1. 部分笔记本盖子合上动作异常：不会待机，或者反复唤醒。检查`/etc/systemd/logind.conf`中`HandleLidSwitch`相关配置。
2. 待机后无法唤醒：多属于ACPI固件兼容问题，可以尝试修改内核启动参数。

### 29.3 硬盘休眠
可以设置机械硬盘空闲一段时间之后停止旋转，降低功耗。
> ⚠️固态硬盘SSD不建议使用硬盘休眠功能，频繁启停会损耗SSD寿命，该功能仅针对机械HDD。

工具`hdparm`设置硬盘空闲超时。示例，设置空闲10分钟后硬盘待机：
```bash
sudo hdparm -S 120 /dev/sda
```
该设置重启会丢失。如需永久配置，编辑`/etc/sysconfig/hdparm`。

> 部分笔记本硬盘忽略hdparm设置，由硬盘自身固件管控电源。

### 29.4 故障排查
#### CPU频率不会变化
现象：CPU一直跑最高频率，不会降频；或者一直锁在低频无法升频。
排查步骤：
1. 确认内核加载对应cpufreq驱动：`intel_pstate` / `amd_pstate`。
2. 查看当前调控governor策略，是否设置为`performance`。
3. 检查BIOS/UEFI是否设置为性能模式，部分笔记本BIOS会强制锁死CPU频率。
4. 检查系统是否有进程持续占用CPU，高负载会维持高频。
5. 部分虚拟机环境CPU调频功能不可用，属于虚拟机正常限制。

#### 硬盘相关故障
1. 机械硬盘频繁启停：`hdparm -S`超时时间设置太短，调大超时数值。
2. SSD执行hdparm休眠无效果：SSD不支持旋转待机，属于正常现象。
3. 休眠失败：优先检查swap大小是否大于物理内存；加密环境确认swap已经加密；查看`journalctl -u systemd-sleep`休眠相关日志定位报错。

### 29.5 更多信息
```bash
man systemd‑sleep.conf
man hdparm
man powertop
man cpufreq‑info
```
内核文档：`/usr/share/doc/packages/kernel‑doc`
