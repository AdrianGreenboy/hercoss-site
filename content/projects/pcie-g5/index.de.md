---
title: "PCIE_G5: PCIe Gen5 für die Raumfahrt, eine Verbindung, die sich selbst repariert"
layout: article
weight: 8
estado: "In Entwicklung · Physical Layer und erster Teil des Link-Trainings laufen auf Silizium, eine Stunde fehlerfrei (27. Nov. 2026)"
hidecover: true
seotitle: "PCIE_G5: europäische PCI-Express-Gen4/Gen5-Controller-IP für die Raumfahrt — Hercoss"
summary: "Hercoss' eigener PCI-Express-Controller für den HERCOSS Exxo A1, von Grund auf in VHDL-2008 geschrieben. Ein Core deckt Gen4 und Gen5 ab, von 1 bis 16 Lanes, in einer kommerziellen und einer strahlungsgehärteten Version aus derselben Quelle, und er ist so ausgelegt, dass die häufigsten Störungen durch Teilchen an Ort und Stelle repariert werden, während die Daten weiterfließen. Am ersten Tag lief er auf echten Transceivern: vier Lanes mit 16 Gbit/s, eine Stunde, null Fehler. Am selben Abend trainierte sich die Verbindung auf dem Board selbst und lief auf zwei Lanes weiter, als eine abgeschaltet wurde."
datos:
  - "Gen4 + Gen5 · 16 / 32 GT/s"
  - "1 bis 16 Lanes"
  - "COTS und Rad-hard aus einer Quelle"
  - "Silizium: 4 × 16 Gbit/s, 1 Stunde, 0 Fehler"
  - "Verbindung trainiert sich auf Silizium selbst"
  - "50 / 50 Simulationsläufe bestanden"
  - "286 MHz auf FPGA, Gen5 braucht ~246"
---

{{< stats >}}
{{< stat "0" "Fehler in einer Stunde auf Silizium: 389.812.475.855 Testwörter bei 4 × 16,0 Gbit/s, jedes korrekt empfangen" >}}
{{< stat "~4 µs" "um eine Störung in einem Empfänger auf Silizium zu reparieren, ohne den Datenmodus zu verlassen; die Standardlösung dauert Millisekunden" >}}
{{< stat "~504 Gbit/s" "Nutzlast pro Richtung durch einen Gen5-x16-Port; drei davon im Exxo A1 geplant" >}}
{{< stat "286 MHz" "auf dem FPGA nach einer Redesign-Runde, über den ~246 MHz, die Gen5 braucht" >}}
{{< /stats >}}

{{< aviso "Patentprüfung läuft" >}}
Die Selbstreparaturfunktionen von PCIE_G5 befinden sich in der Patentprüfung.
Diese Seite zeigt, was sie erreichen sollen und wo sie stehen; wie sie
funktionieren, wird nicht veröffentlicht.
{{< /aviso >}}

## Was es ist

**PCIE_G5 ist Hercoss' eigener PCI-Express-Controller-Core** für den FPGA-SoC
[HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/), von Grund auf in VHDL-2008
geschrieben. Ein Core deckt **Gen4 (16 GT/s) und Gen5 (32 GT/s) ab, von 1 bis
16 Lanes**, und er entsteht in zwei Versionen aus derselben Quelle: einer
kommerziellen (COTS) und einer strahlungsgehärteten für die Raumfahrt. Der Plan
des Exxo A1 sieht **drei PCIe-Gen5-x16-Ports** vor.

Die Entwicklung begann am 27. November 2026. **Am selben Tag** wurden der logische Teil des Physical Layer und seine Transceiver-Schnittstelle geschrieben, bestanden die Simulation **und liefen auf echten Transceivern: vier Lanes mit je 16 Gbit/s auf einem AMD-Versal-Board, eine Stunde mit null Fehlern.** Am selben Abend lief auf demselben Board der erste Teil des Link-Trainings: **Die Verbindung trainiert sich selbst, und wird eine Lane unter Verkehr abgeschaltet, kommt sie auf zwei Lanes zurück.**

{{< fig "pcie-a1.de.svg" "Wo PCIE_G5 im HERCOSS Exxo A1 sitzt: drei Gen5-x16-Ports zwischen dem 512-Bit-Netz des Chips und der Außenwelt. Plan." >}}

## Warum wir unseren eigenen bauen

**Über PCIe spricht ein Chip mit dem Rest des Rechners:** Speicher,
Beschleuniger, Netzwerkkarten und andere Prozessoren. Ein Gen5-x16-Port trägt
etwa **504 Gbit/s Nutzlast pro Richtung.** Für den Rechner eines Raumfahrzeugs
heißt das: Halbleiterspeicher, KI-Beschleuniger und Nutzlastprozessoren mit
voller Geschwindigkeit angebunden.

