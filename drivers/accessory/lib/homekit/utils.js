module.exports.toUUID = type => type.endsWith('-0000-1000-8000-0026BB765291') ? type : type.padStart(8, '0') + '-0000-1000-8000-0026BB765291';
