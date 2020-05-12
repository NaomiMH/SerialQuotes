const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653";

function fetchAllBookmarks(){
    let url = '/bookmarks';
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    
    let result = document.querySelector( '.results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            result.innerHTML = "";
            for (let i=0; i<responseJSON.length; i++){
                result.innerHTML += 
                `<div class="bookmark" id=${responseJSON[i].id}>
                    <div class="header">
                        <label class="title">${responseJSON[i].title}</label>
                        <div>
                            <button id="update-btn">Edit</button>
                            <button id="delete-btn">Delete</button>
                        </div>
                    </div>
                    <div class="info">
                        <label class="description">${responseJSON[i].description}</label>
                        <div class="ratingDiv">
                            <label>Rating: </label><label class="rating">${responseJSON[i].rating}</label>
                        </div>
                        <a class="url" href="${responseJSON[i].url}">${responseJSON[i].url}</a>
                    </div>
                </div>`;
            }
        })
        .catch( err=> {
            console.log( err );
            result.innerHTML = `<div class="error"> ${err.message}</div>`;
        });
}

function fetchAddBookmark( title, description, urlp, rating ){
    let url = '/bookmarks';
    let data = {
        title: title,
        description: description,
        url: urlp,
        rating: rating
    };
    let settings = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    }
    
    let result = document.querySelector( '.results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            fetchAllBookmarks();
        })
        .catch( err=> {
            console.log( err );
            result.innerHTML = `<div class="error"> ${err.message}</div>`;
        });
}

function fetchGetBookmark( title ){
    let url = `/bookmark?title=${title}`;
    let settings = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    
    let result = document.querySelector( '.results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            result.innerHTML = "";
            for (let i=0; i<responseJSON.length; i++){
                result.innerHTML += 
                `<div class="bookmark" id=${responseJSON[i].id}>
                    <div class="header">
                        <label class="title">${responseJSON[i].title}</label>
                        <div>
                            <button id="update-btn">Edit</button>
                            <button id="delete-btn">Delete</button>
                        </div>
                    </div>
                    <div class="info">
                        <label class="description">${responseJSON[i].description}</label>
                        <div class="ratingDiv">
                            <label>Rating: </label><label class="rating">${responseJSON[i].rating}</label>
                        </div>
                        <a class="url" href="${responseJSON[i].url}">${responseJSON[i].url}</a>
                    </div>
                </div>`;
            }
        })
        .catch( err=> {
            console.log( err );
            result.innerHTML = `<div class="error"> ${err.message}</div>`;
        });
}

function fetchUpdateBookmark( id, title, description, urlp, rating ){
    let url = `/bookmark/${id}`;

    let data = {
        id: id,
        title: title,
        description: description,
        url: urlp,
        rating: rating
    };
    let settings = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data ),
    }
    
    let result = document.querySelector( '.results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            fetchAllBookmarks();
        })
        .catch( err=> {
            console.log( err );
            result.innerHTML = `<div class="error"> ${err.message}</div>`;
        });
}

function fetchDeleteBookmark( id, title, description, urlp, rating ){
    let url = `/bookmark/${id}`;

    let settings = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    
    let result = document.querySelector( '.results' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log(responseJSON);
            fetchAllBookmarks();
        })
        .catch( err=> {
            console.log( err );
            result.innerHTML = `<div class="error"> ${err.message}</div>`;
        });
}

function watchAddBookmarks(){
    let bookmarksForm = document.querySelector( '.add-bookmark-form' );

    bookmarksForm.addEventListener( 'submit', (event)=>{
        event.preventDefault();
        let title = document.getElementById( 'add-bookmarkTitle' ).value;
        let description = document.getElementById( 'add-bookmarkDescription' ).value;
        let url = document.getElementById( 'add-bookmarkUrl' ).value;
        let rating = document.getElementById( 'add-bookmarkRating' ).value;

        fetchAddBookmark(title, description, url, rating);
    });
}

