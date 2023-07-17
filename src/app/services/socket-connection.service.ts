import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketConnectionService { 

  currentUserName!:string;
  public users: Array<{userID:string,self:boolean,connected:boolean,username:string,status:string}> = [];
  public messageArray: Array<{senterid:string,senderName:String,message:String,receiverid:string,receivername:string,status:string}> = [];
  //this.socket = io('http://localhost:5100',{ autoConnect: true });
 
  socket = io('http://localhost:5100',{autoConnect: true,
    auth: {
      username: this.getUserName(), room:this.getRoomName()
    },
  });

  
  
  constructor() { }

  newUserJoined(){ 
    
    let observable = new Observable<{socketid:string, username:string}>(oberver =>{
      this.socket.on("broadcast", (data) =>{
        //console.log("user connected ",data);
       // this.users = data;
       this.users =[];
        oberver.next(data);
        data.forEach((user: { userID:string,self:boolean,connected:boolean,username:string,status:string }) => {
          if(user.userID === this.socket.id){
             user.self = true;
             console.log("Current user ", user); 
             this.currentUserName = user.username;
          }
          else{
           this.users.push(user);
           console.log("Other user ", user); 
          }     
         }); 
      });
      return () => {this.socket.disconnect();}
    })

    return observable;   

  }

  sentMessage(msgObj:any){

    console.log("Call send message method");
    this.socket.emit("sentMsg", { receiverid:msgObj.receiverid,receivername:msgObj.receivername,message:msgObj.message,senterid:this.socket.id,senderName:this.currentUserName });
    
  }


  receivedMesage(){ 
    
    let observable = new Observable<{senterid:string,senderName:String,message:String,receiverid:string,receivername:string,status:string}>(oberver =>{
      this.socket.on("receiveMsg", (data) =>{
        console.log("Receice data : ", data);
        oberver.next(data);        
      });
      return () => {this.socket.disconnect();}
    })

    return observable;   

  }

  getUserName(){
    var user_names = [ 'Anbu', 'Kalai', 'Maaran','Aadhira','Sudar','Varsha','Gokul','Neelan','Thanika','Punithan','Kuyily','Akaran','Aathmiga','Anamikan' ,'Boobalan'];
    return user_names[Math.floor(Math.random() * 15)];
  }

  getRoomName(){
    var user_names = [ 'Admin', 'Office', 'Member'];
    return user_names[Math.floor(Math.random() * 3)];
  }



}
