const urlParams = new URLSearchParams(window.location.search);
let user;

function loadingPage(){
    console.log("1");
    let area;
    if(user){
        area = document.querySelector('.account');
        area.innerHTML = "My account";
    }
    let page = urlParams.get('show');
    if(page == 'use'){
        area = document.querySelector('.use');
        area.style.display = 'flex';
    } else if(page == 'api'){
        area = document.querySelector('.api');
        area.style.display = 'flex';
    } else if(page == 'contact'){
        area = document.querySelector('.contact');
        area.style.display = 'flex';
    } else if(page == 'develop'){
        area = document.querySelector('.develop-label');
        area.style.display = 'flex';
    }
    area = document.querySelector('.menu');
    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let menu = event.target.id;
        if(page != menu){
            location.href = `page.html?show=${menu}`;
        }
    });
    area = document.querySelector('#send');
    area.addEventListener('click',(event)=>{
        event.preventDefault();
        let message = document.querySelector('.response');
        let input = document.querySelectorAll('input');
        for(let i=0; i<input.length; i++){
            input[i].value="";
        }
        message.style.opacity = 1;
    })
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
        if(user){
            location.href='account.html';
        } else {
            location.href= `login.html`;
        }
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
    watchMoveBtn();
    validateToken();
}

init();