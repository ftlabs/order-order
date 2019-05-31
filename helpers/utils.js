function formatDate(timestamp) {
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const date = new Date(timestamp);

	const format = {
		datetime: `${date.getFullYear()}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${date
			.getDate()
			.toString()
			.padStart(2, '0')}`,
		readable: `${
			months[date.getMonth()]
		} ${date.getDate()}, ${date.getFullYear()}`
	};

	return format;
}

function sortByDate(arr, property) {
	return arr.sort((a, b) => {
		if (a[property] === b[property]) {
			return 0;
		}
		return a[property] > b[property] ? -1 : 1;
	});
}

function cleanUsername(username) {
	return capitalize(username.replace('.', ' '));
}

function hasOwnPropertyCall(object, property) {
	return Object.prototype.hasOwnProperty.call(object, property);
}

function capitalize(str) {
	return str.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
}

module.exports = {
	formatDate,
	sortByDate,
	hasOwnPropertyCall,
	cleanUsername
};
