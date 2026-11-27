---
title: "NOC_512: das selbstheilende Network-on-Chip des Exxo A1"
layout: article
weight: 3
estado: "Selbstheilung auf Silizium validiert und formal verifiziert · 5 × 5-Chipplan in der Simulation"
hidecover: true
seotitle: "NOC_512: selbstheilendes 512-Bit-Network-on-Chip für die Raumfahrt, auf Silizium validiert — Hercoss"
summary: "Ein 512-Bit-Network-on-Chip, das garantierte Datenströme mit hoher Bandbreite trägt und sich in etwa 0,6 µs selbst um einen ausgefallenen Switch herum repariert, ohne Software und ohne Datenverlust. Auf Silizium validiert: 405.522 Switch-Ausfälle in einer Stunde, mehr als 160 Milliarden Datenwörter, keines verloren oder beschädigt."
datos:
  - "Selbstheilung in ≈0,6 µs, auf Silizium"
  - "405.522 Ausfälle, 0 Wörter verloren"
  - "9 / 9 Sicherheitsregeln formal verifiziert"
  - "3,19 Billionen Transfers, 0 Fehler"
  - "Chipplan mit 7,7 Tbit/s"
---

{{< stats >}}
{{< stat "≈0,6 µs" "bis sich das Netz um einen ausgefallenen Switch herum repariert hat, auf Silizium gemessen" >}}
{{< stat "405.522" "Switch-Ausfälle in einer Stunde unter Volllast, jeder einzelne bewältigt" >}}
{{< stat "0" "von mehr als 160 Milliarden Datenwörtern verloren oder beschädigt" >}}
{{< stat "3,19 Bio." "AXI4-Transfers auf Silizium in neun einstündigen Läufen, ohne einen einzigen Fehler" >}}
{{< /stats >}}

{{< aviso "Patentprüfung läuft" >}}
Diese Seite berichtet, was NOC_512 erreicht. Wie seine Schutz- und
Selbstheilungsmechanismen funktionieren, wird nicht veröffentlicht, solange das
Patent geprüft wird.
{{< /aviso >}}

## Die Kurzfassung

Jeder große Chip ist eine Stadt aus Blöcken: Prozessorcluster, Ethernet, PCIe,
KI-Engines, Funkwandler, Speicher. Das Network-on-Chip ist ihr Straßennetz.
**Wird eine Straße gesperrt, steht die Stadt still.**

**NOC_512** ist das Network-on-Chip des
[HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/). Es bewegt Daten in Schritten
von 512 Bit, trägt gewöhnlichen Speicherverkehr und garantierte Datenströme mit
hoher Bandbreite nebeneinander und schützt beide auf jeder Ebene vor Fehlern.

In diesem Monat hat es seinen bisher härtesten Test bestanden, **auf Silizium**.
Ein Switch des Netzes wurde **in einer Stunde unter Volllast mehr als 400.000-mal
ab- und wieder eingeschaltet**. Jedes Mal hat das Netz die betroffene Daten-Lane
**selbstständig in etwa 0,6 Mikrosekunden** wiederhergestellt, ohne Software,
ohne Routing-Tabellen und ohne zentralen Controller, und ist zur ursprünglichen
Konfiguration zurückgekehrt, als der Switch wieder da war. **Nicht eines von mehr
als 160 Milliarden Datenwörtern ging verloren oder wurde beschädigt.**

## Was sich am 26. November 2026 geändert hat

**An einem Tag ging das selbstheilende Netz von der Simulation aufs Silizium und
in die formale Verifikation.**

{{< fig "noc-day.svg" "Ein Tag: Die Simulation sagte 149 Takte voraus, das Silizium maß 149 Takte, ein einstündiger Dauertest bestätigte es 405.522-mal, und ein Model Checker fand keinen Weg, es zu brechen." >}}

- **Erster Lauf auf Silizium.** Ein Switch wurde auf dem Testboard unter
  Volllast deaktiviert. Das Netz stellte die betroffene Lane selbstständig in
  **149 Takten (0,58 µs)** wieder her, exakt dem von der Simulation
  vorhergesagten Wert, und kehrte zur ursprünglichen Konfiguration zurück, als
  der Switch wieder da war. Keine Daten verloren.
