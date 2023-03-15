import React, { useContext, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import LoadingInfoContext from '../contexts/LoadingInfoContext';


export default function Episode() {
  const {episodeInfo} = useOutletContext()
  const [isLoading, setIsLoading] = useContext(LoadingInfoContext);
  let location = useLocation();
  
  
  useEffect(() => {
    if(episodeInfo){
      setTimeout(() => {
        setIsLoading(false)
      }, 600)
    }
  }, [location])



  return (
    <div className='Episode'>
      {episodeInfo && (
        <div>
          <h4>{episodeInfo.name}</h4>
          <p>{episodeInfo.description}</p>
          <audio src={episodeInfo.episodeUrl} controls />
        </div>
      )}
    </div>
  );
}
