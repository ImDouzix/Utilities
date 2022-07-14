function ordinal(number) {
	if (isNaN(number)) throw new TypeError("Not a Number");
	number = parseInt(number);

	if (
		!["1", "2", "3"].includes(String(number).at(-1)) ||
		["11", "12", "13"].includes(String(number).slice(-2))
	)
		return number + "th";

	if (String(number).endsWith("1")) return number + "st";
	if (String(number).endsWith("2")) return number + "nd";
	if (String(number).endsWith("3")) return number + "rd";
	return NaN;
}

module.exports = ordinal;
