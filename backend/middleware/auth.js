const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Retrieve the authorization token string from the request headers
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. Authentication token missing!" });
    }

    try {
        // 2. Parse out the token payload handle safely by checking for the Bearer prefix schema
        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        // 3. Verify the token signature validity using your backend application secret key
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        
        // 4. Attach the decoded object footprint payload to the request target object pipeline
        req.user = decoded;
        next();
    } catch (err) {
        // 5. Handle invalid format scenarios or expired user session runtime tokens cleanly
        res.status(401).json({ message: "Authentication failed. Token is invalid or expired!" });
    }
};
