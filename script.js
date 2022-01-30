//TODO: hide and protect these API keys
//TMDB
const v4auth = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYzZjMjVjMDI3MTVlMGUwYTRhYjQxNmJhYmQ4YjJiYyIsInN1YiI6IjYxNTZjZDMxNGQ2NzkxMDAyY2UwYzVjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cm-Sos3D07h_VW4KuHlM2XhIzQIYY8r6aQheJHSbj6c';
const v3auth = '2c6c25c02715e0e0a4ab416babd8b2bc';
const key_string = '?api_key='+v3auth;
const tmdb_api_url = 'https://api.themoviedb.org/3';

//IGDB
const client_id = 'cbxlkiflssmglrompoew7vxpsu5j35';
const client_secret = '72l323yko9h7kgm4y3st453gd18hmy';
const igdb_auth_url = 'https://id.twitch.tv/oauth2/token';
const igdb_auth_url2 = 'https://api.twitch.tv/helix';
const igdb_auth_url3 = 'https://id.twitch.tv/oauth2/authorize';
const igdb_auth_url4 = 'https://www.twitch.tv/login';
const igdb_api_url = 'https://api.igdb.com/v4';

//RAWG (20k requests a month)
const rawg_key = '53a11b05813847c1bfe2af3a05a8ffde';
const rawg_api_url = 'https://api.rawg.io/api';


//using secure base url
var tmdb_base_url;
//Terminology
//Play, Played, Play List, media, medias


// //old api request function
// const userAction = async () => {
//     // ?api_key='+v3auth
//     const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key='+v3auth+'&language=en-US&page=1', {
//         // method: 'POST',
//         // //   body: myBody, // string or object
//         // headers: {
//         // 'Authorization': 'Bearer '+v4auth,
//         // 'Content-Type': 'application/json;charset=utf-8',
//         // }
//     });
//     const myJson = await response.json(); //extract JSON from the http response
//     // do something with myJson
//     return myJson;
// }


async function requestAPI(api_url,api_endpoint, queries) {
    var q_string = '';
    if (queries != null) {
        q_string = formQueryString(queries); 
    }
    const response = await fetch(api_url+api_endpoint+q_string);
    const myJson = await response.json()
    return myJson;
}


//Format all query parameters in one query string for request url
function formQueryString(queries) {
    var query_string = '?';
    for (const [key, value] of Object.entries(queries)) {
        query_string += String(key)+'='+String(value)+'&';
    }
    //cut last char off
    return query_string;
}


//media item hover functionality
function media_item_hover_on(event) {
    // event.target.style.background = 'white';
}

function media_item_hover_off(event) {
    // event.target.style.background = 'black';
}


//Generic function for displaying list of Medias on page
async function showList(api_url,api_endpoint,queries,properties) {
    let medias = await requestAPI(api_url,api_endpoint,queries);
    // let medias = await userAction();
    console.log(medias);
    console.log(medias.results);

    var media_item_list = document.createElement('div');
    media_item_list.className = 'media_item_list'
    var medias_list = medias.results;
    for (var i = 0; i < medias_list.length; i++) {
        let media = medias_list[i];
        var media_item = document.createElement('div');
        media_item.addEventListener('mouseover', (e) => media_item_hover_on(e));
        media_item.addEventListener('mouseout', (e) => media_item_hover_off(e));
        media_item.id = media.id;
        media_item.className = 'media_item';
        //if poster available display it
        if (media.poster_path != null) {
            var img_container = document.createElement('div');
            img_container.className = 'poster_container';
            var img = document.createElement('img');
            img.src = "https://image.tmdb.org/t/p/w500" + media.poster_path;
            img.className = 'poster';
            img_container.appendChild(img);
            media_item.appendChild(img_container);
        } else if (media.background_image != null) {
            var img_container = document.createElement('div');
            img_container.className = 'poster_container';
            var img = document.createElement('img');
            img.src = media.background_image;
            img.className = 'poster';
            img_container.appendChild(img);
            media_item.appendChild(img_container);
        }
        //display original title
        var title = document.createElement('p');
        title.textContent = media[properties.o_title];
        title.className = 'title';
        media_item.appendChild(title);

        //put everything into an overlay element for effect
        var overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.appendChild(media_item);
        //if translated title exists display it below original title
        // if (media.original_title != media.title) {
        //     var s_title = document.createElement('p');
        //     s_title.textContent = media.title;
        //     s_title.className = 's_title'
        //     media_item.appendChild(s_title);
        //     // title.textContent += ' <br> ('+media.title+')'//<br> didn't work here
        // }
        media_item_list.appendChild(overlay);
    }
    document.body.appendChild(media_item_list);
}


function configure() {
    requestAPI(tmdb_api_url,'/configuration',null);
}


async function setup() {
    let queries = {};
    let properties = {};
    // //IGDB Authentication
    // queries.response_type = 'code';
    // queries.redirect_uri = 'file:///C:/Work/Projects/UnnamedTracker/index.html';
    // queries.client_id = client_id;
    // queries.client_secret = client_secret;
    // queries.grant_type = 'client_credentials';
    // let igdb_auth_response = requestAPI(igdb_auth_url3,"",queries,properties);

    //intial configure connection (obtains image url begining)
    // configure();  
    //movie section title
    let section_title = document.createElement('h1');
    section_title.textContent = 'Movies';
    document.body.appendChild(section_title);
    //display grid of popular movies
    queries = {};
    queries.api_key = v3auth;
    queries.language = 'en-US';
    queries.page = 1;
    properties = {};
    properties.o_title = 'original_title';
    await showList(tmdb_api_url,'/movie/popular',queries,properties);

    //TV section title
    section_title = document.createElement('h1');
    section_title.textContent = 'TV Shows';
    document.body.appendChild(section_title);
    //display grid of popular tv shows
    properties = {};
    properties.o_title = 'original_name';
    await showList(tmdb_api_url,'/tv/popular',queries,properties);
    
    // // starts a new grid
    // queries = {};
    // queries.language = 'en-US';
    // queries.page = 2;
    // showList(tmdb_api_url,'/movie/popular',queries);

    //Games section title
    section_title = document.createElement('h1');
    section_title.textContent = 'Video Games';
    document.body.appendChild(section_title);
    //RAWG 
    //display grid of games
    queries = {};
    queries.key = rawg_key;
    queries.page = 1;
    properties = {};
    properties.o_title = 'name';
    await showList(rawg_api_url,'/games',queries,properties);



}


window.onload = () => setup()