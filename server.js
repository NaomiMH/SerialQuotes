const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const mongoose = require( "mongoose" );
const bcrypt = require( 'bcryptjs' );
const jsonwebtoken = require( 'jsonwebtoken' );
const app = express();
const jsonParser = bodyParser.json();
const {Users,TV,Quotes,Comments,News} = require( "./model.js" );
const cors = require( './middleware/cors' );
//const PORT = 8080;
//const DATABASE_URL = 'mongodb://localhost/serialquotesdb';
//const SECRET_TOKEN = 'serialquotes';
const {DATABASE_URL, PORT, SECRET_TOKEN} = require('./config');

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ));

app.get( '/valid/token', (req,res) => {
    console.log("Validing the token");
    let token = req.headers.token;

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id
        }
        return Users.getUserBy({_id: userData.id}).then( result2 => {
            return Users.checkUserAdmin(userData.id).then( result3 => {
                let result = result2[0];
                userData.username = result.username;
                userData.wish = result.wish;
                userData.watch = result.watch;
                userData.like = result.like;
                userData.admin = false;
                if(result3[0]){
                    userData.admin = true;
                }
                
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( {userData,token} );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    })
})

app.post( '/user/login', jsonParser, ( req, res ) => {
    console.log("Getting token for a user");
    let username = req.body.username;
    let password = req.body.password;

    if( !username || !password ){
        res.statusMessage = "Please send the username and password.";
        return res.status(406).end();
    }

    Users.checkUser(username).then( result => {
        bcrypt.compare( password, result.password ).then( result2 => {
            if(result2){
                let userData = {
                    id: result._id,
                    username: result.username,
                    admin: result.admin,
                    wish: result.wish,
                    watch: result.watch,
                    like: result.like
                }
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }
            res.statusMessage = "Wrong credentials provieded.";
            return res.status(409).end();
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tvs', (req,res)=>{
    console.log( "Getting all tv" );
    TV.getAllTV().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quotes', (req,res)=>{
    console.log( "Getting all quotes" );
    Quotes.getAllQuotes().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/news', (req,res)=>{
    console.log( "Getting all news" );
    News.getAllNews().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/user', (req,res)=>{
    console.log("Getting user");

    let token = req.headers.token;
    let id = req.query.id;
    let username = req.query.username;
    let admin = req.query.admin;
    if ( !id && !username && admin==undefined){
        res.statusMessage = "Please send the 'id' or the 'username' or the 'admin' as parameter.";
        return res.status(406).end();
    }
    let filter = {};
    if(id){
        filter._id= id;
    }
    if(username){
        filter.username = username;
    }
    if(admin!=undefined){
        filter.admin = admin;
    }
    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(!decoded.admin){
            res.statusMessage = "Your have not the right permissions.";
            return res.status(409).end();
        }
        return Users.getUserBy(filter).then( result => {
            return res.status( 200 ).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.get( '/tv', (req,res)=>{
    console.log("Getting tv");
    let id = req.query.id;
    let title = req.query.title;
    let type = req.query.type;
    if ( !id && !title && !type ){
        res.statusMessage = "Please send the 'id' or the 'title' or the 'type' as parameter.";
        return res.status(406).end();
    }
    let filter = {};
    if(id){
        filter._id = id;
    }
    if(title){
        filter.title = {$regex: `.*${title}.*`};
    }
    if(type){
        filter.type = type;
    }
    TV.getTVBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote', (req,res)=>{
    console.log("Getting quote");
    let id = req.query.id;
    let quote = req.query.quote;
    let from = req.query.from;
    let fromId = req.query.fromId;
    let type = req.query.type;
    let by = req.query.by;
    let byId = req.query.byId;
    let status = req.query. status;
    if ( !id && !quote && !from && !fromId && !type && !by && !byId && !status ){
        res.statusMessage = "Please send the 'id' or the 'quote' or the 'from' or the 'fromId' or the 'type' or the 'by' or the 'byId' or the 'status' as parameter.";
        return res.status(406).end();
    }
    let filter = {};
    if(id){
        filter._id = id;
    }
    if(quote){
        filter.quote = {$regex: `.*${quote}.*`};
    }
    if(from){
        filter.from = {$regex: `.*${from}.*`};
    }
    if(fromId){
        filter.fromId = fromId;
    }
    if(type){
        filter.type = type;
    }
    if(by){
        filter.by = by;
    }
    if(byId){
        filter.byId = byId;
    }
    if(status){
        filter.status = status;
    } else {
        filter.status = "Approved";
    }
    Quotes.getQuoteBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/random', (req,res)=>{
    console.log( "Getting a random quote" );
    
    Quotes.getRandomQuotes().then( result => {
        return res.status(200).json(result);
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comment', (req,res)=>{
    console.log("Getting comment");
    let id = req.query.id;
    let comment = req.query.comment;
    let fromId = req.query.fromId;
    let by = req.query.by;
    let byId = req.query.byId;
    if ( !id && !comment && !fromId && !by && !byId){
        res.statusMessage = "Please send the 'id' or the 'comment' or the 'fromId' or the 'by' as parameter.";
        return res.status(406).end();
    }
    let filter = {};
    if(id){
        filter._id = id;
    }
    if(comment){
        filter.comment = {$regex: `.*${comment}.*`};
    }
    if(fromId){
        filter.fromId = fromId;
    }
    if(by){
        filter.by = by;
    }
    if(by){
        filter.byId = byId;
    }
    Comments.getCommentBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/user', jsonParser, (req,res)=>{
    console.log( "Adding a new user to the list");

    let username = req.body.username;
    let password = req.body.password;

    if ( !username || !password ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    if( password==username || username.length<5 || password.length<5 ){
        res.statusMessage = "The information inserted is invalid, check that your password and username are diferente and longer than 5 caracters.";
        return res.status(406).end();
    }

    bcrypt.hash(password,11).then( hashedPassword => {
        let newUser = {username, password: hashedPassword};
        Users.createUser(newUser).then( result => {
            let userData = {};
            userData.id = result._id;
            userData.username = result.username;
            userData.wish = result.wish;
            userData.watch = result.watch;
            userData.like = result.like;
            userData.admin = result.admin;
            
            return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                if(err){
                    res.statusMessage = err.message;
                    return res.status(409).end();
                }
                return res.status(201).json( token );
            });
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/tv', jsonParser, (req,res)=>{
    console.log( "Adding a new tv to the list");

    let token = req.headers.token;
    let title = req.body.title;
    let type = req.body.type;
    let description = req.body.description;
    let image = req.body.image;

    if ( !title || !type || !description || !image ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    if ( title=="" || (type!="Serie" && type!="Movie") || description=="" || image=="" ){
        res.statusMessage = "The information is wrong.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(!decoded.admin){
            res.statusMessage = "Your have not the right permissions.";
            return res.status(409).end();
        }
        let newTV = {title, type, description, image};
        return TV.createTV(newTV).then( result => {
            return res.status(201).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.post( '/quote', jsonParser, (req,res)=>{
    console.log( "Adding a new quote to the list");

    let token = req.headers.token;
    let quote = req.body.quote;
    let from = req.body.from;
    let fromId = req.body.fromId;
    let type = req.body.type;
    let date = req.body.date;

    if ( !quote || !from || !fromId || !type || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }
    
    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let newQuote = {quote, from, fromId, type, by: decoded.username, byId: decoded.id, date,like:0};
        console.log(newQuote);
        return Quotes.createQuote(newQuote).then( result => {
            console.log(result);
            return res.status(201).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});;
    });
});

app.post( '/comment', jsonParser, (req,res)=>{
    console.log( "Adding a new comment");

    let token = req.headers.token;
    let comment = req.body.comment;
    let fromId = req.body.fromId;
    let date = req.body.date;

    if ( !comment || !fromId || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let newComment = {comment, fromId, by: decoded.username, byId: decoded.id, date};
        return Comments.createComment(newComment).then( result => {
            return res.status(201).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.post( '/wish', jsonParser, (req,res)=>{
    console.log( "Adding a new element to the list");

    let token = req.headers.token;
    let tvId = req.body.tvId;
    let title = req.body.title;

    if ( !tvId || !title ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        return Users.addWishById(userData.id, {tvId,title}).then( result2 => {
            return Users.getUserBy({_id: userData.id}).then( result => {
                result = result[0];
                userData.wish = result.wish;
                userData.watch = result.watch;
                userData.like = result.like;
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.post( '/watch', jsonParser, (req,res)=>{
    console.log( "Adding a new element to the list");

    let token = req.headers.token;
    let tvId = req.body.tvId;
    let title = req.body.title;

    if ( !tvId || !title ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        return Users.addWatchById(userData.id, {tvId,title}).then( result2 => {
            return Users.getUserBy({_id: userData.id}).then( result => {
                result = result[0];
                userData.wish = result.wish;
                userData.watch = result.watch;
                userData.like = result.like;
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.post( '/like', jsonParser, (req,res)=>{
    console.log( "Adding a new element to the list");

    let token = req.headers.token;
    let quoteId = req.body.quoteId;
    let quote = req.body.quote;
    
    console.log(quote);
    console.log(quoteId);
    if ( !quoteId || !quote ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }
    console.log("333");

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        console.log(decoded);
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        console.log("1");
        return Users.addLikeById(userData.id, {quoteId,quote}).then( result2 => {
            console.log("2");
            console.log(result2);
            return Users.getUserBy({_id: userData.id}).then( result => {
                result = result[0];
                console.log(result);
                userData.wish = result.wish;
                userData.watch = result.watch;
                userData.like = result.like;
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/user/:id', (req, res)=>{
    console.log( "Removing a user by id");
    
    let token = req.headers.token;
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(!decoded.admin && decoded.id != id){
            res.statusMessage = "Your have not the right permissions.";
            return res.status(409).end();
        }
        return Users.deleteUserById(id).then( result => {
            return res.status(200).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/tv/:id', (req, res)=>{
    console.log( "Removing a tv by id");
    
    let token = req.headers.token;
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(!decoded.admin){
            res.statusMessage = "Your have not the right permissions.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        return TV.deleteTVById(id).then( result => {
            console.log("1111");
            console.log(result);
            return Users.getUserBy({_id: decoded.id}).then( result2 => {
                result2 = result2[0];
                userData.wish = result2.wish;
                userData.watch = result2.watch;
                userData.like = result2.like;
                console.log(userData);
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/quote/:id', (req, res)=>{
    console.log( "Removing a quote by id");
    
    let token = req.headers.token;
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        return Quotes.deleteQuoteById({_id: id}).then( result => {
            return res.status(200).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/comment/:id', (req, res)=>{
    console.log( "Removing a comment by id");
    
    let token = req.headers.token;
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        return Comments.deleteCommentById({_id: id}).then( result => {
            return res.status(200).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/news/:id', (req, res)=>{
    console.log( "Removing a news by id");
    
    let token = req.headers.token;
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(!decoded.admin){
            res.statusMessage = "Your have not the right permissions.";
            return res.status(409).end();
        }
        return News.deleteNewsBy({_id: id}).then( result => {
            return res.status(200).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/wish', jsonParser, (req,res)=>{
    console.log( "Deleteing a element from the list");

    let token = req.headers.token;
    let tvId = req.body.tvId;

    if ( !tvId ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        let newElement = {tvId};
        return Users.deleteWishById(userData.id,newElement).then( result2 => {
            return Users.getUserBy({_id: userData.id}).then( result => {
                result = result[0];
                userData.wish = result.wish;
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/watch', jsonParser, (req,res)=>{
    console.log( "Deleteing a element from the list");

    let token = req.headers.token;
    let tvId = req.body.tvId;

    if ( !tvId ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        let newElement = {tvId};
        return Users.deleteWatchById(userData.id,newElement).then( result2 => {
            return Users.getUserBy({_id: userData.id}).then( result => {
                result = result[0];
                userData.watch = result.watch;
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.delete( '/like', jsonParser, (req,res)=>{
    console.log( "Deleteing a element from the list");

    let token = req.headers.token;
    let quoteId = req.body.quoteId;

    if ( !quoteId ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        return Users.deleteLikeById(userData.id,{quoteId}).then( result2 => {
            return Users.getUserBy({_id: userData.id}).then( result => {
                result = result[0];
                userData.like = result.like;
                return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                    if(err){
                        res.statusMessage = err.message;
                        return res.status(409).end();
                    }
                    return res.status(200).json( token );
                });
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.patch( '/user', jsonParser, (req, res)=>{
    console.log( "Updating a user by id");

    let token = req.headers.token;
    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;

    if ( !id || (!username && !password && admin==undefined) ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    temp = {};
    if(username){
        temp.username = username;
    }
    if(password){
        temp.password = password;
    }
    if(admin!=undefined){
        temp.admin = admin;
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        let userData = {
            id: decoded.id,
            username: decoded.username,
            wish: decoded.wish,
            watch: decoded.watch,
            like: decoded.like,
            admin: decoded.admin
        }
        return Users.editUserById({_id: id}, temp).then( result3 => {
            if(id == decoded.id){
                return Users.getUserBy({_id: userData.id}).then( result2 => {
                    let result = result2[0];
                    userData.username = result.username;
                    if(temp.admin != undefined){
                        userData.admin = temp.admin;
                    }
                    return jsonwebtoken.sign( userData, SECRET_TOKEN, {expiresIn: '30h'}, (err, token) => {
                        if(err){
                            res.statusMessage = err.message;
                            return res.status(409).end();
                        }
                        return res.status(200).json( token );
                    });
                }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            }
            return res.status(200).json( result3 );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.patch( '/tv', jsonParser, (req, res)=>{
    console.log( "Updating a tv by id");

    let id = req.body.id;
    let title = req.body.title;
    let type = req.body.type;
    let description = req.body.description;
    let image = req.body.image;

    if ( !id || (!title && !type && !description && !image) ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let temp = {};
    if(title){
        temp.title = title;
    }
    if(type){
        temp.type = type;
    }
    if(description){
        temp.description = description;
    }
    if(image){
        temp.image = image;
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(!decoded.admin){
            res.statusMessage = "Your have not the right permissions.";
            return res.status(409).end();
        }
        return TV.editTVById(id, temp).then( result => {
            return res.status(202).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database2";return res.status(500).end();});
    });
});

app.patch( '/quote', jsonParser, (req, res)=>{
    console.log( "Updating a quote by id");

    let token = req.headers.token;
    let id = req.body.id;
    let quote = req.body.quote;
    let status = req.body.status;

    if ( !id || (!quote && !status) ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let quote2 = {};
    if(quote){
        quote2.quote = quote;
    }
    if(status){
        quote2.status = status;
    }
    console.log(quote2);
    
    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        if(quote2.status){
            if(!decoded.admin){
                res.statusMessage = "Your have not the right permissions.";
                return res.status(409).end();
            }
        }
        return Quotes.editQuoteById({_id: id}, quote2).then( result => {
            return res.status(202).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
    });
});

app.patch( '/comment', jsonParser, (req, res)=>{
    console.log( "Updating a comment by id");

    let token = req.headers.token;
    let id = req.body.id;
    let comment = req.body.comment;

    if ( !id || !comment ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    jsonwebtoken.verify( token, SECRET_TOKEN, (err,decoded)=> {
        if(err){
            res.statusMessage = "Your are not in a session.";
            return res.status(409).end();
        }
        return Comments.editCommentById({_id: id}, comment).then( result => {
            return res.status(202).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    });
});

app.listen( PORT, ()=>{
    console.log("Server is running");

    new Promise( (resolve, reject)=>{
        mongoose.connect( DATABASE_URL, {useNewUrlParser : true, useUnifiedTopology: true}, (err)=>{
            if(err)
                reject(err);
            else{
                console.log("Connected to the database succesfully")
                return resolve();
            }
        });
    }).catch( err => {
        mongoose.disconnect();
        console.log(err);
    })
});