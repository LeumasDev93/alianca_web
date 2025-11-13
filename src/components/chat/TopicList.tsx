"use client";

export interface Topic {
  id: string;
  name: string;
  type: string;
  hasChildren: boolean;
  children: Topic[];
  isExpanded?: boolean;
}

interface TopicListProps {
  topics: Topic[];
  onSelectTopic: (topic: Topic) => void;
  alignRight?: boolean;
  isChild?: boolean;
  asGrid?: boolean;
  isHomeTab?: boolean;
}

export default function TopicList({ topics, onSelectTopic, alignRight = false, isChild = false, asGrid = false, isHomeTab = false }: TopicListProps) {
  const renderTopic = (topic: Topic, index: number) => {
    const hasChildren = topic.hasChildren && topic.children.length > 0;
    const isExpanded = topic.isExpanded || false;

    return (
      <div key={topic.id} className="w-full">
        <div className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
          <button
            onClick={() => onSelectTopic(topic)}
            className={`inline-flex border rounded-xl sm:rounded-2xl font-normal transition-all duration-300 items-center animate-fadeIn max-w-[85%] shadow-sm hover:shadow-md hover:scale-[1.02] ${
              isHomeTab 
                ? 'border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60'
                : 'border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'
            } ${
              isChild 
                ? 'px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 md:py-1.5 text-[9px] sm:text-[10px] md:text-xs gap-1'
                : 'px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm gap-1.5 sm:gap-2'
            }`}
          >
            <span className="text-left">{topic.name}</span>
            {hasChildren && (
              <svg 
                className={`transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''} ${
                  isChild ? 'w-2 h-2 sm:w-2.5 sm:h-2.5' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Renderizar filhos se expandido */}
        {hasChildren && isExpanded && (
          <div className={`animate-fadeIn ${isChild ? 'mt-1.5' : 'mt-2'} w-full`}>
            <div className={`flex flex-wrap gap-2 ${
              alignRight ? 'justify-end' : 'justify-start'
            }`}>
              {topic.children.map((child) => (
                <div key={child.id}>
                  <button
                    onClick={() => onSelectTopic(child)}
                    className={`inline-flex border rounded-lg sm:rounded-xl font-normal transition-all duration-300 items-center justify-center shadow-sm hover:shadow-md hover:scale-[1.02] px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 md:py-1.5 text-[9px] sm:text-[10px] md:text-xs gap-1 animate-fadeIn whitespace-nowrap ${
                      isHomeTab 
                        ? 'border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60'
                        : 'border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span>{child.name}</span>
                    {child.hasChildren && child.children.length > 0 && (
                      <svg 
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 transition-transform duration-200 flex-shrink-0 ${child.isExpanded ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderização em grid
  if (asGrid) {
    return (
      <div className="flex flex-wrap gap-1 sm:gap-1.5 w-full">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            className={`inline-flex border rounded-lg sm:rounded-xl font-normal transition-all duration-300 items-center justify-center shadow-sm hover:shadow-md hover:scale-[1.02] px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 md:py-1.5 text-[9px] sm:text-[10px] md:text-xs gap-0.5 sm:gap-1 animate-fadeIn whitespace-nowrap ${
              isHomeTab 
                ? 'border-white/40 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/60'
                : 'border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-center">{topic.name}</span>
            {topic.hasChildren && (
              <svg 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 flex-shrink-0"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Renderização normal
  return (
    <>
      {topics.map((topic, index) => renderTopic(topic, index))}
    </>
  );
}

