---
title: "RV128IMAC: der Kern des Exxo A1"
layout: rv128
weight: 2
estado: "Läuft auf FPGA-Silizium · Prozessorkern des HERCOSS Exxo A1"
seotitle: "RV128IMAC: 128-Bit-RISC-V-Prozessorkern für Raumfahrt-Computing — Hercoss"
summary: "128-Bit-RISC-V, von Grund auf in Europa gebaut. Ein Kern läuft als 128-Bit-CPU, als 64-Bit-CPU oder als zwei 64-Bit-CPUs; ein Linux-Programm ruft in 1,35 µs eine Funktion auf einer anderen CPU auf und hasht mit SHA-3 in Hardware mit 129 MB/s, etwa 140× Software, ohne Treiber. Er ist der Prozessor im Herzen des HERCOSS Exxo A1."
datos:
  - "128-Bit-RISC-V"
  - "SHA-3 mit 129 MB/s, ohne Treiber"
  - "CPU-zu-CPU-Aufruf in 1,35 µs"
  - "Linux 6.6 SMP"
  - "214 / 214 auf Silizium"
  - "Ring: 64 Threads"
---

{{< stats >}}
{{< stat "129 MB/s" "SHA3-256 aus einem gewöhnlichen Linux-Prozess, ohne Treiber" >}}
{{< stat "×143" "schneller als derselbe Algorithmus in Software auf derselben CPU" >}}
{{< stat "1,35 µs" "ein Linux-Programm ruft eine Funktion auf einer anderen CPU auf, ~5× schneller als ein leerer Systemaufruf" >}}
{{< stat "214 / 214" "selbstprüfende Programme bestehen auf Silizium" >}}
{{< /stats >}}

{{< aviso "Patentverfahren läuft" >}}
Der Kern-Ring und die Innovationen auf dieser Seite befinden sich im
Patentverfahren. Diese Seite zeigt, was sie erreichen und warum sie zählen; wie
sie intern funktionieren, wird veröffentlicht, sobald das Verfahren es erlaubt.
{{< /aviso >}}

## Was es ist

RV128IMAC ist ein RISC-V-Prozessorkern, den Hercoss von Grund auf in VHDL
entworfen und geschrieben hat. Er ist ein **128-Bit**-Prozessor, doppelt so breit
wie die 64-Bit-Prozessoren heutiger Computer und Telefone, und er ist der für den
**HERCOSS Exxo A1** gewählte Prozessor: Der CPU-Cluster des Chips besteht aus
sechzehn dieser Kerne.

Was ihn unterscheidet, ist nicht nur die Breite:

- **Kerne rufen sich direkt gegenseitig auf.** Ein gewöhnliches Linux-Programm
  führt eine Funktion auf einem anderen Prozessor aus und erhält die Antwort in
  1,35 µs, ohne Treiber und ohne Umweg über das Betriebssystem.
- **Ein eigener Kern-Ring.** Kerne und Beschleuniger teilen sich einen eigenen
  Ring, inzwischen für 64 Hardware-Threads skaliert und fair unter Volllast.
- **Hardware-Beschleuniger ohne Treiber.** Der erste, eine SHA-3-/SHAKE-Engine,
  bedient einen Linux-Prozess mit 129 MB/s, etwa 140× derselbe Algorithmus in
  Software auf derselben CPU.
- **Ein Kern, drei Persönlichkeiten:** 128-Bit-CPU, 64-Bit-CPU oder zwei
  64-Bit-CPUs.

Alles auf dieser Seite läuft auf einem funktionierenden FPGA-Prototyp: zwei CPUs
auf einem AMD-Versal-Board mit 60 MHz, unter Linux. **Vom ersten Linux-Boot bis
zu einem treiberlosen Hardware-SHA-3, das 140× schneller als Software läuft: zwei
Wochen, alles auf echtem Silizium.**

## Der HERCOSS-Kern-Ring: ein Ring für Aufrufe {#the-hercoss-core-fabric-a-ring-built-for-calls}

Die meisten Mehrkernchips verbinden ihre Kerne über gemeinsamen Speicher: Ein
Kern schreibt, der andere fragt ab oder erhält einen Interrupt, und das
Betriebssystem sitzt dazwischen. **Der HERCOSS-Kern-Ring ist anders. Kerne und
Hardware-Beschleuniger sprechen direkt miteinander, in Hardware, mit
Befehlsgeschwindigkeit**, über einen eigenen Ring.

