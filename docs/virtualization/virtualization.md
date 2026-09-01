# 虚拟化指南

[[toc]]

## 摘要

本手册整体介绍虚拟化技术，介绍统一虚拟化管理接口libvirt，并针对不同虚拟机管理程序给出详细使用说明。

# 第一部分 简介

## 第1章 虚拟化技术

> 
> 摘要
> 虚拟化是一种技术，允许一台物理机器（宿主机Host）之上运行其他操作系统（客户虚拟机）。

### 概述

openSUSE Leap集成了最新开源虚拟化技术Xen与KVM。借助虚拟机管理程序，可以在单台物理硬件上部署、销毁、安装、监控、管理多台虚拟机（客户虚拟机）。
openSUSE Leap既可以运行经过深度调优修改的半虚拟化操作系统，也可以运行无需修改的全虚拟化操作系统。

实现虚拟化的核心组件是**虚拟机管理程序（Hypervisor）**，直接运行在服务器硬件之上。它管控平台硬件资源，向每一台客户机输出虚拟硬件接口，实现资源在多虚拟机之间共享。

openSUSE提供两种虚拟机管理程序：Xen、KVM。
搭载Xen或者KVM的openSUSE Leap作为**虚拟化宿主机(VHS)**，承载运行客户操作系统。
SUSE虚拟机架构：由虚拟机管理程序 + 管理组件共同构成虚拟化宿主机，上面运行大量业务客户虚拟机。

- Xen环境中，管理组件运行在特权虚拟机Dom0。
- KVM环境，Linux内核本身就是虚拟机管理程序，管理组件直接运行在宿主机系统。

### 虚拟化带来的收益

虚拟化在提供和物理服务器同等业务能力的同时，带来诸多优势：

1. **降低基础设施成本**
   - 更少硬件：单台宿主机运行多套操作系统，硬件维护工作量下降。
   - 降低电力与散热开销：硬件数量减少，无需投入更多供电、后备电源、制冷设备。
   - 节省机房空间：服务器数量少于业务实例数量，节约机房机柜空间。
   - 运维简化：虚拟机模式简化整套基础设施管理。
2. **敏捷高效**：支持迁移、热迁移、快照；业务停机时间缩短，可以无中断将业务迁移到其他硬件。

### 虚拟化模式

客户操作系统运行虚拟机分为**全虚拟化(FV)**、**半虚拟化(PV)**，两种模式各有优劣。

- **全虚拟化FV**：可以直接运行未经修改操作系统，例如Windows Server 2003。可以使用二进制翻译，或者AMD‑V / Intel‑VT硬件辅助虚拟化。硬件辅助虚拟化可以大幅提升处理器性能。
- **半虚拟化PV**：客户操作系统一般需要针对虚拟化环境修改。性能优于全虚拟化。openSUSE Leap属于可以运行在半虚拟化模式下的操作系统。

### I/O虚拟化

虚拟机除了共享宿主机CPU、内存，同时共享I/O子系统。软件I/O虚拟化性能弱于裸金属硬件，因此诞生多种硬件方案实现接近原生硬件性能。openSUSE Leap支持下面I/O虚拟化技术：

1. **全虚拟化FV/HVM**
全虚拟化模拟通用硬件设备，客户机直接使用自带驱动。宿主机真实硬件与模拟硬件不一致，所有I/O操作都要经过虚拟机管理程序处理，穿过两层软件层。I/O性能损耗大，消耗大量CPU资源。
2. **半虚拟化PV**
虚拟机管理程序和客户机直接通信，开销小，性能优于全虚拟化。要求客户操作系统适配半虚拟化API或者安装半虚拟化驱动。
3. **PVHVM**
在HVM全虚拟化基础上，加载半虚拟化驱动、半虚拟化中断与定时器处理。
4. **VFIO（虚拟功能I/O）**
Linux新一代用户态驱动框架，替代传统KVM PCI透传。在IOMMU内存保护的安全环境下，向用户空间提供硬件直接访问。虚拟机可以直接访问宿主机硬件设备，规避模拟带来性能损失。**设备同一时间只能分配给一台虚拟机，不能共享**。
VFIO需要CPU、芯片组、BIOS/EFI支持。
对比传统PCI透传优势：

- 兼容UEFI安全启动
- 设备隔离，内存访问受保护
- 用户态驱动，设备归属管理更加灵活
- 不绑定KVM，不局限x86架构> 
> openSUSE Leap中传统USB、PCI透传已经标记废弃，推荐使用VFIO。

5. **SR‑IOV 单根I/O虚拟化**
结合高性能与设备多实例共享。需要专用硬件，硬件可以拆分资源，对外呈现多个独立虚拟设备。每个虚拟VF设备分配给一台虚拟机使用。以网卡为例，可用队列数量存在上限，部分场景性能不如纯半虚拟化驱动。宿主机硬件、BIOS、虚拟机管理程序都需要支持SR‑IOV。

> 
> VFIO与SR‑IOV前置条件

1. BIOS/EFI开启IOMMU；
2. Intel CPU内核参数添加`intel_iommu=on`；
3. 加载内核模块`vfio_pci`。

## 第2章 虚拟化应用场景

虚拟化给企业带来很多能力：硬件利用率提升、遗留软件兼容、操作系统隔离、热迁移、灾难恢复、负载均衡。

### 服务器整合

多台老旧物理服务器整合到一台高性能物理服务器；物理操作系统转为虚拟机，老旧软件可以跑在新硬件上。

- 提升资源利用率，服务器负载不再长期偏低；
- 减少机房机位；
- 同一服务器承载多业务负载；
- 简化数据中心架构；
- 业务迁移简单，无需停机；
- 虚拟机部署速度快；
- 单宿主机运行多套客户操作系统。

> 
> ⚠重要提醒：服务器整合注意事项

1. 谨慎规划维护窗口；
2. 存储至关重要，必须支持迁移、磁盘容量增长；
3. 确认物理服务器可以承载新增业务负载。

### 隔离性

各个虚拟机客户操作系统完全隔离。一台虚拟机故障，不会影响宿主机和其他虚拟机，虚拟机之间默认不共享任何数据。

- 虚拟机支持UEFI安全启动；
- 建议关闭KSM内存合并；
- CPU核心可以绑定分配给虚拟机；
- 建议关闭超线程HT规避安全风险；
- 虚拟机不要共享网络、存储硬件；
- PCI透传、NUMA特性会削弱热迁移兼容性；
- 使用virtio半虚拟化驱动，提升虚拟机性能。
AMD平台具备虚拟化安全增强特性。

### 灾难恢复

虚拟机可以制作快照，可以恢复到某个完好时间点。虚拟机操作系统对硬件依赖低，只要虚拟机管理程序版本一致，快照可以恢复到不同物理服务器硬件。

### 动态负载均衡

热迁移可以按需把虚拟机从负载高的宿主机迁移到空闲宿主机，实现业务负载均衡。

## 第3章 Xen虚拟化简介

本章讲解搭建管理Xen虚拟化环境需要理解的组件与技术。

### 基础组件

Xen虚拟化环境主要组成：

1. Xen虚拟机管理程序
2. Dom0特权虚拟机
3. 若干普通客户虚拟机DomU
4. 虚拟化管理工具、命令、配置文件

整套运行这些组件的物理机器称为**虚拟化宿主机VM Host Server**。

**Xen虚拟机管理程序**：开源软件，协调虚拟机和物理硬件底层交互，也叫虚拟机监视器。

**Dom0（控制域）**：特权管理虚拟机，运行openSUSE Leap，提供图形和命令行两套管理环境。

- xl工具栈，基于libxl库，用来管理Xen客户域；
- QEMU，模拟完整计算机硬件（处理器、外设），支持全虚拟化与半虚拟化客户机。

**Xen客户虚拟机DomU**

- 至少一块虚拟磁盘，存放可引导操作系统；虚拟磁盘后端可以是文件、分区、逻辑卷或者其他块设备；
- 每台客户域拥有一份配置文本文件，语法参考`man 5 xl.conf`；
- 多张网卡，连接Dom0提供虚拟网络；
- 配套管理工具、命令、配置文件。

**管理工具**：图形工具、命令行工具、配置文件共同完成虚拟化环境自定义与管理。

### Xen虚拟化架构

图示：左侧Dom0宿主机运行openSUSE Leap；中间两台半虚拟化客户机；右侧一台全虚拟化虚拟机运行未修改Windows系统。

## 第4章 KVM虚拟化简介

### 基础组件

KVM是面向硬件辅助虚拟化架构的全虚拟化解决方案。
虚拟机、虚拟存储、虚拟网络，可以直接使用QEMU工具，也可以使用libvirt工具栈。

- QEMU工具集：`qemu‑system‑ARCH`、QEMU监控台、`qemu‑img`；
- libvirt工具栈：libvirt库、virsh、virt‑manager、virt‑install、virt‑viewer。

### KVM虚拟化架构

两大核心组件：

1. 内核模块（`kvm.ko`、`kvm‑intel.ko`、`kvm‑amd.ko`），提供虚拟化底层基础设施、处理器专属驱动；
2. 用户态程序`qemu‑system‑ARCH`，模拟虚拟硬件，提供虚拟机管控能力。

> 
> KVM狭义指内核虚拟化功能；日常口语KVM经常包含用户态QEMU组件。

## 第5章 虚拟化工具

libvirt是一套库，提供统一API管理KVM、Xen等虚拟化方案。它对不同虚拟机管理程序做抽象，为上层管理工具提供稳定跨虚拟机管理程序接口。同时提供虚拟网络、存储管理API。每一台虚拟机配置保存为XML文件。

libvirt支持远程管理虚拟机，支持TLS加密、x509证书、SASL身份认证。可以从一台工作站集中管理多台虚拟化宿主机。**官方推荐全部虚拟机管理都使用libvirt工具链。**

