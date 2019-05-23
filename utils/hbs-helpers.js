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

function registerHelpers(hbs) {
	hbs.registerHelper('ifEquals', ifEquals);
	hbs.registerHelper('ifThisOrThat', ifThisOrThat);
	hbs.registerHelper('ifNotThisOrThat', ifNotThisOrThat);
}

module.exports = {
	registerHelpers
};
