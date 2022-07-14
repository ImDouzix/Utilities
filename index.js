const { Client } = require("discord.js");

global.utilities = new Client({
	intents: 32511,
});

utilities.owners = [
	"719317746923470908",
	"588847772820701214"
];

require("./handler/antiCrash")();
require("discord-logs")(utilities);
require("./handler")(utilities);
require("./mongo")(utilities);

utilities.login(process.env.token);
