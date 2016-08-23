class Chat{
	constructor(roomKey, user, containerID, database){
		this.user = user
		this.id = roomKey
		this.database = database
		this.buildChat(containerID)
		//mandar mensajes
		this.setEvents()
	}

	buildChat(containerID){
		$.tmpl($("#hidden-template"), {id: this.id})
		.appendTo("#"+containerID)

		//mandar mensajes
		this.ref = this.database.ref("/messages"+this.id)
	}

	setEvents(){
		$("#"+this.id).find("form").on("submit", (ev)=>{
			ev.preventDefault()

			var msg = $(ev.target).find(".mensaje").val()
			this.send(msg)

			return false
		})

		//Mostrar mensajes
		this.ref.on("child_added",(data)=> this.add(data) )
	}

	//mostrar mensajes
	add(data){
		var mensaje = data.val()
		//template string
		var html = `
						<b> ${ mensaje.name } :</b>
						<span> ${mensaje.msg} </span>
					`
		var $li = $("<li>").addClass('collection-item')
								.html(html)

		$("#"+this.id).find(".messages").append($li)
	}

	send(msg){
		this.ref.push({
			name: this.user.nick,
			roomID: this.id,
			msg: msg
		})
	}

}