/!------------------------------SCROLL IS RELISED WITH WIMDOW.ADDLISTENER("scroll")-----------------------------!/
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchResult } from './fetchResult';



const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
    infoForUser: document.querySelector('.info-for-user'),
    loader: document.querySelector('.loader'),
    btn: document.getElementsByName('btn-submit')
}



//refs.loadMoreBtn.style.display = "none"
let currentHits = 0;
let page = 1;
let searchWord = ''
refs.searchForm.addEventListener('submit', handleSubmit);

let shouldHandleScroll = true;


async function handleSubmit(event) {
    event.preventDefault();
    searchWord = event.currentTarget.querySelector('[name="searchQuery"]').value.trim();
    //searchWord = event.currenttarget.searchWord.value
    currentHits = 0;
    page = 1;
    if (searchWord === "") {
        refs.loader.classList.add('is-hidden')
        refs.infoForUser.classList.add('is-hidden')
        refs.gallery.innerHTML = '';
        return Notiflix.Notify.info("Please, enter at least one letter!")
        }
    
    try {
        const searchObjects = await fetchResult(searchWord, page);
        const selectHits = searchObjects.hits.length
        currentHits += selectHits
        console.log(currentHits, searchObjects.totalHits)
        if (searchObjects.hits.length === 0) {
            // refs.gallery.innerHTML = ''
            // refs.loader.classList.add('is-hidden')
            return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }

        if (searchObjects.totalHits > 0) {
             
            Notiflix.Notify.info(`Hooray! We found ${searchObjects.totalHits} images.`)
            let hits = searchObjects.hits;
            refs.gallery.innerHTML = Markup(hits);
            let simpleLightBox = new SimpleLightbox('.gallery a', {
                captions: false,
            })
            refs.btn[0].disabled = true;
            refs.btn[0].classList.add('btn-submit')
            refs.loader.classList.remove('is-hidden');
            refs.loader.classList.add('loader');
            refs.searchForm.addEventListener('input', inputChange)
        }
        if (searchObjects.totalHits > 40) {
             window.addEventListener('scroll', handleScroll)
        }
        if (currentHits === searchObjects.totalHits) {
            shouldHandleScroll = false;
            //window.removeEventListener('scroll', handleScroll)
            scrollFunction()
            refs.loader.classList.add('is-hidden')
            refs.infoForUser.classList.remove('is-hidden')
        }
       
        
    } catch (error) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
}
function inputChange() {
    refs.btn[0].disabled = false;
    refs.btn[0].classList.remove('btn-submit')
}

async function handleScroll() {
        if (!shouldHandleScroll) {
        return;
    }
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
        //console.log(clientHeight)
        if (scrollTop + clientHeight >= scrollHeight - 2) {
        refs.loader.classList.remove('loading');
            refs.loader.classList.add('loaded');
            refs.infoForUser.classList.add('is-hidden')
        //console.log(`scrollTop: ${scrollTop},  clientHeight: ${clientHeight}, scrollHeight: ${scrollHeight}`)
        handleScrollToBottom();
       
    }
 scrollFunction()
};


   
async function handleScrollToBottom() {
      if (!shouldHandleScroll) {
        return;
    }
    page += 1;
    pageScroll();


    try {
        const searchObjects = await fetchResult(searchWord, page);
        const selectHits = searchObjects.hits.length;
        currentHits += selectHits;
       console.log(searchObjects.totalHits)
        let hits = searchObjects.hits;
        refs.gallery.innerHTML += Markup(hits);
        let simpleLightBox = new SimpleLightbox('.gallery a', {
            captions: false,
        });
        
        simpleLightBox.refresh();
          if (currentHits === searchObjects.totalHits) {
            shouldHandleScroll = false; 
            refs.loader.classList.add('is-hidden');
            refs.infoForUser.classList.remove('is-hidden');
        }
        if (searchObjects.totalHits === currentHits) {
           // Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            refs.loader.disabled = true;
            refs.loader.classList.remove('loader');
            refs.loader.classList.add('is-hidden');
            refs.infoForUser.classList.remove('is-hidden');
        }
    } catch (error) {
        Notiflix.Notify.failure("Sorry, there was an error loading more images. Please try again.");
    }
}

//--------------------FUNCTION VARIANT 2 WITH USE BUTTON LOAD MORE-------------------------------//
    
// refs.loadMoreBtn.addEventListener('click', handleClick);


   
    
// async function handleClick() {
//     page += 1;
//     refs.loadMoreBtn.classList.add('load-more')
//     const searchObjects = await fetchResult(searchWord, page);
//     const selectHits = searchObjects.hits.length
//     currentHits += selectHits
    
//     //console.log(currentHits)
//      let hits = searchObjects.hits;
//     refs.gallery.innerHTML += Markup(hits);
//     let simpleLightBox = new SimpleLightbox('.gallery a', {
//            captions: false,
//     })
//     simpleLightBox.refresh()
//     pageScroll()
//     if (searchObjects.totalHits === currentHits) {
//         Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
//         refs.loadMoreBtn.disabled = true;
//         refs.loadMoreBtn.classList.remove('load-more')
//         refs.loadMoreBtn.classList.add('is-hidden')
//         refs.infoForUser.classList.remove('is-hidden')
        
//     }
// }

function Markup(hits) {
    return hits
        .map((image) => {
            return `<div class="photo-card">
                <a href="${image.largeImageURL}">
                    <img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/>
                </a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
                    </p>
                    <p class="info-item">
                        <b>Views</b> <span class="info-item-api">${image.views}</span>
                    </p>
                    <p class="info-item">
                        <b>Comments</b> <span class="info-item-api">${image.comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
                    </p>
                </div>
            </div>`;
        })
        .join('');
    

}
 function pageScroll() {
       const { height: cardHeight } = document
         .querySelector(".gallery")
//      //------------------------VARIANT WITHOUT ANIME----------------------------//
// //    .firstElementChild.getBoundingClientRect();
// //     window.scrollBy({
// //      top: cardHeight * 2,
// //      behavior: "smooth",
//      //      });
         anime({
                 targets: [document.documentElement, document.body],
                scrollBottom: cardHeight * 2,
                duration: 3000,
                easing: 'easeInOutQuad'
           });
   
 }


//---------------------------REALISE BUTTON FOR SCROLL-------------------//


function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      //console.log(document.documentElement.scrollTop)
      document.getElementById("scrollToTop").style.display = "block";
      document.getElementById("scrollToTop").addEventListener("click", topFunction)
  } else {
    document.getElementById("scrollToTop").style.display = "none";
  }
}
function topFunction() {
    //----------------------VARIANT WITHOUT ANIME------------------------//
//   document.body.scrollTop = 0;
    //     document.documentElement.scrollTop = 0;
    
   anime({
                 targets: [document.documentElement, document.body],
                scrollTop: 0,
                duration: 1000,
                easing: 'easeInOutQuad'
            });
}