---
title: "1,6-Tbit/s-Ethernet: Fehlerkorrektur läuft auf Silizium"
layout: article
weight: 6
estado: "Auf Silizium validiert · MAC, PCS, RS(544,514)-Fehlerkorrektur, Lane-Ausrichtung"
hidecover: true
seotitle: "1,6-Tbit/s-Ethernet-MAC-, PCS- und FEC-IP-Core, europäisch und im Haus entwickelt — Hercoss"
summary: "Hercoss' eigene Implementierung der schnellsten Ethernet-Rate, die heute standardisiert wird: ein vollständiger 1,6-Tbit/s-Link-Layer (MAC, PCS, Reed-Solomon-Fehlerkorrektur und Lane-Ausrichtung), von einem leeren Blatt aus für den HERCOSS Exxo A1 entworfen. Läuft auf FPGA-Silizium: 312 Milliarden Frames in einer Stunde, null Fehler."
datos:
  - "Ziel 1,6 Tbit/s"
  - "312 Milliarden Frames, 0 Fehler"
  - "1–15 Symbolfehler: alle korrigiert"
  - "Fehlerbursts bei voller Geschwindigkeit repariert"
  - "Bitgenau zu den IEEE-802.3-Vektoren"
---

{{< stats >}}
{{< stat "312 Mrd." "Frames in einem einstündigen Lauf auf Silizium, null Fehler" >}}
{{< stat "108 Mrd." "Codewörter der Fehlerkorrektur in dieser Stunde geprüft, keines fehlerhaft" >}}
{{< stat "20 / 20" "Codewörter repariert, wenn je zwei gleichzeitig getroffen wurden, zehnmal hintereinander" >}}
{{< stat "0" "Mal wurden verfälschte Daten als gültig weitergegeben" >}}
{{< /stats >}}

{{< aviso "Patentverfahren läuft" >}}
Die Architektur des Fehlerkorrektur-Empfängers ist neu, und ihr Patentverfahren
läuft. Diese Seite zeigt, was der Core erreicht; technische Details werden
zurückgehalten, bis das Verfahren es erlaubt.
{{< /aviso >}}

## Was es ist

Der HERCOSS-1.6T-Ethernet-Core ist unsere eigene Implementierung der schnellsten
Ethernet-Rate, die heute standardisiert wird: **1,6 Terabit pro Sekunde**. Er ist
ein vollständiger Link-Layer, im Haus von einem leeren Blatt aus für den Chip
[HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/) entworfen.

{{< fig "eth-stack.svg" "Alles zwischen dem internen Netz des Chips und den 16 Leitungs-Lanes ist Hercoss' eigenes Design." >}}

- **MAC:** Erzeugung und Prüfung von Frames.
- **PCS:** Leitungscodierung, Verwürfelung und Verteilung auf die Lanes.
- **FEC:** Reed-Solomon-Vorwärtsfehlerkorrektur RS(544,514): Encoder,
  Fehlererkennung und vollständige Fehlerkorrektur.
- **Lane-Ausrichtung:** automatisches Einrasten, Deskew und Umsortieren der
  Lanes.
- **Software-Schnittstelle:** eine Registerbank mit Zählern, Ereignissen und
  Interrupts.

**Es ist kein Wrapper um Fremd-IP. Jeder Block ist unser eigener**, und die
Architektur seines Fehlerkorrektur-Empfängers ist neu.

## Warum es zählt

KI-Cluster und Rechenzentren wechseln von 400G- und 800G- zu 1.6T-Verbindungen.
Bei dieser Geschwindigkeit ist die Logik, die die Daten rahmt, schützt und
ausrichtet, einer der schwierigsten digitalen Blöcke eines Chips, und heute gibt
es ihn nur bei einer Handvoll Anbietern. Ein europäischer, unabhängig
entwickelter 1.6T-Core gibt dem HERCOSS Exxo A1 eigene
Hochgeschwindigkeitsnetzwerke, **ohne Lizenzabhängigkeit**.

