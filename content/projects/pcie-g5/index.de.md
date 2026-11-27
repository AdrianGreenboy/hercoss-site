---
title: "PCIE_G5: PCIe Gen5 für die Raumfahrt, eine Verbindung, die sich selbst repariert"
layout: article
weight: 8
estado: "In Entwicklung · Physical Layer in der Simulation, erster Silizium-Test vorbereitet (27. Nov. 2026)"
hidecover: true
seotitle: "PCIE_G5: europäische PCI-Express-Gen4/Gen5-Controller-IP für die Raumfahrt — Hercoss"
summary: "Hercoss' eigener PCI-Express-Controller für den HERCOSS Exxo A1, von Grund auf in VHDL-2008 geschrieben. Ein Core deckt Gen4 und Gen5 ab, von 1 bis 16 Lanes, in einer kommerziellen und einer strahlungsgehärteten Version aus derselben Quelle, und er ist so ausgelegt, dass die häufigsten Störungen durch Teilchen an Ort und Stelle repariert werden, während die Daten weiterfließen."
datos:
  - "Gen4 + Gen5 · 16 / 32 GT/s"
  - "1 bis 16 Lanes"
  - "COTS und Rad-hard aus einer Quelle"
  - "44 / 44 Simulationsläufe bestanden"
  - "286 MHz auf FPGA, Gen5 braucht ~246"
---

{{< stats >}}
{{< stat "~504 Gbit/s" "Nutzlast pro Richtung durch einen Gen5-x16-Port" >}}
{{< stat "3" "Gen5-x16-Ports im HERCOSS Exxo A1 geplant" >}}
{{< stat "44 / 44" "automatisierte Simulationsläufe bestanden: 1 bis 16 Lanes, drei Leitungsraten, injizierte Fehler" >}}
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

Die Entwicklung begann am 27. November 2026. Am ersten Tag wurden der logische
Teil des Physical Layer und seine Transceiver-Schnittstelle geschrieben, beide
bestehen die Simulation, und der erste Test auf echten Transceivern ist
vorbereitet.

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
weiterfließen und ohne dass das Gerät am anderen Ende es bemerkt.** Das ist die
Absicht, und in der Simulation gilt sie bereits für die bisher getesteten
Fälle.

{{< fig "pcie-upset.de.svg" "Die Absicht im Vergleich. Links: Eine Standardverbindung stoppt auf allen Lanes. Rechts: PCIE_G5 repariert die getroffene Lane lokal, während die anderen weiterlaufen. Konzept, nicht maßstäblich." >}}

## Auf die harte Tour getestet

{{< stats >}}
{{< stat "44 / 44" "automatisierte Simulationsläufe, alle bestanden" >}}
{{< stat "1–16" "Lanes abgedeckt: 1, 2, 4, 8 und 16, bei 8, 16 und 32 GT/s" >}}
{{< stat "±5000 ppm" "Frequenzversatz zwischen zwei unabhängigen Takten" >}}
{{< stat "3 / 3" "Arten injizierter Fehler bewältigt, während die Verbindung Daten trägt" >}}
{{< /stats >}}

Die Verifikation deckt auch Versatz zwischen den Lanes und injizierte Bitfehler
ab. Dann haben wir die Verbindung absichtlich gestört, in der Simulation,
während sie Daten trug:

| Injizierter Fehler | Ergebnis in der Simulation |
|---|---|
| Ein gekipptes Bit auf einer Lane | Erkannt und dieser Lane zugeordnet |
| Eine Störung im Zustand des Descramblers im Empfänger | **Vom Empfänger selbst repariert**; keine Seite verlässt den Datenmodus |
| Ein Bit-Slip in der Taktrückgewinnung einer Lane | **Vom Empfänger selbst repariert**; keine Seite verlässt den Datenmodus |

In den beiden Selbstreparaturfällen sind die während des Ausfalls getroffenen
Pakete der einzige Verlust: einige hundert Stromwörter beim Standardintervall,
die der Data Link Layer erneut senden wird.

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
| Test auf echten Transceivern (TE0950-Board, 4 Lanes, 16 Gbit/s, interne Schleife) | Design, Build-Skripte und Board-Werkzeug geschrieben und simuliert; Build und Board-Lauf ausstehend |
| Link-Training-Zustandsautomat (LTSSM), Start mit 2,5 GT/s | Nicht begonnen |
| Data Link Layer (Replay, Flusssteuerung) | Nicht begonnen |
| Transaction Layer, Konfigurationsraum, Rollen Root Complex / Endpoint | Nicht begonnen |
| Test gegen ein kommerzielles PCIe-Gerät | Späterer Meilenstein, braucht ein anderes Board |

Bisher etwa 2.700 Zeilen VHDL-2008, dazu Testbenches.

## Ehrliche Grenzen

- **Es gibt nur den Physical Layer.** Ein vollständiger PCIe-Controller braucht
  die drei übrigen Schichten: Link-Training, Data Link und Transaction.
- **Noch ist nichts auf Hardware gelaufen.** Der erste Board-Test prüft den Core
  gegen sich selbst. Das beweist den Datenpfad und die Selbstreparaturfunktionen
  auf echten Transceivern, aber nicht die Kompatibilität mit Geräten anderer
  Hersteller.
- **Ausgelegt für PCI Express Gen4 / Gen5; Kompatibilitätstests mit
  kommerziellen Geräten sind ein späterer Meilenstein.**
- **Das heute verfügbare Board** (Trenz TE0950) begrenzt den Silizium-Test auf
  vier Lanes und Gen4-Geschwindigkeit. Gen5 und 16 Lanes bleiben in der
  Simulation, bis ein größeres Board verfügbar ist; derselbe Quellcode dient
  beidem.
- **Retimer** im Pfad werden noch nicht unterstützt.

## Roadmap

1. **Erstes Silizium:** 4 Lanes mit 16 Gbit/s auf dem TE0950, Selbsttest und
   ein einstündiger Dauertest.
2. **Link-Training-Zustandsautomat**, einschließlich Aushandlung von
   Geschwindigkeit und Breite.
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
