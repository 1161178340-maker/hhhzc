# 数字分身聊天机器人

一个基于 Next.js 和 AI 的智能聊天机器人，能够根据社交策略动态选择回复技术。

## 功能特点

- 🤖 智能对话：基于 AI 的自然语言处理
- 🎯 策略选择：自动选择询问、延词、借势等社交技术
- 💬 实时聊天：支持实时对话交互
- 🔄 对话历史：自动保存和加载对话记录
- 📱 响应式设计：完美适配移动端和桌面端
- ⚡ 快速响应：优化的 API 接口
- 🎨 美观界面：现代化的 UI 设计

## 技术栈

- **前端框架**: Next.js 16.1.4 (App Router)
- **UI 库**: Tailwind CSS 4
- **AI 模型**: OpenAI API (DashScope)
- **语言**: TypeScript

## 安装和运行

### 本地开发

1. 克隆仓库
```bash
git clone <repository-url>
cd digital-twin-web
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件并添加：
```
DASHSCOPE_API_KEY=your_api_key_here
```

4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## API 接口

### POST /api/chat

发送消息给聊天机器人。

**请求体**:
```json
{
  "message": "你好"
}
```

**响应**:
```json
{
  "reply": "你是第一次来这儿吗",
  "technique": "询问",
  "reason": "当前对话仅处于初始阶段..."
}
```

### POST /api/chat (重置对话)

重置对话历史。

**请求体**:
```json
{
  "action": "reset"
}
```

**响应**:
```json
{
  "success": true,
  "message": "Conversation reset successfully"
}
```

## 项目结构

```
digital-twin-web/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts       # API 路由
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # 主页面
│   │   └── globals.css          # 全局样式
│   └── utils/
│       └── bot.js               # 机器人逻辑
├── public/                      # 静态资源
├── .env                        # 环境变量（不提交）
├── .gitignore                  # Git 忽略文件
├── next.config.ts              # Next.js 配置
├── package.json                # 项目依赖
└── tsconfig.json              # TypeScript 配置
```

## 特性说明

### 聊天技术

机器人支持以下社交技术：
- **询问**: 开启聊天，引导对方表达
- **延词**: 延续话题，保持对话流畅
- **借势**: 利用当前情境进行回应
- **夸奖**: 赞美对方，建立好感
- **叙事**: 分享故事，增加互动
- **反问**: 反向提问，引导对话
- **示弱**: 展示脆弱，拉近距离
- **曲解**: 幽默曲解，活跃气氛

### 错误处理

- 完整的参数验证
- 详细的错误信息
- 友好的用户提示
- 自动重试机制

## 部署

### Vercel 部署

1. 将代码推送到 GitHub/GitLab
2. 登录 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入你的仓库
5. 配置环境变量 `DASHSCOPE_API_KEY`
6. 点击 "Deploy"

### 其他平台

本项目可以部署到任何支持 Next.js 的平台：
- Netlify
- Railway
- Render
- AWS Amplify
- 自托管服务器

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**享受与你的数字分身聊天！** 🚀
