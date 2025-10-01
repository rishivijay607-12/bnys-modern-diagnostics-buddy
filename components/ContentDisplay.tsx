import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import LoadingSpinner from './LoadingSpinner';
import SelectionPopover from './SelectionPopover';
import DefinitionModal from './DefinitionModal';
import { defineWord } from '../services/geminiService';
import { LightbulbIcon, CheckCircleIcon, InfoIcon } from './icons';

interface ContentDisplayProps {
  topic: string | null;
  isLoading: boolean;
  content: string;
  error: string | null;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center p-8 bg-white rounded-lg shadow-md border border-slate-200">
    <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-br from-cyan-100 to-teal-200 p-4 rounded-full">
            <LightbulbIcon className="text-cyan-700" />
        </div>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to your Study Guide!</h2>
    <p className="text-slate-600">Please select a diagnostic topic from the sidebar to begin learning.</p>
    <p className="text-slate-500 mt-4 text-sm">The AI will generate a detailed, structured guide for the topic you choose.</p>
  </div>
);

const ContentDisplay: React.FC<ContentDisplayProps> = ({ topic, isLoading, content, error }) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDefinitionModalOpen, setIsDefinitionModalOpen] = useState<boolean>(false);
  const [definition, setDefinition] = useState<string>('');
  const [isDefining, setIsDefining] = useState<boolean>(false);
  const [definitionError, setDefinitionError] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });
      try {
        const mermaidElements = document.querySelectorAll('.language-mermaid');
        if (mermaidElements.length > 0) {
           mermaid.run({
             nodes: mermaidElements as NodeListOf<HTMLElement>,
           });
        }
      } catch (e) {
        console.error("Error rendering mermaid chart:", e);
      }
    }
  }, [content]);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 2 && text.length < 50) {
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setPopoverPosition({
          top: rect.top - 45 + window.scrollY,
          left: rect.left + (rect.width / 2) - 45 + window.scrollX,
        });
        setSelectedText(text);
      }
    } else {
      setPopoverPosition(null);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverPosition && !(event.target as HTMLElement).closest('[aria-label="Define selected text"]')) {
         const selection = window.getSelection();
         if (selection?.isCollapsed) {
           setPopoverPosition(null);
         }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverPosition]);

  const handleDefineClick = async () => {
    if (!selectedText) return;

    setPopoverPosition(null);
    setIsDefinitionModalOpen(true);
    setIsDefining(true);
    setDefinitionError(null);

    try {
      const def = await defineWord(selectedText);
      setDefinition(def);
    } catch (err) {
      setDefinitionError('Sorry, I could not find a definition for that term.');
    } finally {
      setIsDefining(false);
    }
  };

  const handleCloseModal = () => {
    setIsDefinitionModalOpen(false);
    setTimeout(() => {
      setDefinition('');
      setSelectedText('');
      setDefinitionError(null);
    }, 300);
  };

  return (
    <>
      <div 
        onMouseUp={handleMouseUp}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 h-full overflow-y-auto"
      >
        {isLoading && <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>}
        {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg text-center font-medium">{error}</div>}
        {!isLoading && !error && content && (
          <article className="prose max-w-none">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500 mb-6 pb-2">
              {topic}
            </h2>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h3: ({...props}) => <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4 pb-2 border-b-2 border-cyan-200" {...props} />,
                p: ({...props}) => <p className="text-slate-700 leading-relaxed" {...props} />,
                ul: ({...props}) => <ul className="list-none p-0 space-y-2" {...props} />,
                li: ({children, ...props}) => (
                  <li className="flex items-start gap-3 p-0" {...props}>
                    <div className="pt-1 text-cyan-500 flex-shrink-0"><CheckCircleIcon /></div>
                    <div>{children}</div>
                  </li>
                ),
                strong: ({...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                blockquote: ({...props}) => (
                  <div className="bg-cyan-50 border-l-4 border-cyan-400 p-4 my-4 rounded-r-lg" role="alert">
                    <div className="flex items-start gap-3">
                      <div className="text-cyan-600 flex-shrink-0 pt-0.5"><InfoIcon /></div>
                      <div className="text-cyan-900 prose-p:my-0">{props.children}</div>
                    </div>
                  </div>
                ),
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (match && match[1] === 'mermaid') {
                    return <div className="language-mermaid text-center my-6 p-4 bg-slate-50 rounded-lg overflow-x-auto flex justify-center">{String(children)}</div>;
                  }
                  return <code className="bg-slate-100 text-slate-800 p-1 rounded-md before:content-[''] after:content-['']" {...props}>{children}</code>;
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        )}
        {!isLoading && !error && !content && <WelcomeMessage />}
      </div>

      {popoverPosition && (
        <SelectionPopover
          position={popoverPosition}
          onDefine={handleDefineClick}
        />
      )}

      {isDefinitionModalOpen && (
        <DefinitionModal
          word={selectedText}
          definition={definition}
          isLoading={isDefining}
          error={definitionError}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ContentDisplay;
