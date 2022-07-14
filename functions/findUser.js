async function findUser(client, userResolver) {
	userResolver = userResolver.replace(/[\\<>@!]/g, "").trim();

	let result = client.users.cache.find(
		x =>
			x.username.toLowerCase() === userResolver.toLowerCase() ||
			x.tag.toLowerCase() === userResolver.toLowerCase() ||
			x.id === userResolver ||
			x.toString() === userResolver
	);
	if (!result)
		result = await client.users.fetch(userResolver).catch(e => undefined);

	return result;
}

module.exports = findUser;
