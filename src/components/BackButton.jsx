
import { useNavigate, useMatches } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ fallback = '/dashboard' }) {
  const navigate = useNavigate();
  const matches = useMatches();

  // Try to get the nearest route with a meta.title
  const routeWithTitle = matches.find((match) => match.handle?.title);
  const title = routeWithTitle?.handle?.title || 'Back';

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline hover:text-primary/80 transition p-2"
    >
      <ArrowLeft size={16} /> Back to {title}
    </button>
  );
}
