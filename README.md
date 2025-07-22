# Vue Chrome Extension Monorepo

一个基于Vue 3的Chrome扩展程序monorepo项目，包含扩展管理器和书签管理器两个Chrome扩展。

## 📁 项目结构

```
vue-chrome-extension/
├── extensionsManagement/     # 扩展管理器
├── hiBookMarks/             # 书签管理器  
├── package.json             # Monorepo根配置
├── pnpm-workspace.yaml      # PNPM工作空间配置
├── biome.json              # Biome代码格式化和linting配置
├── .stylelintrc.json       # Stylelint样式linting配置
├── .biomeignore            # Biome忽略文件
└── .husky/                 # Git hooks配置
    └── pre-commit          # 提交前代码格式化
```

## 🚀 技术栈

- **Vue 3** - 使用Composition API和`<script setup>`语法
- **Webpack** - 模块打包和构建
- **SCSS** - CSS预处理器
- **Chrome Extension API** - 浏览器扩展开发
- **PNPM** - 包管理器和工作空间
- **Biome** - JavaScript/TypeScript代码格式化和linting
- **Stylelint** - CSS/SCSS代码格式化和linting
- **Husky + lint-staged** - Git提交钩子和代码自动格式化

## 📦 安装

```bash
# 安装依赖
pnpm install

# 安装特定项目依赖
pnpm --filter extensionsManagement install
pnpm --filter hiBookMarks install
```

## 🛠️ 开发

### 构建项目

```bash
# 构建所有项目
pnpm run build:all

# 构建特定项目
pnpm --filter extensionsManagement run build
pnpm --filter hiBookMarks run build
```

### 开发模式

```bash
# 开发扩展管理器
pnpm run dev:extensions

# 开发书签管理器
pnpm run dev:bookmarks
```

### 代码质量

```bash
# 运行所有代码检查
pnpm run lint:all

# 自动修复所有代码问题
pnpm run fix:all

# 单独运行各种检查
pnpm run lint          # Biome代码检查
pnpm run format        # Biome代码格式化
pnpm run style:lint    # Stylelint样式检查
pnpm run style:fix     # Stylelint自动修复
```

## 🔧 Chrome扩展安装

1. 打开Chrome浏览器，进入 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择对应项目的`dist`文件夹：
   - `extensionsManagement/dist` - 扩展管理器
   - `hiBookMarks/dist` - 书签管理器

## 📋 项目说明

### extensionsManagement - 扩展管理器

一个Chrome扩展管理工具，提供以下功能：

- 📋 显示所有已安装的扩展程序
- 🔄 批量启用/禁用扩展
- 🗑️ 卸载扩展（支持系统禁用的扩展）
- 📊 扩展状态分类和排序
- 🔍 智能状态显示（区分用户禁用、Chrome禁用、系统管理等）
- ⚠️ 错误处理和权限检查

**特性：**
- Vue 3 Composition API架构
- 组件化设计（Dashboard和TreeItem分离）
- 完善的Chrome Extension Management API集成
- 响应式状态管理

### hiBookMarks - 书签管理器

一个功能丰富的书签管理扩展，包含：

**主要功能：**
- 🔍 书签搜索和快速访问
- 📁 文件夹树形结构浏览
- ✏️ 书签编辑和管理
- 📱 弹窗（popup）快速访问界面
- 🏠 完整页面管理界面
- 📚 浏览历史记录查看

**技术特点：**
- 双入口设计（popup + 完整页面）
- Vue 3重构的所有组件
- Chrome Bookmarks和History API集成
- 多语言支持（i18n）

## 🔄 Vue 3升级

项目已从Vue 2全面升级到Vue 3：

### 主要变更

1. **Vue版本升级**：`2.7.16` → `3.4.0`
2. **构建工具更新**：
   - `vue-loader`: `15.x` → `17.x`
   - 移除`vue-template-compiler`
   - 添加`@vue/compiler-sfc`
3. **API语法升级**：
   - 使用`createApp()`替代`new Vue()`
   - 全面采用Composition API
   - `<script setup>`语法
4. **组件重构**：
   - 所有组件转换为Composition API
   - 使用`ref`、`reactive`、`computed`等新API
   - 事件处理和props定义更新

### 兼容性处理

- 保持Chrome Extension API调用不变
- 维持原有功能和用户体验
- 样式和UI保持一致

## 🎯 代码质量工具

### Biome配置

- 统一的JavaScript/TypeScript/Vue文件格式化
- 严格的代码质量检查
- 支持Vue 3语法特性
- 自动导入整理

### Stylelint配置

- SCSS语法支持
- Vue单文件组件样式检查
- 标准化CSS规则
- 自动修复常见问题

### Git Hooks

- **pre-commit**: 自动运行代码格式化
- **lint-staged**: 只检查暂存的文件
- 确保提交代码质量一致性

## 📝 开发规范

1. **组件命名**：使用PascalCase
2. **文件组织**：组件和样式分离
3. **Vue 3语法**：优先使用Composition API
4. **代码风格**：遵循Biome和Stylelint规则
5. **提交规范**：通过Git hooks自动格式化

## 🤝 贡献

1. Fork项目
2. 创建功能分支
3. 提交更改（会自动格式化）
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

[MIT License](LICENSE)