{{< fig "ring-vs-memory.svg" "Einen anderen Kern um Arbeit bitten: der übliche Weg über Speicher und Betriebssystem im Vergleich zum HERCOSS-Kern-Ring." >}}

{{< fig "ring-concept.svg" "Der HERCOSS-Kern-Ring für den Exxo A1: sechzehn Kerne und ihre Beschleuniger auf einem Ring; Speicher und I/O laufen getrennt über NOC_512. Konzept, nicht maßstäblich." >}}

### Warum ein Ring

Ring-Verbindungen sind einfach, sparsam an Leitungen und lassen sich bei hohen
Takten leicht schließen, genau das, was ein strahlungstoleranter Chip mit 16
Kernen braucht. Bleiben Nachrichten auf ihrem eigenen Ring und der
Speicherverkehr auf dem separaten Netz [NOC_512](/de/projects/noc-512/), wartet
ein Aufruf zwischen Kernen nie hinter einem Speichertransfer.

### Warum er neu ist

Neu ist nicht "ein Ring". **Neu ist, was darauf unterwegs ist:**

- **Funktionsaufrufe, Beschleuniger-Anfragen und ihre Antworten, alle gleich
  behandelt.** Software ruft die SHA-3-Engine genauso auf wie einen anderen
  Prozessor. Die Beschleuniger von morgen stecken am selben Ring, und die
  Software ändert sich nicht.
- **Aus gewöhnlicher Software mit einzelnen Befehlen erreichbar:** kein Treiber,
  kein Postfach im Speicher, kein Interrupt.
- **Robust gegen abstürzende Programme:** Eine Antwort kann nie den falschen
  Prozess erreichen.
- **Fair durch Konstruktion unter Volllast.** Unsere Stresstests haben gezeigt,
  dass ein herkömmlicher Ring eine Station unbegrenzt warten lassen kann, wenn
  ihre Nachbarn beschäftigt sind. Der HERCOSS-Ring **garantiert jedem Kern und
  jedem Beschleuniger seinen Zug**, egal wie ausgelastet der Ring ist. Die
  Simulation bestätigt das, und es ist jetzt Teil der A1-Architektur.

{{< fig "ring-fair.svg" "In unseren eigenen Stresstests gefunden und auf Architekturebene behoben, vor dem ersten Wafer." >}}

### Skalierung auf den A1: 64 Threads, 16 Stationen

{{< stats >}}
{{< stat "64" "adressierbare Hardware-Threads: viermal die 16 Kerne des A1" >}}
{{< stat "16" "Stationen auf einem Ring bis zur Sättigung belastet (Simulation)" >}}
{{< stat "0" "Nachrichten verloren, doppelt oder vertauscht" >}}
{{< stat "5 / 5" "absichtlich defekte Ring-Designs von unseren Tests erkannt" >}}
{{< /stats >}}

- **Gleiches Silizium, mehr Raum.** Der Ring wurde umgebaut, um bis zu 64
  Hardware-Threads zu adressieren, und der neue Build fiel etwa **2.900
  Logikzellen kleiner** aus als der vorherige, bei weiterhin mit Reserve
  erfülltem Timing.
- **Jedes bestehende Programm läuft unverändert.** Binärdateien, die auf dem
  früheren Ring mit 8 Threads liefen, mussten nicht neu kompiliert werden.
- **Ein Ring mit 16 Stationen in voller Länge unter Maximallast.** Zwei echte
  Prozessorkerne laufen Befehl für Befehl gegen ein unabhängiges Referenzmodell,
  während 14 Verkehrsstationen den Ring um sie herum sättigen. Sie absolvieren
  eine vollständige SHA-3-Testsuite und einen Hashing-Benchmark über 64 KiB mit
  **null Abweichungen**, und keine einzige Nachricht geht verloren, wird
  verdoppelt oder vertauscht.
- **Der Prüfer wird geprüft.** Fünf absichtlich defekte Versionen der
  Ring-Hardware wurden gebaut: eine verlorene Bestätigung, eine verworfene
  Nachricht, ein falscher Absender, eine akzeptierte veraltete Antwort, ein
  einzelnes gekipptes Bit. **Die Testbench erkennt alle fünf, jede aus dem
  richtigen Grund.**

