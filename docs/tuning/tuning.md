# 系统分析与调优指南

**摘要**
本指南帮助管理员检测、排查以及优化系统性能问题。

[[toc]]

# 第一部分 基础

## 第1章 系统调优通用说明

> 
> 摘要
> 本手册介绍如何定位性能问题根源，并给出对应的解决手段。**在调优系统之前，应当先排除常见故障，定位真实问题原因，同时制定详细调优计划。随意套用网上调优参数不仅无效，还可能让性能变得更差。**

### 流程1‑1：系统调优通用步骤

1. 明确需要解决的问题。如果性能下降是新出现的，梳理系统近期所有变更。
2. 界定什么现象属于性能问题。
3. 选定可量化的性能指标，用于分析性能（例如延迟、吞吐量、最大并发登录用户数、活跃用户数）。
4. 使用选定指标，测量当前系统性能基线。
5. 定位应用程序消耗时间最多的子系统。
6. 监控系统或应用，采集数据。
7. 分析数据，归类时间消耗的来源。
8. 对定位到的子系统执行调优。
9. **不开启监控，使用同一套指标重新测量性能**。
10. 如果性能依旧达不到预期，回到第3步重复整个流程。

### 明确要解决的问题

调优前，务必精准描述问题。“系统很慢”这种描述没有参考价值。需要区分：是整体系统变慢，还是只在业务高峰时变慢。

同时，问题必须可以量化，否则无法验证调优是否生效，需要可以做**调优前/调优后对比**。指标取决于业务场景。
Web服务器常用指标：

- **延迟**：页面返回耗时
- **吞吐量**：每秒处理页面数、每秒传输MB数据
- **活跃用户**：可接受延迟前提下，最大并发下载页面用户数量

### 排除常见问题

性能故障往往来源于网络、硬件缺陷、软件Bug、错误配置。调优之前优先排查下面项目：

1. 使用`journalctl`查看systemd日志，检查异常报错。
2. 使用`top`、`ps`检查进程，是否存在异常进程疯狂消耗CPU、内存。
3. 查看`/proc/net/dev`排查网络故障。
4. 磁盘IO异常时，优先确认不是硬件故障（smartmontools检测磁盘），也不是磁盘占满。
5. 后台任务尽量调度到系统负载低的时段，同时使用`nice`调低后台任务优先级。
6. 如果一台机器同时跑多个抢占资源的服务，考虑拆分业务到多台服务器。
7. 确保系统软件包全部更新到最新版本。

### 定位瓶颈

定位瓶颈是调优工作最难的环节。openSUSE Leap提供大量工具辅助定位。第二部分《系统监控》介绍通用监控工具与日志分析；如果需要深度长时间分析，参考第三部分《内核监控》。

采集完监控数据之后进行分析：首先确认硬件资源（内存、CPU、总线、磁盘IO、网络IO）本身规格是否足够。硬件资源本身不足，单纯软件调优无法解决问题。硬件规格满足业务，调优才有收益。

### 分步调优

调优必须做好规划：**一次只改动一项配置**。只有这样，才能判断这次改动带来的是性能提升还是性能劣化。每一项调优改动，都要采集足够长时间的数据，确保分析样本有效。
如果改动没有观测到正向收益，不要永久保留该参数，未来业务负载变化后该配置可能带来负面影响。

---

# 第二部分 系统监控

## 第2章 系统监控工具

> 
> 摘要
> 本章介绍一系列查看系统状态的工具，说明常用参数，附带输出示例。
> 示例中首行为输入命令，`[...]`代表输出省略，长输出使用反斜杠换行。工具详细用法请阅读man手册，大部分工具支持`--help`输出简要帮助。

## 多功能综合工具

大部分监控工具只监控系统单一维度，下面工具可以总览全局，用来初步定位需要深入排查的子系统。

### vmstat

vmstat收集进程、内存、交换分区、IO、中断、CPU统计信息。
语法：`vmstat [选项] [间隔秒数 [采样次数]]`

- 不填间隔、采样次数：输出自系统启动以来的平均值。
- 指定delay（单位秒）：按间隔输出实时采样。count指定采样多少次结束，不指定则持续运行直到手动终止。

**示例2‑1：负载较轻机器 vmstat 2**

```
> vmstat 2
procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----
 r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st
 1  0  44264  81520    424 935736    0    0    12    25   27   34  1  0 98   0  0
 0  0  44264  81552    424 935736    0    0     0     0   38   25  0  0 100  0  0
 0  0  44264  81520    424 935732    0    0     0     0   23   15  0  0 100  0  0
 0  0  44264  81520    424 935732    0    0     0     0   36   24  0  0 100  0  0
 0  0  44264  81552    424 935732    0    0     0     0   51   38  0  0 100  0  0
```

**示例2‑2：CPU密集负载机器 vmstat 2**

```
> vmstat 2
procs -----------memory----------- ---swap-- -----io---- -system-- -----cpu------
 r  b   swpd   free   buff   cache   si   so    bi    bo   in   cs us sy id wa st
32  1  26236 459640 110240 6312648    0    0  9944     2 4552 6597 95  5  0  0  0
23  1  26236 396728 110336 6136224    0    0  9588     0 4468 6273 94  6  0  0  0
35  0  26236 554920 110508 6166508    0    0  7684 27992 4474 4700 95  5  0  0  0
28  0  26236 518184 110516 6039996    0    0 10830     4 4446 4670 94  6  0  0  0
21  5  26236 716468 110684 6074872    0    0  8734 20534 4512 4061 96  4  0  0  0
```

> 
> 注意：**第一行输出永远是开机以来的全局平均值，不是当前采样**。

**字段释义**

| 字段 | 说明 |
| --- | --- |
| r | 可运行状态进程数：正在执行或者等待CPU。持续大于CPU核心数，代表CPU资源不足。 |
| b | 等待非CPU资源的阻塞进程数。数值高大概率IO瓶颈（磁盘/网络）。 |
| swpd | 已使用交换分区大小(KB) |
| free | 空闲物理内存(KB) |
| inact | 近期不活跃内存，可以回收；需要`‑a`参数才显示 |
| active | 近期频繁使用内存，一般不会回收；需要`‑a`参数才显示 |
| buff | 文件元数据缓冲区缓存(KB)；`‑a`参数不展示该列 |
| cache | 文件页缓存(KB)；`‑a`参数不展示该列 |
| si | 每秒从交换分区读入内存KB数。长时间si高：休眠进程重新活跃。 |
| so | 每秒写入交换分区KB数。长时间so高：应用内存泄漏。 |
| si+so持续同时很高：发生swap颠簸，物理内存不足，需要增加内存。 |  |
| bi | 每秒从块设备读取块数（磁盘读），swap也会影响该数值。 |
| bo | 每秒写入块设备块数（磁盘写），swap也会影响该数值。 |
| in | 每秒中断次数。高数值代表IO繁忙，查看`/proc/interrupts`确认中断来源。 |
| cs | 每秒上下文切换次数。内核切换不同进程。 |
| us | CPU运行用户态应用代码占比 |
| sy | CPU运行内核代码占比 |
| id | CPU空闲占比。长时间接近0代表CPU跑满，结合r、b列综合判断。 |
| wa | IO等待CPU空闲时间占比。代表CPU在等待IO完成。可能磁盘/网络硬件瓶颈，也需要调优虚拟内存子系统。 |
| st | 虚拟机被宿主机偷取的CPU时间占比。 |

> 
> 更多参数：`vmstat --help`

### dstat

dstat是vmstat、iostat、netstat、ifstat等工具的替代方案，实时输出系统资源统计。可以同时对比磁盘、中断、网络带宽等多维度指标。
输出默认是可读表格，也可以输出CSV，方便导入电子表格处理。基于Python，支持插件扩展。

语法：`dstat [-afv] [选项...] [间隔秒数 [采样次数]]`

不带参数，默认等价`‑cdngy`，每秒刷新持续输出：CPU、磁盘、网络、分页、系统（中断、上下文切换）

```
# dstat
You did not select any stats, using -cdngy by default.
----total-cpu-usage---- -dsk/total- -net/total- ---paging-- ---system--
usr sys idl wai hiq siq| read  writ| recv  send|  in   out | int   csw
  0   0 100   0   0   0|  15k   44k|   0     0 |   0    82B| 148   194
  0   0 100   0   0   0|   0     0 |5430B  170B|   0     0 | 163   187
  0   0 100   0   0   0|   0     0 |6363B  842B|   0     0 | 196   185
```

参数说明

- `-a / --all`：等价`‑cdngy`（默认）
- `-f / --full`：展开CPU、磁盘、网络等列表
- `-v / --vmstat`：等价`‑pmgdsc ‑D total`
- DELAY：采样间隔秒
- COUNT：输出多少次之后退出

