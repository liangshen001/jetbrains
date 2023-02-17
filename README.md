# @liangshen/jetbrains

获取JetBrains系列软件的配置信息

目前支持获取最近打开项目列表，支持的软件WebStorm、IntelliJ IDEA、DataGrip、PyCharm

## 安装
```
npm i @liangshen/jetbrains
```

## 使用

以WebStorm为例

```typescript
import jetbrains from "@liangshen/jetbrains"
// const recentProjectsManager = await jetbrains.getRecentProjectsManager('WebStorm')
const recentProjectsManager = jetbrains.getRecentProjectsManagerSync('WebStorm')

console.log(recentProjectsManager);
```