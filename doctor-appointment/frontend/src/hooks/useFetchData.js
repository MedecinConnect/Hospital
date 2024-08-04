import { useContext, useEffect, useState } from "react";
//import { token } from "../config";
import { AuthContext } from "../context/AuthContext";
const useFetchData = url => {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message + " ");
        }

        setData(result.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  return {
    data,
    loading,
    error,
  };
};

export default useFetchData;