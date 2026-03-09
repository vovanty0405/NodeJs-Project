const siteRouter = require('./site');
const storedRouter = require('./me');
const projectsRouter = require('./projects');
const apiRouter = require('./api');
const studentRouter = require('./students');
//const siteRouter = require('./routes/site');

function route(app){
    app.use('/', siteRouter);
    app.use('/me', storedRouter);
    app.use('/projects', projectsRouter);
    app.use('/api', apiRouter)
    app.use('/students',studentRouter);
}

module.exports = route;