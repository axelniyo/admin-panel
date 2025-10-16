// Minimal Protobuf implementation
exports.User = {
    encode: function(user) {
        const buffer = Buffer.from(JSON.stringify(user));
        return buffer;
    }
};

exports.UserList = {
    encode: function(userList) {
        const buffer = Buffer.from(JSON.stringify(userList));
        return buffer;
    },
    decode: function(buffer) {
        return JSON.parse(buffer.toString());
    }
};