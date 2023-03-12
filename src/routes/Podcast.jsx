import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import usePodcasts from '../hooks/usePodcasts';
import {format, intervalToDuration} from 'date-fns'

export default function Podcast() {
  const { podcastId, episodeId } = useParams();
  const { fetchPodcastInfo, currentPodcast } = usePodcasts();
  const [podcastWrapper, setPodcastWrapper] = useState(null);

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

  return (
    <>
      <div className='Podcast'>
        {currentPodcast && (
          <div className='podcastWrapper-container'>
            <img
              src={currentPodcast?.podcastInfo['im:image'][2].label}
              alt={`${currentPodcast?.episodesInfo.collectionName} podcast cover`}
            />
            <p>{currentPodcast?.podcastInfo.title.label}</p>
            <span>by: {currentPodcast?.podcastInfo['im:artist'].label}</span>
            <span>Description:</span>
            <p>{currentPodcast?.podcastInfo?.summary?.label}</p>
          </div>
        )}
        {currentPodcast && !episodeId && (
          <div className='episodes-container'>
            <div className='episodesCount-container'>
              <span>Episodes: {currentPodcast.episodesInfo.resultCount}</span>
            </div>
            <div className='episodesList-container'>
            {currentPodcast?.episodesInfo?.results.map((podcast) => {
              return (
                <Link to={`/podcast/${podcastId}/episode/${podcast.trackId}`} key={podcast.trackId} onClick={() => handleEpisodeInfo(podcast.trackId)}>
                  <div>
                    <p>{podcast.trackName}</p>
                    <span>{format(new Date(podcast.releaseDate), 'dd/M/yyyy')}</span>
                    <span>{getEpisodeDuration(podcast.trackTimeMillis)}</span>
                  </div>
                </Link>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
