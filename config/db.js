const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('Mongo is connected'))
  .catch(err => console.log(err));
