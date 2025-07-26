// src/components/PWAPrompt.jsx
import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import Button from './ui/Button'; // Asumsi Anda punya komponen Button

function PWAPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker terdaftar:', r);
    },
    onRegisterError(error) {
      console.log('Error saat registrasi Service Worker:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (offlineReady || needRefresh) {
    return (
      <div className="fixed right-0 bottom-0 m-4 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl z-50 animate-fade-in-up">
        <div className="flex items-center justify-between gap-6">
          <div className="text-white">
            {needRefresh ? 'Versi baru tersedia!' : 'Aplikasi siap digunakan offline.'}
          </div>
          {needRefresh && (
            <Button onClick={() => updateServiceWorker(true)} className="flex-shrink-0">
              <RefreshCw size={16} className="me-2" />
              Update
            </Button>
          )}
          <button onClick={close} className="text-gray-400 hover:text-white">&times;</button>
        </div>
      </div>
    );
  }

  return null;
}

export default PWAPrompt;

