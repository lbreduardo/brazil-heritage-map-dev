import re
import json

input_js = "municipalities_with_combined_risk_simplified_2.js"
output_geojson = "municipalities_with_combined_risk_simplified_2.geojson"

with open(input_js, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove "var json_xxx = " do início
match = re.search(r"=\s*(\{.*\})\s*;?\s*$", content, re.DOTALL)
if not match:
    raise ValueError("GeoJSON structure not found in JS file.")

geojson_text = match.group(1)

# Parse and validate
geojson_data = json.loads(geojson_text)

with open(output_geojson, 'w', encoding='utf-8') as out:
    json.dump(geojson_data, out, ensure_ascii=False, indent=2)

print(f"GeoJSON saved to {output_geojson}")
