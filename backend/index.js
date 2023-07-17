const express = require("express");//Import Express
const app = express(); //call Express
//insert cors package for Cross Origin Resource Sharing (Resource access control)
const cors = require('cors');
//Add cors options
const corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200,
    }
    app.use(cors(corsOptions));

//SOCKETIO
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
 
 // simple route
app.get("/", (req, res) => {
  res.json({ message: "Server is running..." });
    //res.send("Hello world")
});


 
// set port, listen for requests
const PORT = 5100;
/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});*/

httpServer.listen(PORT, () => console.log(`listening on port ${PORT }`));
var users = [];

io.on('connection', (socket) => {
  
    console.log('a user connected ' + socket.id);
    
    //Add user in userlist
        users.push({
          userID: socket.id,
          username: socket.handshake.auth.username,
          room:socket.handshake.auth.room,
          status: "online"
        });
    
    //This is for group chat(Login room setting)
   /* socket.join(socket.handshake.auth.room);
    console.log("User join to room " , socket.handshake.auth.room);   */
    
    console.log("User List " ,users);

    //Login user list for everyone
    io.sockets.emit('broadcast',users);
    
      
  //Chatting
  socket.on('sentMsg', (data) => {   
    console.log("Message " ,data);
    var index = users.map(function(e) { return e.userID; }).indexOf(data.senterid);
    roomName = users[index].room;

    //****Private Message *****
    socket.to(data.receiverid).emit('receiveMsg',{receivername:data.receivername,message:data.message,senterid:data.senterid,senderName:data.senderName}); 
   
    //console.log("Room name " ,roomName);
    //****Group Message (Room) *****
    //io.to(roomName).emit('receiveMsg',{receivername:data.receivername,message:data.message,senterid:data.senterid,senderName:data.senderName});    
    // socket.to(roomName).emit('receiveMsg',{receivername:data.receivername,message:data.message,senterid:data.senterid,senderName:data.senderName});

    //****Send to all ***** Like a notification
    //socket.broadcast.emit('receiveMsg',{receivername:data.receivername,message:data.message,senterid:data.senterid,senderName:data.senderName});
  });

  
    
    socket.on('disconnect', () => {
      
      console.log('a user disconnected! ' + socket.id);
      var index = users.map(function(e) { return e.userID; }).indexOf(socket.id);
      users[index].status = "offline";
      //users.splice(index, 1);
      console.log("Current user list : ",users);
      io.sockets.emit('broadcast', users);
    });

    
  
});

 