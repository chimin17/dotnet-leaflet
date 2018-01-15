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
  featchdata(data);
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
}

$("#nav-btn").click(function () {
  $(".navbar-collapse").collapse("toggle");
  return false;
});


//random
var ramdomLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "./dist/assets/img/icon-black.png",
        iconSize: [36, 36],
        iconAnchor: [0, 18]
      }),
    });
  }
});
var ramdompts = turf.randomPoint(25, { bbox: [121.41, 24.9, 121.8, 25.19] });
ramdomLayer.addData(ramdompts);
ramdomLayer.addTo(map);
var ntp = L.geoJson(null);
var ptsInLayer = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    var icon;
    if (feature.properties.cluster == 0)
      icon = "./dist/assets/img/icon-orange.png";
    else if (feature.properties.cluster == 1)
      icon = "./dist/assets/img/icon-purple.png";
    else if (feature.properties.cluster == 2)
      icon = "./dist/assets/img/icon-red.png";
    else
      icon = "./dist/assets/img/icon-green.png";
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: icon,
        iconSize: [36, 36],
        iconAnchor: [0, 18]
      }),
    });
  }
});
$.getJSON("./dist/assets/data/ntp.geojson", function (data) {
  ntp.addData(data);
  map.addLayer(ntp);
  var ptsWithin = turf.pointsWithinPolygon(ramdompts, data);
  var clustered_kmeans = turf.clustersKmeans(ptsWithin, { numberOfClusters: 5 });
  ptsInLayer.addData(clustered_kmeans);

  map.addLayer(ptsInLayer);

  //重心
  var center = turf.center(data);
  L.geoJson(center)//.addTo(map).bindPopup('這是新北幾何中心')//.openPopup();

  //最短距離
  var nearest = turf.nearestPoint(center, ptsWithin);
  L.geoJson(nearest, {
    pointToLayer: function (feature, latlng) {

      return L.marker(latlng, {
        icon: L.icon({
          iconUrl: "./dist/assets/img/pin.png",
          iconSize: [36, 36],
          iconAnchor: [0, 18]
        }),
      });
    }
  })//.addTo(map).bindPopup('這是距離新北中心最近的點');
});

//




//內插
var ramdomLayer_ipl = L.geoJson(null, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "./dist/assets/img/icon-black.png",
        iconSize: [12, 12],
        iconAnchor: [0, 6]
      }),
    }).bindPopup(feature.properties.obs.toFixed(3).toString());
  }
});
var ramdompts_ipl = turf.randomPoint(200, { bbox: [121.41, 24.34, 121.8, 24.65] });
turf.featureEach(ramdompts_ipl, function (point) {
  point.properties.obs = Math.random() * 25;
});
ramdomLayer_ipl.addData(ramdompts_ipl).addTo(map);


var idw_grid = turf.interpolate(ramdompts_ipl, 2, { gridType: 'square', property: 'obs', units: 'kilometers' });
var idw_gridLayer = L.geoJson(idw_grid, {
  onEachFeature: function (feature, layer) {
    layer.bindPopup(feature.properties.obs.toFixed(3).toString());
  },
  style: function (feature) {
    return {
      "fillColor": getColor(feature.properties.obs),
      "weight": 0.5,
      "color": '#bd0026',
      "opacity": 1,
    }
  }
}
).addTo(map);



function getColor(x) {
  return x < 5 ? '#bd0026' :
    x < 10 ? '#f03b20' :
      x < 15 ? '#fd8d3c' :
        x < 20 ? '#fecc5c' :
          '#ffffb2';
};



var tin = turf.tin(ramdompts_ipl, 'obs');
var tinLayer = L.geoJson(tin, {
  onEachFeature: function (feature, layer) {
    var obs = feature.properties.a + feature.properties.b + feature.properties.c;
    feature.properties.obs = obs / 3;
    layer.bindPopup(feature.properties.obs.toFixed(3).toString());
  },
  style: function (feature) {
    var obs = feature.properties.a + feature.properties.b + feature.properties.c;

    return {
      "fillColor": getColor(obs),
      "weight": 0.5,
      "color": '#bd0026',
      "opacity": 1,
    }
  }
}
).addTo(map);



var voronoiPolygons = turf.voronoi(ramdompts_ipl,
  { bbox: [121.41, 24.34, 121.8, 24.65] });
turf.featureEach(voronoiPolygons, function (feature, index) {
  feature.properties.obs = ramdompts_ipl.features[index].properties.obs;
});

var voronoiLayer = L.geoJson(voronoiPolygons, {
  onEachFeature: function (feature, layer) {

    layer.bindPopup(feature.properties.obs.toFixed(3).toString());
  },
  style: function (feature) {

    return {
      "fillColor": getColor(feature.properties.obs),
      "weight": 0.5,
      "color": '#bd0026',
      "opacity": 1,
    }
  }
}
).addTo(map);