### 虚拟化控制台工具

1. **virsh（软件包libvirt‑client）**
命令行管理虚拟机，能力等价图形界面虚拟机管理器。可以修改虚拟机状态、新建虚拟机、配置硬件、编辑配置，适合脚本自动化。
调用格式：
`virsh [-c URI] COMMAND DOMAIN‑ID [OPTIONS]`

不带命令参数直接运行virsh，会进入交互式shell，适合连续执行多条命令。

```
~> virsh -c qemu+ssh://wilber@mercury.example.com/system
Enter passphrase for key '/home/wilber/.ssh/id_rsa':
Welcome to virsh, the virtualization interactive terminal.

Type:  'help' for help with commands
       'quit' to quit

virsh # hostname
mercury.example.com
```

2. **virt‑install（软件包virt‑install）**
基于libvirt创建新虚拟机的命令行工具，支持VNC/SPICE图形安装。参数配置可以实现无人值守自动化部署，是virt‑manager底层调用的安装工具。
3. **remote‑viewer（软件包virt‑viewer）**
简易远程桌面查看器，支持SPICE、VNC协议。
4. **virt‑clone（软件包virt‑install）**
克隆已有虚拟机镜像工具。
5. **virt‑host‑validate（libvirt‑client）**
校验宿主机环境是否满足libvirt运行条件。

### 虚拟化图形界面工具

1. **Virtual Machine Manager（virt‑manager）虚拟机管理器**
桌面图形管理工具。完成虚拟机生命周期管理（启停、暂停、保存恢复），新建虚拟机；管理多类型存储与虚拟网络；内置VNC查看控制台；展示性能统计。可以连接本地libvirtd，也可以远程管理其他宿主机。

> 
> 关闭SPICE自动USB重定向：

```
> dconf write /org/virt-manager/virt-manager/console/auto-redirect false
```

命令行启动：`virt‑manager`

2. **virt‑viewer（virt‑viewer）**
虚拟机图形控制台查看器，使用SPICE/VNC，支持TLS、x509证书。可以按虚拟机名称、ID、UUID连接；可以等待虚拟机启动之后自动连接控制台。系统默认不预装。
3. **yast2 vm（yast2‑vm）**
YaST虚拟化模块，简化虚拟化组件安装，也可以配置网络桥接。

## 第6章 虚拟化组件安装

> 
> 简介
> 想要搭建虚拟化宿主机，承载一台或多台客户虚拟机，需要在物理服务器安装虚拟化组件。不同虚拟化技术需要组件不同。

### 安装虚拟化组件

三种方式部署虚拟化组件：

1. openSUSE Leap系统安装阶段，直接选择对应系统角色；
2. 已经装好的系统，运行YaST虚拟化模块；
3. 已经装好的系统，zypper安装对应的模式集pattern。

#### 指定系统角色

系统安装过程的系统角色页面，可以直接选择 **KVM虚拟化宿主机** 或者 **Xen虚拟化宿主机**，系统会自动安装对应软件、完成基础设置。

> 
> 提示：两种虚拟化角色都会创建独立`/var/lib/libvirt`分区，同时启用防火墙、kdump服务。

#### 运行YaST虚拟化模块

> 
> yast2‑vm包必须预先安装。

**流程6‑1 安装KVM环境**

1. 打开YaST → 虚拟化 → 安装虚拟机管理程序与工具；
2. KVM server代表QEMU+KVM最小环境；KVM tools代表libvirt全套管理栈；点击确认Accept；
3. YaST会询问是否自动配置网络桥接，建议选Yes；
4. 配置完成，**不需要重启宿主机**，就可以创建虚拟机。

**流程6‑2 安装Xen环境**

1. YaST → 虚拟化 → 安装虚拟机管理程序与工具；
2. 勾选Xen server、Xen tools，确认Accept；
3. 是否自动配置网络桥接，选择Yes；
4. **需要重启机器，使用Xen内核启动**；
5. 使用YaST引导加载程序模块，将Xen内核设置为默认启动项。

#### 安装特定安装模式集pattern

zypper安装模式集语法：
`zypper install -t pattern PATTERN_NAME`

KVM相关pattern：

- `kvm_server`：基础KVM宿主机，QEMU+KVM环境
- `kvm_tools`：libvirt管理监控工具

Xen相关pattern：

- `xen_server`：基础Xen宿主机
- `xen_tools`：libvirt管理监控Xen工具

### 安装UEFI支持

> 
> 仅AMD64/Intel 64客户机支持UEFI安全启动。KVM客户机使用OVMF固件支持安全启动；Xen HVM虚拟机虽然可以使用OVMF，但是**不支持UEFI安全启动**。

UEFI由OVMF（Open Virtual Machine Firmware）固件包提供。根据架构安装`qemu‑ovmf‑x86_64`或者`qemu‑uefi‑aarch64`。
libvirt会自动识别固件包内JSON描述，自动匹配固件能力。
配置开启UEFI安全启动示例XML片段：

```
<os firmware='efi'>
 <loader secure='yes' />
</os>
```

`qemu‑ovmf‑x86_64`包含多套固件：

- SUSE企业客户机安全启动：`ovmf‑x86_64‑smm‑suse‑code.bin`
- openSUSE客户机安全启动：`ovmf‑x86_64‑smm‑opensuse‑code.bin`
- Windows客户机安全启动：`ovmf‑x86_64‑smm‑ms‑code.bin`

> 
> `*‑code.bin`是固件主体；`*‑vars.bin`是非易失变量模板。libvirt新建虚拟机时，会复制一份独立的vars文件到`/var/lib/libvirt/qemu/nvram/`。ms版本内置真实硬件的UEFI CA证书；suse版本内置SUSE证书。

### KVM开启嵌套虚拟化

> 
> ⚠技术预览特性，仅用于测试，官方不提供生产支持。

层级定义

- L0：裸金属宿主机运行KVM
- L1：L0之上的虚拟机（客户机虚拟机管理程序）
- L2：运行在L1内部的嵌套虚拟机

嵌套虚拟化用途：云环境直接在虚拟机内部管理虚拟机；虚拟机管理程序整体热迁移；软件开发测试。

> 
> 注意：嵌套虚拟机不支持热迁移。

**临时开启嵌套虚拟化**
Intel CPU：

```
sudo modprobe -r kvm_intel && modprobe kvm_intel nested=1
```

AMD CPU：

```
sudo modprobe -r kvm_amd && modprobe kvm_amd nested=1
```

**永久开启嵌套虚拟化**
Intel编辑`/etc/modprobe.d/kvm_intel.conf`

```
options kvm_intel nested=1
```

AMD编辑`/etc/modprobe.d/kvm_amd.conf`

```
options kvm_amd nested=1
```

L0宿主机开启嵌套之后，启动L1虚拟机二选一：

1. QEMU命令行参数`‑cpu host`；
2. CPU特性开启`vmx`(Intel) / `svm`(AMD)。

### VMware ESX作为嵌套客户虚拟机管理程序

如果KVM裸金属宿主机内部运行VMware ESX作为嵌套管理程序，网络通信会不稳定，尤其L2嵌套虚拟机和外部网络。
根源是默认CPU配置`<cpu mode='host‑model' check='partial' />`。
修改为：

```
<cpu mode='host-passthrough' check='none'>
 <cache mode='passthrough' />
</cpu>
```

# 第二部分 使用libvirt管理虚拟机

## 第7章 libvirt守护进程

libvirt访问KVM/Xen需要宿主机安装运行对应守护进程。libvirt提供两种部署模式：**单体守护进程libvirtd**、**模块化守护进程**。

单体libvirtd：一个进程包含虚拟机管理程序驱动、存储、网络、设备全部驱动，同时提供远程访问能力。

模块化守护进程：每个驱动独立进程。可以按需裁剪组件。适合最小化部署场景，例如Kubernetes环境，只需要qemu驱动virtqemud，网络存储交给外部组件处理。

### 单体守护进程启停

单体守护进程名字`libvirtd`，配置文件`/etc/libvirt/libvirtd.conf`。由systemd单元文件管控：

- `libvirtd.service`：主服务单元，如果虚拟机配置开机自启，建议设置开机启动；
- `libvirtd.socket`：读写UNIX套接字`/var/run/libvirt/libvirt‑sock`；建议开机启用；
- `libvirtd‑ro.socket`：只读套接字；建议开机启用；
- `libvirtd‑admin.socket`：管理员套接字；建议开机启用；
- `libvirtd‑tcp.socket`：TCP 16509非TLS远程访问，配置好身份认证再开机启用；
- `libvirtd‑tls.socket`：TLS加密远程访问，部署x509证书后再开机启用。

> 
> systemd socket激活模式下，`libvirtd.conf`里面部分监听配置不再生效，必须在systemd单元配置中修改。

> 
> 服务冲突：`libvirtd`与`xendomains`不能同时运行。如果libvirtd启动失败，检查xendomains状态：

```
systemctl is-active xendomains
```

返回active的处理方式：

```
sudo systemctl stop xendomains
sudo systemctl disable xendomains
sudo systemctl start libvirtd
```

两个服务功能重叠，同时运行会互相干扰。

### 模块化守护进程启停

模块化守护进程命名规则`virtDRIVERd`，配置文件`/etc/libvirt/virtDRIVERd.conf`。
SUSE支持hypervisor守护进程：`virtqemud`(KVM)、`virtxend`(Xen)。
配套二级守护进程：

- `virtnetworkd`：虚拟网络管理；
- `virtnodedevd`：宿主机物理设备管理；
- `virtnwfilterd`：虚拟机防火墙管理；
- `virtsecretd`：密钥管理（LUKS密钥等）；
- `virtstoraged`：存储池、卷管理；
- `virtinterfaced`：宿主机网卡接口管理，**SUSE不推荐使用，优先wicked/NetworkManager，建议禁用**；
- `virtproxyd`：代理，兼容旧libvirtd套接字，用于远程客户端；
- `virtlogd`：虚拟机控制台日志管理；
- `virtlockd`：磁盘资源锁管理。

