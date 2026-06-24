---
title: "Photonic Quantum Computers: The \"Light-Speed Network\" Path"
series: "Quantum Computing 101"
week: 4
slug: "quantum-101-part4-photonic"
description: "How photonic quantum computers use particles of light as qubits, and why PsiQuantum, Xanadu, and Quandela represent quantum computing's networking and manufacturing scalability bet."
publishDate: "2026-07-06"
readingTime: "17 min"
tags: ["Quantum Computing 101", "Photonic", "Qubit Technologies", "Technology"]
---

# Quantum Computing 101 — Part 4

## Photonic Quantum Computers: The "Light-Speed Network" Path

> **About this series.** This is an educational resource for readers learning about quantum computing. It is not a recommendation to buy or sell any security. Companies are named as examples of *who builds each approach, and how* — not as investment picks. The section "What to watch when evaluating this approach" explains the metrics specialists use, as a tool for reading the news.

In [Part 3](/learn/quantum-101-part3-neutral-atom) we covered the neutral-atom approach — arranging atoms like a checkerboard with lasers, strong on scaling. This part covers the **photonic approach** — which, as the name suggests, uses **particles of light (photons) as qubits.**

In middle-school terms:
- Superconducting is the cold chip.
- Trapped ion is the precise atom.
- Neutral atom is atoms arranged with tweezers of light.
- **Photonic uses light itself as information.**

The representative companies are **PsiQuantum, Xanadu, and Quandela** — with optical-communications, silicon-photonics, semiconductor-manufacturing, and data-center-network companies connected over the long term.

---

## 1. What Is the Photonic Approach?

A photon is the smallest unit of light. The sunlight we see, lasers, and fiber-optic internet signals all involve photons. A photonic quantum computer uses these particles of light to create quantum information.

By analogy: an ordinary computer moves electrical signals along circuits; a photonic quantum computer moves **light signals along circuits and optical fibers.** It is, in effect, a computer that uses light instead of electrons.

The important point: photons are already the carriers of information in modern communications. The internet backbone, undersea cables, and data-center networks are all deeply tied to optical communication. So the photonic approach is not only a quantum-computer story: **The photonic approach looks at quantum computing and quantum networking at the same time.**

---

## 2. Why Use Light as a Qubit?

The reasons are clear: light is fast, can travel far, can be handled at room temperature, and already fits communication infrastructure. Of course, "light is fast" does not automatically make a quantum computer fast — speed depends on qubit control, error rates, circuit structure, measurement, and error correction. But the photonic approach can have structural strengths in **networking and scalability:**

- Superconducting qubits are like chips inside a cryogenic refrigerator.
- Trapped-ion qubits are like atoms inside vacuum equipment.
- Photonic qubits are like light that can move between optical fibers and chips.

That difference is large. **Photons are moving qubits.**

---

## 3. How Do Photonic Systems Compute?

There are several sub-approaches, but three elements capture the idea:

**1) Make photons** — produce the special quantum-state light a quantum computer uses (single photons or squeezed light).
**2) Manipulate photons** — guide photons along on-chip paths (waveguides) and change their states using beam splitters, phase shifters, and switches.
**3) Measure photons** — detect them at the end with very sensitive detectors; that measurement is the result.

A Nature paper on PsiQuantum's platform presented the core building blocks of the photonic approach as single-photon sources, waveguide-integrated superconducting single-photon detectors, state preparation and measurement, chip-to-chip interconnects, two-photon interference, and two-qubit fusion.

In middle-school terms: **A photonic quantum computer makes particles of light, sends them along light-paths, makes them meet, and counts them precisely at the end.**

---

## 4. The Biggest Strengths of the Photonic Approach

**First, it is strong on networking.** Photons are already used in communication, and optical fiber is infrastructure optimized for sending light far. This means the photonic approach can be favorable long-term for connecting quantum computers, building a quantum internet, and distributed quantum computing. Other approaches must eventually connect systems too — but photons are inherently good at moving. Since future quantum computers may not end at one giant machine but expand like data centers and link into networks, photonics is a natural candidate.

**Second, it can combine with semiconductor manufacturing.** The photonic approach connects to **silicon photonics** — making light-handling chips using semiconductor manufacturing. PsiQuantum pushes this hard: it targets a large-scale fault-tolerant quantum computer using integrated photonic chips and commercial semiconductor processes. Its Omega chipset is fabricated on 300mm silicon wafers at GlobalFoundries' Fab 8 in New York, and the company has integrated Barium Titanate (BTO) — a top-performing electro-optic material — for ultra-high-performance optical switches. The educational point: **the photonic contest is decided not just by lab performance but by manufacturability.**

**Third, room-temperature operation is possible.** Superconducting requires cryogenic cooling; in the photonic approach, photons themselves can move and be manipulated at room temperature. Photonic fault-tolerant architecture work has highlighted room-temperature operation, high clock speeds, miniaturization, and commercial photonic-foundry fabrication as advantages. (Note: this does not mean the *entire* system runs without any cooling — high-performance single-photon detectors may still need cooling — but the approach can depend less on a fully cryogenic system.)

