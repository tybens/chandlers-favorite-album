import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function useAxios(...rest) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [fetchCounter, setFetchCounter] = useState(1);

  async function doWork() {
    setLoading(true);
    try {
      const resp = await Axios(...rest);
      setData(resp.data);
    } catch (e) {
      setData(undefined);
      setError(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (rest[0] !== null) {
      doWork();
    } else {
      setData(undefined);
      setError(undefined);
      setLoading(false);
    }
  }, [JSON.stringify(rest), fetchCounter]);

  return {
    loading,
    data,
    error,
    reload: () => setFetchCounter(fetchCounter + 1)
  };
}
