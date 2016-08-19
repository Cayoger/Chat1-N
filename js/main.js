;(function(){
  // configuracion
  var config = {
    apiKey: "AIzaSyAFK-EvCE2vnUVaxK6SgwCaW-Bg_caVEAQ",
    authDomain: "ocapy-b6977.firebaseapp.com",
    databaseURL: "https://ocapy-b6977.firebaseio.com",
    storageBucket: "ocapy-b6977.appspot.com",
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
  var user = {"id":"",nick:""};
  var user_ref = null;
  var user_ref_key = null;
  var msg_ref = null;
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

    logIn();

    user_ref.on('child_added', addListUser);
    user_ref.on('child_removed',removeListUser);

    msg_ref.on('child_added', addMsg);
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
    if (data.val().uid == user.uid) return;
    var id = data.val().id;
    var $li = $("<li>").addClass("collection-item")
                        .html(data.val().nick)
                        .attr("id",id)
                        .appendTo("#users");
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
     var html = `<b>${msg.nick}: <b/>
                 <span>${msg.mensage}</span>`;

     var $li = $("<li>").addClass('collection-item')
                       .html(html);

     $("#chatGeneral").append($li);
     scrollDown();
   }// fin addMsg

   function scrollDown(){
     var height = ul_chat_g.scrollHeight;
     ul_chat_g.scrollTop = height;
   }
})();
