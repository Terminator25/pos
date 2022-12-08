const connectToMongo = require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = 5000

var cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/category', require('./routes/category'))
app.use('/api/customer', require('./routes/customer'))
app.use('/api/product', require('./routes/product'))
app.use('/api/bill', require('./routes/bill'))
app.use('/api/user', require('./routes/user'))
app.use('/api/payment', require('./routes/payment'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})