import { useState } from 'react';
import { supabase } from '../utils/supabase';
import Button from '../components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert('Login successful!');
      // TODO: redirect to dashboard
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-darkBlue text-lightGray px-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className='flex flex-col gap-4 w-full max-w-sm'>
        <input
          type='email'
          placeholder='Email'
          className='p-2 rounded bg-slate text-white placeholder:text-lightGray'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          className='p-2 rounded bg-slate text-white placeholder:text-lightGray'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
        {error && <p className='text-red mt-2'>{error}</p>}
      </form>
    </div>
  );
}
