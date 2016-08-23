;(function(){
  // configuracion
  // var config = {
  //   apiKey: "AIzaSyAFK-EvCE2vnUVaxK6SgwCaW-Bg_caVEAQ",
  //   authDomain: "ocapy-b6977.firebaseapp.com",
  //   databaseURL: "https://ocapy-b6977.firebaseio.com",
  //   storageBucket: "ocapy-b6977.appspot.com",
  // };
  // firebase.initializeApp(config);

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDeuOU_-BpTuwIE5heSbvVCEZB4bW-OkQ0",
    authDomain: "pagina-chat.firebaseapp.com",
    databaseURL: "https://pagina-chat.firebaseio.com",
    storageBucket: "pagina-chat.appspot.com",
  };
  firebase.initializeApp(config);


  $("#modal_nick").openModal({dismissible: false});
  // variables
  var dt = new Date();
  var db = firebase.database();
  var inp_nick = document.getElementById('inp_nick');
  var btn_log_start = document.getElementById('btn_log_start');
  var inp_msg = document.getElementById('inp_msg');
  var btn_msg = document.getElementById('btn_msg');
  var ul_chat_g = document.getElementById('chatGeneral');
  var sonido = document.getElementById('player');
  var user = {"id":"",nick:""};
  var user_ref = null;
  var user_ref_key = null;
  var msg_ref = null;
  var rooms = null;
  // eventos
  btn_log_start.addEventListener("click",log);
  window.addEventListener("unload",logOut);
  inp_msg.addEventListener("keypress",keyPressCode);
  btn_msg.addEventListener("click",send);
  ul_chat_g.addEventListener("mouseleave",scrollDown);
  // funciones
  function log() {
    if (inp_nick.value !== "") {
        user.id = md5(dt.getTime());
        user.nick = inp_nick.value;
        app();
    } else {
      var msg = '<span><i class="fa fa-exclamation"></i> No puedes entrar sin nick</span>';
      Materialize.toast(msg, 4000,"white red-text");
    }
  }// fin log

  function app() {
    user_ref = db.ref("/user");
    msg_ref = db.ref("/general");
    rooms = db.ref("/rooms");

    logIn();

    user_ref.on('child_added', addListUser);
    user_ref.on('child_removed',removeListUser);

    msg_ref.on('child_added', addMsg);

    rooms.on("child_added", newRoom);
  }//fin de app

  function logIn(){
    var user_push = user_ref.push({
      id: user.id,
      nick: inp_nick.value
    });

    user_ref_key = user_push.key;

    $('#modal_nick').closeModal();
  }// fin de log in

  function logOut() {
    if (user_ref_key !== null) {
      db.ref("/user/"+user_ref_key).remove();
    }
  }// fin de log out

  function addListUser(data) {

    if (data.val().id == user.id) return;

    var id = data.val().id;

    var $li = $("<li>").addClass("collection-item")
                        .html(data.val().nick)
                        .attr("id",id)
                        .appendTo("#users");

    $li.on("click", function(){
        //console.log('Valor de id' + id);

        

        
          var room = rooms.push({
            creador: user.id,
            amigo: id
          })

          new Chat(room.key, user, "chats", db)
    })
  }// fin addListUser

  function removeListUser(data) {
    $("#"+data.val().id).slideUp('fast',function(){
      $(this).remove();
    });
  }// fin removeListUser

   function keyPressCode(tecla) {
     if (tecla.keyCode == 13) {
       send();
     }
   }// fin keyPressCode

   function send() {
     var msg = inp_msg.value;
     if (msg !== "") {
       inp_msg.value = "";
       msg_ref.push({
         uid:user.id,
         nick:user.nick,
         mensage:msg
       });
     }
   }// fin send

   function addMsg(data) {
     var msg = data.val();
     var html = `<strong>${msg.nick}: </strong><span>${msg.mensage}</span>`;
     var $li = $("<li>").addClass('collection-item').html(html);

     $li = user.id == msg.uid ? $li.css({"color":"#1976d2"}) : $li;

     $("#chatGeneral").append($li);

     sonido.play();

     scrollDown();
   }// fin addMsg

   function scrollDown(){
     var height = ul_chat_g.scrollHeight;
     ul_chat_g.scrollTop = height;
   }

   function newRoom(data){
      if (data.val().amigo == user.id){
        new Chat(data.key, user, "chats", db)
      }

      // if (data.val().creador == user.uid){
      //   new Chat(data.key, user, "chats", database)
      // }
    }

})();