var contours_pts = turf.interpolate(ramdompts_ipl, 22, { gridType: 'points', property: 'obs', units: 'kilometers' });

var contours = turf.isobands(contours_pts, [0, 5, 10, 15, 20, 25, 30], { zProperty: 'obs' });

var contoursLayer = L.geoJson(contours, {
  onEachFeature: function (feature, layer) {

    layer.bindPopup(feature.properties.obs);
  },
  style: function (feature) {

    return {
      "fillColor": getColor(parseInt(feature.properties.obs.split('-')[0])),
      "weight": 0.5,
      "color": '#bd0026',
      "opacity": 1,
    }
  }
}
).addTo(map);

var arr = [];
turf.featureEach(ramdompts_ipl, function (feature) {
  arr.push([feature.geometry.coordinates[1],
  feature.geometry.coordinates[0],
  feature.properties.obs,
  ]);
});
var heatmapLayer = L.heatLayer(arr, {
  radius: 30,
  minOpacity: 0,

  blur: 0.75
}).addTo(map);

var clusterLayer = L.markerClusterGroup();
clusterLayer.addLayer(ramdomLayer_ipl).addTo(map);



// var layerControl = L.control.layers(baseLayers);
// layerControl.addTo(map);
var velocityLayer = L.velocityLayer(null);
$.getJSON("./dist/assets/data/wind-global.json", function (data) {

  velocityLayer = L.velocityLayer({
    displayValues: false,
    data: data,
    maxVelocity: 10,
    colorScale: ['#bd0026', '#f03b20', '#fd8d3c', '#fecc5c', '#ffffb2']
  });
  //map.addLayer(velocityLayer);

});







var overLayers = [
  {
    active: false,
    name: "網球場",
    layer: pois
  },
  {
    active: false,
    name: "行政區",
    layer: ntp
  },
  {
    active: false,
    name: "全區",
    layer: ramdomLayer
  },
  {
    name: "新北",
    layer: ptsInLayer
  },
  {
    name: "隨機點",
    layer: ramdomLayer_ipl

  },
  {
    name: "IDW",
    layer: idw_gridLayer

  },

  {
    name: "TIN",
    layer: tinLayer

  }, {
    name: "voronoi",
    layer: voronoiLayer
  },
  {
    name: "contours",
    layer: contoursLayer
  },

  {
    name: "heat",
    layer: heatmapLayer
  },
  {
    name: "cluster",
    layer: clusterLayer
  },
  {
    name: "wind",
    layer: velocityLayer

  }
];

map.addControl(new L.Control.PanelLayers([], overLayers));
$.each(overLayers, function (k, v) {

  map.removeLayer(v.layer);
})


$.get("../api/products", function (data) {
  var jdata = JSON.parse(data);

  $("#route-list tbody").children().remove();
  $.each(jdata.routes[0].legs[0].steps, function (k, v) {

    $("#route-list tbody").append("<tr id='" + v.polyline.points + "' class='route-row'><td>" + v.html_instructions + "</td></tr>");

  })


  var latlngs = L.PolylineUtil.decode(jdata.routes[0].overview_polyline.points);
  var polyline = L.polyline(latlngs);
  var decorator = L.polylineDecorator(polyline, {
    patterns: [
      { offset: 0, repeat: 10, symbol: L.Symbol.dash({ pixelSize: 3, pathOptions: { color: '#000', weight: 4, opacity: 0.5 } }) },
      {
        offset: '5%', repeat: '10%', symbol: L.Symbol.arrowHead({ pixelSize: 16, pathOptions: { fillOpacity: 1, weight: 0 } })
      }
    ]
  }).addTo(map);
  map.setView([latlngs[0][0] - 0.001, latlngs[0][1]], 17)
  // map.fitBounds(decorator.getBounds());
  console.log(jdata)
});



$("#bottom-hide-btn").click(function () {
  animateBottom();
  return false;
});


$("#route-btn").click(function () {
  animateBottom("#googleRouting");
  return false;
});
$("#google-btn").click(function () {
  animateBottom("#googleStreet");
  return false;
});
$("#mapillary-btn").click(function () {
  animateBottom("#mly");
  return false;
});
$("#chart-btn").click(function () {
  animateBottom("#chart");
  return false;
});
var currentBottomdiv = "#mly";
function animateBottom(type) {
  $("#googleRouting").hide();
  $("#googleStreet").hide();
  $("#mly").hide();
  $("#chart").hide();
  $(type).show();
  if (currentBottomdiv == type) {
    currentBottomdiv = "";
    $("#bottom-sidebar").animate({
      height: "toggle"
    }, 350, function () {
      map.invalidateSize();
    });
  }
  else {
    currentBottomdiv = type;

  }
}

