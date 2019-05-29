function getProperty(cookie, name) {
  if (Object.prototype.hasOwnProperty.call(cookie, name)) {
    const propertyName = cookie[name];
    if (propertyName) {
      return propertyName;
    }
  }
  return null;
}

export function getS3oUsername(cookie) {
  return getProperty(cookie, 's3o_username');
}
