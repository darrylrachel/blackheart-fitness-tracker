import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';

export default function CoachPage() {
  const [messages, setMessages] = useState([
    { role: 'coach', text: 'Hey champ! What can I help you with today?' },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: input.trim() }]);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'coach',
          text: "That's a great question! Let me walk you through it...",
        },
      ]);
    }, 600);
  };

  useEffect(() => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 py-4 flex items-center gap-2 text-xl font-bold text-textPrimary border-b border-gray-200">
        <button onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={22} className="text-[#BFA85D]" />
        </button>
        AI Coach
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow ${
              msg.role === 'user'
                ? 'bg-[#BFA85D] text-white self-end ml-auto'
                : 'bg-gray-100 text-textPrimary'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={inputRef}></div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 inset-x-0 bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#BFA85D]"
          />
          <button
            onClick={handleSend}
            className="bg-[#BFA85D] text-white rounded-xl p-3 shadow hover:opacity-90"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
