---
title: "HERCOSS Exxo A1"
layout: a1
weight: 1
estado: "Investitionsmöglichkeit · In Entwicklung"
summary: "Ein FPGA-SoC auf einem einzigen Chip für Raumfahrt und Edge: sechzehn 128-Bit-RISC-V-Kerne, eine FPGA-Fabric mit 500.000 LUTs, ein KI-Array, bis zu ~2 Tbit/s Ethernet und jeder Raumfahrtbus, den ein Raumfahrzeug braucht. Eine Maske, zwei Produkte: kommerziell und strahlungsgehärtet. In Europa entwickelt."
datos:
  - "16 × RV128IMAC"
  - "FPGA mit 500K LUTs"
  - "1.6TbE · ~2 Tbit/s Ethernet"
  - "67 Peripherie-Controller"
  - "Ziel 300 krad"
seotitle: "HERCOSS Exxo A1: strahlungsgehärteter RISC-V-FPGA-SoC für die Raumfahrt"
product: "FPGA-SoC für die Raumfahrt"
---

{{< aviso "Patentverfahren läuft" >}}
Mehrere Innovationen des Exxo A1 befinden sich im Patentverfahren, darunter der
selbstheilende Lockstep, der Ring, über den sich Kerne und Beschleuniger direkt
aufrufen, das selbstheilende Network-on-Chip, der Fehlerkorrektur-Empfänger des
1.6T-Ethernet-Cores und der selbstheilende Speichercontroller. Diese Seite zeigt,
was sie erreichen; wie sie funktionieren, wird veröffentlicht, sobald das
Verfahren es erlaubt.
{{< /aviso >}}

### Bewiesen im November 2026

{{< stats >}}
{{< stat "129 MB/s" "SHA-3 in Hardware aus Linux, ohne Treiber, auf unserem eigenen 128-Bit-RISC-V-Kern" >}}
{{< stat "≈0,6 µs" "bis sich das Network-on-Chip um einen ausgefallenen Switch herum repariert, 405.522-mal in einer Stunde" >}}
{{< stat "312 Mrd." "Ethernet-Frames in einer Stunde durch unseren eigenen 1.6T-Link-Layer, null Fehler" >}}
{{< stat "1 Chip" "Speicher kann ausfallen, und die Daten kommen trotzdem korrekt zurück (DDRC_72, Simulation)" >}}
{{< /stats >}}

Jedes Ergebnis hat seine eigene Seite: [RV128IMAC](/de/projects/rv128imac/) ·
[NOC_512](/de/projects/noc-512/) · [1.6T-Ethernet](/de/projects/eth-1t6/) ·
[DDRC_72](/de/projects/ddrc-72/) · [Onboard-KI](/de/projects/onboard-ai/) ·
[HF](/de/projects/rf/) · [IP-Cores](/de/projects/ip-core-family/)

## Die Investitionsmöglichkeit {#invest}

Raumfahrzeuge und abgelegene Edge-Systeme kombinieren mehrere Chips für eine
Aufgabe: einen strahlungstoleranten Prozessor, ein separates FPGA für eigene
Logik, einen KI-Beschleuniger und eine Sammlung von Schnittstellenchips. Jeder
zusätzliche Chip bringt Masse, Leistungsaufnahme, Platinenfläche,
Qualifikationskosten und Fehlerquellen mit.

**Der HERCOSS Exxo A1 bringt diesen ganzen Rechner auf einen Chip.**

{{< fig "a1-replaces.svg" "Was ein Exxo A1 auf der Rechnerplatine eines Raumfahrzeugs ersetzt." >}}

### Warum investieren

- **Er löst ein echtes Problem mit einem Bauteil.** Jeder entfallene Chip spart
  Masse, Leistung, Platinenfläche und Qualifikationskosten, die vier Dinge, für
  die jede Mission am meisten bezahlt.
- **Er bietet etwas, das niemand sonst anbietet.** Der selbstheilende Lockstep
  korrigiert Strahlungsfehler ohne Reset und ohne Recovery-Software, und
  128-Bit-Kerne rufen sich in etwa einer Mikrosekunde direkt gegenseitig auf.
  Beides läuft bereits auf echter Hardware.
