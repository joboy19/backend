var venues = [];

function fetchVenues(){
  venues = [
    {"name" : "astro_turf", "dname" : "Astro Turf", "price" : "10", "closing_info" : [
        // opening times - closing times
        [[10, 00], [12, 30]], // Sun
        [[18, 00], [21, 30]], // Mon
        [[18, 00], [21, 30]], // Tue
        [[18, 00], [21, 30]], // Wed
        [[18, 00], [21, 30]], // Thu
        [[18, 00], [21, 30]], // Fri
        [[10, 00], [16, 30]], // Sat
    ]},
    {"name" : "theatre", "dname" : "Theatre", "price" : "20", "closing_info" : [
        // opening times - closing times
        [[10, 00], [12, 30]], // Sun
        [[18, 00], [21, 30]], // Mon
        [[18, 00], [21, 30]], // Tue
        [[18, 00], [21, 30]], // Wed
        [[18, 00], [21, 30]], // Thu
        [[18, 00], [21, 30]], // Fri
        [[10, 00], [16, 30]], // Sat
    ]}
  ];
}


$(document).ready(function(){
  fetchVenues();
  for(i = 0; i < venues.length; i++){
    console.log(venues[i]);
    $("#selectVenue").append($("<option>", {
      text : venues[i].dname,
      value : venues[i].name
    }));
  }
})

function avaiableStartTimes(duration, date, venue){
  return ["2019-01-21 10:00:00", "2019-01-21 10:30:00"]
}

function fillTimes(){
  let day = (new Date ($("#datePickerInput").val())).getDay();
  let venue = getVenueInfo($("#selectVenue").val());
  let date = "yeet";
  for (let i of avaiableStartTimes(0, date, venue)){
    let time = new Date(i);
    console.log(time);
    $("#selectTime").append($("<option>", {
        text : time.getHours() + ":" + ("00" + time.getMinutes()).slice(-2),
        value : i
    }))
  }
}

$("#datePickerInput").change( function(){
  fillTimes();
})

function getVenueInfo(codename){
  return venues.filter(item => item.name == codename)[0];
}

$("#selectVenue").change( function(){
  console.log(getVenueInfo($("#selectVenue").val()).price);
  $("#priceTagContent").text( "Price (per half hour): £" +
  getVenueInfo($("#selectVenue").val()).price );
  $("#priceTag").show();
})

$("#book-now").on("submit", function(event){
  event.preventDefault()

  //$.post("/booking",
  console.log({
    "venue" : $("#selectVenue").val(),
    "start" : $("#selectTime").val(),
    "end" : $("#selectTime").val() + $("#selectDuration").val()
  })
})

$("#selectType").change( function(){
  $("#priceTag").hide();
  $("#groupVenue").hide();
  $("#groupActivity").hide();
  $("#groupEvent").hide();
  $("#group" + $("#selectType").val()).show();
})
