const APIKey = "2abbf7c3-245b-404f-9473-ade729ed4653";

function validateAPIKEY(req, res, next) {
    let apiKeyQ = req.query.apiKey;
    let apiKeyB = req.headers.authorization;
    let apiKeyH = req.headers['book-api-key'];
    
    if(!apiKeyQ && !apiKeyB && !apiKeyH) {
        res.statusMessage = "Please send the 'API Key' as parameter."
		return res.status(401).end();
	}
    
	if(apiKeyQ !== APIKey && apiKeyB !== `Bearer ${APIKey}` && apiKeyH !== APIKey) {
        res.statusMessage = "Unauthorizated."
		return res.status(401).end();
	}	
	
	next();
}

module.exports = validateAPIKEY;