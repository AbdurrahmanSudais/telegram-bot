const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('ytdl-core');
const fs = require('fs');
const { exec } = require('child_process');
const fetch = require('node-fetch'); // For searching YouTube

// Use environment variable for the bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `🎵 Welcome, ${msg.from.first_name}!  
I am Abdurrahman Sudais Jr 🤖  
Type /menu to see available commands.`);
});

// /menu command
bot.onText(/\/menu/, (msg) => {
    bot.sendMessage(msg.chat.id, `📜 Available Commands:  
/start - Start the bot  
/menu - Show this menu  
/play <song name or link> - Play a song`);
});

// /play command
bot.onText(/\/play (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    try {
        bot.sendMessage(chatId, `🔎 Searching for "${query}"...`);

        // If the user provides a YouTube link, use it. Otherwise, search for the first result.
        let videoUrl = query;
        if (!query.includes("youtube.com") && !query.includes("youtu.be")) {
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            const res = await fetch(searchUrl);
            const body = await res.text();
            const videoId = body.match(/"videoId":"(.*?)"/)[1];
            videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        }

        bot.sendMessage(chatId, `🎶 Playing: ${videoUrl}`);

        // Download the audio
        const stream = ytdl(videoUrl, { filter: 'audioonly' });
        const filePath = `music_${chatId}.mp3`;
        const writeStream = fs.createWriteStream(filePath);

        stream.pipe(writeStream);
        writeStream.on('finish', () => {
            bot.sendAudio(chatId, filePath).then(() => {
                fs.unlinkSync(filePath); // Delete file after sending
            });
        });

    } catch (error) {
        bot.sendMessage(chatId, `❌ Error: Could not find the song.`);
        console.error(error);
    }
});

console.log("Bot is running...");
