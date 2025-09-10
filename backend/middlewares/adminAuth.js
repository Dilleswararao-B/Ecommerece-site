import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({message: "Unauthorized"});
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.id !== process.env.ADMIN_ID) {
        return res.status(401).json({message: "Unauthorized"});
    }
    next();
}

export default adminAuth;