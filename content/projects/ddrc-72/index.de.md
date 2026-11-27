---
title: "DDRC_72: der selbstheilende DDR4-Speichercontroller"
layout: article
weight: 7
estado: "RTL v0.1 fertig · In der Simulation verifiziert · Speichercontroller des Exxo A1"
hidecover: true
seotitle: "DDRC_72: selbstheilender, strahlungstoleranter DDR4-Speichercontroller für die Raumfahrt — Hercoss"
summary: "Speicher, der die Strahlungsumgebung übersteht, in der er fliegt. DDRC_72 ist Hercoss' eigener 72-Bit-DDR4-Speichercontroller für den HERCOSS Exxo A1: Er hält die Daten korrekt, wenn ein ganzer Speicherchip ausfällt, repariert Fehler selbst und heilt in der strahlungsgehärteten Variante nach einem Latch-up seine eigene Logik. In der Simulation verifiziert: 0 Datenfehler, 0 JEDEC-Timing-Verletzungen."
datos:
  - "72-Bit-DDR4, bis 128 GiB"
  - "Übersteht einen toten Speicherchip"
  - "Selbstheilende Logik (Rad-hard)"
  - "0 Datenfehler in der Simulation"
---

{{< stats >}}
{{< stat "128 GiB" "DDR4 hinter einem 72-Bit-Controller: 64 Datenbits + 8 Fehlerkorrekturbits" >}}
{{< stat "1 Chip" "kann komplett ausfallen, und die Daten kommen trotzdem korrekt zurück" >}}
{{< stat "3.776" "Testfälle der Fehlerkorrektur, einschließlich toter Chips und Poison: 0 Fehler" >}}
{{< stat "0" "Datenfehler und 0 JEDEC-Timing-Verletzungen in der Gesamtsystem-Simulation" >}}
{{< /stats >}}

## Was es ist

DDRC_72 ist der **DDR4-Speichercontroller des [HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/)**,
im Haus in VHDL-2008 geschrieben und auf den Tape-out ausgerichtet. Er steuert
einen 72-Bit-Speicherbus (64 Datenbits plus 8 Fehlerkorrekturbits) und
unterstützt bis zu **128 GiB** DRAM. Er ist über eine vollständige
AXI4-Schnittstelle an das Network-on-Chip [NOC_512](/de/projects/noc-512/) des
Chips angebunden.

{{< fig "ddr-fit.svg" "Jeder Prozessor, die FPGA-Fabric und alle I/O erreichen den externen Speicher über NOC_512 und DDRC_72. Konzept." >}}

**Ein Design, zwei Produkte.** Dieselbe RTL ergibt eine **COTS**-Variante für
kommerzielle und New-Space-Missionen und eine **strahlungsgehärtete** Variante
für GEO-, Deep-Space- und interplanetare Missionen. Die Wahl ist eine
Build-Option, kein zweites Design.

## Warum Speicher die Schwachstelle im All ist

Ein Satellitenrechner hält alles, was er tut, im DRAM, und im All ist DRAM das
Bauteil, das der Strahlung am stärksten ausgesetzt ist:

- **Einzelne Teilchen kippen Bits.** Ein kosmisches Teilchen oder ein solares
  Proton durchquert eine Speicherzelle, und aus einer 0 wird eine 1.
- **Ganze Speicherchips können ausfallen.** Nicht ein Bit, sondern jedes Bit,
  das ein Chip hält.
- **Schwere Ionen können einen Latch-up auslösen,** im Controller selbst: einen
  Kurzschluss, der das Silizium verbrennt, wenn niemand eingreift.
- **Im schlimmsten Fall zerstört ein Teilchen Schaltungsteile physisch.**

Die meisten Controller am Markt korrigieren entweder ein einzelnes gekipptes Bit
oder verlassen sich darauf, dass Software Probleme im Nachhinein bemerkt.
**DDRC_72 ist dafür ausgelegt, den Speicher selbstständig verfügbar zu halten.**

