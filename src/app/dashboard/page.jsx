"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import QRCodeGenerator from '@/components/QRCode';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('shortener');
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (session) fetchUrls();
  }, [status, session, router]);

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/url/user');
      const data = await response.json();
      setUrls(data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === 'analytics') router.push('/analytics');
    else setActiveTab(tab);
  };

  if (status === 'loading') return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold text-black">Bit Pulse</h1>
          </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
          <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold text-black">Bit Pulse</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2">
              <button
                onClick={() => handleTabClick('analytics')}
                className={`px-4 py-2 rounded-lg transition-colors hover:cursor-pointer  hover:border-gray-500 hover:underline ${
                  activeTab === 'analytics'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Analytics
              </button>
            </nav>
            <button
              onClick={() => {
                signOut({ callbackUrl: '/login' });
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg
                       transform transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-4 py-12">
          {activeTab === 'shortener' && <UrlShortenerForm />}
          
          {/* URLs Table */}
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      QR Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                          {url.originalUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={`/${url.shortUrl}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                          {url.shortUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <QRCodeGenerator url={`${window.location.origin}/${url.shortUrl}`} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {url.clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          url.expiresAt && new Date() > new Date(url.expiresAt)
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {url.expiresAt && new Date() > new Date(url.expiresAt)
                            ? 'Expired'
                            : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bit Pulse. Secure URL management simplified.
          </p>
        </div>
      </footer>
    </div>
  );
}