
//the recommened restaurant list
// self.restNameList = ["Ki Sushi & Sake Bar",
//                      "Nozomi La Jolla",
//                      "Pho La Jolla"];
    var map;
    var self;


    //initiate map
    var initMap= function(){
            // geocoder = new google.maps.Geocoder();
            map = new google.maps.Map($('#map')[0],{
                center: {lat: 32.872854, lng: -117.223911},
                zoom: 13,
                mapTypeControl: true,
                mapTypeControlOptions: {
                      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                      position: google.maps.ControlPosition.TOP_CENTER
                },
            });
    }

    // KO model
    // parameter: @query: user search input bind with the input tag in interface
    //            @makers: list of markers returened by search result
    // function:  @getDetail: communicate with API get detail result of the query
    function filterViewModel() {
        self = this;
        self.chosenMark = ko.observable();
        self.query = ko.observable();
        self.markers =ko.observableArray();

        self.getDetail= function(){
            var pyrmont = new google.maps.LatLng(32.872854, -117.223911);
            var request = {
                location: pyrmont,
                radius: '5000',
                type: 'restaurant',
                keyword: this.query()
            };
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        }

        self.updateQuery = function(){
            console.log(self.query()+self.markers().length);
            for(var i = 0; i < self.markers().length; i++){
                self.markers()[i].setMap(null);
                console.log(self.markers()[i].name);
            }
            self.markers([]);
            self.getDetail();
        }

        self.dropMarkers = function(results){
            var largeInfowindow = new google.maps.InfoWindow();
            var marker = new google.maps.Marker({
                  position: results.geometry.location,
                  map: map,
                  animation: google.maps.Animation.DROP,
                  information: results,
                  window: largeInfowindow
            });
            populateInfoWindow(marker, largeInfowindow);
            marker.addListener('click', function() {
                if(self.chosenMark()) self.chosenMark().window.close();
                self.chosenMark(marker);
                self.chosenMark().window.open(map,self.chosenMark());
                // map.setCenter(marker.getPosition());
            });
            self.markers.push(marker);
            console.log(self.markers.length);
        }
        self.clickOpen = function(marker){
            if(self.chosenMark()) self.chosenMark().window.close();
            self.chosenMark(marker);
            map.setCenter(marker.getPosition());
            marker.window.open(map,marker);
        }

    }


    function callback(results, status) {
        console.log(results);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 1; i < results.length; i++) {
                var place = results[i];
                self.dropMarkers(results[i]);
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
        formattedImg = '<img class="small-window" src = "'+img+'">';
      }
      infowindow.setContent('<div>'+formattedImg+
        '<h4>' + marker.information.name+'</h4>'+
        '<p>Address: '+marker.information.vicinity+'</p>'+
        '<p>Current Status: '+ (marker.information.opening_hours!=null? (marker.information.opening_hours.open_now? 'open':'Not Available'): 'close')+
        '<p>Price Level: '+(marker.information.price_level? marker.information.price_level: 'Not Available')+'</p>'+
        '<p>Rating Score: '+(marker.information.rating? marker.information.rating : 'Not Available')+'</p>'
        +'</div>');
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
        infowindow.close();
      });

      return marker;
    // }
    }



    var model = new filterViewModel();
    ko.applyBindings(model);
