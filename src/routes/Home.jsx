import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
      podcastsInfo &&
      podcastsInfo?.entry?.filter((podcast) => {
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
        <span> {filteredData?.length}</span>
        <input type='search' value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className='podcasts-container'>
        {filteredData?.map((podcast) => {
          return (
            <Link key={podcast.id.attributes['im:id']} to={`/podcast/${podcast.id.attributes['im:id']}`}>
              <div key={podcast.id.attributes['im:id']} className='podcast-presentation'>
                <img src={podcast['im:image'][2].label} alt='podcast-image' />
                <div className='podcast-presentation-info'>
                  <p title={podcast.title.label}>{podcast.title.label}</p>
                  <span title={`Author: ${podcast['im:artist'].label}`}>Author: {podcast['im:artist'].label}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