- **Er ist real, keine Folie.** Der Prozessor führt Linux auf FPGA-Hardware aus,
  die Fehlertoleranz ist gemessen, die FPGA-Fabric läuft auf einem FPGA, ihr
  erster Testchip hat die Tape-out-Prüfungen der Foundry bestanden, und die IP
  für die Raumfahrtschnittstellen ist bewiesen. Ein Investor finanziert den
  nächsten Schritt eines funktionierenden Designs, nicht den ersten Schritt
  einer Idee.
- **Er baut auf offenen, souveränen Grundlagen auf.** RISC-V trägt keine
  ausländische Lizenz, die entzogen werden kann. Design, IP und Know-how bleiben
  in Europa.
- **Eine Investition, zwei Märkte.** Eine Maske ergibt ein kommerzielles Bauteil
  für Edge-Computing, Industrie und NewSpace-Konstellationen und ein
  strahlungsgehärtetes Bauteil für institutionelle und Deep-Space-Missionen. Das
  kommerzielle Volumen hilft, die Raumfahrtqualifikation zu bezahlen.
- **Das Risiko ist gestaffelt.** Jede Phase endet an einem Go/No-go-Gate mit
  messbaren Ergebnissen, sodass Kapital Schritt für Schritt gegen Belege
  eingesetzt wird. Öffentliche Programme wie der EU Chips Act und
  ESA-Instrumente gibt es genau dafür, diese Art Risiko zu teilen.

### Ein Wort vom Gründer

> Europas Raumfahrtprogramme hängen von Prozessoren, FPGAs und
> strahlungsgehärteten Bauteilen ab, die außerhalb Europas entwickelt und
> kontrolliert werden. Exportbeschränkungen, Lieferengpässe und wechselnde
> Handelspolitik haben gezeigt, wie zerbrechlich diese Abhängigkeit ist: Eine
> einzige Lizenzentscheidung im Ausland kann eine europäische Mission
> verzögern oder blockieren. Technologische Souveränität im All beginnt mit den
> Chips an Bord.
>
> Europa hat bereits jedes Teil, das man braucht, um einen zu bauen: die
> fortschrittlichste Lithografie der Welt, Halbleiterforschung von Weltrang,
> Chipfertigung in Dresden und Crolles, eine lange Tradition in der
> Raumfahrtelektronik und Strahlungstestanlagen auf dem ganzen Kontinent. Der
> HERCOSS Exxo A1 bringt diese Stärken zusammen. Meine langfristige Vision ist
> es, HERCOSS-Exxo-Chips in Bremen zu fertigen, im Herzen der europäischen
> Raumfahrtindustrie, auf einer Linie rund um die fortschrittlichste Lithografie
> von ASML. Der Weg ist gestaffelt: zuerst Testchips bei europäischen Foundries
> und Forschungszentren, dann baut jede erfolgreiche Phase die Grundlage, das
> Team und die Partnerschaften für einen Standort in Bremen auf.
>
> — **Adrian Irineo Hernandez Cossio**, Gründer von Hercoss

## Den Chip erkunden {#explore}

Klicken Sie auf einen Block, um zu sehen, was er tut und warum er da ist.

{{< a1explorer >}}

## Architektur

Alles hängt an einem einzigen 512-Bit-Network-on-Chip, Hercoss' eigenem
[NOC_512](/de/projects/noc-512/): die sechzehn Prozessoren, die FPGA-Fabric, das
KI-Array, der Speicher und alle I/O. Auf FPGA-Silizium hat es in neun
einstündigen Läufen 3,19 Billionen AXI4-Transfers ohne einen einzigen Fehler
getragen, und es repariert sich in etwa 0,6 µs um einen ausgefallenen Switch
herum, auf Silizium gemessen über 405.522 Ausfälle in einer Stunde, ohne ein Wort
zu verlieren.

{{< fig "a1-architecture.svg" "Gesamtarchitektur des HERCOSS Exxo A1. Konzeptionell; nicht maßstäblich." >}}

