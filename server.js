const express = require('express');

const app = express();

const dotenv = require('dotenv');

dotenv.config();

require('./config/db');
require('./config/auth')(app);

app.use(express.json());
require('./api/routes')(app);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