**Fourth, speed and parallelism potential.** Light moves fast and photonic circuits can handle many light signals at once, giving long-term potential for high clock speeds and large-scale parallelism. This is future potential, not a claim that it already dominates every competing approach.

---

## 5. Weaknesses of the Photonic Approach

**First, photons do not interact easily.** This is the biggest problem. A quantum computer needs qubits to affect each other to compute. Superconducting and trapped-ion qubits can be made to interact in specific ways. But photons mostly pass right through each other, so building quantum gates between photons is hard. To solve this, photonic computing uses complex techniques like measurement-based quantum computing, fusion gates, and cluster states. In plain terms: **photons move well but are hard to make "talk" to each other.**

**Second, photon loss is a problem.** Light is fast, but photons can vanish in transit — lost in fiber or on-chip — which can ruin a computation. "Loss" is a critical issue in photonic quantum computing; you must make, send, and detect photons well.

**Third, high-quality single-photon sources and detectors are hard.** Producing exactly one photon at the right moment and measuring it precisely at the end is very difficult. Quandela focuses on single-photon sources and photonic quantum computing precisely because this is a key bottleneck.

**Fourth, universal commercialization is still far off.** Xanadu's Borealis demonstrated photonic quantum computational advantage — but that was advantage on a specific (Gaussian boson) sampling problem. That is not the same as a completed universal fault-tolerant quantum computer. Investors must distinguish a **quantum-advantage demonstration** from a **commercially useful fault-tolerant quantum computer.**

---

## 6. Representative Company 1: PsiQuantum

PsiQuantum is one of the most-watched private companies in the photonic approach, founded in 2015 by a team from the University of Bristol and Imperial College London. Its strategy is unusually clear: **Target a million-qubit fault-tolerant quantum computer from the start.** Rather than selling small machines sequentially, PsiQuantum aims squarely at large-scale fault-tolerant systems.

