const base = 'px-4 py-2 rounded font-semibold transition-colors duration-200';

const variants = {
  primary: 'bg-green text-white hover:bg-green/90',
  secondary: 'bg-slate text-white hover:bg-slate/90',
  danger: 'bg-red text-white hover:bg-red/90',
};

export default function Button({ children, variant = 'primary', ...props}) {
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

// import Button from '../components/Button';

// <Button>Start Workout</Button>
// <Button variant="secondary">Save</Button>
// <Button variant="danger">Delete</Button>
