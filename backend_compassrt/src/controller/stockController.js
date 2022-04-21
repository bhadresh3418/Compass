const finnhubClient = require("../../config/finnhub")

exports.stockLookup = async (req, res) => {
    try {
        const query = req.query.q;
        finnhubClient.symbolSearch('AAPL', (error, data, response) => {
            if (error) {
                return res.errorMessage(e.message);
            }
            return res.success(data);
        });

    } catch (e) {
        return res.errorMessage(e.message);
    }

}