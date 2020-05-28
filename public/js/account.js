const urlParams = new URLSearchParams(window.location.search);
let user;

function addElement(place,id,title,botton,botton2,botton3){
    let temp = 
    `<div class="element-label">
        <label class="element" id=${id}>${title}</label>`;
    if(botton3){
        temp +=
        `<button class="edit-element">${botton3}</button>`;
    }
    if(botton2){
        temp +=
        `<input class="edit-input" type="text">
        <button class="grade-element">${botton2}</button>`;
    }
    if(botton){
        temp +=
        `<button class="delete-element">${botton}</button>`;
    }
    temp +=
    `</div>`;
    place.innerHTML += temp;
}

function fetchUpdate(data){
    //unique
    //user
    //token needed
    //new token
    url = '/user';

    settings = {
        method: 'PATCH',
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
        if(data.id == user.id){
            localStorage.clear();
            localStorage.setItem('token',responseJSON);
        }
        location.reload();
        //validateToken();
    }).catch( err=> {
        result.style.opacity = 1;
    });
}

function fetchBy(page, place, next){
    //origin index edited
    //tv or quote or comment
    //no token
    let url = `/${page}`;
    let settings = {
        method: 'GET'
    };
    console.log(url);
    fetch( url, settings ).then( response => {
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    }).then( responseJSON => {
        console.log(responseJSON);
        next(place, responseJSON);
    }).catch( err=> {
        console.log(err.message);
    });
}

function fetchByToken(page, place, next){
    //unique
    //user
    //token needed
    let url = `/${page}`;
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
        next(place, responseJSON);
    }).catch( err=> {
        console.log(err.message);
    });
}

function fetchEdit(page,data,next){
    //origin serial
    //tv or quote or comment
    //token needed
    let url = `/${page}`;
    
    let settings = {
        method: 'PATCH',
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
        if(next){
            next();
        } else {
            location.reload();
        }
    }).catch( err=> {
        //result.innerHTML = `${err.message}`;
    });
}

function fetchDelete(page,id){
    //origin serial
    //news or comment or quote or tv or user
    //token needed
    let url = `/${page}/${id}`;
    
    let settings = {
        method: 'DELETE',
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
        //loadingPage();
        location.reload();
    }).catch( err=> {
        //result.innerHTML = `${err.message}`;
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

function fetchCreate(page,data){
    //unique        
    //tv or quote or comment
    //token needed
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
        location.reload();
    }).catch( err=> {
        console.log("error en fethCrete");
        //result.innerHTML = `${err.message}`;
    });
}

function watchAdminBtn(){
    let btn = document.querySelector('#create-save');
    let createForm = document.querySelector('.create-tv');

    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        let title = createForm.querySelector('#create-title').value;
        let type = createForm.querySelector('#create-type').value;
        let description = createForm.querySelector('#create-description').value;
        let image = createForm.querySelector('#create-image').value;
        
        fetchCreate('tv',{title,type,description,image});
    });

    btn = document.querySelector('#create-cancel');
    
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        createForm.querySelector('#create-title').value = "";
        createForm.querySelector('#create-type').value = "Movie";
        createForm.querySelector('#create-description').value = "";
        createForm.querySelector('#create-image').value = "";
    });

    btn = document.querySelector('#delete-everything');
    
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        let data = {};
        data.id = user.id;
        data.admin = false;
        fetchUpdate(data);
    });
}

function watchBtn(place,element,page,next){
    //delete edit
    let btns = place.querySelectorAll(`${element}`);
    for(let i=0; i<btns.length; i++){
        btns[i].addEventListener('click',(event)=>{
            event.preventDefault();
            let id;
            if(element == '#delete-account'){
                id = user.id;
            } else {
                id = event.target.parentNode.querySelector('.element').id;
            }
            if(page == 'wish' || page == 'watch'){
                id = {tvId:id};
                next(page,id);
            } else if(page == 'like'){
                id = {quoteId:id};
                next(page,id);
            } else if(page == 'quote2'){
                let data = {id,status: "Approved"};
                let quote = event.target.parentNode.querySelector('.element').innerHTML;
                let edit = event.target.parentNode.querySelector('.edit-input').value;
                if(quote != edit && edit != ""){
                    data.quote = edit;
                }
                next('quote',data);
            } else if(page == 'quote4'){
                let quote = event.target.parentNode.querySelector('.element');
                let edit = event.target.parentNode.querySelector('.edit-input');
                edit.style.display = "flex";
                quote.style.display = "none";
                edit.value = quote.innerHTML;
                event.target.style.display = "none";
            } else if(page == true || page == false){
                next({id,admin: page});
            } else {
                next(page,id);
            }
        });
    }
}

