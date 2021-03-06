function getProperty(cookie, name) {
	if (cookie && Object.prototype.hasOwnProperty.call(cookie, name)) {
		const propertyName = cookie[name];
		if (propertyName) {
			return propertyName;
		}
	}
	return null;
}

function getS3oUsername(cookie) {
	return getProperty(cookie, 's3o_username');
}

function getOktaUsername(userinfo) {
	return `${userinfo.first_name}.${userinfo.last_name}`;
}

module.exports = {
	getS3oUsername,
	getOktaUsername
};
