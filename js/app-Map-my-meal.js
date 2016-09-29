
// initialte map


//KO model
function filterViewModel() {
    var map;
    var geocoder;
    var self = this;
    self.markers =ko.observableArray();
    //the recommened restaurant list

    self.restNameList = ["Ki Sushi & Sake Bar",
                         "Nozomi La Jolla",
                         "Pho La Jolla"];
    self.initMap= function(){
        geocoder = new google.maps.Geocoder();
        map = new google.maps.Map($('#map')[0],{
            center: {lat: 32.872854, lng: -117.223911},
            zoom: 16,
            mapTypeControl: true,
            mapTypeControlOptions: {
                  style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                  position: google.maps.ControlPosition.TOP_CENTER
            },
        });
        self.getDetail();
    }

    function dropMarkers(results){
        var largeInfowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
              position: results.geometry.location,
              map: map,
              animation: google.maps.Animation.DROP,
              information: results
        });

        marker.addListener('click', function() {

            map.setCenter(marker.getPosition());
            populateInfoWindow(this, largeInfowindow);
        });
        self.markers.push(marker);
        console.log(self.markers);
    }

    function callback(results, status) {
        console.log(results);
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 1; i < results.length; i++) {
          var place = results[i];
          dropMarkers(results[i]);
        }
      }
    }

    function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        // if (infowindow.marker != marker) {
          infowindow.marker = marker;
          var formattedImg = "";
          if(marker.information.photos){
            var img = marker.information.photos[0].getUrl({maxWidth:400,maxHeight:300});
            formattedImg = '<img src = "'+img+'">';
          }

          infowindow.setContent('<div>'+formattedImg
            +
            '<h4>' + marker.information.name+'</h4>'+
            marker.information.vicinity+ '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.close();
          });
        // }
      }

    self.getDetail= function(){
        var pyrmont = new google.maps.LatLng(32.872854, -117.223911);
        // var request ={
        //     location: this.restNameList[0]
        // };
        var request = {
            location: pyrmont,
            radius: '5000',
            type: 'restaurant',
            keyword: 'Korean Japanese'
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    }

}
var model = new filterViewModel();
ko.applyBindings(model);