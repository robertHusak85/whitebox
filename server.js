'use strict';

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(
    port, 
    () => { console.log(`White box coding exercise running on port ${port}`); });
    
process.on('unhandledRejection', err => {
    console.log('Unhandled Rejection!  Shutting down...');
    console.log(err.name, err.message);
    server.close(() => { process.exit(1); });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM Received.  Shutting down gracefully...');
    server.close();
});
