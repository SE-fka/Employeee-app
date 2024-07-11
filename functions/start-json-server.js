const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

exports.handler = async (event, context) => {
  server.use(middlewares);
  server.use(router);
  return new Promise((resolve, reject) => {
    const port = 3000;
    server.listen(port, () => {
      console.log(`JSON Server is running on port ${port}`);
      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: 'JSON Server started' }),
      });
    });
  });
};