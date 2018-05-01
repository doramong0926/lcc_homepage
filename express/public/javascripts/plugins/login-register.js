/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('Register');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal .registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('Login');
    });       
    $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}

function loginAjax(){
    $.post("/users/login", {email: $('#email').val(), password: $('#password').val()}, function( data ) {
        console.info('try to login. ' + email + password);
        if(data.sucess == 'true'){
            window.location.replace("/");            
        } else if(data.sucess == 'true'){
            shakeModal(); 
        }else{
            console.info('data.sucess : ' + data.sucess);
        }
    });
}

function registeAjax(){
    $.post("/users/register", {email: $('#email-register').val(), password: $('#password-register').val()
                                , password_confirmation: $('#password-confirmation-register').val()}, function( data ) {
        if(data.sucess == 'true') {
            window.location.replace("/");
        }
        else{
            shakeModal(); 
        }
    });
}

function logoutAjax(){
    /*   Remove this comments when moving to server
    $.post( "/logout", function( data ) {
            if(data == 1){
                window.location.replace("/home");            
            } else {
                 shakeModal(); 
            }
        });
    */

/*   Simulate error message from the server   */
     shakeModal();
}

function shakeModal(){
    $('#loginModal .modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
             $('input[type="password"]').val('');
             setTimeout( function(){ 
                $('#loginModal .modal-dialog').removeClass('shake'); 
    }, 1000 ); 
}

   