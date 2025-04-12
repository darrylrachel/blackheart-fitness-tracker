import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert('Signup failed: ' + error.message);
      setLoading(false);
      return;
    }

    const user = data.user;

    // Attempt to insert default profile
    if (user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          username,
          weight_unit: 'lbs',
          water_unit: 'oz',
          macro_goal: '',
        }
      ]);

      if (profileError) {
        console.warn('Profile insert failed (likely due to RLS on unconfirmed email)', profileError);
      }
    }

    alert('Signup successful! Check your email to confirm.');
    navigate('/login');
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-textPrimary">Create Account</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm text-textPrimary">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 rounded border border-border bg-background text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-textPrimary">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border border-border bg-background text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-textPrimary">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded border border-border bg-background text-sm"
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Create Account'}
        </Button>
      </form>
    </div>
  );
}