- **Einstündiger Dauertest auf Silizium.** **405.522 Switch-Ausfälle** mit
  zufälligem Timing, jede Reparatur in **148 bis 156 Takten**. Mehr als **160
  Milliarden Datenwörter, keines verloren oder beschädigt.**
- **Formale Verifikation.** Ein mathematischer Model Checker untersuchte *jede
  mögliche Eingabefolge* an einen Switch und fand **keinen Weg, eine seiner neun
  Sicherheitsregeln zu verletzen**, innerhalb der geprüften Tiefe.
- **Regression des Gesamtchips.** Das A1-Netz mit 25 Knoten liefert in der
  Simulation dieselben Ergebnisse wie zuvor: null verlorene Wörter bei einem
  ausgefallenen Switch.
- **Ehrliche Grenzen.** Die gehärtete Version der Selbstheilungslogik passt nicht
  zusammen mit allem anderen in das kleine Test-FPGA, daher lief auf Silizium die
  Basisversion. Die gehärtete Version ist in der Simulation und formal
  verifiziert.

## Das zentrale Ergebnis: Selbstheilung, auf Silizium

### Der Test

Eine 2 × 2-Version von NOC_512 läuft auf einem AMD-Versal-FPGA (Trenz TE0950,
VE2302) mit **255 MHz**, mit Speicherverkehr auf der Paketebene und zwei
Stream-Verbindungen auf der Stream-Ebene, eine davon geschützt. Ein Test-Hook
**schaltet den Stream-Switch eines Knotens tot**: Er sendet nichts mehr, genau
wie ein ausgefallener Switch.

Niemand sagt dem Netz, welcher Switch ausgefallen ist. Keine Software reagiert.
Keine Ersatzroute ist vorbereitet.

{{< fig "noc-heal-concept.svg" "Selbstheilung in drei Schritten: normale Route, vom Gitter selbst gefundener Umweg, automatische Rückkehr. Konzeptzeichnung." >}}

### Was passiert

{{< fig "noc-heal-withwithout.svg" "Ohne Selbstheilung überlebt der Strom, läuft aber ohne Sicherheitsnetz. Mit ihr ist das Sicherheitsnetz in weniger als einer Mikrosekunde zurück." >}}

| | Ohne Selbstheilung | Mit Selbstheilung |
|---|---|---|
| Die Lane durch den ausgefallenen Switch | Bleibt tot, solange der Switch tot ist | **Nach 148–156 Takten (≈ 0,6 µs) wieder aktiv** |
| Datenwörter, die der Schutz rekonstruieren muss | **191 Millionen pro Sekunde** | **Keine**, sobald die Lane zurück ist |
| Verlorene Wörter | 0 (der Schutz fängt es ab) | **0** |
| Wenn der Switch zurückkommt | – | Das Netz kehrt selbstständig zur ursprünglichen Konfiguration zurück |

Ohne Selbstheilung überlebt der Strom nur, weil sein Schutz jedes Wort
rekonstruiert. Das funktioniert, aber der Strom läuft ohne Sicherheitsnetz: noch
ein Fehler, und Daten gehen verloren. **Mit Selbstheilung ist das Sicherheitsnetz
in weniger als einer Mikrosekunde wiederhergestellt.**

### Eine Stunde, 405.522 Ausfälle

Ein einzelner Erfolg beweist, dass die Idee funktioniert. Um zu zeigen, dass sie
zuverlässig ist, wurde der Switch eine Stunde lang immer wieder abgeschaltet und
wiederbelebt, mit zufälligem Timing von Mikrosekunden bis zu zehn Millisekunden,
einschließlich Ausfällen, die eintreten, während das Netz noch den vorherigen
repariert.

{{< fig "noc-heal-soak.svg" "Der einstündige Dauertest auf Silizium bei 255 MHz, jeder Zähler am Ende geprüft." >}}

