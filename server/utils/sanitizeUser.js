function sanitizeUser(user){
    const {password, ...safeUser} = user;
    return safeUser;
}

module.exports = sanitizeUser