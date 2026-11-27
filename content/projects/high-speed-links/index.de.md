---
title: "Hochgeschwindigkeitsverbindungen"
layout: article
weight: 10
estado: "Auf FPGA validiert · Weg zu 1.6TbE"
summary: "Hercoss' eigene SerDes-, Ethernet-PCS- und MAC-Cores, auf echter Hardware bewiesen: eine 103-Gbit/s-Verbindung mit einstündigem Dauertest bei null Fehlern und ein 40G-Ethernet-Port, der mit einer kommerziellen Netzwerkkarte spricht. Dieselbe IP führt zum 1.6TbE und den ~2 Tbit/s Ethernet des Exxo A1."
datos:
  - "103 Gbit/s, 0 Fehler in 1 h"
  - "40GbE gegen kommerzielle NIC"
  - "Ping 5 / 5 von einem PC"
  - "Vollständige AXI4-Registerbänke"
seotitle: "Ethernet-MAC-, PCS- und SerDes-IP-Cores, Weg zu 1.6TbE — Hercoss"
---

## Was sie sind

Große Datenmengen zwischen Chips zu bewegen heißt, Bits nacheinander über wenige
Leitungen mit sehr hoher Geschwindigkeit zu senden. Drei Schichten erledigen
diese Arbeit: Der **SerDes** sendet den rohen Bitstrom, die **PCS** (Physical
Coding Sublayer) macht daraus einen sauberen, ausgerichteten Datenstrom, und der
**MAC** macht daraus Ethernet-Frames. Hercoss entwickelt jede digitale Schicht
selbst.

{{< fig "ethernet-stack.svg" "Jede digitale Schicht ist Hercoss-IP. Auf dem FPGA stammt der analoge Transceiver von AMD; für den Exxo A1 muss er noch entworfen oder lizenziert werden." >}}

## Geschwindigkeiten: bewiesen und geplant

{{< fig "link-speeds.svg" "Durchgezogen: auf FPGA-Hardware gemessen. Gestrichelt: Designziele für den vollständigen SerDes-Core und den Exxo A1." >}}

## SERDES_256G v1.0: eine 103-Gbit/s-Verbindung

Eine mehrspurige serielle Verbindung mit Hercoss' eigener 64B/66B-Leitungscodierung,
ausgelegt für acht Lanes mit 32 Gbit/s (256 Gbit/s insgesamt).

- **Auf FPGA gemessen:** vier Lanes mit 25,78 Gbit/s, der höchsten Rate, die die
  Transceiver des Boards zulassen: eine **103-Gbit/s**-Leitung.
- **Einstündiger Dauertest mit null Fehlern** bei dieser Rate. Läuft auch mit
  4 × 10,3 Gbit/s.
- **Version 1.0** ergänzt eine vollständige AXI4-Registerbank (auf Hardware
  validiert), AXI-Stream-Breitenadapter und 64-Bit-Fehler- und Frame-Zähler.
- **Offen:** ein Test über ein externes Kabel statt interner Schleife und die
  vollen 8 × 32 Gbit/s auf einem größeren Board.

## 40G-Ethernet: PCS_40G + MAC_40G

Ein vollständiger 40GBASE-R-Ethernet-Port, in drei Schritten gebaut und gegen
eine kommerzielle Netzwerkkarte (eine Mellanox ConnectX-3 Pro) über ein 3 m
langes Kupferkabel getestet:

1. **PCS in Schleife:** vier Lanes mit 10,3125 Gbit/s, null Fehler.
2. **Link-up mit der Netzwerkkarte:** Der Link kommt hoch und alle vier Lanes
   richten sich aus; die Karte zählt jeden Test-Frame.
3. **MAC und Frames:** Frame Check Sequence, UDP-Generator und -Prüfer in
   Hardware, ein Empfangspfad mit Adressfilter und PAUSE-Flusssteuerung.

Was die aktuelle Version (v0.3) auf Hardware leistet:

