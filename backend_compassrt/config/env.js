const PORT = process.env.PORT || 9090;
const HOST = process.env.HOST|| '127.0.0.1';
const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET|| 'ENCRYPTION_SECRET';
const FINHUB_API_KEY = process.env.FINHUB_API_KEY
const FINHUB_SANDBOX_API_KEY = process.env.FINHUB_SANDBOX_API_KEY
const FINHUB_WEBHOOK_SECRET_KEY = process.env.FINHUB_WEBHOOK_SECRET_KEY

module.exports = {
    PORT,
    HOST,
    NODE_ENV,
    MONGO_URL,
    JWT_SECRET,
    ENCRYPTION_SECRET,
    FINHUB_API_KEY,
    FINHUB_SANDBOX_API_KEY,
    FINHUB_WEBHOOK_SECRET_KEY
}