import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import TopicListPage from './components/TopicListPage';
import TopicDetailPage from './components/TopicDetailPage';

function AppContent() {
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState('list');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const { user, isLoading: authLoading } = useAuth();
  const topicsCollectionRef = collection(db, "topics");

  useEffect(() => {
    if (user) {
      const getTopics = async () => {
        // Query hanya topik yang dibuat oleh user yang sedang login
        const q = query(topicsCollectionRef, where("userId", "==", user.id));
        const data = await getDocs(q);
        const loadedTopics = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setTopics(loadedTopics);
      };
      getTopics();
    } else {
      setTopics([]);
    }
  }, [user]);

  // Count category
  const categoryCounts = useMemo(() => {
    return topics.reduce((acc, topic) => {
      const category = topic.category || 'Random';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  }, [topics]);

  // filter category logic
  const filteredTopics = useMemo(() => {
    if (!categoryFilter) {
      return topics;
    }
    return topics.filter((topic) => topic.category === categoryFilter);
  }, [topics, categoryFilter]);

  const handleAddTopic = async (newTopicData) => {
    const { id, ...dataToSend } = newTopicData;
    // Tambahkan userId ke data topik
    const topicWithUser = { ...dataToSend, userId: user.id };
    const newDocRef = await addDoc(topicsCollectionRef, topicWithUser);
    setTopics(prev => [...prev, { ...topicWithUser, id: newDocRef.id }]);
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

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p>Memuat...</p>
        </div>
      </div>
    );
  }

  // Show auth page if user is not logged in
  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* {currentPage === 'welcome' && ( */}
        {/*   <WelcomePage onStart={() => setCurrentPage('list')} /> */}
        {/* )} */}
        {currentPage === 'list' && (
          <TopicListPage
            topics={filteredTopics}
            allTopicCounts={topics.length}
            categoryCounts={categoryCounts}
            activeFilter={categoryFilter}
            onSelectTopic={handleSelectTopic}
            onAddTopic={handleAddTopic}
            onDeleteTopic={handleDeleteTopic}
            onSetFilter={setCategoryFilter}
            onClearFilter={() => setCategoryFilter(null)}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