$(document).on("click", ".route-row", function (e) {
  $('#googleRouting').animate({ scrollTop: $(this).context.offsetTop }, 800);
  routelineClick($(this).attr("id"));

});

var subRoute = L.geoJson(null);
function routelineClick(str) {
  map.removeLayer(subRoute);
  var latlngs = L.PolylineUtil.decode(str);
  subRoute = L.polyline(latlngs, { color: 'red' }).addTo(map);
  //map.setView([latlngs[0][0] - 0.001, latlngs[0][1]], 17)
}


var panoramMan = L.geoJson(null);
var streetIcon = L.icon({
  iconUrl: './dist/assets/img/streetman.png',
  iconSize: [32, 32],
});
var panorama = new google.maps.StreetViewPanorama(
  document.getElementById('googleStreet'), {
    position: {
      lat: 25.0574304,
      lng: 121.5964764
    },
    pov: { heading: 165, pitch: 0 }
  });
panorama.addListener('position_changed', function () {
  map.removeLayer(panoramMan);
  console.log("x:" + panorama.getPosition().lng());
  console.log("y:" + panorama.getPosition().lat());
  console.log("rotation:" + panorama.pov.heading);
  panoramMan = L.marker([panorama.getPosition().lat(), panorama.getPosition().lng()],
    { rotationAngle: panorama.pov.heading, icon: streetIcon }).addTo(map);
  // map.setView([panorama.getPosition().lat(), panorama.getPosition().lng()], 17)
});

panorama.addListener('pov_changed', function () {
  map.removeLayer(panoramMan);
  console.log("x:" + panorama.getPosition().lng());
  console.log("y:" + panorama.getPosition().lat());
  console.log("rotation:" + panorama.pov.heading);
  panoramMan = L.marker([panorama.getPosition().lat(), panorama.getPosition().lng()],
    { rotationAngle: panorama.pov.heading, icon: streetIcon }).addTo(map);
  // map.setView([panorama.getPosition().lat(), panorama.getPosition().lng()], 17)
});
//map.fitBounds(voronoiLayer.getBounds());



var mly = new Mapillary.Viewer(
  'mly',
  'your_key',
  'MiEVQvYuxJOmTgpS2TNK8w'
);

var mlyMan;
mly.on(Mapillary.Viewer.nodechanged, function (node) {
  var latLon = [node.latLon.lat, node.latLon.lon];

  if (!mlyMan) {
    mlyMan = L.marker(latLon);
    mlyMan.addTo(map);
  } else {
    mlyMan.setLatLng(latLon);
  }

  map.setView(latLon);
});

function featchdata(d0) {

  var ext = map.getBounds()
  //資料

  var poly = turf.polygon([[
    [ext.getSouthWest().lng, ext.getSouthWest().lat],
    [ext.getNorthWest().lng, ext.getNorthWest().lat],
    [ext.getNorthEast().lng, ext.getNorthEast().lat],
    [ext.getSouthEast().lng, ext.getSouthEast().lat],
    [ext.getSouthWest().lng, ext.getSouthWest().lat]
  ]]);
  console.log(poly);
  var d = [];

  $.each(d0.features, function (k, v) {
    var pt = turf.point([v.geometry.coordinates[0], v.geometry.coordinates[1]]);

    if (turf.booleanPointInPolygon(pt, poly)) {
      d.push(v);
    }

  });
  var data = [];
  var tmp_type;
  var tmp_count = 0;

  $.each(d, function (k, v) {
    if (k == 0) {
      tmp_type = v.properties.surface;
      tmp_count++;
    }
    else if (k == d.length - 1) {
      tmp_count++;
      data.push({ "letter": tmp_type, "frequency": tmp_count })
    }
    else {
      if (tmp_type == v.properties.surface) {
        tmp_count++;
      } else {
        data.push({ "letter": tmp_type, "frequency": tmp_count })
        tmp_count = 1;
        tmp_type = v.properties.surface;
      }
    }
  });



  $("#svg").empty();
  //設定畫布及x,y軸比例尺等
  var svg = d3.select("#svg"),
    margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var column = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  //設定資料範圍
  x.domain(data.map(function (d) { return d.letter; }));
  y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

  //x軸
  column.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //y軸
  column.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Frequency");

  //bar chart部分
  column.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.letter); })
    .attr("y", function (d) { return y(d.frequency); })
    .attr("width", x.bandwidth())
    .attr("height", function (d) { return height - y(d.frequency); })
}


map.on('zoomend', function () {
  var d = pois.toGeoJSON();
  featchdata(d);
});

map.on('dragend', function () {
  var d = pois.toGeoJSON();
  featchdata(d);
});