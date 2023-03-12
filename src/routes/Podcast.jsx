import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usePodcasts from '../hooks/usePodcasts';

export default function Podcast() {
  const { podcastId } = useParams();
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

  return (
    <>
      {currentPodcast && (
        <div className='Podcast'>
          <div className='podcastWrapper-container'>
            <img
              src={currentPodcast?.podcastInfo['im:image'][2].label}
              alt={`${currentPodcast?.episodesInfo.collectionName} podcast cover`}
            />
            <hr />
            <p>{currentPodcast?.podcastInfo.title.label}</p>
            <span>by: {currentPodcast?.podcastInfo['im:artist'].label}</span>
            <hr />
            <span>Description:</span>
            <p>{currentPodcast?.podcastInfo?.summary?.label}</p>
          </div>
        </div>
      )}
    </>
  );
}
