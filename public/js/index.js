const urlParams = new URLSearchParams(window.location.search);
let user,wish,watch;

function addTV(place,arrey){
    for (let i=arrey.length-1; i>=0; i--){
        let temp = 
        `<div class="tv" id="${arrey[i]._id}">
            <img alt="image" src="${arrey[i].image}">
            <label class="tv-title">${arrey[i].title}</label>
            <label class="tv-description">${arrey[i].description}</label>
            <label class="tv-type">${arrey[i].type}</label>`;
        if(user){
            if(!watch.find( tv => tv.tvId === arrey[i]._id)){
                if(!wish.find( tv => tv.tvId === arrey[i]._id)){
                    temp += `<button class="listBtn" id="add-wish"></button>`;
                } else {
                    temp += `<button class="listBtn" id="add-watch"></button>`;
                }
            }
        }
        temp +=
        `</div>`;
        place.innerHTML += temp;
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

function addNews(place,arrey){
    for (let i=arrey.length-1; i>=0; i--){
        place.innerHTML += 
        `<div class="news-new" id="${arrey[i]._id}" go="${arrey[i].aboutId}">
            <label class="news-new-title">${arrey[i].type}</label>
            <label>${arrey[i].about}</label>
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
                result.innerHTML = `<label class="error">There isn't media available.</label>`;
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
                result.innerHTML = `<label class="error">There aren't quotes available.</label>`;
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
                    let id = responseJSON[0]._id;
                    url = `/wish?userId=${id}`;
                    
                    fetch( url, settings )
                        .then( response => {
                            if( response.ok ){
                                return response.json();
                            }
                            throw new Error( response.statusText );
                        })
                        .then( responseJSON => {
                            if(responseJSON[0]){
                                wish = responseJSON[0].list;
                                url = `/watched?userId=${id}`;
                    
                                fetch( url, settings )
                                    .then( response => {
                                        if( response.ok ){
                                            return response.json();
                                        }
                                        throw new Error( response.statusText );
                                    })
                                    .then( responseJSON => {
                                        if(responseJSON[0]){
                                            watch = responseJSON[0].list;
                                            fetchAllTV();
                                        }
                                    })
                                    .catch( err=> {
                                        cosole.log(err.message);
                                    });
                            }
                        })
                        .catch( err=> {
                            cosole.log(err.message);
                        });
                }
            })
            .catch( err=> {
                cosole.log(err.message);
            });
    } else{
        fetchAllTV();
    }
}

function fetchQuote(type,from,id){
    let url = `/quote?`;
    if(type){
        url+= `type=${type}`;
        if(from || id){
            url+='&';
        }
    }
    if(from){
        url+= `from=${from}`;
        if(id){
            url+='&';
        }
    }
    if(id){
        url+= `id=${id}`;
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
                if(id){
                    location.href = `serial.html?id=${user._id}&show=${responseJSON[0].fromId}`;
                }else{
                    addQuotes(result,responseJSON);
                    watchQuotesResults();
                }
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
                result.innerHTML = `<label class="error">There aren't media available.</label>`;
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

function fetchAllNews(){
    let url = "/news";
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.news' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                result.innerHTML = "";
                addNews(result,responseJSON);
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAdd(page,id,title){
    let url = `/${page}`;
    let data = {
        userId: user._id,
        tvId: id,
        title: title
    };
    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    };
    
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            location.reload();
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchComment(id){
    let url = `/comment?id=${id}`;
    let settings = {
        method: 'GET'
    };
    
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                fetchQuote(undefined,undefined,responseJSON[0].fromId);
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function watchSerialResults(){
    let serialList = document.querySelectorAll( '.tv' );
    
    for(let i=0; i<serialList.length; i++){
        serialList[i].addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.id;
            if(event.target.id == "add-wish"){
                let title = event.currentTarget.querySelector('.tv-title').innerHTML;
                fetchAdd('wish',id,title);
            }
            else if(event.target.id == "add-watch"){
                let title = event.currentTarget.querySelector('.tv-title').innerHTML;
                fetchAdd('watch',id,title);
            }
            else{
                let userid = urlParams.get('id');
                let nextpage = 'serial.html?';
                if(userid){
                    nextpage += `id=${userid}&`;
                }
                nextpage += `show=${id}`;
                location.href= nextpage;
            }
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

function watchNewsResults(){
    let newsList = document.querySelector( '.news' );
    
    newsList.addEventListener( 'click',(event)=>{
        let object = event.target;
        if(event.target.parentNode.className == "news-new"){
            object = event.target.parentNode;
        }
        if(object){
            let type = object.querySelector('.news-new-title').innerHTML;
            let id = object.getAttribute('go');
            if(type == "New Serial"){
                location.href = `serial.html?id=${user._id}&show=${id}`;
            }
            else if(type == "New Quote"){
                fetchQuote(undefined,undefined,id);
            }
            else if(type == "New Comment"){
                fetchComment(id);
            }
        }
        //console.log(event.target.parentNode.className);
    });
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
    fetchAllNews();

    watchBtn();
    watchNewsResults();
}

init();