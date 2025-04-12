'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeGenerator({ url }) {
  return (
    <div className="relative group">
      <QRCodeSVG 
        value={url}
        size={64}
        level="H"
        includeMargin={true}
        className="rounded-lg shadow-sm hover:shadow-md transition-shadow"
      />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
        <div className="bg-white p-2 rounded-lg shadow-lg">
          <QRCodeSVG 
            value={url}
            size={128}
            level="H"
            includeMargin={true}
          />
          <p className="text-xs text-center mt-2 text-gray-600">Scan to visit</p>
        </div>
      </div>
    </div>
  );
} 