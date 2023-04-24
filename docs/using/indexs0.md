# 测试页面index0
[[toc]]

## 代码块高亮测试
> html代码高亮测试

```html
<ul>
  <li v-for="html代码高亮测试" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

> js代码高亮测试

```js
export default {
  name: 'js代码高亮测试',
  // ...
}
```

> js 第1,4,6-7行 代码高亮测试

```js{1,4,6-7}
export default { // Highlighted
  data () {
    return {
      msg: `第4行 高亮测试
      第5行 测试,
      第6-行 高亮测试.`,
      motd: '第-7行 高亮测试',
      lorem: 'ipsum',
    }
  }
}
```

## Bash 高亮测试
> bash 显示日期

```bash
cal 2023
```
