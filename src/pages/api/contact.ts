import type { APIRoute } from 'astro';
import settings from '../../content/settings/index.json';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, contact, message } = body;

    // Validate inputs
    if (!name || !contact) {
      return new Response(
        JSON.stringify({ error: 'Пожалуйста, заполните поля Имя и Контакт.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const botToken = settings.telegramBotToken;
    const chatId = settings.telegramChatId;

    if (botToken && chatId) {
      // Send message to Telegram Bot
      const text = `📬 *Новая заявка с сайта ${settings.siteName}*\n\n👤 *Имя:* ${name}\n📞 *Контакт:* ${contact}\n💬 *Сообщение:* ${message || 'Без сообщения'}`;
      
      const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(tgUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Telegram API error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Ошибка при отправке в Telegram. Проверьте правильность токена и Chat ID.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Log to console if Telegram is not configured
      console.log('Feedback submitted (Telegram not configured):', { name, contact, message });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Заявка успешно отправлена!' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Submission error:', e);
    return new Response(
      JSON.stringify({ error: 'Произошла ошибка при отправке заявки.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
