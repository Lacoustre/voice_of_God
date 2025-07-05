import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Share2, Copy, Check } from 'lucide-react';

const QRCodeGenerator = ({ url = 'https://thevogministries.org/join', title = 'Join Voice of God Ministry' }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#4F46E5', // Indigo color
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    generateQRCode();
  }, [url]);



  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = 'vog-ministry-join-qr.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Join our church community!',
          url: url
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">Scan to join our community</p>
      </div>
      
      {qrCodeUrl && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-inner">
            <img 
              src={qrCodeUrl} 
              alt="QR Code for joining ministry" 
              className="w-48 h-48"
            />
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3 break-all">{url}</p>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={downloadQRCode}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                title="Download QR Code"
              >
                <Download size={16} />
                Download
              </button>
              
              <button
                onClick={shareQRCode}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                title="Share"
              >
                <Share2 size={16} />
                Share
              </button>
              
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Copy URL"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;