Bei 1,6 Tbit/s kann ein Controller nicht mehr einen Frame nach dem anderen
abarbeiten: Jeder Takt trägt 4.096 Bit, genug, damit mehrere vollständige Frames
im selben Takt beginnen und enden. Der Core ist von Anfang an dafür gebaut, und
seine Breite entspricht acht Lanes des [NOC_512](/de/projects/noc-512/)-Netzes,
sodass Daten ohne Umwandlung zwischen dem Port und dem Rest des Chips fließen.

{{< fig "eth-cycle.svg" "Ein Takt bei 1,6 Tbit/s: 4.096 Bit, acht Netz-Lanes, mehrere Frames. Konzeptionell." >}}

## Gemessen, nicht versprochen

Der Core läuft heute auf echtem Silizium, einem AMD-Versal-FPGA, in einer
skalierten Konfiguration, die in den Baustein passt (ein FEC-Strom, 8 Lanes), bei
300 MHz Systemtakt mit gemessener Timing-Reserve. Die komplette Kette läuft
gleichzeitig: MAC, PCS, FEC und Lane-Ausrichtung.

{{< fig "eth-hour.svg" "Eine Stunde unter Volllast auf dem FPGA-Board, mit unabhängigen Zählern an beiden Enden der Verbindung." >}}

| Ergebnis | Auf Silizium gemessen |
|---|---|
| Dauerhafte Nutzlast | **129 Gbit/s** durch MAC + PCS + FEC + Lane-Ausrichtung |
| Einstündiger Dauerlauf | **312 Milliarden Frames, null Fehler** |
| In dieser Stunde geprüfte Codewörter | **108 Milliarden, keines fehlerhaft** |
| Fehlerkorrektur | **1 bis 15 Symbolfehler pro Codewort: alle korrigiert, kein Frame verloren** |
| Jenseits der Grenze des Codes | 16 Symbolfehler: erkannt und gekennzeichnet, nie als gute Daten ausgeliefert |
| Mehrere beschädigte Codewörter gleichzeitig | **Gemeinsam repariert, bei voller Geschwindigkeit** |
| Lane-Handhabung | Lanes absichtlich vertauscht, verschoben und versetzt: automatisch eingerastet und umsortiert |
| Timing | Schließt bei 300 MHz mit gemessener Reserve |

### Er korrigiert Fehler, in Hardware, bei voller Geschwindigkeit

Wir injizieren absichtlich Fehler in die laufende Verbindung, per Software, mit
voller Kontrolle darüber, wie viele Symbole wo getroffen werden. Mit aktiver
Korrektur werden Schäden, die Frames zerstören würden, im Fluss repariert: Der
Empfänger meldet die reparierten Codewörter, und die Anwendung verliert nichts.
Der Durchsatz ändert sich nicht.

### Er kennt seine eigene Grenze

{{< fig "eth-fec.svg" "Injizierte Symbolfehler pro Codewort auf der laufenden Verbindung. 1 bis 15: repariert. 16: als nicht korrigierbar erklärt, nie weitergegeben." >}}

Der Code kann bis zu 15 Symbolfehler pro Codewort reparieren. Wir haben jeden
Fall getestet, 1, 2, 3 … 15: alle repariert. Bei 16 tut der Core genau, was er
muss: Er erklärt das Codewort für nicht korrigierbar und markiert die Daten als
ungültig. **In keinem Test wurden verfälschte Daten als gültig weitergegeben.**

### Er hält mit, wenn Fehler in Bursts kommen

Echte Verbindungen fallen nicht ein Codewort nach dem anderen aus. Auf Silizium
haben wir zwei Codewörter im selben Augenblick getroffen und das zehnmal
hintereinander wiederholt: **Jedes Codewort wurde repariert, kein Frame ging
verloren.** Ein kompakter Empfänger, der mit Bursts mithält, verträgt weit mehr
Fehler, als seine Größe vermuten lässt.

{{< fig "eth-burst.svg" "Zwei Codewörter im selben Augenblick beschädigt, zehn Runden hintereinander, auf der laufenden Verbindung auf Silizium." >}}

### Er folgt dem Standard Bit für Bit

