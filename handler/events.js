module.exports = client => {
	for (const event of client.events.values()) {
		if (event.disabled || !event.name || typeof event.execute !== "function")
			continue;
		if (event.once) client.once(event.name, event.execute);
		else client.on(event.name, event.execute);
	}
};
