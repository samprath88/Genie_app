import { useEffect, useState } from 'react';

interface ThemeImage {
  file: string;
  label: string;
  usedIn: string[];
  priority: number;
  url: string;
}

interface GameImages {
  game: string;
  theme: Record<string, ThemeImage>;
  components: Record<string, any>;
}

export function useGameImages(game: string) {
  const [images, setImages] = useState<GameImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://192.168.1.101:8000/games/${game}/images`);

        if (!response.ok) {
          throw new Error(`Failed to load images: ${response.status}`);
        }

        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load images');
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    if (game) {
      fetchImages();
    }
  }, [game]);

  return { images, loading, error };
}