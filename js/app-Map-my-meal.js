var map;
function initMap(){
    map = new google.maps.Map($('#map')[0],{
        center: {lat: 32.872854, lng: -117.223911},
        zoom: 17
    });
}