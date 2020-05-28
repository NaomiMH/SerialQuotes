function fetchCreateUser(page,data){
    //origin index
    //user
    //new token
    let url = `/${page}`;
    
    let settings = {
        method: 'POST',
        headers: {
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
        console.log(responseJSON);
        localStorage.setItem('token',responseJSON);
        location.href = 'page.html?show=use';
    }).catch( err=> {
        let signupError = document.querySelector( '.signup-error-user' );
        signupError.innerHTML =  `<u>${err.message}</u>`;
        signupError.style.opacity = 1;
        //result.innerHTML = `<label class="error">${err.message}</label>`;
    });
}

function fetchLogIn(username,password){
    let url = `/user/login`;
    let data = {username,password};
    
    let settings = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( data )
    };
    
    let result = document.querySelector( '.login-error' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            localStorage.setItem('token',responseJSON);
            location.href= `index.html`;
        })
        .catch( err=> {
            result.style.opacity = 1;
        });
}

function watchBtns(){
    let Btn = document.querySelector( '#signup-btn' );
    
    Btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let username = document.querySelector( '#signup-username').value;
        let password = document.querySelector( '#signup-password').value;
        let signupError = document.querySelector( '.signup-error-user' );
        signupError.style.opacity = 0;
    
        fetchCreateUser('user',{username,password});
    });

    Btn = document.querySelector( '#login-btn' );
    
    Btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let username = document.querySelector( '#login-username').value;
        let password = document.querySelector( '#login-password').value;
        let loginError = document.querySelector( '.login-error' );
        loginError.style.opacity = 0;
    
        fetchLogIn(username,password);
    });

    Btn = document.querySelector( '.signup-btn' );

    Btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let signup = document.querySelector( '.signup' );
        let login = document.querySelector( '.login' );
        let loginError = document.querySelector( '.signup-error-user' );
        signup.style.display = "flex";
        login.style.display = "none";
        loginError.style.opacity = 0;
    });

    Btn = document.querySelector( '.login-btn' );
    
    Btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
        let signup = document.querySelector( '.signup' );
        let login = document.querySelector( '.login' );
        let signupError = document.querySelector( '.signup-error-user' );
        signup.style.display = "none";
        login.style.display = "flex";
        signupError.style.opacity = 0;
    });
}

function watchMoveBtn(){
    //origin index edited
    let btn = document.querySelector( '.account' );

    btn.addEventListener( 'click', (event)=>{
        event.preventDefault();
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
    watchBtns();
}

init();