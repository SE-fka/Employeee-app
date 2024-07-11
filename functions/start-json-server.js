exports.handler = async (event, context) => {
    const { spawn } = require('child_process');
  
    return new Promise((resolve, reject) => {
      const jsonServer = spawn('json-server', ['--watch', 'db.json', '--port', '8080']);
  
      jsonServer.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
  
      jsonServer.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
  
      jsonServer.on('error', (error) => {
        reject(error);
      });
  
      jsonServer.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        resolve({
          statusCode: 200,
          body: 'JSON server started successfully',
        });
      });
    });
  };