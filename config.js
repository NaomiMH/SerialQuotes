exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb+srv://admin:admin@cluster0-h5uz0.mongodb.net/serialquotesdb?retryWrites=true&w=majority';
exports.PORT = process.env.PORT || '8080';
exports.SECRET_TOKEN = process.env.SECRET_TOKEN || 'serialquote'