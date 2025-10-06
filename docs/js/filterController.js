var filters = {
  heritage: {
    immovable: true,
    movable: true
  },
  risk: {
    medium: true,
    high: true,
    very_high: true
  },
  riskType: {
    dam: true,
    fire: true,
    geological: true,
    hydrological: true,
    none: true
  },
  layers: {
    heritage: true,
    dam_buffers: true,
    municipal_risk: true,
    municipal_boundaries: true
  }
};

var allLayers = {};

function toggleFilterPanel() {
  var panel = document.getElementById('filterOptions');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function applyHeritageFilters() {
  if (allLayers.heritage) {
    allLayers.heritage.eachLayer(function(layer) {
      var nature = String(layer.feature.properties['ds_natureza'] || '');
      var show = false;

      if (nature.includes('Imóvel') && filters.heritage.immovable) show = true;
      if (nature.includes('Móvel') && filters.heritage.movable) show = true;

      // If neither immovable nor movable filter is selected, hide all
      if (!filters.heritage.immovable && !filters.heritage.movable) {
        show = false;
      }

      if (show) {
        layer.setStyle({opacity: 1, fillOpacity: 0.8});
      } else {
        layer.setStyle({opacity: 0, fillOpacity: 0});
      }
    });
  }
}

function toggleHeritageFilter(type) {
  filters.heritage[type] = !filters.heritage[type];
  document.getElementById('heritage_' + type).checked = filters.heritage[type];
  applyHeritageFilters();
}

function toggleLayer(layerName) {
  filters.layers[layerName] = !filters.layers[layerName];
  document.getElementById('layer_' + layerName).checked = filters.layers[layerName];

  var layer = allLayers[layerName];
  if (layer) {
    if (filters.layers[layerName]) {
      map.addLayer(layer);
    } else {
      map.removeLayer(layer);
    }
  }
}

function toggleRiskTypeFilter(type) {
  filters.riskType[type] = !filters.riskType[type];
  document.getElementById('risk_type_' + type).checked = filters.riskType[type];
  applyRiskTypeFilters();
}

function applyRiskTypeFilters() {
  if (allLayers.heritage) {
    allLayers.heritage.eachLayer(function(layer) {
      var damRisk = layer.feature.properties['dam_risk_score'] || 0;
      var fireRisk = layer.feature.properties['fire_risk_score'] || 0;
      var cemRisk = layer.feature.properties['cemaden_risk_score'] || 0;
      var show = false;

      if (filters.riskType.dam && damRisk > 0) show = true;
      if (filters.riskType.fire && fireRisk > 0) show = true;
      if (filters.riskType.geological && cemRisk > 0) show = true;
      if (filters.riskType.none && cemRisk == 0 && fireRisk == 0 && damRisk == 0) show = true;

      if (!filters.riskType.dam && !filters.riskType.fire && !filters.riskType.geological && !filters.riskType.none) {
        document.getElementById('heritage_immovable').checked = false;
        document.getElementById('heritage_movable').checked = false;
      }

      if (show) {
        layer.setStyle({opacity: 1, fillOpacity: 0.8});
      } else {
        layer.setStyle({opacity: 0, fillOpacity: 0});
      }
    });
  }
}

