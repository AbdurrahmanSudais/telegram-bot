const TelegramBot = require('node-telegram-bot-api');

const token = '8189923091:AAHKPu74zG00PtxRkZgM0DVoj3M9f-XcN9Q';  // Replace with your actual token
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Welcome, ${msg.from.first_name}! 🤖 I'm Abdurrahman Sudais Jr. How may I help you? Type /menu to see my command list.`);
});

// Adding the /menu command
bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const menuText = `📜 *Menu Commands* 📜\n\n` +
                     `🔹 /start - Start the bot\n` +
                     `🔹 /menu - Show this menu\n` +
                     `🔹 /help - Get help\n` +
                     `🔹 /play [music] - Play music 🎵\n` +
                     `🔹 /pause - Pause the music ⏸️\n\n` +
                     `More features coming soon! 🚀`;

    bot.sendMessage(chatId, menuText, { parse_mode: "Markdown" });
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
    // Ignore commands so they don't trigger the normal message response
    if (msg.text.startsWith('/')) return;

    bot.sendMessage(chatId, `You said: "${msg.text}"`);
});

console.log("Bot is running...");