{{< detalle "Was ist ein FPGA-SoC?" >}}
Ein Prozessor führt Software aus: das Betriebssystem, die Missionslogik, die
Kommunikation. Ein FPGA ist Hardware, die sich nach der Fertigung neu verdrahten
lässt, und wird für Aufgaben genutzt, für die Software zu langsam ist, etwa um
Instrumentendaten in Echtzeit zu verarbeiten. Ein FPGA-SoC bringt beides auf ein
Stück Silizium und lässt Software und eigene Hardware Daten mit voller
Geschwindigkeit austauschen, statt über langsame Verdrahtung auf der Platine.
{{< /detalle >}}

## Von der RTL zum physischen Layout

Der Exxo A1 ist nicht mehr nur ein Blockdiagramm. Sein Design hat den Chip-Flow
begonnen: Dasselbe VHDL, das auf unseren FPGA-Boards läuft, wurde auf
Standardzellen synthetisiert, platziert und geroutet, woraus das unten gezeigte
physische Layout entsteht. Klicken Sie auf eines der Bilder, um es in voller
Auflösung zu öffnen.

{{< layoutshots "Physisches Layout eines Kernblocks des Exxo A1. Die gelben Blöcke an beiden Seiten sind On-Chip-Speicher; in der Mitte liegt platzierte und geroutete Logik." "Nahaufnahme desselben Layouts: einzelne Standardzellen und die Metallverdrahtung zwischen ihnen." >}}

*Layout-Darstellungen aus dem Chip-Design-Flow. Der Chip wurde noch nicht
gefertigt; Fläche, Takt und Leistung auf Silizium müssen noch gemessen werden.*

## Was auf dem Chip ist

Der A1 trägt die Schnittstellen, die ein Raumfahrzeug oder ein Edge-System
braucht, und ersetzt damit Schnittstellenchips, statt zusätzliche zu benötigen.
Langsame Peripherie teilt sich einen gemultiplexten Pool aus 160 Pins, sodass
jede Mission ihre Kombination ohne größeres Gehäuse wählt.

{{< a1io >}}

## Bis zu ~2 Tbit/s Ethernet

Ein Pool aus 72 seriellen Transceivern versorgt Ethernet, PCIe und die
FPGA-Fabric. Acht PAM4-Lanes mit 224 Gbit/s tragen einen 1,6-Tbit/s-Ethernet-
Port; 64 Lanes mit 32 Gbit/s tragen weitere 400G Ethernet und drei
PCIe-Gen5-x16-Verbindungen.

{{< fig "a1-serdes.svg" "Wie die 72 Transceiver-Lanes geteilt werden. Designziel." >}}

## Selbstheilender Lockstep

Zwei beliebige benachbarte Kerne lassen sich beim Booten zu einem fehlertoleranten
Kern verbinden, und die transienten Fehler, die er erkennt, werden **automatisch
korrigiert**: kein Prozessor-Reset, kein Checkpoint, keine Recovery-Software.
Herkömmliche Lockstep-Prozessoren erkennen den Fehler nur und führen dann einen
Reset durch oder übergeben das Problem an die Software.

- **Auf FPGA gemessen:** 24 injizierte Fehler pro Lauf, die Hälfte davon im
  Kern, der den Bus treibt. 24 korrigiert, 0 verfälschte Ergebnisse, nichts
  Falsches erreichte den Bus. Dasselbe Programm ohne Lockstep lieferte in 12 von
  24 Runden verfälschte Ergebnisse.
- **Keine messbaren Kosten:** 24 Wiederherstellungen, 8,15 ms gegenüber 8,18 ms.
- **Flexibel je Missionsphase:** 16 unabhängige Kerne während eines ruhigen
  Fluges, 8 selbstheilende Kerne während eines Sonnenereignisses oder eines
  kritischen Manövers.
- **Eingebaute Fehlerinjektion** lässt Kunden und Testlabore den Mechanismus im
  Feld erproben, was die Qualifikation unterstützt.

{{< detalle "Auf welchem Kern wurde das gemessen?" >}}
In der A1-SoC-Emulation mit ihren früheren 64-Bit-Kernen. Den Lockstep, den
fehlerkorrigierenden Registersatz und die Cache-Parität auf den RV128IMAC zu
übertragen, ist einer der unten aufgeführten offenen Punkte.
{{< /detalle >}}

