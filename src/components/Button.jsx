const base = 'px-4 py-2 rounded font-semibold transition-colors duration-200';

const variants = {
  primary: 'bg-accent text-white hover:opacity-90',
  secondary: 'bg-surface text-accent border border-accent hover:opacity-90',
  danger: 'bg-error text-white hover:opacity-90',
};

export default function Button({ children, variant = 'primary', ...props}) {
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