In September 2025 it raised a **$1 billion Series E at a roughly $7 billion valuation** (led by BlackRock, Temasek, and Baillie Gifford, with NVIDIA's venture arm and others), bringing total funding above $2 billion. It manufactures its Omega photonic chipset on 300mm wafers at GlobalFoundries' Fab 8, was selected for DARPA's US2QC Phase 3, and is building utility-scale sites in Brisbane (with substantial Australian government support) and Chicago.

PsiQuantum's strengths: a clear large-scale target, connection to semiconductor manufacturing, a photonic-chip-based scaling strategy, and a combined view of computing and networking. Its risks: it is still private, product monetization is limited, the target is extremely ambitious (raising failure risk), and a million-qubit approach is capital-intensive.

> **An educational perspective:** **PsiQuantum is the photonic approach's "moonshot manufacturing bet."** The thesis stands or falls on whether semiconductor-scale manufacturing can deliver the billions of components a fault-tolerant photonic machine requires.

---

## 7. Representative Company 2: Xanadu

Xanadu is a Canadian photonic quantum-computing company, famous for **Borealis**, which demonstrated quantum computational advantage on a Gaussian boson sampling problem and is accessible as a public, programmable photonic quantum computer. In January 2025 it unveiled Aurora, a room-temperature system.

Xanadu's other strength is software: **PennyLane**, a well-known framework for quantum machine learning and hybrid quantum-classical workflows, emphasized alongside Catalyst for compiling and optimizing such workflows. Xanadu has also pursued manufacturing partnerships (e.g., thin-film lithium niobate work to reduce waveguide losses) and has signaled a planned public listing via SPAC. Its roadmap targets up to 1,000 logical qubits by 2029, expected at roughly a 100:1 physical-to-logical ratio (around 100,000 physical qubits).

> **An educational perspective:** If PsiQuantum is a manufacturing-centric moonshot, **Xanadu pushes a photonic processor and a developer ecosystem together.** Hardware plus widely used software (PennyLane) is its distinguishing combination.

---

## 8. Representative Company 3: Quandela

Quandela is a France-based photonic quantum-computing company, strong in single-photon sources and photonic quantum computing. It matters because a good photon source is one of the key bottlenecks in the photonic approach — Quandela advances deterministic single-photon sources using quantum dots. It has highlighted hybrid quantum-classical computing, first industrial use cases, error correction, and cybersecurity as important trends — a sign the photonic approach is moving beyond pure research toward industrial application and security.

> **An educational perspective:** **Quandela is an important technical player in the European photonic-quantum ecosystem**, worth watching especially for single-photon sources and use-oriented photonic systems.

---

## 9. Problems the Photonic Approach Suits Well

**Quantum networking** — photons move well, making them natural for connecting quantum computers and building quantum communication networks. As quantum data centers, distributed quantum computing, and a quantum internet grow in importance, the photonic approach becomes more important.

**Security and cryptography** — photons connect well to quantum key distribution (QKD), quantum random numbers, and secure communication. QKD is not the answer to every security problem, but photons are an important physical medium in quantum communication.

**Sampling and special computation** — Xanadu's Borealis showed photonic advantage on a specific sampling problem. This is not a commercial calculation that changes corporate financial models, but it is an important signal of the approach's physical potential.

**Long-term fault-tolerant computing** — PsiQuantum targets exactly this, aiming at large-scale fault-tolerant machines rather than small NISQ devices. If it succeeds, the photonic investment case becomes very large.

---

## 10. What to Watch When Evaluating This Approach

Educational, not investment advice — the metrics specialists examine for photonic systems:

**1. Photon-source quality** — how reliably a photon can be produced at the needed moment.
**2. Photon loss** — how much light vanishes in chips, fibers, switches, and detection.
**3. Detector performance** — how accurately photons are detected.
**4. Fusion-gate / interference performance** — whether photons interact in the way quantum computation requires.
**5. Manufacturability** — whether chips can be produced repeatably at a commercial foundry.
**6. Networking capability** — whether chip-to-chip and system-to-system connections work.
**7. Error-correction roadmap** — whether there is a concrete path to a fault-tolerant machine, not just an experimental device.
**8. Software ecosystem** — whether developers have usable tools (e.g., Xanadu's PennyLane).

---

## 11. Superconducting vs Trapped Ion vs Neutral Atom vs Photonic

| Aspect | Superconducting | Trapped ion | Neutral atom | Photonic |
| --- | --- | --- | --- | --- |
| Qubit material | Artificial circuit | Ion | Neutral atom | Light |
| Manipulation | Cryogenic circuit | Lasers / vacuum | Optical tweezers | Optical circuits / fiber / detectors |
| Strength | Fast gates, big-company ecosystem | Accuracy, connectivity | Large arrays | Networking, manufacturing scalability |
| Weakness | Cryogenics, wiring, errors | Speed, optical complexity | Error-correction proof | Photon loss, hard interaction |
| Representative firms | IBM, Google, Rigetti | IonQ, Quantinuum | Atom, QuEra, Pasqal | PsiQuantum, Xanadu, Quandela |
| Investment access | Listed large-caps / some pure-plays | IonQ direct exposure | Mostly pre-IPO | Mostly pre-IPO |
| Core question | Can errors be reduced? | Can it scale modularly? | Can large arrays be controlled? | Can loss and manufacturing be solved? |

Compressed to one line: **Superconducting is the fast chip; trapped ion is the precise atom; neutral atom is the large grid of atoms; photonic is networkable light.**

---

## 12. Summary

The photonic approach is one of the most distinctive in quantum computing. Where others focus mainly on how to make and manipulate qubits within one device, the photonic approach looks from the start at **mobility, networking, and manufacturing scalability.**

Its strengths are clear: light is fast, travels far, fits optical-communication infrastructure, and could mass-produce if combined with semiconductor manufacturing — which is why PsiQuantum targets a million-qubit fault-tolerant machine from the start. Its weaknesses are equally clear: photons do not interact easily, are loss-sensitive, and high-quality sources and detectors are hard. So the photonic approach is very attractive *and* very difficult.

In one sentence:

> **The photonic approach is quantum computing's "networking and manufacturing scalability" bet. PsiQuantum is a large-scale manufacturing moonshot; Xanadu pairs photonic hardware with a software ecosystem; Quandela represents single-photon technology and the European photonic ecosystem.**

In the next part, we cover the **silicon-spin approach.** Centered on Intel, Diraq, and Quantum Motion, we will look at why silicon spin is called "the quantum computer most similar to existing semiconductor manufacturing."

---

## Sources and References

- Nature, *A manufacturable platform for photonic quantum computing* — single-photon sources, waveguide-integrated detectors, chip-to-chip interconnects, two-qubit fusion. (nature.com)
- PsiQuantum, *Raises $1 Billion (Series E) to Build Million-Qubit Scale Fault-Tolerant Quantum Computers* (September 2025): ~$7B valuation; total funding $2B+; Omega chipset at GlobalFoundries Fab 8 (300mm); BTO integration; Brisbane and Chicago sites; DARPA US2QC Phase 3. (thequantuminsider.com; sacra.com)
- Xanadu — Borealis (Gaussian boson sampling advantage); Aurora room-temperature system; PennyLane / Catalyst; planned SPAC listing; roadmap to ~1,000 logical qubits by 2029. (xanadu.ai; Tom's Hardware)
- Quandela — deterministic single-photon sources via quantum dots; 2026 trends (hybrid, industrial use cases, error correction, cybersecurity). (The Quantum Insider)
- The Quantum Insider, *Overview of Photonic Quantum Computing Companies* (2026).

> **Educational disclaimer.** This material is educational content intended to help readers understand quantum computing technology. It is not investment advice or a recommendation to buy or sell any financial instrument. Technical and financial figures are as of each company's announcement or filing date and are subject to change. Investment decisions are the reader's own responsibility; consult a qualified professional where appropriate.

*Brutal Edge — Frameworks over forecasts. Signal over noise.*
