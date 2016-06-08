define(['knockout', 'jquery', 'lodash', 'mapbox', 'json!api/appSettings'], function (ko, $, _, L, appSettings) {
  'use strict';

  // defines 94102 (SF) as default location for map
  return function () {
    var userProfile = ko.observable();
    var userInfo = ko.observable();
    var defaultLocation = {
      zip: '',
      coordinates: [37.09, -95.71]
    };
    var mapLocation = ko.observable();

    // Get user's profile from mongodb
    function getUserProfile() {
      $.get('/api/userProfileInfo/getUserProfile').then(function(data){
        userProfile(data[0]);
        userInfo(userProfile().userinfo);
        defaultLocation.zip = userInfo().zipcode;
        
        // Initialize starting data
        mapLocation(defaultLocation.zip);
      });
    }

    // This gets user's profile when the page is first loaded
    getUserProfile();

    if (!appSettings.MAPBOX_ACCESS_TOKEN) throw new Error('Missing appSettings.MAPBOX_ACCESS_TOKEN');

    // Setting up the map with default location's coordinates (SF)
    L.mapbox.accessToken = appSettings.MAPBOX_ACCESS_TOKEN;

    var mymap = L.mapbox.map('mapid', 'mapbox.streets')
      .setView(defaultLocation.coordinates, 2);

    var searchOpenFacilities = ko.observable(false);
    var searchFosterFamilyAgencies = ko.observable(false);
    var markerData = ko.observableArray();
    var errorMessage = ko.observable();

    // geocoder to update map with new location
    var geocoder = L.mapbox.geocoder('mapbox.places');

    // clears search criteria (user clicks "clear" button)
    function clearSearch() {
      mapLocation(defaultLocation.zip);
      searchOpenFacilities(false);
    }

    // every time user checks or unchecks "open facilities only" box, performs new query
    searchOpenFacilities.subscribe(updateMarkers);

    // every time user enters new zip code, performs new query
    mapLocation.subscribe(updateMarkers);

    // every time user enters new zip code, map is moved
    mapLocation.subscribe(function (newLocation) {
      var options = { query: newLocation, country: 'us' };
      geocoder.query(options, showMap);
    });

    // updates data based on  user inputs
    function updateMarkers(){
      // modifies api url to retrieve search results based on user zip code entry 
      var apistring = "https://chhs.data.ca.gov/resource/mffa-c6z5.json?facility_zip=" + mapLocation() ;
      
      // modifies api url to retrieve search results based on user zip code entry and excludes closed facilities if the "open facilities only" box is checked
      if (searchOpenFacilities()) {
        apistring = apistring + "&$where=facility_status <> 'CLOSED'" ;
      }

      // updates data based on zip code and checkbox inputs above
      // Note: when developed past the proof-of-concept phase, this CHHS query
      // would be moved to the server, and would use an API token to guarantee its 
      // own pool of requests
      $.getJSON(apistring).then(function (data) {
        // Delete old Markers
        _.forEach(markerData(), function (marker) {
          mymap.removeLayer(marker.id);
        });

        // marks location based on user entry
        var markers = _.map(data, function (marker) {

          // add marker and save to markerData.id
          var latlng = [marker.location.coordinates[1], marker.location.coordinates[0]];
          marker.id = L.marker(latlng).addTo(mymap);

          // Bind popup data
          var popupInfo = "<b>" + marker.facility_name + "</b><br>" + marker.facility_address + "<br>" + marker.facility_telephone_number;
          marker.id.bindPopup(popupInfo, { closeButton: false, offset: L.point(0, -30) });

          // open/close pop up with mouseover
          marker.id.on('mouseover', marker.id.openPopup);
          marker.id.on('mouseout', marker.id.closePopup);

          return marker;
        });
          // returns error message if error
        markerData(markers);
      }).fail(function (err) {
        errorMessage(err.responseJSON.message);
      });
    }


    // When mouse hovers over row
    function popupMarker(data) {
      data.id.openPopup();
    }
    // when mouse stops hovering over row
    function popdownMarker() {
    }
    function showMap(err, data) {
    // returns error
      if (err) {
        return;
      }
      // The geocoder can return an area, like a city, or a
      // point, like an address. Here we handle both cases,
      // by fitting the map bounds to an area or zooming to a point.
      if (data.lbounds) {
        mymap.fitBounds(data.lbounds);
      } else if (data.latlng) {
        mymap.setView([data.latlng[0], data.latlng[1]], 13);
      }
    }

    return {
      mapLocation: mapLocation,
      searchOpenFacilities: searchOpenFacilities,
      searchFosterFamilyAgencies: searchFosterFamilyAgencies,
      clearSearch: clearSearch,
      runSearch: updateMarkers,
      mymap: mymap,
      markerData: markerData,
      errorMessage: errorMessage,
      popupMarker: popupMarker,
      popdownMarker: popdownMarker
    };
  };
});