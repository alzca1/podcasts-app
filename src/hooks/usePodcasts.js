import { differenceInHours } from 'date-fns';
import React, { useState } from 'react';

const podcastListURL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

export default function usePodcasts() {
  const [podcastsInfo, setPodcastsInfo] = useState({});
  const [fetchIsNeeded, setFetchIsNeeded] = useState(true);

  function fetchShipments() {
    const podcastsInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsStoredInfo'));

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

          let stringifiedData = JSON.stringify(data.feed);
          localStorage.setItem('podcastsStoredInfo', stringifiedData)

          setPodcastsInfo(data.feed);
        })
        .catch((error) => {
          console.log(`Ooops, there was an error: ${error}`);
        });
    }
  }

  return { fetchShipments, podcastsInfo };
}
