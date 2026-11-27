---
title: "Onboard-Intelligenz: NPU, AI Engine und AOCS-Beschleuniger"
layout: article
weight: 4
estado: "NPU und AOCS-Beschleuniger auf FPGA validiert · AI Engine im Design"
hidecover: true
seotitle: "Onboard-KI für Satelliten: NPU, AI Engine und AOCS-Beschleuniger — Hercoss"
summary: "Drei Engines, mit denen ein Raumfahrzeug selbst sehen, denken und steuern kann. Eine NPU, die Bilder in einer Drittel-Millisekunde klassifiziert, eine große AI Engine für schwerere Modelle und ein Beschleuniger für die Lageregelung, der das Regelproblem in Hardware löst. Zwei der drei laufen bereits auf FPGA-Silizium."
datos:
  - "0,333 ms pro Bild"
  - "~3.000 Inferenzen / s"
  - "MPC in Hardware gelöst"
  - "Bitgenau Simulation → Silizium"
---

{{< stats >}}
{{< stat "0,333 ms" "um ein Bild zu klassifizieren, auf FPGA-Silizium gemessen" >}}
{{< stat "~3.000" "Inferenzen pro Sekunde aus einer NPU" >}}
{{< stat "70 × 70" "Regelproblem in Hardware gelöst, in 32-Bit-Gleitkomma" >}}
{{< stat "128×" "mehr Recheneinheiten in der AI Engine des A1 als in der heutigen NPU" >}}
{{< /stats >}}

## Warum das zählt

Ein moderner Satellit erzeugt weit mehr Daten, als er zum Boden senden kann, und
muss oft schneller reagieren, als eine Bodenstation antworten kann. Der Wert
wandert an Bord: **im Orbit entscheiden, nur das Wichtige herunterladen und
steuern, ohne zu warten.**

Dafür braucht es drei verschiedene Arten von Rechenleistung, und der HERCOSS Exxo
A1 bringt alle drei auf denselben Chip wie seine sechzehn Prozessoren:

{{< fig "onboard-ai.svg" "Wahrnehmung, schwere KI und Regelung, von den Sensoren bis zu den Aktoren, auf einem Chip." >}}

## NPU: Wahrnehmung am Edge

**Wofür sie da ist:** Bilder beim Eintreffen ansehen und entscheiden, was sie
zeigen, etwa Wolken, Schiffe, Brände, Schäden oder Anomalien, damit nur nützliche
Daten gespeichert oder gesendet werden.

**Was es heute gibt:** einen INT8-Beschleuniger für faltende neuronale Netze, in
VHDL-2008 um ein systolisches 8 × 8-Array geschrieben. Er führt ein vollständiges
Netz (zwei Faltungsschichten, Pooling, eine vollständig verbundene Schicht und
die abschließende Entscheidung) komplett in Hardware aus. Er holt seine Gewichte
und Bilder selbst aus dem Speicher, sodass der Prozessor ihn nur startet und die
Antwort liest.

| Auf FPGA-Silizium gemessen (AMD Versal VE2302) | Ergebnis |
|---|---|
| Zeit pro Inferenz | **0,333 ms** |
| Durchsatz | **~3.000 Inferenzen pro Sekunde** |
| Korrektheit | Dieselbe Signatur im Python-Modell, in jeder RTL-Schicht, in der AXI-Integration und auf dem Silizium |
| Größe | Etwa ein Drittel der Logik dieses FPGA; DSP-Spalten und fast der gesamte Block-RAM bleiben frei |
| Takt | 87,1 MHz auf dem FPGA, Timing mit positiver Reserve erfüllt |

## AOCS-Beschleuniger: Regelung in Hardware

**Wofür er da ist:** das Raumfahrzeug dorthin ausgerichtet zu halten, wohin es
zeigen muss. Moderne Lage- und Bahnregelung nutzt **modellprädiktive Regelung
(MPC)**: In jedem Regelschritt löst sie ein kleines Optimierungsproblem, das die
Grenzen der Reaktionsräder und Magnettorquer einhält. Diese Lösung ist eine
schwere, sich wiederholende Rechnung mit harter Echtzeitfrist, genau die Art
Arbeit, die in Hardware gehört.