**Ein eigener Controller verändert Wirtschaftlichkeit und Risiko:**

- **Keine Lizenzgebühr pro Chip.** Jeder ausgelieferte Exxo A1 trägt drei
  dieser Ports, ohne sie erneut zu bezahlen.
- **Volle Kontrolle über die strahlungsgehärtete Version.** Ein zugekaufter
  Controller ist eine Blackbox; unseren können wir dort härten, wo die
  Raumfahrt es verlangt.
- **Eine europäische Quelle** für einen Block, der normalerweise bei einer
  Handvoll IP-Anbieter gekauft wird.

## Eine Verbindung, die sich selbst repariert

Im All kann ein einzelnes Teilchen eine Lane einer Hochgeschwindigkeitsverbindung
aus dem Takt bringen. **Eine Standardverbindung stoppt dann und trainiert neu:**
Alle Lanes verstummen, das Gerät am anderen Ende bemerkt es, und das System
wartet.

**PCIE_G5 ist so ausgelegt, dass die häufigsten dieser Störungen lokal repariert
werden**, auf der getroffenen Lane, **während die Daten auf den anderen Lanes
weiterfließen und ohne dass das Gerät am anderen Ende es bemerkt.** Das ist die Absicht, und **auf Silizium gilt sie bereits für die bisher getesteten Fehler.**

{{< fig "pcie-upset.de.svg" "Die Absicht im Vergleich. Links: Eine Standardverbindung stoppt auf allen Lanes. Rechts: PCIE_G5 repariert die getroffene Lane lokal, während die anderen weiterlaufen, so auf Silizium gemessen. Konzept, nicht maßstäblich." >}}

## Erstes Silizium: eine Stunde, null Fehler

Am 27. November 2026, dem Tag, an dem die Entwicklung begann, lief PCIE_G5 auf
einem Trenz-TE0950-Board mit einem AMD-Versal-Baustein: **vier Lanes mit je
16,0000 Gbit/s (gemessen)**, die Transceiver in interner Schleife.

{{< fig "pcie-hour.de.svg" "Der einstündige Lauf auf Silizium: 389.812.475.855 Testwörter gesendet und genauso viele korrekt empfangen, auf allen vier Lanes." >}}

- **389.812.475.855 Testwörter** in einer Stunde gesendet und genauso viele
  korrekt empfangen. **Null fehlerhaft, null verloren, null Fehler jeder Art
  auf jeder Lane.**
- Etwa **200 Terabit geprüfte Nutzlast bei 55,4 Gbit/s** und 2,3 × 10¹⁴ Bit auf
  der Leitung: eine **Bitfehlerrate unter 1,3 × 10⁻¹⁴** (95 % Konfidenz).
- Der FPGA-Build erfüllte das Timing mit 1,5 ns Reserve bei 125 MHz.

### Dann haben wir absichtlich zugeschlagen

{{< fig "pcie-inject.de.svg" "Auf Silizium injizierte Fehler, während die Verbindung Daten trug. Bei jeder Injektion meldete nur die betroffene Lane etwas; die anderen drei blieben bei null." >}}

| Auf Silizium injizierter Fehler | Ergebnis |
|---|---|
| Ein gekipptes Bit | Erkannt, der richtigen Lane zugeordnet, die Verbindung bleibt bestehen |
| Störung im Descrambler-Zustand eines Empfängers | **Vom Empfänger selbst repariert**; 438 Wörter betroffen (etwa 4 µs); die Verbindung hat den Datenmodus nie verlassen |
| Bit-Slip in der Taktrückgewinnung einer Lane | **Vom Empfänger selbst repariert**; 724 Wörter verloren (etwa 7 µs); die Verbindung hat den Datenmodus nie verlassen |
| Neutraining unter Verkehr | 54 Millionen Wörter, keines fehlerhaft oder verloren |

**Bei jeder Injektion meldete nur die betroffene Lane etwas; die anderen drei
blieben bei null.** Die Standardlösung für die Descrambler-Störung und den
Bit-Slip ist eine Link-Recovery, die Millisekunden dauert. PCIE_G5 hat sie in
Mikrosekunden repariert und die Verbindung im Datenmodus gehalten. Die während
eines Ausfalls getroffenen Wörter sind der einzige Verlust; der Data Link Layer,
der noch nicht geschrieben ist, wird sie erneut senden.

## Link-Training auf Silizium: Die Verbindung trainiert sich selbst

Am selben Abend lief auf demselben Board der erste Teil des
**Link-Training-Zustandsautomaten** auf Silizium. Der Port ist dabei über die
Transceiver mit sich selbst verbunden.

