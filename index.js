const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors')

connectDB();

const origin = process.env.FRONTEND_URL;

app.use(express.static('uploads'));
app.use(cors({ origin }));
app.use( express.json({extend : true}));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log('Server on port', PORT))