    const express = require('express')
    const router = express.Router();
    const auth = require('../../middleware/auth')
    const User = require('../../models/User');
    const Profile = require('../../models/Profile')
    const request = require('request')
    const config = require('config')
    const {
        check,
        validationResult
    } = require('express-validator');
const { response } = require('express');


    // get api/profile/me
    router.get('/me', auth, async (req, res) => {
        try {
            const profile = await Profile.findOne({
                user: req.user.id
            }).populate('user', ['name', 'avatar']);
            if (!profile) {
                return res.status(400).json({
                    msg: 'there is no profile'
                })
            }

        } catch (err) {
            console.error(err.message)
            res.status(500).send('Server Error')
        }
    });

    //post api/profile
    // create or update profile
    router.post('/', [auth, [check('status', 'Status is required').not().isEmpty(), check('skills', 'Skills is required').not().isEmpty()]],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
            const {
                company,
                website,
                location,
                bio,
                status,
                githubusername,
                skills,
                youtube,
                facebook,
                twitter,
                instagram,
                linkedin
            } = req.body;

            // build profile objects
            const profileFields = {};
            profileFields.user = req.user.id;
            if (company) profileFields.company = company;
            if (website) profileFields.website = website;
            if (location) profileFields.location = location;
            if (bio) profileFields.bio = bio;
            if (status) profileFields.status = status;
            if (githubusername) profileFields.githubusername = githubusername;
            if (skills) {
                profileFields.skills = skills.split(',').map(skills => skills.trim());
            }
            //build social object
            profileFields.social = {}
            if (youtube) profileFields.social.youtube = youtube;
            if (facebook) profileFields.social.facebook = facebook;
            if (twitter) profileFields.social.twitter = twitter;
            if (instagram) profileFields.social.instagram = instagram;
            if (linkedin) profileFields.social.linkedin = linkedin;


            try {
                let profile = await Profile.findOne({
                    user: req.user.id
                });
                if (profile) {
                    //upadte
                    profile = await Profile.findOneAndUpdate({
                        user: req.user.id
                    }, {
                        $set: profileFields
                    }, {
                        new: true
                    });
                    return res.json(profile);
                }
                //create

                profile = new Profile(profileFields);
                await profile.save();
                res.json(profile);

            } catch (err) {
                console.error(err.message);
                res.status(500).send('Server Error')
            }


        });

    // GET all profiles   api/profile
    router.get('/', async (req, res) => {
        try {
            const profiles = await Profile.find().populate('user', ['name', 'avatar']);
            res.json(profiles)

        } catch (error) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })

    // GET all profiles   api/profile/user/:user_id
    router.get('/user/:user_id', async (req, res) => {
        try {
            const profile = await Profile.findOne({
                user: req.params.user_id
            }).populate('user', ['name', 'avatar']);
            if (!profile) {
                return res.status(400).json({
                    msg: "profile not found"
                })
            }
            res.json(profile)

        } catch (err) {
            console.error(err.message);
            if (err.kind == 'ObjectId') {
                return res.status(400).json({
                    msg: "profile not found"
                })
            }
            res.status(500).send('Server Error')
        }
    })

    // Delete profile, user and post   api/profile
    //private route
    router.delete('/', auth, async (req, res) => {
        try {
            //remove profile
            await Profile.findOneAndRemove({
                user: req.user.id
            });

            //remove user
            await User.findOneAndRemove({
                _id: req.user.id
            });

            res.json({
                msg: 'User Removed'
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })


    // PUT api/profile/experience
    //private

    router.put('/experience', 
    [auth, 
        [
        check('title', 'title is required').not().isEmpty(),
        check('company', 'company is required').not().isEmpty(),
        check('from', 'from date is required').not().isEmpty()
        ]
    ],
    async (req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty()) 
            {
                return res.status(400).json({errors: errors.array()});
            }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newexp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        try {
            const profile  = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(newexp);
            await profile.save();
            res.json(profile);

            
        } 
        catch (err) {
            console.error(err.message);
            res.status(500).send('server error')   
        }


    });


    // Delete experinece  api/profile/experience/:exp_id
    //private route
    router.delete('/experience/:exp_id', auth, async (req, res) => {
        try {
            //profile
            const profile = await Profile.findOne({ user: req.user.id });

            //Get remove index
            const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

            profile.experience.splice(removeIndex,1);

            await profile.save(); 

            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })


    // PUT api/profile/education
    //private

    router.put('/education', 
    [auth, 
        [
        check('school', 'school is required').not().isEmpty(),
        check('degree', 'degree is required').not().isEmpty(),
        check('fieldofeducation', 'fieldofeducation is required').not().isEmpty(),
        check('from', 'from date is required').not().isEmpty()
        ]
    ],
    async (req, res) => 
    {
        const errors = validationResult(req);
        if(!errors.isEmpty()) 
            {
                return res.status(400).json({errors: errors.array()});
            }

        const {
            school,
            degree,
            fieldofeducation,
            from,
            to,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofeducation,
            from,
            to,
            current,
            description
        }

        try {
            const profile  = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);

            
        } 
        catch (err) {
            console.error(err.message);
            res.status(500).send('server error')   
        }


    });


    // Delete education  api/profile/education/:edu_id
    //private route
    router.delete('/education/:edu_id', auth, async (req, res) => {
        try {
            //profile
            const profile = await Profile.findOne({ user: req.user.id });

            //Get remove index
            const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
            console.log(removeIndex);
            if(removeIndex!=-1) {
                profile.education.splice(removeIndex,1);

                await profile.save();

            }


            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    })

    // get api/profile/github/:username
    // get repo of user

    router.get('/github/:username', (req,res) => {
        try {
            const options = {
                uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
                method: 'GET',
                headers: {'user-agent': 'node.js'}
            };
            request(options, (error, response,body)=> {
                if(error) console.log(error.message );


                if(response.statusCode!=200)
                {
                    console.log(response.status)
                    return res.status(404).json({msg: 'No Github profile found'});
                }

                res.json(JSON.parse(body));
            }) 

            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }

    })



    module.exports = router;