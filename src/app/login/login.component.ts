import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../modelos/usuario.modelo';

declare function init_plugins();
declare const gapi: any;
  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  id: string
  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor(public router: Router,
              public usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if(this.email.length > 1){      
      this.recuerdame = true;
    }
  }



  googleInit(){
  
    gapi.load('auth2', () => {

      this.auth2 = gapi.auth2.init({
        client_id: '479832660394-sgs7qt0fuar53n5vhcq7frfe2n6kthd3.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));

    });

  }


  attachSignin(element){

    this.auth2.attachClickHandler(element, {}, (googleUser) => {

      // let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;

      this.usuarioService.loginGoogle(token)
            .subscribe( () => {

              window.location.href = "#/dashboard"


            });
      

    });

  }

  ingresar(forma: NgForm){

    console.log(this.recuerdame )

    if(forma.invalid){

      return;

    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password);


          this.usuarioService.login( usuario, forma.value.recuerdame)
                        .subscribe( correcto => {
                            
                          this.router.navigate(['/dashboard']);
      
                        });
      
                      }      
          // this.router.navigate(['/dashboard']);
  

}
  