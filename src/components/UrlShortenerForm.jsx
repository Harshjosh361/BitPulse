"use client";
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function UrlShortenerForm() {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customAlias: '',
    expiresAt: '',
  });
  const [error, setError] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl('');

    try {
      const response = await fetch('/api/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: formData.originalUrl,
          customAlias: formData.customAlias || undefined,
          expiresAt: formData.expiresAt || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create short URL');

      setShortenedUrl(`${window.location.origin}/${data.shortUrl}`);
      setFormData({ originalUrl: '', customAlias: '', expiresAt: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          <h2 className="text-3xl font-bold tracking-tight">Create Short Link</h2>
        </div>
        <p className="mt-2 text-gray-600">Transform long URLs into concise, trackable links</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Long URL
            </label>
            <input
              type="url"
              id="originalUrl"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customAlias" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Alias
              </label>
              <input
                type="text"
                id="customAlias"
                name="customAlias"
                value={formData.customAlias}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="(optional)"
              />
            </div>

            <div>
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                Expiration Date
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                value={formData.expiresAt}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg
                   transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-blue-200"
        >
          Generate Short URL
        </button>
      </form>

      {shortenedUrl && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Shortened URL:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shortenedUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-white text-black"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shortenedUrl)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg
                       transform transition-all duration-200 hover:scale-[1.02] shadow-sm"
            >
              Copy
            </button>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Scan QR Code:</p>
            <QRCodeSVG 
              value={shortenedUrl}
              size={128}
              level="H"
              includeMargin={true}
              className="rounded-lg shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}