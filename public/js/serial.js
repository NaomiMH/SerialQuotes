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
}

function addInfoTv(place,object){
    let temp = 
        `<div class="show-tv" id="${object._id}">`;
    if(user){
        if(user.admin){
            temp +=
                `<div class="admin-menu">
                    <button id="delete-TV">Delete All</button>
                    <button id="edit-TV">Edit</button>
                </div>`;
        }
    }
    temp +=
            `<label class="show-title">${object.title}</label>
            <div>
                <label class="show-type">${object.type}</label>`;
    if(user){
        if(!watch.find( tv => tv.tvId === object._id)){
            if(!wish.find( tv => tv.tvId === object._id)){
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
                    <img class="show-img" alt="image" src="${object.image}">
                </div>
                <labe class="show-description">${object.description}</label>
            </div>
        </div>`;
    place.innerHTML = temp + place.innerHTML;
}

function addQuote(place,arrey){
    for (let i=arrey.length-1; i>=0; i--){
        let temp =
        `<div class="quote-comment">
            <div class="quote" id="${arrey[i]._id}">`;
        if(user){
            if(user.admin || user.username == arrey[i].by){
                temp += 
                    `<div class="admin-menu">
                        <button id="delete-Quote">Delete All</button>
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
                        <option`;
                if(arrey[i].status == "To be approved"){
                    temp += ` selected`;
                }
                    temp += `>To be approved</option>
                        <option`;
                if(arrey[i].status == "Approved"){
                    temp += ` selected`;
                }
                    temp += `>Approved</option>
                    </select>`;
            }
        }
        temp +=
                    `<button class="quote-edit-cancel">Cancel</button>
                    <button class="quote-edit-save">Save</button>
                </div>
                <label>By: </label>
                <label class="quote-by">${arrey[i].by}</label>
                <label class="quote-date">${new Date(arrey[i].date).toLocaleDateString('en-US',{day:'numeric',month:'short',year: 'numeric'})}</label>
            </div>
            <section class="comments-results ${arrey[i]._id}">
            </section>`;
        if(user){
            temp +=
                `<div class="new-comment">
                    <label>Add a new comment:</label>
                    <input type="text" class="new-comment-input">
                    <button class="add-comment-btn">Add</button>
                </div>`;
        }
        temp +=`</div>`;

        place.innerHTML += temp;
        fetchComment(arrey[i]._id);
    }
}

function addComment(place,arrey){
    for (let i=0; i<arrey.length; i++){
        let temp = 
            `<div class="comment" id="${arrey[i]._id}">`;
        if(user){
            if(user.admin || user.username == arrey[i].by){
                temp +=
                `<div class="admin-menu">
                    <button id="delete-Comment">Delete</button>
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

function fetchUser(){
    let userid = urlParams.get('id');
    let tvShow = urlParams.get('show');
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
                    let createbtn = document.querySelector('#serial-create');
                    if(user.admin){
                        createbtn.style.display = "block";
                    }
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
                                            if(tvShow){
                                                fetchTV(undefined,undefined,tvShow);
                                                watchFutereBtns();
                                            }
                                            else {
                                                fetchAllTV();
                                            }
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
            })
            .catch( err=> {
                result.innerHTML = `<div class="error"> ${err.message}</div>`;
            });
    } else{
        if(tvShow){
            fetchTV(undefined,undefined,tvShow);
            watchFutereBtns();
        } else {
            fetchAllTV();
        }
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
            if(responseJSON[0]){
                result.innerHTML = "";
                addTV(result,responseJSON);
                watchSerialResults();
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchTV(type,title,titleId){
    let url = `/tv?`;
    if(type){
        url+=`type=${type}`;
        if(title || titleId){
            url+= `&`;
        }
    }
    if(title){
        url+=`title=${title}`;
        if(titleId){
            url +='&';
        }
    }
    if(titleId){
        url+= `id=${titleId}`;
    }
    let settings = {
        method: 'GET'
    };
    
    let resultTitle = document.querySelector( '.serial-results' );
    let resultId = document.querySelector( '.show' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            //throw new Error( response.statusText );
        })
        .then( responseJSON => {
            resultTitle.innerHTML = "";
            if(responseJSON){
                if(title || type){
                    addTV(resultTitle,responseJSON);
                    watchSerialResults();
                }
                if(titleId){
                    addInfoTv(resultId,responseJSON[0]);
                    fetchQuote(titleId);
                }
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchQuote(titleId){
    let url = `/quote?fromId=${titleId}`;
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.quotes-results');
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            //throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                result.innerHTML = "";
                addQuote(result,responseJSON);
            }
        })
        .catch( err=> {
            //result.innerHTML = `<label class="error">${err.message}</label>`;
        });
}

function fetchComment(quoteID){
    let url = `/comment?fromId=${quoteID}`;
    let settings = {
        method: 'GET'
    };
    
    let place = document.getElementsByClassName( `${quoteID}`);
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            //throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                addComment(place[0],responseJSON);
            }
        })
        .catch( err=> {
            //do nothing
        });
}

function fetchAddQuote(quote){
    let title = document.querySelector( '.show-title').innerHTML;
    let titleId = urlParams.get('show');
    let type = document.querySelector ( '.show-type').innerHTML;
    let username = user.username;

    let url = '/quote';
    let data = {
        quote: quote,
        from: title,
        fromId: titleId,
        type: type,
        by: username,
        date: Date()
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

function fetchAddComment(comment,quoteId){
    let username = user.username;

    let url = '/comment';
    let data = {
        comment: comment,
        fromId: quoteId,
        by: username,
        date: Date()
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

function fetchEditTV(id, title, type, description,image){
    let url = '/tv';
    let data = {
        id: id,
        title: title,
        type: type,
        description: description,
        image: image
    };
    
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

function fetchEditQuote(id,quote,from,fromId,type,username,date,status){
    let url = '/quote';
    let data = {
        id: id,
        quote: quote,
        from: from,
        fromId: fromId,
        type: type,
        by: username,
        date: date,
        status: status
    };
    
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

function fetchEditComment(id,comment,fromId,by,date){
    let url = '/comment';
    let data = {
        id: id,
        comment: comment,
        fromId: fromId,
        by: by,
        date: date
    };
    
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

function fetchDeleteCommentById(id){
    let url = `/comment/${id}`;
    
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
            //result.innerHTML = `${err.message}`;
        });
}

function fetchDeleteQuoteById(id){
    let url = `/quote/${id}`;
    
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
            //result.innerHTML = `${err.message}`;
        });
}

function fetchDeleteTVById(id){
    let url = `/tv/${id}`;
    
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
        })
        .catch( err=> {
            //result.innerHTML = `${err.message}`;
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
            } else if(radioBtn[2].checked){
                fetchTV("Serie",search);
            } else {
                fetchTV(undefined,search);
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
        } else if(radioBtn[1].checked){
            fetchTV("Movie");
        } else if(radioBtn[2].checked){
            fetchTV("Serie");
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


function watchFutereBtns(){
    let userid = urlParams.get('id');
    let showId = urlParams.get('show');

    if(user){
        if(watch.find( tv => tv.tvId === showId)){
            let btnAddQuote = document.querySelector( '#adding-quote');
            btnAddQuote.style.opacity = 1;
        }
    }

    let area = document.querySelector( '.show' );
    area.addEventListener( 'click', (event)=>{
        event.preventDefault();
        if(event.target.id == "edit-TV"){
            let tv = document.querySelector('.show-tv');
            let editTv = document.querySelector('.edit-tv');
            tv.style.display = "none";
            editTv.style.display = "flex";

            editTv.id = tv.id;
            editTv.querySelector('#edit-title').value = tv.querySelector('.show-title').innerHTML;
            editTv.querySelector('#edit-type').value = tv.querySelector('.show-type').innerHTML;
            editTv.querySelector('#edit-description').value = tv.querySelector('.show-description').innerHTML;
            editTv.querySelector('#edit-image').value = tv.querySelector('.show-img').src;
        }
        else if(event.target.id == "edit-cancel"){
            let tv = document.querySelector('.show-tv');
            let editTv = document.querySelector('.edit-tv');
            tv.style.display = "flex";
            editTv.style.display = "none";
        }
        else if(event.target.id == "edit-save"){
            let id = document.querySelector('.edit-tv').id;
            let title = document.querySelector('#edit-title').value;
            let type = document.querySelector('#edit-type').value;
            let description = document.querySelector('#edit-description').value;
            let image = document.querySelector('#edit-image').value;

            fetchEditTV(id,title,type,description,image);
        }
        else if(event.target.id == "delete-TV"){
            let tv = event.target.parentNode.parentNode.id;
            fetchDeleteTVById(tv);
            if(user){
                location.href=`index.html?id=${userid}`;
            }
            else{
                location.href='index.html';
            }
        }
        else if(event.target.id == "adding-quote"){
            let addForm = document.querySelector( '.new-quote');
            addForm.style.display = "block";
            document.querySelector( '#new-quote').value = "";
        }
        else if( event.target.id == "edit-Quote"){
            let quote = event.target.parentNode.parentNode.querySelector('.quote-quote-label');
            let edit = event.target.parentNode.parentNode.querySelector('.quote-edit-label');
            quote.style.display = "none";
            edit.style.display = "flex";
            edit.querySelector('.quote-edit').value = quote.querySelector('.quote-quote').innerHTML;
        }
        else if( event.target.className == "quote-edit-cancel"){
            let quote = event.target.parentNode.parentNode.querySelector('.quote-quote-label');
            let edit = event.target.parentNode.parentNode.querySelector('.quote-edit-label');
            quote.style.display = "flex";
            edit.style.display = "none";
        }
        else if( event.target.className == "quote-edit-save"){
            let origin = event.target.parentNode.parentNode.querySelector('.quote-quote-label');
            let edit = event.target.parentNode.parentNode.querySelector('.quote-edit-label');
            origin.style.display = "flex";
            edit.style.display = "none";
            let quote = edit.querySelector('.quote-edit').value;
            let id = origin.parentNode.id;
            let username = origin.parentNode.querySelector('.quote-by').innerHTML;
            let date = origin.parentNode.querySelector('.quote-date').innerHTML;
            let from = document.querySelector('.show-title').innerHTML;
            let fromId = document.querySelector('.show-tv').id;
            let type = document.querySelector('.show-type').innerHTML;
            let status = undefined;
            if(edit.querySelector('.quote-type')){
                status = edit.querySelector('.quote-type').value
            }
            fetchEditQuote(id,quote,from,fromId,type,username,date,status);
        }
        else if( event.target.id == "delete-Quote"){
            let quote = event.target.parentNode.parentNode.id;
            fetchDeleteQuoteById(quote);
            fetchDeleteCommentByFromId(quote);
        }
        else if( event.target.id == "edit-Comment"){
            let origin = event.target.parentNode.parentNode.querySelector('.comment-comment-label');
            let temp = event.target.parentNode.parentNode.querySelector('.comment-edit-label');
            origin.style.display = "none";
            temp.style.display = "flex";
            temp.querySelector('.comment-edit').value = origin.querySelector('.comment-comment').innerHTML;
        }
        else if( event.target.className == "comment-edit-cancel"){
            let origin = event.target.parentNode.parentNode.querySelector('.comment-comment-label');
            let temp = event.target.parentNode.parentNode.querySelector('.comment-edit-label');
            origin.style.display = "flex";
            temp.style.display = "none";
        }
        else if( event.target.className == "comment-edit-save"){
            let origin = event.target.parentNode.parentNode.querySelector('.comment-comment-label');
            let temp = event.target.parentNode.parentNode.querySelector('.comment-edit-label');
            origin.style.display = "flex";
            temp.style.display = "none";
            let username = origin.parentNode.querySelector('.comment-by').innerHTML;
            let date = origin.parentNode.querySelector('.comment-date').innerHTML;
            let quoteId = origin.parentNode.parentNode.parentNode.querySelector('.quote').id;
            let id = origin.parentNode.id;
            let comment = temp.querySelector('.comment-edit').value;
            fetchEditComment(id,comment,quoteId,username,date);
        }
        else if( event.target.id == "delete-Comment"){
            let comment = event.target.parentNode.parentNode.id;
            fetchDeleteCommentById(comment);
        }
        else if(event.target.className == "add-comment-btn"){
            let comment = event.target.parentNode.querySelector( '.new-comment-input').value;
            let quoteId = event.target.parentNode.parentNode.querySelector( '.quote').id;
            fetchAddComment(comment,quoteId);
        }
        else if(event.target.id == 'add-quote'){
            let addForm = document.querySelector( '.new-quote');
            addForm.style.display = "none";
            let quote = document.querySelector( '#new-quote').value;
            fetchAddQuote(quote);
        }
        else if(event.target.id == 'cancel-quote'){
            let addForm = document.querySelector( '.new-quote');
            addForm.style.display = "none";
        }
        else if(event.target.id == "add-wish"){
            let title = document.querySelector('.show-title').innerHTML;
            let id = document.querySelector('.show-tv').id;
            fetchAdd('wish',id,title);
        }
        else if(event.target.id == "add-watch"){
            let title = document.querySelector('.show-title').innerHTML;
            let id = document.querySelector('.show-tv').id;
            fetchAdd('watch',id,title);
        }
        console.log(event.target.id);
    });
}

function watchCreateBtn(){
    let createBtn = document.querySelector('#serial-create');
    let createForm = document.querySelector('.create-tv');

    createBtn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        createForm.style.display = "block";
    });

    createBtn = document.querySelector('#create-save');
    createBtn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        let title = createForm.querySelector('#create-title').value;
        let type = createForm.querySelector('#create-type').value;
        let description = createForm.querySelector('#create-description').value;
        let image = createForm.querySelector('#create-image').value;

        fetchCreateTV(title,type,description,image);
    });

    createBtn = document.querySelector('#create-cancel');
    createBtn.addEventListener( 'click',(event)=>{
        event.preventDefault();
        createForm.querySelector('#create-title').value = "";
        createForm.querySelector('#create-type').value = "";
        createForm.querySelector('#create-description').value = "";
        createForm.querySelector('#create-image').value = "";
        createForm.style.display = "none";
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

function loadingPage(){
    let titleId = urlParams.get('show');
    if(titleId){
        let submenu = document.querySelector( '.serial-submenu');
        let results = document.querySelector( '.serial-results');
        let addForm = document.querySelector( '.new-quote');
        submenu.style.display = "none";
        results.style.display = "none";
        addForm.style.display = "none";
    } else{
        let show = document.querySelector( '.show' );
        show.style.display = "none";
        
        watchCreateBtn();
    }
}

function init(){
    fetchUser();
    loadingPage();
    
    watchBtn();
}

init();