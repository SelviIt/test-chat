import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

const routes: Routes = [
  
     
  {path:"home",component:AppComponent},
  //{ path: 'login', component: LoginPageComponent },
  
  //{ path: 'previewScreen/:random_number', component: PreviewScreenComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
