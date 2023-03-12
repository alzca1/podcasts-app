import React, { useEffect, useState } from 'react';
import usePodcasts from '../hooks/usePodcasts';

export default function Home() {
  const [query, setQuery] = useState('');

  const {fetchShipments} = usePodcasts(); 

  useEffect(() => {
    const getPodcasts = async () => {
        let podcastRequest = await fetchShipments(); 
    }
    getPodcasts()
  }, [])


  return (
    <div className='Home'>
      <div className='search-container'>
        <span> Nº resultados visibles: 100</span>
        <input type='search' value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
    </div>
  );
}
