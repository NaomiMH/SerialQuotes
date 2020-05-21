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
    image: {
        type : String,
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
    fromId: {
        type : String,
        required : true
    },
    type:{
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
    fromId: {
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

const newsCollectionSchema = mongoose.Schema({
    type: {
        type : String,
        required : true
    },
    about: {
        type : String,
        required : true
    },
    aboutId: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        required : true
    }
});

const listCollectionSchema = mongoose.Schema({
    userId: {
        type : String,
        required : true
    },
    list: [{
        title: {
            type : String,
            required : true
        },
        tvId: {
            type : String,
            required : true
        }
    }]
})

const usersCollection = mongoose.model( "listOfUsers", usersCollectionSchema);
const tvCollection = mongoose.model( "listOfTv", tvCollectionSchema);
const quotesCollection = mongoose.model( "listOfQuotes", quotesCollectionSchema);
const commentsCollection = mongoose.model( "listOfComments", commentsCollectionSchema);
const watchedCollection = mongoose.model("listOfWatchedLists", listCollectionSchema);
const wishCollection = mongoose.model("listOfWishLists", listCollectionSchema);
const newsCollection = mongoose.model("listOfNews",newsCollectionSchema);

const Users = {
    createUser(newUser){
        return usersCollection.create( newUser ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllUsers(){
        return usersCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getUserBy(filter){
        return usersCollection.find(filter).then( response => {return response;} ).catch( err=>{return err;});
    },
    editUserById(id,user){
        return usersCollection.updateOne({_id: id},{$set: user}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteUserById(id){
        return usersCollection.deleteOne({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const TV = {
    createTV(newTv){
        return tvCollection.create( newTv ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllTV(){
        return tvCollection.find({},{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getTVBy(filter){
        return tvCollection.find(filter,{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
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
    getQuoteBy(filter){
        return quotesCollection.find(filter).then( response => {return response;} ).catch( err=>{return err;});
    },
    getRandomQuotes(){
        return quotesCollection.find({},{__v:0}).then( response => {do {x = Math.floor(Math.random() * (response.length - 1));} while (response[x].status != "Approved");return response[x];} ).catch( err=>{return err;});
    },
    editQuoteBy(filter,quote){
        return quotesCollection.updateMany(filter,{$set: quote}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteQuoteBy(filter){
        return quotesCollection.remove(filter).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const Comments = {
    createComment(newComment){
        return commentsCollection.create( newComment ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllComments(){
        return commentsCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getCommentBy(filter){
        return commentsCollection.find(filter).then( response => {return response;} ).catch( err=>{return err;});
    },
    editCommentBy(filter,comment){
        return commentsCollection.updateMany(filter,{$set: comment}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteCommentBy(filter){
        return commentsCollection.remove(filter).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const WatchedLists = {
    createList(newList){
        return watchedCollection.create( newList ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllList(){
        return watchedCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getListBy(filter){
        return watchedCollection.find(filter).then( response => {return response;} ).catch( err=>{return err;});
    },
    editTitleByFromId(filter,title){
        return watchedCollection.updateMany(filter,{$set: {'list.$.title': title}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    addElementBy(filter,element){
        return watchedCollection.updateMany(filter,{$push: {list: element}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteElementBy(filter,element){
        return watchedCollection.updateMany(filter,{$pull: {list: element}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteListBy(filter){
        return watchedCollection.remove(filter).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const WishLists = {
    createList(newList){
        return wishCollection.create( newList ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllList(){
        return wishCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    getListBy(filter){
        return wishCollection.find(filter).then( response => {return response;} ).catch( err=>{return err;});
    },
    editTitleByFromId(filter,title){
        return wishCollection.updateMany(filter,{$set: {'list.$.title': title}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    addElementBy(filter,element){
        return wishCollection.updateMany(filter,{$push: {list: element}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteElementBy(filter,element){
        return wishCollection.updateMany(filter,{$pull: {list: element}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteListBy(filter){
        return wishCollection.remove(filter).then( response => {return response;} ).catch( err=>{return err;});
    }
};

const News = {
    createNews(newNews){
        return newsCollection.create( newNews ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllNews(){
        return newsCollection.find().then( response => {return response;} ).catch( err=>{return err;});
    },
    editNewsBy(filter,news){
        return newsCollection.updateMany(filter,{$set: news}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteNewsBy(filter){
        return newsCollection.remove(filter).then( response => {return response;} ).catch( err=>{return err;});
    }
};

module.exports = {Users,TV,Quotes,Comments,WatchedLists,WishLists,News};