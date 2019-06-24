API_KEY = "pk.eyJ1Ijoia25pbiIsImEiOiJjand5NHB6cjQwZXA1NDVtY3Y4dTU1cXFiIn0.2T3uMV0w4ojrmPMX2bXiTw";

// Adding tile layer
var b=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "mapbox.light",
  accessToken: API_KEY
})

var c=L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 10,
  id: "mapbox.dark",
  accessToken: API_KEY
})

// Link to GeoJSON

// "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-" +
// "a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";

var geojson;
// Grab data with d3
d3.json("/data", function(error, data) {
  kk=L.geoJson(data)
//   console.log(kk)
//  allbikelocation=[]
//   for (var i=0; i<data.features.length; i++){
//     var station = data.features[i]
//     var bikelocation= L.geoJson(station)

//     allbikelocation.push(bikelocation)}

//  
  // Create a new choropleth layer
  geojson = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "QII",

    // Set color scale
    scale: ["red","yellow","green"],

    // Number of breaks in step range
    steps:15,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.Country + "<hr>Quality of Life:<br>" +
         feature.properties.QII);
    }
  
    
  });
  geojson2 = L.choropleth(data, {
    // Define what  property in the features to use
    valueProperty: "HI",

    // Set color scale
    scale: ["red","yellow","green"],

    // Number of breaks in step range
    steps:15,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.Country + "<hr>Housing Index:<br>" +
         feature.properties.HI);
    },
    
    
    
  })


  // Set up the legend
  
  var baseMaps = {
    "Street Map": b,
    "Dark Map": c
  };
  
  // Overlays that may be toggled on or off
  var overlayMaps = {
    "Quality of Life Index": geojson,
    "Housing Index":geojson2
  };

  var myMap = L.map("map", {
    center: [39.7128, -93.5795],
    zoom: 3,
    layers:[b,geojson]
  });
  
  L.control.layers(baseMaps, overlayMaps,{collapse:false}).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>QLI</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  var legend1= L.control({ position: "bottomright" });
  legend1.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson2.options.limits;
    var colors = geojson2.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>HI</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
  myMap.on('overlayadd', function(eventLayer){
    if (eventLayer.name == 'Housing Index'){
      legend1.addTo(this);
    } 
    // else if(eventLayer.name != 'Housing Index'){
    //   this.removeControl(legend1)
    // }
  })

    myMap.on('overlayadd', function(eventLayer){
      if (eventLayer.name == 'Quality of Life Index'){
        legend.addTo(this);
      } 
      // else if(eventLayer.name != 'Quality of Life Index'){
      //   this.removeControl(legend)
      // }
    })
    
      myMap.on('overlayremove', function(eventLayer){
        if (eventLayer.name == 'Quality of Life Index'){
          this.removeControl(legend)
        } })

        myMap.on('overlayremove', function(eventLayer){
          if (eventLayer.name == 'Housing Index'){
            this.removeControl(legend1)
          } })
  

});