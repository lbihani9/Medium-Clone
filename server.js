
const express = require('express');
const { sequelize } = require('./config/database');
const { setAssociations } = require('./config/associations');

const app = express();
const PORT = process.env.PORT || 3232;

app.use(express.json());
setAssociations();

const { userRoute } = require('./src/routes/user');
const { usersRoute } = require('./src/routes/users');
const { articlesRoute } = require('./src/routes/articles');
const { profilesRoute } = require('./src/routes/profiles');

app.use('/api/users', usersRoute);
app.use('/api/user', userRoute);
app.use('/api/articles', articlesRoute);
app.use('/api/profiles', profilesRoute);

app.get('/', (req, res) => {
    res.send('Medium Clone');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}....\n`);
});
