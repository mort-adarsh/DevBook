const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User');
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')


router.get('/',auth, async (req,res)=> {
 try {
     const user = await User.findById(req.user.id).select('-password');
     res.json(user);
 } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
}

});

//aurh  user

router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'password is requird').exists()
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {
        email,
        password
    } = req.body;

    try {
        //See if user exists

        let user = await User.findOne({
            email
        });
        if (!user) {
            return res.status(400).json({
                errors: [{
                    msg: 'user didnt exist, invalid creditials'
                }]
            })
        }
        const ismatch = await bcrypt.compare(password, user.password);

        if(!ismatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid creditials'
                }]
            })
        }



        //return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign ( 
            payload, 
            config.get('jwtSecret'), 
            { expiresIn: 360000},
            (err, token) => 
            {
                if (err) throw err;
                res.json({ token });
        });
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});



module.exports = router;