module.exports = async utilities => {
	utilities.snipes.set(message.guild.id, {
		content: message.content,
		author: message.author.tag,
		channel: message.channel.name,
		member: message.member,
		image: message.attachments.first()
			? message.attachments.first().proxyURL
			: null,
	});
};
