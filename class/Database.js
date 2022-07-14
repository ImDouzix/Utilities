class Database {
	constructor(db) {
		Object.assign(this, db);
	}

	async setVar(model, variable, value) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("value is required");

		return await this.set(model, `${variable}_global`, value);
	}

	async getVar(model, variable) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");

		let obj = await this.get(model, `${variable}_global`);
		return obj ? obj.value : this.defaults[variable];
	}

	async deleteVar(model, variable) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");

		return await this.delete(model, `${variable}_global`);
	}

	async setUserVar(model, variable, userID, value) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("userID is required");
		if (arguments.length < 4) throw new TypeError("value is required");

		return await this.set(model, `${variable}_user_${userID}`, value);
	}
	/**
  Returns the global user variable value
  */
	async getUserVar(model, variable, userID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("userID is required");

		let obj = await this.get(model, `${variable}_user_${userID}`);
		return obj ? obj.value : this.defaults[variable];
	}

	async deleteUserVar(model, variable, userID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("userID is required");

		return await this.delete(model, `${variable}_user_${userID}`);
	}

	async setServerVar(model, variable, guildID, value) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("guildID is required");
		if (arguments.length < 4) throw new TypeError("value is required");

		return await this.set(model, `${variable}_guild_${guildID}`, value);
	}
	/**
  Returns the server variable value
  */
	async getServerVar(model, variable, guildID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("guildID is required");

		let obj = await this.get(model, `${variable}_guild_${guildID}`);
		return obj ? obj.value : this.defaults[variable];
	}

	async deleteServerVar(model, variable, guildID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("guildID is required");

		return await this.delete(model, `${variable}_guild_${guildID}`);
	}

	async setMemberVar(model, variable, guildID, userID, value) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("guildID is required");
		if (arguments.length < 4) throw new TypeError("userID is required");
		if (arguments.length < 5) throw new TypeError("value is required");

		return await this.set(
			model,
			`${variable}_member_${guildID}_${userID}`,
			value
		);
	}

	async getMemberVar(model, variable, guildID, userID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("guildID is required");
		if (arguments.length < 4) throw new TypeError("userID is required");

		let obj = await this.get(model, `${variable}_member_${guildID}_${userID}`);
		return obj ? obj.value : this.defaults[variable];
	}

	async deleteMemberVar(model, variable, guildID, userID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("guildID is required");
		if (arguments.length < 4) throw new TypeError("userID is required");

		return await this.delete(model, `${variable}_member_${guildID}_${userID}`);
	}

	async setChannelVar(model, variable, channelID, value) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("channelID is required");
		if (arguments.length < 4) throw new TypeError("value is required");

		return await this.set(model, `${variable}_channel_${channelID}`, value);
	}

	async getChannelVar(model, variable, channelID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("channelID is required");

		let obj = await this.get(model, `${variable}_channel_${channelID}`);
		return obj ? obj.value : this.defaults[variable];
	}

	async deleteChannelVar(model, variable, channelID) {
		if (arguments.length < 1) throw new TypeError("model is required");
		if (arguments.length < 2) throw new TypeError("variable is required");
		if (arguments.length < 3) throw new TypeError("channelID is required");

		return await this.delete(model, `${variable}_channel_${channelID}`);
	}

	async ping(model = "main") {
		let start = Date.now();
		await this.all(model, { filter: x => true });
		return Date.now() - start;
	}
}

module.exports = Database;