{{< detalle "Was kostet der Ring bei ungünstigster Last?" >}}
Auf einem Ring, den jede Verkehrsstation mit maximaler Rate sättigt, was keine
reale Last tut, ist die Hashing-Schleife 2,1× langsamer als auf einem freien Ring
(7,4 gegenüber 3,5 Takten pro 8 Byte). Jeder Station ihren Zug zu garantieren,
kostet bei Sättigung auch etwas Spitzendurchsatz. Wir veröffentlichen diese
Worst-Case-Zahlen, weil sie die Daten sind, nach denen der Interconnect des A1
dimensioniert wird, und wir messen den Kompromiss auf Silizium, bevor wir die
Balance wählen.

Der Build mit 64 Threads hat Synthese und Timing-Closure bestanden (125,1 Tsd.
Logikzellen, 83 % des Bausteins, +0,33 ns Reserve über einer
Sicherheitsmarge von 1,0 ns), ist aber noch nicht auf dem Board gelaufen. Die
Ergebnisse mit 16 Stationen sind in der Simulation verifiziert.
{{< /detalle >}}

## Ein Kern, drei Persönlichkeiten

Derselbe Kern lässt sich auf drei Arten konfigurieren. Wählen Sie eine aus, um sie
zu sehen.

{{< modes >}}

## Eine andere CPU mit Hardware-Geschwindigkeit aufrufen

In einem Mehrkernchip heißt Arbeit auf einem anderen Prozessor erledigen zu
lassen normalerweise, über das Betriebssystem zu gehen: ein Systemaufruf, ein
Treiber, gemeinsamer Speicher und ein Interrupt. Jeder Schritt kostet Zeit, und
zusammen dauern sie Mikrosekunden bis zehn Mikrosekunden und mehr.

Der RV128IMAC ergänzt **XCALL**, eine Hercoss-Erweiterung von RISC-V. Ein
gewöhnliches Linux-Programm bittet eine andere CPU, eine Funktion auszuführen,
und erhält die Antwort zurück, ohne Treiber dazwischen. Das Betriebssystem
entscheidet nur, welche Programme das dürfen.

{{< fig "xcall-latency.svg" "Ein vollständiger Aufruf einer anderen CPU und zurück, 1.352 ns, gegenüber einem leeren Systemaufruf, der nichts tut, 6.590 ns." >}}

{{< detalle "Was genau wird verglichen?" >}}
Beide Zahlen stammen aus demselben Linux-Prozess auf derselben CPU des
FPGA-Prototyps bei 60 MHz. Der Systemaufruf ist `getppid()`, einer der
günstigsten Aufrufe, die Linux hat; der XCALL ist ein vollständiger Hin- und
Rückweg, der eine Funktion auf der zweiten CPU ausführt und ihr Ergebnis
zurückgibt. In der RTL-Simulation dauert der Hardware-Teil des Aufrufs 26 Takte.
Der Vergleich gilt den beiden Mechanismen auf diesem Kern, er ist keine Aussage
gegenüber Produkten anderer Hersteller.
{{< /detalle >}}

## Parallel arbeiten, ohne zu warten

Aufrufe können auch **asynchron** sein: Ein Programm startet mehrere Aufrufe,
arbeitet weiter und holt die Antworten später in beliebiger Reihenfolge ab. Beide
CPUs rechnen gleichzeitig, und die Gesamtzeit nähert sich dem Ideal.

{{< fig "xcall-async.svg" "Zwei große Fakultäten, eine auf jeder CPU. Gemeinsam ausgeführt, sind sie in der Zeit der längeren fertig." >}}

## Robust durch Design

Ein Satellit kann nicht jedes Mal neu gestartet werden, wenn sich ein Programm
falsch verhält, daher sind die Aufrufe darauf ausgelegt, Fehler zu überstehen:

- Ein Programm, das mit noch laufenden Aufrufen abstürzt oder hängt, wird vom
  Betriebssystem aufgeräumt; die andere CPU ist nicht betroffen.
- Eine Antwort kann nie das falsche Programm erreichen. Das erzwingt die
  Hardware, nicht eine Software-Konvention.
