import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import { STUDY_TOPICS, Chapter } from './constants';
import { generateStudyGuide } from './services/geminiService';
import { BookIcon } from './components/icons';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  const fetchContent = useCallback(async (topic: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent('');
    try {
      const content = await generateStudyGuide(topic);
      setGeneratedContent(content);
    } catch (err) {
      setError('Failed to generate content. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      fetchContent(selectedTopic);
    }
  }, [selectedTopic, fetchContent]);

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    const parentChapter = STUDY_TOPICS.find(chapter => chapter.topics.includes(topic));
    if (parentChapter && !expandedChapters.includes(parentChapter.title)) {
      setExpandedChapters(prev => [...prev, parentChapter.title]);
    }
  };

  const toggleChapter = (chapterTitle: string) => {
    setExpandedChapters(prev =>
      prev.includes(chapterTitle)
        ? prev.filter(title => title !== chapterTitle)
        : [...prev, chapterTitle]
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar
        chapters={STUDY_TOPICS}
        selectedTopic={selectedTopic}
        onSelectTopic={handleSelectTopic}
        expandedChapters={expandedChapters}
        onToggleChapter={toggleChapter}
      />
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        <header className="mb-8 p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <BookIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold">BNYS Modern Diagnostics Guide</h1>
                <p className="opacity-80">Your AI-powered study assistant for Naturopathy & Yogic Sciences</p>
              </div>
            </div>
        </header>
        <ContentDisplay
          topic={selectedTopic}
          isLoading={isLoading}
          content={generatedContent}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;