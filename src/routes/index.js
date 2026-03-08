const siteRouter = require('./site');
const storedRouter = require('./me');
const projectsRouter = require('./projects');
//const siteRouter = require('./routes/site');

function route(app){
    app.use('/', siteRouter);
    app.use('/me', storedRouter);
    app.use('/projects', projectsRouter);
}

module.exports = route;