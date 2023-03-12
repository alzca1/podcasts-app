import React, {useState} from 'react'; 


export default function usePodcasts(){

    const podcastListURL = 'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json';

    function fetchShipments(){
        fetch(podcastListURL)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
    }

    return {fetchShipments}
}