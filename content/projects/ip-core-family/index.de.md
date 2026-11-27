---
title: "IP-Core-Familie"
layout: article
weight: 12
estado: "Die meisten Cores auf FPGA-Silizium validiert · Werden zum Exxo A1"
summary: "Hercoss' eigene Bibliothek von Hardwarebausteinen, geschrieben in VHDL-2008: ein 128-Bit-RISC-V-Prozessor, ein selbstheilendes Network-on-Chip, ein 1,6-Tbit/s-Ethernet-Core, ein selbstheilender DDR4-Controller, KI, HF, Raumfahrtbusse und Post-Quanten-Kryptografie. Die meisten sind bereits auf FPGA-Silizium validiert; zusammen werden sie zum HERCOSS Exxo A1."
datos:
  - "VHDL-2008"
  - "Simulation + echte Hardware"
  - "Vollständige AXI4-Schnittstellen"
  - "47 der 67 Controller des A1"
seotitle: "Raumfahrt-IP-Cores: SpaceWire, MIL-STD-1553, CAN, Ethernet, PQC — Hercoss"
---

## Die wichtigsten Cores, November 2026

{{< stats >}}
{{< stat "129 MB/s" "RV128IMAC: SHA-3 in Hardware aus Linux ohne Treiber, ~140× Software" >}}
{{< stat "≈0,6 µs" "NOC_512: heilt sich um einen ausgefallenen Switch herum, 405.522-mal in einer Stunde, 0 Wörter verloren" >}}
{{< stat "312 Mrd." "ETH_1T6: 1.6T-Ethernet-Frames in einer Stunde, null Fehler, Bursts korrigiert" >}}
{{< stat "1 Chip" "DDRC_72: Ein ganzer Speicherchip kann ausfallen, die Daten bleiben korrekt (Simulation)" >}}
{{< /stats >}}

