
//set map options
var myLocation = { lat: 1.00, lng: 38.00 };
var mapOptions = {
    center: myLocation,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP

};
//callback function
function dummy() {}
window.dummy=dummy;



//time of day
var date = new Date();
    var current_hour= date.getHours();
	var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
	document.getElementById("time").innerHTML = current_time;
    
//time of the day variable
let TIME_OF_DAY1=0.05
let TIME_OF_DAY2=0.1
let TIME_OF_DAY3=0.125
let TIME_OF_DAY4=0
//surge charge rate
let SURGE_CHARGE_RATE=0.3;
    
//surge charge rate depending on time of day
 if(current_hour >=date.getHours(7) && current_hour<= date.getHours(10)){
       SURGE_CHARGE_RATE = SURGE_CHARGE_RATE + TIME_OF_DAY1;
        

 }else if(current_hour >date.getHours(12) && current_hour<= date.getHours(14)){
        SURGE_CHARGE_RATE = SURGE_CHARGE_RATE +TIME_OF_DAY2;
 }else if(current_hour >date.getHours(16) && current_hour<= date.getHours(19)){
         SURGE_CHARGE_RATE = SURGE_CHARGE_RATE +TIME_OF_DAY3;
 }else{
         SURGE_CHARGE_RATE = SURGE_CHARGE_RATE +TIME_OF_DAY4;

 }



       
//create map
var map = new google.maps.Map(document.getElementById('map'), mapOptions);

//create a DirectionsService object 
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//create a traffic layer object
var trafficLayer = new google.maps.TrafficLayer();


//connecting the directionsrenderer to map
directionsDisplay.setMap(map);



function calcRoute() {
    //create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, 
        unitSystem: google.maps.UnitSystem.METRIC
        
    }


    // ride types uber
    const multiplier = [ 0.8,1.2,1.7,2.2];
    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //constants for calculating the uber price
            const output = document.querySelector('#output');
            let ubaseFare =100;
            let udurationCalc = result.routes[0].legs[0].duration.value*(4);
            let udistanceCalc = result.routes[0].legs[0].distance.value*(29);
            let uuberPrice=ubaseFare +udurationCalc+udistanceCalc;
            uuberPrice= Math.round(uuberPrice);
            // Display of DsT (Distance and Time) 
            output.innerHTML = "<div class='alert-info'> From: " + document.getElementById("from").value + ".<br/> To: "+document.getElementById("to").value +". <br/> Driving Distance <i class='fa-solid fa-road'></i>: "+ result.routes[0].legs[0].distance.text +".<br/>Duration <i class='fa-solid fa-timer'></i>: " + result.routes[0].legs[0].duration.text + ".<br/>" + ".<br/>" +
            // Display Price of Uber
           "Uber XL KES:" + uuberPrice*SURGE_CHARGE_RATE*multiplier[3] /100 + ". <br/>"+
            "Uber X KES:" + uuberPrice*SURGE_CHARGE_RATE*multiplier[2] /100 + ". <br/>"+
            "Uber Chap Chap KES:" + uuberPrice*SURGE_CHARGE_RATE*multiplier[1] /100 + ". <br/>"+
            "Uber Boda KES:" + uuberPrice*SURGE_CHARGE_RATE*multiplier[0] /100 + ". <br/>";
            // Display Price of Bolt
            const output1 = document.querySelector('#output1');
            //constants for calculating the bolt price

            let bbaseFare =85;
            let bdurationCalc = result.routes[0].legs[0].duration.value*(3);
            let bdistanceCalc = result.routes[0].legs[0].distance.value*(27.37);
            let boltPrice=bbaseFare +bdurationCalc+bdistanceCalc;
            boltPrice = Math.round(boltPrice);
            output1.innerHTML ="<div class='alert-info'> "+ 
            "Bolt XL KES:" + boltPrice*SURGE_CHARGE_RATE*multiplier[3] /100 + ". <br/>"+
            "Bolt KES:" + boltPrice*SURGE_CHARGE_RATE*multiplier[2] /100 + ". <br/>"+
            "Bolt Lite KES:" + boltPrice*SURGE_CHARGE_RATE*multiplier[1] /100 + ". <br/>"+
            "Bolt Boda KES:" + boltPrice*SURGE_CHARGE_RATE*multiplier[0] /100 + ". <br/>";
            
           
            //display route
            directionsDisplay.setDirections(result);
        } else {
            //clear route
            directionsDisplay.setDirections({ routes: [] });
            //center map in kenya
            map.setCenter(myLocation);
            // error message
            output.innerHTML ="<div class='alert-info'> <iclass='fa-solid fa-triangle-exclamation'></i> Could Not Retrieve Driving Distance </div>";
        }
    });

}
//function to allow view of traffic
function trafficSet(){
    trafficLayer.setMap(map);
}

//create autocomplete objects for all inputs
var options = {
    types: ['(cities)'],
   
    
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);



var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);




