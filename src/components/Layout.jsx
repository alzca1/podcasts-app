import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import LoadingInfoContext from '../contexts/LoadingInfoContext'


export default function Layout() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <LoadingInfoContext.Provider value={[isLoading, setIsLoading]}>
        <Header />
        <Outlet />
      </LoadingInfoContext.Provider>
    </>
  );
}
