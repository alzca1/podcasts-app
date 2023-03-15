import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigation, useParams } from 'react-router-dom';
import usePodcasts from '../hooks/usePodcasts';
import { format, intervalToDuration } from 'date-fns';
import LoadingInfoContext from '../contexts/LoadingInfoContext';

export default function Podcast() {
  const { podcastId, episodeId } = useParams();
  const { fetchPodcastInfo, currentPodcast } = usePodcasts();
  const [episodeInfo, setEpisodeInfo] = useState(null);
  const [isLoading, setIsLoading] = useContext(LoadingInfoContext);
  let location = useLocation(); 


  useEffect(() => {
    //setIsLoading(true)
    const getPodcastInfo = async () => {
      let podcastInfo = await fetchPodcastInfo(podcastId);
    };
    getPodcastInfo();
  
  }, []);

  useEffect(() => {
    if(!isLoading){
      setIsLoading(true)
    }
    if(currentPodcast){
      setTimeout(() => {
        setIsLoading(false)
      }, 600)
    }
  }, [location])



  function getEpisodeDuration(durationMiliseconds) {
    let duration = intervalToDuration({ start: 0, end: durationMiliseconds });

    if (duration) {
      const { hours, minutes, seconds } = duration;

      if (hours) {
        return `${hours}:${minutes}:${seconds}`;
      }
      return `${minutes}:${seconds}`;
    }
  }

  function handleEpisodeInfo(episodeId) {
    let episode = currentPodcast.episodesInfo.episodesData.find((episode) => episode.trackId == episodeId);
    setEpisodeInfo(episode);
  }

  return (
    <>
      <div className='Podcast'>
        {currentPodcast && (
          <div className='podcastWrapper-container'>
            <Link to={`/podcast/${podcastId}`}>
              <div className='image-container'>
                <img
                  src={currentPodcast?.podcastInfo?.cover}
                  alt={`${currentPodcast?.podcastInfo?.title} podcast cover`}
                />
              </div>
              <div className='line'></div>
              <div className='basic-info'>
                <span className='podcast-title'>{currentPodcast?.podcastInfo?.title}</span>
                <span className='podcast-author'>by: {currentPodcast?.podcastInfo?.artist}</span>
              </div>
            </Link>
            <div className='line'></div>
            <div className='podcast-description'>
              <span className='description-title'>Description:</span>
              <span className='description-summary'>{currentPodcast?.podcastInfo?.summary}</span>
            </div>
          </div>
        )}
        {currentPodcast && !episodeId && (
          <div className='episodes-container'>
            <div className='episodesCount-container'>
              <span>Episodes: {currentPodcast?.episodesInfo?.episodesData.length - 1}</span>
            </div>
            <div className='episodesList-container'>
              <div className='table-header'>
                <div className='table-row'>
                  <span>Title</span>
                  <span>Date</span>
                  <span>Duration</span>
                </div>
              </div>
              <div className='table-body'>
                {currentPodcast?.episodesInfo?.episodesData?.map((podcast, index) => {
                  return (
                    index > 0 && (
                      <div className='table-row'>
                        <Link
                          to={`/podcast/${podcastId}/episode/${podcast.trackId}`}
                          key={podcast.trackId}
                          onClick={() => handleEpisodeInfo(podcast.trackId)}
                        >
                          <span>{podcast.name}</span>
                        </Link>
                        <span>{format(new Date(podcast.releaseDate), 'dd/M/yyyy')}</span>
                        <span>{getEpisodeDuration(podcast.trackTimeMillis)}</span>
                      </div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <Outlet context={{ episodeInfo: episodeInfo }} />
      </div>
    </>
  );
}
