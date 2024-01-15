const express = require("express")
const app = express()
const authroute = require('./src/routes/authRouter.js');

const port = process.env.PORT;

app.use(express.json());

// Routes
app.use(authroute);

app.listen(port, () => {
    console.log(`Authorization Server running on ${port}...`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
  });