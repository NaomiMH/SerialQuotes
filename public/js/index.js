const urlParams = new URLSearchParams(window.location.search);
let user;

function addTV(place,arrey){
    for (let i=arrey.length-1; i>=0; i--){
        place.innerHTML += 
        `<div class="tv" id="${arrey[i]._id}">
            <img alt="imagen"  height="120px" src="${arrey[i].image}">
            <label class="tv-title">${arrey[i].title}</label>
            <label class="tv-description">${arrey[i].description}</label>
            <label class="tv-type">${arrey[i].type}</label>
        </div>`;
    }
}

function addQuotes(place,arrey){
    for (let i=arrey.length-1; i>=0; i--){
        place.innerHTML += 
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
    }
}

function addAchi(place,arrey){
    for (let i=arrey.length-1; i>=0; i--){
        place.innerHTML += 
        `<div class="achi" id="${arrey[i]._id}">
            <label class="achi-title">${arrey[i].type}</label>
            <label>${arrey[i].about}</label>
            <label>${new Date(arrey[i].date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
            <label class="to-go">${arrey[i].aboutId}</label>
        </div>`;
    }
}

function fetchAllTV(){
    let url = '/tvs';
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.serial-results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(!responseJSON[0]){
                result.innerHTML = `<label class="error">There arent 'tv' available.</label>`;
            }else{
                result.innerHTML = "";
                addTV(result,responseJSON);
                watchSerialResults();
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllQuotes(){
    let url = '/quotes';
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.quotes-results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(!responseJSON[0]){
                result.innerHTML = `<label class="error">There arent 'quotes' available.</label>`;
            }else{
                result.innerHTML = "";
                addQuotes(result,responseJSON);
                watchQuotesResults();
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchUser(){
    let userid = urlParams.get('id');
    let result = document.querySelector('.acount');
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
                    result.innerHTML += 'My acount';
                    user=responseJSON[0];
                }
            })
            .catch( err=> {
                result.innerHTML = `<div class="error"> ${err.message}</div>`;
            });
    }
}

function fetchQuote(type,from){
    let url = `/quote?`;
    if(type){
        url+= `type=${type}`;
        if(from){
            url+='&';
        }
    }
    if(from){
        url+= `from=${from}`;
    }
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.quotes-results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(!responseJSON[0]){
                result.innerHTML = `<label class="error">There arent 'quotes' available.</label>`;
            }else{
                result.innerHTML = "";
                addQuotes(result,responseJSON);
                watchQuotesResults();
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchTV(type,title){
    let url = `/tv?`;
    if(type){
        url+=`type=${type}`;
        if(title){
            url+= `&`;
        }
    }
    if(title){
        url+=`title=${title}`;
    }
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.serial-results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(!responseJSON[0]){
                result.innerHTML = `<label class="error">There arent 'tv' available.</label>`;
            }else{
                result.innerHTML = "";
                addTV(result,responseJSON);
                watchSerialResults();
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllAchi(){
    let url = "/achievements";
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.achievements' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(!responseJSON[0]){
                result.innerHTML = `<label class="error">There arent 'achievements' available.</label>`;
            }else{
                result.innerHTML = "";
                addAchi(result,responseJSON);
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function watchSerialResults(){
    let serialList = document.querySelectorAll( '.tv' );
    
    for(let i=0; i<serialList.length; i++){
        serialList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.id;
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

function watchQuotesResults(){
    let serialList = document.querySelectorAll( '.quote' );
    
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
    let btn = document.querySelector( '.acount' );

    btn.addEventListener( 'click', (event)=>{
        if(user){
            location.href=`acount.html?id=${userid}`;
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

    btn = document.querySelector('#serial-search');
    
    btn.addEventListener( 'click', (event)=>{
        let search = document.querySelector( '.serial-search').value;
        if( search != "" ){
            let radioBtn = document.getElementsByName('filter');
            if(radioBtn[1].checked){
                fetchTV("Movie",search);
                fetchQuote("Movie",search);
            } else if(radioBtn[2].checked){
                fetchTV("Serie",search);
                fetchQuote("Serie",search);
            } else {
                fetchTV(undefined,search);
                fetchQuote(undefined,search);
            }
        }
    });

    btn = document.querySelector('.serial-filter');
    
    btn.addEventListener( 'click', (event)=>{
        let radioBtn = document.getElementsByName('filter');
        if(event.target = "label"){
            if(event.target.innerHTML == "All"){
                radioBtn[0].checked = "checked";
            } else if(event.target.innerHTML == "Movies"){
                radioBtn[1].checked = "checked";
            } else if(event.target.innerHTML == "Series"){
                radioBtn[2].checked = "checked";
            }
        }
        if(radioBtn[0].checked){
            fetchAllTV();
            fetchAllQuotes();
        } else if(radioBtn[1].checked){
            fetchTV("Movie");
            fetchQuote("Movie");
        } else if(radioBtn[2].checked){
            fetchTV("Serie");
            fetchQuote("Serie");
        }
    });
}

function init(){
    fetchUser();
    fetchAllTV();
    fetchAllQuotes();
    fetchAllAchi();

    watchBtn();
}

init();