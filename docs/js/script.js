var map = L.map('map').setView([-14.2350, -51.9253], 5);
var bounds_group = new L.featureGroup([]);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  opacity: 0.35,
  attribution: '',
  minZoom: 1,
  maxZoom: 28,
  minNativeZoom: 0,
  maxNativeZoom: 19,
}).addTo(map);

generateMunicipalitiesWithRisk(map, bounds_group)
generateHeritageRisk(map, bounds_group)
generateLayerMunicipalities(map, bounds_group)
generateDamBuffers(map, bounds_group)
