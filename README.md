# ts-ui

UI 组件化工程
ts

## 安装说明
1. 下载工程，更改文件夹名字
2. 修改package.json文件中的name，到你需要工程名字
  2.1 PH_TS_UI_PARSE 环境变量到你的项目文件夹
3. yarn 安装各种依赖
4. npm run build 编译
5. npm run start 启动程序
8. 访问http://localhost:8080 即可看到API的使用情况

## 自文档
1. 在工程目录下运行 npm run docs

## Log 管理
1. 
```ts
import PhLogger from "./logger/phLogger"

PhLogger.trace(<what ever you want>)
PhLogger.debug(<what ever you want>)
PhLogger.info(<what ever you want>)
PhLogger.warn(<what ever you want>)
PhLogger.error(<what ever you want>)
PhLogger.fatal(<what ever you want>)
```

2. 在log文件夹下生成log文件，log同时会在console中打出