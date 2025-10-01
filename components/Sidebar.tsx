import React from 'react';
import { StethoscopeIcon, ChevronDownIcon } from './icons';
import { Chapter } from '../constants';

interface SidebarProps {
  chapters: Chapter[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  expandedChapters: string[];
  onToggleChapter: (chapterTitle: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ chapters, selectedTopic, onSelectTopic, expandedChapters, onToggleChapter }) => {
  return (
    <aside className="w-64 md:w-72 lg:w-80 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg">
      <div className="p-5 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <StethoscopeIcon />
          Course Chapters
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul>
          {chapters.map((chapter) => {
            const isExpanded = expandedChapters.includes(chapter.title);
            return (
              <li key={chapter.title} className="mb-2">
                <button
                  onClick={() => onToggleChapter(chapter.title)}
                  className="w-full text-left p-3 rounded-lg flex justify-between items-center font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-expanded={isExpanded}
                >
                  <span>{chapter.title}</span>
                  <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}>
                  <ul className="pt-1 pl-4 border-l-2 border-cyan-100 ml-3">
                    {chapter.topics.map((topic) => (
                      <li key={topic} className="my-1">
                        <button
                          onClick={() => onSelectTopic(topic)}
                          className={`w-full text-left p-2.5 rounded-md transition-all duration-200 ease-in-out text-sm font-medium flex items-center ${
                            selectedTopic === topic
                              ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white shadow-md'
                              : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-800'
                          }`}
                        >
                          <div className="w-6 flex-shrink-0">
                           <span className={`w-1.5 h-1.5 rounded-full block transition-colors ${selectedTopic === topic ? 'bg-white/70' : 'bg-cyan-400'}`}></span>
                          </div>
                          {topic}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-200 mt-auto text-center text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} AI Study Guide</p>
        <p>Powered by Gemini</p>
      </div>
    </aside>
  );
};

export default Sidebar;