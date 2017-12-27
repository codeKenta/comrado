exports = module.exports = (io) => {

var socketClients = {};
// var socketClients = [];

  io.on('connection', (socket) => {

      // Log whenever a client disconnects from our websocket server
      socket.on('disconnect', () => {
          console.log('\nuser disconnected\n');
          delete socketClients[socket.client.id];
          console.log(socketClients);
      });

      // Recieving user data from the connected clients and keeping track of
      // them by pairing socket.id and user.id
      socket.on('introduce', (userId) => {
        // socketClients[socket.client.id] = userId;

        // let socketConnection = {}
        // socketConnection[socket.client.id] = userId;
        // socketClients.push(socketConnection)
          socketClients[socket.client.id] = JSON.parse(userId);
          console.log('\nConnected clients\n');
          console.log(socketClients);

      });

      socket.on('chat', (data) => {
          console.log("Message call Received: " + data);
          io.emit('chat', {type:'new-message', text: data});
      });

      socket.on('feed', (users) => {
        matchedUsers = JSON.parse(users);
        let clientsToCall = [];

        /*
        Extracting the keys (socketId) from the socketsClientsObject
        where the value matches the incoming array of userIds
        */

        for (var key in socketClients) {
          for (var i = 0; i < matchedUsers.length; i++) {
            if( socketClients[key] == matchedUsers[i] ){
              clientsToCall.push(key)
            }
          }
        }

        /*
        Calls all the clients that where online and matched.
        Telling them to update their feed.
        */
        for (var i = 0; i < clientsToCall.length; i++) {
          console.log(clientsToCall[i]);
          // socket.to(clientsToCall[i]).emit('feed', 'I reached youu!');
        }

        // socket.to(clientsToCall).emit('feed', 'I reached youu!');
        socket.emit('feed', 'I reached youu!');


          // io.emit('feed', {type:'new-message', text: data});
      });


  });
}
