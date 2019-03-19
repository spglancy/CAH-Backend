# Links!

## From CONTROLLERS/USERS.JS:
1. unique namespaces with sockets.io
  * https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm


## Links whose content ends up not being used, but I think is still useful:
1. req.query returns a JS object after the query string is parsed
  * https://stackoverflow.com/questions/18524125/req-query-and-req-param-in-expressjs , username 'arb'
  * *as opposed to req.params*, which returns parameters in the matched route. **io/seeProfile.emit('varname', *req.params.id*)** would return the user's ID, not the whole object
  * originally planned on using in **controllers/users.js**. didn't use because, ha, turns out req isn't used in socket