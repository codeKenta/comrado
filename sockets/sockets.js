exports = module.exports = (io) => {

// Object that holds all the active connections.
var feedClients = {};
var chatClients = {};

  io.on('connection', (socket) => {

      // Deletes the client from socketClients when disconnecting
      socket.on('disconnect', () => {
          delete feedClients[socket.client.id];
          delete chatClients[socket.client.id];
      });

      // Recieving user data from the connected feed-clients and keeping track of
      // them by pairing socket.id and user.id
      socket.on('introducefeed', (userId) => {
          feedClients[socket.client.id] = JSON.parse(userId);
      });

      // Recieving user data from the connected feed-clients and keeping track of
      // them by pairing socket.id and user.id
      socket.on('introducechat', (userId) => {
          chatClients[socket.client.id] = JSON.parse(userId);
      });

      /*
      Socket that tells the client to update their chat conversation
      */
      socket.on('chat', (data) => {
        let parsedData    = JSON.parse(data),
            recieverId    = parsedData.reciever,
            clientsToCall = [];

        /*
        Extracting the keys (socketId) from the socketsClientsObject
        where the value matches the incoming userIds
        */

        for (var key in chatClients) {
          if( chatClients[key] == recieverId ){
            clientsToCall.push(key)
          }
        }

        /*
        Calls all the clients who is online and matched.
        Telling them to update their conversation.
        Only emits if there is any to call.
        Sending the sender-id to the client so angular-component
        can decide if there should be a http-request.
        */

        if (clientsToCall.length !== 0) {
          socket.to(clientsToCall).emit('chat');
        }

      });

      socket.on('feed', (users) => {
        let matchedUsers = JSON.parse(users);
        let clientsToCall = [];

        /*
        Extracting the keys (socketId) from the socketsClientsObject
        where the value matches the incoming array of userIds
        */

        for (var key in feedClients) {
          for (var i = 0; i < matchedUsers.length; i++) {
            if( feedClients[key] == matchedUsers[i] ){
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
