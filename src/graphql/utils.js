const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
    Buffer.from(string, 'base64').toString('ascii');


exports.toCursorHash = toCursorHash;
exports.fromCursorHash = fromCursorHash;