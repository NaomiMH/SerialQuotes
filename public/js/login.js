function fetchCreateUser(username,password){
    let url = `/user?username=${username}`;
    
    let settings = {
        method: 'GET'
    };
    
    let result = document.querySelector( '.signup-error-user' );
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            if(responseJSON[0]){
                result.style.opacity = 1;
            }
            else{
                url = '/user';
                data = {
                    username: username,
                    password: password
                };
                
                settings = {
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
                        if(responseJSON.errmsg){
                            result.style.opacity = 1;
                        } else {
                            location.href=`index.html?id=${responseJSON._id}`;
                        }
                    })
                    .catch( err=> {
                        result.style.opacity = 1;
                    });
            }
        })
        .catch( err=> {
            result.style.opacity = 1;
        });
    
}

function fetchGetUser(username,password){
    let url = `/user?username=${username}`;
    
    let settings = {
        method: 'GET'
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
            if(responseJSON[0].password != password){
                result.style.opacity = 1;
            }
            else{
                location.href= `index.html?id=${responseJSON[0]._id}`;
            }
        })
        .catch( err=> {
            result.style.opacity = 1;
        });
}

function watchLogInBtns(){
    let Btn = document.querySelector( '#signup-btn' );
    
    Btn.addEventListener( 'click', (event)=>{
        let username = document.querySelector( '#signup-username').value;
        let password = document.querySelector( '#signup-password').value;
        let signupError = document.querySelector( '.signup-error-user' );
        signupError.style.opacity = 0;
    
        fetchCreateUser(username,password);
    });

    Btn = document.querySelector( '#login-btn' );
    
    Btn.addEventListener( 'click', (event)=>{
        let username = document.querySelector( '#login-username').value;
        let password = document.querySelector( '#login-password').value;
        let loginError = document.querySelector( '.login-error' );
        loginError.style.opacity = 0;
    
        fetchGetUser(username,password);
    });

    Btn = document.querySelector( '.signup-btn' );

    Btn.addEventListener( 'click', (event)=>{
        let signup = document.querySelector( '.signup' );
        let login = document.querySelector( '.login' );
        let loginError = document.querySelector( '.signup-error-user' );
        signup.style.display = "flex";
        login.style.display = "none";
        loginError.style.opacity = 0;
    });

    Btn = document.querySelector( '.login-btn' );
    
    Btn.addEventListener( 'click', (event)=>{
        let signup = document.querySelector( '.signup' );
        let login = document.querySelector( '.login' );
        let signupError = document.querySelector( '.signup-error-user' );
        signup.style.display = "none";
        login.style.display = "flex";
        signupError.style.opacity = 0;
    });
}

function watchBtn(){
    let btn = document.querySelector( '.account' );

    btn.addEventListener( 'click', (event)=>{
        location.href='login.html';
    });

    btn = document.querySelector( '.quotePage');

    btn.addEventListener( 'click', (event)=>{
        location.href='quotes.html';
    });

    btn = document.querySelector( '.serialPage');

    btn.addEventListener( 'click', (event)=>{
        location.href='serial.html';
    });

    btn = document.querySelector( '.indexPage');

    btn.addEventListener( 'click', (event)=>{
        location.href='index.html';
    });

    btn = document.querySelector('.mapPage');

    btn.addEventListener( 'click', (event)=>{
        if(event.target.tagName == "LI"){
            location.href = `${event.target.getAttribute('go')}.html`;
        }
    });

    btn = document.querySelector('.aboutUs');

    btn.addEventListener( 'click', (event)=>{
        if(event.target.tagName == "LI"){
            location.href = `page.html?show=${event.target.getAttribute('go')}`;
        }
    });

    btn = document.querySelector('.information');

    btn.addEventListener( 'click', (event)=>{
        if(event.target.tagName == "LI"){
            location.href = `page.html?show=${event.target.getAttribute('go')}`;
        }
    });
}

function init(){
    watchLogInBtns();
    watchBtn();
}

init();