import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function RagChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);

    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [conversationsLoading, setConversationsLoading] = useState(false);

    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const [listening, setListening] = useState(false);

    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    useEffect(() => {
        fetchModels();
        fetchConversations();
        fetchDocuments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const authHeaders = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const fetchModels = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/ai-models`,
                authHeaders()
            );

            setModels(data);

            if (data.length > 0) {
                setSelectedModel(data[0]);
            }
        } catch (err) {
            console.error("Failed to load AI models:", err);
        }
    };

    // -----------------------------
    // Conversations
    // -----------------------------
    const fetchConversations = async () => {
        setConversationsLoading(true);

        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/conversations`,
                authHeaders()
            );

            setConversations(data);

            if (data.length > 0) {
                loadConversation(data[0].id);
            }
        } catch (err) {
            console.error("Failed to load conversations:", err);
        } finally {
            setConversationsLoading(false);
        }
    };

    // NOTE: I don't have the exact shape of GET /conversations/{id}
    // (ConversationDetailResponse) from what you shared. This assumes the
    // response includes a `messages` array with `role`, `content`, and
    // `created_at` on each item. Check this against your Swagger response
    // for GET /conversations/{conversation_id} and adjust the field names
    // below (search for "ADJUST HERE") if they don't match.
    const loadConversation = async (conversationId) => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/conversations/${conversationId}`,
                authHeaders()
            );

            const rawMessages = data.messages || []; // ADJUST HERE if the key differs

            const loadedMessages = rawMessages.map((m, idx) => ({
                id: m.id ?? idx,
                role: m.role, // ADJUST HERE if the key differs
                content: m.content, // ADJUST HERE if the key differs
                timestamp: m.created_at
                    ? new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })
                    : "",
            }));

            setMessages(loadedMessages);
            setActiveConversationId(conversationId);
        } catch (err) {
            console.error("Failed to load conversation:", err);
        }
    };

    // NOTE: assumes ConversationCreate takes a `title` field. Check this
    // against your Swagger request body for POST /conversations.
    const handleNewChat = async () => {
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/conversations`,
                { title: "New Chat" },
                authHeaders()
            );

            setConversations((prev) => [data, ...prev]);
            setActiveConversationId(data.id);
            setMessages([]);
        } catch (err) {
            console.error("Failed to create conversation:", err);
            alert("Couldn't start a new chat. Check the console for details.");
        }
    };

    const handleDeleteConversation = async (conversationId, e) => {
        e.stopPropagation(); // don't trigger loadConversation on the parent div

        if (!window.confirm("Delete this chat? This can't be undone.")) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/conversations/${conversationId}`,
                authHeaders()
            );

            const remaining = conversations.filter((c) => c.id !== conversationId);
            setConversations(remaining);

            if (conversationId === activeConversationId) {
                if (remaining.length > 0) {
                    loadConversation(remaining[0].id);
                } else {
                    setActiveConversationId(null);
                    setMessages([]);
                }
            }
        } catch (err) {
            console.error("Failed to delete conversation:", err);
            alert("Couldn't delete this chat. Check the console for details.");
        }
    };

    // -----------------------------
    // Documents (upload / list / delete)
    // -----------------------------
    const fetchDocuments = async () => {
        try {
            const { data } = await axios.get(
                `${API_BASE_URL}/documents`,
                authHeaders()
            );
            setDocuments(data);
        } catch (err) {
            console.error("Failed to load documents:", err);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            await fetchDocuments();

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: "assistant",
                    content: `📄 **${file.name}** was uploaded and added to your knowledge base. You can ask questions about it now.`,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        } catch (err) {
            console.error("Document upload failed:", err);
            alert("Failed to upload document. Check the console for details.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDeleteDocument = async (documentId) => {
        try {
            await axios.delete(
                `${API_BASE_URL}/documents/${documentId}`,
                authHeaders()
            );
            setDocuments((prev) => prev.filter((d) => d.id !== documentId));
        } catch (err) {
            console.error("Failed to delete document:", err);
        }
    };

    // -----------------------------
    // Voice input (browser-native, no backend needed)
    // -----------------------------
    const handleMicClick = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
            return;
        }

        if (listening) {
            recognitionRef.current?.stop();
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // -----------------------------
    // Chat send (unchanged logic, just uses real conversation id now)
    // -----------------------------
    const handleSend = async (customPrompt = input) => {
        const prompt = customPrompt.trim();

        if (!prompt) return;
        if (!selectedModel) {
            alert("Please select an AI model.");
            return;
        }
        if (!activeConversationId) {
            alert("Start a new chat first.");
            return;
        }

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: prompt,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        setLoading(true);

        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/chat/completions`,
                {
                    conversation_id: activeConversationId,
                    provider: selectedModel.provider,
                    model: selectedModel.model_id,
                    prompt: prompt,
                },
                authHeaders()
            );

            const assistantMessage = {
                id: Date.now() + 1,
                role: "assistant",
                content: data.response,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Chat API Error:", error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Response:", error.response.data);
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: "⚠️ Failed to get a response from the server.",
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerate = () => {
        const lastUserMessage = [...messages]
            .reverse()
            .find((msg) => msg.role === "user");

        if (!lastUserMessage) return;

        handleSend(lastUserMessage.content);
    };

    const handleQuickAction = (prompt) => {
        setInput(prompt);
        textareaRef.current?.focus();
    };

    return (
        <div className="h-[calc(100vh-80px)] bg-slate-100 p-6">
            <div className="flex h-full gap-6">

                {/* Sidebar */}
                <div className="flex w-80 flex-col rounded-2xl bg-white shadow-md">

                    {/* Sidebar Header */}
                    <div className="border-b p-5">
                        <button
                            onClick={handleNewChat}
                            className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700"
                        >
                            + New Chat
                        </button>
                    </div>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto p-3">

                        {conversationsLoading ? (
                            <p className="p-3 text-sm text-slate-400">Loading...</p>
                        ) : conversations.length === 0 ? (
                            <p className="p-3 text-sm text-slate-400">
                                No conversations yet. Start a new chat.
                            </p>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => loadConversation(conv.id)}
                                    className={`group mb-2 flex cursor-pointer items-start justify-between rounded-xl border p-4 transition ${
                                        conv.id === activeConversationId
                                            ? "border-indigo-200 bg-indigo-50"
                                            : "border-slate-100 bg-white hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <h3 className="truncate font-semibold text-slate-800">
                                            {conv.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {new Date(
                                                conv.updated_at || conv.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                                        title="Delete chat"
                                        className="ml-2 shrink-0 rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        )}

                    </div>

                </div>

                {/* Chat Area */}
                <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-md">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4">

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                RAG Chat
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Chat with your uploaded knowledge base.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                Knowledge Base Connected
                            </span>

                            <select
                                value={selectedModel?.id ?? ""}
                                onChange={(e) => {
                                    const model = models.find(
                                        (m) => m.id === Number(e.target.value)
                                    );
                                    setSelectedModel(model);
                                }}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            >
                                {models
                                    .filter((model) => model.provider !== "lmstudio")
                                    .map((model) => (
                                        <option key={model.id} value={model.id}>
                                            {model.name}
                                        </option>
                                    ))}
                            </select>

                            <button
                                onClick={() => setShowSettings(true)}
                                className="rounded-lg border border-slate-300 px-4 py-2 transition hover:bg-slate-100"
                            >
                                Settings
                            </button>

                        </div>

                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6">

                        {messages.length > 0 ? (

                            <div className="space-y-6">

                                {messages.map((message) => (

                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                            }`}
                                    >

                                        <div
                                            className={`max-w-3xl rounded-2xl px-5 py-4 shadow ${message.role === "user"
                                                ? "bg-indigo-600 text-white"
                                                : "border border-slate-200 bg-white text-slate-800"
                                                }`}
                                        >

                                            <div className="mb-2 flex items-center justify-between">

                                                <span className="font-semibold">
                                                    {message.role === "user"
                                                        ? "You"
                                                        : selectedModel?.name ?? "Assistant"}
                                                </span>

                                                {message.role === "assistant" && (
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(message.content)}
                                                        className="rounded px-2 py-1 text-xs hover:bg-slate-100"
                                                    >
                                                        📋 Copy
                                                    </button>
                                                )}

                                            </div>

                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    code({ inline, className, children, ...props }) {
                                                        const match = /language-(\w+)/.exec(className || "");

                                                        return !inline && match ? (
                                                            <SyntaxHighlighter
                                                                style={oneDark}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, "")}
                                                            </SyntaxHighlighter>
                                                        ) : (
                                                            <code className={className} {...props}>
                                                                {children}
                                                            </code>
                                                        );
                                                    },
                                                }}
                                            >
                                                {message.content}
                                            </ReactMarkdown>

                                            <p
                                                className={`mt-3 text-xs ${message.role === "user"
                                                    ? "text-indigo-200"
                                                    : "text-slate-400"
                                                    }`}
                                            >
                                                {message.timestamp}
                                            </p>

                                        </div>

                                    </div>

                                ))}
                                <div ref={messagesEndRef} />

                            </div>

                        ) : (

                            <div className="flex flex-col items-center justify-center px-8">

                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                                    <span className="text-3xl">🧠</span>
                                </div>

                                <h2 className="text-3xl font-bold text-slate-800">
                                    Welcome to NeuroStack RAG Chat
                                </h2>

                                <p className="mt-3 max-w-2xl text-center text-slate-500">
                                    Ask questions about your uploaded documents, search your knowledge base,
                                    and receive AI-powered answers with cited sources.
                                </p>

                                <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">

                                    <button
                                        onClick={() => handleQuickAction("Summarize the documents in my knowledge base.")}
                                        className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
                                    >
                                        <h3 className="font-semibold text-slate-800">
                                            📄 Summarize uploaded documents
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Generate a concise summary of your knowledge base.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => handleQuickAction("Search my knowledge base for: ")}
                                        className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
                                    >
                                        <h3 className="font-semibold text-slate-800">
                                            🔍 Search for specific information
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Ask detailed questions and retrieve relevant document chunks.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => handleQuickAction("Analyze the uploaded reports and highlight the key insights.")}
                                        className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
                                    >
                                        <h3 className="font-semibold text-slate-800">
                                            📊 Analyze uploaded reports
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Compare, extract insights, and answer complex questions.
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => handleQuickAction("")}
                                        className="rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-md"
                                    >
                                        <h3 className="font-semibold text-slate-800">
                                            💡 Ask anything
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Start a conversation using your enterprise knowledge base.
                                        </p>
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>
                    {/* Input */}
                    <div className="border-t bg-white p-4">

                        <div className="rounded-2xl border border-slate-300 bg-slate-50 p-3 focus-within:border-indigo-500">

                            <textarea
                                ref={textareaRef}
                                value={input}
                                disabled={loading}
                                onChange={(e) => {
                                    setInput(e.target.value);

                                    e.target.style.height = "auto";
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                rows={1}
                                placeholder="Ask something about your knowledge base..."
                                className="max-h-40 w-full resize-none bg-transparent outline-none"
                            />

                            <div className="mt-3 flex items-center justify-between">

                                <div className="flex items-center gap-2">

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.txt,.csv,.md"
                                    />

                                    <button
                                        onClick={handleUploadClick}
                                        disabled={uploading}
                                        title="Upload a document"
                                        className="rounded-lg p-2 transition hover:bg-slate-200 disabled:opacity-50"
                                    >
                                        {uploading ? "⏳" : "📎"}
                                    </button>

                                    <button
                                        onClick={handleMicClick}
                                        title="Voice input"
                                        className={`rounded-lg p-2 transition hover:bg-slate-200 ${
                                            listening ? "bg-red-100 text-red-600" : ""
                                        }`}
                                    >
                                        🎤
                                    </button>

                                    <span className="text-xs text-slate-400">
                                        {input.length} / 4000
                                    </span>

                                </div>

                                <button
                                    onClick={() => handleSend()}
                                    disabled={loading}
                                    className={`flex-shrink-0 rounded-xl px-6 py-2 font-medium text-white transition ${loading
                                        ? "cursor-not-allowed bg-slate-400"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                >
                                    {loading ? "Thinking..." : "Send"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Settings panel — document management (only backend data available for "settings") */}
            {showSettings && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
                    onClick={() => setShowSettings(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-xl"
                    >
                        <div className="flex items-center justify-between border-b p-5">
                            <h2 className="text-lg font-bold text-slate-800">
                                Knowledge Base Documents
                            </h2>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5">
                            {documents.length === 0 ? (
                                <p className="text-sm text-slate-500">
                                    No documents uploaded yet. Use the 📎 button in the chat to add one.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-800">
                                                    {doc.filename}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {doc.file_type} · {Math.round(doc.file_size / 1024)} KB
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDocument(doc.id)}
                                                className="rounded-lg px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}
