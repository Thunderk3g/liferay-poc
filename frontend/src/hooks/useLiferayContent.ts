import { useState, useEffect } from 'react';
import { liferayAPI } from '@/services/api';
import type { LiferayAPIResponse, LiferayStructuredContent } from '@/types/liferay';
import { AxiosError } from 'axios';

interface UseLiferayContentReturn {
  data: LiferayAPIResponse<LiferayStructuredContent> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLiferayContent(siteId?: string): UseLiferayContentReturn {
  const [data, setData] = useState<LiferayAPIResponse<LiferayStructuredContent> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await liferayAPI.getStructuredContent(siteId);

        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          const axiosError = err as AxiosError;
          setError(
            axiosError.message || 'An error occurred while fetching content from Liferay'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [siteId, trigger]);

  const refetch = () => {
    setTrigger((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}