> 
> `virtlogd`、`virtlockd`单体与模块化模式都会用到，不需要手动启停。

模块化默认监听UNIX套接字：`/var/run/libvirt/virtDRIVERd‑sock`读写、`‑sock‑ro`只读。客户端优先使用这套套接字。远程或者旧客户端使用`virtproxyd`代理。
同样依靠systemd socket单元管控。

### 切换为模块化守护进程

> 
> 切换之前建议关闭所有运行中虚拟机。

1. 停止并禁用单体libvirtd

```
sudo systemctl stop libvirtd.service
sudo systemctl stop libvirtd{,-ro,-admin}.socket
sudo systemctl disable libvirtd.service
sudo systemctl disable libvirtd{,-ro,-admin}.socket
```

2. 启用KVM需要的全套模块化服务（qemu、network、nodedev、nwfilter、secret、storage）

```
for drv in qemu network nodedev nwfilter secret storage
do
 sudo systemctl enable virt${drv}d.service
 sudo systemctl enable virt${drv}d{,-ro,-admin}.socket
done
```

3. 启动socket单元

```
for drv in qemu network nodedev nwfilter secret storage
do
 sudo systemctl start virt${drv}d{,-ro,-admin}.socket
done
```

4. 如果需要支持远程客户端，启用virtproxyd

```
sudo systemctl enable virtproxyd.service
sudo systemctl enable virtproxyd{,-ro,-admin}.socket
sudo systemctl start virtproxyd{,-ro,-admin}.socket
```

## 第8章 虚拟机宿主机准备工作

安装虚拟机之前，宿主机需要准备好资源：**网络配置**、**存储池**。

### 配置网络

两种主流网络模式给虚拟机提供网络：

1. **网络桥接（推荐默认）**：二层交换机，虚拟机直接接入宿主机局域网。
2. **开启转发的虚拟网络**（NAT/路由模式）。

#### 网络桥接

桥接工作原理：二层以太网帧基于MAC地址转发。虚拟机相当于网线插到和宿主机同一个物理局域网交换机。openSUSE KVM/Xen默认推荐。

创建桥接工具取决于宿主机网络管理服务：

- wicked（服务器默认）：YaST或者命令行；
- NetworkManager（桌面笔记本默认）：nmcli命令行。

**YaST创建删除桥接**
新增桥接：

1. YaST → 系统 → 网络设置；概览标签点击添加；
2. 设备类型选择Bridge桥接，填写桥接设备名称；下一步；
3. 地址标签配置DHCP或者静态IP。
   - 如果桥接不绑定真实物理网卡，可以使用私有网段`192.168.0.0/16`、`172.16.0.0/12`、`10.0.0.0/8`；
   - 只用于虚拟机之间互通、不访问宿主机外网：IP地址写`0.0.0.0`，子网掩码`255.255.255.255`；
4. Bridged Devices标签勾选要加入桥接的物理网卡；下一步，确定保存。

删除桥接：概览列表选中桥接设备，点Delete删除，确认OK。

**命令行ip工具创建桥接**
新建桥接virbr_test

```
# ip link add name virbr_test type bridge
# bridge vlan
# ip link set virbr_test up
# ip link set eth1 master virbr_test
# bridge link set dev virbr_test cost 4
```

> 
> 物理网卡eth1必须没有被别的桥接占用。cost参数启用STP生成树协议。

删除桥接：

```
# bridge vlan
# ip link delete dev virbr_test
```

**nmcli（NetworkManager）创建桥接br0**

```
sudo nmcli connection show --active
# 创建桥接
sudo nmcli connection add type bridge ifname br0
# 查看桥接配置
sudo nmcli -f bridge connection show bridge-br0
# 将物理网卡eth0作为桥接从设备
sudo nmcli connection add type bridge-slave ifname eth0 master br0
# 关闭原eth0连接，启用桥接
sudo nmcli connection down "Ethernet connection 1"
sudo nmcli connection up bridge-br0
```

**VLAN接口使用场景**
宿主机配置VLAN，用于跨主机虚拟机通信、私有隔离网络。甚至可以桥接VLAN接口，桥接本身不配置IP，虚拟机走VLAN网络。
YaST配置VLAN：

1. YaST系统‑网络设置，点Add新增网卡；
2. 设备类型VLAN；填写VLAN ID；
3. Real Interface for VLAN选择底层物理网卡；
4. 设置IP获取方式，完成保存。> 
> VLAN ID1一般用作管理网络。桥接VLAN接口如果不需要宿主机IP，填写`0.0.0.0`掩码`255.255.255.255`。

#### 虚拟网络（libvirt托管）

libvirt虚拟网络一般没有二层直通宿主机物理网络，依靠三层转发（NAT/路由）实现访问外网。自带DHCP、DNS服务。openSUSE预定义名字叫`default`，需要管理员手动启用。适合笔记本无线、IP地址紧张环境。服务器生产环境优先网络桥接。

开启IP转发：修改`/etc/sysctl.conf`

```
net.ipv4.ip_forward = 1
net.ipv6.conf.all.forwarding = 1
```

**虚拟机管理器图形界面管理虚拟网络**
连接详情 → 虚拟网络标签。

- Add新建虚拟网络：填写名称，模式NAT/Routed，转发设备，IPv4/IPv6网段、DHCP地址池，DNS域名；Finish生成，会创建virbrX桥接，自动添加iptables防火墙规则。
- Start启动、Stop停止、Delete删除虚拟网络。

> 
> NAT网络宿主机解析虚拟机主机名：安装`libvirt‑nss`包，修改`/etc/nsswitch.conf` hosts行增加`libvirt`，重启nscd。该NSS模块读取`/var/lib/libvirt/dnsmasq/*.status`。

**virsh命令行管理虚拟网络**
查看网络相关帮助：

```
sudo virsh help network
```

从XML定义创建网络：

```
sudo virsh net‑create vnet_definition.xml # 临时创建立刻启动
sudo virsh net‑define vnet_definition.xml # 仅定义，不启动
```

示例8‑1 NAT模式网络XML

```
<network>
<name>vnet_nated</name>
<bridge name="virbr1" />
 <forward mode="nat" />
 <ip address="192.168.122.1" netmask="255.255.255.0">
  <dhcp>
   <range start="192.168.122.2" end="192.168.122.254" />
   <host mac="52:54:00:c7:92:da" name="host1.testing.com" ip="192.168.1.101" />
  </dhcp>
 </ip>
</network>
```

示例8‑2 Routed路由模式（无NAT转换）

```
<network>
 <name>vnet_routed</name>
 <bridge name="virbr1" />
 <forward mode="route" dev="eth1" />
 <ip address="192.168.122.1" netmask="255.255.255.0">
  <dhcp>
   <range start="192.168.122.2" end="192.168.122.254" />
  </dhcp>
 </ip>
</network>
```

示例8‑3 隔离网络，不能访问外网

```
<network>
 <name>vnet_isolated</name>
 <bridge name="virbr3" />
 <ip address="192.168.152.1" netmask="255.255.152.0">
  <dhcp>
   <range start="192.168.152.2" end="192.168.152.254" />
  </dhcp>
 </ip>
 </network>
```

示例8‑4 使用宿主机已经存在的桥接br0

```
<network>
        <name>host‑bridge</name>
        <forward mode="bridge" />
        <bridge name="br0" />
</network>
```

常用virsh网络命令

```
virsh net‑list --all #列出全部网络
virsh net‑info vnet_routed #查看网络详情
virsh net‑start vnet_isolated #启动已定义网络
virsh net‑autostart vnet_isolated #设置开机自启
virsh net‑destroy vnet_isolated #停止网络
virsh net‑undefine vnet_isolated #永久删除网络定义
virsh domifaddr sles12sp3 #查看虚拟机网卡IP
virsh domiflist sles12sp3 #查看虚拟机网卡信息
```

### 配置存储池

> 
> 远程管理虚拟机的时候，不能直接访问宿主机本地文件系统，libvirt引入**存储池Storage Pool**概念。ISO镜像也必须放到存储池，远程客户端才能访问。

两个核心概念：

- **存储卷volume**：可以分配给虚拟机的存储对象，虚拟磁盘、ISO、软盘镜像。后端可以是文件、块设备（分区、LUN）。
- **存储池pool**：宿主机上存储资源集合，类似网络NAS。

存储池支持类型：

1. **dir目录池**：目录存放raw/qcow2/iso镜像文件；
2. **disk物理磁盘池**：整块物理磁盘，池内每个卷对应磁盘分区；
3. **fs文件系统分区池**：指定分区，libvirt自动挂载，目录存放镜像；
4. **iscsi**：iSCSI目标。不支持新建卷；每个LUN就是一个卷。使用前目标设备必须有分区表；
5. **logical LVM卷组池**：使用LVM卷组作为存储池；池删除会销毁整个卷组，数据丢失；
6. **mpath多路径设备**：仅支持把已有多路径设备分配给虚拟机，不能在池内创建卷；
7. **netfs网络文件系统池**：NFS共享目录，libvirt自动挂载；
8. **scsi SCSI适配器池**：SCSI适配器，每个LUN为卷，不能创建新卷。

> 
> 安全提醒：不要把宿主机正在使用的LVM、iSCSI资源交给libvirt存储池管理；不要使用卷标签挂载宿主机分区，避免虚拟机内部标签冲突。

#### 使用virsh管理存储

> 
> SUSE官方不支持通过virsh**创建**存储池；只支持启动、停止、删除池，以及卷管理。