## Was DDRC_72 anders macht

{{< aviso "Patentverfahren läuft" >}}
Die Innovationen in diesem Abschnitt befinden sich im Patentverfahren. Wir
beschreiben, was sie erreichen; wie sie funktionieren, wird veröffentlicht,
sobald das Verfahren es erlaubt.
{{< /aviso >}}

### Er übersteht einen toten Speicherchip

Ein 72-Bit-Wort ist über viele DRAM-Chips verteilt. Fällt einer davon komplett
aus, liefert DDRC_72 weiterhin transparent korrekte Daten. Das ist Schutz der
Chipkill-Klasse: Er korrigiert den vollständigen Ausfall eines Speicherchips und
danach einen bekannt toten Chip plus einen weiteren Fehler. Alles darüber hinaus
wird mit einer exakten **Poison**-Markierung versehen, sodass **verfälschte Daten
nie stillschweigend weitergegeben werden.**

{{< fig "ddr-chipkill.svg" "Ein Speicherchip des Wortes fällt komplett aus; der Controller liefert weiterhin korrekte Daten. Konzept." >}}

### Er unterscheidet einen Strahlungstreffer von einem defekten Bauteil

Ein zufälliger Teilchentreffer und ein ausfallendes Hardwareteil sehen zunächst
gleich aus. DDRC_72 unterscheidet sie und repariert jede Klasse automatisch: Ein
Treffer wird sofort bereinigt, eine DRAM-Zeile, die immer wieder ausfällt, wird
stillgelegt und durch eine Ersatzzeile ersetzt, und ein toter Chip wird als
gelöscht behandelt, damit der Rest des Wortes geschützt bleibt. Keine Software
muss es zuerst bemerken.

### Er räumt schneller auf, wenn die Sonne aktiv ist

Speicher muss regelmäßig gelesen und bereinigt werden, bevor sich Treffer
anhäufen. DDRC_72 **passt die Intensität der Bereinigung an das gemessene
Strahlungsniveau an** und bereinigt sofort um jeden erkannten Treffer herum. Ist
es im All ruhig, gehört die Bandbreite der Mission.

{{< fig "ddr-scrub.svg" "Darstellung des Verhaltens: Der Bereinigungsaufwand folgt der Strahlungsumgebung. Nicht maßstäblich; keine Flugdaten." >}}

### Er heilt nach einem Latch-up seine eigene Logik

In der strahlungsgehärteten Variante **heilt sich der Controller selbst.** Nach
einem Latch-up oder einem zerstörerischen Teilchentreffer in einem Teil seiner
eigenen Logik isoliert er den Schaden, schaltet **ohne Datenverlust** auf
Ersatzhardware um und arbeitet weiter. Endgültig zerstörte Teile werden dauerhaft
stillgelegt. Er degradiert kontrolliert, statt auszufallen, und meldet der
Software bei jedem Schritt seinen Zustand.

### Ein Design, COTS und Rad-hard

Kommerzielle und strahlungsgehärtete Produkte stammen aus derselben
verifizierten RTL. Kunden, die mit dem COTS-A1 beginnen, wechseln zum
Rad-hard-A1, ohne ihre Software oder ihr Speichersystem zu ändern.

## Wichtige Spezifikationen

