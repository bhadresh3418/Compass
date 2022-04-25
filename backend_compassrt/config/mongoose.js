const ENV = require("./env");
const mongoose = require("mongoose");

module.exports = async (app) => {
    //connection to mongo db
    await mongoose.connect(ENV.MONGO_URL);

    // Graceful disconnection

    //catches ctrl + c event
    // SIGINT = singal: interuppt
    process.on("SIGINT", cleanup);

    //catches when system kils process
    // SIGTERM = signal: terminate
    process.on("SIGTERM", cleanup);

    // SIGHUP = signal: hang up
    process.on("SIGHUP", cleanup);

    if (app) {
        // set mongoose for whole app
        app.set("mongoose", mongoose);
        console.log("mogoose connected")
    }
};

//cleanup function to close
function cleanup() {
    mongoose.connection.close(function () {
        process.exit(0);
    });
}
