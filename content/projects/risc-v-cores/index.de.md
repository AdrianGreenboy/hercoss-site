---
title: "RISC-V-Prozessorkerne"
weight: 9
estado: "Auf FPGA validiert · In Entwicklung"
summary: "Von Grund auf in VHDL geschriebene Prozessorkerne: ein 64-Bit-Kern und der 128-Bit-RV128IMAC, der Prozessor des Exxo A1, der bereits Linux auf echter Hardware ausführt, mit Aufrufen zwischen Kernen in 1,35 µs und SHA-3 in Hardware mit 129 MB/s, ~140× Software."
datos:
  - "RV64IMAC"
  - "RV128IMAC (Dual-Modus)"
  - "Linux auf FPGA"
  - "VHDL-2008"
seotitle: "RISC-V-Prozessorkerne in VHDL für die Raumfahrt — Hercoss"
---

## Was sie sind

Ein Prozessorkern ist der Teil eines Chips, der die Befehle der Software
ausführt. Hercoss schreibt seine eigenen nach dem offenen **RISC-V**-Standard,
damit sie sich ohne Lizenz eines Prozessorherstellers anpassen, härten und
integrieren lassen.

{{< detalle "Was bedeutet RV64IMAC?" >}}
So benennt RISC-V, was ein Prozessor kann:

- **RV64**: 64-Bit-Register und -Adressen.
- **I**: der Basis-Befehlssatz für Ganzzahlen.
- **M**: Multiplikation und Division in Hardware.
- **A**: atomare Operationen, nötig für Mehrkern-Software.
- **C**: komprimierte 16-Bit-Befehle, die Programme kleiner machen.

Diese Kombination reicht aus, um Linux und Echtzeitbetriebssysteme auszuführen.
{{< /detalle >}}

## RV64IMAC

Der 64-Bit-Kern, in Entwicklung und für die Serie gedacht. Er ist die Basis der
Familie: Er kommuniziert direkt mit den übrigen IP-Cores von Hercoss.

## RV128IMAC

{{< stats >}}
{{< stat "129 MB/s" "SHA-3 in Hardware aus einem Linux-Prozess, ohne Treiber" >}}
{{< stat "1,35 µs" "ein Linux-Programm ruft eine Funktion auf einer anderen CPU auf" >}}
{{< stat "64" "adressierbare Hardware-Threads auf dem Kern-Ring" >}}
{{< stat "214 / 214" "selbstprüfende Programme bestehen auf dem Board" >}}
{{< /stats >}}

Der 128-Bit-Kern und der für den Exxo A1 gewählte Prozessor. Er läuft als
128-Bit-CPU, als standardkonforme 64-Bit-CPU oder als zwei 64-Bit-CPUs, bootet
Linux auf einem FPGA-Prototyp, lässt eine CPU in 1,35 µs Funktionen auf einer
anderen aufrufen und gibt Linux-Programmen SHA-3 in Hardware mit 129 MB/s,
~140× Software, ohne Treiber. Seine Kerne und Beschleuniger teilen sich ihren
eigenen Ring, inzwischen auf 64 Hardware-Threads skaliert und in der Simulation
mit 16 Stationen unter Volllast verifiziert, fair zu jeder Station. Er hat eine
eigene Seite: [RV128IMAC, der Kern des Exxo A1](/de/projects/rv128imac/).

{{< detalle "Warum 128 Bit?" >}}
Nicht wegen der Speichergröße: Keine Anwendung braucht einen 128-Bit-Adressraum.
Der Gewinn liegt in der Arithmetik. Kryptografie und exakte Rechnungen mit großen
Zahlen verarbeiten doppelt so viele Bits pro Schritt, und auf dem Prototyp
machte das eine große Berechnung 1,63× schneller als denselben Algorithmus mit
64-Bit-Wörtern.
{{< /detalle >}}

{{< detalle "Wie werden die Kerne verifiziert?" >}}
In zwei Schritten. Zuerst in der Simulation, wo jedes Programm sowohl auf dem
VHDL-Design als auch auf einem Software-Modell des Befehlssatzes läuft und die
Ergebnisse verglichen werden. Dann auf echter Hardware, mit denselben Programmen
auf einem FPGA. Ein Kern gilt erst nach dem zweiten Schritt als validiert.
{{< /detalle >}}
