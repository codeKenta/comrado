exports = module.exports = (io) => {

// Object that holds all the active connections.
var socketClients = {};

  io.on('connection', (socket) => {

      // Deletes the client from socketClients when disconnecting
      socket.on('disconnect', () => {
          delete socketClients[socket.client.id];
      });

      // Recieving user data from the connected clients and keeping track of
      // them by pairing socket.id and user.id
      socket.on('introduce', (userId) => {
          socketClients[socket.client.id] = JSON.parse(userId);
      });

      /*
      Socket that tells the client to update their chat conversation
      */
      socket.on('chat', (userId) => {
        let parsedUserId = JSON.parse(userId);
        let clientsToCall = [];

        /*
        Extracting the keys (socketId) from the socketsClientsObject
        where the value matches the incoming array of userIds
        */

        for (var key in socketClients) {
          console.log(key, parsedUserId)
          if( socketClients[key] == parsedUserId ){
            clientsToCall.push(key)
          }
        }

        console.log('clients.to.call');
        console.log(clientsToCall);

        socket.to(clientsToCall).emit('chat', 'Update your conversation');
      });

      socket.on('feed', (users) => {
        let matchedUsers = JSON.parse(users);
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
        Calls all the clients who is online and matched.
        Telling them to update their feed.
        Only emits if there is any to call.
        */
        if (clientsToCall.length !== 0) {
          socket.to(clientsToCall).emit('feed', 'Update!');
        }


      });


  });
}
