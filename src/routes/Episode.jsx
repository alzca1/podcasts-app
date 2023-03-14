import React from 'react';
import { useOutletContext } from 'react-router-dom';


export default function Episode() {
  const {episodeInfo} = useOutletContext()

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
