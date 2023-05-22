const urlDatabase = new Map();

const getUrl = (shortCode) => {
  return urlDatabase.get(shortCode);
};

const saveUrl = (shortCode, longUrl) => {
  urlDatabase.set(shortCode, longUrl);
};

module.exports = {
  getUrl,
  saveUrl,
};
