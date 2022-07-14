const { MessageEmbed } = require("discord.js");
const fns = require("./functions");
const config = require("../config");

module.exports = client => {
	client.on("interactionCreate", async interaction => {
		if (!interaction.isCommand()) return;

		const command = client.commands.slash.get(interaction.commandName);
		if (!command) return;

		try {
			await command.execute(interaction, fns);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("Fatal Error")
						.setDescription(
							"We ran into an error while trying to execute your command!"
						)
						.setColor(config.fail),
				],
				ephemeral: true,
			});
		}
	});
};
