# 发行说明
openSUSE Leap是一款免费的基于Linux的操作系统，适用于您的PC、笔记本电脑或服务器。你可以上网，管理电子邮件和照片，做办公室工作，播放视频或音乐，玩得开心！
出版日期：2024年6月10日，版本：15.6.20240610.a9f19f4

[[toc]]

这是即将推出的openSUSE Leap 15.6的发布说明的初始版本。
如果您从旧版本升级到此openSUSE Leap版本，请参阅此处列出的先前发布说明：https://en.opensuse.org/openSUSE:Release_Notes。
这个公开测试版测试是openSUSE项目的一部分。有关该项目的信息可在https://www.opensuse.org上找到。
报告您在openSUSE Bugzilla中使用openSUSE Leap 15.6的预发行版时遇到的所有错误。有关更多信息，请参阅https://en.opensuse.org/Submitting_Bug_Reports。如果您想看到发布说明中添加的任何内容，请针对组件“发布说明”提交错误报告。

# 1 安装
本部分包含与安装相关的注意事项。有关详细的安装说明，请参阅文档https://doc.opensuse.org/documentation/leap/startup/html/book-startup/part-basics.html。

## 1.1 将原子更新与系统角色事务服务器 一起使用
安装程序支持系统角色事务服务器。此系统角色具有一个更新系统，该系统可以原子地应用更新（作为单个操作），并在必要时轻松恢复更新。这些功能基于所有其他SUSE和openSUSE发行版也依赖的软件包管理工具。这意味着与openSUSE Leap 15.6的其他系统角色配合使用的绝大多数RPM软件包也与系统角色Transactional Server配合使用。

注意：不兼容的软件包
一些软件包在其RPM %post脚本中修改/var或/srv的内容。这些软件包不兼容。如果您发现这样的软件包，请提交错误报告。
为了提供这些功能，这个更新系统依赖于：

-Btrfs快照。在开始系统更新之前，会创建根文件系统的新Btrfs快照。然后，更新的所有更改都安装到该Btrfs快照中。要完成更新，您可以重新启动系统进入新的快照。 要恢复更新，只需从上一个快照启动即可。 
-只读根文件系统。为了避免因更新而出现问题和数据丢失，根文件系统不得以其他方式写入。因此，根文件系统在正常运行期间被挂载为只读。 为了使此设置正常工作，需要对文件系统进行两个额外的更改：为了允许在/etc中写入用户配置，此目录自动配置为使用OverlayFS。/var现在是一个单独的子卷，可以由进程写入。 
重要信息：事务服务器需要至少 12 GB 的磁盘空间
系统角色事务服务器需要至少12 GB的磁盘大小才能容纳Btrfs快照。

重要信息：YaST 不工作交易模式
目前，YaST不适用于交易更新。这是因为YaST会立即执行操作，并且因为它无法编辑只读文件系统。
要处理事务性更新，请始终使用transactional-update命令，而不是YaST和Zypper进行所有软件管理：

-更新系统：transactional-update up  
-安装软件包：transactional-update pkg in PACKAGE_NAME  
-移除包裹：transactional-update pkg rm PACKAGE_NAME  
-要恢复上一个快照，即对根文件系统的最后一组更改，请确保您的系统启动到下一个快照并运行：transactional-update rollback  （可选）在命令末尾添加快照 ID，以回滚到特定 ID。 
使用此系统角色时，默认情况下，系统将在凌晨03:30至05:00之间执行每日更新和重启。这两个操作都基于systemd，如有必要，可以使用systemctl禁用：
systemctl禁用--现在transactional-update.timer rebootmgr.service
有关交易更新的更多信息，请参阅openSUSE Kubic博客文章https://kubic.opensuse.org/blog/2018-04-04-transactionalupdates/和https://kubic.opensuse.org/blog/2018-04-20-transactionalupdates2/。

## 1.2 安装在容量小于12GB的硬盘上
只有当可用硬盘大小大于12 GB时，安装程序才会建议分区方案。例如，如果您想设置非常小的虚拟机映像，请使用引导式分区器手动调整分区参数。

