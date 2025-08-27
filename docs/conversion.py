#!/usr/bin/env python3
"""
Convert ICM CSV data to JavaScript format
Usage: python csv_to_js_converter.py
"""

import csv
import unicodedata
import re


def normalize_text(text):
    """Normalize text - remove accents, special chars, convert to lowercase"""
    if not text:
        return ''

    # Convert to lowercase
    text = text.lower()

    # Remove accents
    text = unicodedata.normalize('NFD', text)
    text = ''.join(char for char in text if unicodedata.category(char) != 'Mn')

    # Keep only letters, numbers, underscore
    text = re.sub(r'[^a-z0-9_]', '', text)

    return text.strip()


def convert_csv_to_js(csv_filename='icm_combined.csv', js_filename='icm_data.js'):
    """Convert CSV file to JavaScript data object"""

    print(f"🔄 Converting {csv_filename} to {js_filename}...")

    icm_data = {}
    processed_count = 0
    skipped_count = 0

    try:
        with open(csv_filename, 'r', encoding='utf-8') as csvfile:
            # Try to detect if first row is header
            first_line = csvfile.readline().strip()
            csvfile.seek(0)

            reader = csv.reader(csvfile)

            # Skip header if detected
            first_row = next(reader)
            if first_row and (first_row[0].upper() == 'UF' or 'UF' in first_row[0]):
                print("📋 Header row detected, skipping...")
            else:
                # Process first row as data
                csvfile.seek(0)
                reader = csv.reader(csvfile)

            for row_num, row in enumerate(reader, 1):
                if len(row) < 3:
                    skipped_count += 1
                    continue

                uf = str(row[0]).strip()
                municipality = str(row[1]).strip()
                icm_class = str(row[2]).strip()

                # Skip empty rows
                if not uf or not municipality or not icm_class:
                    skipped_count += 1
                    continue

                # Skip header row variants
                if uf.upper() == 'UF' or municipality.upper() == 'MUNICIPALITY':
                    skipped_count += 1
                    continue

                # Normalize names
                normalized_municipality = normalize_text(municipality)
                normalized_uf = normalize_text(uf)

                # Create key
                key = f"{normalized_municipality}_{normalized_uf}"

                # Store data
                icm_data[key] = icm_class
                processed_count += 1

                # Debug first 5 entries
                if processed_count <= 5:
                    print(f"✅ Processed: {key} = {icm_class}")

    except FileNotFoundError:
        print(f"❌ Error: {csv_filename} not found!")
        print("Make sure the CSV file is in the same directory as this script.")
        return
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return

    # Write JavaScript file
    try:
        with open(js_filename, 'w', encoding='utf-8') as jsfile:
            jsfile.write('// ICM Classification Data - Brazilian Municipalities\n')
            jsfile.write('// Auto-generated from CSV data\n')
            jsfile.write('// Format: normalized_municipality_uf -> ICM_Classification\n\n')
            jsfile.write('window.icmData = {\n')

            # Sort keys for better organization
            sorted_keys = sorted(icm_data.keys())

            for i, key in enumerate(sorted_keys):
                value = icm_data[key]
                comma = ',' if i < len(sorted_keys) - 1 else ''
                jsfile.write(f'    "{key}": "{value}"{comma}\n')

            jsfile.write('};\n\n')

            # Add debug function
            jsfile.write('// Debug function to verify ICM data\n')
            jsfile.write('function debugICMData() {\n')
            jsfile.write(
                f'    console.log("ICM Data loaded:", Object.keys(window.icmData).length, "municipalities");\n')
            jsfile.write('    console.log("Sample ICM entries:", Object.keys(window.icmData).slice(0, 5));\n')
            jsfile.write('    console.log("ICM data ready for use!");\n')
            jsfile.write('}\n\n')
            jsfile.write('// Auto-run debug on load\n')
            jsfile.write('debugICMData();\n')

    except Exception as e:
        print(f"❌ Error writing JavaScript file: {e}")
        return

    # Summary
    print(f"\n🎉 Conversion Complete!")
    print(f"✅ Processed: {processed_count} municipalities")
    print(f"⚠️  Skipped: {skipped_count} rows")
    print(f"📄 Output file: {js_filename}")
    print(f"📊 File size: ~{len(icm_data) * 50} bytes")

    # Show sample data
    print(f"\n📋 Sample entries:")
    sample_keys = list(icm_data.keys())[:3]
    for key in sample_keys:
        print(f"   {key} -> {icm_data[key]}")


if __name__ == "__main__":
    # Run the conversion
    convert_csv_to_js()

    print(f"\n📖 Next steps:")
    print(f"1. Include in your HTML: <script src='icm_data.js'></script>")
    print(f"2. Remove Papa.parse code from main.js")
    print(f"3. ICM data will be available as window.icmData")
    print(f"4. Test: window.icmData['itabirito_mg'] should return 'A'")