import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { checkAiUsageLimit } from '../utils/checkAiUsage';
import { sendMessageToAI } from '../utils/sendMessageToAI';

export default function CoachPage() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([
    { role: 'coach', text: 'Hey champ! What can I help you with today?' },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setError(null);

    const usage = await checkAiUsageLimit(user.id, profile?.is_pro);
    if (!usage.allowed) {
      setError('🧠 You’ve hit your free limit for the month. Upgrade to Pro for unlimited chats.');
      return;
    }

    const question = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setInput('');
    setIsStreaming(true);

    let coachMsg = { role: 'coach', text: '' };
    setMessages((prev) => [...prev, coachMsg]);

    try {
      await sendMessageToAI({
        user_id: user.id,
        prompt: question,
        onMessage: (token) => {
          coachMsg.text += token;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = coachMsg;
            return [...updated];
          });
        },
      });
    } catch (err) {
      console.error('Smart Coach error:', err);
      setError('⚠️ There was a problem with Smart Coach.');
    }

    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-4 py-4 flex items-center gap-2 text-xl font-bold text-textPrimary border-b border-gray-200">
        <button onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={22} className="text-[#BFA85D]" />
        </button>
        AI Coach
      </header>

      {/* Info Notice */}
      <div className="px-4 pt-2 pb-1 text-xs text-gray-500 text-center">
        Each chat costs ~$0.001 — your support helps keep this free. <br />
        Free tier includes 10 AI chats per month.
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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

      {error && (
        <div className="text-center text-red-500 text-sm px-4 pb-2">{error}</div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 inset-x-0 bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#BFA85D]"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            className="bg-[#BFA85D] text-white rounded-xl p-3 shadow hover:opacity-90"
            disabled={isStreaming}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