function watchGetBookmark(){
    let bookmarksForm = document.querySelector( '.get-bookmark-form' );

    bookmarksForm.addEventListener( 'submit', (event)=>{
        event.preventDefault();
        let title = document.getElementById( 'get-bookmarkTitle' ).value;

        fetchGetBookmark(title);
    });
}

function watchUpdateBookmark(){
    let bookmarksForm = document.querySelector( '#update-submit-btn' );

    bookmarksForm.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let id = document.querySelector( '.update-bookmarkId').innerHTML;
        let title = document.getElementById( 'update-bookmarkTitle' ).value;
        let description = document.getElementById( 'update-bookmarkDescription' ).value;
        let url = document.getElementById( 'update-bookmarkUrl' ).value;
        let rating = document.getElementById( 'update-bookmarkRating' ).value;
        
        fetchUpdateBookmark(id, title, description, url, rating);

        document.getElementById( 'update-bookmarkTitle' ).value = "";
        document.getElementById( 'update-bookmarkDescription' ).value = "";
        document.getElementById( 'update-bookmarkUrl' ).value = "";
        document.getElementById( 'update-bookmarkRating' ).value = "";

        let addForm = document.querySelector( '.get-bookmark-form' );
        let updateForm = document.querySelector( '.update-bookmark-form' );
        let getForm = document.querySelector( '.add-bookmark-form' );
        let result = document.querySelector( '.results' );
        let listTitle = document.querySelector( '.listTitle' );
        updateForm.style.display = "none";
        addForm.style.display = "flex";
        getForm.style.display = "flex";
        result.style.display = "flex";
        listTitle.style.display = "flex";
    });

    let bookmarksForm2 = document.querySelector( '#update-cancel-btn' );

    bookmarksForm2.addEventListener( 'click', (event)=>{
        event.preventDefault();

        let addForm = document.querySelector( '.get-bookmark-form' );
        let getForm = document.querySelector( '.add-bookmark-form' );
        let updateForm = document.querySelector( '.update-bookmark-form' );
        let result = document.querySelector( '.results' );
        let listTitle = document.querySelector( '.listTitle' );
        updateForm.style.display = "none";
        addForm.style.display = "flex";
        getForm.style.display = "flex";
        result.style.display = "flex";
        listTitle.style.display = "flex";
    });
}

function watchList(){
    let bookmarksList = document.querySelector( '.results' );

    bookmarksList.addEventListener( 'click', (event)=>{
        event.preventDefault();

        if( event.target.matches( '#update-btn' ) ){
            console.log("update")
            let updateForm = document.querySelector( '.update-bookmark-form' );
            let addForm = document.querySelector( '.get-bookmark-form' );
            let getForm = document.querySelector( '.add-bookmark-form' );
            let result = document.querySelector( '.results' );
            let listTitle = document.querySelector( '.listTitle' );
            addForm.style.display = "none";
            getForm.style.display = "none";
            result.style.display = "none";
            listTitle.style.display = "none";
            updateForm.style.display = "flex";

            let id = event.target.parentNode.parentNode.parentNode.id;
            let title = event.target.parentNode.parentNode.querySelector('.title').innerHTML;
            let description = event.target.parentNode.parentNode.parentNode.querySelector('.description').innerHTML;
            let url = event.target.parentNode.parentNode.parentNode.querySelector('.url').innerHTML;
            let rating = event.target.parentNode.parentNode.parentNode.querySelector('.rating').innerHTML;

            document.querySelector( '.update-bookmarkId').innerHTML = id;
            document.getElementById('update-bookmarkTitle').value = title;
            document.getElementById('update-bookmarkDescription').value = description;
            document.getElementById( 'update-bookmarkUrl' ).value = url;
            document.getElementById( 'update-bookmarkRating' ).value = rating;
        }
        if( event.target.matches( '#delete-btn' ) ){
            console.log("delete");
            let id = event.target.parentNode.parentNode.parentNode.id;
            fetchDeleteBookmark(id);
        }
    });
}

function init(){
    fetchAllBookmarks();
    watchAddBookmarks();
    watchGetBookmark();
    watchUpdateBookmark();
    watchList();
}

init();