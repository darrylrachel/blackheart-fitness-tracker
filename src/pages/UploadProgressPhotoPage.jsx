import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import BottomTabLayout from '../layouts/BottomTabLayout';
import { useAuth } from '../components/AuthProvider';

export default function UploadProgressPhotoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: storageError } = await supabase.storage
      .from('progress_photos')
      .upload(fileName, file);

    if (storageError) {
      alert('Upload error: ' + storageError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('progress_photos').getPublicUrl(fileName);
    const publicUrl = data?.publicUrl;

    const { error: dbError } = await supabase.from('progress_photos').insert({
      user_id: user.id,
      url: publicUrl,
      date: new Date().toISOString().split('T')[0],
      notes,
    });

    if (dbError) {
      alert('Database error: ' + dbError.message);
    } else {
      navigate('/progress');
    }

    setUploading(false);
  };

  return (
    <BottomTabLayout>
      <div className="min-h-[calc(100vh-88px)] pb-10 px-4">
        <h1 className="text-xl font-bold text-textPrimary mb-4">Upload Progress Photo</h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <textarea
          placeholder="Optional notes (e.g., Week 4 check-in)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 mb-4"
        ></textarea>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full py-2 rounded-xl bg-[#BFA85D] text-white font-semibold shadow hover:opacity-90"
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </div>
    </BottomTabLayout>
  );
}