| | |
|---|---|
| Speicher | DDR4, ausgelegt nach JEDEC DDR4 (JESD79-4); Registered DIMMs (RDIMM) und gestapelte 3DS-Bausteine; x4- und x8-Bausteine |
| Breite und Kapazität | 72-Bit-Bus (64 Daten + 8 ECC); bis 128 GiB; 8 logische Ranks |
| Fehlerkorrektur | Symbolbasiert, auf Chipebene: korrigiert den Ausfall eines kompletten Speicherchips sowie einen bekannt toten Chip plus einen weiteren Fehler; exakte Poison-Markierung |
| Leistung | JEDEC-Timing-Engine für alle DDR4-Bedingungen; Refresh-Management; umordnender Scheduler (Befehle außer der Reihe) für die Bandbreite |
| Zuverlässigkeits-Engine | Patrol-Scrubbing angepasst an das Strahlungsniveau; sofortige Bereinigung um jeden Treffer; Fehlerklassifikation mit automatischer Reparatur (Ersatzzeilen, Chip-Löschung); Recovery bei funktionalen DRAM-Unterbrechungen |
| Rad-hard-Variante | Ersatzhardware für den Controller mit automatischer Latch-up-Isolation, Wiederherstellung und Rückkehr in den Betrieb; dauerhafte Stilllegung zerstörter Teile; Zustandsregister |
| Schnittstellen | Vollständiges AXI4 zu NOC_512; AXI4-Konfigurationsregister; PHY-Schnittstelle nach Art von DFI |
| Implementierung | VHDL-2008, im Haus; eine RTL für COTS und Rad-hard, beim Build gewählt |

Werte für Frequenz und Bandbreite werden veröffentlicht, sobald Ergebnisse der
FPGA-Synthese vorliegen.

## Entwicklungsstand

{{< fig "ddr-status.svg" "Wo DDRC_72 am 26. November 2026 steht." >}}

| Meilenstein | Status |
|---|---|
| RTL fertig: Controller, Fehlerkorrektur, Zuverlässigkeits-Engine, Rad-hard-Supervisor, Selbsttest | **Erledigt** · v0.1 |
| Unit-Test der Fehlerkorrektur: 3.776 Fälle, einschließlich toter Chips und Poison | **Erledigt** · bestanden, 0 Fehler |
| Gesamtsystem-Simulation: DRAM-Initialisierung, Zufallsverkehr, Teilschreibzugriffe, injizierte Bitkipper, ein toter Speicherchip, eine ausfallende Zeile mit automatischem Ersatz | **Erledigt** · 2.727 Schreib- und 4.120 Lesezugriffe verifiziert, 0 Datenfehler, 0 JEDEC-Timing-Verletzungen |
| Rad-hard-Simulation: Upset, Latch-up und zerstörte Hardware in der eigenen Logik des Controllers | In Arbeit |
| FPGA-Synthese auf AMD Versal (Fläche, Frequenz) | Als Nächstes |
| Silizium-Validierung auf dem TE0950-Board, Controller in der Schleife mit DRAM-Ersatz | Geplant |
| Echter DDR4-PHY und DRAM, Strahlungstests | Zukünftig, mit dem A1-Testchip |

*Alle obigen Ergebnisse sind in der Simulation verifiziert. DDRC_72 ist noch
nicht auf Silizium gelaufen, hat keine Flugerfahrung und ist weder qualifiziert
noch zertifiziert. Er ist nach JEDEC DDR4 ausgelegt; die Konformität wurde nicht
getestet.*

## Roadmap

1. **FPGA-Synthese** auf AMD Versal: erste Werte für Fläche und Frequenz.
2. **Silizium-Selbsttest auf dem TE0950-Board**, mit dem Controller in der
   Schleife und einem DRAM-Ersatz.
3. **A1-Testchip mit echtem DDR4-PHY** und echtem Speicher.
4. **Strahlungskampagne.**

## Teil der Hercoss-IP-Familie

DDRC_72 ergänzt die [Hercoss-IP-Cores](/de/projects/ip-core-family/), aus denen
der Exxo A1 besteht: den Prozessor [RV128IMAC](/de/projects/rv128imac/), das
Network-on-Chip [NOC_512](/de/projects/noc-512/) und den
[1,6-Tbit/s-Ethernet](/de/projects/eth-1t6/)-Core. Wie sie ist er in Europa und
im Haus entwickelt: ein Speichersubsystem für die Raumfahrt, das nicht von
US-exportkontrollierten Bauteilen abhängt.

Interesse am HERCOSS Exxo A1 oder an DDRC_72?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[In Hercoss investieren →](/de/invest/)
