const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const connection = require('./dbSetup');

exports.hashPassword = async (password) => {
    if (!password || password.length === 0) {
        return null;
    }
    const saltRounds = 13;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

exports.createNewUser = async (userData) => {
    const user = {
        uid: uuidv4(),
        password: exports.hashPassword(userData.password),
        firstName: userData.firstName || null,
        middleName: userData.middleName || null,
        lastName: userData.lastName || null,
        picture: userData.photos[0].value || null,
    };
    await connection.execute(
        'INSERT INTO users ' +
        '(uid, password, firstname, middlename, lastname, picture) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
        [...Object.values(user)]
    );
    await connection.execute(
        'INSERT INTO emails ' +
        '(uid, email) ' +
        'VALUES (?, ?)',
        [user.uid, userData.email]
    );
    user.email = userData.email;
    return user;
};

exports.getFederatedCredentials = async (provider, identifier) => {
    const result = await connection.execute(
        'SELECT uid FROM ' +
        'federated_credentials fc INNER JOIN federated_credentials_provider fp ' +
        'ON fc.provider_id = fp.provider_id ' +
        'WHERE fp.provider_name = ? AND fc.identifier = ?',
        [provider, identifier]
    );
    return result;
};
