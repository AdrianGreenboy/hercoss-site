---
title: "eFPGA fabric"
weight: 8
estado: "Running on FPGA · GDS ready"
summary: "Hercoss's own programmable logic fabric: the reconfigurable part of the Exxo A1, already running and taken to physical layout."
datos:
  - "Runtime reconfiguration"
  - "IHP SG13G2"
  - "IHP precheck: clean"
  - "Open-source flow"
seotitle: "Embedded FPGA (eFPGA) fabric on IHP SG13G2 130 nm — Hercoss"
---

## What it is

An FPGA is made of thousands of small identical logic cells joined by
programmable wiring. That grid of cells and wires is the **fabric**. An
**eFPGA** ("embedded FPGA") is a fabric designed to be placed inside another
chip rather than sold as a chip of its own.

Hercoss designs its own fabric instead of licensing one. That is what lets the
Exxo A1 include reconfigurable logic without depending on an FPGA vendor.

## What has been achieved

**It runs.** The first version of the fabric, `efpga_v0`, was loaded into a
commercial AMD Versal FPGA and run at 25 MHz. It passed a runtime
reconfiguration self-test over JTAG: the fabric was reprogrammed while
running and behaved correctly each time.

**It has a physical layout.** The same fabric was then taken all the way to
GDS, the file format a foundry manufactures from, in IHP's SG13G2 process, a
130 nm technology made in Germany. The result passes IHP's official precheck
with zero errors: LVS, antenna and timing are clean, and the GDS is ready for
submission.

{{< detalle "Why emulate an FPGA inside another FPGA?" >}}
Fabricating a chip takes months and cannot be undone. Running the fabric
inside a commercial FPGA first proves the logic, the configuration chain and
the software tools on real hardware in days, before any silicon is ordered.
{{< /detalle >}}

{{< detalle "What do LVS, antenna and timing mean?" >}}
They are the checks a layout must pass before a foundry accepts it. **LVS**
confirms the drawn layout matches the intended circuit. **Antenna** rules
protect transistors from damage during manufacturing. **Timing** confirms
signals arrive in time at the target clock speed.
{{< /detalle >}}

{{< detalle "Which tools were used?" >}}
An open-source flow: the FABulous framework generates the fabric and
LibreLane takes it to layout on the open IHP SG13G2 process design kit.
{{< /detalle >}}

## What comes next

A timing model of the fabric as a reusable macro, integration with the
processor, and recovering area in the DSP column.
