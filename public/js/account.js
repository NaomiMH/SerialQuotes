const urlParams = new URLSearchParams(window.location.search);
let user;

function addElement(place,id,title,message){
    place.innerHTML += 
    `<div class="element-label">
        <label class="element" id=${id}>${title}</label>
        <button class="delete-element">${message}</button>
    </div>`;
}

function addElementUser(place,id,name,wish,watch,pass,message){
    place.innerHTML += 
    `<div class="element-label">
        <label class="element" id=${id} name="${name}" pass="${pass}">${name} Wish: ${wish} Watched: ${watch} </label>
        <button class="delete-element">${message}</button>
    </div>`;
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
                    result.innerHTML += 'Log Out';
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

function fetchChangeUser(id, username,password, admin){
    url = '/user';
    if(!password){
        password = user.password
    }
    if(!username){
        username = user.username
    }
    if(admin==undefined){
        admin = user.admin
    }
    if(!id){
        id = user._id
    }
    data = {id,username,password,admin};

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

function fetchAllNews(place){
    let url = "/news";
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
                place.innerHTML = '<div class="element-label">No archivements found</div>';
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchAllWatchedList(place){
    let url = `/watched?userId=${user._id}`;
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

function fetchAllWishList(place){
    let url = `/wish?userId=${user._id}`;
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
                place.innerHTML = '<div class="element-label">No archivements found</div>';
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
                place.innerHTML = '<div class="element-label">No archivements found</div>';
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
                place.innerHTML = '<div class="element-label">No archivements found</div>';
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
                    let id = responseJSON[i]._id;
                    let name = responseJSON[i].username;
                    let pass = responseJSON[i].password;
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
                                let wish = responseJSON[0].list.length;
                                url = `/watched?userId=${id}`;
                    
                                fetch( url, settings )
                                    .then( response => {
                                        if( response.ok ){
                                            return response.json();
                                        }
                                        throw new Error( response.statusText );
                                    })
                                    .then( responseJSON => {
                                        if(responseJSON[0]){;
                                            let watch = responseJSON[0].list.length;
                                            message = "Upgrade";
                                            if(admin){
                                                message = "Degrade";
                                            }
                                            addElementUser(place,id,name,wish,watch,pass,message);
                                        }
                                    })
                                    .catch( err=> {
                                        //result.innerHTML = `<label class="error">${err.message}</label>`;
                                    });
                            }
                        })
                        .catch( err=> {
                            //result.innerHTML = `<label class="error">${err.message}</label>`;
                        });
                }
            } else {
                place.innerHTML = '<div class="element-label">No archivements found</div>';
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
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

function fetchChangeQuote(id,status){
    let url = `/quote`;
    let data = {id,status};
    
    let settings = {
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
            if(page == 'user'){
                console.log("complete");
                location.href = 'index.html';
            } else {
                location.reload();
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchDeleteElement(page,id,title){
    let url = `/${page}`;
    let data = {
        userId: user._id,
        tvId: id,
        title: title
    };
    let settings = {
        method: 'DELETE',
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

function watchBtn(){
    let userid = urlParams.get('id');
    let btn = document.querySelector( '.account' );

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(user){
            location.href=`login.html`;
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

    btn = document.querySelector('#delete-account');
    
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        fetchDeleteById('user',user._id);
    });

    btn = document.querySelector('#delete-everything');
    
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        fetchChangeUser(user._id,user.username,user.password,false);
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
                if(div.className == "delete-account"){
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
                else if(div.className == "watched-list"){
                    fetchAllWatchedList(div);
                }
                else if(div.className == "wish-list"){
                    fetchAllWishList(div);
                }
                else if(div.className == "my-quotes"){
                    fetchAllQuotes(div);
                }
                else if(div.className == "my-comments"){
                    fetchAllComments(div);
                }
                else if(div.className == "news-list"){
                    fetchAllNews(div);
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
                else if(div.className == "delete-account"){
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
        fetchChangeUser(user._id,username,password);
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
            console.log(event.target.parentNode.parentNode.className);
            if(event.target.parentNode.parentNode.className == "news-list"){
                fetchDeleteById('news',id);
            }
            else if(event.target.parentNode.parentNode.className == "my-comments"){
                fetchDeleteById('comment',id);
            }
            else if(event.target.parentNode.parentNode.className == "quotes-type"){
                fetchChangeQuote(id,'Approved');
            }
            else if(event.target.parentNode.parentNode.className == "administrator-list"){
                let username = event.target.parentNode.querySelector('.element').getAttribute('name');
                let password = event.target.parentNode.querySelector('.element').getAttribute('pass');
                fetchChangeUser(id,username,password,false);
            }
            else if(event.target.parentNode.parentNode.className == "users-list"){
                let username = event.target.parentNode.querySelector('.element').getAttribute('name');
                let password = event.target.parentNode.querySelector('.element').getAttribute('pass');
                fetchChangeUser(id,username,password,true);
            }
            else if(event.target.parentNode.parentNode.className == "my-quotes"){
                fetchDeleteById('quote',id);
            }
            else if(event.target.parentNode.parentNode.className == "wish-list"){
                let title = event.target.parentNode.querySelector('.element').innerHTML;
                fetchDeleteElement('wish',id,title);
            }
            else if(event.target.parentNode.parentNode.className == "watched-list"){
                let title = event.target.parentNode.querySelector('.element').innerHTML;
                fetchDeleteElement('watch',id,title);
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