更多参考man dstat，项目主页 [http://dag.wieers.com/home‑made/dstat/](http://dag.wieers.com/home%E2%80%91made/dstat/)

### sar — 系统活动报告

sar可以采集CPU、内存、中断、IO、网络几乎全部系统活动，支持实时采集，也可以读取历史采集文件。数据来源为`/proc`文件系统。

> 
> sar属于sysstat软件包。安装：`sudo zypper in sysstat`。服务默认不开启：

```
sudo systemctl enable --now sysstat
```

**sar使用模式**

1. 实时输出：`sar 间隔秒 次数`
2. 读取历史文件：`sar -f 文件名`；不指定文件默认读取`/var/log/sa/saDD`（DD代表日期），该文件由sadc系统活动数据收集器写入。可以多次`‑f`读取多个文件。

示例

```
sar 2 10                     # 实时报告，每2秒输出，一共输出10次
sar -f ~/reports/sar_2014_07_17  #读取历史文件
sar                              #读取今日sa日志文件
cd /var/log/sa && sar -f sa01 -f sa02
```

> 
> sysstat服务停止（关机/重启）时，会自动执行`/usr/lib64/sa/sa1 -S ALL 1 1`抓取最后一刻统计，保存二进制数据。

#### CPU使用报告 sar

不带选项默认输出CPU统计，多CPU机器默认汇总全部CPU。`‑P ALL`输出每一颗CPU独立统计。

```
# sar 10 5
Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (2 CPU)

17:51:29        CPU     %user     %nice   %system   %iowait    %steal     %idle
17:51:39        all     57,93      0,00      9,58      1,01      0,00     31,47
17:51:49        all     32,71      0,00      3,79      0,05      0,00     63,45
17:51:59        all     47,23      0,00      3,66      0,00      0,00     49,11
17:52:09        all     53,33      0,00      4,88      0,05      0,00     41,74
17:52:19        all     56,98      0,00      5,65      0,10      0,00     37,27
Average:        all     49,62      0,00      5,51      0,24      0,00     44,62
```

`%iowait`：CPU空闲等待IO完成占比，长时间高数值代表IO瓶颈。`%idle`长时间为0代表CPU跑满。

#### 内存报告 sar -r

```
# sar -r 10 5
Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (2 CPU)

17:55:27 kbmemfree kbmemused %memused kbbuffers kbcached kbcommit %commit kbactive kbinact kbdirty
17:55:37    104232   1834624    94.62        20   627340  2677656   66.24   802052  828024    1744
17:55:47     98584   1840272    94.92        20   624536  2693936   66.65   808872  826932    2012
17:55:57     87088   1851768    95.51        20   605288  2706392   66.95   827260  821304    1588
17:56:07     86268   1852588    95.55        20   599240  2739224   67.77   829764  820888    3036
17:56:17    104260   1834596    94.62        20   599864  2730688   67.56   811284  821584    3164
Average:     96086   1842770    95.04        20   611254  2709579   67.03   815846  823746    2309
```

kbcommit、%commit：估算当前工作负载需要最大内存（内存+交换分区）。kbcommit单位KB；%commit百分比。

#### 分页统计 sar -B

```
# sar -B 10 5
Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (2 CPU)

18:23:01 pgpgin/s pgpgout/s fault/s majflt/s pgfree/s pgscank/s pgscand/s pgsteal/s %vmeff
18:23:11   366.80     11.60  542.50     1.10  4354.80      0.00      0.00      0.00   0.00
18:23:21     0.00    333.30 1522.40     0.00 18132.40      0.00      0.00      0.00   0.00
18:23:31    47.20    127.40 1048.30     0.10 11887.30      0.00      0.00      0.00   0.00
18:23:41    46.40      2.50  336.10     0.10  7945.00      0.00      0.00      0.00   0.00
18:23:51     0.00    583.70 2037.20     0.00 17731.90      0.00      0.00      0.00   0.00
Average:    92.08    211.70 1097.30     0.26 12010.28      0.00      0.00      0.00   0.00
```

majflt/s（主缺页）每秒需要从磁盘加载页。程序启动阶段大量主缺页属于正常现象；如果应用整个生命周期持续大量主缺页，大概率物理内存不足，搭配pgscand/s扫描指标一起判断。
%vmeff：页回收效率。健康值接近100或者0，不应该长期低于30。

#### 块设备统计 sar -d

搭配`‑p`参数让设备名称可读性更好：

```
# sar -d -p 10 5
 Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (2 CPU)

18:46:09 DEV   tps rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
18:46:19 sda  1.70    33.60      0.00     19.76      0.00      0.47      0.47      0.08
18:46:19 sr0  0.00     0.00      0.00      0.00      0.00      0.00      0.00      0.00

18:46:19 DEV   tps rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
18:46:29 sda  8.60   114.40    518.10     73.55      0.06      7.12      0.93      0.80
18:46:29 sr0  0.00     0.00      0.00      0.00      0.00      0.00      0.00      0.00

18:46:29 DEV   tps rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
18:46:39 sda 40.50  3800.80    454.90    105.08      0.36      8.86      0.69      2.80
18:46:39 sr0  0.00     0.00      0.00      0.00      0.00      0.00      0.00      0.00

18:46:39 DEV   tps rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
18:46:49 sda  1.40     0.00    204.90    146.36      0.00      0.29      0.29      0.04
18:46:49 sr0  0.00     0.00      0.00      0.00      0.00      0.00      0.00      0.00

18:46:49 DEV   tps rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
18:46:59 sda  3.30     0.00    503.80    152.67      0.03      8.12      1.70      0.56
18:46:59 sr0  0.00     0.00      0.00      0.00      0.00      0.00      0.00      0.00

Average: DEV   tps rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
Average: sda 11.10   789.76    336.34    101.45      0.09      8.07      0.77      0.86
Average: sr0  0.00     0.00      0.00      0.00      0.00      0.00      0.00      0.00
```

svctm、%util长期高数值代表IO子系统瓶颈。多磁盘机器尽量均匀分发IO负载；需要考虑存储分层、多路径链路饱和问题。

#### 网络统计 sar -n 关键字

`‑n`输出各类网络报告：

- DEV：所有网卡设备统计
- EDEV：网卡错误统计
- NFS：NFS客户端统计
- NFSD：NFS服务端统计
- SOCK：套接字统计
- ALL：输出全部网络统计

> 
> sar文本报表可读性有限，可以使用kSar（Java工具）可视化sar数据，输出PDF图表，BSD协议开源，项目地址：[https://sourceforge.net/projects/ksar/](https://sourceforge.net/projects/ksar/)

## 系统信息类工具

### iostat — 设备负载信息

iostat用于监控块设备负载，帮助平衡多块物理磁盘IO压力。软件包sysstat。

> 
> iostat第一份报告是开机以来累计统计，后续报告是上一次采样到当前的增量。

```
> iostat
Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (4 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
          17.68    4.49    4.24    0.29    0.00   73.31

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sdb               2.02        36.74        45.73    3544894    4412392
sda               1.05         5.12        13.47     493753    1300276
sdc               0.02         0.14         0.00      13641         37
```

`‑x`输出扩展报告（平均队列长度、平均等待时间）；`‑z`忽略无IO空闲设备。man iostat查看完整字段释义。

指定设备、间隔、采样次数示例：对sda，每3秒输出，一共输出5次

```
> iostat -p sda 3 5
```

NFS文件系统配套工具：

- `nfsiostat‑sysstat`：sysstat包自带
- `nfsiostat`：nfs‑client包自带

多路径环境：iostat默认过滤无IO设备，展示全部设备

```
> iostat -p ALL
```

### mpstat — 处理器活动监控

mpstat查看每个CPU核心活动，单CPU机器输出全局平均值。时间参数语法同iostat。
`mpstat 2 5`：间隔2秒输出，输出5次

```
# mpstat 2 5
Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (2 CPU)

13:51:10  CPU   %usr  %nice  %sys  %iowait  %irq  %soft  %steal  %guest  %gnice   %idle
13:51:12  all   8,27   0,00  0,50     0,00  0,00   0,00    0,00    0,00    0,00   91,23
13:51:14  all  46,62   0,00  3,01     0,00  0,00   0,25    0,00    0,00    0,00   50,13
13:51:16  all  54,71   0,00  3,82     0,00  0,00   0,51    0,00    0,00    0,00   40,97
13:51:18  all  78,77   0,00  5,12     0,00  0,00   0,77    0,00    0,00    0,00   15,35
13:51:20  all  51,65   0,00  4,30     0,00  0,00   0,51    0,00    0,00    0,00   43,54
Average:  all  47,85   0,00  3,34     0,00  0,00   0,40    0,00    0,00    0,00   48,41
```

分析要点：

1. %usr与%sys比例：10:1代表负载主要消耗应用层，优化应用；1:10代表大量内核开销，需要调内核或者定位为什么应用触发大量内核操作。
2. 整体系统负载低，但少数几个CPU核心打满：说明业务没有做多线程并行，适合更高主频、更少核心的CPU。

### turbostat — CPU频率监控

turbostat查看AMD64/Intel64处理器频率、负载、温度、功耗。需要加载内核模块`msr`。
两种运行模式：

1. 后跟命令：fork执行命令，命令结束输出统计。
2. 不带命令：每5秒刷新输出。

```
> sudo turbostat find /etc -type d -exec true {} \;
0.546880 sec
     CPU Avg_MHz   Busy% Bzy_MHz TSC_MHz
       -     416   28.43    1465    3215
       0     631   37.29    1691    3215
       1     416   27.14    1534    3215
       2     270   24.30    1113    3215
       3     406   26.57    1530    3214
       4     505   32.46    1556    3214
       5     270   22.79    1184    3214
```

输出内容取决于CPU硬件型号；`‑‑debug`输出温度功耗更多信息；参考`man 8 turbostat`。

### pidstat — 任务监控

pidstat查看单个/一组任务的资源消耗。不指定PID，输出全部任务。可以设置采样间隔与次数。

示例：监控名字包含firefox的进程，间隔2秒输出，输出3次

```
# pidstat -C firefox 2 3
Linux 6.4.0-150600.9-default (jupiter)         03/11/2024        _x86_64_        (2 CPU)

14:09:11      UID       PID    %usr %system  %guest    %CPU   CPU  Command
14:09:13     1000       387   22,77    0,99    0,00   23,76     1  firefox

14:09:13      UID       PID    %usr %system  %guest    %CPU   CPU  Command
14:09:15     1000       387   46,50    3,00    0,00   49,50     1  firefox

14:09:15      UID       PID    %usr %system  %guest    %CPU   CPU  Command
14:09:17     1000       387   60,50    7,00    0,00   67,50     1  firefox

Average:      UID       PID    %usr %system  %guest    %CPU   CPU  Command
Average:     1000       387   43,19    3,65    0,00   46,84     -  firefox
```

`‑d`参数查看进程IO统计，进程IO等待、阻塞时钟周期。

### dmesg — 内核环形缓冲区

内核消息保存在环形缓冲区，查看命令 `dmesg -T`。旧事件会记录在systemd journal，参考journalctl。

### lsof — 列出已打开文件

查看PID对应进程打开的全部文件。`‑p PID`指定进程ID。
示例查看当前shell进程打开文件（`$$`代表shell自身PID）

```
# lsof -p $$
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF  NODE NAME
bash    8842 root  cwd    DIR   0,32      222  6772 /root
bash    8842 root  rtd    DIR   0,32      166   256 /
bash    8842 root  txt    REG   0,32   656584 31066 /bin/bash
bash    8842 root  mem    REG   0,32  1978832 22993 /lib64/libc-2.19.so
[...]
bash    8842 root    2u   CHR  136,2      0t0     5 /dev/pts/2
bash    8842 root  255u   CHR  136,2      0t0     5 /dev/pts/2
```

`‑i`查看网络套接字：

```
# lsof -i
COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
wickedd-d  917 root    8u  IPv4  16627      0t0  UDP *:bootpc
wickedd-d  918 root    8u  IPv6  20752      0t0  UDP [fe80::5054:ff:fe72:5ead]:dhcpv6-client
sshd      3152 root    3u  IPv4  18618      0t0  TCP *:ssh (LISTEN)
sshd      3152 root    4u  IPv6  18620      0t0  TCP *:ssh (LISTEN)
master    4746 root   13u  IPv4  20588      0t0  TCP localhost:smtp (LISTEN)
master    4746 root   14u  IPv6  20589      0t0  TCP localhost:smtp (LISTEN)
sshd      8837 root    5u  IPv4 293709      0t0  TCP jupiter.suse.de:ssh->venus.suse.de:33619 (ESTABLISHED)
sshd      8837 root    9u  IPv6 294830      0t0  TCP localhost:x11 (LISTEN)
sshd      8837 root   10u  IPv4 294831      0t0  TCP localhost:x11 (LISTEN)
```

### udevadm monitor — 内核与udev事件查看

监听内核uevent事件与udev规则触发事件，打印设备路径DEVPATH。例如插入U盘输出一系列事件。**必须root执行**。

```
Monitoring udev events
UEVENT[1138806687] add@/devices/pci0000:00/0000:00:1d.7/usb4/4-2/4-2.2
UEVENT[1138806687] add@/devices/pci0000:00/0000:00:1d.7/usb4/4-2/4-2.2/4-2.2
UEVENT[1138806687] add@/class/scsi_host/host4
UEVENT[1138806687] add@/class/usb_device/usbdev4.10
UDEV  [1138806687] add@/devices/pci0000:00/0000:00:1d.7/usb4/4-2/4-2.2
UDEV  [1138806687] add@/devices/pci0000:00/0000:00:1d.7/usb4/4-2/4-2.2/4-2.2
UDEV  [1138806687] add@/class/scsi_host/host4
UDEV  [1138806687] add@/class/usb_device/usbdev4.10
UEVENT[1138806692] add@/devices/pci0000:00/0000:00:1d.7/usb4/4-2/4-2.2/4-2.2
UEVENT[1138806692] add@/block/sdb
UEVENT[1138806692] add@/class/scsi_generic/sg1
UEVENT[1138806692] add@/class/scsi_device/4:0:0:0
UDEV  [1138806693] add@/devices/pci0000:00/0000:00:1d.7/usb4/4-2/4-2.2/4-2.2
UDEV  [1138806693] add@/class/scsi_generic/sg1
UDEV  [1138806693] add@/class/scsi_device/4:0:0:0
UDEV  [1138806693] add@/block/sdb
UEVENT[1138806694] add@/block/sdb/sdb1
UDEV  [1138806694] add@/block/sdb/sdb1
UEVENT[1138806694] mount@/block/sdb/sdb1
UEVENT[1138806697] umount@/block/sdb/sdb1
```

## 进程相关工具

### ipcs — 进程间通信

列出当前系统IPC资源（消息队列、共享内存、信号量）

```
# ipcs
------ Message Queues --------
key        msqid      owner      perms      used-bytes   messages

------ Shared Memory Segments --------
key        shmid      owner      perms      bytes      nattch     status
0x00000000 65536      tux        600        524288     2          dest
0x00000000 98305      tux        4194304    2          dest
[...]
------ Semaphore Arrays --------
key        semid      owner      perms      nsems
0xa12e0919 32768      tux        666        2
```

### ps — 进程列表

ps输出进程快照，大部分参数不带横杠。参考`ps --help`与man手册。
查看完整进程列表，带用户与命令行：`ps axu`

```
> ps axu
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.3  34376  4608 ?        Ss   Jul24   0:02 /usr/lib/systemd/systemd
root         2  0.0  0.0      0     0 ?        S    Jul24   0:00 [kthreadd]
root         3  0.0  0.0      0     0 ?        S    Jul24   0:00 [ksoftirqd/0]
root         5  0.0  0.0      0     0 ?        S<   Jul24   0:00 [kworker/0:0H]
root         6  0.0  0.0      0     0 ?        S    Jul24   0:00 [kworker/u2:0]
root         7  0.0  0.0      0     0 ?        S    Jul24   0:00 [migration/0]
[...]
tux      12583  0.0  0.1 185980  2720 ?        Sl   10:12   0:00 /usr/lib/gvfs/gvfs-mtp-volume-monitor
tux      12587  0.0  0.1 198132  3044 ?        Sl   10:12   0:00 /usr/lib/gvfs/gvfs-gphoto2-volume-monitor
tux      12591  0.0  0.1 181940  2700 ?        Sl   10:12   0:00 /usr/lib/gvfs/gvfs-goa-volume-monitor
tux      12594  8.1 10.6 1418216 163564 ?      Sl   10:12   0:03 /usr/bin/gnome-shell
[...]
```

查看sshd进程：

```
> ps -p $(pidof sshd)
  PID TTY      STAT   TIME COMMAND
 1545 ?        Ss     0:00 /usr/sbin/sshd -D
 4608 ?        Ss     0:00 sshd: root@pts/0
```

按内存排序输出进程：

```
> ps ax --format pid,rss,cmd --sort rss
```

常用ps组合：

- `ps aux --sort pmem` 按物理内存占比排序
- `ps aux --sort pcpu` 按CPU占比排序
- `ps axo pid,%cpu,rss,vsz,args,wchan` 输出PID、CPU、RSS、虚拟内存、命令、等待通道
- `ps axf` 进程树视图

### pstree — 进程树

树形打印进程关系，`‑p`显示PID，`‑a`显示完整命令行

```
> pstree
systemd---accounts-daemon---{gdbus}
        |                 |-{gmain}
        |-at-spi-bus-laun---dbus-daemon
        |                 |-{dconf worker}
        |                 |-{gdbus}
        |                 |-{gmain}
        |-at-spi2-registr---{gdbus}
        |-cron
        |-2*[dbus-daemon]
        |-dbus-launch
        |-dconf-service---{gdbus}
        |               |-{gmain}
        |-gconfd-2
        |-gdm---gdm-simple-slav---Xorg
        |     |                 |-gdm-session-wor---gnome-session---gnome-setti+
        |     |                 |                 |               |-gnome-shell+++
[...]
```

### top — 进程实时监视器

top每两秒刷新进程列表，Q键退出。`‑n 1`只输出一次就退出。

```
> top -n 1
Tasks: 128 total,   1 running, 127 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.4 us,  1.2 sy,  0.0 ni, 96.3 id,  0.1 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem:   1535508 total,   699948 used,   835560 free,      880 buffers
KiB Swap:  1541116 total,        0 used,  1541116 free.   377000 cached Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0  116292   4660   2028 S 0.000 0.303   0:04.45 systemd
    2 root      20   0       0      0      0 S 0.000 0.000   0:00.00 kthreadd
[...]
```

交互快捷键

- `Shift+P`：按CPU排序（默认）
- `Shift+M`：按内存RES排序
- `Shift+N`：PID排序
- `Shift+T`：运行时间TIME+排序
- `F`：选择其他排序列
- `Shift+R`：反转排序
- `‑U UID`：只监控指定UID用户进程。示例 `top -U $(id -u)`

### iotop — IO版top

iotop按进程/线程展示IO读写带宽。需要手动安装 `sudo zypper in iotop`。

交互按键

- ← → 切换排序列
- R：反转排序
- O：切换「全部进程 / 只显示正在做IO的进程」等价`‑‑only`
- P：切换「线程 / 进程视图」等价`‑‑processes`
- A：切换瞬时带宽 / 累计IO统计等价`‑‑accumulated`
- I：修改线程IO优先级
- Q：退出
- 其他按键强制刷新屏幕

示例 `iotop --only`，find与emacs产生IO负载时输出：

```
# iotop --only
Total DISK READ: 50.61 K/s | Total DISK WRITE: 11.68 K/s
  TID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN     IO>    COMMAND
 3416 be/4 tux         50.61 K/s    0.00 B/s  0.00 %  4.05 % find /
  275 be/3 root        0.00 B/s    3.89 K/s  0.00 %  2.34 % [jbd2/sda2-8]
 5055 be/4 tux          0.00 B/s    3.89 K/s  0.00 %  0.04 % emacs
```

支持批处理模式`‑b`输出到文件留作后续分析。参考man 8 iotop。

### nice / renice 修改进程nice值（调度优先级）

nice数值范围 **‑20 ~ 19**。数值越大，进程越“谦让”，分得CPU时间越少。只有root可以设置负数高优先级。

适合长时间、非时间敏感、消耗大量CPU的后台任务（例如内核编译），降低nice值，保障web服务等业务进程优先级。

- 不带参数nice：打印当前nice值

```
> nice
0
```

- `nice 命令`：执行命令，nice值+10
- `nice -n 级别 命令`：指定新nice值启动进程
- renice修改已经在运行的进程：`renice +5 -p 3266`
- `renice -u 用户` 修改该用户全部进程nice
- `renice -g 进程组ID` 修改进程组

## 内存工具

### free — 内存使用概览

查看物理内存、交换分区使用情况。

```
> free
             total       used       free     shared    buffers     cached
Mem:      32900500   32703448     197052          0     255668    5787364
-/+ buffers/cache:   26660416    6240084
Swap:      2046972     304680    1742292
```

参数
`‑b / ‑k / ‑m / ‑g`：输出单位字节、KB、MB、GB
`‑s 间隔`：周期性刷新，例`free -s 1.5`每1.5秒刷新。

### /proc/meminfo — 详细内存信息

free命令的数据来源，比free输出更细粒度内存统计。64位系统示例片段：

```
MemTotal:        1942636 kB
MemFree:         1294352 kB
MemAvailable:    1458744 kB
Buffers:             876 kB
Cached:           278476 kB
SwapCached:            0 kB
Active:           368328 kB
Inactive:         199368 kB
Active(anon):     288968 kB
Inactive(anon):    10568 kB
Active(file):      79360 kB
Inactive(file):   188800 kB
Unevictable:          80 kB
Mlocked:              80 kB
SwapTotal:       2103292 kB
SwapFree:        2103292 kB
Dirty:                44 kB
Writeback:             0 kB
AnonPages:        288592 kB
Mapped:            70444 kB
Shmem:             11192 kB
Slab:              40916 kB
SReclaimable:      17712 kB
SUnreclaim:        23204 kB
KernelStack:        2000 kB
PageTables:        10996 kB
NFS_Unstable:          0 kB
Bounce:                0 kB
WritebackTmp:          0 kB
CommitLimit:     3074608 kB
Committed_AS:    1407208 kB
VmallocTotal:   34359738367 kB
VmallocUsed:      145996 kB
VmallocChunk:   34359588844 kB
HardwareCorrupted:     0 kB
AnonHugePages:     86016 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
DirectMap4k:       79744 kB
DirectMap2M:     2017280 kB
```

字段释义

| 字段 | 含义 |
| --- | --- |
| MemTotal | 全部物理内存总量 |
| MemFree | 完全空闲内存 |
| MemAvailable | 估算可分配给新程序、无需swap的内存 |
| Buffers | 文件系统元数据缓冲区 |
| Cached | 页缓存，不含buffer与swap缓存，包含shmem共享内存 |
| SwapCached | 已经换出到swap、但还保留在内存中的页缓存 |
| Active | 最近经常使用，一般不回收；=Active(anon)+Active(file) |
| Active(anon) | 匿名页内存（私有映射、写时复制页），swap回写对象 |
| Active(file) | 文件映射缓存页 |
| Inactive | 近期较少使用，优先回收；=Inactive(anon)+Inactive(file) |
| Unevictable | 不可回收内存，mlock锁定、ramdisk等 |
| Mlocked | mlock系统调用锁定内存 |
| Dirty | 已经修改，等待刷入磁盘的内存。vm.dirty_*系列sysctl参数控制阈值；大量dirty会造成IO卡顿。 |
| Writeback | 正在回写到磁盘的脏页 |
| AnonPages | 匿名内存页，无后端文件 |
| Mapped | mmap映射内存 |
| Shmem | 共享内存：IPC、tmpfs、匿名共享映射 |
| Slab | 内核对象缓存内存分配 |
| SReclaimable | 可回收slab（inode、dentry缓存） |
| SUnreclaim | 不可回收slab内存 |
| KernelStack | 内核栈占用内存，来自系统调用的进程 |
| PageTables | 全部进程页表消耗内存 |
| CommitLimit | 基于overcommit内存超配策略，系统最大可分配内存上限 |
| Committed_AS | 估算所有进程最坏情况需要内存总和（内存+swap） |
| VmallocTotal | 内核虚拟地址空间总大小 |
| VmallocUsed | 已经使用vmalloc虚拟地址空间 |
| VmallocChunk | 最大连续空闲vmalloc块 |
| HardwareCorrupted | ECC内存检测到损坏内存页 |
| AnonHugePages | 透明大页THP匿名大页，程序没有显式申请，内核自动分配 |
| HugePages_* | 静态预分配巨页配置 |
| Hugepagesize | 巨页大小，x86_64默认2048KB |
| DirectMap4k / DirectMap2M | 内核直接映射内存，分别4K页、2M大页 |

### smaps — 进程内存细粒度统计

top、ps无法精确统计一个进程真实占用内存。`/proc/<PID>/smaps`文件可以区分共享内存、私有内存，统计进程真实内存开销。

> 
> 读取smaps开销较大，不适合频繁监控，适合针对特定进程深度排查。参考内核源码文档`/usr/src/linux/Documentation/filesystems/proc.txt`，需要kernel‑source包。

### numatop — NUMA架构监控

NUMA（非统一内存访问）硬件平台工具。统计本地内存访问LMA、远程内存访问RMA，RMA/LMA比值，定位NUMA内存访问性能瓶颈。
支持PowerPC、Intel Xeon 5500/6500/7500、E7‑x8xx、E5系列CPU。
安装：`sudo zypper in numatop`，直接命令`numatop`运行；`man numatop`查看手册。

## 网络工具

> 
> 网络故障排查首先确认是否开启流量整形QoS规则。

### ip — 基础网络诊断工具

ip工具配置网络接口，查看网卡统计：错误包、丢包、冲突计数。

- `ip addr show`（简写`ip a`）查看所有网卡
- `ip addr show up` 只看已经UP启用的网卡
- `ip -s link show 设备名` 查看指定网卡详细统计

```
# ip -s link show br0
6: br0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT
    link/ether 00:19:d1:72:d4:30 brd ff:ff:ff:ff:ff:ff
    RX: bytes  packets  errors  dropped overrun mcast
    6346104756 9265517  0       10860   0       0
    TX: bytes  packets  errors  dropped carrier collsns
    3996204683 3655523  0       0       0       0
```

`ip route`查看路由表，`ip link`查看链路层。完整参考`man 8 ip`。

### nethogs — 按进程统计网络流量

类似top，按进程统计收发网络流量，快速定位哪个进程产生大量网络流量。

```
PID   USER  PROGRAM                                DEV   SENT   RECEIVED
27145 root   zypper                                eth0  5.719  391.749 KB/sec
?     root   ..0:113:80c0:8080:10:160:0:100:30015        0.102    2.326 KB/sec
26635 tux    /usr/lib64/firefox/firefox            eth0  0.026    0.026 KB/sec
[...]
TOTAL                                                  5.916  394.192 KB/sec
```

交互快捷键

- M：切换显示单位KB/s / KB / B / MB
- R：按接收流量排序
- S：按发送流量排序
- Q：退出

### ethtool — 网卡详细配置查看

查看、修改以太网网卡硬件参数，例如协商速率、流控、中断合并、卸载特性offload。

```
# ethtool eth0
Settings for eth0:
 Supported ports: [ TP ]
 Supported link modes:   10baseT/Half 10baseT/Full
                         100baseT/Half 100baseT/Full
                         1000baseT/Full
 Supports auto-negotiation: Yes
 Advertised link modes:  10baseT/Half 10baseT/Full
                         100baseT/Half 100baseT/Full
                         1000baseT/Full
 Advertised pause frame use: No
[...]
 Link detected: yes
```

查询选项：

- `-a`：流控参数
- `-c`：中断合并coalesce
- `-g`：RX/TX环形缓冲区ring参数
- `-i`：网卡驱动信息
- `-k`：硬件卸载offload功能
- `-S`：网卡与驱动专属统计计数器

### ss — 查看套接字状态

替代老旧netstat，输出套接字统计。不带参数列出全部套接字。

```
# ss
Netid  State      Recv-Q Send-Q   Local Address:Port       Peer Address:Port
u_str  ESTAB      0      0                    * 14082                 * 14083
u_str  ESTAB      0      0                    * 18582                 * 18583
[...]
```

常用参数

- `-l`：列出所有监听端口
- `-t`：TCP套接字
- `-u`：UDP套接字
- `-p`：显示套接字所属进程PID和程序名
- `-a`：全部（监听+已建立连接）

示例，查看所有TCP连接以及对应进程：

```
# ss -t -a -p
State    Recv-Q Send-Q  Local Address:Port   Peer Address:Port
LISTEN   0      128                  *:ssh                 *:*  users:(("sshd",1551,3))
LISTEN   0      100         127.0.0.1:smtp                 *:*  users:(("master",1704,13))
ESTAB    0      132      10.120.65.198:ssh  10.120.4.150:55715  users:(("sshd",2103,5))
LISTEN   0      128                 :::ssh                :::*  users:(("sshd",1551,4))
LISTEN   0      100               ::1:smtp                :::*  users:(("master",1704,14))
```

## /proc虚拟文件系统

/proc是伪文件系统，内核把系统信息导出为虚拟文件。
示例查看CPU信息：`cat /proc/cpuinfo`
查看中断统计：`cat /proc/interrupts`
查看进程内存映射：`cat /proc/self/maps`

重要文件目录

- `/proc/devices`：已注册设备
- `/proc/modules`：已加载内核模块
- `/proc/cmdline`：内核启动命令行参数
- `/proc/meminfo`：内存统计
- `/proc/config.gz`：当前运行内核编译配置压缩包
- `/proc/PID/*`：每个进程ID对应子目录，存放进程全部信息。`/proc/self`代表当前进程。

参考文档：`/usr/src/linux/Documentation/filesystems/proc.txt`，需要kernel‑source包。

### procinfo

汇总/proc的信息输出友好报告：

```
> procinfo
Linux 3.11.10-17-desktop (geeko@buildhost) (gcc 4.8.1 20130909) #1 4CPU [jupiter.example.com]

Memory:      Total        Used        Free      Shared     Buffers      Cached
Mem:       8181908     8000632      181276           0       85472     2850872
Swap:     10481660        1576    10480084

Bootup: Mon Jul 28 09:54:13 2014    Load average: 1.61 0.85 0.74 2/904 25949

user  :       1:54:41.84  12.7%  page in :    2107312  disk 1:    52212r   20199w
nice  :       0:00:00.46   0.0%  page out:    1714461  disk 2:    19387r   10928w
system:       0:25:38.00   2.8%  page act:     466673  disk 3:      548r      10w
IOwait:       0:04:16.45   0.4%  page dea:     272297
hw irq:       0:00:00.42   0.0%  page flt:  105754526
sw irq:       0:01:26.48   0.1%  swap in :          0
idle  :      12:14:43.65  81.5%  swap out:        394
guest :       0:02:18.59   0.2%
uptime:       3:45:22.24         context :   99809844
[...]
```

`‑a`输出完整信息；`‑n N`每N秒刷新；`‑d`输出增量差值。Q键退出。

### /proc/sys — 系统控制参数（sysctl）

/proc/sys存放内核运行时可调参数。使用`sysctl`命令查看修改。

- `sysctl -a`列出全部参数
- `sysctl 参数名`查看单个参数
- `sysctl -w 参数=值`临时修改，重启失效
- 永久修改：写入`/etc/sysctl.conf`

参数分类子目录

1. `sysctl dev`：设备相关
2. `sysctl fs`：文件系统、文件句柄、配额
3. `sysctl kernel`：调度、共享内存等内核全局
4. `sysctl net`：网络（主要net/ipv4子目录）
5. `sysctl vm`：虚拟内存、swap、缓存回收参数

> 
> 详细文档在内核源码文档，需要安装kernel‑source包。

## 硬件信息工具

### lspci — PCI设备信息lspci — PCI 设备信息

查看PCI总线设备，一般需要root权限获取完整配置信息。
```bash
# lspci
00:00.0 主机桥: Intel Corporation 82845G/GL[Brookdale‑G]/GE/PE 内存控制器/主机集线器接口 (rev 01)
00:01.0 PCI桥: Intel Corporation 82845G/GL[Brookdale‑G]/GE/PE 主机转AGP桥 (rev 01)
00:1d.0 USB控制器: Intel Corporation 82801DB/DBL/DBM (ICH4/ICH4‑L/ICH4‑M) USB UHCI控制器 #1 (rev 01)
00:1d.1 USB控制器: Intel Corporation 82801DB/DBL/DBM (ICH4/ICH4‑L/ICH4‑M) USB UHCI控制器 #2 (rev 01)
00:1d.2 USB控制器: Intel Corporation 82801DB/DBL/DBM (ICH4/ICH4‑L/ICH4‑M) USB UHCI控制器 #3 (rev 01)
00:1d.7 USB控制器: Intel Corporation 82801DB/DBM (ICH4/ICH4‑M) USB2 EHCI控制器 (rev 01)
00:1e.0 PCI桥: Intel Corporation 82801 PCI桥 (rev 81)
00:1f.0 ISA桥: Intel Corporation 82801DB/DBL (ICH4/ICH4‑L) LPC接口桥 (rev 01)
00:1f.1 IDE接口: Intel Corporation 82801DB (ICH4) IDE控制器 (rev 01)
00:1f.3 SMBus: Intel Corporation 82801DB/DBL/DBM (ICH4/ICH4‑L/ICH4‑M) SMBus控制器 (rev 01)
00:1f.5 多媒体音频控制器: Intel Corporation 82801DB/DBL/DBM (ICH4/ICH4‑L/ICH4‑M) AC'97音频控制器 (rev 01)
01:00.0 VGA兼容控制器: Matrox Graphics, Inc. G400/G450 (rev 85)
02:08.0 以太网控制器: Intel Corporation 82801DB PRO/100 VE (LOM) 以太网控制器 (rev 81)
```

- `-v`：输出详细信息；
- `-vv`：输出全部可查询的设备信息；
- `-n`：只输出数字ID，不输出设备名称。

设备名称解析数据库文件路径：`/usr/share/pci.ids`，不在库中的设备会标记为“未知设备”。

### lsusb — USB设备
列出USB设备。`‑v`输出详细信息，信息读取自`/proc/bus/usb/`。
示例输出（集线器、U盘、硬盘、鼠标）：
```bash
# lsusb
Bus 004 Device 007: ID 0ea0:2168 Ours Technology, Inc. Transcend JetFlash 2.0 / Astone USB Drive
Bus 004 Device 006: ID 04b4:6830 Cypress Semiconductor Corp. USB‑2.0 IDE Adapter
Bus 004 Device 005: ID 05e3:0605 Genesys Logic, Inc.
Bus 004 Device 001: ID 0000:0000
Bus 003 Device 001: ID 0000:0000
Bus 002 Device 001: ID 0000:0000
Bus 001 Device 005: ID 046d:c012 Logitech, Inc. Optical Mouse
Bus 001 Device 001: ID 0000:0000
```

### tmon — 热子系统监控调优工具
tmon用于可视化、调优、测试系统复杂热管理子系统。不带参数进入监控模式。
> tmon软件包默认不会安装。详细用法参考`man 8 tmon`。

### mcelog — 机器检查异常(MCE)
> 仅支持AMD64/Intel 64平台

mcelog软件包记录、解析硬件机器检查异常，包含IO、CPU、内存硬件错误。支持预测坏页下线、缓存错误时自动将CPU核心下线。旧版本依靠每小时cron任务，新版本由守护进程实时处理硬件错误。

openSUSE Leap支持AMD可扩展机器检查架构Scalable MCA，提升Zen系列CPU硬件错误上报能力。
配置文件`/etc/mcelog/mcelog.conf`，参考`man mcelog`与官网 https://mcelog.org/。

示例配置片段：
```ini
daemon = yes
filter = yes
filter‑memory‑errors = yes
no‑syslog = yes
logfile = /var/log/mcelog
run‑credentials‑user = root
run‑credentials‑group = nobody
client‑group = root
socket‑path = /var/run/mcelog‑client
```

启用并启动服务：
```bash
# systemctl enable mcelog
# systemctl start mcelog
```

### dmidecode — DMI表解析工具（AMD64/Intel 64）
读取DMI（桌面管理接口）固件信息，包含序列号、BIOS版本等硬件信息。
```bash
# dmidecode
# dmidecode 2.12
SMBIOS 2.5 present.
27 structures occupying 1298 bytes.
Table at 0x000EB250.

Handle 0x0000, DMI type 4, 35 bytes
处理器信息
        插槽标识: J1PR
        类型: 中央处理器
        系列: Other
        制造商: Intel(R) Corporation
        ID: E5 06 01 00 FF FB EB BF
        版本: Intel(R) Core(TM) i5 CPU         750  @ 2.67GHz
        电压: 1.1 V
        外部时钟: 133 MHz
        最大速度: 4000 MHz
        当前速度: 2667 MHz
        状态: 已安装,已启用
        升级方式: Other
        L1缓存句柄: 0x0004
        L2缓存句柄: 0x0003
        L3缓存句柄: 0x0001
        序列号: Not Specified
        资产标签: Not Specified
        部件号: Not Specified
[...]
```

## 文件与文件系统工具
### file — 判断文件类型
读取`/usr/share/misc/magic`魔术数据库识别文件类型。
```bash
> file /usr/bin/file
/usr/bin/file: ELF 64‑bit LSB可执行文件, x86‑64, version 1 (SYSV), for GNU/Linux 2.6.4, 动态链接(使用共享库),已去除符号信息
```
常用参数：
- `-f 文件名列表`：批量检测列表内文件；
- `-z`：检测压缩包内部文件类型；
- `-i`：输出MIME类型字符串。

### mount、df、du — 文件系统与磁盘使用
`mount`查看当前挂载设备、挂载点、文件系统类型与挂载参数。
`df -h`以人类可读格式查看各分区总容量、已用、可用、使用率、挂载点。
`du -sh 目录`统计目录总占用磁盘大小。

### readelf — ELF二进制文件附加信息
解析ELF可执行文件，支持其他架构编译生成的二进制文件。
```bash
> readelf --file‑header /bin/ls
ELF头:
  Magic:   7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00
  Class:                             ELF64
  Data:                              2补码,小端序
  Version:                           1 (当前)
  OS/ABI:                            UNIX ‑ System V
  ABI版本:                           0
  类型:                              EXEC (可执行文件)
  机器:                              Advanced Micro Devices X86‑64
  版本:                           0x0
  入口点地址:               0x402540
  程序头起始偏移:          64 (字节)
  节头起始偏移:          95720 (字节)
  标志位:                             0x0
  此头大小:               64 (字节)
  程序头大小:           56 (字节)
  程序头条目数量:         9
  节头大小:               64 (字节)
  节头条目数量:         32
  节头字符串表索引: 31
```

### stat — 获取文件属性
查看文件完整元数据：大小、块数、IO块、权限、UID/GID、访问/修改/变更时间。
```bash
> stat /etc/profile
  File: `/etc/profile'
  Size: 9662            Blocks: 24         IO Block: 4096   普通文件
Device: 802h/2050d      Inode: 132349      Links: 1
Access: (0644/‑rw‑r‑‑r‑‑)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2009‑03‑20 07:51:17.000000000 +0100
Modify: 2009‑01‑08 19:21:14.000000000 +0100
Change: 2009‑03‑18 12:55:31.000000000 +0100
```
`‑‑file‑system`查看文件所在文件系统信息。

## 用户信息工具
### fuser — 查看访问文件的进程
识别哪些进程正在访问某个文件/挂载点。常用于卸载时提示`device is busy`的排错。
```bash
> fuser -v /mnt/*

                     USER        PID ACCESS COMMAND
/mnt/notes.txt       tux    26597 f....  less
```
> 终止占用进程之后才可以正常卸载。`‑k`参数可以直接杀死占用该文件的进程。

### w — 查看登录用户与正在执行的操作
显示已登录用户、终端、来源IP、空闲时间、CPU占用、当前运行命令。
```bash
> w
 16:00:59 up 1 day,  2:41,  3 users,  load average: 0.00, 0.01, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
tux      :0       console          Wed13   ?xdm?   8:15   0.03s /usr/lib/gdm/gd
tux      console  :0               Wed13   26:41m  0.00s  0.03s /usr/lib/gdm/gd
tux      pts/0    :0               Wed13   20:11   0.10s  2.89s /usr/lib/gnome‑
```
`‑f`显示远程登录的客户端主机名。

## 时间与日期工具
### time — 测量命令执行耗时
区分bash内置time命令与独立程序`/usr/bin/time`。输出**实际总耗时（墙上时钟）、用户态CPU时间、内核态CPU时间**。
```bash
> time find . > /dev/null

real    0m4.051s
user    0m0.042s
sys     0m0.205s
```
独立程序加`‑v`输出详细资源统计：
```bash
/usr/bin/time -v find . > /dev/null
        命令: "find ."
        用户时间(秒): 0.24
        系统时间(秒): 2.08
        CPU占用百分比: 25%
        运行总耗时: 0:09.03
        平均共享文本段大小(kbytes): 0
        平均非共享数据大小(kbytes): 0
        平均总驻留内存大小(kbytes): 0
        最大驻留集RSS(kbytes): 2516
        次要缺页: 1564
        主要缺页: 0
        自愿上下文切换: 36660
        非自愿上下文切换: 496
        交换次数: 0
        文件读入: 0
        文件写出: 0
        套接字消息发送: 0
        套接字消息接收: 0
        信号投递: 0
        页大小(bytes): 4096
        退出状态: 0
```

### RRDtool — 时序数据绘图工具
RRDtool（轮询数据库工具），存储时间序列指标数据，可以生成性能图表，例如温度、网络流量。openSUSE Leap自带。
安装：`sudo zypper install rrdtool`。支持Perl/Python/Ruby/PHP语言绑定开发自定义监控脚本。

#### RRDtool工作原理
RRD是环形循环缓冲区数据库，容量固定，旧数据会被覆盖。适合周期性采样传感器指标。完整工作流程：**创建数据库 → 更新采样数据 → 生成图表**。

#### 实操示例：监控内存空闲值
每4秒采样一次空闲内存，运行10次；启动/关闭Firefox、Evolution、Eclipse制造内存变化。
1. 编写采集脚本`free_mem.sh`
```bash
INTERVAL=4
for steps in {1..10}
do
    DATE=`date +%s`
    FREEMEM=`free -b | grep "Mem" | awk '{ print $4 }'`
    sleep $INTERVAL
    echo "rrdtool update free_mem.rrd $DATE:$FREEMEM"
done
```
> `date +%s`输出Unix时间戳，单位秒，从1970‑01‑01 00:00 UTC开始计数；free `-b`以字节输出。

运行脚本，输出保存日志：
```bash
sh free_mem.sh > free_mem_updates.log
```

2. 创建RRD数据库
```bash
> rrdtool create free_mem.rrd --start 1272974834 --step=4 \
DS:memory:GAUGE:600:U:U RRA:AVERAGE:0.5:1:24
```
- `‑‑start`：第一条数据的时间戳；
- `‑‑step=4`：采样间隔4秒；
- DS定义数据源：类型GAUGE（直接存储原始值），超时600秒，上下限未知U；
- RRA归档：保存24条平均值记录，0.5为置信系数。

3. 更新数据库
```bash
sh free_mem_updates.log
```

4. 读取数据
```bash
> rrdtool fetch free_mem.rrd AVERAGE --start 1272974830 --end 1272974871
          memory
1272974832: nan
1272974836: 1.1729059840e+09
1272974840: 1.1461806080e+09
1272974844: 1.0807572480e+09
1272974848: 1.0030243840e+09
1272974852: 8.9019289600e+08
1272974856: 8.3162112000e+08
1272974860: 9.1693465600e+08
1272974864: 1.1801251840e+09
1272974868: 1.1799787520e+09
1272974872: nan
```
`nan`代表无有效采样数据。

5. 生成PNG图片
```bash
> rrdtool graph free_mem.png \
--start 1272974830 \
--end 1272974871 \
--step=4 \
DEF:free_memory=free_mem.rrd:memory:AVERAGE \
LINE2:free_memory#FF0000 \
--vertical‑label "GB" \
--title "Free System Memory in Time" \
--zoom 1.5 \
--x‑grid SECOND:1:SECOND:4:SECOND:10:0:%X
```

> 配套MRTG工具可以做SNMP网络设备监控。更多参考man手册与RRDtool官网。

---

# 第3章 系统日志文件
系统日志分析是系统维护与故障排查最重要工作之一。openSUSE Leap会详细记录系统几乎全部事件。systemd环境中内核、系统服务消息写入systemd‑journal；其他应用日志存放在`/var/log/`纯文本文件，可以用编辑器、脚本解析过滤。

## /var/log/系统日志目录
> 大部分日志文件仅root用户可读。不同软件包安装后会新增日志子目录与文件。

|路径 |用途说明 |
|---|---|
|apparmor/ | AppArmor安全模块日志 |
|audit/ | Linux审计框架日志 |
|ConsoleKit/ | 用户会话跟踪守护进程日志 |
|cups/ | CUPS打印系统访问与错误日志 |
|firewall | 防火墙日志 |
|gdm/ | GNOME显示管理器日志 |
|krb5/ | Kerberos认证日志 |
|lastlog | 用户最后一次登录数据库；命令`lastlog`查看 |
|localmessages | 部分开机脚本输出，例如DHCP客户端 |
|mail* | Postfix/sendmail邮件服务器日志 |
|messages | **系统与内核通用日志，排错首要查看** |
|NetworkManager | 网络管理器日志 |
|news/ | 新闻组服务日志 |
|chrony/ | NTP时间同步服务chrony日志 |
|pk_backend_zypp* | PackageKit软件包管理后端zypp日志 |
|samba/ | Samba Windows文件共享日志 |
|warn | 警告、错误日志，故障排查重点 |
|wtmp | 全部登录登出、远程连接记录；`last`命令读取 |
|Xorg.NUMBER.log | X图形服务日志；普通用户会话日志在`~/.local/share/xorg/` |
|YaST2/ | YaST系统配置工具全部日志 |
|zypp/ | libzypp包管理器历史日志 |
|zypper.log | zypper命令行包管理器日志 |

## 查看与解析日志文件
文本控制台查看工具：`less`、`more`分页；`head`看头部、`tail`看尾部；`tail -f`实时跟踪日志新增行。
搜索过滤：`grep`正则搜索，`awk`做结构化解析。
YaST控制面板也提供图形化日志查看模块「杂项‑>系统日志」。

## logrotate — 日志轮转管理
日志文件会持续膨胀。`logrotate`实现日志自动轮转、压缩、删除、邮件转发。支持按时间（日/周/月）或者按文件大小触发轮转。
systemd每日触发logrotate。配置主文件`/etc/logrotate.conf`；软件包会把专属配置放入`/etc/logrotate.d/*.conf`，主配置会include该目录。

示例`/etc/logrotate.conf`：
```conf
# man logrotate查看完整说明
weekly          # 每周轮转一次
rotate 4        # 保留最近4个轮转备份
create          # 轮转后新建空日志文件
dateext         # 备份文件名附加日期后缀
#compress      # 是否开启gzip压缩，默认关闭
compresscmd /usr/bin/bzip2
uncompresscmd /usr/bin/bunzip2

include /etc/logrotate.d
```
> `create`指令会参考`/etc/permissions*`权限配置，避免权限冲突。

## logwatch — 日志监控报告工具
logwatch是可定制插件式日志分析脚本，解析系统日志，提炼可读的故障报告。需要安装软件包`logwatch`。
可以直接控制台输出、保存文件、邮件发送报告，适合cron定时执行。

示例：输出昨天全部内核消息报告
```bash
logwatch --service kernel --range yesterday
```

## 配置root邮件转发
系统守护进程会给root发送邮件通知，可以配置`/etc/aliases`将root邮件转发到外部邮箱。修改后执行`newaliases`生效。

## 将日志转发到中央syslog服务器
大型环境，把多台主机日志统一发送到一台集中日志服务器。
1. **配置中央syslog服务器**
开启rsyslog服务接收远程日志，修改rsyslog配置，开启UDP/TCP监听端口，重启rsyslog。防火墙开放514端口。
2. **配置客户端机器**
在每台客户机rsyslog配置添加转发规则，将本地日志发送到中央服务器IP，重启rsyslog。

## logger — 手动写入系统日志
命令`logger`可以手动向syslog写入自定义日志消息，常用于脚本：
```bash
logger "备份任务已完成"
```

---

# 第三部分 内核监控
## 第4章 SystemTap — 过滤与分析系统数据
> 摘要
SystemTap是Linux动态跟踪工具。不需要重新编译内核，编写脚本就可以探测内核、用户态程序事件，采集性能、调试数据。

### 概念总览
- **SystemTap脚本**：`.stp`后缀脚本，描述要探测什么事件、触发后执行什么处理逻辑。
- **Tapset（探针库）**：系统预置脚本库，封装常用探针，直接调用，不用手写底层事件。
- **命令与权限**：运行stap需要root权限。
- **重要文件目录**
    - `/usr/share/systemtap/tapset/`：系统tapset库；
    - `/lib/modules/$(uname ‑r)/build`：内核源码树；
    - `/var/cache/systemtap`：编译生成探针模块缓存。

### 安装部署
需要软件包：`systemtap`、对应内核的`kernel‑devel`、`kernel‑headers`。
校验环境：
```bash
stap‑prep‑check
```

### 脚本语法
1. **探针格式 probe**：`probe 事件 { 处理语句 }`
2. **SystemTap事件（探针点probe points）**：
    - kernel.function("函数名") 内核函数进入；
    - kernel.function("函数名").return 内核函数返回；
    - kernel.trace("tracepoint事件名") 内核tracepoint跟踪点；
    - process("二进制路径").function("函数名") 用户态进程函数。
3. **处理体probe body**：事件触发后执行代码，可以打印变量、统计计数、保存数据。

简单示例脚本`helloworld.stp`：
```stap
probe begin {
    printf("SystemTap 启动\n")
}
probe end {
    printf("SystemTap 退出\n")
}
```
运行：`stap helloworld.stp`

> 用户态探测需要二进制带调试符号包。更多参考`man stap`。

## 第5章 内核探针 Kprobes
### 支持架构
Kprobes支持主流硬件架构x86_64、aarch64等。

### 探针类型
1. **Kprobes**：在任意内核指令地址插入断点，指令执行前触发回调函数；
2. **Jprobes**：专门探测函数入口；
3. **Return probe(kretprobe)**：捕获内核函数返回，拿到返回值。

### Kprobes API
内核模块API；通过`debugfs`文件系统接口也可以操作kprobes，不需要写C模块。
`/sys/kernel/debug/kprobes/`目录：注册、查看、启用、禁用kprobe。
> 注意：生产环境慎用，错误探针会导致内核panic。

## 第6章 Perf — 基于硬件的性能监控工具
> 摘要
perf利用CPU硬件性能计数器PMU做采样统计，分析CPU、缓存、指令、分支预测等硬件层面性能瓶颈。

- **采样Sampling**：定时采集指令、调用栈样本；
- **计数Counting**：统计事件总发生次数。

安装软件包`perf`。
常用子命令：
1. `perf stat 程序`：统计程序各类硬件事件总计数；
2. `perf record ./app`：记录运行时采样数据，输出perf.data；
3. `perf report`：分析perf.data，生成热点函数报告；
4. `perf top`：实时类似top，显示消耗最多事件的函数符号。

示例：统计ls命令运行硬件事件
```bash
perf stat ls
```
> 参考`man perf‑list`查看全部可监控事件。

## 第7章 OProfile — 全系统分析器
> 摘要
OProfile是全系统性能分析工具，基于硬件性能计数器，统计内核、用户进程库的CPU占用。

安装需要`oprofile`包。核心工具：
- `opcontrol`：控制采集启停；
- `opreport`：生成性能报告；
- `opannotate`：源码级注释，显示每行代码采样计数。

工作流程：配置采集事件 → 启动采集，复现业务负载 → 停止采集 → 生成报告。

> 注意：OProfile部分现代系统已经逐步被perf替代。

## 第8章 Dynamic debug 动态调试消息
内核动态调试Dynamic‑debug，可以动态打开/关闭内核源码里pr_debug()调试打印，**不需要重新编译内核**。
挂载debugfs：
```bash
mount ‑t debugfs none /sys/kernel/debug
```
查看状态：`cat /sys/kernel/debug/dynamic_debug/control`。
可以按模块、文件名、函数名控制是否输出调试日志。开启后dmesg就可以看到对应调试信息。

---

# 第四部分 资源管理
## 第9章 系统通用资源管理
### 安装规划
1. **分区规划**：合理划分分区；区分/、/home、/var、swap；SSD/HDD不同介质分区策略。
2. **安装组件范围**：只安装业务需要软件包，减少后台服务。
3. **默认systemd目标**：服务器使用multi‑user.target（无图形），减少图形组件资源开销。
4. **关闭不必要服务**：禁用不使用的systemd单元，减少内存、CPU、套接字消耗。`systemctl disable --now 服务名`。

### 文件系统与磁盘访问
#### 文件系统选型
不同文件系统（Btrfs、XFS、ext4）性能特性、开销、快照能力不一样，根据业务选择。

#### 时间戳更新策略
挂载参数`noatime`：关闭文件访问时间atime更新，减少磁盘写IO。
> 挂载选项示例 `/etc/fstab`：
> `UUID=xxx  /  ext4  defaults,noatime  0 1`

#### ionice — 设置磁盘IO调度优先级
ionice修改进程IO调度优先级，分为3个级别：
1. 实时real‑time；
2. 最佳努力best‑effort（默认）；
3. 空闲idle，只有磁盘无其他IO时才执行本进程IO。

示例启动进程直接指定IO优先级：
```bash
ionice ‑c 3 find / -name *.log
```
修改已经运行PID：
```bash
ionice ‑p 1234 ‑c 2 ‑n 7
```

## 第10章 内核控制组 cgroup
> 摘要
cgroup（控制组），把一组进程归类，做资源记账、设置资源上限，限制CPU、内存、IO、任务数量。openSUSE Leap使用混合cgroup v1/v2层级。

### 资源记账 Accounting
统计组内进程CPU、内存、IO使用量。

### 设置资源上限 Limits
对组设置最大CPU配额、最大内存、最大IO带宽。

### TasksMax：防止fork炸弹
限制一个cgroup内最大任务（进程+线程）数量，抵御fork炸弹。
- 查看默认值：`systemctl show ‑p DefaultTasksMax`
- 覆盖全局默认：修改`/etc/systemd/system.conf` `DefaultTasksMax=`。
- 用户会话默认TasksMax限制，防止普通用户创建海量进程耗尽PID。

### cgroup IO控制器
> 前置条件：IO调度器支持blk‑cgroup；块设备使用mq多队列IO栈。
配置IO带宽上限、IOPS上限，限制组读写磁盘速率。注意：IO控制期望值设置，不能100%隔离，受硬件缓存影响。

### 用户会话资源控制
systemd把每个用户登录会话放到独立cgroup，实现会话资源隔离。

> man systemd‑resources 查看详细文档。

## 第11章 NUMA自动平衡
NUMA（非统一内存访问架构），多CPU服务器，每个CPU节点本地内存访问更快，跨节点远程内存访问延迟更高。
内核`numa_balancing`自动迁移页，尽量把内存页放到进程运行CPU的本地内存节点，降低远程访问开销。
- 配置：`sysctl kernel.numa_balancing` 0关闭，1开启；
- 监控：`numatop`工具；
- 影响：会产生少量CPU开销；对内存访问模式高度局部化负载收益明显。

## 第12章 电源管理
### CPU层面电源管理
- **C‑states（处理器休眠状态）**：CPU空闲时进入更深C状态，降低功耗，退出有延迟。
- **P‑states（处理器性能状态）**：调整CPU运行频率电压，平衡性能与功耗。
- **Turbo睿频**：短时间超过基准频率，负载高时提升性能。

### 内核调频调节器in‑kernel governors
- `performance`：固定最高频率；
- `ondemand`：负载高升频，空闲降频；
- `powersave`：固定最低频率；
- `schedutil`：基于调度器反馈现代推荐调节器。

### cpupower工具集
安装`cpupower`软件包。
```bash
cpupower frequency‑info        # 查看当前频率设置
cpupower idle‑stats           # 查看C‑state休眠统计
cpupower monitor              # 监控硬件统计
cpupower frequency‑set ‑g schedutil # 修改调频调节器
```

### P‑state调优选项，故障排查
BIOS/内核参数影响CPU调频；部分云环境不支持P‑states。

### powertop — 功耗监控调优工具
统计硬件组件功耗，识别耗电程序、内核定时器，给出节能调优建议。
```bash
powertop
```

---

# 第五部分 内核调优
## 第13章 IO性能调优
### 切换IO调度器
blk‑mq多队列IO栈可用调度器：
1. **MQ‑DEADLINE**：通用，兼顾延迟与吞吐量；
2. **NONE**：无调度，直通模式，适合NVMe高速SSD；
3. **BFQ(Budget Fair Queueing)**：公平IO调度，桌面交互式优先；
4. **KYBER**：面向NVMe/SATA SSD，延迟优先。

> 调度器可以内核启动参数设置，也可以对单块设备`/sys/block/sdX/queue/scheduler`修改。

### IO屏障barrier调优
`fsync`、数据库使用IO屏障保证落盘安全；开启屏障牺牲部分性能；电池备份RAID卡场景可以安全关闭barrier。

## 第14章 任务调度器调优
### 基础概念
抢占preemption、时间片timeslice、进程nice优先级、进程分类（实时进程、普通CFS完全公平调度进程）。

#### CFS完全公平调度器
CFS为普通非实时进程设计，保证每个进程获得公平CPU时间。
- 进程分组调度；
- 内核编译配置选项。

### chrt — 修改进程实时调度属性
```bash
chrt ‑f 50 ./realtime‑app
```
修改SCHED_FIFO/SCHED_RR实时优先级。

### sysctl运行时调优调度参数
`kernel.sched_*`系列sysctl参数。

### 调度器调试接口与统计
`/sys/kernel/debug/sched/`调试文件，查看调度统计。

## 第15章 内存管理子系统调优
### 内存使用分类
匿名内存Anonymous memory、页缓存Pagecache、buffer缓存、回写writeback、预读readahead、VFS各类缓存。

### 降低内存开销
减少malloc匿名内存占用、降低内核内存开销；cgroup内存控制器限制内存上限。

### VM虚拟内存管理器可调参数（sysctl vm.*）
- 回收比例：`vm.min_free_kbytes`、`vm.swappiness`；
- 回写参数：`vm.dirty_ratio`、`vm.dirty_background_ratio`控制脏页刷盘阈值；
- readahead预读；
- Transparent HugePage透明大页THP；`khugepaged`后台大页整理线程；
- 其他VM参数。

### 监控VM行为
查看`/proc/vmstat`，观察页回收、扫描、换入换出指标。

## 第16章 网络调优
### 可配置socket缓冲区
`net.core.rmem_max`、`net.core.wmem_max`最大套接字缓冲区；tcp接收发送缓冲区`net.ipv4.tcp_rmem`、`net.ipv4.tcp_wmem`。大带宽长时延BDP场景调大缓冲区。

### 定位网络瓶颈，分析流量
工具：ss、nethogs、ethtool、tcpdump/wireshark。

### Netfilter防火墙性能
大量连接、高并发场景iptables/nftables规则数量影响CPU开销。

### RPS接收包转向（Receive Packet Steering）
多CPU网卡接收中断数据包分发到多个CPU，提升网络吞吐，缓解单CPU网络处理瓶颈。

---

# 第六部分 系统转储与调试
## 第17章 跟踪工具
### strace：系统调用跟踪
跟踪进程全部系统调用、参数、返回值、信号。
```bash
strace ./myprogram
strace ‑p PID
```

### ltrace：库函数调用跟踪
跟踪用户态动态库函数调用。

### Valgrind调试分析套件
> 摘要：包含memcheck内存泄漏检测、callgrind性能分析、massif堆内存分析。
> 注意：Valgrind运行程序会极大降低运行速度，只用于调试，不要生产环境。

## 第18章 Kexec与Kdump
> 摘要
kdump用于内核崩溃crash捕获。内核崩溃时，kexec启动第二个捕获内核，把崩溃转储vmcore保存到磁盘。
- 需要软件包：`kdump`；
- 计算crashkernel预留内存大小，内核启动参数`crashkernel=XXXM`；
- YaST图形配置kdump，也可以手动配置；支持SSH远程保存转储文件；
- 分析工具`crash`，读取vmcore，排查内核panic、Oops。
高级配置，参考官方文档。

## 第19章 systemd‑coredump 应用崩溃转储
systemd‑coredump捕获用户态程序段错误SIGSEGV生成core转储文件。配置文件`/etc/systemd/coredump.conf`；可以限制转储大小、保存路径。
用gdb读取core文件调试应用崩溃。

---

# 第七部分 PTP精确时间协议
## 第20章 Precision Time Protocol（PTP）
> 摘要
PTP精确时间协议，比NTP精度更高，达到亚微秒级时间同步，工业、电信、金融场景。Linux实现为`ptp4l`。
1. 硬件支持：网卡必须支持PTP硬件时间戳；
2. `ptp4l`主从时钟同步；配置文件；延迟测量模式；
3. `pmc`PTP管理客户端；
4. `phc2sys`：把网卡硬件时钟PHC同步到系统系统时钟；
5. 校验时间同步结果；配置样例；
6. PTP与NTP共存：NTP‑PTP桥接，PTP作为高精度底层源，上层对外提供NTP服务。
