/* ==========================================
   BRAZILIAN HERITAGE RISK MANAGEMENT MAP
   Main JavaScript File - Enhanced Risk Formula
   ========================================== */

// Show loading indicator
document.getElementById('loadingIndicator').style.display = 'block';

/* ==========================================
   GLOBAL VARIABLES
   ========================================== */

// Map and layers
var map;
var allLayers = {};
var originalStyles = new Map();
var dominantRiskCache = new Map();

// Document manifest for file existence checking
var documentManifest = null;

// Filter states
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
    geo_hydro: true 
},
    layers: {
        heritage: true,
        dam_buffers: true,
        municipal_risk: true,
        municipal_boundaries: true
    }
};

// Data validation and status tracking
var dataStatus = {
    heritage: 0,
    dams: 0,
    municipalities: 0,
    riskAreas: 0
};

// Enhanced risk calculation cache
var enhancedRiskCache = new Map();

/* ==========================================
   DOCUMENT MANAGEMENT SYSTEM
   ========================================== */

// Load document manifest on startup
function loadDocumentManifest() {
    fetch('./documents.json')
        .then(response => {
            if (!response.ok) {
                console.warn('Document manifest not found, using empty manifest');
                documentManifest = { protocols: [], risk_management_plans: [] };
                return null;
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                documentManifest = data;
                console.log('Document manifest loaded:', documentManifest);
            }
        })
        .catch(error => {
            console.warn('Error loading document manifest:', error);
            documentManifest = { protocols: [], risk_management_plans: [] };
        });
}

// Check for municipal protocol existence using manifest
function checkMunicipalProtocol(municipalityName, uf) {
    if (!documentManifest) return false;
    var key = normalizeText(municipalityName + '_' + uf);
    return documentManifest.protocols.includes(key);
}

// Check for heritage risk management plan existence using manifest
function checkHeritageRiskPlan(heritageId) {
    if (!documentManifest) return false;
    var key = normalizeText(heritageId);
    return documentManifest.risk_management_plans.includes(key);
}

/* ==========================================
   ENHANCED RISK CALCULATION SYSTEM
   ========================================== */

// Calculate ICM risk factor based on municipal classification (CLIENT'S CORRECTED VERSION)
function getICMRiskFactor(feature) {
    var municipality = normalizeText(feature.properties['municipality'] || '');
    var uf = normalizeText(feature.properties['uf'] || '');
    var municipalityKey = municipality + '_' + uf;
    var icmClass = window.icmData && window.icmData[municipalityKey] ? window.icmData[municipalityKey] : null;
    
    // CLIENT'S SPECIFICATION: ICM risk factors where better classification reduces risk
    // A = 0 (best capacity, no additional risk)
    // B = 1 (good capacity, minimal risk)  
    // C = 2 (poor capacity, moderate risk)
    // D = 3 (worst capacity, highest risk)
    switch(icmClass) {
        case 'A': return 0;  // Best infrastructure - no additional risk
        case 'B': return 1;  // Good infrastructure - minimal risk addition
        case 'C': return 2;  // Poor infrastructure - moderate risk addition
        case 'D': return 3;  // Worst infrastructure - highest risk addition
        default: return 1.5; // Unknown classification - medium risk addition
    }
}

// Calculate PDF availability factor using static file checking with manifest
function getPDFAvailabilityFactor(feature) {
    var municipality = feature.properties['municipality'] || '';
    var uf = feature.properties['uf'] || '';
    var heritageId = feature.properties['identificacao_bem'] || feature.properties['id'] || '';
    
    // Check for municipality protocol using manifest
    var hasProtocol = checkMunicipalProtocol(municipality, uf);
    
    // Check for heritage risk management plan using manifest
    var hasRiskPlan = checkHeritageRiskPlan(heritageId);
    
    // Return risk adjustment based on document availability
    // CLIENT'S SPECIFICATION: Boolean factor based on document presence/absence
    if (hasProtocol && hasRiskPlan) {
        return 0; // Both documents present - significant risk reduction
    } else if (hasProtocol || hasRiskPlan) {
        return 0.5; // One document present - moderate risk reduction
    } else {
        return 1; // No documents - risk increase (lack of preparedness)
    }
}

// Calculate enhanced comprehensive risk score using CLIENT'S BASE RISK APPROACH
function calculateEnhancedRisk(feature) {
    var featureId = feature.properties['identificacao_bem'] || feature.properties['id'] || Math.random();
    
    // Check cache first
    if (enhancedRiskCache.has(featureId)) {
        return enhancedRiskCache.get(featureId);
    }
    
    // CLIENT'S BASE RISK: Use heritage_heat_index approach
    // heritage_heat_index = comprehensive_risk_score_mean × NUMPOINTS
    var comprehensiveRiskMean = parseFloat(feature.properties['comprehensive_risk_score_mean']) || 
                               parseFloat(feature.properties['comprehensive_risk_score']) || 0;
    var numPoints = parseFloat(feature.properties['NUMPOINTS']) || 1;
    var baseRisk = comprehensiveRiskMean * numPoints; // This is the heritage_heat_index
    
    // ICM Classification Factor (municipal emergency response capacity)
    var icmFactor = getICMRiskFactor(feature);
    
    // PDF Availability Factor (emergency preparedness documentation)
    var pdfFactor = getPDFAvailabilityFactor(feature);
    
    // CLIENT'S ENHANCED RISK FORMULA:
    // Final Risk = (Base Risk × 0.6) - (ICM Factor × 0.25) + (PDF Factor × 0.15)
    // Note: ICM adds to risk (worse capacity = higher risk)
    var enhancedRisk = (baseRisk * 0.6) + (icmFactor * 0.25) + (pdfFactor * 0.15);
    
    // Ensure risk is within reasonable bounds
    enhancedRisk = Math.max(0, Math.min(enhancedRisk, 5.0));
    
    // Cache the result
    enhancedRiskCache.set(featureId, enhancedRisk);
    
    return enhancedRisk;
}

