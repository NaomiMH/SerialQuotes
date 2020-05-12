const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const uuid = require( 'uuid' );
const app = express();
const jsonParser = bodyParser.json();
//const validateAPIKEY = require( './middleware/validateAPIKEY' );
const {Users,TV,Quotes,Comments} = require( "./model.js" );
//const {Bookmarks} = require( "./bookmarksModel.js" );
const mongoose = require( "mongoose" );
const cors = require( './middleware/cors' );
//const {DATABASE_URL, PORT} = require('./config');
const PORT = 8080;
const DATABASE_URL = 'mongodb://localhost/bookmarksdb';

app.use( cors );
app.use( express.static( "public" ) );
//app.use( validateAPIKEY ); 
app.use( morgan( 'dev' ));

app.get( '/users', (req,res)=>{
    console.log( "Getting all users" );
    Users.getAllUsers().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tv', (req,res)=>{
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

/*
app.get( '/bookmarks', (req,res)=>{
    console.log( "Getting all bookmarks" );
    Bookmarks.getAllBookmarks().then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});
*/

app.get( '/user/:id', (req,res)=>{
    console.log("Getting user by id");
    let id = req.params.id;
    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }
    Users.getUserById(id).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'user' with that 'id'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/user/:username', (req,res)=>{
    console.log("Getting user by username");
    let username = req.params.username;
    if ( !username ){
        res.statusMessage = "Please send the 'username' as parameter.";
        return res.status(406).end();
    }
    Users.getUserByName(username).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'user' with that 'username'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tv/:id', (req,res)=>{
    console.log("Getting tv by id");
    let id = req.params.id;
    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }
    TV.getTVById(id).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'tv' with that 'id'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tv/:title', (req,res)=>{
    console.log("Getting tv by title");
    let title = req.params.title;
    if ( !title ){
        res.statusMessage = "Please send the 'title' as parameter.";
        return res.status(406).end();
    }
    TV.getTVByTitle(title).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'tv' with that 'title'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tv/:type', (req,res)=>{
    console.log("Getting tv by type");
    let type = req.params.type;
    if ( !type ){
        res.statusMessage = "Please send the 'type' as parameter.";
        return res.status(406).end();
    }
    TV.getTVByType(type).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'tv' with that 'type'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/tv/:status', (req,res)=>{
    console.log("Getting tv by status");
    let status = req.params.status;
    if ( !status ){
        res.statusMessage = "Please send the 'status' as parameter.";
        return res.status(406).end();
    }
    TV.getTVByStatus(status).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'tv' with that 'status'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote/:id', (req,res)=>{
    console.log("Getting quote by id");
    let id = req.params.id;
    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }
    Quotes.getQuoteById(id).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'quote' with that 'id'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote/:from', (req,res)=>{
    console.log("Getting quote by from");
    let from = req.params.from;
    if ( !from ){
        res.statusMessage = "Please send the 'from' as parameter.";
        return res.status(406).end();
    }
    Quotes.getQuoteByFrom(from).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'quote' with that 'from'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote/:by', (req,res)=>{
    console.log("Getting quote by by");
    let by = req.params.by;
    if ( !by ){
        res.statusMessage = "Please send the 'by' as parameter.";
        return res.status(406).end();
    }
    Quotes.getQuoteByBy(by).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'quote' with that 'by'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote/:date', (req,res)=>{
    console.log("Getting quote by date");
    let date = req.params.date;
    if ( !date ){
        res.statusMessage = "Please send the 'date' as parameter.";
        return res.status(406).end();
    }
    Quotes.getQuoteByDate(date).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'quote' with that 'date'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/quote/:status', (req,res)=>{
    console.log("Getting quote by status");
    let status = req.params.status;
    if ( !status ){
        res.statusMessage = "Please send the 'status' as parameter.";
        return res.status(406).end();
    }
    Quotes.getQuoteByStatus(status).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'quote' with that 'status'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comment/:id', (req,res)=>{
    console.log("Getting comment by id");
    let id = req.params.id;
    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }
    Comments.getCommentById(id).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'comment' with that 'id'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comment/:from', (req,res)=>{
    console.log("Getting comment by from");
    let from = req.params.from;
    if ( !from ){
        res.statusMessage = "Please send the 'from' as parameter.";
        return res.status(406).end();
    }
    Comments.getCommentByFrom(from).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'comment' with that 'from'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comment/:by', (req,res)=>{
    console.log("Getting comment by by");
    let by = req.params.by;
    if ( !by ){
        res.statusMessage = "Please send the 'by' as parameter.";
        return res.status(406).end();
    }
    Comments.getCommentByBy(by).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'comment' with that 'by'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.get( '/comment/:date', (req,res)=>{
    console.log("Getting comment by date");
    let date = req.params.date;
    if ( !date ){
        res.statusMessage = "Please send the 'date' as parameter.";
        return res.status(406).end();
    }
    Comments.getCommentByDate(date).then( result => {
        // Comprobar si pasa un listado o es solo un documento ya que se busca por un id unico
        if( !result[0] ){
            res.statusMessage = "Theres no 'comment' with that 'date'.";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

/*
app.get( '/bookmark', (req,res)=>{
    console.log("Getting bookmark by title");
    console.log(req.query);
    let title = req.query.title;
    if ( !title ){
        res.statusMessage = "Please send the 'title' as parameter.";
        return res.status(406).end();
    }
    Bookmarks.getBookmarks(title).then( result => {
        if( !result[0] ){
            res.statusMessage = "The title doesnt exist. ";
            return res.status( 404 ).end();
        }
        return res.status( 200 ).json( result );
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});
*/

app.post( '/users', jsonParser, (req,res)=>{
    console.log( "Adding a new user to the list");

    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;

    if ( !username || !password || !admin ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let newUser = { username, password, admin};
    Users.createUser(newUser).then( result => {return res.status(201).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/tv', jsonParser, (req,res)=>{
    console.log( "Adding a new tv to the list");

    let title = req.body.title;
    let type = req.body.type;
    let description = req.body.description;
    let image = req.body.image;
    let status = req.body.status;

    if ( !title || !type || !description || !image || !status ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let newTV = { title, type, description, image, status};
    TV.createTV(newTV).then( result => {return res.status(201).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/quote', jsonParser, (req,res)=>{
    console.log( "Adding a new quote to the list");

    let quote = req.body.quote;
    let from = req.body.from;
    let by = req.body.by;
    let date = req.body.date;
    let status = req.body.status;

    if ( !quote || !from || !by || !date || !status ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let newQuote = { quote, from, by, date, status};
    Quotes.createQuote(newQuote).then( result => {return res.status(201).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.post( '/comment', jsonParser, (req,res)=>{
    console.log( "Adding a new comment to the list");

    let comment = req.body.comment;
    let from = req.body.from;
    let by = req.body.by;
    let date = req.body.date;

    if ( !quote || !from || !by || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let newComment = { comment, from, by, date};
    Comments.createComment(newComment).then( result => {return res.status(201).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

/*
app.post( '/bookmarks', jsonParser, (req,res)=>{
    console.log( "Adding a new bookmark to the list");
    console.log(req.body);

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    if ( !title || !description || !url || !rating ){
        res.statusMessage = "One of these parameters is missing: 'title' 'description' 'url' 'rating'";
        return res.status(406).end();
    }

    let id = uuid.v4();
    let newBookmark = { id, title, description, url, rating};
    Bookmarks.createBookmark(newBookmark).then( result => {return res.status(201).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});
*/

app.delete( '/user/:id', (req, res)=>{
    console.log( "Removing a user by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Users.deleteUserById(id).then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/user/:username', (req, res)=>{
    console.log( "Removing a user by username");
    
    let username = req.params.username;

    if ( !username ){
        res.statusMessage = "Please send the 'username' as parameter.";
        return res.status(406).end();
    }

    Users.deleteUserByName(username).then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/tv/:id', (req, res)=>{
    console.log( "Removing a tv by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    TV.deleteTVById(id).then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/quote/:id', (req, res)=>{
    console.log( "Removing a quote by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Quotes.deleteQuoteById(id).then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

app.delete( '/comment/:id', (req, res)=>{
    console.log( "Removing a comment by id");
    
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Comments.deleteCommentById(id).then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});

/*
app.delete( '/bookmark/:id', (req, res)=>{
    console.log( "Removing a bookmark");
    console.log(req.params);
    let id = req.params.id;

    if ( !id ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    Bookmarks.deleteBookmark(id).then( result => {return res.status(200).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
});
*/

app.patch( '/user/:id', jsonParser, (req, res)=>{
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
    Users.editUserById(id, user).then( result => {return res.status(202).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

app.patch( '/user/:username', jsonParser, (req, res)=>{
    console.log( "Updating a user by username");

    let id = req.body.id;
    let username = req.body.username;
    let password = req.body.password;
    let admin = req.body.admin;

    if ( !id || !username || !password || !admin ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let user = {username, password, admin};
    Users.editUserByName(username, user).then( result => {return res.status(202).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

app.patch( '/tv/:id', jsonParser, (req, res)=>{
    console.log( "Updating a tv by id");

    let id = req.body.id;
    let title = req.body.title;
    let type = req.body.type;
    let description = req.body.description;
    let image = req.body.image;
    let status = req.body.status;

    if ( !id || !title || !type || !description || !image || !status ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let tv = {title, type, description, image, status};
    TV.editTVById(id, tv).then( result => {return res.status(202).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

app.patch( '/quote/:id', jsonParser, (req, res)=>{
    console.log( "Updating a quote by id");

    let id = req.body.id;
    let quote = req.body.quote;
    let from = req.body.from;
    let by = req.body.by;
    let date = req.body.date;
    let status = req.body.status;

    if ( !id || !quote || !from || !by || !date || !status ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let quote2 = {quote, from, by, date, status};
    Quotes.editQuoteById(id, quote2).then( result => {return res.status(202).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

app.patch( '/comment/:id', jsonParser, (req, res)=>{
    console.log( "Updating a comment by id");

    let id = req.body.id;
    let comment = req.body.comment;
    let from = req.body.from;
    let by = req.body.by;
    let date = req.body.date;

    if ( !id || !comment || !from || !by || !date ){
        res.statusMessage = "One of the parameters is missing.";
        return res.status(406).end();
    }

    let comment2 = {comment, from, by, date};
    Comments.editCommentById(id, comment2).then( result => {return res.status(202).json( result );}).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();}); 
});

/*
app.patch( '/bookmark/:id', jsonParser, (req, res)=>{
    console.log( "Updating a bookmark");
    console.log(req.body);
    console.log(req.params);

    let idB = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let rating = req.body.rating;

    let id = req.params.id;

    if ( !idB ){
        res.statusMessage = "Please send the 'id' as parameter.";
        return res.status(406).end();
    }

    if(idB != id){
        res.statusMessage = "Both 'id's need to match.";
        return res.status(409).end();
    }

    let newBookmark = {title,description,url,rating};
    console.log(newBookmark);

    Bookmarks.getBookmark(id).then( result => {
        if(result.errmsg ){
            res.statusMessage = "The id doesnt exist. ";
            return res.status( 404 ).end();
        }
        console.log(result);
        console.log("despues");
        if( !title )
            title = result[0].title;
        if( !description )
            description = result[0].description;
        if( !url )
            url = result[0].url;
        if( !rating )
            rating = result[0].rating;
        console.log(result);
        Bookmarks.editBookmark(id,title,description,url,rating).then( result2 => {
            if(result2.errmsg ){
                res.statusMessage = "The bookmark wasnt updated. ";
                return res.status( 404 ).end();
            }
            return res.status(202).json( result2 );
        }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    }).catch( err => {res.statusMessage = "Something went wrong with the Database";return res.status(500).end();});
    
});
*/

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