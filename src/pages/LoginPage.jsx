import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { supabase } from '../utils/supabase';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('signIn'); // or signUp
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { email, password } = form;

    const { data, error } = await supabase.auth[action]({ email, password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
      return;
    }

    // Redirect to onboarding after signup, or dashboard after login
    if (action === 'signUp') {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-sm flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/80 rounded-2xl shadow-xl p-6 space-y-6"
      >
        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="h-14 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-center text-textPrimary">
          {action === 'signUp' ? 'Create your account' : 'Welcome back'}
        </h1>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl bg-[#BFA85D] text-white font-semibold shadow-md hover:opacity-90"
        >
          {loading ? (action === 'signUp' ? 'Signing up...' : 'Logging in...') : action === 'signUp' ? 'Sign Up' : 'Log In'}
        </button>

        <p className="text-sm text-center text-gray-500">
          {action === 'signUp' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-[#BFA85D] font-semibold hover:underline"
            onClick={() => setAction(action === 'signUp' ? 'signIn' : 'signUp')}
          >
            {action === 'signUp' ? 'Log In' : 'Sign Up'}
          </button>
        </p>

        {message && (
          <p className={`text-sm text-center ${message.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
