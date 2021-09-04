const sequel = require("sequelize");

const sequelize = new sequel.Sequelize('Name-of-your-database', 'Your DB username', 'password', {
    host: 'localhost',
    dialect: 'postgres',
    freezeTableName: true
});


async function syncModels() {
    try {
        /* await sequelize.drop();
        console.log('All Tables dropped\n\n'); */

        await sequelize.sync({alter: true});
        console.log('All models were synchronized successfully\n\n');

    } catch (error) {
        console.log('Error occured while synchronizing the models:\n', error);
    }
}

async function checkDBConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully\n\n');

        await syncModels();

    } catch(e) {
        console.error('Unable to connect to the database:\n', error);
    }
}

checkDBConnection();

module.exports = { sequelize, sequel };