function loadpage(step,arrey){
    console.log(arrey);
    //origin index
    if(step == 'quote'){
        location.href= `serial.html?show=${arrey[0].fromId}`;
    } else if(step == 'comment'){
        fetchBy(`quote?id=${arrey[0].fromId}`,'quote',loadpage);
    }
}

function watchElement(place,element,topic){
    //delete edit
    let btns = place.querySelectorAll(`.${element}`);
    for(let i=0; i<btns.length; i++){
        btns[i].addEventListener('click',(event)=>{
            event.preventDefault();
            let id = event.target.id;
            if(topic == "serial"){
                location.href= `serial.html?show=${id}`;
            }
            else if(topic == "quote"){
                fetchBy(`quote?id=${id}`,'quote',loadpage);
            }
            else if(topic == "comment"){
                fetchBy(`comment?id=${id}`,'comment',loadpage);
            } else if(topic == "news"){
                let type = event.target.getAttribute('type');
                id = event.target.getAttribute('go');
                if(type == "New Quote"){
                    fetchBy(`quote?id=${id}`,'quote',loadpage);
                } else if(type == "New Comment"){
                    fetchBy(`comment?id=${id}`,'comment',loadpage);
                } else if(type == "New Serial"){
                    location.href= `serial.html?show=${id}`;
                }
            }
        });
    }
}

function watchInter(place){
    if(place.className == 'quotes-type'){
        watchBtn(place,'.delete-element','quote2',fetchEdit);
        watchBtn(place,'.grade-element','quote',fetchDelete);
        watchBtn(place,'.edit-element','quote4',fetchEdit);
    } else if(place.className == 'my-quotes'){
        watchBtn(place,'.delete-element','quote',fetchDelete);
        watchElement(place,'element','quote');
    } else if(place.className == 'wish-list'){
        watchBtn(place,'.delete-element','wish',fetchDeleteElement);
        watchElement(place,'element','serial');
    } else if(place.className == 'watched-list'){
        watchBtn(place,'.delete-element','watch',fetchDeleteElement);
        watchElement(place,'element','serial');
    } else if(place.className == 'like-list'){
        watchBtn(place,'.delete-element','like',fetchDeleteElement);
        watchElement(place,'element','quote');
    } else if(place.className == 'my-comments'){
        watchBtn(place,'.delete-element','comment',fetchDelete);
        watchElement(place,'element','comment');
    } else if(place.className == 'news-list'){
        watchBtn(place,'.delete-element','news',fetchDelete);
        watchElement(place,'element','news');
    } else if(place.className == 'users-list'){
        watchBtn(place,'.delete-element','user',fetchDelete);
        watchBtn(place,'.grade-element',true,fetchUpdate);
    } else if(place.className == 'administrator-list'){
        watchBtn(place,'.delete-element',false,fetchUpdate);
    }
}

function fill(place,arrey,tipe,botton){
    if(!arrey[0]){
        addElement(place,0,"No elements to show");
    } else {
        for(let i=arrey.length-1; i>=0; i--){
            if(tipe == 'username'){
                let message = `${arrey[i].username}  wish: ${arrey[i].wish.length}  watch: ${arrey[i].watch.length}  like: ${arrey[i].like.length}`;
                if(botton=='Upgrade'){
                    addElement(place,arrey[i]._id,message,'Delete',botton);
                } else {
                    addElement(place,arrey[i]._id,message,botton);
                }
            } else if(tipe == 'quote' && place.className == 'quotes-type'){
                addElement(place,arrey[i]._id,arrey[i].quote,'Approve','Delete','Edit');
            } else {
                let message;
                let id = arrey[i]._id;
                if(tipe == 'quote'){
                    message = arrey[i].quote;
                } else if(tipe == 'quote2'){
                    id = arrey[i].quoteId;
                    message = arrey[i].quote;
                } else if(tipe == 'comment'){
                    message = arrey[i].comment;
                } else if(tipe == 'title'){
                    id = arrey[i].tvId;
                    message = arrey[i].title;
                } else if(tipe == 'about'){
                    message = `${arrey[i].type}: ${arrey[i].about}`;
                    id = `${arrey[i]._id} go="${arrey[i].aboutId}" type="${arrey[i].type}"`;
                }
                addElement(place,id,message,botton);
            }
        }
        watchInter(place);
    }
}

