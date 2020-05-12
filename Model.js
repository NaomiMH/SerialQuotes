const mongoose = require( "mongoose" );

const usersCollectionSchema = mongoose.Schema({
    username: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required : true
    },
    admin: {
        type : Boolean,
        required : true
    }
});

const tvCollectionSchema = mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    type: {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    status: {
        trype : String,
        required : true
    }
});

const quotesCollectionSchema = mongoose.Schema({
    quote: {
        type : String,
        required : true
    },
    from: {
        type : String,
        required : true
    },
    by: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        required : true
    },
    status: {
        type : String,
        required : true
    }
});

const commentsCollectionSchema = mongoose.Schema({
    comment: {
        type : String,
        required : true
    },
    from: {
        type : String,
        required : true
    },
    by: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        required : true
    }
});

/*
const bookmarksCollectionSchema = mongoose.Schema({
    id : {
        type : String,
        required : true,
        unique : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
});
*/

const usersCollection = mongoose.model( "listOfUsers", usersCollectionSchema);
const tvCollection = mongoose.model( "listOfTv", tvCollectionSchema);
const quotesCollection = mongoose.model( "listOfQuotes", quotesCollectionSchema);
const commentsCollection = mongoose.model( "listOfComments", commentsCollectionSchema);

/*
const bookmarksCollection = mongoose.model( "listOfBookmarks", bookmarksCollectionSchema);
*/

const Users = {
    createUser(newUser){
        return usersCollection.create( newUser ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllUsers(){
        return usersCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getUserById(id){
        return usersCollection.find({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getUserByName(username){
        return usersCollection.find({username}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editUserById(id,user){
        return usersCollection.updateOne({_id: id},{$set: user}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editUserByName(username,user){
        return usersCollection.updateOne({username},{$set: user}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteUserById(id){
        return usersCollection.deleteOne({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteUserByName(username){
        return usersCollection.deleteOne({username}).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const TV = {
    createTV(newTv){
        return tvCollection.create( newTv ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllTV(){
        return tvCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getTVById(id){
        return tvCollection.find({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getTVByTitle(title){
        return tvCollection.find({title}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getTVByType(type){
        return tvCollection.find({type}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getTVByStatus(status){
        return tvCollection.find({status}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editTVById(id,tv){
        return tvCollection.updateOne({_id: id},{$set: tv}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteTVById(id){
        return tvCollection.deleteOne({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const Quotes = {
    createQuote(newQuote){
        return quotesCollection.create( newQuote ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllQuotes(){
        return quotesCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getQuoteById(id){
        return quotesCollection.find({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getQuoteByFrom(from){
        return quotesCollection.find({from}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getQuoteByBy(by){
        return quotesCollection.find({by}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getQuoteByDate(date){
        return quotesCollection.find({date}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getQuoteByStatus(status){
        return quotesCollection.find({status}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editQuoteById(id,quote){
        return quotesCollection.updateOne({_id: id},{$set: quote}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteQuoteById(id){
        return quotesCollection.deleteOne({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const Comments = {
    createComment(newComment){
        return commentsCollection.create( newComment ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllComments(){
        return commentsCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getCommentById(id){
        return commentsCollection.find({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getCommentByFrom(from){
        return commentsCollection.find({from}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getCommentByBy(by){
        return commentsCollection.find({by}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getCommentByDate(date){
        return commentsCollection.find({date}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getCommentByStatus(status){
        return commentsCollection.find({status}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editCommentById(id,comment){
        return commentsCollection.updateOne({_id: id},{$set: comment}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteCommentById(id){
        return commentsCollection.deleteOne({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    }
};

/*
const Bookmarks = {
    createBookmark(newBookmark){
        return bookmarksCollection.create( newBookmark ).then( createdStudent => {return createdStudent;} ).catch( err=>{return err;});
    },
    getAllBookmarks(){
        return bookmarksCollection.find().then( allBookmarks => {return allBookmarks;} ).catch( err=>{return err;});
    },
    getBookmarks(title){
        return bookmarksCollection.find({title : title}).then( findedBookmarks => {return findedBookmarks;} ).catch( err=>{return err;});
    },
    getBookmark(id){
        return bookmarksCollection.find({id : id}).then( findedBookmarks => {return findedBookmarks;} ).catch( err=>{return err;});
    },
    editBookmark(id,title,description,url,rating){
        return bookmarksCollection.updateOne({id : id},{$set: {title:title,description:description,url:url,rating:rating}}).then( newBookmark => {return newBookmark;} ).catch( err=>{return err;});
    },
    deleteBookmark(id){
        return bookmarksCollection.deleteOne({id : id}).then( deletedBookmarks => {return deletedBookmarks;} ).catch( err=>{return err;});
    }
};
*/

module.exports = (Users,TV,Quotes,Comments);

/*
module.exports = {Bookmarks};
*/