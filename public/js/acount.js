const urlParams = new URLSearchParams(window.location.search);
let user;

function addElement(place,id,title,message){
    place.innerHTML += 
    `<div class="element-label">
        <label class="element" id=${id}>${title}</label>
        <button class="delete-element">${message}</button>
    </div>`;
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
                    if(user.admin){
                        let admin = document.querySelector('.administrator');
                        admin.style.display = "flex";
                    }
                }
            })
            .catch( err=> {
                result.innerHTML = `<div class="error"> ${err.message}</div>`;
            });
    }
}

function fetchChangeUser(username,password){
    url = '/user';
    if(!password){
        password = user.password
    }
    if(!username){
        username = user.username
    }
    data = {
        id: user._id,
        username: username,
        password: password,
        admin: user.admin
    };
    
    settings = {
        method: 'PATCH',
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
            result.style.opacity = 1;
        });
}

function fetchAllAchi(place){
    let url = "/achievements";
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
            place.innerHTML = "";
            if(responseJSON[0]){
                for(let i=0; i<responseJSON.length; i++){
                    addElement(place,responseJSON[i]._id,`${responseJSON[i].type}:${responseJSON[i].about}`,'Delete');
                }
            } else {
                place.innerHTML = '<div class="element-label">No content found</div>';
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllSeenList(place){
    let url = `/seen?userId=${user._id}`;
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
            place.innerHTML = "";
            if(responseJSON[0]){
                let cant = responseJSON[0].list.length;
                if(cant==0){
                    place.innerHTML = '<div class="element-label">No content found</div>';
                } else {
                    for(let i=0; i<cant; i++){
                        addElement(place,responseJSON[0].list[i].tvId,responseJSON[0].list[i].title,'Delete');
                    }
                }
                
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllWantList(place){
    let url = `/want?userId=${user._id}`;
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
            place.innerHTML = "";
            if(responseJSON[0]){
                let cant = responseJSON[0].list.length;
                if(cant==0){
                    place.innerHTML = '<div class="element-label">No archivements found</div>';
                } else {
                    for(let i=0; i<cant; i++){
                        addElement(place,responseJSON[0].list[i].tvId,responseJSON[0].list[i].title,'Delete');
                    }
                }
                
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllQuotes(place){
    let url = `/quotes?by=${user.username}`;
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
            place.innerHTML = "";
            if(responseJSON[0]){
                for(let i=0; i<responseJSON.length; i++){
                    addElement(place,responseJSON[i]._id,responseJSON[i].quote,'Delete');
                }
            } else {
                place.innerHTML = '<div class="element-label">No quotes found</div>';
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllComments(place){
    let url = `/comment?by=${user.username}`;
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
            place.innerHTML = "";
            if(responseJSON[0]){
                for(let i=0; i<responseJSON.length; i++){
                    addElement(place,responseJSON[i]._id,responseJSON[i].comment,'Delete');
                }
            } else {
                place.innerHTML = '<div class="element-label">No comments found</div>';
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchQuote(place,status){
    let url = `/quote?status=${status}`;
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
            place.innerHTML = "";
            if(responseJSON[0]){
                for(let i=0; i<responseJSON.length; i++){
                    addElement(place,responseJSON[i]._id,responseJSON[i].quote,'Approve');
                }
            } else {
                place.innerHTML = '<div class="element-label">No quotes found</div>';
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchUsers(place,admin){
    let url = `/user?admin=${admin}`;
    if(admin==undefined){
        url = '/users';
    }
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
            place.innerHTML = "";
            if(responseJSON[0]){
                for(let i=0; i<responseJSON.length; i++){
                    addElement(place,responseJSON[i]._id,responseJSON[i].username,'Delete');
                }
            } else {
                place.innerHTML = '<div class="element-label">No users found</div>';
            }
        })
        .catch( err=> {
            result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchCreateTV(title,type,description,image){
    let url = '/tv';
    let data = {
        title: title,
        type: type,
        description: description,
        image: image
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
            //result.innerHTML = `${err.message}`;
        });
}

function fetchChangeQuote(id){
    let url = '/tv';
    let data = {
        title: title,
        type: type,
        description: description,
        image: image
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
            //result.innerHTML = `${err.message}`;
        });
}

function fetchDeleteById(page,id){
    let url = `/${page}/${id}`;
    let settings = {
        method: 'DELETE'
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

function watchBtn(){
    let userid = urlParams.get('id');
    let btn = document.querySelector( '.acount' );

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(user){
            location.href=`acount.html?id=${userid}`;
        }
        else{
            location.href='login.html';
        }
    });

    btn = document.querySelector( '.quotePage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(user){
            location.href=`quotes.html?id=${userid}`;
        }
        else{
            location.href='quotes.html';
        }
    });

    btn = document.querySelector( '.serialPage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(user){
            location.href=`serial.html?id=${userid}`;
        }
        else{
            location.href='serial.html';
        }
    });

    btn = document.querySelector( '.indexPage');

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(user){
            location.href=`index.html?id=${userid}`;
        }
        else{
            location.href='index.html';
        }
    });

    btn = document.querySelector('#create-save');
    let createForm = document.querySelector('.create-tv');

    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        let title = createForm.querySelector('#create-title').value;
        let type = createForm.querySelector('#create-type').value;
        let description = createForm.querySelector('#create-description').value;
        let image = createForm.querySelector('#create-image').value;

        fetchCreateTV(title,type,description,image);
    });

    btn = document.querySelector('#create-cancel');
    
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        createForm.querySelector('#create-title').value = "";
        createForm.querySelector('#create-type').value = "";
        createForm.querySelector('#create-description').value = "";
        createForm.querySelector('#create-image').value = "";
    });
}

function loadingPage(){
    let view = document.getElementsByClassName('subtitle');
    for(let i=0; i<view.length; i++){
        view[i].addEventListener('click',(event)=>{
            event.preventDefault();
            let div = event.target.parentNode.querySelector('div');
            if(div.id == "hide"){
                div.id = "show";
                if(div.className == "delete-acount"){
                    div.style.display = "block";
                }
                else if(div.parentNode.parentNode.parentNode.className == "administrator"){
                    div.style.display = "block";
                }

                if(div.className == "new-username"){
                    div.querySelector('input').value = "";
                    let hide = document.querySelector('.new-password');
                    if(hide.id == "show"){
                        hide.id = "hide";
                    }
                }
                else if(div.className == "new-password"){
                    div.querySelector('input').value = "";
                    let hide = document.querySelector('.new-username');
                    if(hide.id == "show"){
                        hide.id = "hide";
                    }
                }
                else if(div.className == "seen-list"){
                    fetchAllSeenList(div);
                }
                else if(div.className == "want-list"){
                    fetchAllWantList(div);
                }
                else if(div.className == "my-quotes"){
                    fetchAllQuotes(div);
                }
                else if(div.className == "my-comments"){
                    fetchAllComments(div);
                }
                else if(div.className == "achi-list"){
                    fetchAllAchi(div);
                }
                else if(div.className == "my-information"){
                    document.querySelector('.user-username').innerHTML = user.username;
                }
                else if(div.className == "quotes-type"){
                    fetchQuote(div,"To be approved");
                }
                else if(div.className == "users-list"){
                    fetchUsers(div,false);
                }
                else if(div.className == "administrator-list"){
                    fetchUsers(div,true);
                }
                
            } else{
                div.id = "hide";
                if(div.parentNode.parentNode.parentNode.className == "administrator"){
                    div.style.display = "none";
                }
            }
        })
    }

    view = document.querySelector('#user-edit');

    view.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let username,password;
        if(document.querySelector('.new-username').id == "show"){
            username = document.querySelector('#new-username').value;
        } else if(document.querySelector('.new-password').id == "show"){
            password = document.querySelector('#new-password').value;
        }
        fetchChangeUser(username,password);
    });

    view = document.querySelector('#user-cancel');

    view.addEventListener( 'click', (event)=>{
        event.preventDefault();
        document.querySelector('#new-username').value = "";
        document.querySelector('.new-username').id = "hide";
        document.querySelector('.new-password').id == "hide";
        document.querySelector('#new-password').value = "";
    });
}

function watchFutureBtns(){
    let section = document.querySelector('.results');

    section.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(event.target.className == "delete-element"){
            let id = event.target.parentNode.querySelector('.element').id;
            if(event.target.parentNode.parentNode.className == "achi-list"){
                fetchDeleteById('achievement',id);
            }
            else if(event.target.parentNode.parentNode.className == "my-comments"){
                fetchDeleteById('comment',id);
            }
            else if(event.target.parentNode.parentNode.className == "quotes-type"){
                fetchApproveQuote(id);
            }
        }
    });
}

function init(){
    fetchUser();
 
    watchBtn();
    loadingPage();
    watchFutureBtns();
}

init();