function inter(place,arrey){
    if(place.className == 'quotes-type'){
        fill(place,arrey,'quote','Approve');
    } else if(place.className == 'my-quotes'){
        fill(place,arrey,'quote','Delete');
    } else if(place.className == 'wish-list' || place.className == 'watched-list'){
        fill(place,arrey,'title','Delete');
    } else if(place.className == 'like-list'){
        fill(place,arrey,'quote2','Delete');
    } else if(place.className == 'like-list'){
        fill(place,arrey,'title');
    } else if(place.className == 'my-comments'){
        fill(place,arrey,'comment','Delete');
    } else if(place.className == 'news-list'){
        fill(place,arrey,'about','Delete');
    } else if(place.className == 'users-list'){
        fill(place,arrey,'username','Upgrade');
    } else if(place.className == 'administrator-list'){
        fill(place,arrey,'username','Downgrade');
    }
}

function loadingPage(){
    let admin = document.querySelector('.administrator');
    document.querySelector('.user-username').innerHTML = user.username;
    if(user.admin){
        admin.style.display = 'flex';
        watchAdminBtn();
        let british = document.querySelector('.quotes-type');
        british.innerHTML = "";
        fetchBy(`quote?status=To be approved`,british,inter);
        british = document.querySelector('.news-list');
        british.innerHTML = "";
        fetchBy(`news`,british,inter);
        british = document.querySelector('.users-list')
        british.innerHTML = "";
        fetchByToken(`user?admin=false`,british,inter);
        british = document.querySelector('.administrator-list');
        british.innerHTML = "";
        fetchByToken(`user?admin=true`,british,inter);
    } else {
        admin.style.display = 'none';
    }
    watchBtns();
    let area = document.querySelector('.wish-list');
    area.innerHTML = "";
    inter(area,user.wish);
    area = document.querySelector('.watched-list');
    area.innerHTML = "";
    inter(area,user.watch);
    area = document.querySelector('.like-list');
    area.innerHTML = "";
    inter(area,user.like);
    area = document.querySelector('.my-quotes');
    area.innerHTML = "";
    fetchBy(`quote?byId=${user.id}`,area,inter);
    area = document.querySelector('.my-comments');
    area.innerHTML = "";
    fetchBy(`comment?byId=${user.id}`,area,inter);
    area = document.querySelector('.delete-account');
    watchBtn(area,'#delete-account','user',fetchDelete);
}

function watchBtns(){
    let view = document.getElementsByClassName('subtitle');
    for(let i=0; i<view.length; i++){
        view[i].addEventListener('click',(event)=>{
            event.preventDefault();
            let div = event.target.parentNode.querySelector('div');
            if(div.id == "hide"){
                div.id = "show";
                if(div.className == "delete-account"){
                    div.style.display = "block";
                }
                else if(div.parentNode.parentNode.parentNode.className == "administrator"){
                    div.style.display = "block";
                }

                if(div.className == "new-username"){
                    div.querySelector('input').value = "";
                    let hide = document.querySelector('.new-password');
                    hide.id = "hide";
                }
                else if(div.className == "new-password"){
                    div.querySelector('input').value = "";
                    let hide = document.querySelector('.new-username');
                    hide.id = "hide";
                }
            } else{
                div.id = "hide";
                if(div.parentNode.parentNode.parentNode.className == "administrator"){
                    div.style.display = "none";
                }
                else if(div.className == "delete-account"){
                    div.style.display = "none";
                }
            }
        })
    }

    view = document.querySelector('#user-edit');

    view.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let data = {};
        data.id = user.id;
        let error = document.querySelector('.error');
        let flag = false;
        if(document.querySelector('.new-username').id == "show"){
            data.username = document.querySelector('#new-username').value;
            if(data.username == user.username || data.username.length < 5){
                error.innerHTML = "The username need to be diferent than your actual username and longer than 5 characters.";
                flag = true;
            }
        } else if(document.querySelector('.new-password').id == "show"){
            data.password = document.querySelector('#new-password').value;
            if(data.password == user.username || data.password.length < 5){
                error.innerHTML = "The password need to be diferent than your username and longer than 5 characters.";
                flag = true;
            }
        }
        if(!flag){
            fetchUpdate(data);
        }
    });
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
        location.href = 'login.html';
    });
}

function watchMoveBtn(){
    //origin index edited
    let btn = document.querySelector( '.account' );

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        localStorage.clear();
        location.href= `login.html`;
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