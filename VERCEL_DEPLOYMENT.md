# Vercel 部署指南

## 前提条件

✅ 代码已推送到 GitHub 仓库：https://github.com/1161178340-maker/hhhzc

## 部署步骤

### 1. 登录 Vercel

1. 访问 [Vercel 官网](https://vercel.com)
2. 点击右上角的 "Login" 按钮
3. 使用 GitHub 账号登录（推荐）

### 2. 创建新项目

1. 登录后，点击仪表板上的 "Add New..." 按钮
2. 选择 "Project" 选项
3. 在 "Import Git Repository" 部分，找到并选择 `hhhzc` 仓库
4. 点击 "Import" 按钮

### 3. 配置项目

Vercel 会自动检测到这是一个 Next.js 项目，并进行以下配置：

**Framework Preset**: Next.js

**Root Directory**: `./`

**Build Command**: `npm run build`

**Output Directory**: `.next`

### 4. 设置环境变量

在部署前，需要设置环境变量：

1. 向下滚动到 "Environment Variables" 部分
2. 点击 "Add New" 按钮
3. 添加以下环境变量：

| Key | Value | 说明 |
|-----|-------|------|
| `DASHSCOPE_API_KEY` | `your_api_key_here` | 替换为你的实际 API 密钥 |

⚠️ **重要**：确保 `DASHSCOPE_API_KEY` 设置正确，否则聊天功能无法正常工作。

### 5. 部署

1. 点击底部的 "Deploy" 按钮
2. 等待部署完成（通常需要 1-3 分钟）
3. 部署成功后，Vercel 会提供一个预览链接

### 6. 验证部署

部署完成后：

1. 点击 Vercel 提供的预览链接访问应用
2. 测试聊天功能：
   - 输入 "你好" 进行日常对话测试
   - 测试清空对话功能
   - 验证机器人正在输入状态

## 常见问题

### Q: 部署失败怎么办？

**A**: 检查以下几点：
- 确保 `package.json` 中的依赖正确
- 检查构建日志中的错误信息
- 确认环境变量设置正确

### Q: 聊天功能不工作？

**A**: 确认：
- `DASHSCOPE_API_KEY` 环境变量已正确设置
- API 密钥有效且有足够的配额
- 查看部署日志中的错误信息

### Q: 如何更新部署？

**A**:
1. 在本地修改代码
2. 提交并推送到 GitHub
3. Vercel 会自动检测到更新并重新部署

### Q: 如何自定义域名？

**A**:
1. 在 Vercel 项目设置中，选择 "Domains"
2. 点击 "Add" 添加自定义域名
3. 按照提示配置 DNS 记录

## 部署后的 URL

部署成功后，你会获得一个类似这样的 URL：
```
https://hhhzc.vercel.app
```

或者 Vercel 可能会分配一个随机名称的 URL。

## 监控和日志

- 在 Vercel 仪表板中可以查看部署日志
- 使用 "Logs" 标签查看运行时日志
- 使用 "Analytics" 查看访问统计

## 下一步

部署成功后，你可以：
1. 分享应用链接给他人使用
2. 根据使用情况优化功能
3. 添加更多功能或改进现有功能
4. 配置自定义域名

---

**需要帮助？** 访问 [Vercel 文档](https://vercel.com/docs) 获取更多信息。