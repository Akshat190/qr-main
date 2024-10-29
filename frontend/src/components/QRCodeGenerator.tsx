import React from 'react';
import QRCode from 'qrcode.react';
import { Download, Utensils, QrCode, MapPin } from 'lucide-react';
import { toPng } from 'html-to-image';
import { motion } from 'framer-motion';

interface QRCodeGeneratorProps {
  restaurantId?: string;
  url: string;
  restaurantName?: string;
}

export const QRCodeGenerator = ({ restaurantId, url, restaurantName }: QRCodeGeneratorProps) => {
  const menuUrl = `${url}/restaurant/${restaurantId}/menu`;

  const handleDownload = async () => {
    const qrTemplate = document.getElementById('qr-template');
    if (qrTemplate) {
      try {
        const dataUrl = await toPng(qrTemplate, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: '#ffffff',
        });
        
        const link = document.createElement('a');
        link.download = `${restaurantName || 'restaurant'}-menu-qr.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating QR template:', error);
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center max-w-lg mx-auto">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Your Restaurant's Menu QR Code</h3>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div id="qr-template" className="w-full max-w-[320px] sm:max-w-[400px] mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl mb-6">
          <div className="bg-white rounded-2xl p-4 sm:p-8 flex flex-col items-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiIGZpbGw9IiMzNzM3MzciIGZpbGwtb3BhY2l0eT0iMC4xIi8+CiAgPHBhdGggZD0iTTAgMGgxNXYxNUgweiIgZmlsbD0iIzM3MzczNyIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] bg-repeat"></div>
            </div>

            {/* Restaurant Logo & Name */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
              <Utensils className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-2">
              {restaurantName || 'Restaurant Menu'}
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-6 sm:mb-8">
              <QrCode className="w-4 h-4" />
              <p className="text-sm">Scan to view our digital menu</p>
            </div>
            
            {/* QR Code with enhanced styling */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-xl shadow-2xl">
              <div className="bg-white p-3 sm:p-4 rounded-lg">
                <QRCode
                  id="qr-code"
                  value={menuUrl}
                  size={180}
                  level="H"
                  includeMargin={false}
                  className="rounded-lg"
                  fgColor="#4F46E5"
                />
              </div>
            </div>
            
            {/* Footer with enhanced design */}
            <div className="w-full text-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <p className="text-sm">Place this QR code on your table</p>
              </div>
              <p className="text-xs text-gray-400 mb-1">Powered by</p>
              <p className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                QR Menu System
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-all duration-300 w-full shadow-md"
      >
        <Download className="h-4 w-4" />
        Download QR Code
      </motion.button>
      
      <p className="text-sm text-gray-600 mt-4">
        High quality PNG file for printing
      </p>
    </div>
  );
};