- Programme können mit Timeout warten, einen Aufruf abbrechen oder beim Warten
  schlafen, damit ihre CPU für andere Arbeit frei ist.

## Beschleuniger ohne Treiber: SHA-3 in Hardware

SHA-3 und SHAKE sind die Grundlage der neuen Standards für
Post-Quanten-Kryptografie, ML-KEM (FIPS 203) und ML-DSA (FIPS 204). Für einen
Raumfahrtchip mit zehn Jahren Lebensdauer ist es ein starkes Argument, sie in
Hardware und aus gewöhnlicher Software erreichbar zu haben.

Auf den meisten Chips bedeutet ein Beschleuniger einen Kernel-Treiber,
speicherabgebildete Register, DMA, Interrupts und gemeinsame Puffer:
Mikrosekunden pro Anfrage und viel Software. Auf dem RV128IMAC nutzt ein
gewöhnlicher Linux-Prozess die SHA-3-Engine **direkt, ohne Treiber**.

{{< stats >}}
{{< stat "129 MB/s" "SHA3-256 aus einem Linux-Prozess (1 MiB)" >}}
{{< stat "140 MB/s" "auf Bare Metal" >}}
{{< stat "8,2 µs" "für eine kurze 64-Byte-Nachricht, gegenüber 143 µs in Software (×17)" >}}
{{< stat "~8.000" "LUTs für die gesamte Engine" >}}
{{< /stats >}}

Die Engine deckt SHA3-224, -256, -384, -512 und SHAKE128 / 256 ab, eine Runde
Keccak-f[1600] pro Takt.

### Von 33 auf 129 MB/s in fünf Tagen

Jeder Schritt wurde auf Silizium validiert, bevor der nächste begann.

{{< fig "sha3-journey.svg" "SHA3-256 aus einem Linux-Prozess auf demselben Board bei denselben 60 MHz. Jeder Balken auf Silizium gemessen." >}}

| Schritt | Datum | Was sich geändert hat | Linux SHA3-256, 1 MiB | gegenüber Software |
|---|---|---|---|---|
| P9 | 21. Nov. | SHA-3-Engine läuft auf Silizium, aus Linux ohne Treiber genutzt | 33 MB/s | ×54 |
| P9b | 22. Nov. | Nur Software | 53–60 MB/s | – |
| P10 | 22. Nov. | Ein neuer Befehl im Kern | 74,5 MB/s | ×94 |
| P11 | 23. Nov. | Der Daten-Cache lernt, die nächste Zeile vorab zu holen | 97,7 MB/s | ×150 |
| P12 | 24. Nov. | Timing-Neuentwurf im Befehlsabruf: gleiche Geschwindigkeit, weit mehr Reserve, weniger Gatter | 99,8 MB/s | ×153 |
| P13b | 25. Nov. | Verbesserungen an Pipeline und Befehlsabruf | **129,0 MB/s** | ×143 |

Das Verhältnis sank aus gutem Grund von ×153 auf ×143: Dieselbe Verbesserung
machte auch die *Software*-Version 1,39× schneller. Deshalb messen wir den
Fortschritt in MB/s und Takten, nicht im Verhältnis.

## Gemessen, nicht angenommen

Der Kern trägt eigene Hardware-Leistungszähler, und jede Optimierung beginnt mit
einer Messung, wohin die Takte gehen, nicht mit einer Vermutung.

{{< fig "sha3-cycles.svg" "Kosten jedes 8-Byte-Schritts des Hashs auf Bare Metal: von 7,31 auf 3,44 Takte, alles auf Silizium gemessen." >}}

- **Die Messung hat die Arbeit umgelenkt.** Die Zähler zeigten, dass der Weg
  zwischen Kern und Engine fast nichts kostet. Damit wurde aus "einer größeren
  Warteschlange", die nicht geholfen hätte, ein neuer Befehl (+25 %) und ein
  Prefetch im Daten-Cache (+30 %).
