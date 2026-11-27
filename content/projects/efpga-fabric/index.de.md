---
title: "eFPGA-Fabric"
weight: 8
estado: "Läuft auf FPGA · GDS bereit"
summary: "Hercoss' eigene programmierbare Logik-Fabric: der rekonfigurierbare Teil des Exxo A1, läuft bereits und ist bis zum physischen Layout gebracht."
datos:
  - "Rekonfiguration zur Laufzeit"
  - "IHP SG13G2"
  - "IHP-Precheck: sauber"
  - "Open-Source-Flow"
seotitle: "Embedded-FPGA-Fabric (eFPGA) auf IHP SG13G2 130 nm — Hercoss"
---

## Was es ist

Ein FPGA besteht aus Tausenden kleiner, identischer Logikzellen, die durch
programmierbare Verdrahtung verbunden sind. Dieses Raster aus Zellen und
Leitungen ist die **Fabric**. Ein **eFPGA** ("Embedded FPGA") ist eine Fabric,
die dafür entworfen ist, in einem anderen Chip zu sitzen, statt als eigener Chip
verkauft zu werden.

Hercoss entwickelt seine eigene Fabric, statt eine zu lizenzieren. Das erlaubt
dem Exxo A1, rekonfigurierbare Logik zu enthalten, ohne von einem FPGA-Hersteller
abhängig zu sein.

## Was erreicht wurde

**Sie läuft.** Die erste Version der Fabric, `efpga_v0`, wurde in ein
kommerzielles AMD-Versal-FPGA geladen und mit 25 MHz betrieben. Sie bestand
einen Selbsttest der Laufzeit-Rekonfiguration über JTAG: Die Fabric wurde im
Betrieb umprogrammiert und verhielt sich jedes Mal korrekt.

**Sie hat ein physisches Layout.** Anschließend wurde dieselbe Fabric bis zum
GDS gebracht, dem Dateiformat, nach dem eine Foundry fertigt, im SG13G2-Prozess
von IHP, einer in Deutschland gefertigten 130-nm-Technologie. Das Ergebnis
besteht den offiziellen Precheck von IHP mit null Fehlern: LVS, Antenna und
Timing sind sauber, und das GDS ist bereit zur Einreichung.

{{< detalle "Warum ein FPGA in einem anderen FPGA emulieren?" >}}
Einen Chip zu fertigen dauert Monate und lässt sich nicht rückgängig machen.
Läuft die Fabric zuerst in einem kommerziellen FPGA, sind Logik,
Konfigurationskette und Software-Werkzeuge in Tagen auf echter Hardware
bewiesen, bevor Silizium bestellt wird.
{{< /detalle >}}

{{< detalle "Was bedeuten LVS, Antenna und Timing?" >}}
Das sind die Prüfungen, die ein Layout bestehen muss, bevor eine Foundry es
annimmt. **LVS** bestätigt, dass das gezeichnete Layout der beabsichtigten
Schaltung entspricht. **Antenna**-Regeln schützen Transistoren vor Schäden
während der Fertigung. **Timing** bestätigt, dass Signale bei der Zieltaktrate
rechtzeitig ankommen.
{{< /detalle >}}

{{< detalle "Welche Werkzeuge wurden verwendet?" >}}
Ein Open-Source-Flow: Das Framework FABulous erzeugt die Fabric, und LibreLane
bringt sie mit dem offenen Prozess-Design-Kit IHP SG13G2 ins Layout.
{{< /detalle >}}

## Wie es weitergeht

Ein Timing-Modell der Fabric als wiederverwendbares Makro, die Integration mit
dem Prozessor und Flächengewinn in der DSP-Spalte.