- **Der PC pingt das Board an** und erhält 5 von 5 Antworten.
- **PAUSE-Frames werden befolgt.**
- **Fehlerhafte Frames werden erkannt:** Ein Testmodus sendet Frames mit falscher
  Prüfsumme, und sowohl das Board als auch die Netzwerkkarte verwerfen sie.
- **Einstündiger Dauertest gegen die Netzwerkkarte mit null Fehlern**, und die
  Frame-Zähler stimmen auf beiden Seiten exakt überein.

**In Arbeit (v0.4):** ein Empfangs-Supervisor, der eine Lane automatisch erneut
versucht, die nach einem Transceiver-Reset gelegentlich nicht einrastet.

## 25G-Ethernet und präzise Zeit

- **PCS_25G + MAC_25G:** ein 25G-Ethernet-Port mit 64B/66B-Encoder nach
  Clause 49, auf FPGA validiert.
- **PTP / IEEE 802.1AS:** Zeitstempel in Hardware zur Synchronisation von Uhren
  über ein Netz, auf FPGA validiert. Im Exxo A1 erhält damit jeder Ethernet-Port
  eine gemeinsame Zeitbasis.

## Wohin das führt: der Exxo A1

Dieselbe digitale IP skaliert auf den Transceiver-Pool des
[HERCOSS Exxo A1](/de/projects/hercoss-exxo-a1/): 72 Lanes mit bis zu **~2 Tbit/s
Ethernet gleichzeitig**, ein **1.6TbE**-Port auf acht PAM4-Lanes mit 224 Gbit/s,
weitere 400G auf Lanes mit 32 Gbit/s und drei PCIe-Gen5-x16-Verbindungen.

Der 1,6-Tbit/s-Controller ist bereits unterwegs: [ETH_1T6](/de/projects/eth-1t6/)
ist ein vollständiger Link-Layer, MAC, PCS, RS(544,514)-Fehlerkorrektur und
Lane-Ausrichtung, und läuft auf dem FPGA-Board in skalierter Konfiguration: 312
Milliarden Frames in einer Stunde mit null Fehlern, Fehlerbursts bei voller
Geschwindigkeit repariert und bitgenau zu den IEEE-802.3-Referenzvektoren für
200G, 400G und 800G. Noch offen: die analogen Transceiver selbst, die auf dem
FPGA von AMD stammen und für den A1 entworfen oder lizenziert werden müssen.

{{< detalle "Was ist 64B/66B-Codierung?" >}}
Ein Empfänger kann den Takt nur aus einem Signal zurückgewinnen, das sich oft
genug ändert. 64B/66B fügt je 64 Datenbits zwei Markierungsbits hinzu und
verwürfelt den Rest. Das garantiert diese Wechsel bei nur etwa 3 % zusätzlicher
Bandbreite.
{{< /detalle >}}

{{< detalle "Was ist ein Dauertest (Soak-Test)?" >}}
Die Verbindung lange ununterbrochen betreiben und dabei jeden Fehler zählen. Eine
Verbindung, die ein paar Sekunden funktioniert, kann trotzdem einmal pro Stunde
ausfallen; erst der Dauertest zeigt, dass sie stabil ist.
{{< /detalle >}}

{{< detalle "Warum gegen eine kommerzielle Netzwerkkarte testen?" >}}
Ein Core, der nur mit sich selbst spricht, kann auf beiden Seiten denselben
Fehler enthalten, und die beiden heben sich auf. Die Zusammenarbeit mit Hardware
eines anderen Herstellers beweist, dass der Core dem Standard folgt.
{{< /detalle >}}

{{< detalle "Was ist ein Near-End-PMA-Loopback?" >}}
Der Transceiver schickt seinen Ausgang im Chip direkt zurück in seinen eigenen
Empfänger. Das testet den gesamten digitalen Pfad bei voller Geschwindigkeit
ohne Kabel; der nächste Schritt ist ein externes Kabel oder ein zweites Gerät.
{{< /detalle >}}
