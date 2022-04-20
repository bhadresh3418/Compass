// Controller : Controller is class Which can be used to add our logic , db 
// calls and everything to how we will handle incoming request
const Users = require("../models/Users");

exports.signup = async (req, res) => {
    try {
        // Use HTTPS preferably with HSTS to protect the passwords during transport;
        // SSL TLS protection will also help to protect data
        const userDetails = new Users({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            bio: req.body.bio,
            image: req.body.image,
        });
        
        await userDetails.save();
        //till that we have data without password informations : hash, salt
        console.log("userDetails",userDetails);
        // fetch the user and test password verification
        let user = await Users.findById(userDetails.id);

        console.log("user", user);
        user.setPassword(req.body.password);
        console.log("user", user);

        const updatedUser = await Users.findByIdAndUpdate(userDetails.id, user);
        
        updatedUser.emitPassword();

        return res.status(200).json({
            data: {
                user: updatedUser,
                token: user.generateJWT()
            },
            success: true,
        })

    } catch (e) {
        console.log(e);
        return res.status(400).json({
            error: e.message,
            success: false,
        });
    }
}

exports.login = async (req, res) => {
    try {
        // fetch the user and test password verification
        const user = await Users.findOne({ email: req.body.email }).exec();
        let token = null;
        console.log(user)
        if (user && user.validPassword(req.body.password)) {
            token = user.generateJWT();
        } else {
            return res.errorMessage("wrong password!")
        }

        user.emitPassword()

        return res.success({
            user,
            token
        });

    } catch (e) {
        return res.status(400).json({
            error: e.message,
            success: false,
        });
    }
}
