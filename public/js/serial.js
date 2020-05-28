const urlParams = new URLSearchParams(window.location.search);
let user;

function standby(id) {
    document.getElementById(id).src = 'https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg'
}

function addTV(place,arrey){
    //origin index
    if(!arrey[0]){
        place.innerHTML += 'No information available';
        redirect
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
        watchTVResults();
    }
}

function addInfoTv(place,object){
    //unique
    delay = 500;
    if(!object[0]){
        place.innerHTML = '<img id="e404" src="https://cdn.pixabay.com/photo/2018/01/04/15/51/error-3060993_960_720.png"> This webpage does not exists you will be redirected to Home. </img>';
        setTimeout(function(){
            location.href='index.html'
           },delay);
    } else {
        object = object[0];
        place.id = object._id;
        let temp = '';
        if(user){
            if(user.admin){
                temp +=
                    `<div class="admin-menu">
                        <button id="delete-TV">Delete this content</button>
                        <button id="edit-TV">Edit</button>
                    </div>`;
            }
        }
        temp +=
                `<label class="show-title">${object.title}</label>
                <div>
                    <label class="show-type">${object.type}</label>`;
        if(user){
            if(!user.watch.find( tv => tv.tvId === object._id)){
                if(!user.wish.find( tv => tv.tvId === object._id)){
                    temp += `<button class="listBtn" id="add-wish"></button>`;
                } else {
                    temp += `<button class="listBtn" id="add-watch"></button>`;
                }
            }
        }
        temp +=
                `</div>
                <div class="show-des-img">
                    <div class="image">
                        <img alt="image" id="image-${object._id}" src="${object.image}" onerror=standby("image-${object._id}")>
                    </div>
                    <labe class="show-description">${object.description}</label>
                </div>`;
        place.innerHTML = temp;
        if(user){
            watchShowBtns();
        }
    }
}

function addQuote(place,arrey){
    //unique
    //check por alguna razon no se actualiza place, pero funciona si lo vuelvo a declarar
    place = document.querySelector('.quotes-results');
    if(!arrey[0]){
        place.innerHTML = 
        `<div class="quote-comment">
            <div class="quote">
                <div class="quote-quote-label">
                    <label>"</label>
                    <label class="quote-quote">No quotes yet</label>
                    <label>"</label>
                </div>
                <label>By: </label>
                <label class="quote-by">system</label>
            </div>
        </div>`;
    } else {
        for (let i=arrey.length-1; i>=0; i--){
            let temp =
            `<div class="quote-comment">
                <div class="quote" id="${arrey[i]._id}">`;
            if(user){
                if(user.admin || user.username == arrey[i].by){
                    temp += 
                        `<div class="admin-menu">
                            <button id="delete-Quote">Delete quote</button>
                            <button id="edit-Quote">Edit</button>
                        </div>`;
                }
            }
            temp +=
                    `<div class="quote-quote-label">
                        <label>"</label>
                        <label class="quote-quote">${arrey[i].quote}</label>
                        <label>"</label>
                    </div>
                    <div class="quote-edit-label">
                        <label>"</label>
                        <input type="text" class="quote-edit">
                        <label>"</label>`;
            if(user){
                if(user.admin){
                    temp += 
                        `<select class="quote-type">
                            <option>To be approved</option>
                            <option selected>Approved</option>
                        </select>`;
                }
            }
            temp +=
                        `<button class="quote-edit-cancel">Cancel</button>
                        <button class="quote-edit-save">Save</button>
                    </div>
                    <label>By: </label>
                    <label class="quote-by">${arrey[i].by} </label>
                    <label>| Likes: ${arrey[i].like}</label>
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
                </div>
                <section class="comments-results ${arrey[i]._id}">
                </section>`;
            if(user){
                temp +=
                    `<div class="new-comment">
                        <label>Add a new comment:</label>
                        <input type="text" class="new-comment-input" placeholder="Type a comment on this quote">
                        <button class="add-comment-btn">Add</button>
                    </div>`;
            }
            temp +=`</div>`;
            place.innerHTML += temp;
            let areaComment = place.getElementsByClassName(`${arrey[i]._id}`);
            areaComment[0].innerHTML = "";
            fetchBy(`comment?fromId=${arrey[i]._id}`,areaComment[0],addComment);
        }
        watchShowResults();
    }
}

