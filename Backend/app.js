require('dotenv').config(); 
const express = require('express');
const cors = require('cors')
const app= express();
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const examRoutes = require('./routes/exam');
const questionRoutes = require('./routes/questionRoutes');
const resultRoutes = require('./routes/resultRoutes');

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/submissions', submissionRoutes);
app.use('/exams', examRoutes);  
app.use('/', questionRoutes); // question routes include exam-level paths
app.use('/results', resultRoutes);

// database connection
connectDB();

app.get('/',(req,res)=>{
    res.send("Hello World");
});

// catch 404 and forward
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});

// generic error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;