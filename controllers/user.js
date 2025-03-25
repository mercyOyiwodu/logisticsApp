const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: 'user not found'
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newUser.fullName.split(' ')[1]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newUser.email,
            html: signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        await newUser.save();
        res.status(201).json({
            message: 'User registered successfully',
            data: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Error registering user'
        });
    }
};
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            return res.status(404).json({
                message: "token not found"
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        if (user.isVerify === true) {
            return res.status(401).json({
                message: "user has already been verified"
            })
        }
        user.isVerify = true
        await user.save()
        res.status(200).json({
            message: "user verified successfully"
        })
    } catch (error) {
        console.log(error.message)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'verification link expired' })
        }
        res.status(500).json({
            message: 'Error verifying user'
        });
    }
};
exports.resendVerificationEmail = async (req, res) => {
    try {

        const validated = await validate(req.body, verificationEmailSchema)

        const { email } = validated

        if (!email) {
            return res.status(400).json({ message: 'please enter email address' })
        }

        const user = await userModel.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = user.fullName.split('')[1]

        const html = signUpTemplate(link, firstName)

        const mailOptions = {
            subject: 'email verification',
            email: user.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({ 
            message: 'verification email sent, please check mail box'
         })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'error resending verification email'
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: 'please enter email address' })
        }

        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: 'Account not found'
            })
        };

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1hour' });
        const link = `${req.protocol}://${req.get('host')}/api/v1/forgot-password/${token}`;
        const firstName = user.fullName.split(' ')[0]
        const mailOptions = {
            email: user.email,
            subject: 'Reset Password',
            html: forgotTemplate(link, firstName)
        };

        await sendEmail(mailOptions);
        return res.status(200).json({
            message: 'Link has been sent to email address'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'error sending verification email'
        })
    }

};
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password, comfirmPassword } = req.body;
        if (!token) {
            return res.status(404).json({
                message: 'token not found'
            })
        }
        if (password !== comfirmPassword) {
            return res.status(400).json({
                message: 'password do not match'
            })
        };
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({
            message: 'password reset successfully'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'error resetting password'
        })

    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: 'user not found'
            })
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                message: 'invalid password'
            })
        }
        user.isLoggedin = true;
        await user.save();
        const token = jwt.sign({ _id: user._id, isLoggedin: user.isLoggedin }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            message: 'login successful',
            token
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'error logging in'
        })
    }
};
exports.logout = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        user.isLoggedin = false
        await user.save()
        res.status(200).json({
            message: 'logout successful'
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'error logging out'
        })
    }
};