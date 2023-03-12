import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import usePodcasts from '../hooks/usePodcasts';

export default function Podcast() {
  const { podcastId } = useParams();
  const { fetchPodcastInfo, currentPodcast } = usePodcasts();

  useEffect(() => {
    const getPodcastInfo = async () => {
      let podcastInfo = await fetchPodcastInfo(podcastId);
    };

    getPodcastInfo();
  }, []);

  useEffect(() => {
    console.log('currentPodcast', currentPodcast);
  }, [currentPodcast]);
  return <div>Podcast</div>;
}
