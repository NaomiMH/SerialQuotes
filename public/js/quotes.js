const urlParams = new URLSearchParams(window.location.search);
let user;

function addQuote(place,object){
    console.log(object);
    if(object){
        let temp =
        `<div class="quote" id="${object._id}">
            <div class="quote-quote-label">
                <label>"</label>
                <label class="quote-quote">${object.quote}</label>
                <label>"</label>
            </div>
            <div class="quote-by-label">
                <label>By: </label>
                <label class="quote-by">${object.by}</label>
            </div>
            <div class="quote-from-label">
                <label>From: </label>
                <label class="quote-from" id="${object.fromId}">${object.from}</label>
            </div>
            <div class="like-date">`;
        if(user){
            if(!user.like.find( quote => quote.quoteId === object._id)){
                temp += `<div id="add-like"></div>`;
            } else {
                temp += `<div id="like-add"></div>`;
            }
        }
        temp +=
            `<label class="quote-date">${new Date(object.date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
            </div>
        </div>`;
        place.innerHTML += temp;
        watchResults(place);
    }
}

function addQuotes(place,arrey){
    if(arrey[0]){
        let size = arrey.length;
        let min = 0;
        if(size>10){
            min = size-10;
        }
        for(let i = size-1; i>=min; i--){
            let temp =
            `<div class="quote" id="${arrey[i]._id}">
                <div class="quote-quote-label">
                    <label>"</label>
                    <label class="quote-quote">${arrey[i].quote}</label>
                    <label>"</label>
                </div>
                <div class="quote-by-label">
                    <label>By: </label>
                    <label class="quote-by">${arrey[i].by}</label>
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
        watchResults(place);
    }
}

function fetchAll(page, place, next){
    //origin index
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
        next(place, responseJSON);
    }).catch( err=> {
        console.log(err.message);
    });
}

function fetchBy(page, place, next){
    //origin serial
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
        if(page=='random'){
            console.log(responseJSON);
        }
        next(place, responseJSON);
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
        //validateToken();
        location.reload();
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

function watchResults(place){
    let serialList = place.querySelectorAll( '.quote' );
    
    for(let i=0; i<serialList.length; i++){
        serialList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            if(event.target.id == 'add-like'){
                let data = {};
                data.quoteId = event.currentTarget.id;
                data.quote = event.currentTarget.querySelector('.quote-quote').innerHTML;
                fetchAdd('like',data);
            } else if(event.target.id == 'like-add'){
                let data = {};
                data.quoteId = event.currentTarget.id;
                fetchDeleteElement('like',data);
            } else {
                let id = event.currentTarget.querySelector('.quote-from').id;
                location.href= `serial.html?show=${id}`;
            }
        });
    }
}

function loadingPage(){
    if(user){
        area = document.querySelector('.account');
        area.innerHTML = "My account";
    }
    let recentQuotes = document.querySelector('.recent-quotes');
    fetchAll('quotes',recentQuotes,addQuotes);
    let moviesQuotes = document.querySelector('.movies-quotes');
    fetchBy('quote?type=Movie',moviesQuotes,addQuotes);
    let seriesQuotes = document.querySelector('.serial-quotes');
    fetchBy('quote?type=Serie',seriesQuotes,addQuotes);
    let randomQuotes = document.querySelector('.random-quotes');
    fetchBy('random',randomQuotes,addQuote);
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