---
title: "IP core family"
weight: 6
estado: "Validated on FPGA · Under review"
summary: "A library of reusable hardware blocks written in VHDL-2008: processors, network links, space buses and post-quantum cryptography. They become the peripherals of the Exxo A1."
datos:
  - "VHDL-2008"
  - "Simulation + real hardware"
  - "Space buses"
  - "Post-quantum crypto"
---

## What an IP core is

Chips are not designed from a blank page each time. They are assembled from
**IP cores**: self-contained, reusable hardware blocks, each doing one job,
such as an Ethernet port or a processor. Hercoss maintains its own family, so
the Exxo A1 can be built from blocks the company fully understands and
controls.

## The catalogue

Filter by category. Every core is marked as validated on FPGA or still in
development.

{{< cores >}}

{{< detalle "How is a core validated?" >}}
In layers. A regression suite runs each core in simulation against reference
models written in software, and the outputs are compared automatically. Then
the core is built into an FPGA and the same checks are repeated on real
hardware. "Validated on FPGA" on this page means the second step passed.
{{< /detalle >}}

{{< detalle "What does 'under review' mean?" >}}
The whole family is being audited and corrected so that every core is ready
to be integrated into the chip. Improved versions are published as they are
finished.
{{< /detalle >}}

## Source code

Source code is available to partners on request. Hercoss on GitHub:
[github.com/AdrianGreenboy](https://github.com/AdrianGreenboy).
