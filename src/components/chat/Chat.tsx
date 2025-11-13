"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import FooterMenu from "./FooterMenu";
import FormattedMessage from "./FormattedMessage";
import TopicList, { Topic } from "./TopicList";
import { formatMessagePreview } from "../../utils/formatMessage";
import AllyImage from "@/assets/ally.png";
import AliancaImage from "@/assets/alianca.png";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  messages?: Message[];
}

export default function Chat() {
  const getTimestamp = () => {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const [messages, setMessages] = useState<Message[]>([
    { text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false, timestamp: getTimestamp() }
  ]);
  const [showImage, setShowImage] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'messages' | 'home'>('home');
  const [showAllConversations, setShowAllConversations] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [displayedTopics, setDisplayedTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const initializeTopicsCollapsed = (items: Topic[]): Topic[] => {
    return items.map(item => ({
      ...item,
      isExpanded: false,
      children: item.children.length > 0 ? initializeTopicsCollapsed(item.children) : []
    }));
  };

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        console.log('🏷️ Buscando tópicos da API...');
        const response = await fetch('/api/tags');
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Erro na API tags:', errorData);
          throw new Error(errorData.error || `Erro ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Tópicos recebidos:', data);
        
        // Verificar se retornou erro
        if (data.error) {
          console.error('❌ API retornou erro:', data.error);
          throw new Error(data.error);
        }
        
        // Verificar se é array
        if (!Array.isArray(data)) {
          console.error('❌ Resposta não é um array:', data);
          throw new Error('Formato de resposta inválido');
        }
        
        const collapsedTopics = initializeTopicsCollapsed(data);
        setTopics(collapsedTopics);
        setDisplayedTopics(collapsedTopics);
        console.log('✅ Tópicos carregados com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao buscar tópicos:', error);
        setMessages(prev => [...prev, { 
          text: `Erro ao carregar tópicos: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Por favor, tente novamente mais tarde ou entre em contato pelo telefone (+238) 260 89 00.`, 
          isUser: false,
          timestamp: getTimestamp()
        }]);
      } finally {
        setLoadingTopics(false);
      }
    };

    if (activeMenu === 'home' && topics.length === 0) {
      fetchTopics();
    }
  }, [activeMenu, topics.length]);
  
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ally_conversations');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((conv: Conversation) => ({
          ...conv,
          title: formatMessagePreview(conv.title, 30),
          lastMessage: formatMessagePreview(conv.lastMessage, 80),
        }));
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ally_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    const reloadConversations = () => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('ally_conversations');
        if (saved) {
          const loadedConversations = JSON.parse(saved);
          setConversations(loadedConversations);
        }
      }
    };

    const interval = setInterval(reloadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentConversationId && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      const userMessages = messages.filter(m => m.isUser);
      const conversationTitle = userMessages.length > 0 ? userMessages[0].text : 'Nova Conversa';
      
      setConversations(prev => {
        const existing = prev.find(c => c.id === currentConversationId);
        const updatedConversation = {
          id: currentConversationId,
          title: formatMessagePreview(conversationTitle, 30),
          lastMessage: formatMessagePreview(lastMessage.text, 80),
          timestamp: 'Agora',
          messages: messages
        };
        
        let updated;
        if (existing) {
          updated = prev.map(c => 
            c.id === currentConversationId ? updatedConversation : c
          );
        } else {
          updated = [updatedConversation, ...prev];
        }
        
        return updated.slice(0, 10);
      });
    }
  }, [messages, currentConversationId]);

  const collapseAllTopics = () => {
    setTopics(prev => {
      const collapsed = initializeTopicsCollapsed(prev);
      setDisplayedTopics(collapsed);
      return collapsed;
    });
  };

  const handleNewConversation = () => {
    setActiveMenu('messages');
    const newId = `conv_${Date.now()}`;
    setCurrentConversationId(newId);
    setMessages([{ text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false, timestamp: getTimestamp() }]);
    setShowTopics(true);
    setSelectedTopic(null);
    setDisplayedTopics(topics);
    collapseAllTopics();
  };

  const handleOpenConversation = (conversation: Conversation) => {
    setActiveMenu('messages');
    setCurrentConversationId(conversation.id);
    if (conversation.messages) {
      setMessages(conversation.messages);
    } else {
      setMessages([{ text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false, timestamp: getTimestamp() }]);
    }
    setShowTopics(true);
    setSelectedTopic(null);
    setDisplayedTopics(topics);
    collapseAllTopics();
  };

  const handleDeleteConversation = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([{ text: "Olá! 👋 Como podemos ajudar hoje?", isUser: false, timestamp: getTimestamp() }]);
      setActiveMenu('home');
    }
  };

  const toggleTopic = (topicId: string) => {
    const updateTopics = (items: Topic[]): Topic[] => {
      return items.map(item => {
        if (item.id === topicId) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.hasChildren && item.children.length > 0) {
          return {
            ...item,
            children: updateTopics(item.children)
          };
        }
        return item;
      });
    };

    setTopics(prev => updateTopics(prev));
    setDisplayedTopics(prev => updateTopics(prev));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const askQuestion = async (question: string, topicId?: string, parentTopic: Topic | null = null) => {
    if (!currentConversationId) {
      const newId = `conv_${Date.now()}`;
      setCurrentConversationId(newId);
    }
    
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setShowTopics(false);
    setLoadingAnswer(true);
    
    setTimeout(() => setIsTyping(true), 300);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      console.log('📡 Status da resposta Ask:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erro na API Ask:', errorData);
        throw new Error(errorData.error || `Erro ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Resposta recebida:', data);
      
      // Verificar se a resposta tem erro
      if (data.error) {
        console.error('❌ API retornou erro:', data.error);
        throw new Error(data.error);
      }
      
      // Verificar se tem a propriedade answer
      if (!data.answer) {
        console.error('❌ Resposta sem campo "answer":', data);
        throw new Error('Resposta inválida da API');
      }
      
      const typingTime = Math.min(Math.max((data.answer?.length || 100) * 10, 1000), 3000);
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          text: data.answer || 'Desculpe, não consegui processar sua pergunta.', 
          isUser: false,
          timestamp: getTimestamp()
        }]);
        setLoadingAnswer(false);
        
        setTimeout(() => {
          if (parentTopic) {
            const updatedParent = findTopicById(parentTopic.id, topics);
            
            if (updatedParent && updatedParent.children.length > 0) {
              console.log('✅ Mostrando subtópicos de:', updatedParent.name, '→', updatedParent.children.map(c => c.name));
              setDisplayedTopics(updatedParent.children);
              setSelectedTopic(updatedParent);
            } else {
              console.log('⚠️ Pai sem filhos, mostrando todos');
              setDisplayedTopics(topics);
              setSelectedTopic(null);
            }
          } else {
            console.log('📋 Sem pai, mostrando todos');
            setDisplayedTopics(topics);
            setSelectedTopic(null);
          }
          setShowTopics(true);
        }, 500);
      }, typingTime);

    } catch (error) {
      console.error('Erro ao fazer pergunta:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.', 
        isUser: false,
        timestamp: getTimestamp()
      }]);
      setLoadingAnswer(false);
      
      if (parentTopic) {
        const updatedParent = findTopicById(parentTopic.id, topics);
        if (updatedParent && updatedParent.children.length > 0) {
          setDisplayedTopics(updatedParent.children);
          setSelectedTopic(updatedParent);
        } else {
          setDisplayedTopics(topics);
          setSelectedTopic(null);
        }
      } else {
        setDisplayedTopics(topics);
        setSelectedTopic(null);
      }
      
      setShowTopics(true);
    }
  };

  const findParentTopic = (topicId: string, allTopics: Topic[]): Topic | null => {
    for (const topic of allTopics) {
      if (topic.children.some(child => child.id === topicId)) {
        return topic;
      }
      if (topic.hasChildren && topic.children.length > 0) {
        const found = findParentTopic(topicId, topic.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findTopicById = (topicId: string, allTopics: Topic[]): Topic | null => {
    for (const topic of allTopics) {
      if (topic.id === topicId) return topic;
      if (topic.hasChildren && topic.children.length > 0) {
        const found = findTopicById(topicId, topic.children);
        if (found) return found;
      }
    }
    return null;
  };

  const handleTopicSelect = (topic: Topic) => {
    if (topic.hasChildren) {
      toggleTopic(topic.id);
    } else {
      const parent = findParentTopic(topic.id, topics);
      
      console.log('🎯 Clicou em:', topic.name);
      console.log('👨‍👦 Pai encontrado:', parent ? `${parent.name} (${parent.children.length} filhos)` : 'Nenhum');
      
      setActiveMenu('messages');
      askQuestion(topic.name, topic.id, parent);
    }
  };

  const handleBackToMenu = () => {
    setDisplayedTopics(topics);
    setSelectedTopic(null);
    collapseAllTopics();
    setActiveMenu('home');
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    const message = inputMessage.trim();
    setInputMessage('');
    askQuestion(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowImage(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full">
      <div className={`w-full h-full flex flex-col overflow-hidden ${
        activeMenu === 'home' ? 'bg-gradient-to-br from-[#002256] via-[#B7021C] to-[#002256]' : 'bg-white dark:bg-gray-800'
      }`}>
        {/* Chat Header - Fixo */}
        {activeMenu === 'messages' ? (
          <div className="bg-gradient-to-r from-[#002256] to-[#B7021C] p-2 sm:p-3 md:p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 md:gap-3">
              <div className="relative flex items-center gap-1.5 sm:gap-2 md:gap-3 min-h-[40px] sm:min-h-[48px]">
                <div className={`transition-all duration-700 ease-in-out ${showImage ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'}`}>
                  <div className="flex items-center -space-x-1 sm:-space-x-1.5">
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 z-30">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-white shadow-lg">
                        <Image
                          src={AllyImage}
                          alt="Ally"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 z-20">
                      <div className="w-full h-full rounded-full bg-blue-500 border border-white sm:border-2 shadow-lg flex items-center justify-center">
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white">K</span>
                      </div>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 z-10">
                      <div className="w-full h-full rounded-full bg-blue-600 border border-white sm:border-2 shadow-lg flex items-center justify-center">
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-white">E</span>
                      </div>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <div className="relative w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0 z-10">
                      <div className="w-full h-full rounded-full bg-blue-600 border border-white sm:border-2 shadow-lg flex items-center justify-center">
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white">+5</span>
                      </div>
                      <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full border border-white"></div>
                    </div>
                  </div>
                </div>
                
                <div className={`transition-all duration-700 ease-in-out flex items-center gap-1 sm:gap-1.5 ${!showImage ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'}`}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center">
                    <Image
                      src={AliancaImage}
                      alt="Aliança Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="text-sm sm:text-base md:text-lg font-bold whitespace-nowrap">Ally</h2>
                </div>
              </div>
              
              <div className="flex-1 text-right min-w-0">
                <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold leading-tight truncate">
                  {showImage ? '8 online' : 'Disponível'}
                </p>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] opacity-75 hidden sm:block leading-tight truncate">
                  {showImage ? 'Tempo real' : 'Sempre aqui'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between p-2 sm:p-3 md:p-4">
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <Image
                    src={AliancaImage}
                    alt="Aliança Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-white font-bold text-base sm:text-lg md:text-xl">ALLY</span>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center -space-x-1 sm:-space-x-1.5">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full overflow-hidden border border-white sm:border-2 bg-white">
                    <Image
                      src={AllyImage}
                      alt="Assistente 1"
                      width={28}
                      height={28}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-blue-500 border border-white sm:border-2 shadow-lg flex items-center justify-center">
                    <span className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold">K</span>
                  </div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-blue-600 border border-white sm:border-2 shadow-lg flex items-center justify-center">
                    <span className="text-white text-[8px] sm:text-[9px] md:text-[10px] font-bold">E</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Content Area - Com scroll */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${activeMenu === 'messages' ? 'bg-white dark:bg-gray-800' : ''}`}>
          {activeMenu === 'home' ? (
            <div className="flex flex-col h-full">
              <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 pt-4 sm:pt-6">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2">
                  Olá 👋
                </h1>
                <p className="text-white text-sm sm:text-base md:text-lg font-medium mb-3 sm:mb-4">
                  Como podemos ajudar?
                </p>
              </div>
              
              {conversations.length > 0 && (
                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 flex-1">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white/90">
                        Conversas Recentes
                      </h3>
                    </div>
                    
                    {showAllConversations && conversations.length > 1 && (
                      <button
                        onClick={() => setShowAllConversations(false)}
                        className="text-white/80 hover:text-white text-[9px] sm:text-[10px] md:text-xs font-medium flex items-center gap-0.5 sm:gap-1 transition-all duration-300"
                      >
                        <span className="hidden sm:inline">Ver menos</span>
                        <span className="sm:hidden">Menos</span>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    {conversations.slice(0, showAllConversations ? conversations.length : 1).map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => handleOpenConversation(conversation)}
                        className="relative bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-lg sm:rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                              <h4 className="font-semibold text-white text-[10px] sm:text-xs md:text-sm truncate">
                                {conversation.title}
                              </h4>
                              {conversation.unread && (
                                <span className="bg-white text-blue-900 text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-white/70 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 sm:gap-1">
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-white/60 whitespace-nowrap flex-shrink-0">
                              {conversation.timestamp}
                            </span>
                            <button
                              onClick={(e) => handleDeleteConversation(conversation.id, e)}
                              className="p-0.5 sm:p-1 rounded-lg bg-white/10 hover:bg-red-500 active:bg-red-600 text-white/60 hover:text-white active:text-white transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                              title="Remover conversa"
                            >
                              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {!showAllConversations && conversations.length > 1 && (
                    <div className="flex justify-end mt-2 sm:mt-3">
                      <button
                        onClick={() => setShowAllConversations(true)}
                        className="text-white/80 hover:text-white py-1.5 sm:py-2 px-2 sm:px-3 text-[9px] sm:text-[10px] md:text-xs font-medium flex items-center gap-0.5 sm:gap-1 transition-all duration-300 hover:bg-white/10 rounded-lg"
                      >
                        <span className="hidden sm:inline">Ver mais ({conversations.length - 1})</span>
                        <span className="sm:hidden">+{conversations.length - 1}</span>
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {showTopics && !loadingAnswer && (
                <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 mt-auto">
                  {loadingTopics ? (
                    <div className="flex items-center justify-center py-6 sm:py-8">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-end space-y-1.5 sm:space-y-2 animate-fadeIn">
                      <TopicList 
                        topics={displayedTopics} 
                        onSelectTopic={handleTopicSelect}
                        alignRight={true}
                        asGrid={false}
                        isHomeTab={true}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                <button
                  onClick={handleNewConversation}
                  className="w-full bg-white text-gray-700 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-medium text-[10px] sm:text-xs md:text-sm flex items-center justify-between hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="truncate">Envie-nos uma mensagem</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} animate-messageSlideIn`}>
                    <div
                      className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 text-[10px] sm:text-xs md:text-sm shadow-md ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#002256] to-[#B7021C] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <FormattedMessage text={message.text} isUser={message.isUser} />
                    </div>
                    
                    {!message.isUser && (
                      <div className="flex items-center gap-1 mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 px-1 sm:px-2">
                        <span className="font-medium">Ally</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">AI</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">{message.timestamp || 'Agora'}</span>
                      </div>
                    )}
                  </div>
                  
                  {(() => {
                    const isLastBotMessage = !message.isUser && index === messages.length - 1;
                    const hasTopicsToShow = showTopics && !loadingAnswer && displayedTopics.length > 0;
                    const isNotInitialMessage = messages.length > 1;
                    
                    return isLastBotMessage && hasTopicsToShow && isNotInitialMessage;
                  })() && (
                    <div className="w-full mt-3 mb-6 space-y-3 animate-fadeIn">
                      <TopicList 
                        topics={displayedTopics} 
                        onSelectTopic={handleTopicSelect}
                        alignRight={false}
                        asGrid={selectedTopic !== null}
                      />
                      
                      {selectedTopic && (
                        <div className="flex justify-start mt-2">
                          <button
                            onClick={handleBackToMenu}
                            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Voltar ao menu</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
              
              {showTopics && !loadingAnswer && messages.length <= 1 && (
                <div className={`w-full flex flex-col items-end space-y-1.5 sm:space-y-2 animate-fadeIn mb-4 sm:mb-6 ${
                  messages.length <= 1 ? 'mt-auto' : 'mt-2 sm:mt-3'
                }`}>
                  {loadingTopics ? (
                    <div className="flex items-center justify-center py-6 sm:py-8 mb-4 sm:mb-6 w-full">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <TopicList 
                      topics={displayedTopics} 
                      onSelectTopic={handleTopicSelect}
                      alignRight={true}
                      asGrid={false}
                    />
                  )}
                </div>
              )}
              
              {isTyping && (
                <div className="flex justify-start animate-slideIn mb-4 sm:mb-6">
                  <div className="max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {activeMenu === 'messages' && (
          <div className="flex-shrink-0 px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={loadingAnswer}
                className="flex-1 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-[10px] sm:text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              />
              <button
                onClick={handleSendMessage}
                disabled={loadingAnswer || inputMessage.trim() === ''}
                className="p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#002256] to-[#B7021C] text-white hover:from-[#001a40] hover:to-[#950119] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
                title="Enviar mensagem"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="flex-shrink-0">
          <FooterMenu 
            activeMenu={activeMenu} 
            onMenuChange={(menu) => {
              setActiveMenu(menu);
              if (menu === 'home') {
                setShowAllConversations(false);
                setDisplayedTopics(topics);
                setSelectedTopic(null);
                collapseAllTopics();
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}

