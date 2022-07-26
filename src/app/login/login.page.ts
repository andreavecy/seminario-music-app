import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup ,Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authenticate.service';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  validation_messages = {
    email: [
      { type: "require", message: "El email es obligatorio" },
      { type: "pattern", message: "El email no es valido" }
    ]
  };

  errorMessage: any;


  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder, 
    private authService: AuthenticateService,
    private navCtrl: NavController) { 

    this.loginForm = this.formBuilder.group({
      
      email: new FormControl(
        "",
        Validators.compose([  
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]+$")
        ])
      ),

      password: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6)
        ])
      )
    })

  }

  ngOnInit() {
  }

  loginUser(credentials) {
    this.authService.loginUser(credentials).then( (res: any) => {
      Storage.set({key: "isUserLoggedIn", value: 'true'})
      Storage.set({key: "user_id", value: res.user.id})
      this.navCtrl.navigateForward("/menu");
    }).catch( err => {
      this.presentAlert("Opps", "Hubo un error", err)
    })
  }

  async presentAlert(header, subHeader,message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToRegister() {
    this.navCtrl.navigateForward("/register");
  }

}
