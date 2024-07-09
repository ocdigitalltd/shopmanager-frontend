import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import Spinner from '../spinner';
import { loginSubmit } from 'src/@db-api/auth/jwt';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const publicRoutes = ["/", "/login", "/login/", "/home", "/home1", "/home2"]

  const checkAuthentication = async () => {
    const userDataJSON = sessionStorage.getItem('user');
    if (userDataJSON) {
      const userData = JSON.parse(userDataJSON);
      if (userData.expirationTime && Date.now() < userData.expirationTime && userData.password && userData.email && userData.role) {
        setIsLoggedIn(true);
      }
      else if (userData.expirationTime && Date.now() > userData.expirationTime) {
        const login = await loginSubmit(userData.email, userData.password)
        setIsLoggedIn(login);
      } else {
        sessionStorage.removeItem('user');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    if (publicRoutes.includes(router.route)) setIsLoggedIn(true)
    else
      checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route]);

  return <>{isLoggedIn ? children : <Spinner />}</>
}

export default AuthGuard;