| Core | Was er tut | Neuestes Ergebnis | Status | Seite |
|---|---|---|---|---|
| **RV128IMAC** | 128-Bit-RISC-V-Prozessor, die 16 Kerne des A1 | Linux 6.6 SMP; Aufrufe zwischen CPUs in 1,35 µs; SHA-3 mit 129 MB/s ohne Treiber; 214/214 Board-Tests | Auf FPGA validiert | [Ansehen](/de/projects/rv128imac/) |
| **Kern-Ring** | Kerne und Beschleuniger rufen sich direkt auf | Ring mit 17 Stationen unter Volllast auf Silizium: ~9 Mio. Nachrichten pro Lauf, 0 Fehler; Software legt die Priorität zur Laufzeit fest, kritische Aufgabe 36 % früher | Auf FPGA validiert (17 Stationen) | [Ansehen](/de/projects/rv128imac/#priority) |
| **NOC_512** | Selbstheilendes 512-Bit-Network-on-Chip | Heilt sich in ≈0,6 µs, 405.522 Ausfälle in einer Stunde, 0 von über 160 Mrd. Wörtern verloren; formal verifiziert | Auf FPGA validiert (2 × 2) | [Ansehen](/de/projects/noc-512/) |
| **ETH_1T6** | 1,6-Tbit/s-Ethernet: MAC, PCS, FEC, Lane-Ausrichtung | 312 Mrd. Frames in einer Stunde, 0 Fehler; 1 bis 15 Symbolfehler korrigiert; bitgenau zu den IEEE-Vektoren | Auf FPGA validiert (skaliert) | [Ansehen](/de/projects/eth-1t6/) |
| **DDRC_72** | Selbstheilender DDR4-Speichercontroller, bis 128 GiB | 0 Datenfehler und 0 JEDEC-Timing-Verletzungen, mit einem ausgefallenen Speicherchip und einer fehlerhaften Zeile | Simulation | [Ansehen](/de/projects/ddrc-72/) |
| **PCIE_G5** | PCI Express Gen4 / Gen5, 1–16 Lanes, COTS und Rad-hard; ausgelegt, häufige Störungen durch Teilchen an Ort und Stelle zu reparieren | Physical Layer auf Silizium mit 4 × 16 Gbit/s: eine Stunde, 389,8 Mrd. Wörter, 0 Fehler; Störungen im Empfänger in Mikrosekunden repariert, ohne den Datenmodus zu verlassen; Verbindung trainiert sich selbst und übersteht eine abgeschaltete Lane | Auf FPGA validiert (Physical Layer + erster Teil des Link-Trainings, 4 Lanes) | [Ansehen](/de/projects/pcie-g5/) |
| **NPU + AOCS-Beschleuniger** | KI an Bord und Lageregelung | 0,333 ms pro Bild; MPC 70 × 70 bitgenau von der Simulation bis zum Silizium | Auf FPGA validiert | [Ansehen](/de/projects/onboard-ai/) |
| **HF-Frontend + ADC-Kette** | Software-Defined Radio und hochauflösender ADC | DDC/DUC bitgenau in sechs Domänen; ~16,4–18,9 effektive Bits | Auf FPGA validiert | [Ansehen](/de/projects/rf/) |
| **SerDes, 25G/40G-Ethernet, PTP** | Hochgeschwindigkeitsverbindungen | 103-Gbit/s-Verbindung, 0 Fehler in 1 h; 40GbE gegen eine kommerzielle NIC | Auf FPGA validiert | [Ansehen](/de/projects/high-speed-links/) |
| **Eigene eFPGA-Fabric** | Die rekonfigurierbare Logik des A1 | Läuft in einem Versal; 130-nm-Layout besteht den Tape-out-Precheck von IHP | Auf FPGA validiert · GDS bereit | [Ansehen](/de/projects/efpga-fabric/) |

## Was ein IP-Core ist

Chips werden nicht jedes Mal von einem leeren Blatt aus entworfen. Sie werden
aus **IP-Cores** zusammengesetzt: in sich geschlossenen, wiederverwendbaren
Hardwarebausteinen mit je einer Aufgabe, etwa einem Ethernet-Port oder einem
Prozessor. Hercoss baut und pflegt seine eigene Familie, sodass der Exxo A1 aus
Bausteinen entsteht, die das Unternehmen vollständig versteht und kontrolliert.

## Der Katalog

Nach Kategorie filtern. Jeder Core zeigt seinen Status und seine Rolle im Exxo
A1. "Auf FPGA validiert" heißt, er hat auf echter Hardware bestanden; "In der
IP-Familie" heißt, er gehört zur Bibliothek und ist für den Chip geplant.

{{< cores >}}

## Vom IP-Core zum Chip

Im [HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/) werden diese Cores zu **47
der 67 festen Peripherie-Controller des Chips**: 10 SpaceWire, 5 MIL-STD-1553,
10 CAN, 5 UART, 5 I²C, 5 I³C, 5 SPI und 2 SD, alle aus bereits auf FPGA
validierter IP gebaut. Der [RV128IMAC](/de/projects/rv128imac/) wird zu den
sechzehn Prozessoren des Chips, verbunden durch ihren eigenen Ring; die SerDes-,
PCS-, MAC- und PTP-Cores und [ETH_1T6](/de/projects/eth-1t6/) bilden sein
Ethernet bis 1,6 Tbit/s; [NOC_512](/de/projects/noc-512/) ist das selbstheilende
Netz, das alle verbindet; [DDRC_72](/de/projects/ddrc-72/) ist sein selbstheilender DDR4-Speichercontroller, in der Simulation verifiziert und als Nächstes auf dem Weg zur FPGA-Synthese; und [PCIE_G5](/de/projects/pcie-g5/), das neueste Mitglied, begonnen am 27. November 2026, wird zu seinen drei PCIe-Gen5-x16-Ports.

Jeder Core wird jetzt auf Chiptauglichkeit geprüft, mit einer gemeinsamen
Registerkonvention und vollständigen AXI4-Schnittstellen sowie mit
Flugfunktionen wie dem Löschen von Post-Quanten-Schlüsseln.

## Wie ein Core validiert wird

1. **Simulation gegen Referenzmodelle.** Eine mehrstufige Regression lässt jeden
   Core neben in Python geschriebenen Software-Modellen laufen und vergleicht
   jedes Ergebnis automatisch. Prozessoren werden Befehl für Befehl geprüft.
2. **Synthese und Timing** auf dem Ziel-FPGA.
3. **Echte Hardware.** Der Core wird in ein AMD-Versal-FPGA eingebaut, und
   dieselben Prüfungen laufen auf dem Board, jede mit eigenem Bestanden oder
   Nicht bestanden. Wo es einen Standard gibt, wird der Core auch gegen
   kommerzielle Geräte getestet, etwa der 40G-Ethernet-MAC gegen eine
   kommerzielle Netzwerkkarte.

"Auf FPGA validiert" heißt auf dieser Website, dass der dritte Schritt bestanden
ist.

{{< detalle "Haben Hardwaretests Fehler gefunden, die die Simulation übersehen hat?" >}}
Ja, und genau darum geht es. Beispiele: ein Verhalten des Synthesewerkzeugs, das
auf dem FPGA stillschweigend eine Lookup-Tabelle veränderte, eine Lane, die nach
einem Transceiver-Reset gelegentlich nicht einrastete, und ein Reset während
eines Speichertransfers, der das Board aufhängen konnte. Für jeden davon gibt es
jetzt einen Test, der ihn erkennt.
{{< /detalle >}}

## Quellcode

Der Quellcode ist für Partner und Kunden auf Anfrage erhältlich:
[adrian@hercoss.com](mailto:adrian@hercoss.com).