| Einstündiger Dauertest auf Silizium | |
|---|---|
| Switch-Ausfälle | **405.522** |
| Gemessene Reparaturen | 324.687, **alle zwischen 148 und 156 Takten** (Mittel 148,8) |
| Ausfälle, die eintraten, während die Reparatur noch aktiv war | 80.835: Die Lane fiel gar nicht erst aus |
| Rückkehr zur ursprünglichen Konfiguration geprüft | 6.336-mal, 6.336-mal korrekt |
| Datenwörter des Stroms | Mehr als **160 Milliarden**, **keines verloren, keines beschädigt** |
| Speicherverkehr parallel | **24,8 Milliarden** Transaktionsbündel, **null Fehler** |

### Praktisch deterministisch

{{< fig "noc-heal-time.svg" "Wie lange eine Lane ausfällt, nachdem ihr Switch ausgefallen ist. Selbstheilung auf Silizium gemessen; vorbereitete Ersatzrouten aus der Simulation des Gesamtchips." >}}

| Reparaturzeit (Takte) | Reparaturen |
|---|---|
| 0 – 150 | 311.774 |
| 151 – 200 | 12.913 |
| Mehr als 200 | **0** |

Eine Streuung von acht Takten über Hunderttausende Ereignisse, ohne lange
Ausläufer. Dieselben 149 Takte wurden vor dem ersten Lauf auf Silizium in der
RTL-Simulation gemessen: **Die Hardware tut genau, was das Modell vorhergesagt
hat.**

### Warum das anders ist

Die meisten fehlertoleranten Netze reparieren sich mit Hilfe: Software, die den
Ausfall bemerkt, vorab vorbereitete Tabellen, ein Controller, der entscheidet.
**NOC_512 braucht nichts davon.**

{{< fig "noc-ideas.svg" "Vier Dinge, die das Netz nicht braucht, um sich selbst zu heilen." >}}

- **Keine Software in der Schleife.** Die Reparatur ist vorbei, bevor ein
  Prozessor überhaupt einen Interrupt bemerkt hätte.
- **Keine Routing-Tabellen.** Für keinen möglichen Ausfall muss vorab etwas
  vorbereitet werden.
- **Kein zentraler Controller.** Es gibt keinen einzelnen Block, dessen Ausfall
  die Reparatur selbst stoppen würde.
- **Kein Wissen darüber, was ausgefallen ist.** Dem Netz muss niemand sagen,
  welcher Switch fehlt.

### Formal verifiziert, nicht nur getestet

Tests zeigen, was in den Fällen passiert, die man ausprobiert. **Formale
Verifikation prüft jeden möglichen Fall, bis zu einer angegebenen Tiefe.** Ein
Model Checker untersuchte jede mögliche Eingabefolge an die Selbstheilungslogik
eines Switches (beliebiger Verkehr, beliebiges Verhalten der Nachbarn, beliebige
Konfiguration) und fand innerhalb dieser Tiefe keinen Weg, eine seiner neun
Sicherheitsregeln zu verletzen.

{{< fig "noc-formal.svg" "Formale Verifikation der Selbstheilungslogik eines Switches, per Model Checking innerhalb der angegebenen Tiefen." >}}

- **Neun Sicherheitsregeln, alle erfüllt** für jede Eingabefolge: 32 Takte tief
  mit jeder erreichbaren Wartezeit, 24 mit den realen.
- **Die gehärtete Version verhält sich exakt wie die Basisversion**, mit beliebig
  injizierten Fehlern, geprüft bis 16 Takte Tiefe.
- **Als Nächstes:** das gesamte Netz. Dass die Switches zusammen nie eine Schleife
  bilden, nie die Daten einer Verbindung ans falsche Ziel liefern und immer nach
  Hause zurückkehren. Diese Arbeit hat begonnen.