// Get enhanced risk level label and color
function getEnhancedRiskLevel(enhancedRisk) {
    if (enhancedRisk <= 0.1) return { level: 'Sem Risco', color: '#95a5a6' };
    if (enhancedRisk <= 0.72) return { level: 'Risco Médio', color: '#f1c40f' };
    if (enhancedRisk <= 1.5) return { level: 'Risco Alto', color: '#e67e22' };
    return { level: 'Risco Muito Alto', color: '#e74c3c' };
}

// Clear risk cache when data changes
function clearRiskCache() {
    enhancedRiskCache.clear();
    dominantRiskCache.clear();
}

/* ==========================================
   UTILITY FUNCTIONS
   ========================================== */

function normalizeText(text) {
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_]/g, '')
        .trim();
}

function updateTimestamp() {
    fetch('./data_info.json')
        .then(response => response.json())
        .then(data => {
            // Find the most recent timestamp
            var timestamps = Object.values(data).map(t => new Date(t));
            var latestTimestamp = new Date(Math.max(...timestamps));
            
            document.getElementById('lastUpdate').innerHTML = 
                'Última Atualização dos Dados: ' + latestTimestamp.toLocaleString('pt-BR');
        })
        .catch(error => {
            console.warn('Could not load data timestamps:', error);
            // Fallback to current time
            var now = new Date();
            document.getElementById('lastUpdate').innerHTML = 
                'Última Atualização: ' + now.toLocaleString('pt-BR');
        });
}

function getDominantRiskType(properties) {
    var damRisk = parseFloat(properties['dam_risk_score']) || 0;
    var fireRisk = parseFloat(properties['fire_risk_score']) || 0;
    var cemadenRisk = parseFloat(properties['cemaden_risk_score']) || 0;
    
    // If the site has ANY CEMADEN risk, it now belongs to the merged 'geo_hydro' category
    if (cemadenRisk > 0.1) {
        return 'geo_hydro'; // This is the key change!
    }
    
    if (damRisk <= 0.1 && fireRisk <= 0.1 && cemadenRisk <= 0.1) {
        return 'geo_hydro'; // Low-risk sites now go to the merged category
    }
    
    var maxRisk = Math.max(damRisk, fireRisk, cemadenRisk);
    
    if (maxRisk === damRisk && damRisk > 0) {
        return 'dam';
    } else if (maxRisk === fireRisk && fireRisk > 0) {
        return 'fire';
    }
    // Removed the logic that assigned 'natural' or 'hydro'
    
    return 'geo_hydro'; // Default fallback to the merged category
}

function optimizeMunicipalBoundaries() {
    if (!allLayers.heritage || !allLayers.municipal_boundaries) return;
    
    var activeMunicipalities = new Set();
    
    // Collect municipalities with heritage sites
    allLayers.heritage.eachLayer(function(layer) {
        var mun = normalizeText(layer.feature.properties['municipality'] || '');
        var state = normalizeText(layer.feature.properties['uf'] || '');
        activeMunicipalities.add(mun + '_' + state);
    });
    
    // Remove municipalities without heritage from the layer group
    var layersToRemove = [];
    allLayers.municipal_boundaries.eachLayer(function(layer) {
        var munName = normalizeText(layer.feature.properties['NM_MUN'] || '');
        var munState = normalizeText(layer.feature.properties['SIGLA_UF'] || '');
        var key = munName + '_' + munState;
        
        if (!activeMunicipalities.has(key)) {
            layersToRemove.push(layer);
        }
    });
    
    // Actually remove the layers
    layersToRemove.forEach(function(layer) {
        allLayers.municipal_boundaries.removeLayer(layer);
    });
    
    console.log('Performance optimization: removed', layersToRemove.length, 'empty municipalities');
}

// Progressive loading system
function loadLayerProgressively(layerName, callback) {
    switch(layerName) {
        case 'heritage':
            if (typeof json_comprehensive_heritage_risk_4 !== 'undefined') {
                setTimeout(callback, 100); // Small delay for UI update
            } else {
                setTimeout(function() { loadLayerProgressively(layerName, callback); }, 100);
            }
            break;
        case 'municipal_risk':
            if (typeof json_municipalities_with_combined_risk_simplified_2 !== 'undefined') {
                setTimeout(callback, 100);
            } else {
                setTimeout(function() { loadLayerProgressively(layerName, callback); }, 100);
            }
            break;
        case 'dam_buffers':
            if (typeof json_snisb_dam_buffers_3 !== 'undefined') {
                setTimeout(callback, 100);
            } else {
                setTimeout(function() { loadLayerProgressively(layerName, callback); }, 100);
            }
            break;
        case 'municipal_boundaries':
            if (typeof json_municipalities_1_simplified_1 !== 'undefined') {
                setTimeout(callback, 100);
            } else {
                setTimeout(function() { loadLayerProgressively(layerName, callback); }, 100);
            }
            break;
    }
}

