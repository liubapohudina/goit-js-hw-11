import Notiflix from 'notiflix';
import axios from "axios";
import { fetchResult } from './fetchResult';

axios.defaults.headers.common["x-api-key"] = "40771201-2278ca32ba7eea467c30dfc24"

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery')
}
console.log(refs.searchForm)
let a = 5
console.log(a)


let page = 1;
let searchWord = ''
refs.searchForm.addEventListener('submit', handleSubmit);
console.log(refs.gallery)
async function handleSubmit(event) {
    event.preventDefault();
    searchWord = event.currentTarget.searchWord.value;
    try {
        const searchObjects = await fetchResult(searchWord, page);
        const showObjects = searchObjects.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => ({
            webformatURL, largeImageURL, alt: tags, likes, views, comments, downloads
        }));
        if (showObjects.length === 0) {
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        }
    
    } catch (error) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
}