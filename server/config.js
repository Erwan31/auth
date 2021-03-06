const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: 'supersecret',
        DATABASE: 'mongodb://localhost:27017/AuthApp'
    }
}

exports.get = function get(env){
    return config[env] || config.default;
}

