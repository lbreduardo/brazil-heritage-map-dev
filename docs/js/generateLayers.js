function generateDamBuffers(map, bounds_group) {
  map.createPane('pane_snisb_dam_buffers_3');
  map.getPane('pane_snisb_dam_buffers_3').style.zIndex = 403;
  map.getPane('pane_snisb_dam_buffers_3').style['mix-blend-mode'] = 'normal';
  var layer_snisb_dam_buffers_3 = new L.geoJson(json_snisb_dam_buffers_3, {
    attribution: '',
    interactive: true,
    dataVar: 'json_snisb_dam_buffers_3',
    layerName: 'layer_snisb_dam_buffers_3',
    pane: 'pane_snisb_dam_buffers_3',
    onEachFeature: pop_snisb_dam_buffers_3,
    style: style_snisb_dam_buffers_3_0,
  });
  bounds_group.addLayer(layer_snisb_dam_buffers_3);
  map.addLayer(layer_snisb_dam_buffers_3);
  allLayers.dam_buffers = layer_snisb_dam_buffers_3;
}

function generateMunicipalitiesWithRisk(map, bounds_group){
  map.createPane('pane_municipalities_with_combined_risk_simplified_2');
  map.getPane('pane_municipalities_with_combined_risk_simplified_2').style.zIndex = 402;
  map.getPane('pane_municipalities_with_combined_risk_simplified_2').style['mix-blend-mode'] = 'normal';
  var layer_municipalities_with_combined_risk_simplified_2 = new L.geoJson(json_municipalities_with_combined_risk_simplified_2, {
    attribution: '',
    interactive: true,
    dataVar: 'json_municipalities_with_combined_risk_simplified_2',
    layerName: 'layer_municipalities_with_combined_risk_simplified_2',
    pane: 'pane_municipalities_with_combined_risk_simplified_2',
    onEachFeature: pop_municipalities_with_combined_risk_simplified_2,
    style: style_municipalities_with_combined_risk_simplified_2_0,
  });
  bounds_group.addLayer(layer_municipalities_with_combined_risk_simplified_2);
  map.addLayer(layer_municipalities_with_combined_risk_simplified_2);
  allLayers.municipal_risk = layer_municipalities_with_combined_risk_simplified_2;
}

function generateLayerMunicipalities(map, bounds_group) {
  map.createPane('pane_municipalities_1_simplified_1');
  map.getPane('pane_municipalities_1_simplified_1').style.zIndex = 401;
  map.getPane('pane_municipalities_1_simplified_1').style['mix-blend-mode'] = 'normal';
  var layer_municipalities_1_simplified_1 = new L.geoJson(json_municipalities_1_simplified_1, {
    attribution: '',
    interactive: true,
    dataVar: 'json_municipalities_1_simplified_1',
    layerName: 'layer_municipalities_1_simplified_1',
    pane: 'pane_municipalities_1_simplified_1',
    style: style_municipalities_1_simplified_1_0,
  });
  bounds_group.addLayer(layer_municipalities_1_simplified_1);
  map.addLayer(layer_municipalities_1_simplified_1);
  allLayers.municipal_boundaries = layer_municipalities_1_simplified_1;

}

function generateHeritageRisk(map, bounds_group) {
  map.createPane('pane_comprehensive_heritage_risk_4');
  map.getPane('pane_comprehensive_heritage_risk_4').style.zIndex = 404;
  map.getPane('pane_comprehensive_heritage_risk_4').style['mix-blend-mode'] = 'normal';
  var layer_comprehensive_heritage_risk_4 = new L.geoJson(json_comprehensive_heritage_risk_4, {
    attribution: '',
    interactive: true,
    dataVar: 'json_comprehensive_heritage_risk_4',
    layerName: 'layer_comprehensive_heritage_risk_4',
    pane: 'pane_comprehensive_heritage_risk_4',
    onEachFeature: pop_comprehensive_heritage_risk_4,
    pointToLayer: function (feature, latlng) {
      var context = {
        feature: feature,
        variables: {}
      };
      return L.shapeMarker(latlng, style_comprehensive_heritage_risk_4_0(feature));
    },
  });
  bounds_group.addLayer(layer_comprehensive_heritage_risk_4);
  map.addLayer(layer_comprehensive_heritage_risk_4);
  allLayers.heritage = layer_comprehensive_heritage_risk_4;
}

