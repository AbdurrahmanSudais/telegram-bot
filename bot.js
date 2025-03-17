const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const axios = require('axios');

const token = '8189923091:AAHKPu74zG00PtxRkZgM0DVoj3M9f-XcN9Q'; // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

// Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Welcome, ${msg.from.first_name}! 🤖\nI'm Abdurrahman Sudais Jr. How may I help you?\nType /menu to see my command list.`);
});

// Handle /menu command
bot.onText(/\/menu/, (msg) => {
    const menuText = `📜 *Menu Commands* 📜\n\n` +
                     `🔹 /start - Start the bot\n` +
                     `🔹 /menu - Show this menu\n` +
                     `🔹 /help - Get help\n` +
                     `🔹 /play [YouTube link] - Download and send music 🎵\n` +
                     `🔹 /lyrics [song name] - Get song lyrics 🎶\n\n` +
                     `More features coming soon! 🚀`;

    bot.sendMessage(msg.chat.id, menuText, { parse_mode: "Markdown" });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "Need help? 🤔\nJust type /menu to see all commands!\nIf you have any issues, contact the developer.");
});

// Handle /play command to download YouTube music
bot.onText(/\/play (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];

    // Validate URL
    if (!ytdl.validateURL(url)) {
        return bot.sendMessage(chatId, "❌ Invalid YouTube URL. Please enter a valid link.");
    }

    bot.sendMessage(chatId, "⏳ Downloading music, please wait...");

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, ''); // Clean filename
    const filePath = `./${title}.mp3`;

    const stream = ytdl(url, { filter: 'audioonly' });
    
    ffmpeg(stream)
        .audioBitrate(128)
        .toFormat('mp3')
        .save(filePath)
        .on('end', async () => {
            bot.sendMessage(chatId, "✅ Download complete! Sending the file...");
            await bot.sendAudio(chatId, filePath, { title });
            fs.unlinkSync(filePath); // Delete file after sending
        })
        .on('error', (err) => {
            console.error(err);
            bot.sendMessage(chatId, "❌ Failed to download music.");
        });
});

// Handle /lyrics command to fetch song lyrics
bot.onText(/\/lyrics (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const songName = match[1];

    bot.sendMessage(chatId, `🔍 Searching for lyrics of "${songName}"...`);

    try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(songName)}`);
        
        if (response.data.lyrics) {
            let lyrics = response.data.lyrics;
            
            // If lyrics are too long, send in parts
            if (lyrics.length > 4000) {
                lyrics = lyrics.substring(0, 4000) + "...\n\n⚠️ Lyrics too long, showing first part only.";
            }

            bot.sendMessage(chatId, `🎶 *Lyrics for "${songName}":*\n\n${lyrics}`, { parse_mode: "Markdown" });
        } else {
            bot.sendMessage(chatId, `❌ Sorry, lyrics not found for "${songName}".`);
        }
    } catch (error) {
        bot.sendMessage(chatId, `❌ Error fetching lyrics. Please try again.`);
    }
});

// Handle other messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Ignore commands to prevent duplicate responses
    if (msg.text.startsWith('/')) return;

    bot.sendMessage(chatId, `You said: "${msg.text}"`);
});
