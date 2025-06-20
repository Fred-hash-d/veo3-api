# AI API Playground - Examples

A Next.js example project demonstrating how to use the `veo3-api` AI component library.

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit:
   - **Veo3 Video Generator**: http://localhost:3000

## ✨ Features Showcase

- **🎬 Veo3Playground Component**: AI-powered video generation tool
  - Image-to-video conversion
  - Text-to-video generation
  - Real-time progress tracking
  - File upload and download
- **🧭 Navigation System**: Modern header with internal and external links
- **🎨 Button Components**: Multiple variants with loading states
- **📱 Responsive Design**: Optimized for all screen sizes
- **🎨 TailwindCSS Integration**: Consistent design system
- **🔗 External Links**: Integration with KIE.AI and documentation

## 📁 Project Structure

```
packages/examples/
├── components/         # React components
│   └── Header.tsx      # Navigation header component
├── pages/              # Next.js pages
│   ├── _app.tsx        # App entry point
│   ├── index.tsx       # Homepage (navigation)
│   └── veo3.tsx        # Veo3 video generator demo
├── styles/             # Style files
│   └── globals.css     # Global styles with TailwindCSS
├── public/             # Static assets
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # TailwindCSS configuration
├── postcss.config.js   # PostCSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🌐 Pages Overview

### Homepage (`/`)
- **Purpose**: AI video generation demonstration
- **Features**:
  - Card-mode layout (recommended usage pattern)
  - Full Veo3Playground component integration
  - Page title and description
  - Proper container styling

### Header Component
- **Purpose**: Global navigation
- **Features**:
  - Logo with homepage link
  - Active page highlighting
  - Internal navigation (Home)
  - External links (KIE.AI, Docs) with new tab opening
  - Responsive design

## 🛠️ Development Commands

Start development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

Lint and format code:
```bash
npm run lint
npm run format
```

## 🎨 Styling

This project uses:
- **TailwindCSS** for utility-first styling
- **Lucide React** for modern icons
- **Custom color palette** with blue and purple gradients
- **Responsive design** patterns
- **Card-based layouts** for better visual hierarchy

## 🔧 Configuration

### API Integration
The example uses mock functions for file operations. In a real implementation, you would:

1. Replace `putFile` with your actual upload logic
2. Replace `downloadFile` with your download implementation
3. Set a real API key for the Veo3 service

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
