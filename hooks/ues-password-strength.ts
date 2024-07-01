import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';

const usePasswordStrength = (password: string) => {
  const [passwordScore, setPasswordScore] = useState(0);

  useEffect(() => {
    setPasswordScore(zxcvbn(password).score);
  }, [password]);

  return passwordScore;
};

export default usePasswordStrength;
