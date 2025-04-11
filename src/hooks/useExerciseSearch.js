import { useState, useEffect } from 'react';

export default function useExcersiceSearch(query = '') {
  const [exercises, setExcercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!query) return;

    const fetchExercises = async () => {
      setLoading(true);

      try {
        const res = await fetch(`https://exercisedb.p.rapidapi.com/exercises/name/${query}`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
          },
        });

        const data = await res.json();
        setExcercises(data.slice(0, 10)); // limit results
      } catch (err) {
        console.error('Failed to fetch exercisis:', err);
      }

      setLoading(false);
    };

    fetchExercises();
  }, [query]);

  return { exercises, loading };
}