## 1.3 UEFI—统一可扩展固件接口
在使用UEFI（统一可扩展固件接口）启动的系统上安装openSUSE之前，紧急建议您检查硬件供应商建议的任何固件更新，如果有的话，安装此类更新。预安装Windows 8或更高版本有力地表明您的系统使用UEFI启动。
背景：一些UEFI固件存在错误，如果将太多数据写入UEFI存储区域，会导致错误。然而，没有明确的数据表明多少是“太多”。
openSUSE通过不写入超过启动操作系统所需的最低限度来最大限度地降低风险。最小值意味着告诉UEFI固件关于openSUSE引导加载程序的位置。默认情况下，使用UEFI存储区域存储启动和崩溃信息（pstore）的上游Linux内核功能已被禁用。尽管如此，建议安装硬件供应商建议的任何固件更新。
1.4 UEFI、GPT和MS-DOS分区
与EFI/UEFI规范一起，一种新的分区风格到来：GPT（GUID分区表）。这个新模式使用全局唯一标识符（以32个十六进制数字显示的128位值）来识别设备和分区类型。
此外，UEFI规范还允许传统MBR（MS-DOS）分区。Linux引导加载程序（ELILO或GRUB 2）尝试为这些遗留分区自动生成GUID，并将其写入固件。这样的GUID可能会经常更改，导致固件重写。重写包括两个不同的操作：删除旧条目和创建替换第一个条目的新条目。
现代固件有一个垃圾收集器，可以收集已删除的条目，并释放为旧条目保留的内存。当有缺陷的固件没有收集和释放这些条目时，就会出现问题。这可能会导致系统无法启动。
要解决此问题，请将旧版 MBR 分区转换为 GPT。

# 2 系统升级
本节列出了与升级系统相关的注意事项。有关受支持的场景和详细的升级说明，请参阅以下文档：
-https://en.opensuse.org/SDB：系统升级  
-https://doc.opensuse.org/documentation/leap/startup/html/book-startup/cha-update-osuse.html  
请务必查看本文档的以下部分：
-第3节，“包装变更”  
-第7.1节，“4096位RSA RPM和存储库签名密钥的使用”  
# 3 包装变更
## 3.1 更新后的软件包#中的重要更改
软件包python-podman现在基于项目podman-py是python-podman。

## 3.2 弃用的软件包
弃用的软件包仍然作为分发的一部分发货，但计划在下一个版本的openSUSE Leap中删除。这些软件包的存在是为了帮助迁移，但不鼓励使用它们，并且它们可能无法接收更新。
要检查已安装的软件包是否不再维护，请确保生命周期-数据-开放SUSE软件包已安装，然后使用以下命令：
zypper生命周期

## 3.3 已移除的包裹
移除的包裹不再作为分发的一部分发货。
以下软件包都被NVIDIA SUSE Prime取代了。另见第4.1节“大黄蜂包的去化” 
 - bbswitch
 - bumblebee
 - bumblebee-status
 - primus 
