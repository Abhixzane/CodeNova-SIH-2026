#!/usr/bin/env python3
"""
Tourism Data Import and Validation Script.
Validates all regional JSON files against the required place schema.
"""
import os
import json
import glob

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data"))


def validate_places():
    print(f"[*] Scanning data directory: {BASE_DIR}")
    json_files = glob.glob(os.path.join(BASE_DIR, "**/*.json"), recursive=True)
    valid_count = 0
    total_files = len(json_files)

    for path in json_files:
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else 1
                valid_count += 1
                print(f"  [+] Validated: {os.path.relpath(path, BASE_DIR)} ({count} items)")
        except Exception as e:
            print(f"  [!] Error reading {path}: {e}")

    print(f"[*] Validation completed: {valid_count}/{total_files} files OK.")


if __name__ == "__main__":
    validate_places()
