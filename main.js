'use strict'
// API key borrowed from curblines
var VECTOR_TILES_API_KEY = 'vector-tiles-TZJgMv2'

var map = L.map('map').setView([37.79244, -122.39987], 16)
var hash = new L.Hash(map)

// Add Tangram scene layer
var layer = Tangram.leafletLayer({
  scene: 'https://mapzen.com/carto/bubble-wrap-style/1.1/bubble-wrap.yaml',
  // scene: 'scene/bubble-wrap.yaml',
  attribution: 'Rendering by <a href="https://mapzen.com/tangram">Tangram</a> | &copy; OSM contributors'
}).addTo(map)

layer.scene.subscribe({
  load: function (msg) {
    var scene = msg.config

    // Use demo-specific vector tiles API key
    scene.sources.osm.url = 'https://vector.mapzen.com/osm/all/{z}/{x}/{y}.mvt?api_key=' + VECTOR_TILES_API_KEY

    scene.sources.sfbuildings = {
      type: 'GeoJSON',
      url: 'https://s3-us-west-2.amazonaws.com/openmassing/tiles/us/ca/san_francisco/{z}/{x}/{y}.json.gz',
      min_zoom: 16,
      max_zoom: 16
    }

    scene.layers.buildings.data.source = 'sfbuildings'
    // This prevents sfbuildings from being filtered out
    delete scene.layers.buildings.extrude.filter
    // Don't fictionally extrude buildings
    scene.layers.buildings.extrude.draw.polygons.extrude = function() { return feature.height || 0; }
    scene.layers.buildings.extrude.draw.lines.extrude = function() { return feature.height || 0; }
  }
})

var toggleEl = document.getElementById('toggle')
var labelEl = document.getElementById('label')
var buttonEl = document.getElementById('button')
var buildingsMode = 'sf'

buttonEl.addEventListener('click', function (e) {
  if (buildingsMode === 'sf') {
    layer.scene.config.layers.buildings.data = {
      source: 'osm',
      layer: 'buildings'
    }
    layer.scene.updateConfig({ rebuild: true })
    buildingsMode = 'orig'
    labelEl.textContent = 'Showing OSM building heights'
    buttonEl.textContent = 'Switch to SF LIDAR data'
  } else {
    layer.scene.config.layers.buildings.data = {
      source: 'sfbuildings'
    }
    layer.scene.updateConfig({ rebuild: true })
    buildingsMode = 'sf'
    labelEl.textContent = 'Showing SF LIDAR building heights'
    buttonEl.textContent = 'Switch to OSM data'
  }
})

