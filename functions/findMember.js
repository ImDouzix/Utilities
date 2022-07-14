async function findMember(client, guildId, memberResolver) {
	memberResolver = memberResolver.replace(/[\\<>@!]/g, "").trim();
	let guild = client.guilds.cache.get(guildId);
	if (!guild) guild = client.guilds.fetch(guildId);
	if (!guild) throw new Error("Invalid guild id");
	if (!memberResolver) return;

	let result = guild.members.cache.find(
		x =>
			x.user.username.toLowerCase() === memberResolver.toLowerCase() ||
			x.user.tag.toLowerCase() === memberResolver.toLowerCase() ||
			x.id === memberResolver ||
			x.toString() === memberResolver ||
			x.nickname?.toLowerCase() === memberResolver.toLowerCase() ||
			x.displayName.toLowerCase() === memberResolver.toLowerCase()
	);
	if (!result)
		result = await guild.members.fetch(memberResolver).catch(e => undefined);

	return result;
}

module.exports = findMember;
