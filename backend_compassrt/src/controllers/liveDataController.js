// Controller : Controller is class Which can be used to add our logic , db 
// calls and everything to how we will handle incoming request
exports.getData = async (req, res) =>
{
    try
    {
        const authUser = req.user;

        return res.status(200).json({
            data: req.user,
            success: true,
        })
    } catch (e)
    {
        return res.status(400).json({
            error: error.message,
            success: false,
        });
    }
}