{{< detalle "Takte, nicht Mikrosekunden: Was bedeutet das für den Chip?" >}}
Die Reparatur dauert unabhängig vom Takt etwa 149 Takte. Bei 255 MHz auf dem FPGA
sind das 0,58 µs; bei den Gigahertz-Takten eines dedizierten Chips wäre es ein
Bruchteil davon. Im 2 × 2-Testsystem belegt die Selbstheilungslogik aller vier
Knoten etwa 10.300 LUTs, rund 9 % des Testsystems. Ihre gehärtete Version ist in
der Simulation verifiziert; sie passt nicht zusammen mit allem anderen in diesen
kleinen Baustein und wartet auf einen größeren.
{{< /detalle >}}

## Warum ein Network-on-Chip zählt

In einem modernen System-on-Chip ist reine Rechenleistung selten der Engpass.
**Daten zu bewegen ist es.** Ein 1,6-Tbit/s-Ethernet-Port, eine PCIe-Gen5-x16-
Verbindung, ein KI-Array und ein HF-Frontend müssen gleichzeitig Daten
austauschen, ohne dass einer die anderen ausbremst, und ohne dass der ganze Chip
ausfällt, wenn sich ein Teil falsch verhält.

Für einen Chip, der für lange Raumfahrtmissionen gedacht ist, ist dieser letzte
Punkt entscheidend. In zehn Jahren im Orbit oder im tiefen Weltraum werden Teile
eines Chips von energiereichen Teilchen getroffen. Ein Bit kippt; ein Switch
hängt sich auf. Auf der Erde zählt dieselbe Zuverlässigkeit für Rechenzentren,
Telekommunikation und jedes System, das sich nicht für eine Reparatur anhalten
lässt. **Ein Netz, das seine Daten intakt hält und seine eigenen Ausfälle
umgeht, ist das, was den Rest des Chips am Laufen hält.**

## Was NOC_512 ist

Zwei Netze in einem, die sich dasselbe Gitter aus Knoten teilen:

| | Paketebene | Stream-Ebene |
|---|---|---|
| Trägt | Speicherlese- und -schreibzugriffe zwischen zwei beliebigen Blöcken (AXI4) | Kontinuierliche Datenströme mit hoher Bandbreite: Ethernet, PCIe, KI, HF, Wandler |
| Wie | Pakete finden ihren Weg von Knoten zu Knoten | Lanes, die Ende zu Ende reserviert sind: garantierte Bandbreite, konstante Latenz |
| Breite | 512-Bit-Daten, mit Schutz | 512-Bit-Lanes, 8 Lanes pro Verbindung im A1 |

{{< fig "noc-planes.svg" "Ein Gitter, zwei Ebenen. Konzeptionell." >}}

**Gebaut für den A1-Chip:** ein 5 × 5-Gitter aus 25 Knoten, das vier
Prozessorcluster (16 [RV128IMAC](/de/projects/rv128imac/)-Kerne), sechs Ports der
FPGA-Fabric, drei PCIe- und drei Ethernet-Ports (einschließlich
[1,6 Tbit/s](/de/projects/eth-1t6/)), drei Ports des KI-Arrays, die ADC- und
HF-Wandler, zwei externe Speicherports ([DDRC_72](/de/projects/ddrc-72/)) sowie
den Knoten für Boot, Krypto und langsame Peripherie verbindet.

**Auf jeder Ebene geschützt:**

- **Ende-zu-Ende-Fehlerkorrektur** auf jedem Paket: Einzelbitfehler korrigiert,
  Doppelbitfehler erkannt.
- **Fehlertoleranter Steuerzustand** in Routern, Verbindungen, Bridges und
  Konfiguration: Ein in jedem Takt verfälschter interner Zustand liefert exakt
  dasselbe Ergebnis wie ein Lauf ohne Fehler.
- **Geschützte Speicher** in den Bridges.
- **Geschützte Ströme:** Ein unterbrochener Pfad oder gekippte Bits kosten keine
  Daten.
- **Automatisches Umrouten** auf vorbereitete Ersatzrouten, mit automatischer
  Rückkehr, wenn der ursprüngliche Pfad wieder funktioniert.
- **Neu: Selbstheilung.** Das Gitter findet selbst den Weg um einen
  ausgefallenen Switch herum.
- **Es sagt die Wahrheit, wenn es nicht mehr kann:** Jedes verlorene Wort wird
  gezählt, und keines wird je falsch ausgeliefert.

