const Users = require("../models/Users");

// Controller : Controller is class Which can be used to add our logic , db 
// calls and everything to how we will handle incoming request


// Trigger URL : /api/stock/getUser
// get User data by providing token

exports.getUser = async (req, res) => {
    try {
        const authUser = req.user;
        const user = await Users.findById(authUser.id);
        if (!user) {
            return res.errorMessage("user not found");
        }
        user.emitPassword()
        return res.success(user);
    } catch (e) {
        return res.errorMessage(e.message);
    }
}