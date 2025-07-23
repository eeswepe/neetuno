// src/components/TopicListPage.jsx
import React, { useState } from 'react';
import { PlusCircle, Trash2, BookOpen } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';

const TopicListPage = ({ topics, onSelectTopic, onAddTopic, onDeleteTopic }) => {
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim() || !newTopicCategory.trim()) return;
    const newTopic = { id: Date.now(), name: newTopicName, category: newTopicCategory, progress: 'Belum Dimulai', resources: [], notes: '' };
    onAddTopic(newTopic);
    setNewTopicName('');
    setNewTopicCategory('');
    setIsAdding(false);
  };

  const getProgressBadgeColor = (progress) => ({ 'Selesai': 'green', 'Sedang Dipelajari': 'yellow' }[progress] || 'gray');

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Neetuno</h1>
        {!isAdding && <Button onClick={() => setIsAdding(true)}><PlusCircle size={16} className="me-2" />Tambah Topik</Button>}
      </div>
      {isAdding && (
        <form onSubmit={handleAddTopic} className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Topik Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" value={newTopicName} onChange={(e) => setNewTopicName(e.target.value)} placeholder="Nama Topik (e.g., Belajar State Management React)" className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" required />
            <input type="text" value={newTopicCategory} onChange={(e) => setNewTopicCategory(e.target.value)} placeholder="Kategori (e.g., Frontend Development)" className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" required />
          </div>
          <div className="flex gap-4"><Button type="submit">Tambah</Button><Button onClick={() => setIsAdding(false)} variant="secondary">Batal</Button></div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length > 0 ? (
          topics.map(topic => (
            <div key={topic.id} className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1 hover:shadow-indigo-500/20">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Badge color={getProgressBadgeColor(topic.progress)}>{topic.progress}</Badge>
                  <Button onClick={(e) => { e.stopPropagation(); onDeleteTopic(topic.id); }} variant="danger" className="p-2 h-8 w-8 !rounded-full opacity-50 hover:opacity-100"><Trash2 size={14} /></Button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                <p className="text-sm text-gray-400">{topic.category}</p>
              </div>
              <Button onClick={() => onSelectTopic(topic.id)} className="mt-6 w-full"><BookOpen size={16} className="me-2" />Lihat Detail & Sumber</Button>
            </div>
          ))
        ) : <div className="col-span-full text-center py-16 bg-gray-800 rounded-xl"><h2 className="text-2xl font-semibold text-white">Daftar masih kosong!</h2><p className="text-gray-400 mt-2">Mulai tambahkan topik yang ingin kamu pelajari.</p></div>}
      </div>
    </div>
  );
};

export default TopicListPage;
