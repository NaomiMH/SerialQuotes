const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const uuid = require( 'uuid' );
const app = express();
const jsonParser = bodyParser.json();
const {Users,TV,Quotes,Comments,SeenLists,WantLists,News} = require( "./model.js" );
const mongoose = require( "mongoose" );
const cors = require( './middleware/cors' );
const PORT = 8080;
const DATABASE_URL = 'mongodb://localhost/bookmarksdb';
//const {DATABASE_URL, PORT} = require('./config');

app.use( cors );
app.use( express.static( "public" ) );
app.use( morgan( 'dev' ));

app.get( '/users', (req,res)=>{
    console.log( "Getting all users" );
    Users.getAllUsers().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tvs', (req,res)=>{
    console.log( "Getting all tv" );
    TV.getAllTV().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quotes', (req,res)=>{
    console.log( "Getting all quotes" );
    Quotes.getAllQuotes().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comments', (req,res)=>{
    console.log( "Getting all comments" );
    Comments.getAllComments().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/seenlists', (req,res)=>{
    console.log( "Getting all seen lists" );
    SeenLists.getAllList().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/wantlists', (req,res)=>{
    console.log( "Getting all want lists" );
    WantLists.getAllList().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/news', (req,res)=>{
    console.log( "Getting all news" );
    News.getAllNews().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/user', (req,res)=>{
    console.log("Getting user");
    let id = req.query.id;
    let username = req.query.username;
    let admin = req.query.admin;
    if ( !id && !username && admin==undefined){
        res.statusMessage = "Please send the 'id' or the 'username' or the 'admin' as parameter.";
        return res.status(406).end();
    }
    let filter = '{';
    if(id){
        filter += `"_id":"${id}"`;
        if(username || admin!=undefined){
            filter += `,`;
        }
    }
    if(username){
        filter += `"username":"${username}"`;
        if(admin!=undefined){
            filter += `,`;
        }
    }
    if(admin!=undefined){
        filter += `"admin":"${admin}"`;
    }
    filter += '}';
    filter = JSON.parse(filter);
    Users.getUserBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
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
    let filter = '{';
    if(id){
        filter += `"_id":"${id}"`;
        if(title || type){
            filter += `,`;
        }
    }
    if(title){
        filter += `"title": "${title}"`;
        if(type){
            filter += `,`;
        }
    }
    if(type){
        filter += `"type":"${type}"`;
    }
    filter += '}';
    filter = JSON.parse(filter);
    TV.getTVBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote', (req,res)=>{
    console.log("Getting quote");
    let id = req.query.id;
    let from = req.query.from;
    let fromId = req.query.fromId;
    let type = req.query.type;
    let by = req.query.by;
    let status = req.query. status;
    if ( !id && !from && !fromId && !type && !by && !status ){
        res.statusMessage = "Please send the 'id' or the 'from' or the 'fromId' or the 'type' or the 'by' or the 'status' as parameter.";
        return res.status(406).end();
    }
    let filter = '{';
    if(id){
        filter += `"_id":"${id}"`;
        if(from || fromId || type || by || status){
            filter += `,`;
        }
    }
    if(from){
        filter += `"from":"${from}"`;
        if(fromId || type || by || status){
            filter += `,`;
        }
    }
    if(fromId){
        filter += `"fromId":"${fromId}"`;
        if(type || by || status){
            filter += `,`;
        }
    }
    if(type){
        filter += `"type":"${type}"`;
        if(by || status){
            filter += `,`;
        }
    }
    if(by){
        filter += `"by":"${by}"`;
        if(status){
            filter += `,`;
        }
    }
    if(status){
        filter += `"status":"${status}"`;
    }
    filter += '}';
    filter = JSON.parse(filter);
    Quotes.getQuoteBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comment', (req,res)=>{
    console.log("Getting comment");
    let id = req.query.id;
    let fromId = req.query.fromId;
    let by = req.query.by;
    if ( !id && !fromId && !by ){
        res.statusMessage = "Please send the 'id' or the 'fromId' or the 'by' as parameter.";
        return res.status(406).end();
    }
    let filter = '{';
    if(id){
        filter += `"_id":"${id}"`;
        if( fromId || by){
            filter += `,`;
        }
    }
    if(fromId){
        filter += `"fromId":"${fromId}"`;
        if(by){
            filter += `,`;
        }
    }
    if(by){
        filter += `"by":"${by}"`;
    }
    filter += '}';
    filter = JSON.parse(filter);
    Comments.getCommentBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/seen', (req,res)=>{
    console.log("Getting Seen List");
    let id = req.query.id;
    let userId = req.query.userId;
    if ( !id && !userId ){
        res.statusMessage = "Please send the 'id' or the 'userId' as parameter.";
        return res.status(406).end();
    }
    let filter = '{';
    if(id){
        filter += `"_id":"${id}"`;
        if( userId){
            filter += `,`;
        }
    }
    if(userId){
        filter += `"userId":"${userId}"`;
    }
    filter += '}';
    filter = JSON.parse(filter);
    SeenLists.getListBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/want', (req,res)=>{
    console.log("Getting Want List");
    let id = req.query.id;
    let userId = req.query.userId;
    if ( !id && !userId ){
        res.statusMessage = "Please send the 'id' or the 'userId' as parameter.";
        return res.status(406).end();
    }
    let filter = '{';
    if(id){
        filter += `"_id":"${id}"`;
        if( userId){
            filter += `,`;
        }
    }
    if(userId){
        filter += `"userId":"${userId}"`;
    }
    filter += '}';
    filter = JSON.parse(filter);
    SeenLists.getListBy(filter).then( result => {
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/user', jsonParser, (req,res)=>{
    console.log( "Adding a new user to the list");

    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;

    if ( !username || !password ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }
    
    if(admin == undefined){
        admin = false;
    }
    
    let newUser = {username, password, admin};
    Users.createUser(newUser).then( result => {
        let userId = result._id;
        let list = [];
        let newList = {userId, list};
        SeenLists.createList(newList).then( result2 => {
            WantLists.createList(newList).then( result3 => {
                let newNews = {
                    type: "New User",
                    about: username,
                    aboutId: userId,
                    date: Date()
                }
                News.createNews(newNews).then( result4 => {
                    News.getAllNews().then( result5 => {
                        if(result5.length == 21){
                            News.deleteNewsBy({_id: result5[0]._id}).then( result6 => {
                                return res.status(201).json( result );
                            }).catch( err => {res.statusMessage = "Step 6";return res.status(500).end();});
                        }
                        return res.status(201).json( result );
                    }).catch( err => {res.statusMessage = "Step 5";return res.status(500).end();});
                }).catch( err => {res.statusMessage = "Step 4";return res.status(500).end();});
            }).catch( err => {res.statusMessage = "Step 3";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Step 2";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Step 1";return res.status(500).end();});
});

app.post( '/tv', jsonParser, (req,res)=>{
    console.log( "Adding a new tv to the list");

    let title = req.body.title;
    let type = req.body.type;
    let description = req.body.description;
    let image = req.body.image;

    if ( !title || !type || !description || !image ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let newTV = {title, type, description, image};
    console.log(newTV);
    TV.createTV(newTV).then( result => {
        console.log(result);
        let newNews = {
            type: "New Serial",
            about: title,
            aboutId: result._id,
            date: Date()
        }
        News.createNews(newNews).then( result2 => {
            News.getAllNews().then( result3 => {
                if(result3.length == 21){
                    News.deleteNewsBy({_id: result3[0]._id}).then( result4 => {
                        return res.status(201).json( result );
                    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
                }
                return res.status(201).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/quote', jsonParser, (req,res)=>{
    console.log( "Adding a new quote to the list");

    let quote = req.body.quote;
    let from = req.body.from;
    let fromId = req.body.fromId;
    let type = req.body.type;
    let by = req.body.by;
    let date = req.body.date;

    if ( !quote || !from || !fromId || !type || !by || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let status = "To be approved";

    let newQuote = {quote, from, fromId, type, by, date, status};
    Quotes.createQuote(newQuote).then( result => {
        let newNews = {
            type: "New Quote",
            about: quote,
            aboutId: result._id,
            date: Date()
        }
        News.createNews(newNews).then( result2 => {
            News.getAllNews().then( result3 => {
                if(result3.length == 21){
                    News.deleteNewsBy({_id: result3[0]._id}).then( result4 => {
                        return res.status(201).json( result );
                    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
                }
                return res.status(201).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/comment', jsonParser, (req,res)=>{
    console.log( "Adding a new comment to the list");

    let comment = req.body.comment;
    let fromId = req.body.fromId;
    let by = req.body.by;
    let date = req.body.date;

    if ( !comment || !fromId || !by || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let newComment = {comment, fromId, by, date};
    Comments.createComment(newComment).then( result => {
        let newNews = {
            type: "New Comment",
            about: comment,
            aboutId: result._id,
            date: Date()
        }
        News.createNews(newNews).then( result2 => {
            News.getAllNews().then( result3 => {
                if(result3.length == 21){
                    News.deleteNewsBy({_id: result3[0]._id}).then( result4 => {
                        return res.status(201).json( result );
                    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
                }
                return res.status(201).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/user/:id', (req, res)=>{
    console.log( "Removing a user by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    SeenLists.deleteListBy({userId: id}).then( result2 => {
        WantLists.deleteListBy({userId: id}).then( result3 => {
            Users.deleteUserById(id).then( result => {
                News.deleteNewsBy({aboutId: id}).then( result4 => {
                    return res.status(200).json( result );
                }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/tv/:id', (req, res)=>{
    console.log( "Removing a tv by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Quotes.getQuoteBy({fromId: id}).then( result2 =>{
        for(let i=0; i<result2.length; i++){
            News.deleteNewsBy({aboutId: result2[i]._id}).then( result3 => {
                return res.status(200).json( result3 );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            Comments.getCommentBy({fromId: result2[i]._id}).then( result4 => {
                for(let j=0; j<result4.length; j++){
                    News.deleteNewsBy({aboutId: result4[j]._id}).then( result5 => {
                        return res.status(200).json( result5 );
                    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
                }
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            Comments.deleteCommentsBy({fromId: result2[i]._id}).then( result6 => {
                return res.status(200).json( result6 );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    Quotes.deleteQuoteBy({fromId: id}).then( result7 =>{
        TV.deleteTVById(id).then( result => {
            News.deleteNewsBy({aboutId: id}).then( result8 =>{
                return res.status(200).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/quote/:id', (req, res)=>{
    console.log( "Removing a quote by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Comments.deleteCommentsBy({fromId: id}).then( result2 => {
        Quotes.deleteQuoteBy({_id: id}).then( result => {
            News.deleteNewsBy({aboutId: id}).then( result3 => {
                return res.status(200).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/comment/:id', (req, res)=>{
    console.log( "Removing a comment by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Comments.deleteCommentBy({_id: id}).then( result => {
        News.deleteNewsBy({aboutId: id}).then( result2 => {
            return res.status(200).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/news/:id', (req, res)=>{
    console.log( "Removing a news by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    News.deleteNewsBy({_id: id}).then( result => {
        return res.status(200).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.patch( '/user', jsonParser, (req, res)=>{
    console.log( "Updating a user by id");

    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;

    if ( !id || !username || !password || !admin ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let user = {username, password, admin};
    Users.getUserBy({_id: id}).then( result2 => {
        if(username!=result2[0].username){
            Comments.editCommentBy({by: result2[0].username},{by:username}).then( result3 => {
                Quotes.editQuoteBy({by: result2[0].username},{by:username}).then( result4 => {
                    News.editNewsBy({aboutId: id},{about: username}).then( result5 => {
                        return res.status(200).json( result2 );
                    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
                }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
    Users.editUserById(id, user).then( result => {
        return res.status(202).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

app.patch( '/tv', jsonParser, (req, res)=>{
    console.log( "Updating a tv by id");

    let id = req.body.id;
    let title = req.body.title;
    let type = req.body.type;
    let description = req.body.description;
    let image = req.body.image;

    if ( !id || !title || !type || !description || !image ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let tv = {title, type, description, image};
    TV.getTVBy({_id: id}).then( result2 => {
        if(title != result2[0].title){
            Quotes.editQuoteBy({fromId: id}, {from: title}).then( result => {
                return res.status(202).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            SeenLists.editTitleByFromId(id, {title: title}).then( result => {
                return res.status(202).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            WantLists.editTitleByFromId(id, {title: title}).then( result => {
                return res.status(202).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
            News.editNewsBy({aboutId: id}, {about: title}).then( result => {
                return res.status(202).json( result );
            }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
        }
        TV.editTVById(id, tv).then( result => {
            return res.status(202).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database2";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database3";return res.status(500).end();});
});

app.patch( '/quote', jsonParser, (req, res)=>{
    console.log( "Updating a quote by id");

    let id = req.body.id;
    let quote = req.body.quote;
    let from = req.body.from;
    let fromId = req.body.fromId;
    let by = req.body.by;
    let date = req.body.date;
    let status = req.body.status;

    if ( !id || !quote || !from || !fromId || !by || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    if(!status){
        status = "To be approved";
    }

    let quote2 = {quote, from, fromId, by, date, status};
    Quotes.editQuoteBy({_id: id}, quote2).then( result => {
        News.editNewsBy({aboutId: id}, {about: quote}).then( result2 => {
            return res.status(202).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

app.patch( '/comment', jsonParser, (req, res)=>{
    console.log( "Updating a comment by id");

    let id = req.body.id;
    let comment = req.body.comment;
    let fromId = req.body.fromId;
    let by = req.body.by;
    let date = req.body.date;

    if ( !id || !comment || !fromId || !by || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let comment2 = {comment, fromId, by, date};
    Comments.editCommentBy({_id: id}, comment2).then( result => {
        News.editNewsBy({aboutId: id}, {about: comment}).then( result2 => {
            return res.status(202).json( result );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
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