{{< stats >}}
{{< stat "x4" "die Verbindung trainiert sich selbst auf vier Lanes und trägt Daten" >}}
{{< stat "0" "Fehler und 0 Link-Recoveries in einer Stunde auf der trainierten Verbindung: 389.812.506.472 Wörter" >}}
{{< stat "25 ms" "bis zur Rückkehr auf zwei Lanes, nachdem eine Lane unter laufender Verbindung abgeschaltet wurde" >}}
{{< stat "0" "Link-Recoveries, als die beiden Selbstreparaturfälle auf der trainierten Verbindung wiederholt wurden" >}}
{{< /stats >}}

{{< fig "pcie-train.de.svg" "Eine Lane unter laufender Verbindung abgeschaltet: Die Verbindung kommt nach 25 ms mit einer Recovery auf zwei Lanes zurück und kehrt auf vier Lanes zurück, wenn die Lane wieder eingeschaltet wird. Welche Lane als abgeschaltet gezeichnet ist, dient nur der Darstellung." >}}

- **Die Verbindung trainiert sich selbst auf vier Lanes** und trägt Daten.
- **Einstündiger Lauf auf der trainierten Verbindung:** 389.812.506.472
  Testwörter gesendet und genauso viele korrekt empfangen, **null Fehler jeder
  Art und null Link-Recoveries.** 2,3 × 10¹⁴ Bit auf der Leitung: Bitfehlerrate
  unter 1,3 × 10⁻¹⁴ (95 % Konfidenz).
- **Die beiden Selbstreparaturfälle**, auf der trainierten Verbindung
  wiederholt, wurden beide **mit null Link-Recoveries** repariert.
- **Eine Lane unter laufender Verbindung abgeschaltet:** Die Verbindung kam nach
  25 ms auf zwei Lanes zurück, mit einer Recovery und **ohne das Link-Training
  von vorne zu beginnen.** Verkehr auf zwei Lanes: null Fehler bei 27,7 Gbit/s.
- **Lane wieder eingeschaltet** und Verbindung neu gestartet: vier Lanes, null
  Fehler bei 55,4 Gbit/s.

## Auch in der Simulation getestet

{{< stats >}}
{{< stat "50 / 50" "automatisierte Simulationsläufe, alle bestanden, einschließlich des Testdesigns, das auf dem Board läuft" >}}
{{< stat "1–16" "Lanes abgedeckt: 1, 2, 4, 8 und 16, bei 8, 16 und 32 GT/s" >}}
{{< stat "±5000 ppm" "Frequenzversatz zwischen zwei unabhängigen Takten" >}}
{{< stat "128 / 128" "mögliche Bit-Ausrichtungen einer Lane durchlaufen" >}}
{{< /stats >}}

Die Simulationsläufe decken auch Versatz zwischen den Lanes und injizierte
Bitfehler ab, und dieselben drei Fehlerinjektionen bestehen in der Simulation
wie auf Silizium.

## Schnell ab dem ersten Redesign

{{< fig "pcie-timing.de.svg" "Timing auf dem FPGA, 4 Lanes: von 138 MHz in der ersten Version auf 286 MHz nach einer Redesign-Runde, mit weniger Logik. In dieser Architektur braucht Gen5 etwa 246 MHz, Gen4 etwa 123 MHz." >}}

Nach einer Redesign-Runde stieg der Core **von 138 MHz auf 286 MHz** auf
Blockebene (284 MHz mit der Transceiver-Schnittstelle, bei einem Ziel von
250 MHz), und die Logik **schrumpfte von 10,7k auf 8,3k LUTs.** In dieser
Architektur braucht Gen5 etwa 246 MHz und Gen4 etwa 123 MHz; das Timing hat auf
dem FPGA also bereits Raum für Gen5.

## Wo es steht

{{< fig "pcie-status.de.svg" "Jede Schicht von PCIE_G5 und ihr Stand am 27. November 2026." >}}

| Schicht | Stand am 27. Nov. 2026 |
|---|---|
| Physical Layer, logischer Teil (128b/130b-Codierung, 1–16 Lanes, 8 / 16 / 32 GT/s) | Geschrieben, besteht die Simulation |
| Transceiver-Schnittstelle (Bit-Ausrichtung, Taktdomänenübergang, Lane-Deskew) | Geschrieben, besteht die Simulation |
| Timing auf dem FPGA (AMD Versal xcve2302-1LP, 4 Lanes, out-of-context) | 286 MHz für den Teil auf Blockebene, 284 MHz mit der Transceiver-Schnittstelle; Ziel waren 250 MHz |
| Test auf echten Transceivern (TE0950-Board, 4 Lanes × 16,0 Gbit/s, interne Schleife) | **Bestanden**: Selbsttest mit Fehlerinjektion und ein einstündiger Lauf mit null Fehlern |
| Link-Training-Zustandsautomat (LTSSM), erster Teil: Verbindung baut sich selbst auf, Breitenaushandlung, Recovery | **Auf dem Board bestanden**: Selbsttest und ein einstündiger Lauf mit null Fehlern und null Recoveries |
| LTSSM, restlicher Teil: Start mit 2,5 GT/s, Geschwindigkeitswechsel, Equalization | Nicht begonnen |
| Data Link Layer (Replay, Flusssteuerung) | Nicht begonnen |
| Transaction Layer, Konfigurationsraum, Rollen Root Complex / Endpoint | Nicht begonnen |
| Test gegen ein kommerzielles PCIe-Gerät | Späterer Meilenstein, braucht ein anderes Board |