## Software-Modell

Ein Exxo A1 kann bis zu sechzehn separate Flugrechner ersetzen.

- **Standardmäßig 16 isolierte Domänen:** ein Kern pro Linux-Instanz, jede mit
  eigenem Speicher, eigenen Interrupts, eigenem Timer und eigener Peripherie, in
  Hardware durchgesetzt.
- **AMP und SMP frei kombinierbar:** zum Beispiel ein 4-Kern-SMP-Linux für die
  Nutzlastverarbeitung neben 12 Einkern-Domänen für Plattformfunktionen.
- **Domänensteuerung:** Eine Manager-Domäne kann jede andere Domäne anhalten,
  neu laden und neu starten, während der Rest weiterläuft, die Grundlage für
  Fehler-Recovery und Software-Updates im Orbit.
- **Schnelle Kommunikation zwischen Kernen:** der Hercoss-
  [Kern-Ring](/de/projects/rv128imac/#the-hercoss-core-fabric-a-ring-built-for-calls),
  über den sich Kerne und Beschleuniger direkt aufrufen: 1,35 µs aus einem
  Linux-Programm, fair unter Volllast, mit Dienstpriorität pro Station, die Software zur Laufzeit festlegt, neben dem standardmäßigen Linux-remoteproc
  / RPMsg.
- **Offene Toolchain:** Standard-RISC-V-GCC, Mainline-Linux und OpenSBI im
  64-Bit-Modus; Echtzeitsysteme FreeRTOS, Zephyr und RTEMS.
- **Geplante Werkzeuge:** eine GUI und ein TCL/Bash-Flow, um den Chip zu
  partitionieren, Device Trees zu erzeugen und FPGA-Bitstreams zu bauen.

## Ein Design, zwei Versionen

Beide Versionen stammen aus derselben Maske, sodass sich das strahlungsgehärtete
Bauteil die Entwicklungskosten mit dem kommerziellen Volumenbauteil teilt.

{{< a1variants >}}

**Als Nächstes: der HERCOSS Exxo A1-RF.** Eine Funkvariante des A1 mit einem
Funk-Frontend auf demselben Chip, aufgebaut auf der digitalen HF-Frontend-IP von
Hercoss, die bereits auf FPGA-Silizium läuft. Sie ist in Entwicklung.
[Mehr über HF und den A1-RF →](/de/projects/rf/)

## Vollständige Spezifikation {#specs}

Jede Zeile trägt ihren Status. Filtern Sie, um zu sehen, was bereits validiert
ist, was im Design ist und was noch aussteht.

{{< a1specs >}}

## Bisherige Belege

| Was | Beleg | Status |
|---|---|---|
| Prozessorkern RV128IMAC | Linux 6.6 SMP, 214 / 214 Board-Tests, CoreMark 1,85 / MHz; SHA-3 als Datenstrom von 33 auf 129 MB/s in fünf Tagen | Auf FPGA validiert |
| Aufrufe zwischen Kernen | 1,35 µs hin und zurück aus einem Linux-Programm (ein leerer Systemaufruf: 6,6 µs) | Auf FPGA validiert |
| Kern-Ring für 16 Kerne | Ring mit 17 Stationen unter Volllast auf Silizium (ein echter Kern, der SHA-3-Beschleuniger, 15 Verkehrsstationen): ~9 Mio. Nachrichten pro Lauf, 0 Fehler, 0 verloren, 0 doppelt; Dienstpriorität per Software zur Laufzeit, kritische Aufgabe 36 % früher auf gesättigtem Ring; Ring adressiert 64 Hardware-Threads | Auf FPGA validiert (17 Stationen); 16 echte Kerne ausstehend |
| Selbstheilender Lockstep | 24 / 24 injizierte Fehler korrigiert, 0 verfälschte Ergebnisse | Auf FPGA validiert (früherer 64-Bit-Kern) |
| Network-on-Chip NOC_512 | Neun einstündige Läufe unter Volllast: 3,19 Billionen AXI4-Transfers, 0 Fehler; 375 MHz ungeschützt, 265 MHz mit allen Schutzschichten | Auf FPGA validiert |
| Fehlertoleranz von NOC_512 | 10,5 Mio. Fehler live korrigiert; Zustand 159 Mio. Takte lang in jedem Takt verfälscht, mit einem Ergebnis identisch zu einem fehlerfreien Lauf; 199 Mio. Wörter/s rekonstruiert, keines verloren; 14 Selbstreparaturen in ~10 µs, 0 Wörter verloren | Auf FPGA validiert (Fehlerinjektion, kein Strahltest) |
| NOC_512, 5 × 5-Chipplan | 7,73 Tbit/s auf 19 geschützten Verbindungen; 6 Einzelknotenausfälle unter Volllast mit 0 verlorenen Wörtern | Simulation |
| Selbstheilung von NOC_512 | Auf Silizium: ein Switch 405.522-mal in einer Stunde unter Volllast abgeschaltet, jede Reparatur in 148–156 Takten (≈0,6 µs), 0 von über 160 Mrd. Wörtern verloren; Gesamtchip in der Simulation: 65 von 66 Lanes wiederhergestellt; Selbstheilungslogik formal verifiziert (9 / 9 Sicherheitsregeln) | Auf FPGA validiert (2 × 2); formal verifiziert; Chipmaßstab in der Simulation |
| Speichercontroller DDRC_72 | Gesamtsystem-Lauf mit injizierten Bitkippern, einem toten Speicherchip und einer ausfallenden Zeile: 2.727 Schreib- und 4.120 Lesezugriffe verifiziert, 0 Datenfehler, 0 JEDEC-Timing-Verletzungen | Simulation |
| A1-SoC-Infrastruktur | Cluster, Crossbar, Kohärenz, Mailbox, Interrupt-Controller, IOPMP; zwei isolierte Linux-Domänen | Auf FPGA validiert |
| Cache- und Prefetch-Tuning | 64-KiB-I-Cache: −69 % Fehlzugriffe unter Linux; Prefetcher: kaltes Kopieren −32 %, kaltes Lesen −39 % | Auf FPGA gemessen (früherer 64-Bit-Kern) |
| Eigene eFPGA-Fabric | Läuft in einem AMD Versal; Selbsttest der Laufzeit-Rekonfiguration bestanden | Auf FPGA validiert |
| Fabric-Testchip, IHP SG13G2 130 nm | Offizieller Precheck bestanden: LVS, Antenna und Timing sauber | GDS bereit für Tape-out |
| Fläche der Fabric-Kachel | 56.222 µm² pro Kachel mit 8 LUT4, 616 Konfigurationsbits | Aus dem Layout gemessen |
| DICE-Konfigurationszelle | 31,2 µm², DRC und LVS sauber; hält einem 1-pC-Treffer stand (eine Standardzelle kippt bei 8,3 fC) | Layout freigegeben; SEU in der Simulation |
| Raumfahrt-IP | SpaceWire, MIL-STD-1553, CAN, UART, PTP 802.1AS | Auf FPGA validiert |
| Allgemeine Peripherie-IP | I²C, I³C, SPI, SD | Auf FPGA validiert |
| Netzwerk-IP | 25G- und 40G-Ethernet-MAC/PCS gegen eine kommerzielle NIC, einstündiger Dauertest mit null Fehlern; 103-Gbit/s-SerDes-Verbindung | Auf FPGA validiert |
| NPU | INT8-CNN-Inferenz: 0,333 ms pro Bild, ~3.000 Inferenzen/s | Auf FPGA validiert |
| AOCS-Beschleuniger | Modellprädiktive Lageregelung in Hardware, 70 × 70 float32, bitgenau zur Simulation | Auf FPGA validiert |
| Digitales HF-Frontend | DDC- und DUC-Ketten, bitgenau in sechs Domänen | Auf FPGA validiert |
| Post-Quanten-Krypto | Beschleuniger für ML-KEM und ML-DSA | Auf FPGA validiert |
| SHA-3 / SHAKE in Hardware | 129 MB/s aus einem Linux-Prozess ohne Treiber, ~140× Software auf derselben CPU | Auf FPGA validiert |
| 1.6TbE-Link-Layer (ETH_1T6) | MAC + PCS + RS(544,514)-FEC + Lane-Ausrichtung: 312 Milliarden Frames in einer Stunde, 0 Fehler; 1 bis 15 Symbolfehler pro Codewort korrigiert; Fehlerbursts bei voller Geschwindigkeit repariert; bitgenau zu den Vektoren von IEEE 802.3 200G/400G/800G und P802.3dj | Auf FPGA validiert (skaliert: ein FEC-Strom, 8 Lanes) |

## Was noch aussteht

Eine ehrliche Liste dessen, was geschehen muss, bevor der A1 ein Chip ist:

- **Den Prozessorcluster skalieren**, vom Prototyp mit zwei CPUs auf sechzehn
  Kerne. Der Kern-Ring adressiert 64 Hardware-Threads, und ein Ring mit 17 Stationen läuft bereits unter Volllast auf Silizium, mit einem echten Kern; sechzehn echte Kerne brauchen einen größeren Baustein.
- **Raumfahrthärtung des RV128IMAC:** den selbstheilenden Lockstep, den
  fehlerkorrigierenden Registersatz und die Cache-Parität portieren; die Caches
  auf die A1-Größen bringen.
- **Network-on-Chip:** das Netz mit 25 Knoten und die gehärtete
  Selbstheilungslogik auf einem größeren FPGA (beide bestehen in der
  Simulation), formale Verifikation des gesamten Netzes (begonnen), schnellere
  Erholung bei zwei gleichzeitig ausgefallenen Switches und Integration mit den
  RV128IMAC-Kernen und echter Peripherie.
- **L2-Caches:** RTL muss noch geschrieben werden.
- **DDR4-Speichercontroller ([DDRC_72](/de/projects/ddrc-72/)):** RTL v0.1
  fertig; in der Simulation verifiziert mit 0 Datenfehlern und 0
  JEDEC-Timing-Verletzungen, einschließlich eines toten Speicherchips und einer
  ausfallenden Zeile, die automatisch repariert wird. Als Nächstes folgt die
  FPGA-Synthese.
- **Analoge und Mixed-Signal-Blöcke:** die 224G-PAM4- und 32G-NRZ-SerDes, die
  physikalischen Schichten für PCIe Gen5 und DDR, PLLs und die Frontends der
  Sigma-Delta-ADCs, selbst zu entwickeln oder zu lizenzieren.
- **1.6TbE-Controller ([ETH_1T6](/de/projects/eth-1t6/)):** Der vollständige
  Link-Layer (MAC, PCS, RS(544,514)-FEC, Lane-Ausrichtung) läuft auf
  FPGA-Silizium in skalierter Konfiguration (ein FEC-Strom, 8 Lanes): 129 Gbit/s,
  312 Milliarden Frames in einer Stunde mit null Fehlern, 1 bis 15 Symbolfehler
  pro Codewort korrigiert, Fehlerbursts bei voller Geschwindigkeit repariert. Die
  volle Struktur (zwei FEC-Ströme, 16 Lanes) ist in der Simulation verifiziert
  und braucht einen größeren Baustein; als Nächstes kommt die Anbindung an echte
  Transceiver.
- **AI Engine und DSP-Kerne:** Architektur festgelegt, RTL ausstehend; die NPU
  und der AOCS-Beschleuniger sind bereits als Bausteine validiert.
- **Übrige Peripherie:** PCIe- und MIPI-Controller in Entwicklung.
- **Die FPGA-Fabric skalieren**, von der Kachel des 130-nm-Testchips auf 500.000
  LUTs.
- **Chip-Implementierungsflow:** Speichermakros, Testlogik (DFT), Timing und
  Fläche im Serienknoten.
- **Gehäuse, Strahlungstests und Raumfahrtqualifikation.**

## Roadmap

Das Projekt befindet sich in Phase F1. Jede Phase endet an einem Go/No-go-Gate,
sodass die Investition gestaffelt werden kann. Termine pro Phase sind noch offen.

{{< a1roadmap >}}

## Risiken und Gegenmaßnahmen

| Risiko | Warum es zählt | Gegenmaßnahme |
|---|---|---|
| Zugang zu einem fortschrittlichen Knoten in Europa und seine Kosten | Hohe Maskenkosten, Exportkontrolle und Kapazitätszuteilung | Mehrere europäische Foundry-Kandidaten; knotenunabhängige Architektur; eine Maske für beide Versionen; Förderung über den EU Chips Act |
| Analoge und Mixed-Signal-IP | 224G-PAM4-SerDes und PHYs für PCIe Gen5 und DDR sind schwer zu entwerfen und zu verifizieren | Bewährte digitale Schichten im Haus; auf Silizium bewährte PHYs lizenzieren, wo es das Risiko senkt; Messung auf dem F2-Shuttle |
| Strahlungsverhalten eines fortschrittlichen Knotens | Fortschrittliche Knoten zeigen andere Single-Event-Effekte als planare Prozesse | DICE-Konfigurationszellen, selbstheilender Lockstep, ECC, dreifach redundanter Controller; Testziel 600 krad (2× Reserve) |
| Skalierung der Fabric auf 500K LUTs | Kachel- und Routing-Fläche könnten das Budget von 85–100 mm² überschreiten | Fläche pro Block verfolgt; der Testchip misst zuerst die realen Kosten einer Kachel |
| CPU-Takt im Serienknoten | Noch nicht festgelegt; er bestimmt die zentrale Leistungszahl | Auf dem F2-Shuttle gemessen, bevor die Produktion zugesagt wird |
| Software- und Werkzeug-Ökosystem | Kunden brauchen ab dem ersten Tag Compiler, Linux und FPGA-Werkzeuge | Standard-RISC-V-GCC, Mainline-Linux und OpenSBI laufen bereits; FPGA-Flow auf Basis von Open-Source-FABulous / LibreLane |
| Dauer und Kosten der Qualifikation | Raumfahrtqualifikation ist lang und teuer | Dieselbe Maske wie das COTS-Bauteil verteilt die Kosten; eingebaute Fehlerinjektion unterstützt die Tests |
| Verifikationslücken | Ein nach dem Tape-out gefundener Fehler ist teuer | Lockstep Befehl für Befehl gegen Referenzmodelle, Mutationstests, Linux-Boot als Regressionstest |
| Eigener Fertigungsstandort in Bremen | Eine vollständige fortschrittliche Fab kostet Milliarden Euro | Gestaffelt: erste Chips bei bestehenden europäischen Foundries; Bremen als langfristiges Ziel mit öffentlichen und industriellen Partnern, beginnend mit Schritten wie Test, Packaging oder einer Pilotlinie |
| Teamgröße | Hercoss befindet sich in der Gründerphase | Die Phasenfinanzierung baut das Team auf; dokumentierter, automatisierter Verifikationsflow |

## Bauen Sie ihn mit uns

Hercoss sucht Partner, um den Exxo A1 vom funktionierenden Prototyp zum Chip zu
bringen, der auf Europas nächsten Missionen fliegt:

- **Investoren und öffentliche Programme**, darunter der EU Chips Act,
  ESA-Instrumente und das Land Bremen, um die nächsten Phasen zu finanzieren.
- **Europäische Foundries und Forschungszentren**, um die Testchips und die
  ersten Serienchips auf europäischem Boden zu fertigen.
- **Lithografie-Partner** für eine künftige HERCOSS-Exxo-Fertigungslinie in
  Bremen.
- **Packaging- und Testpartner** für das kommerzielle Flip-Chip- und das
  strahlungsgehärtete Keramikgehäuse.
- **Strahlungstestanlagen und Raumfahrtagenturen**, darunter die ESA, um den
  Chip für den Flug zu qualifizieren.

Schreiben Sie an [adrian@hercoss.com](mailto:adrian@hercoss.com). Ein
ausführliches technisches Briefing ist für Investoren und Partner auf Anfrage
erhältlich.

**Möchten Sie investieren?** [Werden Sie Teil der Hercoss-Familie →](/de/invest/):
Melden Sie Ihr Interesse an und verfolgen Sie den Chip von innen, im Investor
Hub.
