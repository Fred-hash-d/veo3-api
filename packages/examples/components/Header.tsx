import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExternalLink } from 'lucide-react';

export default function Header() {
  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/', internal: true },
    { name: 'KIE.AI', href: 'https://kie.ai/', internal: false },
    { name: 'Veo3', href: 'https://kie.ai/features/v3-api', internal: false },
    { name: 'Docs', href: 'https://docs.kie.ai/veo3-api/generate-veo-3-video', internal: false },
    { name: 'Github', href: 'https://github.com/fred-hash-d/veo3-api', internal: false },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return router.pathname === '/';
    }
    return router.pathname === href;
  };

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">API Playground</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            {navigation.map(item => (
              <div key={item.name}>
                {item.internal ? (
                  <Link
                    href={item.href}
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:text-blue-600"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
