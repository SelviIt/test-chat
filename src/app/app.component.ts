import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { SocketConnectionService } from './services/socket-connection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test_chat';
  selectedUser = "";
  selectedUserId = "";
  inputMessage = "";
  constructor(private authService: AuthenticationService,public auth: AuthenticationService,
    public socketService: SocketConnectionService ) 
    {

      this.socketService.newUserJoined()
      .subscribe(res => {
        console.log(res);
      });

      this.socketService.receivedMesage()
      .subscribe(res => {
        console.log(res);
        this.socketService.messageArray.push({ receiverid:res.receiverid,receivername:res.receivername,message:res.message,
          senterid: res.senterid, senderName: res.senderName,status: "receive" });
      });

    }

    onSelectUser(i:number):void{
      this.selectedUser = this.socketService.users[i].username;
      this.selectedUserId = this.socketService.users[i].userID;
    }

    getStatusColor(status: string): string | any | undefined  {    
      if (status){
        switch(status) {
          case ('online'):
          return 'online';
          break;
        
          case ('offline'):
            return 'offline';
            break;  
        }
      }          
      else
          return 'busy';
    }

    onSentMessage():void{

      console.log("On click send message")
      this.socketService.sentMessage({receiverid:this.selectedUserId,receivername:this.selectedUser,message:this.inputMessage});//,senderName:this.socketService.currentUserName 

      this.socketService.messageArray.push({ receiverid:this.selectedUserId,receivername:this.selectedUser,message:this.inputMessage,
        senterid: this.socketService.socket.id, senderName: this.socketService.currentUserName,status: "sent" });
      }

}
