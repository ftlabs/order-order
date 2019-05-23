function getProperty(cookie, name) {
  if (Object.prototype.hasOwnProperty.call(cookie, name)) {
    const propertyName = cookie[name];
    if (propertyName) {
      return propertyName;
    }
  }
  return null;
}

function getS3oUsername(cookie) {
  return 'bob';
}

export default {
  getS3oUsername
};
