import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ContentDisplay from './components/ContentDisplay';
import { STUDY_TOPICS, Chapter } from './constants';
import { generateStudyGuide, isApiKeySet } from './services/geminiService';
import { BookIcon, AlertTriangleIcon } from './components/icons';

const ApiKeyErrorDisplay: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-red-50 text-red-800 font-sans">
    <div className="text-center p-8 bg-white rounded-xl shadow-2xl border-2 border-red-200 max-w-lg mx-4">
      <div className="flex justify-center mb-4">
        <AlertTriangleIcon className="text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-red-900 mb-2">Configuration Error</h1>
      <p className="text-red-700 leading-relaxed">
        The application is missing the required API key for the Gemini API. This is not an error with the application itself, but with its current deployment configuration.
      </p>
      <p className="mt-4 text-sm text-red-600">
        To fix this, please ensure the <code>API_KEY</code> environment variable is set correctly in your deployment settings (e.g., Netlify, Vercel, etc.).
      </p>
    </div>
  </div>
);


const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  if (!isApiKeySet) {
    return <ApiKeyErrorDisplay />;
  }

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
