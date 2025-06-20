# Veo 3 API & Veo 3 Fast API-Google AI

English | [中文](./README.zh-CN.md) 

An open-source React plugin that uses Veo3 to generate videos via kie.ai's API. Bring AI-powered video creation to your web applications.

### ✨ Features

- 🎬 **Dual Generation Modes**: Image-to-video and text-to-video
- 🚀 **Fast Generation**: Optional fast generation mode for text-to-video
- 📤 **Drag & Drop Upload**: Easy image uploading with format validation
- 🔄 **Real-time Progress**: Live generation progress tracking
- 📥 **Download Support**: Built-in video download functionality
- 🎨 **Modern UI**: Clean, responsive design with loading animations
- 🔧 **Highly Customizable**: Flexible styling and content options

### 🌟 Live Demo

Try out the components in action at: [https://fred-hash-d.github.io/veo3-api](https://fred-hash-d.github.io/veo3-api)

### 📦 Installation

```bash
npm install veo3-api
```

### ⚙️ Configuration

#### 1. Install the package

```bash
npm install veo3-api
```

#### 2. Configure Tailwind CSS

Add the package path to your `tailwind.config.js` file:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/veo3-api/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
}
```

#### 3. Get API Key

Get your API key from [kie.ai](https://kie.ai/api-key) - a platform that provides AI API services.

### 🚀 Usage

#### Basic Usage

```tsx
import React from 'react';
import Veo3Playground from 'veo3-api';

// File upload function (Required)
const putFile = async (file: File, folder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  return data.url; // Return the uploaded file URL
};

// File download function (Optional)
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
        apiKey="your-api-key-from-kie.ai"
        putFile={putFile}
        downloadFile={downloadFile}
        className="min-h-[600px]"
      />
    </div>
  );
}
```

#### Custom Default Content

```tsx
import React from 'react';
import Veo3Playground from 'veo3-api';

const CustomDefaultContent = () => (
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-4">Welcome to AI Video Generator</h2>
    <p className="text-gray-600 mb-6">Upload an image or enter text to get started</p>
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold">Image to Video</h3>
        <p className="text-sm text-gray-600">Transform images into videos</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="font-semibold">Text to Video</h3>
        <p className="text-sm text-gray-600">Generate videos from text</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Veo3Playground 
      apiKey="your-api-key-from-kie.ai"
      putFile={putFile}
      defaultContent={<CustomDefaultContent />}
    />
  );
}
```

### 📖 API Reference

#### Veo3Playground Component

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `apiKey` | `string` | **✅ Required** | - | API key from [kie.ai](https://kie.ai/api-key) |
| `putFile` | `(file: File, folder?: string) => Promise<string>` | **✅ Required** | - | File upload function that returns the file URL |
| `downloadFile` | `(url: string) => Promise<void>` | ❌ Optional | - | File download function |
| `defaultContent` | `ReactNode` | ❌ Optional | - | Custom default display content |
| `className` | `string` | ❌ Optional | `''` | Custom CSS class name |
| `style` | `React.CSSProperties` | ❌ Optional | - | Custom inline styles |

#### Button Component

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ | - | Button content |
| `variant` | `'primary' \| 'secondary'` | ❌ | `'primary'` | Button style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | `'md'` | Button size |
| `disabled` | `boolean` | ❌ | `false` | Whether the button is disabled |
| `loading` | `boolean` | ❌ | `false` | Whether to show loading state |
| `onClick` | `() => void` | ❌ | - | Click event handler |
| `className` | `string` | ❌ | `''` | Custom CSS class name |

### 🔧 Technical Requirements

- **React**: 18.0.0+
- **TypeScript**: 5.0.0+ (recommended)
- **TailwindCSS**: 3.0.0+
- **Modern Browser**: ES2020+ support

### 📚 Dependencies

This package includes these peer dependencies:
- `react` and `react-dom`
- `axios` for API calls
- `lucide-react` for icons
- `react-dropzone` for file uploads
- `react-hot-toast` for notifications
- `react-spinners` for loading states

### 🤝 Contributing

Issues and pull requests are welcome! Please check the main repository for contribution guidelines.

### 📄 License

MIT License