- **Wir korrigieren uns öffentlich.** Eine frühere Messung schrieb etwa zwei
  Takte pro Schritt dem Warten der Pipeline auf ältere Befehle zu. Dieses Warten
  zu entfernen brachte weniger als vorhergesagt. Genaueres Hinsehen zeigte, dass
  die meisten dieser Takte woanders herkamen: Die Befehlsabruf-Warteschlange lief
  bei bestimmten Code-Ausrichtungen leer. Dieselbe Schleife brauchte 5,15 oder
  3,28 Takte pro Schritt, nur abhängig davon, wo sie im Speicher lag. Die
  Korrektur macht die Ausrichtung bedeutungslos und beschleunigt jeden kompakten
  Code: Auf Silizium lief das Software-SHA-3 in C damit 1,39× schneller und der
  Hardware-Pfad 1,29× schneller.
- **Schneller, ohne Timing-Reserve zu verbrauchen.** Der Prefetch-Schritt ließ
  fast keine Timing-Reserve übrig (+0,010 ns). Der nächste Schritt gestaltete
  den kritischen Pfad neu und gewann +0,556 ns mit 1.300 LUTs weniger bei
  identischer Leistung. Die Reserve von heute macht die nächsten Funktionen
  möglich.

{{< detalle "Wohin gehen die restlichen Takte?" >}}
Die Zähler zeigen bereits die nächsten Schritte. Von den 3,44 Takten pro
8-Byte-Schritt entfallen etwa 1,9 auf die Befehle selbst, etwa 0,9 auf das Warten
auf den Daten-Cache und etwa 0,66 auf das Warten, bis Daten an die Engine
übergeben sind. Zwei weitere Optimierungen sind identifiziert; jede wird auf
Silizium gemessen, bevor sie berichtet wird.
{{< /detalle >}}

## Ein 128-Bit-Koprozessor, der sich lohnt

Manche Aufgaben brauchen Zahlen weit jenseits von 64 Bit: Kryptografie, exakte
Arithmetik, hochpräzise Navigationsrechnung. Mit 128-Bit-Wörtern verarbeitet jeder
Schritt doppelt so viele Bits.

{{< fig "bignum-128.svg" "Berechnung von 1000! (eine Zahl mit 2568 Stellen): derselbe Algorithmus, 64-Bit-Wörter gegenüber 128-Bit-Wörtern." >}}

Die zweite CPU führt außerdem eine native 128-Bit-Programmierumgebung aus. Neue
Dienste lassen sich darauf definieren, **während Linux weiterläuft**, und Linux
kann sie sofort aufrufen, ohne Neubau und ohne Neustart.

## Ergebnisse auf dem FPGA-Prototyp

| Was | Ergebnis |
|---|---|
| SHA3-256 aus einem Linux-Prozess, ohne Treiber (1 MiB) | **129,0 MB/s** gegenüber 0,90 MB/s in Software auf derselben CPU: ×143 (×123–×153 je nach Boot und Bitstream) |
| SHA3-256, Bare Metal | 140 MB/s (3,44 Takte pro 8 Byte) |
| Kurze Nachricht (64-Byte-Hash) | 8,2 µs in Hardware gegenüber 143 µs in Software (×17) |
| Aufruf einer anderen CPU und zurück (XCALL) | **1,35 µs** (1.352 ns) |
| Leerer Linux-Systemaufruf, zum Vergleich | 6,59 µs (6.590 ns) |
| Großzahl-Arithmetik 128 Bit gegenüber 64 Bit (1000!) | 1,63× schneller |
| Zwei Berechnungen parallel über asynchrone Aufrufe | 1,60× (ideal 1,61×) |
| Linux 6.6 SMP auf zwei Hardware-Threads eines Kerns | 20 / 20 aufeinanderfolgende Boots, plus 20 / 20 SMP-Stressläufe auf dem neuesten Bitstream |
| Board-Testsuite | 214 / 214 selbstprüfende Programme (RV128, RV64, FreeRTOS, Zephyr, RTEMS, CoreMark, Forth) |
| CoreMark 1.0 (64-Bit-Modus) | 1,85 CoreMark/MHz (auf dem neuesten Bitstream noch nicht erneut gemessen) |
| Neuestes Design (p13b): 2 CPUs + SHA-3-Engine | 128,0 Tsd. LUTs (85 % des VE2302); Timing erfüllt mit 1,0 ns Sicherheitsmarge plus +0,444 ns Reserve |

