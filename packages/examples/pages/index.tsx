import React, { useState } from 'react';
import Veo3Playground from 'veo3-api';
import Head from 'next/head';
import Header from '../components/Header';

// Convert tmpfiles.org URL to download URL
const convertToDownloadUrl = (url: string): string => {
  if (url.includes('tmpfiles.org/') && !url.includes('/dl/')) {
    return url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  }
  return url;
};

// File upload function using tmpfiles.org API
const putFile = async (file: File): Promise<string> => {
  try {
    const url = 'https://tmpfiles.org/api/v1/upload';
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Check if upload was successful
    if (result.status === 'success' && result.data && result.data.url) {
      return Promise.resolve(convertToDownloadUrl(result.data.url));
    } else {
      return Promise.reject(new Error(result.message || 'Upload failed'));
    }
  } catch (error) {
    return Promise.reject(new Error('File upload failed'));
  }
};

// Simulate file download function
const downloadFile = async (url: string): Promise<void> => {
  // This should be your actual file download logic
  const link = document.createElement('a');
  link.href = url;
  link.download = 'video.mp4';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Default display content
const DefaultContent = () => (
  <div className="text-center">
    <div className="mx-auto mb-10 flex w-full max-w-5xl flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-4xl">
        Veo3 Video Generator
      </h1>
      <p className="text-sm text-gray-600">
        Powerful AI-powered video generation tool, supporting image-to-video and text-to-video
      </p>
    </div>
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Image to Video</h3>
        <p className="text-sm text-gray-600">
          Upload images, add motion descriptions, and generate dynamic video content
        </p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Text to Video</h3>
        <p className="text-sm text-gray-600">
          Generate video content directly through text descriptions
        </p>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">High Quality Output</h3>
        <p className="text-sm text-gray-600">
          Support multiple resolutions and generate high-quality video content
        </p>
      </div>
    </div>
  </div>
);

export default function Veo3Page() {
  const [apiKey, setApiKey] = useState('');

  return (
    <>
      <Head>
        <title>Veo3 Video Generator - Example</title>
        <meta name="description" content="Powerful AI-powered video generation tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* API Key Configuration Section */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow-lg">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="text-red-500">*</span> API Key:
              </h3>
              <div className="max-w-md flex-1">
                <input
                  type="text"
                  id="apiKey"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <a
                href="https://kie.ai/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap text-sm text-blue-600 underline hover:text-blue-800"
              >
                Get API Key
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <Veo3Playground
              putFile={putFile}
              downloadFile={downloadFile}
              apiKey={apiKey}
              defaultContent={<DefaultContent />}
              className="min-h-[600px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