**Was es heute gibt:** einen Beschleuniger, der dieses Problem selbstständig
löst. Der Prozessor schreibt ein paar Zeiger und ein Startbit; der Beschleuniger
lädt das Problem aus dem Speicher, iteriert in 32-Bit-Gleitkomma zur Lösung und
schreibt das Ergebnis zurück, während der Prozessor frei bleibt.

| Auf FPGA-Silizium gemessen (AMD Versal VE2302) | Ergebnis |
|---|---|
| Problemgröße | 70 × 70-Matrix, 32-Bit-Gleitkomma nach IEEE 754 |
| Parallelität | 8 Lanes arbeiten gleichzeitig |
| Korrektheit | Gleitkommaeinheit bitgenau zum Referenzoperator von AMD; identische Signatur von der Simulation bis zum Silizium |
| Größe | ~13 % der Logik, 22 % des Block-RAM, ~40 DSP-Blöcke |
| Timing | Mit +2,8 ns Reserve erfüllt |

## AI Engine: schwere KI für den Exxo A1

**Wofür sie da ist:** größere Modelle, die eine einzelne NPU nicht fassen kann:
größere Faltungsnetze, gepulste neuronale Netze, Transformer und die
Matrizenrechnung hinter Schätzung und Regelung.

**Wo sie steht:** Die AI Engine ist das große Rechen-Array des A1. Ihre
Architektur ist festgelegt, und ihre RTL ist der nächste Schritt: **8 Kacheln
mit je 1.024 Multiply-Accumulate-Einheiten und 512 KiB lokalem Speicher pro
Kachel, etwa 12 TMAC/s beim Zieltakt des A1.** Jede Kachel lässt sich
abschalten, wenn die Mission sie nicht braucht.

{{< fig "mac-scale.svg" "Von der bewiesenen NPU mit 64 MACs zur AI Engine des Exxo A1 mit 8.192 MACs." >}}

Die NPU und der AOCS-Beschleuniger sind ihre bewiesenen Bausteine: dieselben
Designmethoden und dieselbe Verifikation, hochskaliert.

## Gebaut, um Vertrauen zu verdienen

Jede dieser Engines wird auf dieselbe Weise verifiziert:

- **Zuerst ein unabhängiges Referenzmodell,** geschrieben vor der Hardware.
- **Schicht für Schicht,** jede Schicht endet in einer einzigen Signatur, die
  Bit für Bit zum Modell passen muss.
- **Tests, die nachweislich greifen:** Jede Schicht wird absichtlich auf mehrere
  Arten beschädigt, und jeder Fehler muss erkannt werden.
- **Dann echtes Silizium,** wo dieselbe Signatur erneut erscheinen muss.

{{< detalle "Was ist noch zu tun?" >}}
- Die NPU führt ein kompaktes Netz auf kleinen Bildern (16 × 16) aus; größere
  Modelle und Bildgrößen sind der nächste Schritt, und die AI Engine des A1 ist
  der Ort, an dem sie laufen werden.
- Der AOCS-Beschleuniger löst heute das MPC-Problem; ein zweiter Modus für die
  Zustandsschätzung ist für Phase 2 vorgesehen.
- Die AI Engine ist im Design: ihre RTL und die Integration aller drei Engines
  mit den RV128IMAC-Kernen und dem NOC_512-Netz.
- Alle Werte stammen von einem FPGA. Auf dem A1 gelten Takt und Geschwindigkeit
  des Serienknotens.
{{< /detalle >}}

## In Onboard-Intelligenz investieren

Onboard-KI und autonome Regelung sind die Bereiche, in die der Wert eines
modernen Raumfahrzeugs wandert. Der HERCOSS Exxo A1 bringt sie auf denselben
europäischen Chip wie die Prozessoren, die FPGA-Fabric und die
Raumfahrtschnittstellen.
[In Hercoss investieren →](/de/invest/)
