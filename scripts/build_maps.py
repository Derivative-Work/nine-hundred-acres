"""M4: the map cards' outlines from Natural Earth (public domain), projected and simplified to SVG paths.

Lower-48 US states from ne_50m_admin_1_states_provinces_lakes (Natural Earth v5.1.2, assets/naturalearth/), in an
Albers equal-area conic (standard parallels 29.5 and 45.5 N, centered at 96 W, 37.5 N), the usual US map shape.
Writes remotion/src/data/maps.json: viewBox, one path per state, and the two pins (Salix, IA and Memphis, TN).
Usage: python3 -I scripts/build_maps.py
"""
import json
import math
from pathlib import Path

SRC = Path("assets/naturalearth/ne_50m_admin_1_states_provinces_lakes.geojson")
SKIP = {"Alaska", "Hawaii"}
PINS = {"Salix, IA": (42.3069, -96.2892), "Memphis, TN": (35.1495, -90.0490)}  # town centers (approximate)

p1, p2, p0, l0 = map(math.radians, (29.5, 45.5, 37.5, -96.0))
n = (math.sin(p1) + math.sin(p2)) / 2
C = math.cos(p1) ** 2 + 2 * n * math.sin(p1)
r0 = math.sqrt(C - 2 * n * math.sin(p0)) / n


def proj(lon, lat):
    p, l = math.radians(lat), math.radians(lon)
    r = math.sqrt(C - 2 * n * math.sin(p)) / n
    th = n * (l - l0)
    return r * math.sin(th) * 1000, -(r0 - r * math.cos(th)) * 1000


def ring_path(ring, tol=1.2):
    pts, last = [], None
    for lon, lat in ring:
        x, y = proj(lon, lat)
        if last is None or math.hypot(x - last[0], y - last[1]) > tol:
            pts.append((x, y))
            last = (x, y)
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z" if len(pts) > 2 else ""


def main():
    data = json.loads(SRC.read_text())
    states = {}
    for f in data["features"]:
        pr = f["properties"]
        if pr.get("iso_a2") != "US" or pr["name"] in SKIP:
            continue
        g = f["geometry"]
        polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        states[pr["name"]] = "".join(ring_path(poly[0]) for poly in polys)
    xs, ys = [], []
    for d in states.values():
        for seg in d.replace("M", "L").replace("Z", "").split("L"):
            if seg:
                x, y = map(float, seg.split())
                xs.append(x)
                ys.append(y)
    box = [min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)]
    pins = {k: [round(v, 1) for v in proj(lon, lat)] for k, (lat, lon) in PINS.items()}
    out = {"source": "Natural Earth 1:50m admin-1 states (lakes), v5.1.2, public domain", "viewBox": [round(v, 1) for v in box],
           "states": states, "pins": pins}
    Path("remotion/src/data").mkdir(parents=True, exist_ok=True)
    Path("remotion/src/data/maps.json").write_text(json.dumps(out) + "\n")
    print(len(states), "states; viewBox", out["viewBox"], "pins", pins, f"{len(json.dumps(out)) // 1024} KiB")


if __name__ == "__main__":
    main()
