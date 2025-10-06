function style_municipalities_1_simplified_1_0() {
  return {
    pane: 'pane_municipalities_1_simplified_1',
    opacity: 1,
    color: 'rgba(140,140,140,0.7)',
    dashArray: '',
    lineCap: 'butt',
    lineJoin: 'miter',
    weight: 1, 
    fill: true,
    fillOpacity: 0.3,
    fillColor: 'rgba(236,242,246,0.3)',
    interactive: true,
  }
}

function style_comprehensive_heritage_risk_4_0(feature) {
  var nature = String(feature.properties['ds_natureza'] || '');
  var riskScore = feature.properties['comprehensive_risk_score'];

  // Determine risk color based on 3 levels
  var fillColor = '#8BC34A'; // Default light green for no risk
  if (riskScore !== null && riskScore !== undefined && riskScore > 0) {
    if (riskScore <= 0.72) {
      fillColor = '#f1c40f'; // Yellow - Medium risk
    } else if (riskScore <= 1.5) {
      fillColor = '#e67e22'; // Orange - High risk
    } else {
      fillColor = '#e74c3c'; // Red - Very high risk
    }
  }

  // Handle both possible accent variations and encoding issues
  if (nature.includes('Imóvel') || nature.includes('Imovel')) {
    // Circles for immovable heritage
    return {
      pane: 'pane_comprehensive_heritage_risk_4',
      radius: 4.0,
      opacity: 1,
      color: fillColor,
      dashArray: '',
      lineCap: 'butt',
      lineJoin: 'miter',
      weight: 2.0,
      fill: true,
      fillOpacity: 0.8,
      fillColor: fillColor,
      interactive: true,
    }
  } else if (nature.includes('Móvel') || nature.includes('Movel')) {
    // Diamonds for movable heritage
    return {
      pane: 'pane_comprehensive_heritage_risk_4',
      shape: 'diamond',
      radius: 4.0,
      opacity: 1,
      color: '#3498db',
      dashArray: '',
      lineCap: 'butt',
      lineJoin: 'miter',
      weight: 2.0,
      fill: true,
      fillOpacity: 0.8,
      fillColor: '#3498db',
      interactive: true,
    }
  } else {
    // Triangles for other heritage types
    return {
      pane: 'pane_comprehensive_heritage_risk_4',
      shape: 'triangle',
      radius: 4.0,
      opacity: 1,
      color: fillColor,
      dashArray: '',
      lineCap: 'butt',
      lineJoin: 'miter',
      weight: 2.0,
      fill: true,
      fillOpacity: 0.8,
      fillColor: fillColor,
      interactive: true,
    }
  }
}

function style_municipalities_with_combined_risk_simplified_2_0(feature) {
  const index = feature.properties.heritage_heat_index;
  let fillColor = "#ffffff"; // fallback para dados ausentes

  if (index > 576) {
    fillColor = "#7a0403";
  } else if (index > 228.8) {
    fillColor = "#bd2002";
  } else if (index > 88.2) {
    fillColor = "#e94d0d";
  } else if (index > 31) {
    fillColor = "#fe8f29";
  } else if (index > 19) {
    fillColor = "#f2c93a";
  } else if (index > 13) {
    fillColor = "#c2f234";
  } else if (index > 8) {
    fillColor = "#7eff55";
  } else if (index > 5) {
    fillColor = "#2aefa1";
  } else if (index > 3) {
    fillColor = "#1fc9dd";
  } else if (index > 1) {
    fillColor = "#4390fe";
  } else if (index > 0) {
    fillColor = "#4455c4";
  } else {
    fillColor = "#30123b";
  }

  return {
    pane: 'pane_municipalities_with_combined_risk_simplified_2',
    opacity: 1,
    color: '#ffffff',
    dashArray: '',
    lineCap: 'butt',
    lineJoin: 'miter',
    weight: 0.5,
    fill: true,
    fillOpacity: 0.8,
    fillColor: fillColor,
    interactive: true,
  };
}

function style_snisb_dam_buffers_3_0() {
  return {
    pane: 'pane_snisb_dam_buffers_3',
    opacity: 1,
    color: 'rgba(35,35,35,1.0)',
    dashArray: '',
    lineCap: 'butt',
    lineJoin: 'miter',
    weight: 2.0, 
    fill: true,
    fillOpacity: 0.6,
    fillColor: 'rgba(231,113,72,0.6)',
    interactive: true,
  }
}
