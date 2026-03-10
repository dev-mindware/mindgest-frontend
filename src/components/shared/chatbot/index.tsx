"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { Button, Icon } from "@/components";
import { useAuthStore } from "@/stores";
import { useSendChatMessage } from "@/hooks";
import { ChatHistoryItem } from "@/types";

import { ChatTab } from "./chat-tab";
import { HistoryTab } from "./history-tab";

// Constants & Data
const EXPIRATION_DAYS = 7;

// Types
export type LocalChatHistoryItem = ChatHistoryItem & { isTyping?: boolean };

export interface LocalChatSession {
    id: string;
    updatedAt: string;
    messages: LocalChatHistoryItem[];
}

// ----- INDEXED DB WRAPPER ----- //
const DB_NAME = "MindGestChatDB";
const STORE_NAME = "chat_sessions";
const DB_VERSION = 1;

const ChatDB = {
    async getDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };
        });
    },
    async getUserSessions(userId: string): Promise<LocalChatSession[]> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readonly");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(userId);
                request.onsuccess = () => resolve(request.result?.sessions || []);
                request.onerror = () => reject(request.error);
            });
        } catch {
            return [];
        }
    },
    async saveUserSessions(userId: string, sessions: LocalChatSession[]): Promise<void> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readwrite");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ id: userId, sessions });
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error("IDB Save Error", error);
        }
    }
};