{{< fig "eth-vectors.svg" "Der Sendepfad reproduziert die offiziellen Referenz-Testvektoren exakt." >}}

Der Sendepfad reproduziert exakt die offiziellen Referenz-Testvektoren von IEEE
802.3 für 200G, 400G und 800G sowie die veröffentlichten Beispielvektoren des
1.6T-Standardentwurfs (P802.3dj).

## Wie wir hierher gekommen sind

| Schritt | Meilenstein |
|---|---|
| MAC | Frame-Controller fertig und in der Simulation bei vier Datenpfadbreiten verifiziert, einschließlich der vollen 1,6-Tbit/s-Breite; von der ersten Zeile bis zum timing-sauberen Design in einer einzigen Arbeitssitzung |
| MAC + PCS auf Silizium | Bei einem Viertel der Endbreite: 258,3 Gbit/s Nutzlast, exakt der theoretische Wert; 625 Milliarden Frames in einer Stunde, null Fehler |
| Vollständiger Link-Layer auf Silizium | Fehlerkorrektur und Lane-Ausrichtung ergänzt: 129 Gbit/s durch die komplette Kette, 312 Milliarden Frames in einer Stunde, null Fehler |
| Fehlerbursts auf Silizium | Zwei Codewörter gleichzeitig getroffen, zehnmal hintereinander: alle bei voller Geschwindigkeit repariert, kein Frame verloren |

{{< detalle "Warum ist der neueste Durchsatz niedriger als der frühere?" >}}
Der frühere Lauf mit 258,3 Gbit/s enthielt den Frame-Controller und die ersten
PCS-Stufen. Der neueste Lauf enthält den vollständigen Link-Layer, einschließlich
Reed-Solomon-Decoder und Lane-Ausrichtung, in einer Konfiguration, die auf
dasselbe FPGA skaliert ist. Beide wurden bei 300 MHz auf demselben Board
gemessen. Die Rate des vollen 1,6-Tbit/s-Datenpfads wird auf dem A1-Chip selbst
ermittelt.
{{< /detalle >}}

## Was noch vor uns liegt

Wir sagen lieber offen, was noch nicht fertig ist.

- Die Silizium-Ergebnisse stammen aus einer **skalierten Konfiguration** (ein
  FEC-Strom, 8 Lanes). Die volle 1.6T-Struktur, zwei FEC-Ströme und 16 Lanes,
  ist in der Simulation verifiziert und größer als unser Evaluierungs-FPGA. Sie
  wird auf einem größeren Baustein oder auf dem A1-Chip selbst auf Silizium
  validiert, wo auch ihre volle Geschwindigkeit ermittelt wird.
- Die Testverbindung ist ein **interner Kanal** im Baustein. Die Anbindung an
  optische oder elektrische Transceiver ist der nächste Integrationsschritt.

## Die Methode

Jedes Ergebnis auf dieser Seite folgt derselben Regel: **simulieren,
synthetisieren, dann auf dem Board beweisen.** Nichts gilt als funktionierend,
bevor es auf Silizium mit unabhängigen Zählern an beiden Enden der Verbindung
gelaufen ist, und jede Änderung läuft mindestens eine Stunde mit ununterbrochenem
Verkehr, bevor sie zählt.

## Aufgebaut auf bewährtem Ethernet

Der 1.6T-Core baut auf der Hercoss-Ethernet-Familie auf, die bereits auf
FPGA-Silizium läuft: ein 40G-MAC und -PCS, die mit einer kommerziellen
Netzwerkkarte in einem einstündigen Dauertest mit null Fehlern zusammenarbeiten,
25G-Ethernet und eine 103-Gbit/s-SerDes-Verbindung. Siehe
[Hochgeschwindigkeitsverbindungen](/de/projects/high-speed-links/).

## Im Exxo A1

Im [HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/) steuert dieser Core den
1.6TbE-Port auf acht PAM4-Lanes mit 224 Gbit/s, Teil der bis zu ~2 Tbit/s
Ethernet, die der Chip gleichzeitig tragen kann.

Für technische Anfragen oder Investitionsanfragen:
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[In Hercoss investieren →](/de/invest/)