### Absichtliche Fehler, auf Silizium

{{< fig "noc-faults.svg" "Frühere Läufe mit Fehlerinjektion auf dem FPGA-Board, während das Netz Verkehr trug." >}}

## Der Preis des Schutzes, veröffentlicht

Jede Schutzschicht wurde einzeln aufs Board gebracht und eine Stunde unter
Volllast betrieben, bevor die nächste hinzukam. Jeder Lauf: **null Fehler.**

{{< fig "noc-ladder.svg" "Einstündige Läufe auf einem AMD Versal VE2302 (Trenz TE0950). Takt und AXI4-Transfers pro Stunde." >}}

Jedes Silizium-Ergebnis wurde auf demselben kleinen Board gemessen, dem einzigen,
das heute verfügbar ist. Jede neue Schutzschicht bedeutete mehr Logik im selben
Baustein, und deshalb sank der Takt von 375 MHz für das reine Netz auf 255 MHz
mit allen Schutzschichten und der Selbstheilungslogik an Bord. **Im A1-Chip ist
diese Logik dediziertes Silizium, keine FPGA-Fabric.**

{{< detalle "Was bedeuten die FPGA-Taktwerte für den Chip?" >}}
Sie wurden auf einem FPGA gemessen, nicht auf dem Exxo A1. Der Takt des Chips
hängt vom Serienknoten ab; der A1 zielt für das Netz auf etwa 1,5 GHz. Auf dem
FPGA bräuchten 1,6 Tbit/s auf einer einzigen 512-Bit-Verbindung 3,1 GHz, daher
wird Massenverkehr auf mehrere parallele Stream-Verbindungen verteilt.
{{< /detalle >}}

{{< fig "noc-why.svg" "Takt, der für 1,6 Tbit/s auf einer 512-Bit-Verbindung nötig ist, im Vergleich zu den auf dem FPGA gemessenen Obergrenzen." >}}

## Der Gesamtchip, in der Simulation

{{< fig "noc-a1plan.svg" "Verkehrsplan des Exxo A1 auf dem 5 × 5-Gitter, in der Simulation mit dem vollständigen Netz ausgeführt." >}}

Auf dem A1-Plan mit 25 Knoten, in der RTL-Simulation:

- **19 Stream-Verbindungen gleichzeitig**, 57 Daten-Lanes, **7,73 Tbit/s**
  garantierte Bandbreite bei 265 MHz, neben der Paketebene.
- **Jeweils ein toter Switch** (sechs verschiedene Switches, jeder für 800 Takte
  tot): **65 von 66 betroffenen Lanes wieder in Betrieb**, während der Switch
  noch tot ist. Für die verbleibende gibt es im ganzen Gitter keinen freien Pfad.
  **Null Wörter verloren**, und jede Verbindung kehrt nach Hause zurück, sobald
  sich der Switch erholt.
- **Zwei Switches gleichzeitig tot**, beim ungünstigsten Paar des Chips: **72 %
  weniger verlorene Wörter** als ganz ohne Reparatur, und nur eine der acht
  betroffenen Verbindungsgruppen bleibt getrennt, diejenige, für die kein freier
  Pfad übrig ist.
- Mit gehärteter Selbstheilungslogik und in **jedem Takt in allen 25 Switches**
  verfälschtem internem Zustand sind die Ergebnisse **Wort für Wort identisch**
  mit dem Lauf ohne Verfälschung.

{{< fig "noc-chipfail.svg" "Auf dem vollständigen 5 × 5-Gitter in der Simulation durchgespielte Ausfälle." >}}

## Wie wir hierher gekommen sind