export function ChatbotSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("chat");
    const [input, setInput] = useState("");

    // State for current chat
    const activeSessionIdRef = useRef<string>("");
    const [messages, setMessages] = useState<LocalChatHistoryItem[]>([]);

    // State for all history
    const [sessions, setSessions] = useState<LocalChatSession[]>([]);

    const user = useAuthStore((state) => state.user);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const sessionId = user ? `${user.company.name.replace(/\s+/g, '_').toLowerCase()}_${user.id}_${new Date().toISOString().split("T")[0]}` : "";
    const { mutate: sendMessage, isPending } = useSendChatMessage();

    // Load from IndexedDB on mount
    useEffect(() => {
        if (!user) return;

        const loadHistory = async () => {
            try {
                let parsedSessions = await ChatDB.getUserSessions(user.id);

                // Migration Strategy: Load legacy localStorage if IDB is empty
                if (parsedSessions.length === 0) {
                    const legacyStorage = localStorage.getItem(`mindgest-chat-history_${user.id}`);
                    if (legacyStorage) {
                        try {
                            const parsedData = JSON.parse(legacyStorage);
                            if (Array.isArray(parsedData)) {
                                if (parsedData.length > 0 && !('messages' in parsedData[0])) {
                                    parsedSessions = [{
                                        id: new Date().toISOString(),
                                        updatedAt: new Date().toISOString(),
                                        messages: parsedData
                                    }];
                                } else {
                                    parsedSessions = parsedData;
                                }
                            } else if (parsedData && parsedData.history && Array.isArray(parsedData.history)) {
                                parsedSessions = [{
                                    id: parsedData.timestamp || new Date().toISOString(),
                                    updatedAt: parsedData.timestamp || new Date().toISOString(),
                                    messages: parsedData.history
                                }];
                            }
                            // Clean up legacy localStorage after migrating
                            localStorage.removeItem(`mindgest-chat-history_${user.id}`);
                        } catch (e) {
                            console.error("Migration error", e);
                        }
                    }
                }

                const currentDate = new Date().getTime();

                // Filter out sessions older than 7 days safely
                const validSessions = parsedSessions.filter(session => {
                    const sessionTime = new Date(session.updatedAt || new Date()).getTime();
                    const diffDays = Math.ceil(Math.abs(currentDate - sessionTime) / (1000 * 60 * 60 * 24));
                    return diffDays <= EXPIRATION_DAYS;
                });

                // Sort by newest first
                validSessions.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());

                setSessions(validSessions);

                if (validSessions.length > 0) {
                    await ChatDB.saveUserSessions(user.id, validSessions);
                }
            } catch (error) {
                console.error("Failed to load generic chat history from IDB", error);
            }
        };

        loadHistory();
    }, [user]);

    // Save to IndexedDB on Message Change
    useEffect(() => {
        if (messages.length === 0 || !user) return;

        let currentSessionId = activeSessionIdRef.current;
        if (!currentSessionId) {
            currentSessionId = new Date().toISOString();
            activeSessionIdRef.current = currentSessionId;
        }

        setSessions(prevSessions => {
            const existingSessionIndex = prevSessions.findIndex(s => s.id === currentSessionId);
            let newSessions = [...prevSessions];

            const cleanupMessagesForStorage = messages.map(msg => ({ ...msg, isTyping: false }));

            if (existingSessionIndex !== -1) {
                newSessions[existingSessionIndex] = {
                    ...newSessions[existingSessionIndex],
                    updatedAt: new Date().toISOString(),
                    messages: cleanupMessagesForStorage
                };
            } else {
                newSessions.unshift({
                    id: currentSessionId,
                    updatedAt: new Date().toISOString(),
                    messages: cleanupMessagesForStorage
                });
            }

            ChatDB.saveUserSessions(user.id, newSessions);
            return newSessions;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages, user]);

    useEffect(() => {
        if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen, activeTab]);

    const handleSend = () => {
        if (!input.trim() || !user || isPending) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg, created_at: new Date().toISOString() }]);

        sendMessage(
            { message: userMsg, empresa: user.company.name, userName: user.name, sessionId },
            {
                onSuccess: (data) => {
                    if (data.success && data.reply) {
                        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, created_at: new Date().toISOString(), isTyping: true }]);
                    }
                },
                onError: () => {
                    setMessages((prev) => [...prev, { role: "assistant", content: "Desculpe, ocorreu um erro ao processar sua mensagem.", created_at: new Date().toISOString(), isTyping: true }]);
                }
            }
        );
    };

    const handleTypingComplete = (msgIdx: number) => {
        setMessages(prev => {
            const updated = [...prev];
            if (updated[msgIdx]) {
                updated[msgIdx] = { ...updated[msgIdx], isTyping: false };
            }
            return updated;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        activeSessionIdRef.current = "";
        setActiveTab("chat");
    };

    const openSession = (session: LocalChatSession) => {
        setMessages(session.messages.map(m => ({ ...m, isTyping: false })));
        activeSessionIdRef.current = session.id;
        setActiveTab("chat");
    };

    const totalMessagesUsed = useMemo(() => {
        return sessions.reduce((acc, session) => acc + session.messages.filter(m => m.role === "user").length, 0);
    }, [sessions]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    className="
                        relative flex items-center justify-center gap-3
                        bg-white/10 dark:bg-white/5
                        backdrop-blur-xl
                        rounded-full text-sm font-medium 
                        text-foreground/90 
                        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]
                        transition-all duration-500 ease-in-out
                        hover:bg-white/20 dark:hover:bg-white/10
                        hover:shadow-[0_8px_32px_0_rgba(var(--primary-rgb),0.15)]
                        hover:-translate-y-0.5
                        active:scale-[0.98]
                        group
                        overflow-hidden
                    "
                >
                    {/* Glass highlight effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Subtle inner glow */}
                    <div className="absolute inset-[1px] rounded-full border border-white/5 pointer-events-none" />

                    <Icon name="Sparkles" className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform duration-500" />
                    <span className="relative z-10 tracking-tight">Fale com MIND</span>

                    {/* Bloom effect on hover */}
                    <div className="absolute -inset-4 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="right"
                onInteractOutside={(e) => e.preventDefault()}
                className="w-full sm:max-w-[420px] flex flex-col p-0 border-l gap-0 shadow-2xl bg-background"
            >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full w-full">
                    <SheetHeader className="py-4 px-12 pb-2 shrink-0">
                        <SheetTitle className="sr-only">Assistente MIND</SheetTitle>
                        <div className="flex items-start justify-between mb-4">
                            <TabsList className="bg-muted/60 p-1">
                                <TabsTrigger value="chat" className="px-4 text-xs">Chat</TabsTrigger>
                                <TabsTrigger value="history" className="px-4 text-xs">Histórico</TabsTrigger>
                            </TabsList>

                            <div className="flex items-center gap-2">
                                <Button onClick={handleNewChat} variant="outline" title="Novo Chat" size="icon">
                                    <Icon name="SquarePen" className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {activeTab === "chat" && messages.length === 0 && (
                            <div className="text-center mt-2">
                                <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                                    Olá {user?.name} 👋
                                </h2>
                                <p className="text-foreground/80 text-sm mt-1">Como posso ajudar você hoje?</p>
                            </div>
                        )}
                    </SheetHeader>

                    {/* Extracted Chat Tab Component */}
                    <ChatTab
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        isPending={isPending}
                        handleSend={handleSend}
                        handleKeyDown={handleKeyDown}
                        handleTypingComplete={handleTypingComplete}
                        messagesEndRef={messagesEndRef}
                        totalMessagesUsed={totalMessagesUsed}
                    />

                    {/* Extracted History Tab Component */}
                    <HistoryTab
                        sessions={sessions}
                        openSession={openSession}
                    />

                </Tabs>
            </SheetContent>
        </Sheet>
    );
}
