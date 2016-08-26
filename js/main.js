(function() {
  // abre el modal
  $("#modal_nick").openModal({dismissible: false});
  // agrega la configuracion
  var config = {
    apiKey: "AIzaSyAFK-EvCE2vnUVaxK6SgwCaW-Bg_caVEAQ",
    authDomain: "ocapy-b6977.firebaseapp.com",
    databaseURL: "https://ocapy-b6977.firebaseio.com",
    storageBucket: "ocapy-b6977.appspot.com",
  };
  // se inicia la app
  firebase.initializeApp(config);
  // variables
  var dt = new Date();
  var db = firebase.database();
  self.user = {id:"",nick:"",sala:""};
  var btn_access = $('#btn_access');
  var btn_msg = $('#btn_msg');
  var user_ref = null;
  var user_ref_key = null;
  var msg_ref = null;
  var inp_msg = document.getElementById('inp_msg');
  var ul_room = document.getElementById("ul_room");

  // eventos
  btn_access.on('click', acceso);
  inp_msg.addEventListener('keypress',keyPressCode);
  btn_msg.on('click',send);
  ul_room.addEventListener("mouseleave",scrollDown);
  window.addEventListener("unload",logOut);
  // functions
  function acceso(){
    var nick = $("#inp_nick").val();
    if (nick !== "") {
      user.id = md5(dt.getTime());
      user.nick = nick;
      listaDeSalas();
      $('#modal_nick').closeModal();
    } else {
      var msg = '<span><i class="fa fa-exclamation"></i> llena los campos</span>';
      Materialize.toast(msg, 4000,"red");
    }
  }

  function listaDeSalas() {
    var salas_ref = db.ref("/salas");

    salas_ref.on('child_added', salas);
  }

  function salas(data) {
    var html = '<span class="'+data.val().icon+'"></span> '+data.val().name;
    var $a = $("<a>").addClass('collection-item')
                    .attr("id",data.val().id)
                    .html(html)
                    .appendTo("#ul_salas");

    $a.on('click', function(e){
      e.preventDefault();
      user.sala = $(this).attr("id");
      // inicia la app
      app();
      // desaparece salas
      $("#salas").fadeOut('fast');
    });
  }

  function app() {
    // referencias
    user_ref = db.ref(user.sala+"/user");
    msg_ref = db.ref(user.sala+"/general");
    // inicias sesion
    if (user_ref_key === null) {
      logIn();
    }
    // usuarios
    user_ref.on('child_added', addListUser);
    user_ref.on('child_removed',removeListUser);
    // mensajes
    msg_ref.on('child_added', addMsg);
  }//fin de app

  function logIn(){
    var user_push = user_ref.push({
      id: user.id,
      nick: user.nick
    });
    user_ref_key = user_push.key;
  }// fin de log in

  function logOut() {
    if (user_ref_key !== null) {
      db.ref(user.sala+"/user/"+user_ref_key).remove();
    }
  }// fin de log out

  function addListUser(data) {
    // si eres tu no apareces en la lista
    if (data.val().id == user.id) return;
    // obtenemos el id
    var id = data.val().id;
    // creamos la lista
    var $li = $("<li>").addClass("collection-item")
                        .html(data.val().nick)
                        .attr("id",id)
                        .appendTo("#ul_users");
    // cuando le demos click a un compañero crea una room
    // $li.on("click", function(){
    //     var room = rooms.push({
    //       creador: user.id,
    //       amigo: id
    //     });
    // });
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
     var meta = data.val();
     var html = '<span><strong>'+meta.nick+': </strong> '+meta.mensage+'</span>';
     var $li = $("<li>").addClass('collection-item').html(html);

     $li = user.id == meta.uid ? $li.css({"color":"#1976d2"}) : $li;

     $("#ul_room").append($li);

    //  sonido.play();

     scrollDown();
   }// fin addMsg

  function scrollDown(){
    var height = ul_room.scrollHeight;
    ul_room.scrollTop = height;
  }
})();
