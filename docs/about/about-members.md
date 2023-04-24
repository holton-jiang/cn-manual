---
layout: page
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'
const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/88922715?v=4',
    name: '蒋小霕',
    title: ' openSUSE 中文手册项目创建者',
    links: [
      { icon: 'github', link: 'https://github.com/holton-jiang' },
      { icon: 'twitter', link: 'https://twitter.com/holton_jiang' }
    ]
  },
]
</script>
<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>
      我们的成员
    </template>
    <template #lead>
      openSUSE 中文手册项目由蒋小霕发起，希望能够助帮更多的计算机初学者了解与使用 openSUSE Linux 发行版，体验折腾计算机带来的乐趣。其中一些参与者会在下面展示。
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>
