require('dotenv').config();
const api = require('covid19-api');
const { Telegraf, Markup } = require('telegraf');
const countries = require('./help');

const bot = new Telegraf(process.env.API_TOKEN);
bot.start((ctx) =>
	ctx.reply(`Привет ${ctx.message.from.first_name} ${ctx.message.from.last_name}`,
		Markup.keyboard([
			['Russia', 'Ukraine'],
			['China', 'Iran'],
		])
			.resize()

	));
bot.help((ctx) => ctx.reply(countries));
bot.on('text', async (ctx) => {
	let data = {};
	let countrie = ctx.message.text;
	try {
		data = await api.getReportsByCountries(`${countrie}`);
		console.log(ctx);
		ctx.reply(`
Страна: ${ctx.message.text}
Всего случаев: ${data[0][0].cases}
Всего смертей: ${data[0][0].deaths}
Всего выздоровевших: ${data[0][0].recovered}
			`);
	} catch {
		ctx.reply('Что-то некорректно введено! Возможно такой страны нет.')
	}
});

bot.launch();

console.log('бот запущен');