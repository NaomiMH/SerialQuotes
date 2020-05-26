const urlParams = new URLSearchParams(window.location.search);
let user;


function standby(id) {
    document.getElementById(id).src = 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg'
}

function addTV(place,arrey){
    //origin index
    if(!arrey[0]){
        place.innerHTML += 'No information available';
    } else {
        for (let i=arrey.length-1; i>=0; i--){
            let temp = 
            `<div class="tv" id="${arrey[i]._id}">
                <img alt="image" id="image-${arrey[i]._id}" src="${arrey[i].image}" onerror=standby("image-${arrey[i]._id}")>
                <label class="tv-title">${arrey[i].title}</label>
                <label class="tv-description">${arrey[i].description}</label>
                <label class="tv-type">${arrey[i].type}</label>`;
            if(user){
                if(!user.watch.find( tv => tv.tvId === arrey[i]._id)){
                    if(!user.wish.find( tv => tv.tvId === arrey[i]._id)){
                        temp += `<button id="add-wish"></button>`;
                    } else {
                        temp += `<button id="add-watch"></button>`;
                    }
                }
            }
            temp +=
            `</div>`;
            place.innerHTML += temp;
        }
        watchSerialResults();
    }
}

function addQuotes(place,arrey){
    //origin index
    if(!arrey[0]){
        place.innerHTML += 'No information available';
    } else {
        for (let i=arrey.length-1; i>=0; i--){
            let temp = 
            `<div class="quote" id="${arrey[i]._id}">
                <div class="quote-quote-label">
                    <label>"</label>
                    <label class="quote-quote">${arrey[i].quote}</label>
                    <label>"</label>
                </div>
                <div class="quote-by-label">
                    <label>By: </label>
                    <label class="quote-by" id=${arrey[i].byId}>${arrey[i].by}</label>
                </div>
                <div class="quote-from-label">
                    <label>From: </label>
                    <label class="quote-from" id="${arrey[i].fromId}">${arrey[i].from}</label>
                </div>
                <div class="like-date">`;
            if(user){
                if(!user.like.find( quote => quote.quoteId === arrey[i]._id)){
                    temp += `<div id="add-like"></div>`;
                } else {
                    temp += `<div id="like-add"></div>`;
                }
            }
                temp += 
                    `<label class="quote-date">${new Date(arrey[i].date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
                </div>
            </div>`;
            place.innerHTML += temp;
        }
        watchQuotesResults();
    }
}

function addNews(place,arrey){
    //unique
    if(arrey[0]){
        for (let i=arrey.length-1; i>=0; i--){
            place.innerHTML += 
            `<div class="news-new" id="${arrey[i]._id}" go="${arrey[i].aboutId}">
                <label class="news-new-title">${arrey[i].type}</label>
                <label>${arrey[i].about}</label>
            </div>`;
        }
        watchNewsResults();
    }
}

function fetchAll(page, place, next){
    //tvs or quotes or news
    //no token
    let url = `/${page}`;
    let settings = {
        method: 'GET'
    };
    fetch( url, settings ).then( response => {
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    }).then( responseJSON => {
        if(responseJSON[0]){
            next(place, responseJSON);
        } else {
            if(page != 'news'){
                place.innerHTML += 'No information available';
            }
        }
    }).catch( err=> {
        console.log(err.message);
    });
}

function fetchBy(page, place, next){
    //origin index
    //tv or quote or comment
    //no token
    let url = `/${page}`;
    let settings = {
        method: 'GET'
    };
    
    fetch( url, settings ).then( response => {
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    }).then( responseJSON => {
        if(responseJSON[0]){
            next(place, responseJSON);
        } else {
            place.innerHTML += 'No information available';
        }
    }).catch( err=> {
        console.log(err.message);
    });
}

function fetchAdd(page,data){
    //origin index
    //wish or watch or like
    //token needed
    //new token
    let url = `/${page}`;
    
    let settings = {
        method: 'POST',
        headers: {
            token: localStorage.getItem( 'token' ),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    };
    
    fetch( url, settings ).then( response => {
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    }).then( responseJSON => {
        localStorage.clear;
        localStorage.setItem('token',responseJSON);
        validateToken();
    }).catch( err=> {
        console.log("missing code");
        //result.innerHTML = `<label class="error">${err.message}</label>`;
    });
}

function fetchDeleteElement(page,data){
    //origin serial
    //wish or watch or tv or like
    //token needed
    //new token
    let url = `/${page}`;
    
    let settings = {
        method: 'DELETE',
        headers: {
            token: localStorage.getItem( 'token' ),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    };
    
    fetch( url, settings ).then( response => {
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    }).then( responseJSON => {
        localStorage.clear();
        localStorage.setItem('token',responseJSON);
        //validateToken();
        location.reload();
    }).catch( err=> {
        //result.innerHTML = `${err.message}`;
    });
}

function watchSerialResults(){
    //origin index
    let serialList = document.querySelectorAll( '.tv' );
    
    for(let i=0; i<serialList.length; i++){
        serialList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.id;
            if(event.target.id == "add-wish"){
                let title = event.currentTarget.querySelector('.tv-title').innerHTML;
                fetchAdd('wish',{tvId: id,title});
            }
            else if(event.target.id == "add-watch"){
                let title = event.currentTarget.querySelector('.tv-title').innerHTML;
                fetchAdd('watch',{tvId: id,title});
            } else {
                location.href= `serial.html?show=${id}`;
            }
        });
    }
}

