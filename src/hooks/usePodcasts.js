import { differenceInHours } from 'date-fns';
import React, { useContext, useState } from 'react';
import LoadingInfoContext from '../contexts/LoadingInfoContext';

const podcastListURL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

export default function usePodcasts() {
  const [podcastsInfo, setPodcastsInfo] = useState([]);
  const [fetchPodcastListNeeded, setFetchPodcastListNeeded] = useState(true);
  const [fetchPodcastDetailNeeded, setFetchPodcastDetailNeeded] = useState(true)
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isLoading, setIsLoading] = useContext(LoadingInfoContext)


  function fetchPodcasts() {
    setIsLoading(true)
    const podcastsInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsListStoredInfo'));

    if (podcastsInfoFromLocalStorage) {
      const difference = differenceInHours(new Date(), new Date(podcastsInfoFromLocalStorage.lastRefreshed));

      if (difference < 24) {
        setPodcastsInfo(podcastsInfoFromLocalStorage.data);
        setTimeout(() => {
          setIsLoading(false)
        }, 600)
        return setFetchPodcastListNeeded(false);
      }
    }

    

    if (fetchPodcastListNeeded) {
      fetch(podcastListURL)
        .then((response) => response.json())
        .then((data) => {
          const refinedData = {
            data: [],
            lastRefreshed: new Date(),
          };

          data.feed.entry.map((podcast) => {
            const podcastInfo = {
              id: podcast.id.attributes['im:id'],
              artist: podcast['im:artist'].label,
              title: podcast.title.label,
              cover: podcast['im:image'][2].label,
              summary: podcast.summary.label,
            };
            refinedData.data.push(podcastInfo);
          });

          // comprobamos si hay algún elemento en el listado de detalle de episodios
          // guardado en localStorage para eliminar aquellos podcasts que ya no formen
          // parte del listado de los 100 podcasts más populares. Con ello evitamos
          // guardar más datos de los estrictamente necesarios.
          const podcastsDetailInfoFromLocalStorage = JSON.parse(localStorage.getItem('podcastsDetailStoredInfo'));
          if (podcastsDetailInfoFromLocalStorage) {
            let newPodcastsDetailInfo = podcastsDetailInfoFromLocalStorage.filter((podcastDetailItem) => {
              return refinedData.data.some((podcastListItem) => podcastDetailItem.podcastId === podcastListItem.id);
            });

            let stringifiedPodcastDetailList = JSON.stringify(newPodcastsDetailInfo);
            localStorage.setItem('podcastsDetailStoredInfo', stringifiedPodcastDetailList);
          }

          let stringifiedData = JSON.stringify(refinedData);
          localStorage.setItem('podcastsListStoredInfo', stringifiedData);

          setTimeout(() => {
            setIsLoading(false);
          }, 600);

          setPodcastsInfo(refinedData.data);
        })
        .catch((error) => {
          setTimeout(() => {
            setIsLoading(false)
          }, 600)
          console.log(`Ooops, there was an error while trying to fetch the list of podcasts => =>  ${error}`);
        });
    }
  }

  function fetchPodcastInfo(podcastId) {
     setIsLoading(true)

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
        setTimeout(() => {
          setIsLoading(false)
        }, 600)
       return setFetchPodcastDetailNeeded(false);
      }
    }
    
    if(fetchPodcastDetailNeeded){
      const podcastDetailUrl = `https://itunes.apple.com/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=100`;
      const uri = encodeURIComponent(podcastDetailUrl)

      fetch(`https://api.codetabs.com/v1/proxy?quest=${uri}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
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

          setTimeout(() => {
            setIsLoading(false)
          }, 600)

        })
        .catch((error) => {
          setTimeout(() => {
            setIsLoading(false)
          }, 600)
          console.log(`Ooops, there was an error while trying to fetch the list of episodes => =>  ${error}`);
        });
    }
    
  }

  return { fetchPodcasts, podcastsInfo, fetchPodcastInfo , currentPodcast};
}
