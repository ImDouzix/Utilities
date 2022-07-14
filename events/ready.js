const chalk = require("chalk");

module.exports = {
	name: "ready",
	once: true,
	execute(utilities) {
		console.log(
			chalk.hex("#423794")(
				`\n✅ ${
					utilities.user.tag
				} is Ready on ${utilities.guilds.cache.size.toLocaleString()} servers!\n`
			)
		);

		const runStatus = () => {
			utilities.user.setPresence({
				activities: [
					{
						type: "WATCHING",
						name: `${utilities.guilds.cache
							.reduce((acc, cur) => acc + cur.memberCount, 0)
							.toLocaleString()} members in ${utilities.guilds.cache.size.toLocaleString()} servers`,
					},
				],
			});
		};

		runStatus();
		setInterval(runStatus, 60000);
		require("../handler/topgg")(utilities);

		console.log(
			chalk.hex("#16a646")(`
▄▄▄  ▄▄▄ . ▄▄▄· ·▄▄▄▄   ▄· ▄▌
▀▄ █·▀▄.▀·▐█ ▀█ ██▪ ██ ▐█▪██▌
▐▀▀▄ ▐▀▀▪▄▄█▀▀█ ▐█· ▐█▌▐█▌▐█▪
▐█•█▌▐█▄▄▌▐█ ▪▐▌██. ██  ▐█▀·.
.▀  ▀ ▀▀▀  ▀  ▀ ▀▀▀▀▀•   ▀ • `)
		);
	},
};
