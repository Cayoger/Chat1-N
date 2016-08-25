(function () {
  // configuracion
  var config = {
    apiKey: "AIzaSyAFK-EvCE2vnUVaxK6SgwCaW-Bg_caVEAQ",
    authDomain: "ocapy-b6977.firebaseapp.com",
    databaseURL: "https://ocapy-b6977.firebaseio.com",
    storageBucket: "ocapy-b6977.appspot.com",
  };
  firebase.initializeApp(config);
  // variabes
  var btn_room = document.getElementById('btn_room');
  var inp_room = document.getElementById('inp_room');
  var salas_ref = null;
  // eventos
  btn_room.addEventListener('click',addRoom);
  // funciones
  function addRoom() {
      salas_ref = db.ref("/salas");
      var name_room = inp_room.value;
      salas_ref.push({
        name: name_room,
        descripcion:""
      });
  }
})();