```
virsh pool‑list --details #列出全部池
virsh pool‑info POOLNAME #池详情
virsh vol‑list --details POOLNAME #列出池内卷

virsh pool‑destroy POOLNAME #停止池
virsh pool‑start POOLNAME #启动池
virsh pool‑autostart POOLNAME #设置开机自启
virsh pool‑autostart POOLNAME --disable #关闭开机自启
virsh pool‑delete POOLNAME #清空池内所有卷
virsh pool‑undefine POOLNAME #删除池定义

# 创建卷，示例：12G qcow2，预分配4G
virsh vol‑create‑as POOLNAME VOLNAME 12G --format qcow2 --allocation 4G

# 克隆卷
virsh vol‑clone 原卷名 新卷名 --pool POOLNAME

# 删除卷（无确认，直接销毁数据）
virsh vol‑delete VOLNAME --pool POOLNAME

# 磁盘热添加到虚拟机
virsh attach‑disk 虚拟机名 /xxx/disk.qcow2 sda2 --live --config

# 移除磁盘
virsh detach‑disk 虚拟机名 sda2 --live --config
```

> 
> 注意：存储池状态停止，**不影响已经挂载到虚拟机上的卷**，只是远程管理无法新增挂载卷。删除卷不会校验卷是否正在被虚拟机使用，删除之后数据直接丢失，无法恢复。