{{< detalle "Wo liegen die Grenzen dieser Zahlen?" >}}
Sie stammen von einem FPGA-Prototyp mit 60 MHz auf einem AMD Versal AI Edge
VE2302. Ein gefertigter Chip wird einen anderen Takt, eine andere Leistung und
eine andere Fläche haben; diese Werte sind noch nicht bekannt, und die absoluten
MB/s werden sich auf dem A1 ändern. Das ×143 (×153 auf einem früheren Bitstream)
vergleicht mit dem Software-Algorithmus auf derselben In-Order-CPU mit 60 MHz,
nicht mit Produkten anderer Hersteller oder Desktop-Prozessoren. Die
Software-Referenz schwankt zwischen Boots je nach Speicherplatzierung um bis zu
etwa 20 %, daher ist die Beschleunigung ein Bereich, und jeder Gewinn wird
innerhalb eines Laufs verglichen.

Der 128-Bit-Befehlssatz basiert auf dem RV128I-Entwurf der RISC-V-Spezifikation,
der kein ratifizierter Standard ist. XCALL und die Beschleuniger-Schnittstelle
sind Hercoss-Erweiterungen, nicht Teil von RISC-V. Für 128-Bit-RISC-V gibt es
nirgends einen C-Compiler, daher wird 128-Bit-Code mit Hercoss' eigenen
Werkzeugen geschrieben; Linux und die Echtzeitbetriebssysteme laufen im
standardkonformen 64-Bit-Modus. Unter Linux hat die SHA-3-Engine einen Kontext,
daher wird der Hashing-Prozess an einen Kern gebunden. Die vollständige Suite
mit 214 Programmen lief zuletzt auf einem früheren Bitstream; spätere bestanden
die Stresstests für SHA-3, Aufrufe und SMP.
{{< /detalle >}}

## Verifiziert wie ein Produkt

Jede Hardwareänderung wird **Befehl für Befehl** gegen unabhängige Referenzmodelle
(128-Bit-, 64-Bit-, Mehrkern- und Beschleuniger-Versionen) in einer Regression mit
mehr als zwanzig Ebenen geprüft. Jeder Unterschied in einem Ergebnis, einem
Speicherschreibzugriff oder einer Exception stoppt den Test. Dazu kommt:

- **Linux 6.6 bootet identisch** in Hardware und Modell, vom Boot-ROM bis zum
  ersten Anwenderprogramm.
- **FreeRTOS, Zephyr und RTEMS** laufen in der Co-Simulation.
- **Zufällige Speicherverzögerungen** werden eingespeist, um Timing-Fehler
  aufzudecken.
- **Drei unabhängige Implementierungen stimmen überein:** Der auf dem Board
  berechnete SHA-3-Digest über 1 MiB ist Byte für Byte identisch mit dem auf einem
  PC berechneten und mit den offiziellen FIPS-202-Vektoren.
- **Die Tests sind getestet:** Ein gekipptes Bit in einer Konstante des
  Algorithmus erzeugt 570 Fehler.

Dann laufen dieselben Programme auf dem Board, jedes mit eigenem Urteil bestanden
/ nicht bestanden.

{{< detalle "Wurden vor dem Silizium echte Fehler gefunden?" >}}
Ja. Ein Flutungstest, der die Engine an ihre Grenze treibt, zeigte, dass eine
interne Eingangswarteschlange übergelaufen wäre: Sie brauchte 47 Einträge und
hatte 32. Früher erkannte der Prozess einen Reset während eines
Speichertransfers, der das Board aufhängen konnte, einen Interrupt, der an die
falsche Privilegstufe ging, und eine subtile Verletzung der Spezifikation, durch
die Linux nur gelegentlich hängen blieb. Jeder Fehler wurde behoben, und für jeden
gibt es jetzt einen Test, der ihn wieder erkennen würde.
{{< /detalle >}}

## Die Architektur in Kürze

| | |
|---|---|
| Befehlssatz | 128-Bit-RISC-V (auf Basis des RV128I-Entwurfs) und RV64IMAC, beim Reset gewählt; komprimierte Befehle; Hercoss-Erweiterungen für Aufrufe und Beschleuniger; Hardware-Leistungszähler |
| System | M/S/U-Privilegien, virtueller Speicher Sv39 mit Page-Table-Walker in Hardware; OpenSBI + Linux 6.6 SMP; FreeRTOS, Zephyr, RTEMS |
| Pipeline | 5 Stufen, In-Order; Sprungvorhersage; schneller Multiplizierer; Befehls- und Daten-Cache mit Prefetch der nächsten Datenzeile; 128-Bit-AXI4 |
| Caches | Prototyp: 16 KiB + 16 KiB; Plan des Exxo A1: 64 KiB Befehle, 32 KiB Daten |
| Dual-Modus | Zwei 64-Bit-Hardware-Threads auf einem 128-Bit-Datenpfad |
| SHA-3-Engine | Keccak-f[1600], eine Runde pro Takt; alle SHA-3- und SHAKE-Varianten; ~8.000 LUTs |