Bisher etwa 2.700 Zeilen VHDL-2008, dazu Testbenches.

## Ehrliche Grenzen

- **Es gibt den Physical Layer und den ersten Teil des Link-Trainings.** Ein
  vollständiger PCIe-Controller braucht außerdem den Rest des Link-Trainings
  (Start mit 2,5 GT/s, Geschwindigkeitswechsel, Equalization), den Data Link
  Layer und den Transaction Layer.
- **Der Board-Test prüft den Core gegen sich selbst**, über die interne
  Schleife der Transceiver: kein Steckverbinder, kein Kabel, kein Gerät eines
  anderen Herstellers. Er beweist den Datenpfad und die
  Selbstreparaturfunktionen auf echten Transceivern; die Kompatibilität mit
  Geräten anderer Hersteller beweist er nicht.
- **Der erste Lauf des Physical Layer nutzte einen kleinen Testsequenzer**,
  um die Verbindung aufzubauen; der Link-Training-Zustandsautomat läuft jetzt
  auf dem Board, aber nur sein erster Teil.
- **Ausgelegt für PCI Express Gen4 / Gen5; Kompatibilitätstests mit
  kommerziellen Geräten sind ein späterer Meilenstein.**
- **Das heute verfügbare Board** (Trenz TE0950) begrenzt den Silizium-Test auf
  vier Lanes und Gen4-Geschwindigkeit. Gen5 und 16 Lanes bleiben in der
  Simulation, bis ein größeres Board verfügbar ist; derselbe Quellcode dient
  beidem.
- **Retimer** im Pfad werden noch nicht unterstützt.

## Roadmap

1. **Erledigt am 27. Nov. 2026, erstes Silizium:** 4 Lanes mit 16 Gbit/s auf dem
   TE0950, Selbsttest und ein einstündiger Lauf mit null Fehlern. Als Nächstes
   auf dem Board: derselbe Test über ein externes Kabel.
2. **Link-Training-Zustandsautomat:** erster Teil erledigt am 27. Nov. 2026
   (Verbindung baut sich selbst auf, Breitenaushandlung, Recovery, auf
   Silizium); als Nächstes Start mit 2,5 GT/s, Geschwindigkeitswechsel und
   Equalization.
3. **Data Link Layer mit strahlungstolerantem Replay.**
4. **Transaction Layer** auf dem 512-Bit-Netz des Chips
   ([NOC_512](/de/projects/noc-512/)), Root Complex und Endpoint in einem Core.
5. **Weitere Strahlungsfunktionen:** eine beschädigte Lane stilllegen, ohne die
   Verbindung zu verlieren, Zustandsüberwachung pro Lane, schnelles
   Wiederverbinden nach einer Störung.
6. **PCI-SIG-Mitgliedschaft und Spezifikation;** Tests gegen kommerzielle Geräte
   auf einem Board mit PCIe-Steckplatz und 100-MHz-Referenztakt.
7. **Gen5 und 16 Lanes auf einem größeren FPGA-Board**, dann das Silizium des
   Exxo A1.

## Teil der Hercoss-IP-Familie

PCIE_G5 ergänzt die [Hercoss-IP-Cores](/de/projects/ip-core-family/), aus denen
der Exxo A1 besteht: den Prozessor [RV128IMAC](/de/projects/rv128imac/), das
selbstheilende Network-on-Chip [NOC_512](/de/projects/noc-512/), den
[1,6-Tbit/s-Ethernet](/de/projects/eth-1t6/)-Core und den selbstheilenden
Speichercontroller [DDRC_72](/de/projects/ddrc-72/). Dieselbe Idee verbindet sie
alle: **ein Chip für die Raumfahrt, der weiterarbeitet, wenn ihn ein Teilchen
trifft**, in Europa und im Haus entwickelt.

Interesse am HERCOSS Exxo A1 oder an PCIE_G5?
[adrian@hercoss.com](mailto:adrian@hercoss.com) ·
[In Hercoss investieren →](/de/invest/)
