const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')



exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken =jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId)

        if (!user) {
            return res.status(400).json({
                message: 'Authentication failed : user not found'
            })
        }
        if (user.isLoggedIn !== decodedToken.isLoggedIn) {
            return res.status(401).json({
                message: 'Unathorized: you must be logged in to perform this action'
            })
        }
        req.user = decodedToken
        await user.save()

        next()
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout : Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'internal server error'
        })
    }
}

exports.authenticateAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization
        if (!auth) {
            return res.status(400).json({
                message: 'Token Not Found'
            })
        }

        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken =jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Authentication failed : user not found'
            })
        }
        if (user.isAdmin === false) {
            return res.status(401).json({
                message: 'Unauthorized: you are not allowed to perform this action'
            })
        }
        req.user = decodedToken
        next()

    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout: Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'Internal server Error'
        })
    }

}
exports.authenticateUserToAdmin = async(req,res,next)=>{
    try {
        const auth = req.headers.authorization
        if(!auth){
            return res.status(404).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if(!token){
            return res.status(404).json({
                 message: 'Invalid Token'
            })
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId)
        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }
        user.isAdmin= true
        if (user.isAdmin === false) {
            return res.status(401).json({
                message: 'Unauthorized: you are not allowed to perform this action'
            })
        }
        req.user=user
        next()
        
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout: Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'Internal server Error'
        })
    }
}
