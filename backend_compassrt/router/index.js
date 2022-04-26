const serviceRouter = require("./serviceRouter");
const userRouter = require("./userRouter");
const authRouter = require("./authRouter");
const stockRouter = require("./stockRouter")

module.exports = (app) =>
{
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRouter);
    app.use("/api/service", serviceRouter);
    app.use("/api/stock", stockRouter);
};
