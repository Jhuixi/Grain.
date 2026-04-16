const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ 
			success: false, 
			message: 'No token provided. Please login.' 
		});
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			userId: decoded.userId,
			username: decoded.username
		};
		next();
    } catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ 
				success: false, 
				message: 'Token expired. Please login again.' 
			});
		}
		
		return res.status(401).json({ 
			success: false, 
			message: 'Invalid token. Please login again.' 
		});
    }
};

module.exports = { authenticate };