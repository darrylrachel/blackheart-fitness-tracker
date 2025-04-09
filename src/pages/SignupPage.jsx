import Button from '../components/Button';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-darkBlue text-lightGray px-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form className='flex flex-col gap-4 w-full max-w-sm'>
        <input
          type='email'
          placeholder='Email'
          className='p-2 rounded bg-slate text-white placeholder:text-lightGray'
        />
        <input
          type='password'
          placeholder='Password'
          className='p-2 rounded bg-slate text-white placeholder:text-lightGray'
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