以下python软件包都已从openSUSE Leap 15.6中删除，因为它们未维护，不再是openSUSE Factory的一部分。
 - python-pytest-faulthandler  
 - python-pytest-flake8dir  
 - python-pytest-ordering  
 - python-pytest-  
 - pythonpath  
 - python-pytest-random-order  
 - python-pytest-repeat  
 - python-pytest-reqs  
 - python-pytest-travis-fold  
 - python-IMDbPY  
 - python-Keras-Applications  
 - python-Ming  
 - python-PasteScript  
 - python-PyPrint  
 - python-Pykka  
 - python-Qt.py  
 - python-Quandl  
 - python-Theano  
 - python-abclient  
 - python-jupyter-nbutils  
 - python-jupyter_calysto  
 - python-jupyter_contrib_core  
 - python-jupyter_full_width  
 - python-jupyter_highlight_selected_word  
 - python-jupyter_imatlab_kernel  
 - python-jupyter_jgraph  
 - python-jupyter_jupyterlab_launcher  
 - python-jupyter_latex_envs  
 - python-jupyter_nbpresent  
 - python-jupyter_nbsmoke  
 - python-jupyter_sphinx  
 - python-jupyter_themer  
 - python-jupyter_vega  
 - python-jupyter_watermark  
 - python-nbindex-jupyter  
 - python-dephell-archive  
 - python-dephell-argparse  
 - python-dephell-discover  
 - python-dephell-licenses  
 - python-dephell-links  
 - python-dephell-setuptools  
 - python-dephell-shells  
 - python-demjson  
 - python-discover  
 - python-django-babel  
 - python-djvulibre  
 - python-dnsdiag  
 - python-efilter  
 - python-enum-compat  
 - python-featureflow  
 - python-flake8-future-import  
 - python-flask-peewee  
 - python-flask-restplus  
 - python-pep517  
 - python-piston-mini-client  
 - python-pomegranate  
 - python-proboscis  
 - python-pyIOSXR  
 - python-pyblake2  
 - python-pyfg  
 - python-pygeos  
 - python-pympv  
 - python-python-fileinspector  
 - python-python-jsonrpc-server  
 - python-socketIO-client-nexus  
 - python-sphinxcontrib-actdiag  
 - python-spyder-line-profiler  
 - python-spyder-memory-profiler  
 - python-spyder-unittest  
 - python-sqlsoup  
 - python-test-server  
 - python-img2pdf  
 - python-jenkins-job-builder  
 - python-jgraph  
 - python-jsonextended  
 - python-jsonlib-python3  
 - python-jsonpath-rw-ext  
 - python-jupytext  
 - python-keepalive  
 - python-keyczar  
 - python-language-check  
 - python-logilab-astng  
 - python-lws  
 - python-lzmaffi  
 - python-missingno  
 - python-mockldap  
 - python-moksha-common  
 - python-moviepy  
 - python-murano-pkg-check  
 - python-uncompyle6  
 - python-whois_similarity_distance  
 - python-nose-cover3  
 - python-nose-random  
 - python-openstack.nose_plugin  
 - python-nagiosplugin  
 - python-nbsphinx-link  
 - python-os-api-ref  
 - python-oslo.db  
 - python-pampy  
 - python-pass_  
 - python_keyring  
 - python-pdfkit  
 - python-qgrid  
 - python-raet  
 - python-ravello-sdk  
 - python-requests-html  
 - python-ruamel.yaml.cmd  
 - python-rustcfg  
 - python-serpy  
 - python-shouldbe  
 - python-sigal  
 - python-slumber  
 - python-torch  
 - python-tox-travis  
 - python-trello  
 - python-twodict 
# 4 驱动程序和硬件
## 4.1 删除大黄蜂包
作为X11:Bumblebee项目的一部分维护的软件包被NVIDIA SUSE Prime继承。大黄蜂包将不再是标准分发的一部分。在删除功能请求跟踪器中查看详细信息。

## 4.2 安全启动：第三方驱动程序需要正确签名
Starting with openSUSE Leap 15.2, kernel module signature check for third-party drivers ( CONFIG_MODULE_SIG=y) is now enabled. This is an important security measure to avoid untrusted code running in the kernel. 
如果启用了UEFI安全启动，这可能会阻止第三方内核模块的加载。来自官方openSUSE存储库的内核模块包（KMP）不受影响，因为它们包含的模块是用openSUSE密钥签名的。签名检查具有以下行为：
-未签名或使用已知不受信任或无法针对系统可信密钥数据库验证的密钥签名的内核模块将被阻止。 
可以生成自定义证书，将其注册到系统的机器所有者密钥（MOK）数据库中，并使用此证书的密钥签署本地编译的内核模块。以这种方式签名的模块既不会被阻止，也不会引起警告。参见https://en.opensuse.org/openSUSE:UEFI。
由于这也会影响NVIDIA图形驱动程序，我们在openSUSE的官方软件包中解决了这个问题。但是，您需要在安装后手动注册新的MOK密钥，以使新软件包工作。有关如何安装驱动程序和注册MOK密钥的说明，请参阅https://en.opensuse.org/SDB:NVIDIA_drivers#Secureboot。

