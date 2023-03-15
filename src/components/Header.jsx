import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LoadingInfoContext from '../contexts/LoadingInfoContext';
import { SpinnerDotted } from 'spinners-react';

export default function Header() {
  const [isLoading, setIsLoading] = useContext(LoadingInfoContext);

  return (
      <div className='Header' >
        <Link to='/'>Podcaster</Link>
        {isLoading ? 
          <SpinnerDotted style={{margin: "0 2rem"}}size={30} thickness={100} speed={100} color="#646EFF" /> : ""}
      </div>
  );
}
