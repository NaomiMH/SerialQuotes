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
    },
    watch: [{
        tvId: {
            required : true,
            type : String
        },
        title: {
            required : true,
            type : String
        }
    }],
    wish: [{
        tvId: {
            required : true,
            type : String
        },
        title: {
            required : true,
            type : String
        }
    }],
    like: [{
        quote: {
            required : true,
            type : String
        },
        quoteId: {
            required : true,
            type : String
        }
    }]
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
        required : true,
        type : String
    },
    fromId: {
        required : true,
        type : String
    },
    by: {
        type : String,
        required : true
    },
    byId: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        required : true
    },
    type: {
        type : String,
        required : true
    },
    like: {
        type : Number,
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
        required : true,
        type : String
    },
    by: {
        type : String,
        required : true
    },
    byId: {
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
    }
});

const usersCollection = mongoose.model( "listofusers", usersCollectionSchema);
const tvCollection = mongoose.model( "listoftvs", tvCollectionSchema);
const quotesCollection = mongoose.model( "listofquotes", quotesCollectionSchema);
const commentsCollection = mongoose.model( "listofcomments", commentsCollectionSchema);
const newsCollection = mongoose.model("listofnews",newsCollectionSchema);

const Users = {
    createUser(newUser){
        newUser.admin = false;
        return usersCollection.create(newUser).then( response => {
            let news = {type: "New User", about: response.username, aboutId: response._id}
            return newsCollection.create(news).then( response4 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    checkUser(username){
        return usersCollection.findOne({username},{_id:1,username:1,wish:1,watch:1,like:1,admin:1,password:1}).then( response => {return response;} ).catch( err=>{return err;});
    },
    checkUserAdmin(id){
        return usersCollection.find({_id: id, admin: "true"},{_id:1}).populate('listoftv').then( response => {return response;} ).catch( err=>{return err;});
    },
    getUserBy(filter){
        return usersCollection.find(filter,{admin:0,password:0,__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    addWatchById(id,element){
        return usersCollection.updateMany({_id: id},{$pull: {wish: element}}).then( response => {
            return usersCollection.updateMany({_id: id},{$push: {watch: element}}).then( response2 => {
                return response2;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    addWishById(id,element){
        return usersCollection.updateMany({_id: id},{$push: {wish: element}}).then( response => {return response;} ).catch( err=>{return err;});
    },
    addLikeById(id,element){
        return usersCollection.updateMany({_id: id},{$push: {like: element}}).then( response => {
            return quotesCollection.updateOne({_id: element.quoteId},{$inc: {like: 1}}).then( response2 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    editUserById(id,user){
        return usersCollection.updateOne({_id: id},{$set: user}).then( response => {
            if(user.username){
                return newsCollection.updateMany({aboutId: id},{$set: {about: user.username}}).then( response2 => {
                    return quotesCollection.updateMany({byId: id},{$set: {by: user.username}}).then( response2 => {
                        return commentsCollection.updateMany({byId: id},{$set: {by: user.username}}).then( response2 => {
                            return response;
                        } ).catch( err=>{return err;});
                    } ).catch( err=>{return err;});
                } ).catch( err=>{return err;});
            }
            return response;
        } ).catch( err=>{return err;});
    },
    deleteWatchById(id,element){
        return usersCollection.updateMany({_id: id},{$pull: {watch: element}}).then( response => {
            return response;
        } ).catch( err=>{return err;});
    },
    deleteWishById(id,element){
        return usersCollection.updateMany({_id: id},{$pull: {wish: element}}).then( response => {
            return response;
        } ).catch( err=>{return err;});
    },
    deleteLikeById(id,element){
        return usersCollection.updateMany({_id: id},{$pull: {like: element}}).then( response => {
            return quotesCollection.updateOne({_id: element.quoteId},{$inc: {like: -1}}).then( response2 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    deleteUserById(id){
        return usersCollection.deleteOne({_id: id}).then( response => {
            return newsCollection.remove({aboutId: id}).then( response4 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    }
};

const TV = {
    createTV(newTv){
        return tvCollection.create( newTv ).then( response => {
            let news = {type: "New Serial", about: response.title, aboutId: response._id}
            return newsCollection.create( news ).then( response2 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    getAllTV(){
        return tvCollection.find({},{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getTVBy(filter){
        return tvCollection.find(filter,{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editTVById(id,tv){
        return tvCollection.updateOne({_id: id},{$set: tv}).then( response => {
            if(tv.title){
                usersCollection.updateMany({"wish.tvId": id},{$set: {'wish.$.title': tv.title}}).then( response2 => {
                    return usersCollection.updateMany({"watch.tvId": id},{$set: {'watch.$.title': tv.title}}).then( response3 => {
                        return newsCollection.updateMany({aboutId: id},{$set: {about: tv.title}}).then( response4 => {
                            return quotesCollection.updateMany({fromId: id},{$set: {from: tv.title}}).then( response5 => {
                                return response;
                            } ).catch( err=>{return err;});
                        } ).catch( err=>{return err;});
                    } ).catch( err=>{return err;});
                } ).catch( err=>{return err;});
            }
            if(tv.type){
                quotesCollection.updateMany({fromId: id},{$set: {type: tv.type}}).then( response5 => {
                    return response;
                } ).catch( err=>{return err;});
            }
            return response;
        } ).catch( err=>{return err;});
    },
    deleteTVById(id){
        return tvCollection.deleteOne({_id: id}).then( response => {
            return newsCollection.remove({aboutId: id}).then( response2 => {
                return quotesCollection.find({fromId: id},{_id:1}).then( response3 => {
                    for(let i=0; i<response3.length; i++){
                        usersCollection.updateMany({},{$pull: {like: {quoteId: response3[i]._id}}}).then( response6 => {
                            newsCollection.remove({aboutId: response3[i]._id}).then( response4 => {
                                return commentsCollection.find({fromId: response3[i]._id},{_id:1}).then( response5 => {
                                    for(let j=0; j<response5.length; j++){
                                        newsCollection.remove({aboutId: response5[j]._id}).then( response6 => {
                                            return response;
                                        } ).catch( err=>{return err;});
                                    }
                                    return commentsCollection.remove({fromId: response3[i]._id}).then( response7 => {
                                        return response;
                                    } ).catch( err=>{return err;});
                                } ).catch( err=>{return err;});
                            } ).catch( err=>{return err;});
                        } ).catch( err=>{return err;});
                    }
                    return quotesCollection.remove({fromId: id}).then( response6 => {
                        return usersCollection.updateMany({},{$pull: {wish: {tvId: id}}}).then( response6 => {
                            return usersCollection.updateMany({},{$pull: {watch: {tvId: id}}}).then( response6 => {
                                return response;
                            } ).catch( err=>{return err;});
                        } ).catch( err=>{return err;});
                    } ).catch( err=>{return err;});
                } ).catch( err=>{return err;});
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    }
};

const Quotes = {
    createQuote(newQuote){
        newQuote.status = "To be approved";
        return quotesCollection.create( newQuote ).then( response => {return response;} ).catch( err=>{return err;});
    },
    getAllQuotes(){
        return quotesCollection.find({status:"Approved"},{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getQuoteBy(filter){
        return quotesCollection.find(filter,{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    getRandomQuotes(){
        return quotesCollection.find({status: "Approved"},{__v:0,byId:0}).then( response => {
            if(response[0]){
                let x = Math.floor(Math.random() * (response.length-1));
                return response[x];
            }
            return response;
        } ).catch( err=>{return err;});
    },
    editQuoteById(id,quote){
        return quotesCollection.updateMany({_id: id},{$set: quote}).then( response => {
            if(quote.quote){
                newsCollection.updateMany({aboutId: id},{$set: {about: quote.quote}}).then( response => {
                    return usersCollection.updateMany({"like.quoteId": id},{$set: {'like.$.quote': quote.quote}}).then( response3 => {
                        return response;
                    } ).catch( err=>{return err;});
                } ).catch( err=>{return err;});
            }
            if(quote.status == "Approved"){
                return quotesCollection.find({_id: id},{quote: 1}).then( response3 => {
                    let news = {type: "New Quote", about: response3[0].quote, aboutId: id};
                    return newsCollection.create( news ).then( response2 => {
                        return response;
                    } ).catch( err=>{return err;});
                } ).catch( err=>{return err;});
            }
            else if(quote.status == "To be approved"){
                return newsCollection.remove({aboutId: id}).then( response3 => {
                    return response;
                } ).catch( err=>{return err;});
            }
            return response;
        } ).catch( err=>{return err;});
    },
    deleteQuoteById(id){
        return quotesCollection.remove({_id: id}).then( response => {
            return newsCollection.remove({aboutId: id}).then( response2 => {
                return usersCollection.updateMany({},{$pull: {like: {quoteId: id}}}).then( response6 => {
                    return commentsCollection.find({fromId: id},{_id:1}).then( response3 => {
                        for(let j=0; j<response3.length; j++){
                            newsCollection.remove({aboutId: response3[j]._id}).then( response4 => {
                                return response;
                            } ).catch( err=>{return err;});
                        }
                        return commentsCollection.remove({fromId: id}).then( response5 => {
                            return usersCollection.updateMany({},{$pull: {like: {quoteId: id}}}).then( response6 => {
                                return response;
                            } ).catch( err=>{return err;});
                        } ).catch( err=>{return err;});
                    } ).catch( err=>{return err;});
                } ).catch( err=>{return err;});
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    }
};

const Comments = {
    createComment(newComment){
        return commentsCollection.create( newComment ).then( response => {
            let news = {type: "New Comment", about: response.comment, aboutId: response._id}
            return newsCollection.create( news ).then( response2 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    getCommentBy(filter){
        return commentsCollection.find(filter,{__v:0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    editCommentById(id,comment){
        return commentsCollection.updateMany({_id: id},{$set: {comment}}).then( response => {
            return newsCollection.updateMany({aboutId: id},{$set: {about: comment}}).then( response2 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    },
    deleteCommentById(id){
        return commentsCollection.remove({_id: id}).then( response => {
            return newsCollection.remove({aboutId: id}).then( response2 => {
                return response;
            } ).catch( err=>{return err;});
        } ).catch( err=>{return err;});
    }
};

const News = {
    getAllNews(){
        return newsCollection.find({},{__v: 0}).then( response => {return response;} ).catch( err=>{return err;});
    },
    deleteNewsById(id){
        return newsCollection.remove({_id: id}).then( response => {return response;} ).catch( err=>{return err;});
    }
};

module.exports = {Users,TV,Quotes,Comments,News};