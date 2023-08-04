const mongoose = require('mongoose');

module.exports.init = async function()
{
    // await mongoose.connect('mongodb+srv://krsachin9696:<password>@cluster0.6eyhd80.mongodb.net/?retryWrites=true&w=majority')
    await mongoose.connect('mongodb+srv://app:lpEcyjempEYfzCb1@cluster0.6eyhd80.mongodb.net/SuperCoders?retryWrites=true&w=majority');

}