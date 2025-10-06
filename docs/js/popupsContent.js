var highlightLayer;

var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

function removeEmptyRowsFromPopupContent(content, feature) {
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  var rows = tempDiv.querySelectorAll('tr');
  for (var i = 0; i < rows.length; i++) {
    var td = rows[i].querySelector('td.visible-with-data');
    var key = td ? td.id : '';
    if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
      rows[i].parentNode.removeChild(rows[i]);
    }
  }
  return tempDiv.innerHTML;
}

// Enhanced media popup class
function addClassToPopupIfMedia(content, popup) {
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  if (tempDiv.querySelector('td img')) {
    popup._contentNode.classList.add('media');
    setTimeout(function() {
      popup.update();
    }, 10);
  } else {
    popup._contentNode.classList.remove('media');
  }
}

function highlightFeature(e) {
  highlightLayer = e.target;
  highlightLayer.openPopup();
}

function pop_snisb_dam_buffers_3(feature, layer) {
  layer.on({
    mouseout: function(e) {
      if (typeof layer.closePopup == 'function') {
        layer.closePopup();
      } else {
        layer.eachLayer(function(feature){
          feature.closePopup()
        });
      }
    },
    mouseover: highlightFeature,
  });
  var popupContent = '<table>\
    <tr>\
    <td colspan="2" class="heritage-title"><strong>' + (feature.properties['dam_name'] !== null ? autolinker.link(String(feature.properties['dam_name']).replace(/'/g, '\'').toLocaleString()) : '') + '</strong></td>\
    </tr>\
    <tr>\
    <th scope="row">Estado</th>\
    <td>' + (feature.properties['state'] !== null ? autolinker.link(String(feature.properties['state']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Município</th>\
    <td>' + (feature.properties['municipality'] !== null ? autolinker.link(String(feature.properties['municipality']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Finalidade</th>\
    <td>' + (feature.properties['purpose'] !== null ? autolinker.link(String(feature.properties['purpose']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Categoria de Risco</th>\
    <td class="risk-score">' + (feature.properties['risk_category'] !== null ? autolinker.link(String(feature.properties['risk_category']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Potencial de Dano</th>\
    <td class="risk-score">' + (feature.properties['damage_potential'] !== null ? autolinker.link(String(feature.properties['damage_potential']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Risco ao Bem Cultural</th>\
    <td class="risk-score">' + (feature.properties['heritage_risk_potential'] !== null ? autolinker.link(String(feature.properties['heritage_risk_potential']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    </table>';
  var content = removeEmptyRowsFromPopupContent(popupContent, feature);
  layer.on('popupopen', function(e) {
    addClassToPopupIfMedia(content, e.popup);
  });
  layer.bindPopup(content, { maxHeight: 400 });
}

function pop_comprehensive_heritage_risk_4(feature, layer) {
  layer.on({
    mouseout: function(e) {
      if (typeof layer.closePopup == 'function') {
        layer.closePopup();
      } else {
        layer.eachLayer(function(feature){
          feature.closePopup()
        });
      }
    },
    mouseover: function(e) {
      highlightLayer = e.target;
      if (feature.properties['ds_natureza'] == "Bem Móvel ou Integrado" && document.getElementById('heritage_movable').checked == true) {
        highlightLayer.openPopup();
      }
      if (feature.properties['ds_natureza'] == "Bem Imóvel" && document.getElementById('heritage_immovable').checked == true) {
        highlightLayer.openPopup();
      }
    },
  });

  // Enhanced heritage popup with 3 risk levels
  var riskScore = feature.properties['comprehensive_risk_score'];
  var riskLevel = 'Sem Risco';
  var riskColor = '#95a5a6';

  if (riskScore !== null && riskScore !== undefined && riskScore > 0) {
    if (riskScore <= 0.72) {
      riskLevel = 'Risco Médio';
      riskColor = '#f1c40f'; // Yellow
    } else if (riskScore <= 1.5) {
      riskLevel = 'Risco Alto';
      riskColor = '#e67e22'; // Orange
    } else {
      riskLevel = 'Risco Muito Alto';
      riskColor = '#e74c3c'; // Red
    }
  }

  var popupContent = '<table>\
    <tr>\
    <td colspan="2" class="heritage-title"><strong>' + (feature.properties['identificacao_bem'] !== null ? autolinker.link(String(feature.properties['identificacao_bem']).replace(/'/g, '\'').toLocaleString()) : 'Sítio de Bem Cultural') + '</strong></td>\
    </tr>\
    <tr>\
    <th scope="row">Natureza</th>\
    <td>' + (feature.properties['ds_natureza'] !== null ? autolinker.link(String(feature.properties['ds_natureza']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Tipo de Proteção</th>\
    <td>' + (feature.properties['ds_tipo_protecao'] !== null ? autolinker.link(String(feature.properties['ds_tipo_protecao']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Município</th>\
    <td>' + (feature.properties['municipality'] !== null ? autolinker.link(String(feature.properties['municipality']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Estado</th>\
    <td>' + (feature.properties['uf'] !== null ? autolinker.link(String(feature.properties['uf']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Risco Geral</th>\
    <td class="risk-score" style="background-color: ' + riskColor + ' !important;">' + riskLevel + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Pontuação de Risco</th>\
    <td class="risk-score">' + (riskScore !== null ? riskScore.toFixed(2) : 'N/A') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Desastre Tecnológico</th>\
    <td>' + (feature.properties['dam_risk_score'] !== null ? feature.properties['dam_risk_score'].toFixed(2) : 'N/A') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Incêndio Florestal</th>\
    <td>' + (feature.properties['fire_risk_score'] !== null ? feature.properties['fire_risk_score'].toFixed(2) : 'N/A') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Risco CEMADEN (Geo/Hidro)</th>\
    <td>' + (feature.properties['cemaden_risk_score'] !== null ? feature.properties['cemaden_risk_score'].toFixed(2) : 'N/A') + '</td>\
    </tr>\
    </table>';
  var content = removeEmptyRowsFromPopupContent(popupContent, feature);
  layer.on('popupopen', function(e) {
    addClassToPopupIfMedia(content, e.popup);
  });
  layer.bindPopup(content, { maxHeight: 400 });
}

function pop_municipalities_with_combined_risk_simplified_2(feature, layer) {
  layer.on({
    mouseout: function(e) {
      if (typeof layer.closePopup == 'function') {
        layer.closePopup();
      } else {
        layer.eachLayer(function(feature){
          feature.closePopup()
        });
      }
    },
    mouseover: highlightFeature,
  });

  const props = feature.properties;
  const heatIndex = props['heritage_heat_index'];
  const heatClass = props['heritage_heat_class'];

  // Determine color and label based on heat class
  let heatColor = '#95a5a6';
  let heatLabel = 'Nenhum';

  if (heatClass === 'low') {
    heatColor = '#f1c40f'; // Yellow
    heatLabel = 'Baixo';
  } else if (heatClass === 'high') {
    heatColor = '#e74c3c'; // Red
    heatLabel = 'Alto';
  }

  const popupContent = '<table>\
    <tr>\
    <td colspan="2" class="heritage-title"><strong>' + (props['NM_MUN'] ?? '') + '</strong></td>\
    </tr>\
    <tr>\
    <th scope="row">Estado</th>\
    <td>' + (props['SIGLA_UF'] ?? '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Nível de Risco</th>\
    <td class="risk-score" style="background-color: ' + heatColor + ' !important;">' + heatLabel + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Pontuação de Risco</th>\
    <td class="risk-score">' + (heatIndex !== null ? heatIndex.toFixed(2) : 'N/A') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Bens Culturais Protegidos</th>\
    <td>' + (props['NUMPOINTS'] !== null ? props['NUMPOINTS'] : 0) + '</td>\
    </tr>\
    </table>';

  const content = removeEmptyRowsFromPopupContent(popupContent, feature);
  layer.on('popupopen', function(e) {
    addClassToPopupIfMedia(content, e.popup);
  });
  layer.bindPopup(content, { maxHeight: 400 });
}

function pop_snisb_dam_buffers_3(feature, layer) {
  layer.on({
    mouseout: function(e) {
      if (typeof layer.closePopup == 'function') {
        layer.closePopup();
      } else {
        layer.eachLayer(function(feature){
          feature.closePopup()
        });
      }
    },
    mouseover: highlightFeature,
  });
  var popupContent = '<table>\
    <tr>\
    <td colspan="2" class="heritage-title"><strong>' + (feature.properties['dam_name'] !== null ? autolinker.link(String(feature.properties['dam_name']).replace(/'/g, '\'').toLocaleString()) : '') + '</strong></td>\
    </tr>\
    <tr>\
    <th scope="row">Estado</th>\
    <td>' + (feature.properties['state'] !== null ? autolinker.link(String(feature.properties['state']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Município</th>\
    <td>' + (feature.properties['municipality'] !== null ? autolinker.link(String(feature.properties['municipality']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Finalidade</th>\
    <td>' + (feature.properties['purpose'] !== null ? autolinker.link(String(feature.properties['purpose']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Categoria de Risco</th>\
    <td class="risk-score">' + (feature.properties['risk_category'] !== null ? autolinker.link(String(feature.properties['risk_category']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Potencial de Dano</th>\
    <td class="risk-score">' + (feature.properties['damage_potential'] !== null ? autolinker.link(String(feature.properties['damage_potential']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    <tr>\
    <th scope="row">Risco ao Bem Cultural</th>\
    <td class="risk-score">' + (feature.properties['heritage_risk_potential'] !== null ? autolinker.link(String(feature.properties['heritage_risk_potential']).replace(/'/g, '\'').toLocaleString()) : '') + '</td>\
    </tr>\
    </table>';
  var content = removeEmptyRowsFromPopupContent(popupContent, feature);
  layer.on('popupopen', function(e) {
    addClassToPopupIfMedia(content, e.popup);
  });
  layer.bindPopup(content, { maxHeight: 400 });
}
