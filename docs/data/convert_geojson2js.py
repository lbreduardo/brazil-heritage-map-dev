import json

# Nome do arquivo de entrada (GeoJSON) e saída (JavaScript)
input_geojson = "municipalities_with_heritage_heat.geojson"
output_js = "municipalities_with_heritage_heat.js"

# Nome da variável JavaScript que será usada no mapa
js_variable_name = "json_municipalities_with_heritage_heat"

# Lê o arquivo GeoJSON
with open(input_geojson, "r", encoding="utf-8") as f:
    geojson_data = json.load(f)

# Escreve o arquivo JS com a variável
with open(output_js, "w", encoding="utf-8") as f:
    f.write(f"var {js_variable_name} = ")
    json.dump(geojson_data, f, ensure_ascii=False)
    f.write(";")

print(f"Arquivo '{output_js}' criado com sucesso!")