> 
> 脚本列出所有虚拟机正在使用的存储卷，需要xsltproc工具，将下面xsl保存文件guest_storage_list.xsl，遍历/etc/libvirt/qemu/*.xml解析磁盘源。
```
<?xml version="1.0" encoding="UTF‑8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" />
  <xsl:template match="text()" />
  <xsl:strip‑space elements="*" />
  <xsl:template match="disk">
    <xsl:text>  </xsl:text>
    <xsl:value‑of select="(source/@file|source/@dev|source/@dir)[1]" />
    <xsl:text>&#10;</xsl:text>
  </xsl:template>
</xsl:stylesheet>
```

#### 使用虚拟机管理器管理存储

右键连接 → 详情 → 存储标签页。

- Add添加存储池，选择池类型，填写路径/服务参数；**不支持ZFS池**。
- Start/Stop启动停止池；Delete删除池定义。
- New Volume新建卷，填写名字、格式(raw/qcow2)、最大容量、预分配大小；qcow2可以设置后端基础镜像Backing Store。
- Delete Volume删除卷，直接销毁数据，不会校验是否被虚拟机正在使用。

> 
> iSCSI、SCSI、mpath池，不能在图形界面创建卷，LUN本身就是卷。LVM类型池执行删除会销毁整个卷组，数据全部丢失。

## 第9章 客户虚拟机安装

虚拟机 = 操作系统镜像（磁盘镜像） + XML配置文件，描述虚拟硬件资源。虚拟机运行、受控于虚拟化宿主机。

> 
> 许可提醒：一个操作系统授权许可，运行在多台虚拟机，需要遵守软件许可协议。

### 图形界面方式安装客户虚拟机

虚拟机管理器：编辑 → 首选项 → New VM可以修改新建虚拟机默认参数，例如默认固件设置为UEFI。

新建虚拟机向导（File → New Virtual Machine）：

1. 选择安装来源：本地介质ISO；网络HTTP/FTP/HTTPS；导入已有磁盘镜像；手动安装。> 
> Xen宿主机可以选择半虚拟化PV /全虚拟化HVM模式。
2. 根据来源填写参数：ISO路径/网络URL/已有镜像路径；网络安装可以指定AutoYaST/Kickstart无人值守文件；
3. 设置内存大小、虚拟CPU数量；导入已有镜像跳过该步骤；
4. 设置虚拟磁盘：新建磁盘或者从存储池选择已有卷；qcow2默认存放`/var/lib/libvirt/images`；不需要磁盘可以取消勾选启用存储（Live‑CD场景）；
5. 填写虚拟机名称；勾选「安装前自定义配置」可以修改硬件；选择网卡；桥接模式自动填充宿主机第一个桥接设备；
6. Finish；如果勾选自定义配置，弹出硬件修改窗口，全部确认后点Begin Installation开始安装。

> 
> 快捷键透传：Ctrl+Alt+F1这类组合键会被宿主机捕获，不会送到虚拟机。虚拟机管理器提供粘连按键：连续按三次Ctrl/Alt/Shift，该按键进入粘连状态，再按下剩余按键就可以完整发送给虚拟机内部。

#### PXE网络引导虚拟机

1. 新建虚拟机向导选择Manual Install手动安装；
2. 最后一步勾选「安装前自定义配置」；Finish；
3. 引导选项，开启引导菜单，勾选Network PXE网络引导；Apply；
4. Begin Installation开始，PXE服务器就绪就会出现PXE菜单。

### 使用virt‑install命令行安装虚拟机

virt‑install基于libvirt创建虚拟机，适合无图形环境或者自动化脚本。
重要参数摘要：

```
--name 虚拟机名  #唯一
--memory 内存MB
--vcpus 虚拟CPU数量
--paravirt / --hvm #半虚拟化/全虚拟化
--virt‑type kvm|xen

#存储三选一：--disk / --filesystem / --nodisks
--disk size=10 #10G磁盘镜像

#安装方式选其一：--location / --cdrom / --pxe / --import / --boot

--graphics vnc[,password=xxx] | none #图形输出
--noautoconsole #不自动拉起查看器

--extra‑args "内核启动参数"
--boot uefi #使用UEFI固件
```

示例9‑1 HTTP网络源安装openSUSE Leap

```
virt‑install --location \
"http://download.opensuse.org/pub/opensuse/distribution/leap/15.0/repo/oss" \
--extra‑args="textmode=1" --name "Leap15" --memory 2048 --virt‑type kvm \
--connect qemu:///system --disk size=10 --graphics vnc --network network=vnet_nated
```

开启串行控制台：

```
virt‑install --virt‑type kvm --name sles12 --memory 1024 \
 --disk /var/lib/libvirt/images/disk1.qcow2 --os‑variant sles12
 --extra‑args="console=ttyS0 textmode=1" --graphics none
```

> 
> 安装结束虚拟机内部`/etc/default/grub`会自动添加`console=ttyS0`。

指定OVMF UEFI固件：

```
--boot loader=/usr/share/qemu/ovmf‑x86_64‑opensuse.bin
```

完整KVM示例：

```
virt‑install --connect qemu:///system --virt‑type kvm \
--name sle15sp2 --memory 1024 --disk size=10 --cdrom /dev/cdrom --graphics vnc \
--os‑variant sle15sp2
```

完整Xen HVM示例：

```
virt‑install --connect xen:// --virt‑type xen --hvm \
--name sle15sp2 --memory 1024 --disk size=10 --cdrom /dev/cdrom --graphics vnc \
--os‑variant sle15sp2
```

### 高级客户机安装场景

#### 在安装中附加附加组件产品

附加组件介质如果是ISO镜像，需要给虚拟机挂载多张CD‑ROM。

图形界面：向导最后一步勾选安装前自定义配置 → Add Hardware → Storage，添加ISO，设备类型CD‑ROM。

命令行virt‑install，使用多个`‑‑disk`，设备类型cdrom，第一个cdrom作为引导介质。

```
virt‑install \
 --name sles15+storage \
 --memory 2048 --disk size=10 \
 --disk /path/to/SLE‑15‑SP5‑Full‑x86_64‑GM‑DVD1.iso,device=cdrom \
 --disk /path/to/SUSE‑Enterprise‑Storage‑VERSION‑DVD‑x86_64‑Media1.iso,device=cdrom \
 --graphics vnc --os‑variant sle15
```

## 第10章 虚拟机基础管理

虚拟机管理器图形界面、virsh命令行两套工具都可以完成启停、暂停、快照、迁移。远程管理需要配置libvirt远程连接（第11章）。

### 列出客户虚拟机

**虚拟机管理器**：主窗口展示连接下全部虚拟机，状态图标（Running运行/Paused暂停/Shutoff关机），CPU使用率。

**virsh命令行**

```
virsh list #只看运行中虚拟机
virsh list --all #全部，包含关机虚拟机
```

### 通过控制台访问客户虚拟机

两种访问：图形VNC控制台；串行串口控制台（操作系统支持的前提下）。

#### 打开图形控制台

虚拟机管理器右键虚拟机 → Open打开控制台。

> 
> 鼠标捕获：点击窗口，鼠标被虚拟机捕获；按`Ctrl+Alt`释放鼠标。添加tablet平板输入设备可以实现无缝绝对光标。

> 
> Ctrl+Alt+Del这类组合键会被宿主机捕获，虚拟机管理器菜单Send Key发送按键序列。

**virt‑viewer工具**

```
virt‑viewer 8 #按ID 8连接
virt‑viewer --wait sles12 #等待虚拟机启动自动打开窗口
```

> 
> SSH远程调用virt‑viewer，SSH密码会输入两次，一次libvirt认证，一次VNC服务认证。

#### 打开串行控制台

```
virsh console sles12
#参数：--safe独占访问；--force踢掉已有会话
virsh console sles12 --safe --force
```

> 
> SUSE/openSUSE虚拟机开启串口控制台：YaST引导加载程序模块，内核参数添加`console=ttyS0`。

### 修改虚拟机状态：启动、停止、暂停

- **优雅关机Shutdown**：向虚拟机发送ACPI关机信号，操作系统正常关闭，数据安全。依赖虚拟机内部ACPI支持。
- **强制销毁destroy**：相当于物理机直接拔电源，可能文件系统损坏，仅紧急场景使用。

**虚拟机管理器**：右键虚拟机，Run启动 / Pause暂停 / Shutdown关机 / Force Off强制断电。虚拟机详情‑引导选项可以勾选宿主机开机自动启动虚拟机。

**virsh命令**

```
virsh start sles12 #启动
virsh suspend sles12 #暂停
virsh resume sles12 #恢复运行
virsh reboot sles12 #重启
virsh shutdown sles12 #优雅关机
virsh destroy sles12 #强制断电
virsh autostart sles12 #设置开机自启
virsh autostart sles12 --disable #关闭开机自启
```

### 保存和恢复虚拟机状态

> 
> 保存save：把虚拟机完整内存状态写入磁盘文件，虚拟机停止。类似电脑休眠。**不会保存虚拟磁盘数据，只保存内存。**
> restore恢复：读取内存状态文件，恢复到休眠那一刻运行状态，**不执行虚拟机引导。**

⚠重要警告：保存之后**不要直接start启动该虚拟机**！会磁盘状态和保存的内存状态不一致，恢复会发生严重错误。只能restore恢复。

> 
> 仅支持raw/qcow2磁盘格式。保存文件大小约等于分配给虚拟机内存大小。长时间休眠恢复之后虚拟机内部时间可能错乱，可以使用QEMU Guest Agent校正时间。

**虚拟机管理器**：虚拟机窗口菜单 Virtual Machine → Shutdown → Save保存；虚拟机处于关机状态菜单Restore恢复。

**virsh命令**

```
virsh save opensuse13 /virtual/saves/opensuse13.vmsave
virsh restore /virtual/saves/opensuse13.vmsave
```

### 创建和管理快照

> 
> 快照包含虚拟机CPU、内存、设备、全部可写磁盘状态。**全部磁盘必须qcow2格式，至少一块磁盘可写。KVM才支持快照，Xen不支持。**

术语

1. **内部快照Internal snapshot**：快照数据全部写进原qcow2镜像文件，拷贝迁移简单。
2. **外部快照External snapshot**：原镜像置只读，新建overlay差异镜像存放变更。适合备份；虚拟机管理器不支持外部快照。
3. **在线快照Live snapshot**：虚拟机运行状态下创建快照；
4. **离线快照Offline snapshot**：虚拟机关机状态创建，数据一致性更好。

#### 虚拟机管理器快照管理（仅支持内部快照）

控制台窗口 View → Snapshots打开快照面板。

Add新建快照，填写名字描述；Delete删除快照；Run回滚恢复快照。

#### virsh快照命令

```
virsh snapshot‑list --domain sle‑ha‑node1 #列出快照
virsh snapshot‑current --domain admin_server #查看当前生效快照
virsh snapshot‑info --domain admin_server --name "快照名" #快照详情

# 创建内部快照
virsh snapshot‑create‑as --domain admin_server --name "Snapshot 1" --description "First snapshot"

# 创建磁盘仅外部快照（离线）
virsh snapshot‑create‑as --domain admin_server --name "Offline external snapshot" --disk‑only

# 创建在线外部快照，同时保存内存状态
virsh snapshot‑create‑as --domain admin_server --name "live‑external‑snap" --live --memspec snapshot=external,file=/path/to/mem‑snap --diskspec vda,snapshot=external,file=/path/to/disk‑overlay.qcow2

# 删除内部快照
virsh snapshot‑delete --domain admin_server --snapshotname "Snapshot 2"

# 回滚快照
virsh snapshot‑revert --domain admin_server --snapshotname "Snapshot 1"
virsh snapshot‑revert --domain admin_server --current #回滚到当前快照
```

> 
> 外部快照不能使用snapshot‑delete删除，需要手动管理qcow2 overlay链。

### 删除客户虚拟机

> 
> virsh undefine默认只删除XML配置文件，**不会删除磁盘镜像**。虚拟机管理器可以勾选同时删除关联存储文件。删除操作不可恢复。

**虚拟机管理器**：右键虚拟机 → Delete；勾选Delete Associated Storage Files会一并删除磁盘。

**virsh命令**

```
virsh undefine sles12
#磁盘卷需要单独执行vol‑delete删除
```

### 虚拟机迁移

虚拟化一大优势就是虚拟机可迁移。KVM/Xen支持**热迁移（live迁移，业务不中断）**。

#### 迁移前提条件

1. 源宿主机与目标宿主机CPU架构一致；
2. 虚拟机磁盘镜像源、目标主机都可以访问（NFS、iSCSI共享存储，两边配置相同存储池）；CD‑ROM/Floppy镜像也要两边可访问；迁移前建议弹出不需要的介质；
3. 源、目标宿主机libvirtd运行，网络连通libvirt远程连接；
4. 防火墙开放迁移端口范围49152‑49215；
5. 建议源、目标主机同一个子网，否则迁移后网络异常；
6. qemu用户UID，kvm/qemu/libvirt组GID源目标两台机器必须保持一致；
7. 目标主机不能有同名正在运行/暂停虚拟机；关机同名虚拟机会被迁移配置覆盖；
8. SATA磁盘设备不支持迁移；文件透传功能不支持迁移；PCI透传/SR‑IOV设备虚拟机不支持热迁移；
9. 磁盘缓存模式会影响迁移（详见第16章）；
10. 两台宿主机镜像文件路径必须完全一致；
11. 两台宿主机微码版本尽量一致。

> 
> post‑copy后拷贝迁移模式，内核5.11+需要设置：

```
sudo sysctl -w vm.unprivileged_userfaultfd=1
```

#### 虚拟机管理器执行迁移

右键正在运行的虚拟机 → Migrate。填写目标主机连接；高级选项：永久迁移 /临时迁移；Allow unsafe选项允许不设置cache=none，提升迁移速度。点击Migrate执行。

#### virsh迁移命令

```
# 格式 virsh migrate [OPTIONS] 虚拟机ID/名字 目标连接URI
# --live 热迁移；--suspend迁移完成后虚拟机保持暂停不启动；
# --persistent目标主机永久保存虚拟机配置；--undefinesource迁移成功删除源主机定义

# 离线迁移（虚拟机暂停迁移）
virsh migrate 37 qemu+ssh://tux@jupiter.example.com/system

# 热迁移，临时，目标关机之后配置消失
virsh migrate --live opensuse131 qemu+ssh://tux@jupiter.example.com/system

# 热迁移，目标持久保存，源删除定义
virsh migrate --live --persistent --undefinesource 37 qemu+tls://tux@jupiter.example.com/system

# 指定迁移端口
virsh migrate opensuse131 qemu+ssh://tux@jupiter.example.com/system --migrateuri tcp://@jupiter.example.com:49152
```

> 
> transient临时迁移：目标主机虚拟机关机，虚拟机配置就被清除；persistent持久迁移，目标主机保存完整虚拟机配置。不建议`--undefinesource`不带`--persistent`，否则两边配置都会丢失。

#### 分步示例NFS共享存储迁移

1. NFS服务端配置`/etc/exports`，共享目录`/volume1/VM`给10.0.1.0/24

```
/volume1/VM 10.0.1.0/24  (rw,sync,no_root_squash)
```

重启nfs‑server，exportfs输出共享。

2. **所有迁移目标宿主机**定义同一个netfs存储池VM

```
<pool type='netfs'>
  <name>VM</name>
  <source>
    <host name='10.0.1.99' />
    <dir path='/volume1/VM' />
    <format type='auto' />
  </source>
  <target>
    <path>/var/lib/libvirt/images/VM</path>
    <permissions>
      <mode>0755</mode>
      <owner>-1</owner>
      <group>-1</group>
    </permissions>
  </pool>
```

```
virsh pool‑define VM.xml
virsh pool‑autostart VM
virsh pool‑start VM
```

3. 在存储池创建磁盘卷

```
virsh vol‑create‑as VM sled12.qcow2 8G --format qcow2
```

4. virt‑install创建虚拟机，磁盘使用vol=VM/sled12.qcow2，cache=none。
5. 在源宿主机执行迁移：

```
virsh # migrate --live sled12 --verbose qemu+ssh://10.0.1.xx/system
Password:
Migration: [ 12 %]
```

### 监控

#### 虚拟机管理器监控

Edit → Preferences → Polling，勾选轮询磁盘I/O、网络I/O、内存统计。View → Graph打开性能图表。虚拟机详情‑Performance查看详细性能。

#### virt‑top

类似top命令，监控虚拟机资源占用。默认3秒刷新。

```
virt‑top
```

快捷键：Shift+P按CPU；Shift+M内存；Shift+T运行时间；Shift+I ID；Shift+F自定义排序；Shift+R翻转排序。0/1/2/3切换视图。

#### kvm_stat

读取debugfs下kvm性能事件统计。需要挂载debugfs（openSUSE默认挂载）。

```
sudo mount -t debugfs none /sys/kernel/debug

kvm_stat        #每秒刷新
kvm_stat -1     #输出一次快照
kvm_stat -l > kvmstats.log #日志格式输出
```

## 第11章 连接与授权

libvirt支持多种连接方式（Unix套接字、SSH隧道、TLS/SSL、TCP），搭配多种认证（Polkit、Unix权限组、SASL、Kerberos）。libvirtd管理权限和VNC控制台权限两套独立的身份认证，配置互不影响。

### 身份认证

libvirtd配置文件`/etc/libvirt/libvirtd.conf`。
openSUSE Leap默认：Unix套接字权限控制，只有root可以访问。普通用户本地使用libvirt工具，会弹出Polkit授权输入root密码。

**本地访问推荐方案**

1. Polkit + Unix socket；
2. Unix组权限。

**SSH隧道远程访问**：Unix组权限。

**TLS/SSL远程访问**：SASL用户名密码认证；或者客户端证书权限控制。

#### Unix组权限授权普通用户访问libvirt

1. 创建libvirt组

```
sudo groupadd libvirt
```

2. 将普通用户加入libvirt组

```
sudo usermod --append --groups libvirt tux
```

3. 修改`/etc/libvirt/libvirtd.conf`

```
unix_sock_group = "libvirt"
unix_sock_rw_perms = "0770"
auth_unix_rw = "none"
```

4. 重启libvirtd服务。

> 
> ⚠注意：修改完libvirtd.conf配置文件之后，必须重启libvirtd服务，配置才会生效。

```
sudo systemctl restart libvirtd
```

配置完成后，加入`libvirt`组的普通用户就可以直接使用virsh、virt‑manager访问system级libvirt，不再需要Polkit提权。

### VNC身份认证

VNC控制台独立一套认证体系，不受libvirtd认证约束。
可选认证方式：

1. SASL：支持用户名密码，不需要系统本地账号，密码存储在SASL内部数据库，通信加密；libvirtd与VNC都可以使用。
2. 简单密码：仅VNC可用，设置VNC访问密码。

> 
> 重要提醒：限制libvirt管理权限**不等于**限制VNC控制台访问权限，两套机制独立，务必同时加固。

### 连接虚拟机宿主机

libvirt有两套访问模型：

1. **session会话模式**：普通用户私有会话，虚拟机资源归当前登录用户，`qemu:///session`；
2. **system系统模式**：全局宿主机管理，管理服务器级虚拟机，`qemu:///system`，绝大多数生产环境使用此模式。

#### 非特权用户获取system访问权限

两种方式：

1. Polkit授权：本地操作时，弹出认证窗口输入root密码，临时获得system访问；重启会话需要重新授权。
2. 将用户加入`libvirt`用户组，如上一小节配置，永久免密码访问system总线。

#### 使用虚拟机管理器管理连接

1. 打开virt‑manager，文件 → 添加连接；
2. 选择虚拟化类型：QEMU/KVM / Xen；
3. 勾选远程连接，填写主机名/IP；
4. 选择连接协议：SSH / TLS；
5. 确认，保存连接。

> 
> 本地默认连接无需配置，URI：`qemu:///system`（系统），`qemu:///session`（会话）。

#### 配置远程连接

##### SSH隧道远程连接（`qemu+ssh://` / `xen+ssh://`）

底层复用SSH安全通道，不需要额外证书，最常用。
连接URI格式：
`qemu+ssh://用户名@宿主机IP/system`

示例virsh直接远程执行命令：

```
virsh -c qemu+ssh://tux@192.168.1.100/system list --all
```

> 
> 前提：宿主机开启SSH服务，客户端SSH可以免密登录会更加方便。SSH隧道传输全部加密。

##### TLS/SSL远程连接（`qemu+tls://` / `xen+tls://`）

基于X509证书双向认证。

1. 生成CA根证书、服务端证书（宿主机）、客户端证书（管理工作站）；
2. 宿主机libvirtd.conf开启`listen_tls=1`；
3. 证书部署路径：
   - CA证书：`/etc/pki/CA/cacert.pem`
   - 服务端证书密钥：`/etc/pki/libvirt/servercert.pem`、`/etc/pki/libvirt/serverkey.pem`
4. 客户端存放CA、客户端证书密钥。

连接示例：

```
virsh -c qemu+tls://libvirt-host.example.com/system nodeinfo
```

> 
> TLS模式适合多集中管控大规模虚拟化集群；证书维护复杂度高于SSH隧道。

## 第12章 高级存储主题

### 使用virtlockd锁定磁盘文件与块设备

`virtlockd`守护进程负责给虚拟机磁盘镜像、块设备加锁，防止多个虚拟机**同时打开同一块磁盘**，避免文件系统损坏。

#### 启用锁定

virtlockd在单体libvirtd、模块化libvirt部署中默认已经启用，无需额外安装软件包。

#### 配置锁定

配置文件：`/etc/libvirt/virtlockd.conf`

- `lock_dir`：锁文件存放目录，默认`/var/run/libvirt/lockd/files`；
- `lock_timeout`：锁等待超时时间。

> 
> 不建议手动修改锁文件；锁是 advisory劝告锁，客户虚拟机内部操作系统不会识别该锁，**禁止手动在宿主机之外挂载被虚拟机占用的磁盘**。

### 客户机块设备在线扩容

> 
> 前提：磁盘后端（qcow2、LVM卷等）先在宿主机层面扩大空间；**扩容磁盘≠扩容虚拟机内部分区/文件系统**。

1. 宿主机侧扩容磁盘示例（qcow2）

```
qemu-img resize /var/lib/libvirt/images/disk.qcow2 +10G
```

2. 通知正在运行的虚拟机重新识别磁盘，不需要关机重启：

```
virsh blockresize 虚拟机名 vda 20G
```

> 
> `vda`是虚拟机内部磁盘设备名。
> 
> 
> 3. 进入虚拟机操作系统，使用fdisk/growpart/xfs_growfs/resize2fs扩展分区以及文件系统。
> ⚠注意：libvirt仅完成块设备大小变更，**不会修改虚拟机内文件系统**，必须客户机内操作，否则新增空间无法使用。

### 宿主机与客户机目录共享（文件系统透传 VirtFS）

VirtFS（9p协议）把宿主机目录直接共享给虚拟机，不需要创建磁盘镜像。

> 
> 限制：**不支持热迁移！开启该特性的虚拟机无法做热迁移**。

XML片段示例：

```
<filesystem type='mount' accessmode='passthrough'>
  <source dir='/host/share'/>
  <target dir='/hostshare'/>
</filesystem>
```

虚拟机内部挂载：

```
mount -t 9p /hostshare /mnt/host -o trans=virtio
```

### libvirt使用RADOS块设备（RBD）

RBD是Ceph分布式块存储。libvirt可以直接访问Ceph块设备，无需在宿主机本地映射为/dev块设备。
磁盘XML示例：

```
<disk type='network' device='disk'>
  <driver name='qemu' type='rbd'/>
  <source pool='rbd-pool' volume='vm-disk' hosts='ceph-node1,ceph-node2'/>
  <target dev='vda' bus='virtio'/>
</disk>
```

> 
> 需要qemu支持rbd，宿主机安装ceph客户端软件包；支持快照、热迁移。

## 第13章 使用虚拟机管理器（virt‑manager）配置虚拟机

打开虚拟机管理器，双击虚拟机 → 点击「显示详情」，打开硬件配置窗口。

### 虚拟机设置总览

| 分类 | 配置项说明 |
| --- | --- |
| 概览 | 虚拟机名称、描述、虚拟机类型（KVM/Xen）、固件BIOS/UEFI、芯片类型 |
| 性能 | CPU拓扑、内存、内存气球、IO线程 |
| 处理器 | CPU核心数、CPU模型、拓扑（插槽‑核心‑线程）、CPU特性透传 |
| 内存 | 分配内存大小、最大热插拔内存、内存气球设备开关 |
| 引导选项 | 引导顺序、开机自启、BIOS/UEFI设置、安全启动开关 |
| 存储 | 磁盘、CD‑ROM、软盘，磁盘总线virtio/scsi/ide，缓存模式 |
| 控制器 | IDE/SCSI/Virt‑SCSI、USB控制器配置 |
| 网络 | 网卡，模型virtio/e1000，绑定虚拟网络/桥接/macvtap |
| 输入设备 | 键盘、鼠标、tablet绝对坐标输入设备（解决鼠标错位） |
| 视频 | 显卡类型（virtio/qxl/vga）、显存大小、2D/3D加速开关 |
| USB重定向 | SPICE会话USB设备重定向 |
| 杂项 | 时钟、QEMU客户代理开关、随机数rng设备 |

### 添加CD/DVD‑ROM设备

1. 硬件窗口点击「添加硬件」→ 存储；
2. 设备类型选择 **CDROM**；
3. 选择ISO镜像文件，或者选择无介质；
4. 总线：SATA / IDE；点击完成。

### 添加软盘设备

添加硬件 → 存储，设备类型软盘，选择镜像或者空软盘。软盘现在极少使用。

### 弹出/更换CD/DVD、软盘介质

选中光驱设备，点击「弹出」卸载镜像；点击「选择镜像」更换ISO。

> 
> 虚拟机运行状态下可以在线更换介质，不需要关机。

### 将宿主机PCI设备透传给虚拟机

> 
> 前置条件：BIOS开启IOMMU，内核加载vfio_pci模块，设备已经绑定vfio驱动，设备不被宿主机占用。

1. 添加硬件 → PCI主机设备；
2. 列表选择要透传的PCI设备（显卡、网卡等）；
3. 完成。> 
> ⚠注意：透传PCI的虚拟机**不支持热迁移**，该设备同一时间只能分配给一台虚拟机。

### 将宿主机USB设备透传给虚拟机

两种方式：

1. **USB设备直接透传（硬件透传）**：添加硬件 → USB主机设备，选择物理USB设备；虚拟机独占设备。
2. **SPICE USB重定向**：虚拟机运行后，控制台窗口工具栏，动态把客户端机器USB转发进虚拟机；不需要宿主机层面绑定驱动，适合桌面远程使用。

## 第14章 使用virsh配置虚拟机

> 
> 核心命令：`virsh edit <虚拟机域名>`，直接编辑虚拟机XML配置文件。编辑会自动做XML语法校验，语法错误不会保存。

### 编辑虚拟机配置

```
virsh edit sles15
```

> 
> 不建议直接手动修改/etc/libvirt/qemu下xml文件，修改完需要执行`virsh define xxx.xml`重载；`virsh edit`是官方推荐方式。

### 修改虚拟机类型（machine type）

machine类型代表QEMU机器型号，例如`pc‑q35‑7.2`；升级QEMU版本需要关注机器类型，避免硬件兼容性问题。

```
<os>
  <type arch='x86_64' machine='pc‑q35‑8.0'>hvm</type>
</os>
```

### 配置Hypervisor管理程序特性

例如开启HVM特定功能，关闭某些模拟硬件。

### CPU配置

#### 设置CPU数量

```
<vcpu placement='static'>4</vcpu>
```

placement='static'静态固定；placement='auto'支持CPU热插拔，设置最大vcpu：

```
<vcpu placement='auto' max='8'>4</vcpu>
```

#### 设置CPU模型

三种模式：

1. `custom`自定义指定CPU型号；
2. `host‑model`：宿主机检测CPU特性，选择相近标准模型（迁移兼容性好，默认）；
3. `host‑passthrough`：直接透传宿主机全部CPU标志位，性能最好，但不同CPU硬件之间迁移会失败。

示例 host‑model

```
<cpu mode='host‑model'/>
```

示例 host‑passthrough

```
<cpu mode='host‑passthrough' check='none'/>
```

### 修改引导选项

#### 修改引导顺序

```
<os>
  <boot dev='hd'/>
  <boot dev='cdrom'/>
  <boot dev='network'/>
</os>
```

dev取值：`hd`硬盘，`cdrom`光盘，`network`PXE网络。

#### 直接内核引导（Direct kernel boot）

不使用虚拟机固件，直接指定内核、initrd、内核参数，适合无人值守安装：

```
<os>
  <kernel>/boot/vmlinuz</kernel>
  <initrd>/boot/initrd</initrd>
  <cmdline>console=ttyS0 textmode=1</cmdline>
</os>
```

### 配置内存分配

```
<memory unit='KiB'>4194304</memory>
<currentMemory unit='KiB'>2097152</currentMemory>
```

memory：虚拟机最大内存；currentMemory：当前分配内存，配合内存气球实现热调整。

### 添加PCI设备（普通x86 / IBM Z）

IBM Z大型机PCI透传有特殊配置，参考libvirt官方文档。
普通x86 VFIO透传片段：

```
<hostdev mode='subsystem' type='pci' managed='yes'>
  <source>
    <address domain='0x0000' bus='0x01' slot='0x00' function='0x0'/>
  </source>
</hostdev>
```

### 添加USB设备

物理USB透传：

```
<hostdev mode='subsystem' type='usb'>
  <source vendor='0x046d' product='0xc52b'/>
</hostdev>
```

### SR‑IOV虚拟VF网卡配置

> 
> SR‑IOV物理PF网卡硬件，分出多个VF虚拟功能。每个VF作为独立PCI设备分配虚拟机。

1. 宿主机加载网卡PF驱动，开启SR‑IOV，生成若干VF；
2. VF绑定vfio‑pci驱动；
3. 将VF以hostdev方式分配给虚拟机。

> 
> 可以配置资源池，动态分配VF给虚拟机。

### 列出虚拟机挂载设备

```
virsh domblklist 虚拟机名 #列出块设备
virsh domiflist 虚拟机名 #列出网卡
virsh dumpxml 虚拟机名 #完整XML，查看全部设备address地址
```

### 配置存储设备

常用磁盘XML示例，virtio磁盘，qcow2镜像：

```
<disk type='file' device='disk'>
  <driver name='qemu' type='qcow2' cache='none'/>
  <source file='/var/lib/libvirt/images/test.qcow2'/>
  <target dev='vda' bus='virtio'/>
</disk>
```

### 配置控制器设备

示例virtio‑scsi控制器：

```
<controller type='scsi' index='0' model='virtio‑scsi'/>
```

### 配置显卡设备

#### 修改显存VRAM

```
<video>
  <model type='qxl' ram='65536' vram='65536' heads='1'/>
</video>
```

#### 2D/3D加速开关

qxl/virtio‑gpu支持3D加速；开启`<acceleration accel3d='yes'/>`。

### 配置网络设备

#### 多队列virtio‑net提升网络性能

队列数匹配vCPU数量，提升高吞吐网络性能：

```
<interface type='network'>
  <source network='default'/>
  <model type='virtio' queues='4'/>
</interface>
```

#### macvtap直接复用宿主机物理网卡

macvtap让虚拟机直接占用宿主机物理网卡，虚拟机拥有独立MAC，二层直连物理网络，**宿主机本身会丢失该网卡网络！**

```
<interface type='direct'>
  <source dev='eth0' mode='bridge'/>
  <model type='virtio'/>
</interface>
```

#### 关闭内存气球 balloon设备

删除或者注释`<memballoon>`节点即可关闭内存气球。

### 配置多显示器（双屏输出 dual‑head）

qxl显卡设置heads='2'，支持双显示器输出：

```
<video>
  <model type='qxl' ram='65536' vram='65536' heads='2'/>
</video>
```

### IBM Z平台：加密密码适配器透传

IBM Z大型机特有硬件加密适配器，透传给KVM客户虚拟机，用于硬件加密运算。需要特定硬件、驱动支持。

### Xen迁移KVM指南 virt‑v2v

`virt‑v2v`工具把Xen虚拟机磁盘、配置转换成KVM可运行格式。

1. 安装virt‑v2v软件包；
2. 离线转换Xen虚拟机：

```
virt‑v2v -i xen -o libvirt -os storagepool --name new‑kvm‑vm xen‑vm‑name
```

> 
> 注意：半虚拟化PV驱动（xen‑pv）在KVM下不可用，转换完成虚拟机内部需要安装virtio驱动。

手动迁移步骤：

1. 完整备份Xen虚拟机磁盘镜像与配置；
2. 修改虚拟机内部操作系统：卸载Xen PV驱动，安装virtio驱动；
3. 改写libvirt XML配置，适配KVM硬件模型；
4. 导入定义`virsh define xxx.xml`，启动测试。

# 第三部分 Hypervisor无关通用特性

## 第16章 磁盘缓存模式

### 什么是磁盘缓存

QEMU磁盘缓存控制宿主机页缓存与虚拟机磁盘IO交互方式，影响**性能、数据一致性、热迁移兼容性**。

### 主要缓存模式

1. **cache=none**
绕过宿主机页缓存，IO直接落盘。数据安全性最高，适合生产环境，热迁移完全兼容；性能开销相对大。
2. **cache=writethrough**
写穿透；写直接落磁盘，读使用宿主机缓存；安全，兼容迁移。
3. **cache=writeback**
写回模式；宿主机缓存写入，延迟刷入磁盘；性能高，**宿主机断电会丢失尚未刷盘的数据**；支持热迁移。
4. **cache=unsafe**
最大限度使用宿主机缓存；允许回写，快照、迁移时不做数据同步；性能最好，**断电极易损坏虚拟机磁盘，禁止生产环境使用**。
5. **cache=directsync**
每次写操作强制同步落盘。

### 缓存模式与数据完整性

> 
> 生产环境强烈推荐`cache="none"`。writeback/unsafe模式下宿主机崩溃，虚拟机内已经“写入”的数据可能丢失，文件系统损坏风险很高。

### 缓存模式与热迁移

`unsafe`模式**不支持热迁移**；其余none/writethrough/writeback/directsync支持热迁移。

## 第17章 虚拟机客户机时钟设置

虚拟机时钟漂移是虚拟化经典问题，宿主机休眠、负载高会造成客户机时间不准。

### KVM kvm_clock

kvm_clock是半虚拟化时钟源，虚拟机读取宿主机真实时间，减少时钟漂移，Linux客户机优先使用。

> 
> Windows客户机使用Hyper‑V时钟源。

### 其他时间方案

1. 虚拟机内部chrony / ntpd网络时间同步；
2. libvirt XML配置`<clock offset='utc'/>`或`localtime`。

XML示例：

```
<clock offset='utc'>
  <timer name='kvmclock' present='yes'/>
</clock>
```

### Xen虚拟机时钟设置

Xen使用`xenclock`半虚拟化时钟源；同样建议虚拟机内部部署NTP/chrony服务。

## 第18章 libguestfs工具集

libguestfs，一套用户态工具，**不需要启动虚拟机，直接修改磁盘镜像内部文件**。

> 
> ⚠风险提醒：千万不要对正在运行的虚拟机磁盘镜像使用libguestfs，会破坏文件系统！只能操作关机状态的镜像。

### 软件包安装

```
zypper install libguestfs
```

### 核心工具

1. **virt‑rescue**：虚拟机镜像救援，类似系统救援盘，挂载镜像修复文件、修改配置、重置密码。

```
virt‑rescue -a disk.qcow2
```

2. **virt‑resize**：调整虚拟机镜像分区大小（镜像扩容之后，调整内部分区）。
3. **guestfish**：交互式shell，直接读写修改磁盘镜像内部文件。
4. virt‑cat：读取镜像内部文件；virt‑edit：编辑镜像内部配置；virt‑ls：列出镜像内目录。

### 物理机转KVM虚拟机P2V

`virt‑p2v`，把物理服务器转换成KVM虚拟机镜像。

### 故障排查

`libguestfs‑test‑tool`自检工具，检查libguestfs环境是否正常。
Btrfs镜像需要额外包支持。

## 第19章 QEMU Guest Agent（QEMU客户代理，QGA）

QGA是运行在**虚拟机内部**的守护进程，宿主机libvirt通过virt‑serial通道和虚拟机通信。
**能力：**

- 优雅冻结文件系统快照；
- 获取虚拟机内部IP地址；
- 设置虚拟机系统时间；
- 执行虚拟机内部命令；
- 在线获取文件系统扩容信息。

### 需要QGA支持的virsh命令

- `virsh fs‑freeze` / `fs‑thaw` 文件系统冻结，做一致性快照；
- `virsh domfsinfo` 获取虚拟机文件系统信息；
- `virsh guest‑set‑time` 设置客户机时间。

> 
> 使用前提：虚拟机操作系统内部安装qemu‑guest‑agent软件包，并且启动服务；XML添加qga串口通道：

```
<channel type='unix'>
  <target type='virtio' name='org.qemu.guest_agent.0'/>
</channel>
```

## 第20章 软件TPM模拟器 swtpm

模拟TPM2.0芯片，虚拟机用于Windows11、加密、安全度量。

1. 宿主机安装`swtpm`软件包；
2. libvirt配置添加TPM设备：

```
<tpm model='tpm‑crb'>
  <backend type='emulator' version='2.0'/>
</tpm>
```

3. 搭配OVMF UEFI固件，可以完成TPM度量，支持Windows11虚拟机。

## 第21章 创建虚拟机故障转储crash dump

生成虚拟机内存完整转储文件，用于内核崩溃、系统死机调试。

- 全虚拟化HVM虚拟机；
- Xen半虚拟化PV虚拟机。> 
> 使用virsh dump命令生成dump文件，配合crash调试工具分析。

```
virsh dump 虚拟机名 /var/lib/libvirt/dump/vm.dump --live
```

`--live`在线dump，虚拟机运行状态生成转储。

# 第四部分 Xen虚拟机管理

## 第22章 搭建Xen虚拟化宿主机

### Dom0内存管理

Dom0是Xen特权域，默认会占用大量内存。**生产环境强烈限制Dom0内存大小**，留给DomU客户虚拟机更多内存。
修改grub内核启动参数Xen部分，添加`dom0_mem=4096M`限制Dom0最大4G内存。

> 
> 注意：Dom0内存不能设置过小，否则宿主机IO、管理功能会卡顿异常。

### PCI透传（Xen）

BIOS开启IOMMU；Xen hypervisor开启iommu支持；把PCI设备分配给DomU。
VGA显卡透传、USB透传。

> 
> USB两种模式：模拟USB设备；PVUSB半虚拟化USB。

## 第23章 Xen虚拟网络

Xen网络后端在Dom0；支持桥接、NAT地址伪装、宿主机路由模式。
带宽限流，监控虚拟网络流量。

## 第24章 XL — Xen管理工具

xl是Xen新一代管理工具，替代旧版xm。配置文件：每个DomU虚拟机配置文件，通常存放在`/etc/xen/`。

- 虚拟机开机自启：符号链接放入`/etc/xen/auto/`目录；
- xl list：列出域；xl create / xl destroy / xl save / xl restore 保存恢复虚拟机。

虚拟机状态：running运行，paused暂停，shutdown关闭，crashed崩溃。

## 第25章 Xen块设备

虚拟磁盘后端：本地文件、LVM逻辑卷、iSCSI网络存储。
文件后端loop回环设备。块设备扩容，高级存储脚本。

## 第26章 Xen配置选项

虚拟光驱VCDROM；VNC远程控制台；SDL显示；虚拟键盘；CPU资源分配；HVM虚拟机启动设备选择；修改CPUID；虚拟CPU调度。

## 第27章 Xen管理维护任务

GRUB引导加载程序配置Xen内核启动；稀疏镜像sparse文件；Xen虚拟机迁移；xentop监控工具；向DomU客户机提供宿主机信息。

## 第28章 XenStore

XenStore是域之间共享配置数据库，类似虚拟机内部注册表，Dom0和DomU都可以读写。文件系统接口`/proc/xenstore`；命令`xenstore‑ls`，`xenstore‑write`。
主要路径：

- `/vm`：虚拟机静态配置；
- `/local/domain/<domid>`：运行时域信息。

## 第29章 Xen高可用HA

结合共享远程存储实现Xen虚拟机故障转移；本地存储HA局限性；私有虚拟网桥配合HA。

## 第30章 Xen：半虚拟化PV虚拟机转换为全虚拟化HVM/FV

PV老虚拟机没有BIOS固件，需要迁移到HVM模式：

1. 修改虚拟机配置文件，开启HVM；
2. 磁盘更换为模拟IDE/SCSI，替换PV驱动；
3. 安装传统BIOS或者OVMF UEFI固件；
4. 修改虚拟机内部操作系统，移除Xen PV内核驱动，适配HVM硬件。

# 第五部分 QEMU原生管理（不经过libvirt，直接使用qemu‑system‑*）

## 第31章 QEMU概述

QEMU是机器模拟器；可以纯软件模拟CPU；搭配KVM内核模块实现硬件辅助高速虚拟化。

> 
> 区别：libvirt是上层管理套件；qemu是底层虚拟机执行程序。可以直接调用qemu‑system‑x86_64命令行启动虚拟机，不使用libvirt。

## 第32章 KVM宿主机硬件特性

- `virtio‑scsi`高性能SCSI控制器；
- `vhost‑net`内核加速virtio‑net网络；
- 多队列virtio‑net；
- VFIO设备直接透传；
- VirtFS 9p目录共享；
- KSM内核同页合并：多台虚拟机相同内存页合并，节省内存；**安全隔离场景不建议开启KSM**。

## 第33章 qemu‑img磁盘镜像工具

> 
> qemu‑img是QEMU磁盘镜像管理工具，独立程序，不运行虚拟机。
> 常用命令：

```
# 创建qcow2镜像
qemu‑img create -f qcow2 test.qcow2 10G

# 镜像格式转换 raw → qcow2
qemu‑img convert -f raw -O qcow2 rawdisk.img test.qcow2

# 检查镜像一致性
qemu‑img check test.qcow2

# 快照管理
qemu‑img snapshot test.qcow2 -c snap1
qemu‑img snapshot test.qcow2 -a snap1
```

qcow2支持后端基础镜像backing‑file，写时复制COW。

## 第34章 qemu‑system‑ARCH直接运行虚拟机

示例最简KVM虚拟机命令行：

```
qemu‑system‑x86_64 -enable‑kvm -m 2G -smp 2 \
‑drive file=test.qcow2,format=qcow2 \
‑netdev user,id=net0 -device virtio‑net‑pci,netdev=net0 \
‑vga virtio
```

参数包含内存、CPU、磁盘、网卡、显卡；VNC显示输出；
`‑vnc :0`开启VNC监听，端口5900。

网络模式：

1. user‑mode用户模式网络（NAT，简单，性能差，不需要root）；
2. tap桥接网络，高性能，需要宿主机tap设备、网桥配置。

## 第35章 QEMU Monitor监控控制台

两种访问Monitor：

1. 虚拟机启动参数`‑monitor stdio`标准输入输出；
2. telnet / unix socket访问QMP（QEMU机器协议，JSON格式，程序自动化调用）。

Monitor交互命令：

- `info`查看虚拟机信息；
- `system_reset`虚拟机重启；
- `savevm` / `loadvm` QEMU内部快照；
- `change` 更换CDROM镜像；
- `migrate` QEMU原生热迁移。

> 
> QMP是JSON协议，libvirt底层就是调用QMP和QEMU交互。

# 第六部分 故障排查

## 第36章 内置帮助与软件包文档

各个虚拟化组件自带man手册：man virsh；man qemu‑img；man virt‑manager；man xl。

## 第37章 收集系统信息与日志

### libvirt日志控制

单体libvirtd日志目录默认：`/var/log/libvirt/`，每个虚拟机单独日志文件。
libvirtd.conf配置日志级别：`log_level=1~4`。
模块化守护进程每个virt*d守护进程独立日志。

### 关键日志位置

1. libvirt虚拟机日志：`/var/log/libvirt/qemu/虚拟机名.log`
2. Xen日志：`/var/log/xen/`
3. QEMU错误、客户代理QGA消息全部记录在此，排错优先查看。

# 术语表（Glossary）

| 术语 | 中文释义 |
| --- | --- |
| Hypervisor | 虚拟机管理程序/虚拟机监视器 |
| VM Host Server | 虚拟化宿主机 |
| VM Guest | 客户虚拟机 |
| Dom0 | Xen特权管理域 |
| DomU | Xen普通客户域 |
| PV Paravirtualized | 半虚拟化 |
| HVM / FV Full Virtualization | 全虚拟化 |
| libvirt | 虚拟化抽象管理库 |
| virt‑manager | 虚拟机管理器图形界面 |
| virsh | libvirt命令行工具 |
| qcow2 | QEMU写时复制磁盘镜像格式 |
| COW | 写时复制 Copy‑On‑Write |
| VFIO | 虚拟功能I/O，PCI设备安全透传框架 |
| SR‑IOV | 单根I/O虚拟化 |
| VirtIO | 半虚拟化IO驱动（磁盘、网卡） |
| Live Migration | 热迁移，在线迁移 |
| Snapshot | 快照 |
| Storage Pool | libvirt存储池 |
| Storage Volume | 存储卷 |
| QGA QEMU Guest Agent | QEMU客户虚拟机代理 |
| OVMF | UEFI虚拟机固件，替代传统BIOS |
| swtpm | 软件TPM模拟器 |
| KSM | 内核同页内存合并 |

# 附录A NVIDIA显卡GPU透传配置

## 简介

本附录描述将NVIDIA显卡通过VFIO透传给虚拟机，用于游戏、GPU计算。

### 前置条件

1. CPU芯片组支持IOMMU；BIOS开启IOMMU；
2. Intel：内核参数`intel_iommu=on`；AMD：`amd_iommu=on`；
3. 显卡独立，不需要宿主机使用该显卡输出画面。

### 宿主机配置步骤

1. 确认IOMMU分组，检查GPU和声卡是否在同一个IOMMU组；同一组设备必须全部透传虚拟机。
2. 屏蔽nouveau开源NVIDIA驱动，防止宿主机占用显卡：
`/etc/modprobe.d/blacklist‑nouveau.conf`

```
blacklist nouveau
options nouveau modeset=0
```

3. 配置vfio模块，写入显卡PCI ID；
4. 内核早期加载vfio‑pci模块；
5. Windows客户机建议关闭MSR漏洞防护；
6. 安装OVMF UEFI固件；
7. 更新initramfs，重启宿主机。

### 虚拟机客户机配置

1. 虚拟机固件使用OVMF UEFI，**不要用传统BIOS**；
2. XML添加hostdev VFIO PCI设备（显卡+配套声卡）；
3. 启动Windows虚拟机，安装NVIDIA官方Windows显卡驱动。

> 
> ⚠常见坑：IOMMU分组冲突；宿主机nouveau没有完全屏蔽；显卡ROM问题；Windows代码43 NVIDIA虚拟机报错，需要配置隐藏虚拟机签名。

