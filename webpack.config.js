const path = require('path');
module.exports = {
    entry: './src/leo-audio.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'leo-audio.min.js'
    }
}