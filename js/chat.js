class Chat {
  constructor(room_key,user,contenedor_id,db) {
    this.user = user;
    this.id = room_key;
    this.db = db;
    this.buildChat(contenedor_id);
    this.setEvents();
  }
  buildChat(contenedor_id){
    $.tmpl($("#hidden-template"),{id:this.id}).appendTo('#'+contenedor_id);
    this.ref = this.db.ref(this.user.sala+"/message/"+this.id);
  }
  setEvents(){
    $("#"+this.id).find("form").on("submit",(item) => {
      item.preventDefault();
      var msg = $(item.target).find(".mensage").val();
      this.send(msg);

      return false;
    });

    this.ref.on("child_added",(data)=>this.addMensajes(data));
  }

  addMensajes(data){
    var msg = data.val();
    var html = `<b>${msg.name}: <b/>
                <span>${msg.mensaje}</span>`;

    var $li = $("<li>").addClass('collection-item')
                      .html(html);

    $("#"+this.id).find(".messages").append($li);
  }
  send(msg){
    this.ref.push({
      name: this.user.nick,
      room_id: this.id,
      mensaje: msg
    });
  }
}
