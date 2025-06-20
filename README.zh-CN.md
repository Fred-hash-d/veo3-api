# Veo 3 API & Veo 3 Fast API-Google AI

[English](./README.md) | 中文

一个开源的 React 插件，使用 Veo3 通过 kie.ai 的 API 生成视频。将 AI 驱动的视频创作带入您的网络应用程序。

## ✨ 功能特性

- 🎬 **双生成模式**：图生视频和文生视频
- 🚀 **快速生成**：文生视频可选快速生成模式
- 📤 **拖拽上传**：支持拖拽上传图片，自动格式验证
- 🔄 **实时进度**：实时显示生成进度
- 📥 **下载支持**：内置视频下载功能
- 🎨 **现代UI**：简洁响应式设计，流畅加载动画
- 🔧 **高度可定制**：灵活的样式和内容选项

## 🌟 在线示例

在线体验组件功能：[https://fred-hash-d.github.io/veo3-api](https://fred-hash-d.github.io/veo3-api)

## 📦 安装

```bash
npm install veo3-api
```

## ⚙️ 配置

### 1. 安装包

```bash
npm install veo3-api
```

### 2. 配置 Tailwind CSS

在你的 `tailwind.config.js` 文件中添加包路径：

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/veo3-api/**/*.{js,ts,jsx,tsx}",
  ],
  // ... 其他配置
}
```

### 3. 获取 API Key

从 [kie.ai](https://kie.ai/api-key) 获取您的 API 密钥 - 这是一个提供AI API服务的平台。

## 🚀 使用方法

### 基础用法

```tsx
import React from 'react';
import Veo3Playground from 'veo3-api';

// 文件上传函数（必需）
const putFile = async (file: File, folder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.url; // 返回上传文件的URL
};

// 文件下载函数（可选）
const downloadFile = async (url: string): Promise<void> => {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'video.mp4';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Veo3Playground 
        apiKey="你从kie.ai获取的API密钥"
        putFile={putFile}
        downloadFile={downloadFile}
        className="min-h-[600px]"
      />
    </div>
  );
}
```

### 自定义默认内容

```tsx
import React from 'react';
import Veo3Playground from 'veo3-api';

const CustomDefaultContent = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-4">欢迎使用AI视频生成器</h2>
    <p className="text-gray-600 mb-6">上传图片或输入文本开始创作</p>
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold">图生视频</h3>
        <p className="text-sm text-gray-600">将图片转换为视频</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold">文生视频</h3>
        <p className="text-sm text-gray-600">从文本生成视频</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Veo3Playground 
      apiKey="你从kie.ai获取的API密钥"
      putFile={putFile}
      defaultContent={<CustomDefaultContent />}
    />
  );
}
```

## 📖 API 参考

### Veo3Playground 组件

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `apiKey` | `string` | **✅ 必需** | - | 从 [kie.ai](https://kie.ai/api-key) 获取的API密钥 |
| `putFile` | `(file: File, folder?: string) => Promise<string>` | **✅ 必需** | - | 文件上传函数，返回文件URL |
| `downloadFile` | `(url: string) => Promise<void>` | ❌ 可选 | - | 文件下载函数 |
| `defaultContent` | `ReactNode` | ❌ 可选 | - | 自定义默认显示内容 |
| `className` | `string` | ❌ 可选 | `''` | 自定义CSS类名 |
| `style` | `React.CSSProperties` | ❌ 可选 | - | 自定义内联样式 |

### Button 组件

| 属性 | 类型 | 必需 | 默认值 | 描述 |
|------|------|------|--------|------|
| `children` | `ReactNode` | ✅ | - | 按钮内容 |
| `variant` | `'primary' \| 'secondary'` | ❌ | `'primary'` | 按钮样式变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | `'md'` | 按钮大小 |
| `disabled` | `boolean` | ❌ | `false` | 是否禁用按钮 |
| `loading` | `boolean` | ❌ | `false` | 是否显示加载状态 |
| `onClick` | `() => void` | ❌ | - | 点击事件处理器 |
| `className` | `string` | ❌ | `''` | 自定义CSS类名 |

## 🔧 技术要求

- **React**: 18.0.0+
- **TypeScript**: 5.0.0+（推荐）
- **TailwindCSS**: 3.0.0+
- **现代浏览器**: 支持ES2020+

## 📚 依赖项

此包包含以下对等依赖项：
- `react` 和 `react-dom`
- `axios` 用于API调用
- `lucide-react` 图标库
- `react-dropzone` 文件上传
- `react-hot-toast` 通知提示
- `react-spinners` 加载动画

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests！请查看主仓库的贡献指南。

## �� 许可证

MIT License
