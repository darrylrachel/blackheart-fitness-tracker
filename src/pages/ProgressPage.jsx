import BottomTabLayout from '../layouts/BottomTabLayout';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../components/AuthProvider';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export default function ProgressPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (user) fetchPhotos();
  }, [user]);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error) {
      setPhotos(data);
    }
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-textPrimary">Progress</h1>
          <button
            onClick={() => navigate('/progress/upload')}
            className="text-sm text-[#BFA85D] underline"
          >
            + Upload
          </button>
          
        </div>

        {photos.length === 0 ? (
          <div className="text-gray-500 text-sm">No progress photos yet.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {photos.map((photo) => (
              <li key={photo.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={photo.url} alt="Progress" className="w-full h-64 object-cover" />
                <div className="p-3">
                  <p className="text-sm font-medium text-textPrimary">
                    {dayjs(photo.date).format('MMM D, YYYY')}
                  </p>
                  {photo.notes && <p className="text-xs text-gray-500 mt-1">{photo.notes}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BottomTabLayout>
  );
}
