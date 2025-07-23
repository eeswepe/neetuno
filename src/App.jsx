// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// import useLocalStorageState from './hooks/useLocalStorageState';
import TopicListPage from './components/TopicListPage';
import TopicDetailPage from './components/TopicDetailPage';

export default function App() {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [apiKey, setApiKey] = useLocalStorageState('geminiApiKey', '');
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const topicsCollectionRef = collection(db, "topics");

  useEffect(() => {
    const getTopics = async () => {
      setIsLoading(true);
      const data = await getDocs(topicsCollectionRef);
      const loadedTopics = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setTopics(loadedTopics);
      setIsLoading(false);
    };
    getTopics();
  }, []);

  const handleAddTopic = async (newTopicData) => {
    const { id, ...dataToSend } = newTopicData;
    const newDocRef = await addDoc(topicsCollectionRef, dataToSend);
    setTopics(prev => [...prev, { ...dataToSend, id: newDocRef.id }]);
  };
  
  const handleUpdateTopic = async (updatedTopic) => {
    const topicDoc = doc(db, "topics", updatedTopic.id);
    const { id, ...dataToUpdate } = updatedTopic;
    await updateDoc(topicDoc, dataToUpdate);
    setTopics(prevTopics => prevTopics.map(topic => topic.id === id ? updatedTopic : topic));
  };
  
  const handleDeleteTopic = async (topicId) => {
    const topicDoc = doc(db, "topics", topicId);
    await deleteDoc(topicDoc);
    setTopics(prev => prev.filter(t => t.id !== topicId));
  };

  const handleSelectTopic = (topicId) => {
    setSelectedTopicId(topicId);
    setCurrentPage('detail');
  };

  if (isLoading) {
    return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Memuat data dari Firebase...</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {currentPage === 'list' && (
          <TopicListPage
            topics={topics}
            onSelectTopic={handleSelectTopic}
            onAddTopic={handleAddTopic}
            onDeleteTopic={handleDeleteTopic}
          />
        )}
        {currentPage === 'detail' && selectedTopicId && (
          <TopicDetailPage
            topic={topics.find(t => t.id === selectedTopicId)}
            onUpdateTopic={handleUpdateTopic}
            onBack={() => setCurrentPage('list')}
          />
        )}
      </div>
      <footer className="text-center text-gray-500 mt-12 text-sm">
        <p>Made By <b>eeswepe</b></p>
        <p>Integrated with Firestore and Gemini By Google</p>
      </footer>
    </div>
  );
}
