import React, { ReactNode } from 'react';

export interface Veo3PlaygroundProps {
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 上传文件方法，传入file，返回url的Promise */
  putFile: (file: File, folder?: string) => Promise<string>;
  /** 下载文件方法，传入url，如果此方法为null，则不展示下载按钮 */
  downloadFile?: ((url: string) => Promise<void>) | null;
  /** 用于生成的apiKey */
  apiKey: string;
  /** 默认展示内容组件，当videoInfo为null时展示的部分 */
  defaultContent?: ReactNode;
}

export interface VideoInfo {
  state: 'wait' | 'queuing' | 'generating' | 'success' | 'fail';
  successFlag?: number;
  videoInfo?: {
    videoUrl?: string;
  };
  response?: {
    resultUrls?: string[];
  };
}

export interface ButtonProps {
  /** 按钮文本 */
  children: ReactNode;
  /** 按钮类型 */
  variant?: 'primary' | 'secondary';
  /** 按钮大小 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 点击事件 */
  onClick?: () => void;
}

export interface TooltipProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 提示内容 */
  content: string;
  /** 最大宽度CSS类 */
  maxWidth?: string;
}
