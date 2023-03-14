import { differenceInHours } from 'date-fns';
import React, { useState } from 'react';

const podcastListURL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

export default function usePodcasts() {
  const [podcastsInfo, setPodcastsInfo] = useState([]);
  const [fetchPodcastListNeeded, setFetchPodcastListNeeded] = useState(true);
  const [fetchPodcastDetailNeeded, setFetchPodcastDetailNeeded] = useState(true)
  const [currentPodcast, setCurrentPodcast] = useState(null);


  function fetchPodcasts() {
    const podcastsInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsListStoredInfo'));

    if (podcastsInfoFromLocalStorage) {
      const difference = differenceInHours(new Date(), new Date(podcastsInfoFromLocalStorage.lastRefreshed));

      if (difference < 24) {
        setPodcastsInfo(podcastsInfoFromLocalStorage.data);
        return setFetchPodcastListNeeded(false);
      }
    }

    if (fetchPodcastListNeeded) {
      fetch(podcastListURL)
        .then((response) => response.json())
        .then((data) => {
          const refinedData = {
            data: [], 
            lastRefreshed: new Date()
          }; 


          data.feed.entry.map(podcast => {
            const podcastInfo = {
              id: podcast.id.attributes['im:id'],
              artist: podcast['im:artist'].label,
              title: podcast.title.label, 
              cover: podcast['im:image'][2].label,
              summary: podcast.summary.label
            }
            refinedData.data.push(podcastInfo)
          })

          let stringifiedData = JSON.stringify(refinedData);
          localStorage.setItem('podcastsListStoredInfo', stringifiedData)

          setPodcastsInfo(refinedData.data);
        })
        .catch((error) => {
          console.log(`Ooops, there was an error while trying to fetch the list of podcasts => =>  ${error}`);
        });
    }
  }

  function fetchPodcastInfo(podcastId) {

    const podcastsDetailInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsDetailStoredInfo'))
    const podcastsInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsListStoredInfo'))
    const filteredPodcastListInfo = podcastsInfoFromLocalStorage?.data.find((podcast) => podcast.id === podcastId);
    const filteredDetailInfo = podcastsDetailInfoFromLocalStorage? podcastsDetailInfoFromLocalStorage?.find(podcast => podcast.podcastId === podcastId) : null;
    
    if (filteredDetailInfo) {
      const difference = differenceInHours(new Date(), new Date(filteredDetailInfo.lastRefreshed));
      
      if (difference < 24) {
        setCurrentPodcast({
          podcastInfo: filteredPodcastListInfo,
          episodesInfo: filteredDetailInfo,
        });
        
       return setFetchPodcastDetailNeeded(false);
      }


    }
    
    if(fetchPodcastDetailNeeded){
      fetch(`https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=100`)
        .then((response) => response.json())
        .then((data) => {
          const refinedData = {
            podcastId: podcastId,
            episodesData: [],
            lastRefreshed: new Date(),
          };

          data.results.map((episode, index) => {
            if (index > 0) {
              const episodeInfo = {
                trackId: episode.trackId,
                name: episode.trackName,
                releaseDate: episode.releaseDate,
                trackTimeMillis: episode.trackTimeMillis,
                episodeUrl: episode.episodeUrl, 
                description: episode.description
              };
              refinedData.episodesData.push(episodeInfo);
            }
          });


          if(podcastsDetailInfoFromLocalStorage){
            podcastsDetailInfoFromLocalStorage.push(refinedData);
            let stringifiedData = JSON.stringify(podcastsDetailInfoFromLocalStorage);
            localStorage.setItem('podcastsDetailStoredInfo', stringifiedData)
          }

          if(!podcastsDetailInfoFromLocalStorage){
            let stringifiedData = JSON.stringify([refinedData]);
            localStorage.setItem('podcastsDetailStoredInfo', stringifiedData);
          }


          setCurrentPodcast({
            podcastInfo: filteredPodcastListInfo,
            episodesInfo: refinedData,
          });
        })
        .catch((error) => {
          console.log(`Ooops, there was an error while trying to fetch the list of episodes => =>  ${error}`);
        });
    }
    
  }

  return { fetchPodcasts, podcastsInfo, fetchPodcastInfo , currentPodcast};
}