| Stufe | Ergebnis |
|---|---|
| Paket-Router, 512 Bit | ~409 MHz out-of-context auf dem VE2302 |
| Stream-Ebene | Obergrenze ~583 MHz out-of-context |
| Erstes Silizium, 2 × 2 | Bestanden bei **250 MHz**, dann **350** und **375 MHz**; einstündige Dauertests mit null Fehlern |
| Ende-zu-Ende-Fehlerkorrektur | Silizium bei **375 MHz**: Selbsttest, injizierte Fehler korrigiert, einstündiger Dauertest, null Fehler |
| Fehlertoleranter Steuerzustand | Silizium bei **285–300 MHz**, mit in jedem Takt verfälschtem internem Zustand: null Fehler |
| Geschützte Stream-Verbindungen | Silizium bei **275 MHz**: Ein toter Pfad oder gekippte Bits kosten keine Daten |
| Geschützte Bridge-Speicher | Silizium bei **275 MHz** |
| Automatisches Umrouten mit Rückkehr | Silizium bei **265 MHz**: kein Wort verloren beim Wechsel auf die Ersatzroute und zurück |
| Breitere Dateneinheiten für den Chip mit 25 Knoten | Silizium bei **265 MHz**, einstündiger Dauertest, null Fehler |
| A1-Plan mit 25 Knoten | Vollständiger Verbindungsplan in der Simulation, 7,73 Tbit/s garantiert |
| **Selbstheilung** | Simulation auf dem Gesamtchip, dann **Silizium bei 255 MHz: 405.522 Ausfälle in ≈ 0,6 µs repariert, keine Daten verloren** |
| **Formale Verifikation** | Selbstheilungslogik eines Switches: neun Sicherheitsregeln gelten für jede Eingabefolge innerhalb der geprüften Tiefe; gehärtete Version unter Fehlerinjektion äquivalent |

Jeder Schritt folgte derselben Regel: **simulieren, aufs Silizium bringen, eine
Stunde laufen lassen, die Zahl veröffentlichen.** Was noch nicht auf unser Board
passt, ist als Simulation gekennzeichnet, nicht als Ergebnis.

## Was das ist und was es noch nicht ist

| | Status |
|---|---|
| Paketebene mit allen Schutzschichten, Stream-Schutz, automatisches Umrouten | **Auf Silizium gemessen** |
| Selbstheilung der Stream-Ebene, 2 × 2-Netz mit einem möglichen Umweg | **Auf Silizium gemessen** |
| Selbstheilungslogik eines Switches, Basis- und gehärtete Version | **Formal verifiziert** innerhalb der geprüften Tiefe (32 / 24 Takte; gehärtete Version 16 Takte unter beliebiger Fehlerinjektion) |
| A1-Netz mit 25 Knoten, zwei gleichzeitige Ausfälle, gehärtete Selbstheilungslogik | Simulation und Synthese |
| Formale Verifikation des gesamten Netzes | Begonnen |
| Strahlungstests | Noch nicht durchgeführt. Die Fehlerinjektion zeigt Toleranz gegenüber den Fehlern, die wir injizieren, nicht mehr. **Es wird keine Strahlungsqualifikation behauptet** |
| ASIC-Implementierung | Teil des Chipprogramms HERCOSS Exxo A1 |

## Nächste Schritte

1. Formale Verifikation des gesamten Netzes: nie eine Schleife, nie Daten ans
   falsche Ziel, immer eine Rückkehr nach Hause (begonnen).
2. Ein größerer Versal-Baustein, um das vollständige Netz mit 25 Knoten und die
   gehärtete Selbstheilungslogik von der Simulation auf Hardware zu bringen.
3. Schnellere Erholung, wenn zwei Switches gleichzeitig ausfallen.
4. Eine Strahlungstestkampagne.

## Im Exxo A1

NOC_512 ist das Rückgrat des [HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/): Es
verbindet die sechzehn RV128IMAC-Kerne, die FPGA-Fabric, die Engines für KI und
Lageregelung, den Speicher und alle I/O. Der kommerzielle A1 kann das Netz mit
leichterem Schutz betreiben; der strahlungsgehärtete A1 nutzt ihn vollständig.

*Alle Werte stammen aus unseren eigenen Läufen. Silizium-Werte stammen von einem
FPGA-Prototyp (AMD Versal VE2302 auf einem Trenz-TE0950-Board), nicht vom
endgültigen Chip.*

Interesse am HERCOSS Exxo A1 oder an NOC_512?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[In Hercoss investieren →](/de/invest/)
