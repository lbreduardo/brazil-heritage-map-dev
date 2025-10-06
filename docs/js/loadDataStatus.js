var dataStatus = {
  heritage: 0,
  dams: 0,
  municipalities: 0,
  riskAreas: 0
};

document.addEventListener('DOMContentLoaded', () => {
  updateTimestamp();
  checkDataStatus();
});

function updateTimestamp() {
  fetch('../../processed_data/processing_report.json')
    .then(response => response.json())
    .then(data => {
      var latestTimestamp = data.report_date;

      document.getElementById('lastUpdate').innerHTML = 
        'Última Atualização dos Dados: ' + latestTimestamp.toLocaleString('pt-BR');
    })
    .catch(error => {
      console.warn('Could not load data timestamps:', error);
      var now = new Date();
      document.getElementById('lastUpdate').innerHTML = 
        'Última Atualização: ' + now.toLocaleString('pt-BR');
    });
}

function checkDataStatus() {
  if (typeof json_comprehensive_heritage_risk_4 !== 'undefined' && json_comprehensive_heritage_risk_4.features) {
    dataStatus.heritage = json_comprehensive_heritage_risk_4.features.length;
    document.getElementById('heritageCount').innerHTML = '🏛️ Bens Culturais Materiais Protegidos: ' + dataStatus.heritage;
  } else {
    document.getElementById('heritageCount').innerHTML = '🏛️ Bens Culturais Materiais Protegidos: ❌ Falha ao carregar';
  }

  if (typeof json_snisb_dam_buffers_3 !== 'undefined' && json_snisb_dam_buffers_3.features) {
    dataStatus.dams = json_snisb_dam_buffers_3.features.length;
    document.getElementById('damCount').innerHTML = '🏗️ Barragens Potencialmente Perigosas: ' + dataStatus.dams;
  } else {
    document.getElementById('damCount').innerHTML = '🏗️ Barragens Potencialmente Perigosas: ❌ Falha ao carregar';
  }

  if (typeof json_municipalities_1_simplified_1 !== 'undefined' && json_municipalities_1_simplified_1.features) {
    dataStatus.municipalities = json_municipalities_1_simplified_1.features.length;
    document.getElementById('municipalCount').innerHTML = '🗺️ Limites Municipais: ' + dataStatus.municipalities;
  } else {
    document.getElementById('municipalCount').innerHTML = '🗺️ Limites Municipais: ❌ Falha ao carregar';
  }

  if (typeof json_municipalities_with_combined_risk_simplified_2 !== 'undefined' && json_municipalities_with_combined_risk_simplified_2.features) {
    dataStatus.riskAreas = json_municipalities_with_combined_risk_simplified_2.features.length;
    document.getElementById('riskCount').innerHTML = '🎯 Cloroplético Municipal: ' + dataStatus.riskAreas;
  } else {
    document.getElementById('riskCount').innerHTML = '🎯 Cloroplético Municipal: ❌ Falha ao carregar';
  }
}
