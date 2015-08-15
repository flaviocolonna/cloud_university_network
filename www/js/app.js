// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform,$cordovaDialogs) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.service('sharedProperties', function () {
        var userProperties = "";
        var sharedIdCorso = "";
        var sharedEmail = "";
        var sharedIdAppunto = "";
        return {
            getUserProperty: function () {
                return userProperties;
            },
            setUserProperty: function(value) {
                userProperties = value;
            },
            getSharedIdCorso: function () {
                return sharedIdCorso;
            },
            setSharedIdCorso: function(value) {
                sharedIdCorso = value;
            },
            getSharedEmail: function () {
                return sharedEmail;
            },
            setSharedEmail: function(value) {
                sharedEmail = value;
            },
            getSharedIdAppunto: function () {
                return sharedIdAppunto;
            },
            setSharedIdAppunto: function(value) {
                sharedIdAppunto = value;
            },
        };
})
.config(function($stateProvider,$ionicConfigProvider,$urlRouterProvider){
  $ionicConfigProvider.views.forwardCache(true);
  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: "login.html",
    controller: 'login'
  })
  .state('registrazione', {
    url: '/registrazione',
    templateUrl: 'registrazione.html',
    controller: 'registration'
  })
  .state('homepage', {
    url: '/homepage',
    abstract: true,
    cache: false,
    templateUrl: "homepage.html",
    controller: 'HomepageCtrl'
  })
  .state('homepage.messaggi', {
    url: '/messaggi',
     cache: false,
    views: {
        'menuContent' :{
          templateUrl: "messages.html",
          controller: 'Messaggi'
        }
      }
  })
  .state('homepage.profilo', {
    url: '/profilo',
    views: {
        'menuContent' : {
          templateUrl: "profilo.html",
          controller: 'Profilo'
        }
    }
  })
  .state('homepage.chiMiSegue', {
    url: '/chiMiSegue',
    views: {
        'menuContent' : {
          templateUrl: "chiMiSegue.html",
          controller: 'ChiMiSegue'
        }
    }
  })
  .state('homepage.chiSeguo', {
    url: '/chiSeguo',
    views: {
        'menuContent' :{
          templateUrl: "chiSeguo.html",
          controller: 'ChiSeguo'
        }
    }
  })
  .state('homepage.ricercaUtente',{
    url: "/ricercaUtente",
    views:{
      'menuContent':{
        templateUrl: 'ricercaUtente.html',
        controller: 'RicercaUtente'
      }
    }
  })
  .state('homepage.ultimeNews',{
    url: '/ultimeNews',
    cache: false,
    views:{
      'menuContent':{
        templateUrl: 'ultimeNews.html',
        controller: 'UltimeNews'
      }
    }
  })
  .state('homepage.corsi',{
    url: '/corsi',
    views: {
      'menuContent':{
        templateUrl: 'corsi.html',
        controller: 'Corsi'
      }
    }
  })
  .state('homepage.dettagliProfilo',{
    url: '/dettagliProfilo',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'dettagliProfilo.html',
        controller: 'DettagliProfilo'
      }
    },
    resolve: {
      email: function(sharedProperties) {
        return sharedProperties.getSharedEmail()
      }
    }
  })
  .state('homepage.listaAppunti',{
    url: '/listaAppunti',
     cache: false,
    views: {
      'menuContent':{
        templateUrl: 'listaAppunti.html',
        controller: 'ListaAppunti'
      }
    }
  })
  .state('homepage.dettagliAppunto',{
    url: '/dettagliAppunto',
    cache: false,
    views: {
      'menuContent':{
        templateUrl: 'dettagliAppunto.html',
        controller: 'DettagliAppunto'
      }
    }
  })
  .state('homepage.caricaAppunto',{
    url: '/caricaAppunto',
    views: {
      'menuContent':{
        templateUrl: 'caricaAppunto.html',
        controller: 'CaricaAppunto'
      }
    }
  })
  $urlRouterProvider.otherwise("/");
})
.controller('login',function($scope,$http,$cordovaDialogs,$cordovaNetwork,$cordovaToast,$state,sharedProperties){
    $scope.email="";
    $scope.password="";
    $scope.disabled=false;
    $scope.loading=false;
    $scope.sendLoginData = function(){
      if($cordovaNetwork.isOnline()){
      $scope.loading=true;
      $scope.disabled=true;
      var data = {};
      data.email = $scope.email;
      data.password= $scope.password;
      if($scope.email.length>0 && $scope.password.length>0){
        var url = "http://universitynetwork.a2hosted.com/api/ionic/login.php";
        $http({
          url: url,
          method: "POST",
          data: data,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data){
            $scope.loading=false;
            if(data.success==="1"){
              var user = {};
              if(data.user===1){
                user = {
                  email: data.email,
                  ruolo: data.ruolo,
                  nome: data.nome,
                  cognome: data.cognome,
                  type: 1,
                  image:data.image
                };
              }else{
                user = {
                  email: data.email,
                  dataDiNascita: data.data_nascita,
                  luogoDiNascita: data.luogo_nascita,
                  corso: data.corso,
                  annoImmatricolazione: data.anno_immatricolazione,
                  nome: data.nome,
                  cognome: data.cognome,
                  image:data.image,
                  type: 0
                };
              }
              sharedProperties.setUserProperty(user);
              $state.go("homepage.profilo");
            }else{
               $cordovaToast.showLongBottom("Credenziali non valide");
            }
            $scope.disabled=false;
            $scope.loading=false;
          }).error(function(data){
            $scope.disabled=false;
            $scope.loading=false;
            $cordovaToast.showLongBottom("Errore invio dati");
          });
      }else{
        $scope.disabled=false;
        $scope.loading=false;
        $cordovaToast.showLongBottom("Completa l'inserimento dei dati");
      }
    }else{
      $cordovaToast.showLongBottom("Errore connessione internet.");
  }
};
})
.controller('registration',function($scope,$http,$ionicActionSheet,$cordovaDatePicker,$cordovaToast,$ionicModal,$cordovaImagePicker,sharedProperties,$cordovaCamera){

  $scope.user="-1";
  $scope.corso="-1";
  $scope.teacher_type="-1";
  $scope.nome="";
  $scope.cognome="";
  $scope.email="";
  $scope.password="";
  $scope.date="";
  $scope.immatricolazione="";
  $scope.luogo_nascita="";
  $scope.file = "";

  $scope.loadPhoto = function(){
    $ionicActionSheet.show({
     buttons: [
       { text: 'Scatta foto' },
       { text: 'Seleziona foto' }
     ],
     titleText: "<h4 style='text-align:center;'>Carica foto profilo<h4>",
     cancelText: 'Annulla',
     buttonClicked: function(index) {
         /* Scatto la foto*/
          if(index===0){
            var options = {
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              encodingType: Camera.EncodingType.JPEG,
              allowEdit: true,
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
              var file="data:image/jpg;base64," + imageURI;
              $scope.file = imageURI;
              var image = document.getElementById('myimage');
              image.src = file;
              $cordovaToast.showShortBottom("Foto acquisita");
            });
        }else if(index===1){ //seleziono la foto dalla galleria
          var options = {
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            correctOrientation: true,
            cameraDirection: 0,
            allowEdit: true
          };
          $cordovaCamera.getPicture(options).then(function(imageURI) {
            var file="data:image/jpg;base64," + imageURI;
            $scope.file=imageURI;
            var image = document.getElementById('myimage');
            image.src = file;
            $cordovaToast.showShortBottom("Foto acquisita");
        });
        }
      return true;
    }
    });
  };
  $ionicModal.fromTemplateUrl('viewPhoto.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function(){
    $scope.modal.hide();
  };
  $scope.openModal = function(){
    $scope.modal.show();
    var img = document.getElementById('modalImg');
    if($scope.file.length>0){
      var imgTr = document.getElementById('myimage');
      img.src=imgTr.src;
    }else{
      img.src="img/default.png";
    }
  };
  $scope.sendRegistrationData=function(){
    $scope.loading=true;
    var date_limit = new Date(568024668000);
    var current_date = new Date();
    var date_limit2 = new Date(current_date-date_limit);
    if(this.nome.length>0 && this.cognome.length>0 && this.email.length>0 && this.password.length>0 && $scope.file.length>0){
      if(this.user=="1" && this.teacher_type!="-1"){
        var data_send = {
          nome: this.nome,
          cognome: this.cognome,
          email: this.email,
          password: this.password,
          ruolo: this.teacher_type,
          file: $scope.file,
          user: "1"
        };
        $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/registrazione.php",
          method: "POST",
          data: data_send,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            $scope.loading=false;
          if(data.success=="1"){
            $cordovaToast.showLongBottom("Registrazione effettuata con successo.");
            var user = {
                email: data.email,
                ruolo: data.ruolo,
                nome: data.nome,
                cognome: data.cognome,
                type: 1,
                image:data.image
              };
              sharedProperties.setUserProperty(user);
              $state.go("homepage.profilo");
          }else{
            if(data.reply=='true'){
                $cordovaToast.showLongBottom("Email già presente");
            }else{
                $cordovaToast.showLongBottom("Errore durante la fase di registrazione.");
            }
          }
          }).error(function(){
              $scope.loading=false;
              $cordovaToast.showLongBottom("Errore durante la fase di invio");
          });
      }else if(this.user=="0" && this.immatricolazione>2010 && this.immatricolazione<2017 && this.luogo_nascita.length>0 && this.corso!="-1"){
          var dateselected = new Date($scope.date);
          if(dateselected<=date_limit2){
            var data_send = {
              nome: this.nome,
              cognome: this.cognome,
              email: this.email,
              password: this.password,
              data_nascita: $scope.date.getFullYear()+"-"+$scope.date.getMonth()+"-"+$scope.date.getDate(),
              luogo_nascita:this.luogo_nascita,
              immatricolazione: this.immatricolazione,
              corso: this.corso,
              file: $scope.file,
              user: "0"
            };
            $http({
              url:"http://universitynetwork.a2hosted.com/api/ionic/registrazione.php",
              method: "POST",
              data: data_send,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){
                $scope.loading=false;
              if(data.success=="1"){
                $cordovaToast.showShortBottom("Registrazione effettuata con successo.");
                var user = {
                    email: data_send.email,
                    dataDiNascita: data_send.data_nascita,
                    luogoDiNascita: data_send.luogo_nascita,
                    corso: data_send.corso,
                    annoImmatricolazione: data_send.immatricolazione,
                    nome: data_send.nome,
                    cognome: data_send.cognome,
                    image: "data:image/jpg;base64," + $scope.file ,
                    type: 0
                  };
                sharedProperties.setUserProperty(user);
                $state.go("homepage.profilo");
              }else{
                if(data.reply=='true'){
                    $cordovaToast.showLongBottom("Email già presente");
                }else{
                    $cordovaToast.showLongBottom("Errore durante la fase di registrazione.");
                }
              }
            }).error(function(e){
                  $scope.loading=false;
                  $cordovaToast.showLongBottom("Errore durante la fase di invio.");
              });
          }else{
          $scope.loading=false;
            $cordovaToast.showLongBottom("Devi essere maggiorenne per iscriverti!");
        }
      }else{
        $scope.loading=false;
        $cordovaToast.showLongBottom("Alcuni campi risultano mancanti o errati l'inserimento dei dati, controllare:\n1: Immatricolazione \n2: Luogo di nascita\n3: Data di nascita");
      }
    }else{
      $scope.loading=false;
      $cordovaToast.showLongBottom("Alcuni campi risultano mancanti o errati l'inserimento dei dati, controllare: \n1: Nome\n2: Cognome\n3: Email\n4: Password");
    }
  }
  $scope.selectDate = function(){
    var options = {
      date: new Date(),
      mode: 'date', // or 'time'
      allowOldDates: true,
      allowFutureDates: false,
      doneButtonLabel: 'DONE',
      doneButtonColor: '#F2F3F4',
      cancelButtonLabel: 'CANCEL',
      cancelButtonColor: '#000000'
    };
    $cordovaDatePicker.show(options).then(function(date){
      var dateselected = new Date(date);
      $scope.date=date;
      var mydate = document.getElementById('data_nascita');
      mydate.value=dateselected.getDate()+"/"+dateselected.getMonth()+"/"+dateselected.getFullYear();
    });
  }
})
.controller("HomepageCtrl",function($scope,$ionicSideMenuDelegate){
  $scope.menuOptions=[
    {
      title:"Profilo",
      url:"homepage.profilo"
    },
    {
      title:"Messaggi",
      url:"homepage.messaggi"
    },
    {
      title:"Ricerca utente",
      url:"homepage.ricercaUtente"
    },
    {
      title:"Chi seguo",
      url:"homepage.chiSeguo"
    },
    {
      title:"Chi mi segue",
      url:"homepage.chiMiSegue"
    },
    {
      title:"Corsi",
      url:"homepage.corsi"
    },
    {
      title:"Ultime news",
      url:"homepage.ultimeNews"
    }
  ];
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

})
.controller("Profilo",function($scope,$cordovaDialogs,$ionicPopover,$cordovaToast,$ionicSideMenuDelegate,sharedProperties,$state,$http){
  $scope.user=sharedProperties.getUserProperty();
  $scope.loading=false;
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.removeAccount = function(){
    $scope.popover.hide();
    $cordovaDialogs.confirm("Si è sicuri di voler cancellare il proprio account?", "Eliminazione account", ['Conferma','Annulla']).then(function(buttonIndex) {
      if(buttonIndex===0){
        $scope.loading=true;
        $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/removeAccount.php",
          data: {email:sharedProperties.getUserProperty().email},
          method: "POST",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            $scope.loading=false;
          if(data.success=="1"){
            $cordovaDialogs.alert("Account rimosso con successo!", "Cancellazione account", "OK");
            $state.go('login');
          }else{
            $cordovaDialogs.alert("Errore durante la fase di rimozione dell'account.", "Cancellazione account", "OK");
          }
          }).error(function(){
              $scope.loading=false;
              $cordovaDialogs.alert("Errore durante la fase di invio dei dati.", "Cancellazione account", "OK");
          });
      }
    });
  }
  $scope.changePassword = function(){
    $scope.popover.hide();
    $cordovaDialogs.prompt('Nuova password', 'Cambio password', ['Conferma','Annulla'], '******')
    .then(function(result) {
      var input = result.input1;
      // no button = 0, 'OK' = 1, 'Cancel' = 2
      var btnIndex = result.buttonIndex;
      if(btnIndex===1 && input.length>0){
        $scope.loading=true;
        $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/cambioPassword.php",
          data: {email:sharedProperties.getUserProperty().email,password:input},
          method: "POST",
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            $scope.loading=false;
          if(data.success=="1"){
            $cordovaToast.showShortBottom("Password cambiata con successo!");
            $state.go('login');
          }else{
            $cordovaToast.showShortBottom("Errore durante la fase di cambio della password.");
          }
          }).error(function(){
            $scope.loading=false;
              $cordovaToast.showShortBottom("Errore durante la fase di invio dei dati.");
          });
      }
    });
  }
  $scope.logout = function(){
      $scope.popover.hide();
      $state.go("login");
  }
  $scope.edit = true;
  $scope.header="";
  $ionicPopover.fromTemplateUrl('profileSettings.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
})
.controller("Messaggi",function($scope,$ionicHistory,$cordovaToast,$state,$http,sharedProperties){
    $scope.loading=true;
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/listMessages.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.loading=false;
        $scope.messages = data;
      }).error(function(){
        $scope.loading=false;
          $cordovaToast.alert("Errore durante la fase di recupero messaggi.", "Recupero messaggi", "OK");
      });
  $scope.sent  = false;
  $scope.received = false;
  $scope.showSent = function(){
    $scope.sent=true;
    $scope.received=false;
  }
  $scope.showReceived = function(){
    $scope.received=true;
    $scope.sent=false;
  }
})
.controller("ChiSeguo",function($scope,$ionicPopover,$ionicModal,$cordovaToast,$state,$http,sharedProperties){
  $scope.testo = "";
  $scope.oggetto = "";
  $scope.loading=true;
  $scope.currentUser="";
  $ionicPopover.fromTemplateUrl('userOptions.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $ionicModal.fromTemplateUrl('sendMessage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.downloadFollowedByMe = function(){
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/listFollower.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.loading=false;
        $scope.users = data;
    }).error(function(){
        $scope.loading=false;
       $cordovaToast.showShortBottom("Errore durante la fase di recupero messaggi.");
    });
  };
  $scope.closeModal = function(){
    $scope.modal.hide();
  }
  $scope.openMessageModal = function(){
    $scope.popover.hide();
    $scope.modal.show();
    $scope.destinatario = $scope.currentUser.email;
    $scope.loading = false;
  }
  $scope.openMessageBroadcast = function(){
    $scope.destinatario="Tutti";
    $scope.popover.hide();
    $scope.modal.show();
    $scope.loading = false;
  }
  $scope.manageFollow=function(){
    $scope.loading=true;
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.currentUser.email,op:1},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.loading=false;
      if(data.success=='1'){
        $scope.downloadFollowedByMe();
        $cordovaToast.showShortBottom("Hai iniziato a seguire "+$scope.currentUser.email);
      }else{
        $cordovaToast.showShortBottom("Errore durante l'operazione");
      }
      $scope.popover.hide();
    }).error(function(){
      $scope.popover.hide();
        $scope.loading=false;
        $cordovaToast.showShortBottom("Errore durante l'operazione");
    });
  }
  $scope.manageUnFollow = function(){
    $scope.loading=true;
    $http({
            url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
            method: "POST",
            data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.currentUser.email,op:0},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data){
              $scope.loading=false;
            if(data.success=='1'){
              $scope.downloadFollowedByMe();
              $cordovaToast.showShortBottom("Hai smesso di seguire "+$scope.currentUser.email);
            }else{
              $cordovaToast.showShortBottom("Errore durante l'operazione");
            }
             $scope.popover.hide();
          }).error(function(){
            $scope.loading=false;
            $scope.popover.hide();
            $cordovaToast.showShortBottom("Errore durante l'operazione");
        });
  }

  $scope.sendToUser = function(){
    if($scope.destinatario=='Tutti'){
      $http({
            url:"http://universitynetwork.a2hosted.com/api/ionic/sendBroadcast.php",
            method: "POST",
            data: {email_mittente:sharedProperties.getUserProperty().email,titolo:this.oggetto,descrizione:this.testo},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data){
            if(data.success=='1'){
              $cordovaToast.showShortBottom("Messaggio inviato con successo");
            }else{
              $cordovaToast.showShortBottom("Errore invio messaggio");
            }
             $scope.modal.hide();
          }).error(function(){
             $cordovaToast.showShortBottom("Errore invio messaggio");
        });
    }else{
      $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/sendMessage.php",
          method: "POST",
          data: {email_mittente:sharedProperties.getUserProperty().email,email_destinatario:$scope.destinatario,titolo:this.oggetto,descrizione:this.testo },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          if(data.success=='1'){
            $cordovaToast.showShortBottom("Messaggio inviato con successo");
          }else{
            $cordovaToast.showShortBottom("Errore invio messaggio");
          }
           $scope.modal.hide();
        }).error(function(){
           $cordovaToast.showShortBottom("Errore invio messaggio");
      });
    }
  }
  $scope.userOptions = function($event,currentUser) {
    $scope.currentUser = currentUser;
    if($scope.currentUser.follower===true){
      $scope.follow = false;
      $scope.unfollow = true;
      $scope.sendMessage = true;
    }else{
      $scope.follow = true;
      $scope.unfollow = false;
      $scope.sendMessage = false;
    }
    $scope.popover.show($event);
  };
  $scope.viewProfile=function(user){
    $scope.popover.hide();
    sharedProperties.setSharedEmail(user.email);
    $state.go("homepage.dettagliProfilo");
  }
  $scope.downloadFollowedByMe(); //download lista followed
})
.controller("ChiMiSegue",function($scope,$ionicPopover,$ionicModal,$cordovaToast,$state,$http,sharedProperties,$cordovaDialogs){
  $scope.loading=true;
  $scope.currentUser="";
  $ionicPopover.fromTemplateUrl('userOptions.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $ionicModal.fromTemplateUrl('sendMessage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.downloadMyFollowers = function(){
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/listFollowed.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.loading=false;
        $scope.users = data;
      }).error(function(){
        $scope.loading=false;
         $cordovaToast.showShortBottom("Errore recupero messaggi");
      });
  }
  $scope.closeModal = function(){
    $scope.modal.hide();
  }
  $scope.openMessageModal = function(){
    $scope.popover.hide();
    $scope.modal.show();
    $scope.destinatario = $scope.currentUser.email;
    $scope.testo = "";
    $scope.oggetto = "";
  }
  $scope.sendToUser = function(){
    $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/sendMessage.php",
          method: "POST",
          data: {email_mittente:sharedProperties.getUserProperty().email,email_destinatario:$scope.destinatario,titolo:this.oggetto,descrizione:this.testo },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          if(data.success=='1'){
            $cordovaToast.showShortBottom("Messaggio inviato con successo");
          }else{
            $cordovaToast.showShortBottom("Errore durante l'operazione");
          }
           $scope.modal.hide();
        }).error(function(){
          $cordovaToast.showShortBottom("Errore durante l'operazione");
      });
  }
  $scope.manageFollow=function(){
      $scope.loading=true;
    $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
          method: "POST",
          data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.currentUser.email,op:1},
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
            $scope.loading=false;
          if(data.success=='1'){
            $scope.downloadMyFollowers();
            $cordovaToast.showShortBottom("Hai iniziato a seguire "+$scope.currentUser.email);
          }else{
            $cordovaToast.showShortBottom("Errore durante l'operazione");
          }
          $scope.popover.hide();
        }).error(function(){
          $scope.popover.hide();
          $cordovaToast.showShortBottom("Errore durante l'operazione");
      });
  }
  $scope.manageUnFollow = function(){
      $scope.loading=true;
      $http({
            url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
            method: "POST",
            data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.currentUser.email,op:0},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data){
              $scope.loading=false;
            if(data.success=='1'){
              $scope.downloadMyFollowers();
              $cordovaToast.showShortBottom("Hai smesso di seguire "+$scope.currentUser.email);
            }else{
              $cordovaToast.showShortBottom("Errore durante l'operazione");
            }
             $scope.popover.hide();
          }).error(function(){
            $scope.popover.hide();
            $scope.loading=false;
            $cordovaToast.showShortBottom("Errore durante l'operazione");
        });
  }
  $scope.userOptions = function($event,user) {
    $scope.currentUser = user;
    if($scope.currentUser.follower===true){
      $scope.follow = false;
      $scope.unfollow = true;
      $scope.sendMessage = true;
    }else{
      $scope.follow = true;
      $scope.unfollow = false;
      $scope.sendMessage = false;
    }
    $scope.popover.show($event);
  };
  $scope.viewProfile=function(user){
    $scope.popover.hide();
    sharedProperties.setSharedEmail(user.email);
    $state.go("homepage.dettagliProfilo");
  }
  $scope.downloadMyFollowers();
})
.controller('RicercaUtente',function($scope,$ionicPopover,sharedProperties,$state,$ionicModal,$http,$cordovaToast){
  $scope.textSearched=""; //input texted
  $scope.showTitle = false;
  $scope.loading=false;
  $ionicPopover.fromTemplateUrl('userOptions.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $ionicModal.fromTemplateUrl('sendMessage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeModal = function(){
      $scope.modal.hide();
  }
  $scope.openMessageModal = function(){
    $scope.modal.show();
    $scope.destinatario = $scope.currentUser.email;
    $scope.testo = "";
    $scope.oggetto = "";
  }
  $scope.manageFollow=function(){
    $scope.loading=true;
    $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
          method: "POST",
          data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.currentUser.email,op:1},
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          $scope.loading=false;
          if(data.success=='1'){
            $scope.users={};
            $scope.find();
            $scope.$apply;
            $cordovaToast.showShortBottom("Hai iniziato a seguire "+$scope.currentUser.email);
          }else{
            $cordovaToast.showShortBottom("Errore durante l'operazione");
          }
           $scope.popover.hide();
        }).error(function(){
          $cordovaToast.showShortBottom("Errore durante l'operazione");
      });
  }
  $scope.manageUnFollow = function(){
    $scope.loading=true;
    $http({
            url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
            method: "POST",
            data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.currentUser.email,op:0},
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data){
            $scope.loading=false;
            if(data.success=='1'){
              $scope.find();
              $scope.$apply;
              $cordovaToast.showShortBottom("Hai smesso di seguire "+$scope.currentUser.email);
            }else{
             $cordovaToast.showShortBottom("Errore durante l'operazione");
            }
             $scope.popover.hide();
          }).error(function(){
            $cordovaToast.showShortBottom("Errore durante l'operazione");
        });
  }
  $scope.sendToUser = function(){
    $http({
          url:"http://universitynetwork.a2hosted/api/ionic/sendMessage.php",
          method: "POST",
          data: {email_mittente:sharedProperties.getUserProperty().email,email_destinatario:$scope.destinatario,titolo:this.oggetto,descrizione:this.testo },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          if(data.success=='1'){
           $cordovaToast.showShortBottom("Messaggio inviato con successo");
          }else{
          $cordovaToast.showShortBottom("Errore invio messaggio");
          }
           $scope.modal.hide();
        }).error(function(){
        $cordovaToast.showShortBottom("Errore invio messaggio");
      });
  }
  $scope.viewProfile=function(user){
    $scope.popover.hide();
    sharedProperties.setSharedEmail(user.email);
    $state.go("homepage.dettagliProfilo");
  }
  $scope.userOptions = function($event,user) {
    $scope.currentUser = user;
    if($scope.currentUser.follower===true){
      $scope.follow = false;
      $scope.unfollow = true;
      $scope.sendMessage = true;
    }else{
      $scope.follow = true;
      $scope.unfollow = false;
      $scope.sendMessage = false;
    }
    $scope.popover.show($event);
  };
  $scope.find = function(){
    $scope.showTitle = true;
    $scope.loading=true;
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/ricercaUtente.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email,testo:angular.element(document.getElementById('inputSearch')).val()},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
        $scope.loading=false;
        $scope.users = data;
      }).error(function(){
          $scope.loading=false;
          $cordovaToast.showShortBottom("Errore operazione");
      });
  }
})
.controller('UltimeNews',function($scope,sharedProperties,$state,$ionicPopover,$ionicPopup,$http,$cordovaToast,$cordovaDialogs,$ionicModal){
  $scope.teacher = sharedProperties.getUserProperty().type===1 ? true : false;
  $scope.oggetto="";
  $scope.testo="";
  $scope.oggettoEdit="";
  $scope.testoEdit="";
  $scope.loading = true;
  $ionicPopover.fromTemplateUrl('newsOptions.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $ionicModal.fromTemplateUrl('editNews.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $ionicModal.fromTemplateUrl('newNews.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modalNew = modal;
  });
  $scope.downloadNews = function(){
    $scope.loading=true;
    $http({
        url:"http://universitynetwork.a2hosted.com/api/ionic/listaNews.php",
        method: "POST",
        data: {email:sharedProperties.getUserProperty().email,type:sharedProperties.getUserProperty().type},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data){
        $scope.loading=false;
        $scope.news = data;
        $scope.$apply;
      }).error(function(){
          $scope.loading=false;
          $cordovaToast.showShortBottom("Errore operazione");
      });
  }
  $scope.newsOptions = function($event,news) {
    if($scope.teacher){
      $scope.currentNews = news;
      $scope.testoEdit=news.testo;
      $scope.oggettoEdit=news.oggetto;
      $scope.$apply;
      $scope.popover.show($event);
    }
  };
  $scope.removeNews = function(){
    $ionicPopup.confirm({
     title: 'Eliminazione news',
     template: 'Si è sicuri di eliminare la news selezionata?'
     }).then(function(res) {
       $scope.popover.hide();
     if(res) {
       $http({
           url:"http://universitynetwork.a2hosted.com/api/ionic/removeNews.php",
           method: "POST",
           data: {id:$scope.currentNews.id},
           headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
         }).success(function(data){
            $scope.downloadNews();
            $cordovaToast.showShortBottom("Operazione effettuata");
         }).error(function(){
             $cordovaToast.showShortBottom("Errore operazione");
         });
     } else {
          $cordovaToast.showShortBottom("Operazione annullata.");
     }
   });
  }
  $scope.openModalEdit = function(){
    $scope.modal.show();
  }
  $scope.closeModalEdit = function(){
    $scope.modal.hide();
    $scope.popover.hide();
  }
  $scope.openModalNew = function(){
    $scope.modalNew.show();
  }
  $scope.closeModalNew = function(){
    $scope.modalNew.hide();
  }
  $scope.loadNewNews = function(){
    $http({
        url:"http://universitynetwork.a2hosted.com/api/ionic/newNews.php",
        method: "POST",
        data: {oggetto:this.oggetto,testo:this.testo,email:sharedProperties.getUserProperty().email},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data){
        $scope.loading=false;
        $scope.closeModalNew();
        $scope.downloadNews();
      }).error(function(){
          $scope.loading=false;
          $cordovaToast.showShortBottom("Errore operazione");
      });
  }
  $scope.loadEditNews = function(){
    $http({
        url:"http://universitynetwork.a2hosted.com/api/ionic/editNews.php",
        method: "POST",
        data: {oggetto:this.oggettoEdit,testo:this.testoEdit,email:sharedProperties.getUserProperty().email,id:$scope.currentNews.id},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data){
        $scope.closeModalEdit();
        $scope.popover.hide();
        $scope.downloadNews();
      }).error(function(){
          $cordovaToast.showShortBottom("Errore operazione");
      });
  }
  $scope.downloadNews();
})
.controller('Corsi',function($scope,sharedProperties,$cordovaToast,$ionicPopover,$state,$http,$cordovaDialogs){
  $scope.teacher = sharedProperties.getUserProperty().type===1 ? true : false;
  $scope.loading = true;
  $ionicPopover.fromTemplateUrl('corsiOptions.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.downloadCorsi = function(){
    $scope.loading=true;
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/listaCorsi.php"
    }).success(function(data){
        $scope.loading=false;
        $scope.corsi = data;
      }).error(function(){
          $scope.loading=false;
          $cordovaToast.showShortBottom("Errore operazione");
    });
  }
  $scope.corsiOptions = function($event,id) {
      $scope.currentCorso = id;
      sharedProperties.setSharedIdCorso(id);
      $scope.popover.show($event);
  };
  $scope.viewAppunti=function(){
    $scope.popover.hide();
    $state.go('homepage.listaAppunti');
  }
  $scope.insertAppunto = function(){
    $scope.popover.hide();
    $state.go("homepage.caricaAppunto");
  }
  $scope.downloadCorsi();
})
.controller("DettagliProfilo",function($scope,$cordovaInAppBrowser,$http,$ionicPopover,sharedProperties,$cordovaToast,$ionicModal,$state,$cordovaDialogs,email){
  $scope.loading=true;
  var img = document.getElementById("imgProfile");
  $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/profiloSearched.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email,email_searched:email},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
      $scope.loading=false;
      img.src=data.image;
      $scope.user = data;
      $scope.follow = !$scope.user.follower;
      $scope.unfollow=$scope.user.follower;
      $scope.sendMessage=$scope.user.follower;

    }).error(function(){
        $scope.loading=false;
        $cordovaToast.showShortBottom("Errore operazione");
    });
  $ionicPopover.fromTemplateUrl('userDetailsOptions.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $ionicModal.fromTemplateUrl('sendMessage.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.goToStudio = function(){
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };
    if(ionic.Platform.isAndroid()){
        $cordovaInAppBrowser.open("geo:0,0?q=Mura Anteo Zamboni,Bologna","_system",options);
    }else if(ionic.Platform.isIOS()){
        $cordovaInAppBrowser.open("http://maps.apple.com/?q=Mura Anteo Zamboni,Bologna&ll=0,0&near=0,0","_system",options);
    }
  }
  $scope.call=function(){
    $cordovaInAppBrowser.open("tel:0519189392","_system");
  }
  $scope.manageFollow=function(){
    $scope.loading=true;
    $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
          method: "POST",
          data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.user.email,op:1},
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          $scope.loading=false;
          $scope.popover.hide();
          if(data.success=='1'){
            $scope.user.follower=true;
            $scope.follow = !$scope.user.follower;
            $scope.unfollow=$scope.user.follower;
            $scope.sendMessage=$scope.user.follower;
            $scope.$apply;
            $cordovaToast.showShortBottom("Hai iniziato a seguire "+$scope.user.email);
          }else{
            $cordovaToast.showShortBottom("Errore durante l'operazione");
          }
        }).error(function(){
          $scope.loading=false;
           $scope.popover.hide();
          $cordovaToast.showShortBottom("Errore durante l'operazione");
      });
  }
  $scope.manageUnFollow = function(){
    $scope.loading=true;
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/manageFollower.php",
      method: "POST",
      data: {email:sharedProperties.getUserProperty().email,email_followed:$scope.user.email,op:0},
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).success(function(data){
      if(data.success=='1'){
        $scope.user.follower=false;
        $scope.follow = !$scope.user.follower;
        $scope.unfollow=$scope.user.follower;
        $scope.sendMessage=$scope.user.follower;
        $scope.$apply;
        $cordovaToast.showShortBottom("Hai smesso di seguire "+$scope.user.email);
      }else{
        $cordovaToast.showShortBottom("Errore durante l'operazione");
      }
      $scope.loading=false;
       $scope.popover.hide();
    }).error(function(){
      $scope.loading=false;
       $scope.popover.hide();
      $cordovaToast.showShortBottom("Errore durante l'operazione");
  });
  }
  $scope.closeModal = function(){
      $scope.modal.hide();
  }
  $scope.openMessageModal = function(){
    $scope.modal.show();
    $scope.destinatario = $scope.user.email;
    $scope.testo = "";
    $scope.oggetto = "";
  }
  $scope.sendToUser = function(){
    $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/sendMessage.php",
          method: "POST",
          data: {email_mittente:sharedProperties.getUserProperty().email,email_destinatario:$scope.destinatario,titolo:this.oggetto,descrizione:this.testo },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          console.log(data);
          if(data.success=='1'){
           $cordovaToast.showShortBottom("Messaggio inviato!");
          }else{
             $cordovaToast.showShortBottom("Messaggio non inviato!");
          }
           $scope.modal.hide();
        }).error(function(){
             $cordovaToast.showShortBottom("Errore operazione!");
      });
  }
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
})
.controller('ListaAppunti',function($scope,sharedProperties,$cordovaToast,$ionicPopover,$state,$http){
  $http({
        url:"http://universitynetwork.a2hosted.com/api/ionic/listaAppunti.php",
        method: "POST",
        data: {idCorso:sharedProperties.getSharedIdCorso() },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data){
        $scope.lista=data;
      }).error(function(){
         $cordovaToast.showShortBottom("Errore operazione!");
    });
  $scope.viewDetails=function(id){
    sharedProperties.setSharedIdAppunto(id);
    $state.go("homepage.dettagliAppunto");
  }
})
.controller('DettagliAppunto',function($scope,sharedProperties,$cordovaToast,$ionicPopover,$state,$ionicModal,$http){
  $scope.valutazione_commento="";
  $scope.descrizione_commento="";
  $scope.loading=true;
  $http({
        url:"http://universitynetwork.a2hosted.com/api/ionic/dettagliAppunto.php",
        method: "POST",
        data: {idAppunto:sharedProperties.getSharedIdAppunto(),email:sharedProperties.getUserProperty().email},
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data){
        $scope.loading=false;
        $scope.appunto=data;
      }).error(function(){
        $scope.loading=false;
        $cordovaToast.showShortBottom("Errore operazione");
    });
  $ionicModal.fromTemplateUrl('commenta.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.uploadComment = function(){
      $scope.modal.hide();
  }
  $scope.closeModal = function(){
      $scope.modal.hide();
  }
  $scope.comment = function(){
      $scope.modal.show();
  }
  $scope.uploadComment = function(){
    if(this.descrizione_commento.length>0 && this.valutazione_commento>=0 && this.valutazione_commento<=5){
    $http({
          url:"http://universitynetwork.a2hosted.com/api/ionic/insertCommento.php",
          method: "POST",
          data: {idAppunto:sharedProperties.getSharedIdAppunto(),testo: this.descrizione_commento ,valutazione:this.valutazione_commento ,email:sharedProperties.getUserProperty().email},
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data){
          if(data.success=="1"){
              $cordovaToast.showShortBottom("Commento caricato con successo");
          }else{
              $cordovaToast.showShortBottom("Errore operazione");
          }
          $scope.modal.hide();
        }).error(function(){
          $scope.modal.hide();
            $cordovaToast.showShortBottom("Errore operazione");
      });
    }else{
        $cordovaToast.showShortBottom("Compilare correttamente i campi!");
    }
}
})
.controller("CaricaAppunto",function($scope,$http,$cordovaToast,sharedProperties,fileChooser){
  $scope.titolo="";
  $scope.loading=false;
  $scope.descrizione="";
  $scope.uploadFile = function(){
      ionic.trigger('click', { target: document.getElementById('file') });
  }
  angular.element(document.getElementById('file')).on('change',function(event) {
    var file = event.target.files[0];
    $scope.file=file;
    $scope.$apply();
  });
  $scope.uploadAppunto = function(){
    $scope.loading=true;
    var form = new FormData();
    form.append("idcorso",sharedProperties.getSharedIdCorso());
    form.append("file",$scope.file);
    form.append("email",sharedProperties.getUserProperty().email);
    form.append("titolo",this.titolo);
    form.append("descrizione",this.descrizione);
    $http({
      url:"http://universitynetwork.a2hosted.com/api/ionic/creaAppunto.php",
      method: "POST",
      data: form,
      headers: { 'Content-Type': undefined }
    }).success(function(data){
      $cordovaToast.showLongBottom("Appunto caricato").
      $scope.loading=false;
      }).error(function(){
        $scope.loading=false;
        $cordovaToast.showLongBottom("Errore durante l'operazione");
      });
  }
})
