import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Spinner from './Spinner';

function PrivateRoute() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setLoggedIn(!!user);
        }
        setCheckingStatus(false);
      });
    }
  }, []);

  if (checkingStatus) {
    return <Spinner />;
  }

  return (
    loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
  );
}

export default PrivateRoute;
