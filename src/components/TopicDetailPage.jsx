import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import useDebounce from '../hooks/useDebounce';

const TopicDetailPage = ({ topic, onUpdateTopic, onBack }) => {
  // State untuk form 'Tambah Sumber Baru'
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceDesc, setNewResourceDesc] = useState('');

  // State untuk fitur AI
  const [isAiChecking, setIsAiChecking] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [aiError, setAiError] = useState('');

  // State LOKAL untuk textarea catatan agar input terasa lancar
  const [localNotes, setLocalNotes] = useState(topic.notes || '');
  
  // Gunakan hook useDebounce untuk menunda update ke Firebase
  const debouncedNotes = useDebounce(localNotes, 1000); // Jeda 1 detik

  // useEffect akan berjalan HANYA saat nilai debouncedNotes berubah
  useEffect(() => {
    // Hindari update saat komponen pertama kali render jika isinya sama
    if (debouncedNotes !== topic.notes) {
      onUpdateTopic({ ...topic, notes: debouncedNotes });
    }
  }, [debouncedNotes]);


  // Handler untuk mengupdate state LOKAL saat mengetik di textarea
  const handleNotesChange = (e) => {
    setLocalNotes(e.target.value);
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newResourceUrl.trim() || !newResourceDesc.trim()) return;
    const newResource = { id: Date.now(), url: newResourceUrl, description: newResourceDesc };
    onUpdateTopic({ ...topic, resources: [...topic.resources, newResource] });
    setNewResourceUrl('');
    setNewResourceDesc('');
  };

  const handleDeleteResource = (resourceId) => {
    const updatedResources = topic.resources.filter(res => res.id !== resourceId);
    onUpdateTopic({ ...topic, resources: updatedResources });
  };

  const handleProgressChange = (e) => {
    onUpdateTopic({ ...topic, progress: e.target.value });
  };

  const handleAiCheck = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setAiError("API Key Gemini tidak ditemukan di environment. Pastikan file .env sudah benar.");
      return;
    }
    if (!localNotes.trim()) {
      setAiError("Catatan masih kosong, tidak ada yang bisa diperiksa.");
      return;
    }

    setIsAiChecking(true);
    setAiFeedback('');
    setAiError('');

    const prompt = `Sebagai seorang asisten ahli, evaluasi apakah catatan berikut ini relevan dan sesuai dengan topik yang diberikan. Berikan masukan serta sanggahan yang sedikit panjang(4-8 kalimat) dalam Bahasa Indonesia. Topik: "${topic.name}". Catatan: "${localNotes}."`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const feedbackText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (feedbackText) {
        setAiFeedback(feedbackText);
      } else {
        setAiError("Gagal mendapatkan respons dari AI. Format tidak terduga.");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setAiError(`Terjadi kesalahan: ${error.message}.`);
    } finally {
      setIsAiChecking(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Button onClick={onBack} variant="secondary" className="mb-6">
        <ArrowLeft size={16} className="me-2" />
        Kembali ke Daftar
      </Button>
      <div className="bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{topic.name}</h1>
            <Badge color="blue">{topic.category}</Badge>
          </div>
          <div className="mt-4 md:mt-0">
            <label htmlFor="progress" className="block text-sm font-medium text-gray-400 mb-1">Progress Belajar</label>
            <select id="progress" value={topic.progress} onChange={handleProgressChange} className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5">
              <option value="Belum Dimulai">Belum Dimulai</option>
              <option value="Sedang Dipelajari">Sedang Dipelajari</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Sumber Belajar</h2>
          <div className="space-y-4 mb-6">
            {topic.resources && topic.resources.length > 0 ? (
              topic.resources.map(res => (
                <div key={res.id} className="bg-gray-700/50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{res.description}</p>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm break-all">
                      {res.url} <ExternalLink size={12} className="inline-block ms-1" />
                    </a>
                  </div>
                  <Button onClick={() => handleDeleteResource(res.id)} variant="danger" className="p-2 h-10 w-10">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            ) : <p className="text-gray-400 text-center py-4">Belum ada sumber belajar.</p>}
          </div>
          <form onSubmit={handleAddResource} className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Tambah Sumber Baru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={newResourceDesc} onChange={(e) => setNewResourceDesc(e.target.value)} placeholder="Deskripsi (e.g., Dokumentasi Resmi)" className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" required />
              <input type="url" value={newResourceUrl} onChange={(e) => setNewResourceUrl(e.target.value)} placeholder="https://..." className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" required />
            </div>
            <Button type="submit" className="mt-4 w-full md:w-auto">
              <PlusCircle size={16} className="me-2" />
              Tambah Sumber
            </Button>
          </form>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Catatan / Rangkuman</h2>
          <textarea
            value={localNotes}
            onChange={handleNotesChange}
            placeholder="Tulis rangkuman atau hal-hal penting yang kamu pelajari di sini..."
            className="bg-gray-900/50 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-4 h-60"
            rows="10"
          />
          <div className="mt-6 bg-gray-900/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Integrasi AI</h3>
            <p className="text-sm text-gray-400 mb-4">Gunakan AI untuk memeriksa relevansi catatan Anda dengan topik.</p>
            <Button onClick={handleAiCheck} disabled={isAiChecking}>
              {isAiChecking ? 'Memeriksa...' : <><Sparkles size={16} className="me-2" />Periksa Catatan dengan AI</>}
            </Button>
            {aiFeedback && <div className="mt-4 p-3 bg-green-900/50 border border-green-700 text-green-200 rounded-lg text-sm">{aiFeedback}</div>}
            {aiError && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-sm">{aiError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetailPage;
