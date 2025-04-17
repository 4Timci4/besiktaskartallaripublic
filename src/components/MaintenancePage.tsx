import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-yellow-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h1 className="text-2xl font-bold mb-4">Bakım Çalışması</h1>
        <p className="text-black mb-6">
          Şu anda sistemimizde bakım çalışması yapılmaktadır. Kısa süre içinde hizmetinize devam edeceğiz.
          Anlayışınız için teşekkür ederiz.
        </p>
        <p className="text-sm text-gray-500">Tahmini tamamlanma süresi: 1-2 saat</p>
      </div>
    </div>
  );
};

export default MaintenancePage; 