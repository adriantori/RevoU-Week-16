// useTokenChecker.js
import { useCallback, useEffect } from 'react';
import { Notification } from '../components'
import { useNavigate } from 'react-router-dom';

const useTokenChecker = (token: string | null) => {
    const navigate = useNavigate();

  const checkToken = useCallback(() => {
    if (!token) {
      Notification('warning', 'Unauthorized', 'Login first m8');
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);
};

export default useTokenChecker;
