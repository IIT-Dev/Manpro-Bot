import dotenv from 'dotenv';

const configLoading = dotenv.config({ path: `${__dirname}/../../.env` });

if (process.env.NODE_ENV !== 'production' && configLoading.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    environment: process.env.NODE_ENV || 'production',
    port: parseInt(process.env.PORT, 10),
    databaseURI: process.env.MONGODB_URI,
    api: {
        prefix: '/api',
    },
    line: {
        channelSecret: process.env.LINE_CHANNEL_SECRET,
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    },
    sheets: process.env.SHEETS_URL,
};
