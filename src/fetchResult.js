import axios from "axios";

export async function fetchResult(value, page) {
    const URL = 'https://pixabay.com/api/'
    const API_KEY = "40771201-2278ca32ba7eea467c30dfc24"
    const params = new URLSearchParams ({
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true
    })
         return  await axios.get(`${URL}?${params}`).then(response => response.data )
  
}