## 4.3 网络安装映像在Raspberry Pi 4上启动时挂起
Booting the network install image from USB stick on Raspberry Pi 4 hangs on boot. To resolve this issue, add the console=tty boot parameter. See details in the known issues section of our Raspberry Pi 4 Hardware Compatibility List. 

# 5 桌面
本节列出了openSUSE Leap 15.6中的桌面问题和更改。

## 5.1 KDE 4和Qt 4移除
KDE 4软件包将不是openSUSE Leap 15.4的一部分。请将您的系统更新到Plasma 5和Qt 5。出于兼容性原因，一些Qt 4软件包可能仍然存在。https://bugzilla.opensuse.org/show_bug.cgi?id=1179613。

## 5.2 Nvidia Turing和Ampere GPU/openGPU推荐停用了nouveau
对于英伟达图灵和安培GPU来说，nouveau驱动程序仍然被认为是实验性的。因此，在具有这些GPU的系统上，它已被默认禁用。
我们建议使用Nvidia的新openGPU驱动程序，而不是使用nouveau驱动程序。通过安装以下软件包来安装此驱动程序：
-nvidia-open-driver-G06-signed-kmp-default  
-kernel-firmware-nvidia-gsp-G06  
然后取消评论 /etc/modprobe.d/50-nvidia-default.conf文件中的options nvidia，以便之后看起来像以下内容：
###启用对*所有*图灵/安培GPU的支持：阿尔法质量！选项nvidia NVreg_OpenRmEnableUnsupportedGpus=1
如果您更喜欢使用nouveau驱动程序，请将 nouveau.force_probe=1添加到内核启动参数中，并且不要安装上述openGPU软件包。

## 5.3 在KDE等离子体下自动启动ibus#
ibus在KDE等离子体下不会自动启动。可以通过在自动启动部分添加适当的命令来解决这个问题。要做到这一点，请转到系统设置、启动和关机、自动启动，然后单击“添加...”按钮，然后单击“添加应用程序...”。在打开的对话框窗口中，在文本框中输入ibus-daemon -x，然后单击确定。有关更多信息，请参阅https://bugzilla.suse.com/show_bug.cgi?id=1211977。

# 6 一般

## 6.1 iotop支持#
iotop不显示SWAPIN和IO %的值。
Since Linux kernel 5.14, either kernel boot parameter delayacct needs to be specified or kernel.task_delayacct sysctl needs to be enabled. 

# 7 安全
本节列出了openSUSE Leap 15.6中安全功能的更改。

## 7.1 4096位RSA RPM和存储库签名密钥的使用
我们将openSUSE Leap 15.5的RPM和存储库签名密钥从2048位RSA切换到4096位RSA密钥。此密钥之前在维护更新中向openSUSE Leap 15.4用户介绍。从旧版本升级的用户需要按照https://en.opensuse.org/SDB:System_upgrade#0中所述手动导入新密钥。_新_4096_位_RSA_签名_密钥。

## 7.2 默认情况下，驾驶舱根登录被禁用#
驾驶舱是openSUSE Leap 15.6的新一部分。然而，与sshd类似，root的基于密码的登录默认被禁用。用户需要手动编辑/etc/cockpit/disallowed-users，并重新启动cockpit.socket如https://news.opensuse.org/2024/04/29/try-cockpit-in-leap-rc/中所述，以允许根登录。

# 8 更多信息和反馈
 - 阅读媒体上的README文档。 
 - 查看其 RPM 中有关特定软件包的详细更改日志信息： rpm --changelog -qp 文件名.rpm  将FILENAME替换为RPM的名称。 
 - 检查介质顶层的ChangeLog文件，以获取对更新软件包所做的所有更改的时间顺序日志。 
 - 在媒体的docu目录中查找更多信息。 
 - 有关更多或更新的文档，请参阅https://doc.opensuse.org/。 
 - 有关openSUSE的最新产品新闻，请访问https://www.opensuse.org。