function updateLoadingProgress(percent, message) {
    var indicator = document.getElementById('loadingIndicator');
    indicator.innerHTML = '<div style="text-align: center;">' +
                         '<div style="font-size: 14px; margin-bottom: 5px;">' + message + '</div>' +
                         '<div style="background: rgba(255,255,255,0.3); height: 4px; border-radius: 2px; overflow: hidden;">' +
                         '<div style="background: #3498db; height: 100%; width: ' + percent + '%; transition: width 0.3s ease;"></div>' +
                         '</div>' +
                         '<div style="font-size: 12px; margin-top: 3px;">' + percent + '%</div>' +
                         '</div>';
}

function initializeProgressiveLoading() {
    updateLoadingProgress(0, 'Iniciando carregamento...');
    
    loadLayerProgressively('heritage', function() {
        updateLoadingProgress(25, 'Carregando sítios de patrimônio...');
        
        loadLayerProgressively('municipal_risk', function() {
            updateLoadingProgress(50, 'Carregando áreas de risco...');
            
            loadLayerProgressively('dam_buffers', function() {
                updateLoadingProgress(75, 'Carregando zonas de barragens...');
                
                loadLayerProgressively('municipal_boundaries', function() {
                    updateLoadingProgress(90, 'Otimizando limites municipais...');
                    
                    setTimeout(function() {
                        checkDataStatus();
                        optimizeMunicipalBoundaries();
                        updateLoadingProgress(100, 'Concluído!');
                        
                        setTimeout(function() {
                            document.getElementById('loadingIndicator').style.display = 'none';
                            applyAllFilters();
                        }, 500);
                    }, 300);
                });
            });
        });
    });
}

function refreshHeritageLayerStyling() {
    if (!allLayers.heritage) return;
    
    allLayers.heritage.eachLayer(function(layer) {
        var newStyle = getHeritageStyleWithEnhancedRisk(layer.feature);
        layer.setStyle(newStyle);
    });
}

function getHeritageStyleWithEnhancedRisk(feature) {
    var nature = String(feature.properties['ds_natureza'] || '');
    var enhancedRisk = calculateEnhancedRisk(feature);
    var riskInfo = getEnhancedRiskLevel(enhancedRisk);
    
    var baseStyle = {
        radius: 4.0,
        opacity: 1,
        color: 'rgba(255,255,255,0.9)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 2.0,
        fill: true,
        fillOpacity: 0.8,
        fillColor: riskInfo.color,
        interactive: true,
    };
    
    if (nature.includes('Imóvel') || nature.includes('Imovel') || nature.includes('Bem Imóvel')) {
        return Object.assign(baseStyle, { pane: 'pane_comprehensive_heritage_risk_4' });
    } else if (nature.includes('Móvel') || nature.includes('Movel') || nature.includes('Bem Móvel')) {
        return Object.assign(baseStyle, { pane: 'pane_comprehensive_heritage_risk_4', shape: 'diamond' });
    } else {
        return Object.assign(baseStyle, { pane: 'pane_comprehensive_heritage_risk_4', shape: 'triangle' });
    }
}

/* ==========================================
   DATA STATUS FUNCTIONS
   ========================================== */



function checkDataStatus() {
    if (typeof json_comprehensive_heritage_risk_4 !== 'undefined' && json_comprehensive_heritage_risk_4.features) {
        dataStatus.heritage = json_comprehensive_heritage_risk_4.features.length;
        document.getElementById('heritageCount').innerHTML = 'Sítios de Bens Culturais: ' + dataStatus.heritage;
        
    } else {
        document.getElementById('heritageCount').innerHTML = 'Sítios de Bens Culturais: Falha ao carregar';
    }
    
    if (typeof json_snisb_dam_buffers_3 !== 'undefined' && json_snisb_dam_buffers_3.features) {
        dataStatus.dams = json_snisb_dam_buffers_3.features.length;
        document.getElementById('damCount').innerHTML = 'Zonas de Barragens: ' + dataStatus.dams;
    } else {
        document.getElementById('damCount').innerHTML = 'Zonas de Barragens: Falha ao carregar';
    }
    
    if (typeof json_municipalities_1_simplified_1 !== 'undefined' && json_municipalities_1_simplified_1.features) {
        dataStatus.municipalities = json_municipalities_1_simplified_1.features.length;
        document.getElementById('municipalCount').innerHTML = 'Municípios: ' + dataStatus.municipalities;
    } else {
        document.getElementById('municipalCount').innerHTML = 'Municípios: Falha ao carregar';
    }
    
    if (typeof json_municipalities_with_combined_risk_simplified_2 !== 'undefined' && json_municipalities_with_combined_risk_simplified_2.features) {
        dataStatus.riskAreas = json_municipalities_with_combined_risk_simplified_2.features.length;
        document.getElementById('riskCount').innerHTML = 'Áreas de Risco: ' + dataStatus.riskAreas;
    } else {
        document.getElementById('riskCount').innerHTML = 'Áreas de Risco: Falha ao carregar';
    }
    
    updateTimestamp();
}

