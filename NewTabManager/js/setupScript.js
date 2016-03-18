$(document).ready(function() {

		/* initialize the calendar
		-----------------------------------------------------------------*/

		$('#calendar').fullCalendar({
			customButtons: {
				clearButton: {
					text: 'Clear Calendar',
					click: function() {
						$('#calendar').fullCalendar( 'removeEvents').fullCalendar('removeEventSources');
					}
				},
				saveButton: {
					text: 'Save Calendar',
					click: function() {
						var jsonList = [];
						var list = $('#calendar').fullCalendar('clientEvents')
						$(list).each(function(index, element){
							var start = moment(element.start).utc();
							var end = moment(element.end).utc();
							if(!end._isValid){
								end = start.clone().add(2, "hours");
							}
						var jsonString = '{"title":"' + element.title + '", "url":"' + element.url + '", "start":"' + start.hour() + ":" + start.minute() + '", "end":"' + end.hour() + ":" + end.minute() + '", "dow":"' + start.day() + '"}';
						jsonList.push(jsonString);
						})
						chrome.runtime.sendMessage({command: "saveCal", list: jsonList});
					}
				}
			},
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'saveButton clearButton'
			},
			allDaySlot: false,
			scrollTime: '09:00:00',
			firstDay: '1',
			defaultView: 'agendaWeek',
			editable: true,
			droppable: true, 
			drop: function(event) { 

            if ($('#drop-remove').is(':checked')) {
                
                $(this).remove();
            }

        	},
			eventClick: function(event, jsEvent, view) {
				console.log(jsEvent);
				if (jsEvent.altKey){
					console.log("Tried to remove");
					$('#calendar').fullCalendar( 'removeEvents', function(events){if(events.title == event.title){return true}});
					return false;
				}
				if (event.url) {
					window.open(event.url);
					return false;
				}							
			}
		});


		$('#addEvent').click(function(){
			var element = $("<div class='fc-event'>" + $('#eventTitle').val() + "</div>");
			$(element).data('event', {
				title: $.trim($(element).text()), // use the element's text as the event title
				stick: true // maintain when user navigates (see docs on the renderEvent method)
				, url: addhttp($('#eventURL').val())
			});
			$(element).draggable({
				zIndex: 999,
				revert: true,      // will cause the event to go back to its
				revertDuration: 0  //  original position after the drag
			});
			
			$(element).insertBefore($('#dropCheck'));
			$("#dropCheck").show();
		})

		function addhttp(url) {
			if (!/^(f|ht)tps?:\/\//i.test(url)) {
				url = "http://" + url;
			}
			return url;
		}

		$('#setTabUrl').click(function(){
			chrome.runtime.sendMessage({command: "saveDefault", url: $("#newTabUrl").val()});
		})
		
		chrome.runtime.sendMessage({command: "getCal"}, function(response){
			list = response.calenderList;
			preparedList  = []
			$(list).each(function(index, val){
				preparedList.push($.parseJSON(val));
			})

			$('#calendar').fullCalendar('addEventSource', preparedList);
			console.log("Calendar retrieved and updated");
		});

		chrome.runtime.sendMessage({command: "getDefault"}, function(response){
			$("#newTabUrl").attr("placeholder", response.url);
		});

		$("#dropCheck").hide();


	});