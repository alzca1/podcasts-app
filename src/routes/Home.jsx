import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigation } from 'react-router-dom';
import LoadingInfoContext from '../contexts/LoadingInfoContext';
import usePodcasts from '../hooks/usePodcasts';

export default function Home() {
  const [query, setQuery] = useState('');
  const { fetchPodcasts, podcastsInfo } = usePodcasts();
  const [isLoading, setIsLoading] = useContext(LoadingInfoContext);

let location = useLocation(); 


  useEffect(() => {
    const getPodcasts = async () => {
      let podcastRequest = await fetchPodcasts();
    };
    getPodcasts();
  }, []);


  useEffect(() => {
    if(podcastsInfo){
      setTimeout(() => {
        setIsLoading(false)
      }, 600)
    }
  }, [location, podcastsInfo])

 

  let filteredData = useMemo(() => {

    if (podcastsInfo && query !== '') {
      return podcastsInfo.filter((podcast) => {
        return (
          podcast.title.toLowerCase().includes(query.toLowerCase()) ||
          podcast.artist.toLowerCase().includes(query.toLowerCase())
        );
      });
    }
    return podcastsInfo;
  }, [podcastsInfo, query]);

  return (
    <div className='Home'>
      <div className='search-container'>
        <span>{filteredData?.length}</span>
        <input type='search' placeholder="Filter podcasts..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className='podcasts-container'>
        {filteredData?.map((podcast) => {
          return (
            <Link key={podcast.id} to={`/podcast/${podcast.id}`} >
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
