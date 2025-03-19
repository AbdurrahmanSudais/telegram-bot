require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'); // Import file system module

// Load bot token from .env file
const token = '8189923091:AAHKPu74zG00PtxRkZgM0DVoj3M9f-XcN9Q';
if (!token) {
    console.error("Error: BOT_TOKEN is missing. Please add your bot token.");
    process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Bot is running...");

// Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Welcome, ${msg.from.first_name}! 🤖\nI'm Abdurrahman Sudais Jr. How may I help you? Type /menu to see my command list.`);
});

// Handle /menu command
bot.onText(/\/menu/, (msg) => {
    const menuText = `
📜 *Menu Commands* 📜

🔹 /start - Start the bot  
🔹 /menu - Show this menu  
🔹 /help - Get help  
🔹 /play - Play an audio file 🎵

_More features coming soon! 🚀_`;

    bot.sendMessage(msg.chat.id, menuText, { parse_mode: "Markdown" });
});

// Handle /play command to send an audio file
bot.onText(/\/play/, (msg) => {
    const chatId = msg.chat.id;
    const audioPath = './audio/song.mp3'; // Path to the audio file

    // Check if file exists
    if (fs.existsSync(audioPath)) {
        bot.sendAudio(chatId, fs.createReadStream(audioPath), {
            title: "Song Title",
            performer: "Artist Name"
        });
    } else {
        bot.sendMessage(chatId, "⚠️ Sorry, the audio file is missing!");
    }
});

// Handle errors to prevent crashes
bot.on('polling_error', (error) => {
    console.error("Polling error:", error);
});
