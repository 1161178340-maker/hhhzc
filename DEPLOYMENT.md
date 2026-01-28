# 部署指南

## 📋 当前状态

✅ Git 仓库已初始化
✅ 代码已提交（2 个提交）
✅ API 路由已修复
✅ ESLint 配置已完成

## 🚀 部署步骤

### 步骤 1：创建远程仓库

#### 选项 A：GitHub
1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `digital-twin-web`
   - Description: `数字分身聊天机器人`
   - Public/Private: 选择 Public
   - 不要初始化 README、.gitignore 或 license
3. 点击 "Create repository"

#### 选项 B：GitLab
1. 访问 https://gitlab.com/projects/new
2. 填写项目信息：
   - Project name: `digital-twin-web`
   - Visibility Level: Public
3. 点击 "Create project"

### 步骤 2：添加远程仓库并推送

创建仓库后，在终端执行以下命令（替换 `<your-username>`）：

**GitHub:**
```bash
cd c:\Users\洪子椿\Desktop\digital_twin\digital-twin-web
git remote add origin https://github.com/<your-username>/digital-twin-web.git
git branch -M main
git push -u origin main
```

**GitLab:**
```bash
cd c:\Users\洪子椿\Desktop\digital_twin\digital-twin-web
git remote add origin https://gitlab.com/<your-username>/digital-twin-web.git
git branch -M main
git push -u origin main
```

### 步骤 3：部署到 Vercel

1. **登录 Vercel**
   - 访问 https://vercel.com
   - 点击 "Sign Up" 或 "Login"
   - 使用 GitHub、GitLab 或邮箱登录

2. **导入项目**
   - 登录后，点击 "Add New" → "Project"
   - 在 "Import Git Repository" 中找到 `digital-twin-web`
   - 点击 "Import"

3. **配置项目**
   Vercel 会自动检测配置：
   - Framework: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next

4. **添加环境变量**
   - 在 "Environment Variables" 部分
   - 点击 "Add New"
   - Name: `DASHSCOPE_API_KEY`
   - Value: 你的 DashScope API Key
   - Environment: Production, Preview, Development (全选)
   - 点击 "Add"

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟

6. **获取部署链接**
   - 部署完成后，Vercel 会提供链接：
     - `https://digital-twin-web-xxxxx.vercel.app`
   - 点击链接访问应用

### 步骤 4：验证部署

访问 Vercel 提供的域名，测试以下功能：

✅ **基本聊天**
- 输入："你好"
- 检查是否收到回复

✅ **加载状态**
- 发送消息后，检查是否显示"正在输入"动画

✅ **清空功能**
- 点击"清空"按钮
- 检查聊天记录是否清空

✅ **响应式设计**
- 在手机浏览器打开
- 检查界面是否正常

## 📝 重要提示

### API Key 配置
- ⚠️ 不要将 `.env` 文件提交到 Git（已在 .gitignore 中）
- ✅ 在 Vercel 中配置环境变量
- 🔒 定期更换 API Key 以保证安全

### 环境变量管理
- Vercel 项目设置中可以随时修改环境变量
- 修改后需要重新部署才能生效
- 支持多个环境（Production, Preview, Development）

### 自动部署
- 推送到 `main` 分支 → 生产环境
- 推送到其他分支 → 预览环境
- 每次推送都会自动触发部署

### 监控和日志
- Vercel 提供实时监控
- 可以查看访问日志和错误日志
- 支持设置告警通知

## 🎯 快速命令参考

### 查看当前状态
```bash
git status
git log --oneline
```

### 添加远程仓库
```bash
git remote add origin <repository-url>
```

### 推送到远程
```bash
git push -u origin main
```

### 查看远程仓库
```bash
git remote -v
```

## 🔧 故障排除

### 推送失败
```bash
# 如果推送失败，尝试强制推送
git push -f origin main

# 或者先拉取再推送
git pull origin main --rebase
git push origin main
```

### 部署失败
- 检查环境变量是否正确配置
- 查看构建日志了解错误详情
- 确保 `package.json` 中的依赖都正确安装

### API 调用失败
- 确认 `DASHSCOPE_API_KEY` 已在 Vercel 中配置
- 检查 API Key 是否有效
- 查看 Vercel 函数日志

## 📚 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [GitHub 创建仓库](https://github.com/new)
- [GitLab 创建项目](https://gitlab.com/projects/new)

## 🆘 需要帮助？

如果遇到问题：
1. 检查 Vercel 部署日志
2. 查看浏览器控制台错误
3. 确认环境变量配置正确
4. 查看本文档的故障排除部分

---

**准备好开始部署了吗？告诉我你的选择！**
