import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the QRCode component to disable SSR
const QRCode = dynamic(() => import('qrcode.react'), { ssr: false });

const QRCodeGenerator = ({ value }) => {
  const qrCodeRef = useRef(null);

  // Function to download the QR code as an image
  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.querySelector('canvas');
      if (canvas) {
        const imageURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'qrcode.png';
        link.click();
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h2>QR Code Generator</h2>
      <div style={{ margin: '20px' }} ref={qrCodeRef}>
        {value && (
          <QRCode value={value} size={256} />
        )}
      </div>
      {value && (
        <button 
          onClick={downloadQRCode} 
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Download QR Code
        </button>
      )}
    </div>
  );
};

export default QRCodeGenerator;
