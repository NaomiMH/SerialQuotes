const urlParams = new URLSearchParams(window.location.search);
let user;

function addQuote(place,object){
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
        <label class="quote-date">${new Date(object.date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
    </div>`;
    place.innerHTML += temp;
}

function addQuotes(place,arrey){
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
            <label class="quote-date">${new Date(arrey[i].date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
        </div>`;
        place.innerHTML += temp;
    }
}

function fetchUser(){
    let userid = urlParams.get('id');
    let result = document.querySelector('.account');
    if(userid){
        let url = `/user?id=${userid}`;
        let settings = {
            method: 'GET'
        }
        
        fetch( url, settings )
            .then( response => {
                if( response.ok ){
                    return response.json();
                }
                throw new Error( response.statusText );
            })
            .then( responseJSON => {
                result.innerHTML = "";
                if(responseJSON[0]){
                    result.innerHTML += 'My account';
                    user=responseJSON[0];
                }
            })
            .catch( err=> {
                cosole.log(err.message);
            });
    }
}

function fetchAllQuotes(){
    let url = '/quotes';
    let settings = {
        method: 'GET'
    };
    
    let recentQuotes = document.querySelector('.recent-quotes');
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                addQuotes(recentQuotes,responseJSON);
                watchFutereBtn(recentQuotes);
            } else {
                seriesQuotes.innerHTML = `<div class="quote">No entries</div>`
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchQuotesBy(){
    let url = '/quote?type=Movie';
    let settings = {
        method: 'GET'
    };
    
    let moviesQuotes = document.querySelector('.movies-quotes');
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                addQuotes(moviesQuotes,responseJSON);
                watchFutereBtn(moviesQuotes);
            } else {
                seriesQuotes.innerHTML = `<div class="quote">No entries</div>`
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
    
    url = '/quote?type=Serie';
    
    let seriesQuotes = document.querySelector('.serial-quotes');
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                addQuotes(seriesQuotes,responseJSON);
                watchFutereBtn(seriesQuotes);
            } else {
                seriesQuotes.innerHTML = `<div class="quote">No entries</div>`
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });

    url = '/random';

    let randomQuotes = document.querySelector('.random-quotes');
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            addQuote(randomQuotes,responseJSON);
            watchFutereBtn(randomQuotes);
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function watchFutereBtn(place){
    let serialList = place.querySelectorAll( '.quote' );
    
    for(let i=0; i<serialList.length; i++){
        serialList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.querySelector('.quote-from').id;
            let userid = urlParams.get('id');
            let nextpage = 'serial.html?';
            if(userid){
                nextpage += `id=${userid}&`;
            }
            nextpage += `show=${id}`;
            location.href= nextpage;
        });
    }
}

function watchBtn(){
    let userid = urlParams.get('id');
    let btn = document.querySelector( '.account' );

    btn.addEventListener( 'click', (event)=>{
        if(user){
            location.href=`account.html?id=${userid}`;
        }
        else{
            location.href='login.html';
        }
    });

    btn = document.querySelector( '.quotePage');

    btn.addEventListener( 'click', (event)=>{
        if(user){
            location.href=`quotes.html?id=${userid}`;
        }
        else{
            location.href='quotes.html';
        }
    });

    btn = document.querySelector( '.serialPage');

    btn.addEventListener( 'click', (event)=>{
        if(user){
            location.href=`serial.html?id=${userid}`;
        }
        else{
            location.href='serial.html';
        }
    });

    btn = document.querySelector( '.indexPage');

    btn.addEventListener( 'click', (event)=>{
        if(user){
            location.href=`index.html?id=${userid}`;
        }
        else{
            location.href='index.html';
        }
    });

    btn = document.querySelector('.mapPage');

    btn.addEventListener( 'click', (event)=>{
        if(event.target.tagName == "LI"){
            let temp = `${event.target.getAttribute('go')}.html`
            if(user){
                temp += `?id=${user._id}`;
            }
            location.href = temp;
        }
    });

    btn = document.querySelector('.aboutUs');

    btn.addEventListener( 'click', (event)=>{
        if(event.target.tagName == "LI"){
            let temp = `page.html?`;
            if(user){
                temp += `id=${user._id}&`;
            }
            temp += `show=${event.target.getAttribute('go')}`;
            location.href = temp;
        }
    });

    btn = document.querySelector('.information');

    btn.addEventListener( 'click', (event)=>{
        if(event.target.tagName == "LI"){
            let temp = `page.html?`;
            if(user){
                temp += `id=${user._id}&`;
            }
            temp += `show=${event.target.getAttribute('go')}`;
            location.href = temp;
        }
    });
}

function init(){
    fetchUser();
    fetchAllQuotes();
    fetchQuotesBy();

    watchBtn();
}

init();