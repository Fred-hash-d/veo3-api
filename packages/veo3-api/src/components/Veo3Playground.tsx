import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Download, HelpCircle } from 'lucide-react';
import { ClipLoader, ClockLoader, PuffLoader, PulseLoader } from 'react-spinners';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Veo3PlaygroundProps, VideoInfo } from '../types';
import { Button } from './Button';
import { Tooltip } from './Tooltip';

const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

// 检测URL是否是http或https链接
const isHttpUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const Veo3Playground: React.FC<Veo3PlaygroundProps> = ({
  className = '',
  style,
  putFile,
  downloadFile,
  apiKey,
  defaultContent,
}) => {
  const [selectedModel, setSelectedModel] = useState<'image' | 'text'>('image');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState('');

  const [fastGeneration, setFastGeneration] = useState(false);
  const generateStartTimeRef = useRef<number | null>(null);

  // 处理文件上传
  const handleFileUpload = useCallback(
    async (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size cannot exceed 5MB');
        return;
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PNG, JPG, JPEG and WEBP image formats are supported');
        return;
      }

      setUploadLoading(true);
      try {
        const url = await putFile(file, 'veo3-video');
        setImagePreviewUrl(url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Upload failed, please try again');
      } finally {
        setUploadLoading(false);
      }
    },
    [putFile]
  );

  // Dropzone 配置
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    multiple: false,
    disabled: uploadLoading,
  });

  // 下载视频
  const handleDownloadVideo = async () => {
    if (!downloadFile) return;

    const videoUrl = getVideoUrl();
    if (!videoUrl) return;

    setDownloadLoading(true);
    try {
      await downloadFile(videoUrl);
      toast.success('Download successful');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    } finally {
      setDownloadLoading(false);
    }
  };

  // 切换模式
  const handleModelChange = (val: 'image' | 'text') => {
    // 如果启用了快速生成模式，不允许切换到图生视频
    if (fastGeneration && val === 'image') {
      return;
    }
    setPrompt('');
    setSelectedModel(val);
    setImagePreviewUrl('');
  };

  // 处理快速生成模式切换
  const handleFastGenerationChange = (enabled: boolean) => {
    setFastGeneration(enabled);
    // 如果启用快速生成，自动切换到文生视频模式
    if (enabled && selectedModel === 'image') {
      setSelectedModel('text');
      setImagePreviewUrl('');
      setPrompt('');
    }
  };

  // 获取视频 URL
  const getVideoUrl = () => {
    if (videoInfo && videoInfo.state === 'success') {
      const completeData = videoInfo.videoInfo;
      if (completeData && completeData.videoUrl) {
        return completeData.videoUrl;
      }
      // 备用获取方式
      if (
        videoInfo.response &&
        videoInfo.response.resultUrls &&
        videoInfo.response.resultUrls.length > 0
      ) {
        return videoInfo.response.resultUrls[0];
      }
    }
    return '';
  };

  // 生成详情轮询
  const generateDetail = async (taskId: string) => {
    try {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        url: `https://kieai.erweima.ai/api/v1/veo/record-info?taskId=${taskId}`,
        method: 'GET',
      });

      if (response.data.code === 200) {
        const recordsDataRes = response.data.data;

        // 转换数据格式以兼容现有UI
        const processedData: VideoInfo = {
          ...recordsDataRes,
          state:
            recordsDataRes.successFlag === 0
              ? 'generating'
              : recordsDataRes.successFlag === 1
                ? 'success'
                : 'fail',
          videoInfo: recordsDataRes.response
            ? {
                videoUrl:
                  recordsDataRes.response.resultUrls &&
                  recordsDataRes.response.resultUrls.length > 0
                    ? recordsDataRes.response.resultUrls[0]
                    : undefined,
              }
            : undefined,
        };

        setVideoInfo(processedData);

        if (recordsDataRes.successFlag === 0) {
          // 生成中，继续轮询，根据时间计算进度
          if (generateStartTimeRef.current) {
            const elapsedTime = Date.now() - generateStartTimeRef.current;
            const targetTime = 4 * 60 * 1000; // 4分钟
            const calculatedProgress = Math.min((elapsedTime / targetTime) * 99, 99);
            setProgress(Math.floor(calculatedProgress));
          }
          setTimeout(() => {
            generateDetail(taskId);
          }, 1500);
        } else {
          // 生成完成或失败
          setGenerateLoading(false);
          if (recordsDataRes.successFlag === 1) {
            setProgress(100);
            toast.success('Video generated successfully!');
          } else {
            toast.error('Video generation failed');
          }
        }
      } else {
        setTimeout(() => {
          generateDetail(taskId);
        }, 1500);
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        generateDetail(taskId);
      }, 1500);
    }
  };

  // 开始生成
  const startGenerate = async () => {
    if (!apiKey) {
      toast.error('API Key cannot be empty');
      return;
    }
    if (!prompt) {
      toast.error('Prompt cannot be empty');
      return;
    }
    if (generateLoading) return;

    if (videoInfo) {
      setVideoInfo(null);
    }
    setProgress(0);
    setGenerateLoading(true);

    let imageUrls: string[] = [];
    if (selectedModel === 'image') {
      if (!imagePreviewUrl) {
        setGenerateLoading(false);
        toast.error('Please upload an image first.');
        return;
      }
      if (!isHttpUrl(imagePreviewUrl)) {
        setGenerateLoading(false);
        toast.error('Please provide a valid HTTP or HTTPS URL.');
        return;
      }
      imageUrls = [imagePreviewUrl];
    }

    const requestData: {
      prompt: string;
      callBackUrl: string;
      waterMark: string;
      imageUrls?: string[];
    } = {
      prompt,
      callBackUrl: 'playground',
      waterMark: '',
    };

    // 只有在图生视频模式下才添加imageUrls
    if (selectedModel === 'image' && imageUrls.length > 0) {
      requestData.imageUrls = imageUrls;
    }

    try {
      const response = await axios({
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        url: 'https://kieai.erweima.ai/api/v1/veo/generate',
        method: 'POST',
        data: requestData,
      });

      if (response.data.code === 200) {
        generateDetail(response.data.data.taskId);
        generateStartTimeRef.current = Date.now();
        toast.success('Starting video generation...');
      } else {
        setGenerateLoading(false);
        toast.error(response.data.msg || 'Generation failed');
      }
    } catch (error) {
      console.log(error);
      setGenerateLoading(false);
      toast.error('Service error, please try again');
    }
  };

  // 渲染视频
  const renderVideo = () => {
    if (videoInfo) {
      switch (videoInfo.state) {
        case 'success':
          return (
            <div className="flex w-full flex-col items-center justify-center">
              <div className="relative">
                <video
                  className="m-0 max-h-[200px] rounded-xl lg:max-h-[450px]"
                  autoPlay
                  muted
                  controls
                >
                  <source src={getVideoUrl()} type="video/mp4" />
                </video>
                {downloadFile && (
                  <div
                    className={`absolute bottom-5 right-5 aspect-square w-8 rounded-xl bg-blue-600 backdrop-blur-md ${
                      downloadLoading
                        ? 'cursor-not-allowed'
                        : 'group cursor-pointer transition duration-500 hover:bg-blue-700'
                    } inline-flex items-center justify-center`}
                    onClick={downloadLoading ? undefined : handleDownloadVideo}
                  >
                    {downloadLoading ? (
                      <ClipLoader color="white" size={14} />
                    ) : (
                      <Download className="h-4 w-4 text-white" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        case 'wait':
          return (
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-blue-100">
                <div className="h-8 w-8 rounded-full bg-blue-600"></div>
              </div>
              <p className="flex w-full items-center justify-center gap-1 text-gray-700">
                Waiting to start generation...
                <PulseLoader color="#3b82f6" size={4} />
              </p>
            </div>
          );
        case 'queuing':
          return (
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-blue-100">
                <div className="h-8 w-8 rounded-full bg-blue-600"></div>
              </div>
              <p className="flex w-full items-center justify-center gap-1 text-gray-700">
                Queuing...
                <ClockLoader color="#3b82f6" size={18} />
              </p>
            </div>
          );
        case 'generating':
          return (
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <div className="relative w-2/3 overflow-hidden rounded-xl">
                <div className="aspect-video w-full rounded-xl bg-gray-200 opacity-20"></div>
                <div className="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2">
                  <PuffLoader size={60} color="#3b82f6" />
                </div>
              </div>
              <p className="flex w-full items-center justify-center gap-2 text-gray-700">
                Generation Progress:
                <span className="font-semibold text-blue-600">{progress}%</span>
              </p>
            </div>
          );
        case 'fail':
          return (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
                <X className="h-8 w-8 text-amber-500" />
              </div>
              <p className="text-amber-500">Generation Failed</p>
            </div>
          );
        default:
          return null;
      }
    }

    return (
      <div className="mt-[10vh] flex h-full w-full flex-col items-center justify-start gap-8 p-4 lg:p-8">
        {defaultContent || (
          <div className="flex w-full flex-col items-center justify-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
              <div className="h-12 w-12 rounded-full bg-blue-600"></div>
            </div>
            <p className="flex w-full items-center justify-center gap-1 text-gray-700">
              Start creating your video content
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={cn('relative h-full w-full', className)} style={style}>
        <div className="h-full w-full">
          <div className="flex h-full w-full flex-col items-start lg:flex-row">
            {/* 操作区 */}
            <div className="mt-6 w-full text-sm lg:mt-0 lg:h-full lg:w-[30%]">
              <div className="w-full flex-col bg-gray-50 lg:flex lg:h-full">
                {/* 快速生成选项 */}
                <div className="flex flex-col gap-2 p-4 pb-2">
                  <div className="w-full rounded-lg bg-white p-2.5">
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex flex-1 items-center gap-1">
                        <label className="text-sm font-medium text-gray-700">Fast Generation</label>
                        <Tooltip content="Fast generation mode is only supports text-to-video generation.">
                          <HelpCircle className="h-4 w-4 cursor-help text-gray-400" />
                        </Tooltip>
                      </div>
                      <button
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                          fastGeneration ? 'bg-blue-500' : 'bg-gray-200'
                        )}
                        onClick={() => handleFastGenerationChange(!fastGeneration)}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            fastGeneration ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 模式切换 */}
                <div className="flex flex-col gap-2 p-4 pt-0">
                  <div className="grid w-full cursor-pointer grid-cols-2 rounded-full bg-white">
                    <div
                      onClick={() => handleModelChange('image')}
                      className={cn(
                        'group relative flex w-full items-center justify-center gap-1 rounded-full p-2 text-sm font-medium transition duration-500',
                        selectedModel === 'image'
                          ? 'bg-blue-600 text-white'
                          : fastGeneration
                            ? 'cursor-not-allowed text-gray-400'
                            : 'cursor-pointer text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <Upload className="h-4 w-4" />
                      <span className="line-clamp-1 max-w-[80%]">Image to Video</span>
                    </div>
                    <div
                      onClick={() => handleModelChange('text')}
                      className={cn(
                        'group relative flex w-full cursor-pointer items-center justify-center gap-1 rounded-full p-2 text-sm font-medium transition duration-500',
                        selectedModel === 'text'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <span className="line-clamp-1 max-w-[80%]">Text to Video</span>
                    </div>
                  </div>
                </div>

                {/* 输入区域 */}
                <div className="flex flex-col items-start gap-2 overflow-auto p-4 pt-1">
                  {/* 图片上传 */}
                  {selectedModel === 'image' && (
                    <div className="flex w-full flex-col items-start space-y-2">
                      <div className="w-full rounded-lg bg-white p-2.5">
                        <label className="mb-2 inline-flex w-full items-center justify-between gap-1 text-sm font-medium text-gray-700">
                          Upload Image
                        </label>
                        <div
                          {...getRootProps()}
                          className={cn(
                            'relative flex aspect-[2/1] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition duration-500',
                            isDragActive
                              ? 'border-blue-500 bg-blue-50'
                              : imagePreviewUrl
                                ? 'border-blue-500'
                                : 'border-gray-200 hover:border-blue-500'
                          )}
                        >
                          <input {...getInputProps()} />
                          {imagePreviewUrl ? (
                            <div className="relative flex h-full w-full items-center justify-center">
                              <img
                                src={imagePreviewUrl}
                                alt="Preview"
                                className="h-auto max-h-full w-auto max-w-full rounded-lg"
                              />
                              <button
                                className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-500 text-white shadow-md transition duration-500 hover:opacity-80"
                                onClick={e => {
                                  e.stopPropagation();
                                  setImagePreviewUrl('');
                                }}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 py-6">
                              {uploadLoading ? (
                                <PulseLoader color="#3b82f6" size={10} />
                              ) : (
                                <>
                                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                  <p className="text-sm text-gray-600">
                                    {isDragActive
                                      ? 'Drop files to upload'
                                      : 'Click or drag image here'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Supports PNG, JPG, JPEG, WEBP formats, max 5MB
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 提示词输入 */}
                  <div className="flex w-full flex-col items-start space-y-2">
                    <div className="w-full rounded-lg bg-white p-2.5">
                      <label className="mb-2 w-full gap-1 text-sm font-medium text-gray-700">
                        {selectedModel === 'image' ? 'Motion Prompt' : 'Video Description'}
                      </label>
                      <div className="relative w-full">
                        <textarea
                          value={prompt}
                          onChange={e => setPrompt(e.target.value)}
                          placeholder={
                            selectedModel === 'image'
                              ? 'Describe the motion and changes in the image...'
                              : 'Describe the video content you want to generate...'
                          }
                          className={cn(
                            'w-full resize-none overflow-y-auto rounded-lg border border-gray-200 p-2 text-sm placeholder:text-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-none',
                            selectedModel === 'image' ? 'h-20 lg:h-24' : 'h-24 lg:h-36'
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 生成按钮 */}
                <div className="flex flex-col gap-2 px-4 pb-4">
                  <Button
                    onClick={startGenerate}
                    disabled={generateLoading}
                    className="w-full py-3 text-base font-semibold"
                    variant="primary"
                  >
                    {generateLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <PulseLoader color="white" size={6} />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      'Generate Video'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* 生成区 */}
            <div className="relative m-auto flex w-full flex-col items-center justify-center lg:h-[80vh] lg:w-[70%]">
              <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-2">
                {renderVideo()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
};
