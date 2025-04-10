const base = 'px-4 py-2 rounded font-semibold transition-colors duration-200';

const variants = {
  primary: 'bg-primary text-white hover:opacity-90',
  secondary: 'bg-gray text-white hover:opacity-90',
  danger: 'bg-primary text-white hover:opacity-90',
};

export default function Button({ children, variant = 'primary', ...props}) {
  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