function watchQuotesResults(){
    //origin index
    let quoteList = document.querySelectorAll( '.quote' );
    
    for(let i=0; i<quoteList.length; i++){
        quoteList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.id;
            if(event.target.id == 'add-like'){
                let quote = event.currentTarget.querySelector('.quote-quote').innerHTML;
                fetchAdd('like',{quoteId: id,quote: quote});
            } else if(event.target.id == 'like-add'){
                fetchDeleteElement('like',{quoteId: id});
            } else {
                fetchBy(`quote?id=${id}`,'quote',loadpage);
            }
        });
    }
}

function loadpage(step,arrey){
    //origin index
    if(step == 'quote'){
        location.href= `serial.html?show=${arrey[0].fromId}`;
    } else if(step == 'comment'){
        fetchBy(`quote?id=${arrey[0].fromId}`,'quote',loadpage);
    }
}

function watchNewsResults(){
    //origin index
    let serialList = document.querySelectorAll( '.news-new' );
    
    for(let i=0; i<serialList.length; i++){
        serialList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.getAttribute('go');
            let topic = event.currentTarget.querySelector('.news-new-title').innerHTML;
            if(topic == "New Serial"){
                location.href= `serial.html?show=${id}`;
            }
            else if(topic == "New Quote"){
                fetchBy(`quote?id=${id}`,'quote',loadpage);
            }
            else if(topic == "New Comment"){
                fetchBy(`comment?id=${id}`,'comment',loadpage);
            }
        });
    }
}

function watchSerialBtns(){
    //origin index
    let area = document.querySelector('.serial-results');
    let area2 = document.querySelector('.quotes-results');
    let btn = document.querySelector('#serial-search');
    
    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let search = document.querySelector( '.serial-search').value;
        document.querySelector( '.serial-search').value = "";
        if( search != "" ){
            let radioBtn = document.getElementsByName('filter');
            area.innerHTML = "";
            area2.innerHTML = "";
            if(radioBtn[1].checked){
                fetchBy(`tv?title=${search}&type=Movie`,area,addTV);
                fetchBy(`quote?from=${search}&type=Movie`,area2,addQuotes);
            } else if(radioBtn[2].checked){
                fetchBy(`tv?title=${search}&type=Series`,area,addTV);
                fetchBy(`quote?from=${search}&type=Series`,area2,addQuotes);
            } else {
                fetchBy(`tv?title=${search}`,area,addTV);
                fetchBy(`quote?from=${search}`,area2,addQuotes);
            }
        }
    });

    btn = document.querySelector('.serial-filter');
    
    btn.addEventListener( 'click', (event)=>{
        //event.preventDefault();
        let radioBtn = document.getElementsByName('filter');
        if(event.target.tagName == "LABEL"){
            if(event.target.innerHTML == "All"){
                radioBtn[0].checked = true;
            } else if(event.target.innerHTML == "Movies"){
                radioBtn[1].checked = true;
            } else if(event.target.innerHTML == "Series"){
                radioBtn[2].checked = true;
            }
        }
        area.innerHTML = "";
        area2.innerHTML = "";
        if(radioBtn[0].checked){
            fetchAll('tvs',area,addTV);
            fetchAll('quotes',area2,addQuotes);
        } else if(radioBtn[1].checked){
            fetchBy(`tv?type=Movie`,area,addTV);
            fetchBy(`quote?type=Movie`,area2,addQuotes);
        } else if(radioBtn[2].checked){
            fetchBy(`tv?type=Series`,area,addTV);
            fetchBy(`quote?type=Series`,area2,addQuotes);
        }
    });
}

function loadingPage(){
    //unique
    let area;
    if(user){
        area = document.querySelector('.account');
        area.innerHTML = "My account";
    }
    area = document.querySelector('.serial-results');
    area.innerHTML = "";
    fetchAll('tvs',area,addTV);
    watchSerialBtns();
    area = document.querySelector('.quotes-results');
    area.innerHTML = "";
    fetchAll('quotes',area,addQuotes);
    area = document.querySelector('.news');
    area.innerHTML = "";
    fetchAll('news',area,addNews);
}

function validateToken(){
    //origin index
    //token needed
    let url = '/valid/token';
    let settings = {
        method: 'GET',
        headers: {
            token: localStorage.getItem( 'token' )
        }
    };
    
    fetch( url, settings ).then( response => {
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    }).then( responseJSON => {
        user = responseJSON.userData;
        localStorage.setItem('token',responseJSON.token);
        loadingPage();
    }).catch( err=> {
        loadingPage();
    });
}

function watchMoveBtn(){
    //origin index
    let btn = document.querySelector( '.account' );

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(user){
            location.href='account.html';
        } else {
            location.href= `login.html`;
        }
    });

    btn = document.querySelector( '.quotePage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        location.href='quotes.html';
    });

    btn = document.querySelector( '.serialPage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        location.href='serial.html';
    });

    btn = document.querySelector( '.indexPage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        location.href='index.html';
    });

    btn = document.querySelector('.mapPage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(event.target.tagName == "LI"){
            location.href = `${event.target.getAttribute('go')}.html`;
        }
    });

    btn = document.querySelector('.aboutUs');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(event.target.tagName == "LI"){
            location.href = `page.html?show=${event.target.getAttribute('go')}`;
        }
    });

    btn = document.querySelector('.information');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(event.target.tagName == "LI"){
            location.href = `page.html?show=${event.target.getAttribute('go')}`;
        }
    });
}

function init(){
    watchMoveBtn();
    validateToken();
}

init();