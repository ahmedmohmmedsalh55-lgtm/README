const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// استبدل هذا بتوكن البوت الخاص بك من BotFather
const token = '8252765251:AAEkp5AZ7_4QChprvcMy3qTtZ8N9PxwsWLk';
const bot = new TelegramBot(token, {polling: true});

const app = express();

// رابط موقعك على Glitch (سيتم تعيينه تلقائيًا)
const glitchLink = process.env.PROJECT_DOMAIN 
  ? `https://${process.env.PROJECT_DOMAIN}.glitch.me` 
  : 'https://readme-l9he.onrender.com';

// معالجة أمر /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `مرحباً ${msg.from.first_name}! 👋\n\n` +
    `يمكنك تقديم طلب اللجوء إلى أوروبا من خلال موقعنا الرسمي.\n\n` +
    `اضغط على الزر أدناه للوصول إلى النموذج:`;
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'فتح نموذج اللجوء', url: glitchLink }],
        [{ text: 'مساعدة', callback_data: 'help' }]
      ]
    }
  };
  
  bot.sendMessage(chatId, message, options);
});

// معالجة ضغط الأزرار
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  
  if (query.data === 'help') {
    bot.sendMessage(chatId, 'للمساعدة، يرجى التواصل مع الدعم الفني:\n📧 support@asylum-eu.org\n📞 +123456789');
  }
});

// معالجة أمر /link
bot.onText(/\/link/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `رابط نموذج اللجوء:\n${glitchLink}`);
});

// معالجة أي رسالة نصية
bot.on('message', (msg) => {
  if (!msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'مرحباً! 👋\n\n' +
      'لبدء تقديم طلب اللجوء، استخدم الأمر /start\n' +
      'للحصول على رابط النموذج مباشرة، استخدم الأمر /link');
  }
});

// إعداد خادم ويب بسيط
app.get('/', (req, res) => {
  res.send('مرحباً! هذا خادم البوت الخاص بطلب اللجوء.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});