function addComment(place,arrey){
    //unique
    //check por alguna razon no se actualiza place, pero funciona si lo vuelvo a declarar
    if(arrey[0]){
        place = document.getElementsByClassName(`${arrey[0].fromId}`)[0];
        for (let i=0; i<arrey.length; i++){
            let temp = 
                `<div class="comment" id="${arrey[i]._id}">`;
            if(user){
                if(user.admin || user.username == arrey[i].by){
                    temp +=
                    `<div class="admin-menu">
                        <button id="delete-Comment">Delete comment</button>
                        <button id="edit-Comment">Edit</button>
                    </div>`;
                }
            }
            temp +=
                    `<div class="comment-comment-label">
                        <label class="comment-comment">${arrey[i].comment}</label>
                    </div>
                    <div class="comment-edit-label">
                        <input type="text" class="comment-edit">
                        <button class="comment-edit-cancel">Cancel</button>
                        <button class="comment-edit-save">Save</button>
                    </div>
                    <label>By: </label>
                    <label class="comment-by">${arrey[i].by}</label>
                    <label class="comment-date">${new Date(arrey[i].date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
                </div>`;
            place.innerHTML += temp;
        }
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
        next(place, responseJSON);
    }).catch( err=> {
        console.log(err.message);
    });
}


function fetchEdit(page,data){
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
        location.reload();
    }).catch( err=> {
        console.log(err.message);
        //result.innerHTML = `${err.message}`;
    });
}

function fetchDelete(page,id){
    //origin serial
    //news or comment or quote or user
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
        location.reload();
    }).catch( err=> {
        //result.innerHTML = `${err.message}`;
    });
}

function fetchDeleteElement(page,data){
    //origin serial
    //wish or watch or tv
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

function fetchAdd(page,data){
    //origin index
    //wish or watch
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

function watchTVResults(){
    //real name watchSerialResults
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

function watchShowBtns(){
    //similar to watchSerialResults
    let listBtn = document.querySelector('.listBtn');

    if(listBtn){
        listBtn.addEventListener( 'click', (event)=>{
            event.preventDefault();
            let id = event.currentTarget.parentNode.parentNode.id;
            let title = event.currentTarget.parentNode.parentNode.querySelector('.show-title').innerHTML;
            if(event.target.id == "add-wish"){
                fetchAdd('wish',{tvId: id,title});
            }
            else if(event.target.id == "add-watch"){
                fetchAdd('watch',{tvId: id,title});
            }
        });
    }

    let area = document.querySelector('#adding-quote');

    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let addForm = document.querySelector( '.new-quote');
        addForm.style.display = "block";
        document.querySelector('#new-quote').value = "";
    });

    area = document.querySelector('#add-quote');

    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let addForm = document.querySelector( '.new-quote');
        addForm.style.display = "none";
        let data = {
            quote: document.querySelector( '#new-quote').value,
            from: document.querySelector('.show-title').innerHTML,
            fromId: document.querySelector('.show-tv').id,
            type: document.querySelector('.show-type').innerHTML,
            date: Date()
        }
        fetchCreate('quote',data);
    });

    area = document.querySelector('#cancel-quote');

    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let addForm = document.querySelector( '.new-quote');
        addForm.style.display = "none";
    });
}