## Fortschritt im November 2026

| Datum | Meilenstein |
|---|---|
| Anfang November | 128-Bit-Kern von Grund auf, erste Programme auf dem FPGA |
| 10. Nov. | Linux bootet auf dem Kern |
| 11. Nov. | Schnellerer Kern: Sprungvorhersage, schneller Multiplizierer, 60 MHz, CoreMark 1,85 / MHz |
| 19. Nov. | Linux SMP auf zwei Hardware-Threads eines Kerns |
| 20. Nov. | Zwei CPUs; erster XCALL aus einem Linux-Programm; asynchrone Aufrufe |
| 21. Nov. | Robuste Aufrufe, Live-Dienste, Leistungszähler, sicherer Bus-Reset |
| 21. Nov. | **SHA-3 in Hardware aus Linux ohne Treiber: 33 MB/s** |
| 22. Nov. | Neuer Befehl: 74,5 MB/s |
| 23. Nov. | Prefetch im Daten-Cache: 97,7 MB/s, ×150 |
| 24. Nov. | Timing-Neuentwurf: 99,8 MB/s, ×153, mehr Reserve mit weniger Gattern |
| 25. Nov. | Verbesserungen an Pipeline und Befehlsabruf: **129 MB/s**; kompiliertes C bis zu 1,39× schneller |
| 25. Nov. | Kern-Ring für 64 Hardware-Threads umgebaut: neuer Build 2.900 Logikzellen kleiner, Timing erfüllt |
| 26. Nov. | **Ring mit 16 Stationen unter Volllast in der Simulation**: echte Kerne, null Abweichungen, jede Station kommt garantiert an die Reihe |

## Als Nächstes: der Ring mit 16 Stationen auf echtem Silizium

Der Exxo A1 setzt **sechzehn RV128IMAC-Kerne** mit ihren Beschleunigern auf den
Kern-Ring, rund um das Netz [NOC_512](/de/projects/noc-512/), das Speicher und
I/O trägt. Die nächsten Schritte:

1. **Der Ring in voller Länge auf dem FPGA-Board:** eine echte CPU, der
   SHA-3-Beschleuniger und 15 selbstprüfende Verkehrsstationen, mit
   Hardware-Geschwindigkeit. Aufruflatenz und Beschleuniger-Bandbreite unter
   Last, dazu stundenlange Dauertests mit Prüfung jeder Nachricht.
2. **Fairness gegen Rohdurchsatz abstimmen**, mit echten Messungen.
3. **Ein Ring oder zwei für den A1**, entschieden anhand dieser
   Silizium-Messungen, bevor die Chiparchitektur eingefroren wird.

{{< fig "a1-cluster.svg" "Geplanter Prozessorcluster des HERCOSS Exxo A1. Konzeptdiagramm; nicht maßstäblich." >}}

{{< detalle "Was muss noch geschehen, bevor der A1 diesen Kern nutzt?" >}}
Der Prototyp hat zwei CPUs auf Silizium; der Ring mit 16 Stationen ist in der
Simulation verifiziert, und sein Lauf auf Silizium folgt als Nächstes. Die für den
A1 geplanten Funktionen zur Strahlungshärtung und die größeren Caches müssen
noch ergänzt werden. Und der Kern wurde bisher nur für FPGA gebaut: Der Chip-Flow
(Speichermakros, Testlogik, Timing und Fläche auf Silizium) kommt als Nächstes.
{{< /detalle >}}

*Prototyp auf AMD Versal mit 60 MHz. Werte auf Silizium gemessen, sofern nicht
anders angegeben. Patentverfahren läuft.*

Fragen, Zusammenarbeit oder Investition:
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[In Hercoss investieren →](/de/invest/)
