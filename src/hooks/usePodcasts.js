import { differenceInHours } from 'date-fns';
import React, { useState } from 'react';

const podcastListURL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

export default function usePodcasts() {
  const [podcastsInfo, setPodcastsInfo] = useState([]);
  const [fetchIsNeeded, setFetchIsNeeded] = useState(true);
  const [currentPodcast, setCurrentPodcast] = useState(null);


  function fetchPodcasts() {
    const podcastsInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsListInfo'));

    if (podcastsInfoFromLocalStorage) {
      const difference = differenceInHours(new Date(), new Date(podcastsInfoFromLocalStorage.lastRefreshed));

      if (difference < 24) {
        setPodcastsInfo(podcastsInfoFromLocalStorage);
        return setFetchIsNeeded(false);
      }
    }

    if (fetchIsNeeded) {
      fetch(podcastListURL)
        .then((response) => response.json())
        .then((data) => {
          data.feed.lastRefreshed = new Date();
          const refinedData = []; 

          data.feed.entry.map(podcast => {
            const podcastInfo = {
              id: podcast.id.attributes['im:id'],
              artist: podcast['im:artist'].label,
              title: podcast.title.label, 
              cover: podcast['im:image'][2].label,
            }
            refinedData.push(podcastInfo)
          })

          let stringifiedData = JSON.stringify(refinedData);
          localStorage.setItem('podcastsListInfo', stringifiedData)

          setPodcastsInfo(refinedData);
        })
        .catch((error) => {
          console.log(`Ooops, there was an error: ${error}`);
        });
    }
  }

  function fetchPodcastInfo(podcastId) {
    fetch(`https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=100`)
      .then((response) => response.json())
      .then((data) => {
        const podcastsInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsStoredInfo'));

        if (podcastsInfoFromLocalStorage) {
          let filteredPodcastInfo = podcastsInfoFromLocalStorage.entry.find(
            (podcast) => podcast.id.attributes['im:id'] === podcastId
          );
          setCurrentPodcast({
            podcastInfo: filteredPodcastInfo,
            episodesInfo: data,
          });
        }
      });
  }

  return { fetchPodcasts, podcastsInfo, fetchPodcastInfo , currentPodcast};
}
