import React, { useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import usePodcasts from '../hooks/usePodcasts';
import { format, intervalToDuration } from 'date-fns';

export default function Podcast() {
  const { podcastId, episodeId } = useParams();
  const { fetchPodcastInfo, currentPodcast } = usePodcasts();
  const [podcastWrapper, setPodcastWrapper] = useState(null);
  const [episodeInfo, setEpisodeInfo] = useState(null);

  useEffect(() => {
    const getPodcastInfo = async () => {
      let podcastInfo = await fetchPodcastInfo(podcastId);
    };

    getPodcastInfo();
  }, []);

  useEffect(() => {
    console.log('currentPodcast', currentPodcast);
  }, [currentPodcast]);

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
    let episode = currentPodcast.episodesInfo.results.find((episode) => episode.trackId == episodeId);

    console.log(episode);
    setEpisodeInfo(episode);
  }

  return (
    <>
      <div className='Podcast'>
        {currentPodcast && (
          <div className='podcastWrapper-container'>
            <img
              src={currentPodcast?.podcastInfo['im:image'][2].label}
              alt={`${currentPodcast?.episodesInfo.collectionName} podcast cover`}
            />
            <div className='line'></div>
            <div className='basic-info'>
              <span className='podcast-title'>{currentPodcast?.podcastInfo.title.label}</span>
              <span className='podcast-author'>by: {currentPodcast?.podcastInfo['im:artist'].label}</span>
            </div>
            <div className='line'></div>
            <div className='podcast-description'>
              <span className='description-title'>Description:</span>
              <span className='description-summary'>{currentPodcast?.podcastInfo?.summary?.label}</span>
            </div>
          </div>
        )}
        {currentPodcast && !episodeId && (
          <div className='episodes-container'>
            <div className='episodesCount-container'>
              <span>Episodes: {currentPodcast.episodesInfo.resultCount}</span>
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
                {currentPodcast?.episodesInfo?.results.map((podcast, index) => {
                  return (
                    index > 0 && (
                      <div className='table-row'>
                        <Link
                          to={`/podcast/${podcastId}/episode/${podcast.trackId}`}
                          key={podcast.trackId}
                          onClick={() => handleEpisodeInfo(podcast.trackId)}
                        >
                          <span>{podcast.trackName}</span>
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
