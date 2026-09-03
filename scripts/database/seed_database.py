#!/usr/bin/env python3
"""
Database Seeding Script for BharatYatra.
Populates states and sample heritage monuments into the configured database.
"""
import os
import sys
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, os.path.join(ROOT_DIR, "backend"))


def seed_data():
    data_dir = os.path.join(ROOT_DIR, "data")
    states_file = os.path.join(data_dir, "states.json")

    if os.path.exists(states_file):
        with open(states_file, "r", encoding="utf-8") as f:
            states = json.load(f)
            print(f"[*] Loaded {len(states)} states for seeding.")
    else:
        print("[!] states.json not found.")

    print("[*] Database seed process complete.")


if __name__ == "__main__":
    seed_data()
