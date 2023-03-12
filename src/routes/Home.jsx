import React, { useEffect, useMemo, useState } from 'react';
import usePodcasts from '../hooks/usePodcasts';

export default function Home() {
  const [query, setQuery] = useState('');

  const { fetchShipments, podcastsInfo } = usePodcasts();

  useEffect(() => {
    const getPodcasts = async () => {
      let podcastRequest = await fetchShipments();
    };
    getPodcasts();
  }, []);

  let filteredData = useMemo(
    () =>
      podcastsInfo && podcastsInfo?.entry?.filter((podcast) => {
        return (
          podcast.title.label.toLowerCase().includes(query.toLowerCase()) ||
          podcast['im:artist'].label.toLowerCase().includes(query.toLowerCase())
        );
      }),
    [podcastsInfo, query]
  );

  return (
    <div className='Home'>
      <div className='search-container'>
        <span> Nº resultados visibles: 100</span>
        <input type='search' value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className='podcasts-container'>
        {filteredData?.map((podcast) => {
          return (
            <div key={podcast.id.attributes['im:id']} className='podcast-presentation'>
              <img src={podcast['im:image'][2].label} alt='podcast-image' />
            </div>
          );
        })}
      </div>
    </div>
  );
}
