const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { join } = require("path");
const { walk } = require("./functions");
const chalk = require("chalk");

const commands = [];
const commandFiles = walk(join(__dirname, "../slashCommands")).filter(x =>
	/.+\.js$/i.test(x.name)
);

const ID = process.env.ID;

for (const file of commandFiles) {
	const command = require(file.path);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.token);

(async () => {
	try {
		console.log(
			chalk.hex("#ff8000")("[SLASH]"),
			chalk.green("Refreshing Utilities / commands...")
		);

		await rest.put(Routes.applicationGuildCommands(ID, "996415833326764052"), {
			body: commands,
		});

		console.log(
			chalk.hex("#ff8000")("[SLASH]"),
			chalk.green("Slash commands has been refreshed")
		);
	} catch (error) {
		console.error(error);
	}
})();