/* ==========================================
   FILTER FUNCTIONS
   ========================================== */

function toggleFilterPanel() {
    var panel = document.getElementById('filterPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

function toggleHeritageFilter(type) {
    filters.heritage[type] = !filters.heritage[type];
    document.getElementById('heritage_' + type).checked = filters.heritage[type];
    applyAllFilters();
}

function toggleRiskFilter(level) {
    filters.risk[level] = !filters.risk[level];
    document.getElementById('risk_' + level).checked = filters.risk[level];
    applyAllFilters();
}

function toggleRiskTypeFilter(type) {
    filters.riskType[type] = !filters.riskType[type];
    document.getElementById('risk_type_' + type).checked = filters.riskType[type];
    applyAllFilters();
}

function applyAllFilters() {
    if (!allLayers.heritage) return;
    
    allLayers.heritage.eachLayer(function(layer) {
        if (!originalStyles.has(layer._leaflet_id)) {
            originalStyles.set(layer._leaflet_id, {
                opacity: 1,
                fillOpacity: 0.8
            });
        }
        
        if (!dominantRiskCache.has(layer._leaflet_id)) {
            var dominantType = getDominantRiskType(layer.feature.properties);
            dominantRiskCache.set(layer._leaflet_id, dominantType);
        }
        
        var nature = String(layer.feature.properties['ds_natureza'] || '');
        var enhancedRisk = calculateEnhancedRisk(layer.feature);
        var dominantRisk = dominantRiskCache.get(layer._leaflet_id);
        
        var shouldShow = true;
        
        // Heritage Type Filter
        var heritageTypeMatches = false;
        var anyHeritageTypeSelected = filters.heritage.immovable || filters.heritage.movable;
        
        if (anyHeritageTypeSelected) {
            if (filters.heritage.immovable && (nature.includes('Imóvel') || nature.includes('Bem Imóvel'))) {
                heritageTypeMatches = true;
            }
            if (filters.heritage.movable && (nature.includes('Móvel') || nature.includes('Bem Móvel'))) {
                heritageTypeMatches = true;
            }
            
            if (!heritageTypeMatches) {
                shouldShow = false;
            }
        } else {
            shouldShow = false;
        }
        
        // Risk Level Filter - Using enhanced risk
        if (shouldShow) {
            var riskLevelMatches = false;
            var anyRiskLevelSelected = filters.risk.medium || filters.risk.high || filters.risk.very_high;
            
            if (anyRiskLevelSelected) {
                if (filters.risk.medium && enhancedRisk > 0 && enhancedRisk <= 0.72) {
                    riskLevelMatches = true;
                }
                if (filters.risk.high && enhancedRisk > 0.72 && enhancedRisk <= 1.5) {
                    riskLevelMatches = true;
                }
                if (filters.risk.very_high && enhancedRisk > 1.5) {
                    riskLevelMatches = true;
                }
                
                if (enhancedRisk === 0 && filters.risk.medium) {
                    riskLevelMatches = true;
                }
                
                if (!riskLevelMatches) {
                    shouldShow = false;
                }
            } else {
                shouldShow = false;
            }
        }
        
        // Dominant Risk Type Filter
        // Dominant Risk Type Filter
// Inside applyAllFilters(), find this section:
// Dominant Risk Type Filter
if (shouldShow) {
    // OLD: var anyRiskTypeSelected = filters.riskType.dam || filters.riskType.fire || filters.riskType.natural || filters.riskType.hydro;
    // NEW:
    var anyRiskTypeSelected = filters.riskType.dam || filters.riskType.fire || filters.riskType.geo_hydro;
    
    if (anyRiskTypeSelected) {
        var riskTypeMatches = false;
        
        if (filters.riskType[dominantRisk]) {
            riskTypeMatches = true;
        }
        
        if (!riskTypeMatches) {
            shouldShow = false;
        }
    } else {
        shouldShow = false;
    }
}
        
        // Apply visibility
        if (shouldShow) {
            var originalStyle = originalStyles.get(layer._leaflet_id);
            layer.setStyle({
                opacity: originalStyle.opacity,
                fillOpacity: originalStyle.fillOpacity
            });
            if (layer._path) {
                layer._path.style.pointerEvents = 'auto';
            }
        } else {
            layer.setStyle({
                opacity: 0,
                fillOpacity: 0
            });
            if (layer._path) {
                layer._path.style.pointerEvents = 'none';
            }
        }
    });
    

}

function toggleLayer(layerName) {
    console.log('Toggling layer:', layerName);
    
    filters.layers[layerName] = !filters.layers[layerName];
    document.getElementById('layer_' + layerName).checked = filters.layers[layerName];
    
    var layer = allLayers[layerName];
    console.log('Layer found:', layer);
    console.log('New state:', filters.layers[layerName]);
    
    if (layer) {
        if (filters.layers[layerName]) {
            if (!map.hasLayer(layer)) {
                map.addLayer(layer);
                console.log('Added layer to map');
            }
            if (layerName === 'heritage') {
                applyAllFilters();
            }
        } else {
            if (map.hasLayer(layer)) {
                map.removeLayer(layer);
                console.log('Removed layer from map');
            }
        }
    } else {
        console.log('ERROR: Layer not found in allLayers');
    }
}

function resetAllFilters() {
    // Reset all filter states to false
    filters.heritage.immovable = false;
    filters.heritage.movable = false;
    filters.risk.medium = false;
    filters.risk.high = false;
    filters.risk.very_high = false;
    filters.riskType.dam = false;
    filters.riskType.fire = false;
    filters.riskType.geo_hydro = false;  // Merged natural + hydro
    
    // Turn OFF all layers
    filters.layers.heritage = false;
    filters.layers.dam_buffers = false;
    filters.layers.municipal_risk = false;
    filters.layers.municipal_boundaries = false;
    
    // Update checkboxes to match filter states
    document.getElementById('heritage_immovable').checked = false;
    document.getElementById('heritage_movable').checked = false;
    document.getElementById('risk_type_dam').checked = false;
    document.getElementById('risk_type_fire').checked = false;
    document.getElementById('risk_type_geo_hydro').checked = false;  // Merged checkbox
    
    // Turn off layer checkboxes
    document.getElementById('layer_heritage').checked = false;
    document.getElementById('layer_dam_buffers').checked = false;
    document.getElementById('layer_municipal_risk').checked = false;
    document.getElementById('layer_municipal_boundaries').checked = false;
    
    // Remove all layers from map
    for (var layerName in allLayers) {
        if (allLayers[layerName] && map.hasLayer(allLayers[layerName])) {
            map.removeLayer(allLayers[layerName]);
        }
    }
    
    applyAllFilters();
}
function showAllLayers() {
    for (var category in filters) {
        for (var item in filters[category]) {
            filters[category][item] = true;
            
            var checkboxId;
            if (category === 'heritage') {
                checkboxId = 'heritage_' + item;
            } else if (category === 'risk') {
                checkboxId = 'risk_' + item;
            } else if (category === 'riskType') {
                checkboxId = 'risk_type_' + item;
            } else if (category === 'layers') {
                checkboxId = 'layer_' + item;
            }
            
            var checkbox = document.getElementById(checkboxId);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
    }
    
    for (var layerName in allLayers) {
        if (allLayers[layerName] && !map.hasLayer(allLayers[layerName])) {
            map.addLayer(allLayers[layerName]);
        }
    }
    
    applyAllFilters();
}

/* ==========================================
   MAP INITIALIZATION
   ========================================== */

var highlightLayer;
function highlightFeature(e) {
    highlightLayer = e.target;
    highlightLayer.openPopup();
}

map = L.map('map', {
    zoomControl: false, 
    maxZoom: 28, 
    minZoom: 1
});

var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

/* ==========================================
   POPUP UTILITY FUNCTIONS
   ========================================== */

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

/* ==========================================
   MAP CONTROLS SETUP
   ========================================== */

var zoomControl = L.control.zoom({
    position: 'topleft'
}).addTo(map);

var measureControl = new L.Control.Measure({
    position: 'topleft',
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    primaryAreaUnit: 'sqmeters',
    secondaryAreaUnit: 'hectares'
});
measureControl.addTo(map);
document.getElementsByClassName('leaflet-control-measure-toggle')[0].innerHTML = '';
document.getElementsByClassName('leaflet-control-measure-toggle')[0].className += ' fas fa-ruler';

var bounds_group = new L.featureGroup([]);
function setBounds() {
    if (bounds_group.getLayers().length) {
        map.fitBounds(bounds_group.getBounds());
    }
}

/* ==========================================
   BASE LAYER SETUP
   ========================================== */

map.createPane('pane_OpenStreetMap_0');
map.getPane('pane_OpenStreetMap_0').style.zIndex = 400;
var layer_OpenStreetMap_0 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    pane: 'pane_OpenStreetMap_0',
    opacity: 0.35,
    attribution: '',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 19
});
layer_OpenStreetMap_0;
map.addLayer(layer_OpenStreetMap_0);

/* ==========================================
   LAYER DEFINITIONS
   ========================================== */

// Municipal boundaries layer
function pop_municipalities_1_simplified_1(feature, layer) {
    // Empty function - no popups for municipal boundaries
}

function style_municipalities_1_simplified_1_0() {
    return {
        pane: 'pane_municipalities_1_simplified_1',
        opacity: 1,
        color: 'rgba(50,50,50,0.4)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1.5,
        fill: false,
        interactive: false,
    }
}

map.createPane('pane_municipalities_1_simplified_1');
map.getPane('pane_municipalities_1_simplified_1').style.zIndex = 401;
map.getPane('pane_municipalities_1_simplified_1').style['mix-blend-mode'] = 'normal';
var layer_municipalities_1_simplified_1 = new L.geoJson(json_municipalities_1_simplified_1, {
    attribution: '',
    interactive: false,
    dataVar: 'json_municipalities_1_simplified_1',
    layerName: 'layer_municipalities_1_simplified_1',
    pane: 'pane_municipalities_1_simplified_1',
    onEachFeature: pop_municipalities_1_simplified_1,
    style: style_municipalities_1_simplified_1_0,
});
bounds_group.addLayer(layer_municipalities_1_simplified_1);
map.addLayer(layer_municipalities_1_simplified_1);
allLayers.municipal_boundaries = layer_municipalities_1_simplified_1;

function pop_municipalities_with_combined_risk_simplified_2(feature, layer) {
    var municipality = feature.properties['nome'] || feature.properties['NM_MUN'] || '';
    var uf = feature.properties['uf'] || feature.properties['SIGLA_UF'] || '';
    var municipalityKey = normalizeText(municipality + '_' + uf);
    var icmClass = window.icmData && window.icmData[municipalityKey] ? window.icmData[municipalityKey] : 'N/A';
    
    // Get ICM color for badge
    var icmColor = '#757575'; // Default gray
    switch(icmClass) {
        case 'A': icmColor = '#27ae60'; break; // Green
        case 'B': icmColor = '#f39c12'; break; // Orange  
        case 'C': icmColor = '#e67e22'; break; // Dark orange
        case 'D': icmColor = '#e74c3c'; break; // Red
    }
    
    var popupContent = '<table>\
            <tr>\
                <td colspan="2" class="heritage-title"><strong>' + municipality + '</strong></td>\
            </tr>\
            <tr>\
                <th scope="row">Estado</th>\
                <td>' + uf + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Classificação ICM</th>\
                <td><span style="background-color: ' + icmColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">' + icmClass + '</span></td>\
            </tr>\
            <tr>\
                <th scope="row">Índice de Risco Geral</th>\
                <td>' + (parseFloat(feature.properties['heritage_heat_index']) || 0).toFixed(2) + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Número de Bens Culturais</th>\
                <td>' + (feature.properties['NUMPOINTS'] || 0) + '</td>\
            </tr>\
        </table>';
    
    layer.bindPopup(popupContent, {maxHeight: 400});
}

// CLIENT'S CHOROPLETH STYLING - Using heritage_heat_index with 12-level gradient
function style_municipalities_with_combined_risk_simplified_2_0(feature) {
    // Calculate enhanced risk for municipality
    var municipality = normalizeText(feature.properties['nome'] || feature.properties['NM_MUN'] || '');
    var uf = normalizeText(feature.properties['uf'] || feature.properties['SIGLA_UF'] || '');
    var municipalityKey = municipality + '_' + uf;
    var icmClass = window.icmData && window.icmData[municipalityKey] ? window.icmData[municipalityKey] : null;
    
    // Get ICM factor
    var icmFactor = 1.5; // default
    switch(icmClass) {
        case 'A': icmFactor = 0; break;
        case 'B': icmFactor = 1; break;
        case 'C': icmFactor = 2; break;
        case 'D': icmFactor = 3; break;
    }
    
    // Calculate enhanced index using client's formula
    var comprehensiveRiskMean = parseFloat(feature.properties['comprehensive_risk_score_mean']) || 0;
    var numPoints = parseFloat(feature.properties['NUMPOINTS']) || 1;
    var baseRisk = comprehensiveRiskMean * numPoints;
    
    // Enhanced formula: (baseRisk * 0.6) + (ICM * 0.25) + (PDF * 0.15)
    // For municipal level, assume average PDF factor of 0.5
    var enhancedIndex = (baseRisk * 0.6) + (icmFactor * 0.25) + (0.5 * 0.15);
    
    // Apply color based on enhanced index
    let fillColor = "#ffffff";
    
    if (enhancedIndex > 576) {
        fillColor = "#7a0403";
    } else if (enhancedIndex > 228.8) {
        fillColor = "#bd2002";
    } else if (enhancedIndex > 88.2) {
        fillColor = "#e94d0d";
    } else if (enhancedIndex > 31) {
        fillColor = "#fe8f29";
    } else if (enhancedIndex > 19) {
        fillColor = "#f2c93a";
    } else if (enhancedIndex > 13) {
        fillColor = "#c2f234";
    } else if (enhancedIndex > 8) {
        fillColor = "#7eff55";
    } else if (enhancedIndex > 5) {
        fillColor = "#2aefa1";
    } else if (enhancedIndex > 3) {
        fillColor = "#1fc9dd";
    } else if (enhancedIndex > 1) {
        fillColor = "#4390fe";
    } else if (enhancedIndex > 0) {
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

// Dam buffers layer
function pop_snisb_dam_buffers_3(feature, layer) {
    layer.on({
        click: highlightFeature,
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

// Heritage sites layer with enhanced risk calculation - CLIENT'S UPDATED POPUP STRUCTURE
function pop_comprehensive_heritage_risk_4(feature, layer) {
    layer.on({
        click: highlightFeature,
    });

    var municipality = normalizeText(feature.properties['municipality'] || '');
    var uf = normalizeText(feature.properties['uf'] || '');
    var municipalityKey = municipality + '_' + uf;
    var icmClassification = window.icmData && window.icmData[municipalityKey] ? window.icmData[municipalityKey] : null;

    var icmBadge = '';
    if (icmClassification) {
        var icmColor = '';
        switch(icmClassification) {
            case 'A': icmColor = '#2E7D32'; break;
            case 'B': icmColor = '#1976D2'; break;
            case 'C': icmColor = '#F57F17'; break;
            case 'D': icmColor = '#C62828'; break;
            default: icmColor = '#757575';
        }
        icmBadge = '<span style="background-color: ' + icmColor + '; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">' + icmClassification + '</span>';
    } else {
        icmBadge = '<span style="background-color: #757575; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">N/A</span>';
    }

    // Use enhanced risk calculation
    var enhancedRisk = calculateEnhancedRisk(feature);
    var riskInfo = getEnhancedRiskLevel(enhancedRisk);

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
                <th scope="row">Classificação ICM</th>\
                <td>' + icmBadge + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Risco geral</th>\
                <td class="risk-score" style="background-color: ' + riskInfo.color + ' !important; color: white; font-weight: bold;">' + riskInfo.level + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Pontuação de Risco</th>\
                <td>' + enhancedRisk.toFixed(3) + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Desastre Tecnológico</th>\
                <td>' + (parseFloat(feature.properties['dam_risk_score']) || 0).toFixed(3) + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Incêndio Florestal</th>\
                <td>' + (parseFloat(feature.properties['fire_risk_score']) || 0).toFixed(3) + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Risco CEMADEN (Geo/Hidro)</th>\
                <td>' + (parseFloat(feature.properties['cemaden_risk_score']) || 0).toFixed(3) + '</td>\
            </tr>\
        </table>';
    var content = removeEmptyRowsFromPopupContent(popupContent, feature);
    layer.on('popupopen', function(e) {
        addClassToPopupIfMedia(content, e.popup);
    });
    layer.bindPopup(content, { maxHeight: 400 });
}

function style_comprehensive_heritage_risk_4_0(feature) {
    var nature = String(feature.properties['ds_natureza'] || '');
    var enhancedRisk = calculateEnhancedRisk(feature);
    var riskInfo = getEnhancedRiskLevel(enhancedRisk);

    var baseStyle = {
        pane: 'pane_comprehensive_heritage_risk_4',
        radius: 4.0,
        opacity: 1,
        color: 'rgba(255,255,255,0.9)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 0,
        fill: true,
        fillOpacity: 0.8,
        fillColor: riskInfo.color,
        interactive: true,
    };

    if (nature.includes('Imóvel') || nature.includes('Imovel') || nature.includes('Bem Imóvel')) {
        return baseStyle;
    } else if (nature.includes('Móvel') || nature.includes('Movel') || nature.includes('Bem Móvel')) {
        return Object.assign(baseStyle, { shape: 'diamond' });
    } else {
        return Object.assign(baseStyle, { shape: 'triangle' });
    }
}

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

// Zoom-based boundary visibility
// map.on('zoomend', function() {
//     var currentZoom = map.getZoom();
    
//     if (currentZoom < 7) {
//         if (map.hasLayer(allLayers.municipal_boundaries)) {
//             map.removeLayer(allLayers.municipal_boundaries);
//         }
//     } else {
//         if (!map.hasLayer(allLayers.municipal_boundaries) && filters.layers.municipal_boundaries) {
//             map.addLayer(allLayers.municipal_boundaries);
//         }
//     }
// });

// setTimeout(function() {
//     map.fire('zoomend');
// }, 1000);

/* ==========================================
   SEARCH FUNCTIONALITY
   ========================================== */

const url = {"Nominatim": "https://nominatim.openstreetmap.org/search?format=geojson&addressdetails=1&",
"BAN": "https://api-adresse.data.gouv.fr/search/?"}
var photonControl = L.control.photon({
    url: url["Nominatim"],
    feedbackLabel: '',
    position: 'topleft',
    includePosition: true,
    initial: true,
}).addTo(map);
photonControl._container.childNodes[0].style.borderRadius="10px"

var x = null;
var marker = null;
var z = null;
photonControl.on('selected', function(e) {
    console.log(photonControl.search.resultsContainer);
    if (x != null) {
        map.removeLayer(obj3.marker);
        map.removeLayer(x);
    }
    obj2.gcd = e.choice;
    x = L.geoJSON(obj2.gcd).addTo(map);
    var label = typeof obj2.gcd.properties.label === 'undefined' ? obj2.gcd.properties.display_name : obj2.gcd.properties.label;
    obj3.marker = L.marker(x.getLayers()[0].getLatLng()).bindPopup(label).addTo(map);
    map.setView(x.getLayers()[0].getLatLng(), 17);
    z = typeof e.choice.properties.label === 'undefined'? e.choice.properties.display_name : e.choice.properties.label;
    console.log(e);
    e.target.input.value = z;
});

var search = document.getElementsByClassName("leaflet-photon leaflet-control")[0];
search.classList.add("leaflet-control-search")
search.style.display = "flex";
search.style.backgroundColor="rgba(255,255,255,0.5)" 

var button = document.createElement("div");
button.id = "gcd-button-control";
button.className = "gcd-gl-btn fa fa-search search-button";

search.insertBefore(button, search.firstChild);
last = search.lastChild;
last.style.display = "none";
button.addEventListener("click", function (e) {
    if (last.style.display === "none") {
        last.style.display = "block";
    } else {
        last.style.display = "none";
    }
});

/* ==========================================
   LAYER CONTROL SETUP
   ========================================== */

var overlaysTree = [
    {label: 'Sítios de Bens Culturais<br /><table><tr><td style="text-align: center;"><div style="width:12px;height:12px;border-radius:50%;background:#f1c40f;display:inline-block;border:2px solid white;"></div></td><td>Bens Imóveis (Círculo)</td></tr><tr><td style="text-align: center;"><div style="width:12px;height:12px;background:#f1c40f;display:inline-block;border:2px solid white;transform:rotate(45deg);"></div></td><td>Bens Móveis (Losango)</td></tr></table>', layer: layer_comprehensive_heritage_risk_4},
    {label: 'Zonas de Risco de Barragens<br /><span style="color:#e77148;">Zonas de 5km ao Redor de Barragens</span>', layer: layer_snisb_dam_buffers_3},
    {label: 'Áreas de Risco Municipal<br /><table><tr><td style="background:#f1c40f;width:20px;height:15px;"></td><td>Risco Médio</td></tr><tr><td style="background:#e67e22;width:20px;height:15px;"></td><td>Risco Alto</td></tr><tr><td style="background:#e74c3c;width:20px;height:15px;"></td><td>Risco Muito Alto</td></tr></table>', layer: layer_municipalities_with_combined_risk_simplified_2},
    {label: 'Limites Municipais', layer: layer_municipalities_1_simplified_1},
    {label: "Mapa Base", layer: layer_OpenStreetMap_0},
]

var lay = L.control.layers.tree(null, overlaysTree,{
    collapsed: true,
});
lay.addTo(map);

/* ==========================================
   STATE NAVIGATION FUNCTIONALITY
   ========================================== */

var stateNames = {
    'AC': 'Acre',
    'AL': 'Alagoas', 
    'AP': 'Amapá',
    'AM': 'Amazonas',
    'BA': 'Bahia',
    'CE': 'Ceará',
    'DF': 'Distrito Federal',
    'ES': 'Espírito Santo',
    'GO': 'Goiás',
    'MA': 'Maranhão',
    'MT': 'Mato Grosso',
    'MS': 'Mato Grosso do Sul',
    'MG': 'Minas Gerais',
    'PA': 'Pará',
    'PB': 'Paraíba',
    'PR': 'Paraná',
    'PE': 'Pernambuco',
    'PI': 'Piauí',
    'RJ': 'Rio de Janeiro',
    'RN': 'Rio Grande do Norte',
    'RS': 'Rio Grande do Sul',
    'RO': 'Rondônia',
    'RR': 'Roraima',
    'SC': 'Santa Catarina',
    'SP': 'São Paulo',
    'SE': 'Sergipe',
    'TO': 'Tocantins'
};

var stateCenters = {
    'AC': [-9.0238, -70.8120],
    'AL': [-9.5713, -36.7820],
    'AP': [1.4148, -51.7799],
    'AM': [-4.9609, -61.9927],
    'BA': [-12.5797, -41.7007],
    'CE': [-5.4984, -39.3206],
    'DF': [-15.7998, -47.8645],
    'ES': [-19.1834, -40.3089],
    'GO': [-15.827, -49.8362],
    'MA': [-4.9609, -45.2744],
    'MT': [-12.6819, -56.9211],
    'MS': [-20.7722, -54.7852],
    'MG': [-18.5122, -44.5550],
    'PA': [-3.9097, -52.4829],
    'PB': [-7.2399, -36.7820],
    'PR': [-24.8932, -51.4248],
    'PE': [-8.8137, -36.9541],
    'PI': [-8.5811, -42.7297],
    'RJ': [-22.9099, -43.2095],
    'RN': [-5.4026, -36.9541],
    'RS': [-30.0346, -51.2177],
    'RO': [-10.9472, -63.0234],
    'RR': [2.7376, -62.0751],
    'SC': [-27.2423, -50.2189],
    'SP': [-23.5505, -46.6333],
    'SE': [-10.5741, -37.3857],
    'TO': [-10.184, -48.2982]
};

function navigateToState() {
    var dropdown = document.getElementById('stateDropdown');
    var selectedState = dropdown.value;

    if (!selectedState) {
        document.getElementById('stateInfo').style.display = 'none';
        return;
    }

    document.getElementById('stateInfo').style.display = 'block';
    document.getElementById('selectedStateName').textContent = stateNames[selectedState];

    var coordinates = stateCenters[selectedState];
    if (coordinates) {
        map.setView([coordinates[0], coordinates[1]], 7);
        updateStateStatistics(selectedState);
        console.log('Navegated to state:', stateNames[selectedState], '(' + selectedState + ')');
    }
}

function updateStateStatistics(stateCode) {
    var heritageCount = 0;
    var municipalityCount = 0;

    if (allLayers.heritage) {
        allLayers.heritage.eachLayer(function(layer) {
            var featureState = layer.feature.properties['uf'];
            if (featureState === stateCode) {
                heritageCount++;
            }
        });
    }

    if (allLayers.municipal_boundaries) {
        allLayers.municipal_boundaries.eachLayer(function(layer) {
            var featureState = layer.feature.properties['SIGLA_UF'];
            if (featureState === stateCode) {
                municipalityCount++;
            }
        });
    }
    document.getElementById('stateHeritageCount').textContent = heritageCount;
    document.getElementById('stateMunicipalityCount').textContent = municipalityCount;
}

function resetStateSelection() {
    document.getElementById('stateDropdown').value = '';
    document.getElementById('stateInfo').style.display = 'none';
    setBounds();
    console.log('Reset to full Brazil view');
}

/* ==========================================
   INITIALIZATION
   ========================================== */

setBounds();
updateTimestamp();
loadDocumentManifest(); // Load document manifest on startup
initializeProgressiveLoading();