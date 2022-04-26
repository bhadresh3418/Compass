const finnhubClient = require("../../config/finnhub");
const UserStocks = require("../models/UserStocks");

// Trigger URL : /api/stock/stockLookup
// Search for symbol form finnhub;
// query 
// ?q=AAPL  : String to search

exports.stockLookup = async (req, res) =>
{
    try
    {
        const query = req.query.q;
        if (!query)
        {
            return res.errorMessage("search query is required!F");
        }

        finnhubClient.symbolSearch(query, (error, data, response) =>
        {
            if (error)
            {
                return res.errorMessage(error.message);
            }
            return res.success(data);
        });

    } catch (e)
    {
        return res.errorMessage(e.message);
    }

}

// Trigger URL : /api/stock/getWatchlist
// get Watchlist for authenticated user

exports.getWatchlist = async (req, res) =>
{
    try
    {
        const user = req.user;
        const user_id = user.id;
        const stockData = await UserStocks.findOne({ user_id });
        return res.success(stockData.watch_list);
    } catch (e)
    {
        return res.errorMessage(e.message);
    }
}

// Trigger URL : /api/stock/addToWatchlist
// Add stock symbol to user's watchlist
// request body
// {
//    "symbol":"AAPL"
// }

exports.addToWatchlist = async (req, res) =>
{
    try
    {
        const user = req.user;
        const user_id = user.id;
        const symbol = req.body.symbol;

        const stockData = await UserStocks.findOne({ user_id });
        if (stockData)
        {
            if (!stockData.watch_list.includes(symbol))
            {
                await UserStocks.findOneAndUpdate({ id: stockData.id }, { $push: { watch_list: symbol } });
            }
        } else
        {
            const watchlist = new UserStocks({
                user_id,
                watch_list: [symbol]
            })
            await watchlist.save();
        }
        return res.success("Successfully added");
    } catch (e)
    {
        return res.errorMessage(e.message);
    }
}