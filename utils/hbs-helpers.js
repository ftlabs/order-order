function ifEquals(arg1, arg2, options) {
	return arg1 === arg2 ? options.fn(this) : options.inverse(this);
}

function ifThisOrThat(arg1, arg2, options) {
	return arg1.length > 0 || arg2.length > 0
		? options.fn(this)
		: options.inverse(this);
}

function ifNotThisOrThat(arg1, arg2, options) {
	return arg1.length > 0 || arg2.length > 0
		? options.inverse(this)
		: options.fn(this);
}

function ifInList(item, list, options) {
	return list.includes(item) ? options.inverse(this) : options.fn(this);
}

function ifThisGreaterThanThat(varThis, varThat, options) {
	return varThis > varThat ? options.inverse(this) : options.fn(this);
}

function registerHelpers(hbs) {
	hbs.registerHelper('ifEquals', ifEquals);
	hbs.registerHelper('ifThisOrThat', ifThisOrThat);
	hbs.registerHelper('ifNotThisOrThat', ifNotThisOrThat);
	hbs.registerHelper('ifInList', ifInList);
	hbs.registerHelper('ifThisGreaterThanThat', ifThisGreaterThanThat);
}

module.exports = {
	registerHelpers
};
