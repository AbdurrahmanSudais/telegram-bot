const TelegramBot = require('node-telegram-bot-api');

const token = proces.env.TOKEN;  // Replace with your actual bot token
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

// Handle /start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, `Welcome, ${msg.from.first_name}! 🤖 I'm Abdurrahman Sudais Jr. How may I help you? Type /menu to see my command list.`);
});

// Handle /menu command
bot.onText(/\/menu/, (msg) => {
    const menuText = `📜 *Menu Commands* 📜\n\n` +
                     `🔹 /start - Start the bot\n` +
                     `🔹 /menu - Show this menu\n` +
                     `🔹 /help - Get help\n` +
                     `🔹 /play [music] - Play music 🎵\n` +
                     `🔹 /pause - Pause the music ⏸️\n\n` +
                     `More features coming soon! 🚀`;

    bot.sendMessage(msg.chat.id, menuText, { parse_mode: "Markdown" });
});

// Handle other messages instantly
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
    // Ignore commands to prevent duplicate responses
    if (msg.text.startsWith('/')) return;

    bot.sendMessage(chatId, `You said: "${msg.text}"`);
});
