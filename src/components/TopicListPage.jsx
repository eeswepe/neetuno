// src/components/TopicListPage.jsx
import React, { useState } from 'react';
import { PlusCircle, Trash, BookOpen, Tags, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import CategoryFilter from './CategoryFilter';

const TopicListPage = ({ topics, allTopicCounts, categoryCounts, activeFilter, onSelectTopic, onAddTopic, onDeleteTopic, onSetFilter, onClearFilter }) => {
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
      logout();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Neetuno</h1>
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center text-gray-300">
            <User size={18} className="mr-2" />
            <span className="text-sm">Halo, <b>{user?.username}</b></span>
          </div>


          {/* Logout Button */}
          <Button onClick={handleLogout} variant="secondary">
            <LogOut size={16} className="me-2" />
            Keluar
          </Button>
        </div>
      </div>

      <div className='flex justify-between items-center mb-8 '>
        <h3 className='text-lg font-light text-gray-400'>List Topik</h3>

        <div className='flex gap-3'>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <PlusCircle size={16} className="me-2" />
              Tambah Topik
            </Button>
          )}

          <Button onClick={() => setIsFilterVisible(!isFilterVisible)}>
            <Tags size={15} className="me-2" />
            {isFilterVisible ? 'Sembunyikan Tag' : 'Tampilkan Tag'}
          </Button>

        </div>

      </div>

      {isAdding && (
        <form onSubmit={handleAddTopic} className="bg-gray-800 p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Topik Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Nama Topik (e.g., Belajar State Management React)"
              className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              required
            />
            <input
              type="text"
              value={newTopicCategory}
              onChange={(e) => setNewTopicCategory(e.target.value)}
              placeholder="Kategori (e.g., Frontend Development)"
              className="bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit">Tambah</Button>
            <Button onClick={() => setIsAdding(false)} variant="secondary">Batal</Button>
          </div>
        </form>
      )}

      {isFilterVisible && (
        <CategoryFilter
          categoryCounts={categoryCounts}
          onSetFilter={onSetFilter}
          activeFilter={activeFilter}
          onClearFilter={onClearFilter}
        />
      )}

      <div className='mb-4 font-bold'>
        {activeFilter && (
          <h5>Kategori: {activeFilter}</h5>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.length > 0 ? (
          topics.map(topic => (
            <div key={topic.id} className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform transform hover:-translate-y-1 hover:shadow-indigo-500/20">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Badge color={getProgressBadgeColor(topic.progress)}>{topic.progress}</Badge>
                  <Button onClick={(e) => { e.stopPropagation(); onDeleteTopic(topic.id); }} variant="danger" className="p-2 !rounded-full opacity-50 hover:opacity-100">
                    <Trash size={16} />
                  </Button>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                <p className="text-sm text-gray-400">{topic.category}</p>
              </div>
              <Button onClick={() => onSelectTopic(topic.id)} className="mt-6 w-full">
                <BookOpen size={16} className="me-2" />
                Lihat Detail & Sumber
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-gray-800 rounded-xl">
            <h2 className="text-2xl font-semibold text-white">Daftar masih kosong!</h2>
            <p className="text-gray-400 mt-2">Mulai tambahkan topik yang ingin kamu pelajari.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicListPage;
