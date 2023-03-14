import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import usePodcasts from '../hooks/usePodcasts';

export default function Home() {
  const [query, setQuery] = useState('');

  const { fetchPodcasts, podcastsInfo } = usePodcasts();

  useEffect(() => {
     
    const getPodcasts = async () => {
      let podcastRequest = await fetchPodcasts();
    };
    getPodcasts();
  }, []);

  let filteredData = useMemo(
    () =>{
      if(podcastsInfo && query !== ""){
        return (
          podcast.title.toLowerCase().includes(query.toLowerCase()) ||
          podcast.artist.toLowerCase().includes(query.toLowerCase())
        );
      }
      return podcastsInfo
   /*    podcastsInfo &&
      podcastsInfo.filter((podcast) => {
        return (
          podcast.title.toLowerCase().includes(query.toLowerCase()) ||
          podcast.artist.toLowerCase().includes(query.toLowerCase())
        );
      }) */
    },
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
            <Link key={podcast.id} to={`/podcast/${podcast.id}`}>
              <div key={podcast.id} className='podcast-presentation'>
                <img src={podcast.cover} alt='podcast-image' />
                <div className='podcast-presentation-info'>
                  <p title={podcast.title}>{podcast.title}</p>
                  <span title={`Author: ${podcast.artist}`}>Author: {podcast.artist}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
