# Checkin-Mate-Feishu

在飞书中利用机器人指令+机器人，实现定时缺卡提醒，让你不再忘记为数不多的补卡机会

## 1.创建一个飞书机器人

### 1.1 创建机器人
可[查看官方文档](https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot)或参考[Gemini-Feishu](https://github.com/yuhang1995/Gemini-Feishu?tab=readme-ov-file#%E4%B8%80%E5%88%9B%E5%BB%BA%E9%85%8D%E7%BD%AE%E9%A3%9E%E4%B9%A6%E5%BA%94%E7%94%A8)中的步骤

### 1.2 添加机器人需要的权限

- 导出打卡数 attendance:task:readonly
- 以应用的身份发送数据 im:message:send_as_bot
- 以应用的身份读取通讯 contact:contact:readonly_as_app
- 获取用户的userID contact:user.employee_id:readonly

## 2.设置指令

设置指令是为了主动执行机器人，访问[飞书机器人助手](https://botbuilder.feishu.cn/home)

1、在新建指令的窗口中，选择`定时任务`，然后根据自己的需求进行具体设置，然后点击完成

<image src="https://tg-image.com/file/d5e79b6d57f029288cf22.png" width="250px" />


2、选点击`选择操作` -> 选择`发送HTTP请求` -> 选择`请求方式`为`POST` -> 输入`URL` -> 点击完成

> 此处的URL需要填写自己实际的服务地址

## 本地测试

克隆仓库，设置对应的环境变量

- PORT=xxx
- APP_ID=xxx
- APP_SECRET=xxx

安装依赖
> pnpm install

启动本地服务
> pnpm dev

这里需要飞书回调我们的服务，本地开发是可使用[localtunnel](https://github.com/localtunnel/localtunnel)进行穿墙

<image src="https://tg-image.com/file/e06fd74613d4baecfa4a7.png" width="250px" />
