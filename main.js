'use strict'

var map = L.map('map').setView([37.79244, -122.39987], 16)
var hash = new L.Hash(map)

// Add Tangram scene layer
var layer = Tangram.leafletLayer({
  scene: 'scene/sf-buildings-lidar-preview.yaml',
  attribution: 'Rendering by <a href="https://mapzen.com/tangram">Tangram</a> | &copy; OSM contributors'
}).addTo(map)

var toggleEl = document.getElementById('toggle')
var labelEl = document.getElementById('label')
var buttonEl = document.getElementById('button')
var buildingsMode = 'sf'

buttonEl.addEventListener('click', function (e) {
  if (buildingsMode === 'sf') {
    layer.scene.config.layers.buildings.data = {
      source: 'mapzen',
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
