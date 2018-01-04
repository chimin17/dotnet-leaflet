var map, featureList;

map = L.map('map').setView([25.0375928, 121.5529563], 10);


var basemaps = [
  L.tileLayer('//{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 0,
    label: 'Toner Lite'  // optional label used for tooltip
  }),

  L.tileLayer('//{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    subdomains: 'abcd',
    maxZoom: 16,
    minZoom: 1,
    label: 'Watercolor'
  })
];

var baseControl = map.addControl(L.control.basemaps({
  basemaps: basemaps,
  tileX: 0,  // tile X coordinate
  tileY: 0,  // tile Y coordinate
  tileZ: 1   // tile zoom level
}));


var geocoder = L.Control.geocoder({
  defaultMarkGeocode: true
}).addTo(map);


var measureControl = new L.Control.Measure({ measureControl: true, primaryAreaUnit: 'sqmeters', secondaryAreaUnit: undefined, primaryLengthUnit: 'meters', secondaryLengthUnit: 'kilometers' });
measureControl.addTo(map);

$("#streetView-hide-btn").click(function () {

  $("#streetView").fadeOut();

});

$("#sidebar-hide-btn").click(function () {
  animateSidebar();
  return false;
});


$("#list-btn").click(function () {
  animateSidebar();
  return false;
});

function animateSidebar() {
  $("#sidebar").animate({
    width: "toggle"
  }, 350, function () {
    map.invalidateSize();
  });
}



var pois = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    var icon;
    if (feature.properties.surface == "紅土[clay]")
      icon = "./dist/assets/img/tennis-red.png";
    else if (feature.properties.surface == "硬地[hard]")
      icon = "./dist/assets/img/tennis-blue.png";
    else if (feature.properties.surface == "草地[grass]")
      icon = "./dist/assets/img/tennis-green.png";
    else
      icon = "./dist/assets/img/globe.png";

    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: icon,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      $("#poi-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="' + layer.options.icon.options.iconUrl + '"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>球場名稱</th><td>" + feature.properties.name + "</td></tr>" + "<tr><th>縣市</th><td>" + feature.properties.city + "</td></tr>" + "<tr><th>材質</th><td>" + feature.properties.surface + "</td></tr>" + "<tr><th>面數</th><td>" + layer.feature.properties.number_of_courts + "</td></tr></table> ";
      layer.on({
        click: function (e) {
          $("#feature-title").html(feature.properties.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([layer.getLatLng().lat, layer.getLatLng().lng], highlightStyle));
        }
      });
    }
  }
});
$(document).on("click", ".feature-row", function (e) {
  //$(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

function sidebarClick(id) {
  var layer = pois.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

$.getJSON("./dist/assets/data/map.geojson", function (data) {
  pois.addData(data);
  map.addLayer(pois);
});
var highlight = L.geoJson(null).addTo(map);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};


function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  theaters.eachLayer(function (layer) {
    if (map.hasLayer(theaterLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through museums layer and add only features which are in the map bounds */
  museums.eachLayer(function (layer) {
    if (map.hasLayer(museumLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

$("#nav-btn").click(function () {
  $(".navbar-collapse").collapse("toggle");
  return false;
});