function watchShowResults(){
    //unique
    let quotesList = document.querySelectorAll('.quote-comment');
    for(let i=0; i<quotesList.length; i++){
        quotesList[i].addEventListener( 'click', (event) => {
            event.preventDefault();
            if(event.target.id == 'edit-Quote'){
                let editQuote = event.currentTarget.querySelector('.quote-edit-label');
                let displayQuote = event.currentTarget.querySelector('.quote-quote-label');
                editQuote.style.display = "flex";
                displayQuote.style.display = "none";
                editQuote.querySelector('.quote-edit').value = displayQuote.querySelector('.quote-quote').innerHTML;
            } else if(event.target.id == 'delete-Quote'){
                let id = event.target.parentNode.parentNode.id;
                fetchDelete('quote',id);
            } else if(event.target.className == 'add-comment-btn'){
                let data = {};
                let dato = event.currentTarget.querySelector('.new-comment-input').value;
                data.comment = dato;
                dato = event.currentTarget.querySelector('.quote').id;
                data.fromId = dato;
                data.date = Date();
                fetchCreate('comment',data);
            } else if(event.target.className == 'quote-edit-cancel'){
                let editQuote = event.currentTarget.querySelector('.quote-edit-label');
                let displayQuote = event.currentTarget.querySelector('.quote-quote-label');
                editQuote.style.display = "none";
                displayQuote.style.display = "flex";
                let statusQuote = event.currentTarget.querySelector('.quote-type');
                if(statusQuote){
                    statusQuote.value = "Approved";
                }
            } else if(event.target.className == 'quote-edit-save'){
                let editQuote = event.currentTarget.querySelector('.quote-edit-label');
                let displayQuote = event.currentTarget.querySelector('.quote-quote-label');
                let data = {};
                data.id = event.currentTarget.querySelector('.quote').id;
                if(editQuote.querySelector('.quote-type')){
                    if(editQuote.querySelector('.quote-type').value == "To be approved"){
                        data.status = "To be approved";
                    }
                }
                if(editQuote.querySelector('.quote-edit').value != displayQuote.querySelector('.quote-quote').innerHTML){
                    data.quote = editQuote.querySelector('.quote-edit').value;
                }
                fetchEdit('quote',data);
            } else if(event.target.id == 'edit-Comment'){
                let editComment = event.target.parentNode.parentNode.querySelector('.comment-edit-label');
                let displayComment = event.target.parentNode.parentNode.querySelector('.comment-comment-label');
                editComment.style.display = "flex";
                displayComment.style.display = "none";
                editComment.querySelector('.comment-edit').value = displayComment.querySelector('.comment-comment').innerHTML;
            } else if(event.target.id == 'delete-Comment'){
                let id = event.target.parentNode.parentNode.id;
                fetchDelete('comment',id);
            } else if(event.target.className == 'comment-edit-cancel'){
                let editComment = event.target.parentNode.parentNode.querySelector('.comment-edit-label');
                let displayComment = event.target.parentNode.parentNode.querySelector('.comment-comment-label');
                editComment.style.display = "none";
                displayComment.style.display = "flex";
            } else if(event.target.className == 'comment-edit-save'){
                let editComment = event.target.parentNode.parentNode.querySelector('.comment-edit-label');
                let displayComment = event.target.parentNode.parentNode.querySelector('.comment-comment-label');
                let data = {};
                data.id = event.target.parentNode.parentNode.id;
                if(editComment.querySelector('.comment-edit').value != displayComment.querySelector('.comment-comment').innerHTML){
                    data.comment = String(editComment.querySelector('.comment-edit').value);
                    fetchEdit('comment',data);
                }
            } else if(event.target.id == 'add-like'){
                let data = {};
                data.quoteId = event.target.parentNode.parentNode.id;
                data.quote = event.target.parentNode.parentNode.querySelector('.quote-quote').innerHTML;
                fetchAdd('like',data);
            } else if(event.target.id == 'like-add'){
                let data = {};
                data.quoteId = event.target.parentNode.parentNode.id;
                fetchDeleteElement('like',data);
            }
        });
    }
}

function watchTVBtns(){
    //real name watchSerialBtns
    //origin index
    let area = document.querySelector('.serial-results');
    let btn = document.querySelector('#serial-search');
    
    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let search = document.querySelector( '.serial-search').value;
        document.querySelector( '.serial-search').value = "";
        if( search != "" ){
            let radioBtn = document.getElementsByName('filter');
            area.innerHTML = "";
            if(radioBtn[1].checked){
                fetchBy(`tv?title=${search}&type=Movie`,area,addTV);
            } else if(radioBtn[2].checked){
                fetchBy(`tv?title=${search}&type=Series`,area,addTV);
            } else {
                fetchBy(`tv?title=${search}`,area,addTV);
            }
        }
    });

    btn = document.querySelector('.serial-filter');
    
    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
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
        area.innerHTML = "";
        if(radioBtn[0].checked){
            fetchAll('tvs',area,addTV);
        } else if(radioBtn[1].checked){
            fetchBy(`tv?type=Movie`,area,addTV);
        } else if(radioBtn[2].checked){
            fetchBy(`tv?type=Series`,area,addTV);
        }
    });
}

