const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual bot token
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

🔹 /start- Start the bot  
🔹 /menu- Show this menu  
🔹 /help- Get help  

_More features coming soon! 🚀_`;

    bot.sendMessage(msg.chat.id, menuText, { parse_mode: "Markdown" });
});

// Handle other messages (ignoring commands)
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.startsWith('/')) return; // Ignore commands
    bot.sendMessage(chatId, `You said: "${msg.text}"`);
});

// Handle errors to prevent crashes
bot.on('polling_error', (error) => {
    console.error("Polling error:", error);
});
