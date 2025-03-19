require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const token = process.env.BOT_TOKEN;
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
🔹 /play <song name> - Search and play a song 🎵

_Example: /play Faded by Alan Walker_
_(The bot will search, download, and play it)_

_More features coming soon! 🚀_`;

    bot.sendMessage(msg.chat.id, menuText, { parse_mode: "Markdown" });
});

// Handle /play <song name> command
bot.onText(/\/play (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1].trim(); // Extract the song name

    bot.sendMessage(chatId, `🔍 Searching for "${query}"...`);

    try {
        // Search YouTube for the song
        const searchResults = await yts(query);
        if (!searchResults.videos.length) {
            return bot.sendMessage(chatId, `❌ No results found for *${query}*`, { parse_mode: "Markdown" });
        }

        const video = searchResults.videos[0]; // Get the first video
        const videoUrl = video.url;
        const title = video.title.replace(/[^\w\s]/gi, ''); // Remove special characters
        const filePath = `./${title}.mp3`;

        bot.sendMessage(chatId, `🎵 Downloading *${video.title}*...`, { parse_mode: "Markdown" });

        // Download and convert to MP3 using ytdl-core and FFmpeg
        const stream = ytdl(videoUrl, { filter: 'audioonly' });
        const process = exec(`ffmpeg -i pipe:0 -b:a 192K -vn "${filePath}"`, { stdio: ['pipe', 'ignore', 'ignore'] });

        stream.pipe(process.stdin);

        process.on('close', async () => {
            bot.sendAudio(chatId, fs.createReadStream(filePath), {
                title: video.title,
                performer: video.author.name
            }).then(() => {
                fs.unlinkSync(filePath); // Delete the file after sending
            }).catch(err => console.error("Error sending audio:", err));
        });
    } catch (error) {
        console.error("Error:", error);
        bot.sendMessage(chatId, "❌ An error occurred while processing your request.");
    }
});

// Handle errors to prevent crashes
bot.on('polling_error', (error) => {
    console.error("Polling error:", error);
});
