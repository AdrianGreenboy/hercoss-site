---
title: "HF und Signalverarbeitung, auf dem Weg zum Exxo A1-RF"
layout: article
weight: 5
estado: "HF-Frontend-IP auf FPGA validiert · A1-RF in Entwicklung"
hidecover: true
seotitle: "Digitale HF-Frontend-IP (DDC/DUC) und der HERCOSS Exxo A1-RF — Hercoss"
summary: "Die Funk-IP von Hercoss: ein vollständiges digitales Frontend, das Funksignale in Hardware abstimmt, filtert und bewegt, auf FPGA-Silizium validiert, dazu die digitale Kette eines hochauflösenden ADC. Auf dieser Basis entwickelt Hercoss den HERCOSS Exxo A1-RF: den A1 mit einem Funk-Frontend auf demselben Chip."
datos:
  - "Empfang + Senden in einem Core"
  - "Bitgenau in 6 Domänen"
  - "ADC-Kette bis 18,9 Bit"
  - "A1-RF in Entwicklung"
---

{{< stats >}}
{{< stat "DDC + DUC" "Empfangs- und Sendekette in einem Core, auf FPGA-Silizium validiert" >}}
{{< stat "6 / 6" "Domänen mit demselben bitgenauen Ergebnis, vom Python-Modell bis zum Board" >}}
{{< stat "18,9" "effektive Bits der ADC-Dezimationskette in der höchsten Einstellung" >}}
{{< stat "A1-RF" "die nächste Variante des Exxo A1, mit Funk auf dem Chip" >}}
{{< /stats >}}

## Warum Funk zählt

Jeder Satellit ist ein Funkgerät: Telemetrie nach unten, Befehle nach oben,
Datenverbindungen, Verbindungen zwischen Satelliten, Navigation,
Spektrumsüberwachung. Erledigt rekonfigurierbare digitale Hardware die
Funkarbeit (**Software-Defined Radio**), kann ein Raumfahrzeug nach dem Start
Frequenz, Wellenform oder Mission wechseln, indem neue Logik statt neuer
Hardware hochgeladen wird.

## Digitales HF-Frontend, auf FPGA validiert

Der Core zwischen den Datenwandlern und dem Prozessor. Er erledigt die beiden
Aufgaben, die jedes Funkgerät bei voller Abtastrate dominieren:

- **Empfang (Abwärtsmischung):** das Signal ins Basisband verschieben, die
  Abtastrate senken, es mit einem Filter säubern und seinen Pegel stabil
  halten, während die Signalstärke gemeldet wird.
- **Senden (Aufwärtsmischung):** das Spiegelbild, vom Basisband hinauf zum
  Träger.

{{< fig "rf-chain.svg" "Empfangs- und Sendekette des digitalen HF-Frontends von Hercoss." >}}

| Was | Ergebnis |
|---|---|
| Ketten | Vollständiger Empfang (DDC) und Sendung (DUC) in einem Core |
| Signalformat | Komplexes I/Q, 16-Bit-Festkomma |
| Abstimmung | Numerisch gesteuerter 32-Bit-Oszillator |
| Ratenwechsel | Dezimation und Interpolation um 4, 8, 16 oder 32 |
| Filter | FIR mit 16 Taps, Koeffizienten per Software geladen, auf DSP-Blöcke abgebildet |
| Pegelregelung | Automatische Verstärkungsregelung mit Rücklesen der Signalstärke |
| Datenpfad | Ein eigener AXI4-Master schreibt die Samples direkt in den Speicher |
| Korrektheit | Dasselbe bitgenaue Ergebnis in sechs Domänen: Python-Modell, zwei VHDL-Testbenches, ARM-C-Code und zwei unabhängige Auslesungen aus dem Silizium |

## Hochauflösende ADC-Kette, auf FPGA validiert

Die digitale Hälfte eines Sigma-Delta-Analog-Digital-Wandlers: das Filter, das
einen schnellen 1-Bit-Strom in hochauflösende Samples verwandelt. Aus diesem
digitalen Filter stammt die Auflösung tatsächlich.

- **Effektive Auflösung von etwa 16,4 Bit** bei einem Überabtastverhältnis von
  128 und **etwa 18,9 Bit** bei 256.
- Samples werden im On-Chip-Speicher gepuffert und per DMA in den Hauptspeicher
  übertragen, mit Interrupts für den Prozessor.
- Dasselbe Ergebnis auf Silizium wie in allen fünf Simulationsebenen.

Im Exxo A1 wird diese Kette zur Basis der **zehn 24-Bit-Sigma-Delta-ADCs** für
Sensoren und Telemetrie.

{{< detalle "Wie wurde das ohne analoges Frontend getestet?" >}}
Am Testboard sind keine Funkwandler mit dem FPGA verbunden. Beide Cores tragen
deshalb eine Testquelle auf dem Chip: einen programmierbaren Tongenerator für das
HF-Frontend und einen digitalen Sigma-Delta-Modulator für die ADC-Kette. Damit
ist jeder Test auf Silizium deterministisch und selbstprüfend. Die Ports für ein
echtes analoges Frontend sind bereits vorhanden; echte Wandler anzuschließen ist
der nächste Schritt.
{{< /detalle >}}

## Der HERCOSS Exxo A1-RF, in Entwicklung

Hercoss entwickelt eine **Funkvariante des Exxo A1**: dieselben sechzehn
128-Bit-Prozessoren, dieselbe FPGA-Fabric und dasselbe Network-on-Chip, dazu ein
Funk-Frontend auf demselben Chip. Ein Baustein vom Antennensignal bis zur
Entscheidung.

{{< fig "a1-rf.svg" "Konzept des Exxo A1-RF. Das digitale Frontend ist bewiesen; die analogen Teile müssen noch entworfen werden." >}}

**Zielanwendungen:**

- **Softwaredefinierte Satelliten-Nutzlasten**, die sich im Orbit umwidmen
  lassen.
- **Telemetrie, Telekommando und Daten-Downlinks** auf demselben Chip, der das
  Raumfahrzeug betreibt.
- **Verbindungen zwischen Satelliten** für Konstellationen.
- **Spektrumsüberwachung** und Signalaufklärung.

**Stand, ehrlich gesagt:** Das digitale Frontend und die ADC-Kette sind auf FPGA
bewiesen. Das HF-Frontend und die schnellen Datenwandler müssen noch entworfen
werden, und die Spezifikation des A1-RF wird gerade festgelegt. Partner für HF-
und Mixed-Signal-Design sind willkommen.

## In Funk auf einem Chip investieren

Funk ist die eine Funktion, die jedes Raumfahrzeug hat. Sie auf denselben
europäischen Chip wie die Prozessoren und die FPGA-Fabric zu bringen, bedeutet
weniger Bauteile, weniger Masse und eine Nutzlast, die nach dem Start ihre
Mission wechseln kann.
[In Hercoss investieren →](/de/invest/) ·
[adrian@hercoss.com](mailto:adrian@hercoss.com)