function watchTVAdminBtns(){
    //unique
    let area = document.querySelector('.create-tv');
    let btn = document.querySelector('#serial-create');

    btn.addEventListener('click',(event)=>{
        event.preventDefault();
        area.style.display = "block";
    });

    btn = document.querySelector('#create-save');
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        let title = area.querySelector('#create-title').value;
        let type = area.querySelector('#create-type').value;
        let description = area.querySelector('#create-description').value;
        let image = area.querySelector('#create-image').value;
        area.querySelector('#create-title').value = "";
        area.querySelector('#create-type').value = "Movie";
        area.querySelector('#create-description').value = "";
        area.querySelector('#create-image').value = "";
        area.style.display = "none";

        let data = {title,type,description,image};
        fetchCreate('tv',data);
    });

    btn = document.querySelector('#create-cancel');
    btn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        area.querySelector('#create-title').value = "";
        area.querySelector('#create-type').value = "Movie";
        area.querySelector('#create-description').value = "";
        area.querySelector('#create-image').value = "";
        area.style.display = "none";
    });
}

function watchShowAdminBtns(){
    //unique
    let area = document.querySelector('.show-tv');

    area.addEventListener('click',(event)=>{
        event.preventDefault();
        if(event.target.id == "edit-TV"){
            let tv = document.querySelector('.show-tv');
            let editTv = document.querySelector('.edit-tv');
            tv.style.display = "none";
            editTv.style.display = "flex";

            editTv.id = tv.id;
            console.log(tv);
            editTv.querySelector('#edit-title').value = tv.querySelector('.show-title').innerHTML;
            editTv.querySelector('#edit-type').value = tv.querySelector('.show-type').innerHTML;
            editTv.querySelector('#edit-description').value = tv.querySelector('.show-description').innerHTML.trim();
            editTv.querySelector('#edit-image').value = tv.querySelector('.image').src;
        } else if(event.target.id == "delete-TV"){
            let tv = event.target.parentNode.parentNode.id;
            fetchDeleteElement(`tv/${tv}`,{});
        }
    });

    area = document.querySelector('#edit-save');

    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let id = document.querySelector('.edit-tv').id;
        let title = document.querySelector('#edit-title').value;
        let type = document.querySelector('#edit-type').value;
        let description = document.querySelector('#edit-description').value;
        let image = document.querySelector('#edit-image').value;

        data = {id};
        if(title != document.querySelector('.show-title').innerHTML){
            data.title = title;
        }
        if(type != document.querySelector('.show-type').innerHTML){
            data.type = type;
        }
        if(description != document.querySelector('.show-description').innerHTML.trim()){
            data.description = description;
        }
        if(image != document.querySelector('.image').src){
            data.image = image;
        }
        fetchEdit('tv',data);
    });

    area = document.querySelector('#edit-cancel');

    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let tv = document.querySelector('.show-tv');
        let editTv = document.querySelector('.edit-tv');
        tv.style.display = "flex";
        editTv.style.display = "none";
    });
}

function loadingPage(){
    //unique
    let show = urlParams.get('show');
    let areaSerial = document.querySelector('.serial-results');
    let areaShow = document.querySelector('.show');
    let areaSubmenu = document.querySelector('.serial-submenu');
    if(user){
        area = document.querySelector('.account');
        area.innerHTML = "My account";
    }
    if(show){
        areaShow.style.display = "flex";
        areaSerial.style.display = "none";
        areaSubmenu.style.display = "none";
        let area = document.querySelector('.show-tv');
        area.innerHTML = "";
        fetchBy(`tv?id=${show}`,area,addInfoTv);
        if(user){
            if(user.admin){
                watchShowAdminBtns();
            }
            if(user.watch.find( tv => tv.tvId === show)){
                let btnAddQuote = document.querySelector( '#adding-quote');
                btnAddQuote.style.opacity = 1;
            }
        }
        let areaQuote = document.querySelector('.quotes-results');
        areaQuote.innerHTML = "";
        fetchBy(`quote?fromId=${show}`,areaQuote,addQuote);
    } else {
        areaShow.style.display = "none";
        areaSerial.style.display = "flex";
        areaSerial.innerHTML = "";
        fetchAll('tvs',areaSerial,addTV);
        if(user){
            if(user.admin){
                let btn = document.querySelector('#serial-create');
                btn.style.display = "flex";
                watchTVAdminBtns();
            }
        }
        watchTVBtns();
    }
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