---
title: "Silicon Spin Quantum Computers: The \"Semiconductor Path\" to Quantum Scale"
series: "Quantum Computing 101"
week: 5
slug: "quantum-101-part5-silicon-spin"
description: "How silicon-spin quantum computers use electron spin in quantum dots — the approach most similar to existing semiconductor manufacturing — and what Intel, Diraq, and Quantum Motion are building."
publishDate: "2026-07-13"
readingTime: "18 min"
tags: ["Quantum Computing 101", "Silicon Spin", "Semiconductor", "Qubit Technologies", "Technology"]
---

# Quantum Computing 101 — Part 5

## Silicon Spin Quantum Computers: The "Semiconductor Path" to Quantum Scale

> **About this series.** This is an educational resource for readers learning about quantum computing. It is not a recommendation to buy or sell any security. Companies are named as examples of *who builds each approach, and how* — not as investment picks. The section "What to watch when evaluating this approach" explains the metrics specialists use, as a tool for reading the news.

In [Part 4](/learn/quantum-101-part4-photonic) we covered the photonic approach — using light as qubits, strong on networking and manufacturing scalability. This part covers the **silicon-spin approach.** It matters a great deal because, as the name suggests, it is the quantum-computing approach most similar to the existing semiconductor industry.

In one middle-school sentence: **The silicon-spin approach traps a single electron on a chip made of material like ordinary semiconductors, and uses that electron's "spin direction" as a qubit.**

Representative companies and institutions include **Intel, Diraq, Quantum Motion, UNSW Sydney, imec, and CEA-Leti.** There are not many listed pure-plays yet, but long-term this is the approach most strongly tied to semiconductor manufacturing capability.

---

## 1. What Is the Silicon-Spin Approach?

First, "spin." An electron is a tiny particle carrying electric charge and also a quantum property called **spin.** It is not literally a small ball spinning, but at a middle-school level you can think of it as **a tiny compass needle inside the electron.** If the needle points up it is 0, if down it is 1 — and in the quantum world it can hold both possibilities at once. That state is the qubit.

The silicon-spin approach traps an electron in a tiny space inside a silicon chip, called a **quantum dot.** By analogy: electron = a tiny ball; quantum dot = a small room holding the ball; spin = a tiny compass inside the ball; qubit = an information unit using that compass direction.

So a silicon-spin quantum computer is **a computer that makes many tiny rooms on a silicon chip and uses the electron spin in each room as a qubit.**

---

## 2. Why Does Silicon Matter?

Silicon is the base material of the modern semiconductor industry. Smartphones, laptops, servers, AI chips, and automotive chips are mostly silicon-based, and humanity has spent decades learning to make silicon chips at huge scale — smaller, cheaper, and more precisely.

So the biggest advantage of the silicon-spin approach is this: **A quantum computer might be made using methods similar to existing semiconductor processes.**

Diraq says it builds quantum computers based on modified silicon transistors, aiming long-term to integrate millions of qubits on a single silicon chip. Quantum Motion emphasizes that its silicon-spin architecture is based on the same silicon technology used in phones and computers, leveraging existing global foundries and supply chains for mass production.

The educational point: for a quantum computer to become a real industry, lab success is not enough — repeatable production, yield, process stability, supply chains, and cost structure matter. The silicon-spin approach has the strongest investment story precisely on this point.

---

## 3. Core Strengths of the Silicon-Spin Approach

**First, it fits semiconductor processes best.** Superconducting also uses chips, but silicon spin connects more directly to existing CMOS processes. Intel's Tunnel Falls chip contained a 12-quantum-dot spin-qubit array fabricated on a 300mm semiconductor line, using technology close to EUV lithography and high-volume manufacturing. Intel described Tunnel Falls as its most advanced silicon-spin-qubit chip and a step toward a full-stack commercial quantum computing system.

Why does this matter? 300mm wafers, EUV, CMOS, foundries — these are exactly the words that matter when moving a quantum computer from "lab equipment" to "industrial product." Silicon spin is the most direct demonstration of **the semiconductorization of quantum computing.**

**Second, qubits can be made very small.** Silicon-spin qubits can be very small because they trap a single electron in a small quantum dot. Superconducting qubits are relatively large; trapped ions need atom-control equipment; neutral atoms need optical arrays; photonics needs optical circuits and detectors. Silicon spin can, in theory, be integrated at very high density — **potentially far more qubits in the same chip area.** This is why "millions of qubits" is discussed (though no million-qubit machine exists yet; it is a structural direction).

**Third, integration with control electronics is possible.** A quantum computer needs not just qubits but electronics to control them — and as qubit counts grow, control wiring and electronics become enormously complex. The long-term appeal of silicon spin is integrating qubits and control electronics within the same semiconductor ecosystem. A 2024 CMOS-compatibility review emphasized semiconductor spin qubits as a strong candidate for large-scale fault-tolerant computing precisely because of their connection to CMOS VLSI principles. In investor terms: **bringing the quantum chip and control chip closer can cut large-system cost and complexity.**

**Fourth, it can connect to existing foundry ecosystems.** Diraq signed a Letter of Intent with the U.S. Department of Commerce for up to **$38 million** in proposed CHIPS Act funding to scale domestic silicon-spin quantum processors, partnering with GlobalFoundries on cryo-CMOS capabilities. This trend matters: the silicon-spin approach is increasingly moving from the language of **quantum research** to the language of **quantum manufacturing.**

---

## 4. Weaknesses of the Silicon-Spin Approach

**First, being so small makes control hard.** Small qubits are an advantage and a disadvantage. You must precisely control the spin of a single electron — and tiny voltage changes, noise, defects, and nearby atomic nuclei can all affect the computation. In plain terms: **putting a tiny compass in a tiny room and rotating it precisely is hard.**

**Second, cryogenics is still required.** Silicon spin also needs very low temperatures to maintain quantum states — dilution refrigerators and cryogenic equipment play an important role, as in superconducting. So "it's silicon, so it runs at room temperature like an ordinary computer" is *not* true. **Silicon spin's manufacturing resembles ordinary semiconductors, but its operating environment is still demanding, like any quantum computer.**

**Third, large-scale connection and error correction are still being proven.** Silicon-spin qubits may be small and manufacturing-friendly, but actually connecting many qubits and implementing error correction is still an open problem. There is a large gap between two-qubit, 12-qubit, and tens-of-qubits results and a million-qubit fault-tolerant system. A 2021 study reported single- and two-qubit control fidelities above 99% on a silicon two-qubit processor — an important advance, but still far from a large commercial machine. Investors must remember: **looking manufacturable is very different from a large-scale fault-tolerant computer already being possible.**

---

## 5. Representative Company 1: Intel

Intel is the most important large semiconductor company in the silicon-spin approach. Its strengths are clear: semiconductor-manufacturing experience, 300mm process capability, advanced manufacturing (EUV), research-institution collaboration, and large-scale chip-design and packaging experience. Intel provided Tunnel Falls — a 12-qubit silicon-spin chip — to the research community to advance silicon-spin-qubit research, describing it as a step toward a long-term full-stack commercial quantum computing system.

> **An educational perspective:** Intel is not a quantum pure-play — its stock moves mostly on CPUs, data centers, foundry, AI chips, and manufacturing competitiveness. But long-term, if the silicon-spin approach wins, Intel's manufacturing experience could be a strategic asset. In one line: **Intel is silicon spin's "semiconductor-manufacturing bet."**

---

## 6. Representative Company 2: Diraq

Diraq is one of the most important pure technology companies in the silicon-spin approach. A spinout from UNSW Sydney (founder Andrew Dzurak led the team that built the first silicon quantum logic gate in 2015), it develops quantum computing using modified silicon transistors, with a vision of integrating millions of qubits on a single silicon chip using existing CMOS processes — targeting physical-qubit costs below $1.

In 2026 it signed a $38 million CHIPS Act Letter of Intent with the U.S. Department of Commerce to scale domestic silicon-spin processors, was shortlisted for Stage B of DARPA's Quantum Benchmarking Initiative (one of a small group to advance), and has partnerships with imec, GlobalFoundries, NVIDIA, and Dell. It has raised over $150 million including government funding. Its roadmap targets a first commercial quantum computer by 2029 and a million qubits on a single chip by 2031.

> **An educational perspective:** Diraq is not a listed company. For U.S. investors, it is a name to track through CHIPS Act, DARPA, foundry collaborations, and strategic investors rather than direct investment. In one line: **Diraq is silicon spin's "CMOS-native pure technology bet."**

---

## 7. Representative Company 3: Quantum Motion

Quantum Motion is a UK-based silicon quantum-computing company. It says its architecture is based on the same silicon technology used in phones and computers, leveraging existing global foundries and supply chains. In 2025 it was reported to have installed a full-stack quantum computer based on standard silicon CMOS chip technology at the UK's National Quantum Computing Centre — a system in three 19-inch server racks, compatible with existing frameworks like Qiskit and Cirq (though public reporting noted that performance metrics such as qubit count, gate fidelity, and coherence time were not yet fully disclosed). It has also been reported to have raised a $160 million Series C to advance its silicon-based platform toward commercial deployment.

> **An educational perspective:** Quantum Motion matters because it shows whether silicon spin can take a genuinely data-center-friendly form. In one line: **Quantum Motion is silicon spin's "data-center integration bet."**

---

## 8. Other Important Players

**UNSW Sydney** — a core research institution in silicon-spin quantum research; Diraq's technical roots trace here, with reported chip performance near 99% accuracy even in production-like environments.

**imec** (Belgium) — a world-class semiconductor research institute, important for bringing quantum chips into the real semiconductor manufacturing ecosystem.

**CEA-Leti** (France) — an important European institute in silicon/CMOS-based quantum research.

**SemiQon** (Finland) — a European startup developing silicon-based quantum processors, showing the ecosystem extends across the US, UK, Australia, and Europe.

---

## 9. Problems the Silicon-Spin Approach Suits Well

Silicon spin is less about a specific application and more **a manufacturing platform for building a large-scale fault-tolerant quantum computer.** Rather than "this problem is best solved by silicon spin today," it is better seen as applying long-term to problems needing a universal quantum computer — drug discovery, battery and materials research, financial risk modeling, optimization, cryptanalysis, and AI-plus-quantum simulation.

But the real investment point is not the application area; it is this question: **Can a large-scale quantum chip be built by combining with existing semiconductor processes?** If the answer is "yes," the silicon-spin approach could take a very large place in the quantum-computing industry.

---

## 10. What to Watch When Evaluating This Approach

Educational, not investment advice — the metrics specialists examine for silicon-spin systems:

**1. CMOS compatibility** — how well it actually fits existing semiconductor processes.
**2. Wafer size and manufacturing line** — 300mm wafers, EUV, proximity to high-volume manufacturing.
**3. Qubit count** — how many spin qubits or quantum-dot arrays are stably operated.
**4. Gate fidelity** — single- and two-qubit gate accuracy.
**5. Readout fidelity** — how accurately electron-spin states can be read.
**6. Cryogenic control** — how control electronics integrate in a cryogenic environment.
**7. Tile architecture** — whether small qubit tiles can be repeated into a large system.
**8. Error-correction roadmap** — how well it fits codes like the surface code.
**9. Foundry partnership** — connection to Intel, GlobalFoundries, imec, CEA-Leti, or TSMC-class ecosystems.
**10. Public performance data** — whether qubit count, fidelity, and coherence time are transparently disclosed.

---

## 11. Comparison with the Approaches So Far

| Aspect | Superconducting | Trapped ion | Neutral atom | Photonic | Silicon spin |
| --- | --- | --- | --- | --- | --- |
| Qubit material | Artificial circuit | Ion | Neutral atom | Light | Electron spin |
| Key equipment | Cryogenic chip | Lasers / vacuum | Optical tweezers | Optical circuits / detectors | Silicon chip / cryogenic control |
| Strength | Fast gates | Accuracy, connectivity | Qubit arrays | Networking | Semiconductor manufacturing compatibility |
| Weakness | Wiring, errors | Speed, scaling | Error correction | Photon loss | Control, connection, cryogenics |
| Representative firms | IBM, Google, Rigetti | IonQ, Quantinuum | Atom, QuEra, Pasqal | PsiQuantum, Xanadu | Intel, Diraq, Quantum Motion |
| Investment access | Large-caps / pure-plays | IonQ direct | Mostly pre-IPO | Mostly pre-IPO | Mostly pre-IPO / some large-caps |
| Core question | Can errors be reduced? | Can it scale modularly? | Can large arrays be controlled? | Can loss be reduced? | Can it be made like semiconductors? |

Compressed to one line: **Superconducting is the fast chip; trapped ion is the precise atom; neutral atom is the large grid of atoms; photonic is networkable light; silicon spin is the quantum chip most like a semiconductor fab.**

---

## 12. Summary

The silicon-spin approach has one of the most realistic manufacturing stories in quantum computing. The core question is simple: **Can what the existing semiconductor industry already does well be applied to quantum computers too?**

If so, silicon spin becomes a very strong long-term candidate — if the silicon ecosystem that made smartphones and AI chips can also make quantum chips, it could greatly reduce the cost, supply-chain, and scaling problems of quantum computers.

But large problems remain: stably controlling a single electron's spin, connecting many qubits, integrating cryogenic control electronics, and proving error correction. The key companies are **Intel, Diraq, and Quantum Motion.** Intel is the large semiconductor-manufacturing bet; Diraq is the CMOS-native silicon-spin pure technology bet; Quantum Motion is the data-center-friendly silicon quantum-system bet.

In one sentence:

> **The silicon-spin approach is quantum computing's "semiconductor path." It may not be the flashiest approach, but if quantum computing ultimately becomes a mass-production industry, this is a core candidate to track to the end.**

In the next part, we cover **topological quantum computing.** Centered on Microsoft's Majorana approach, we will look at why it is called "the most elegant path if it works, but the hardest to prove."

---

## Sources and References

- Intel — *Tunnel Falls* 12-qubit silicon-spin chip on a 300mm line; step toward a full-stack commercial system. (newsroom.intel.com)
- Diraq — modified-silicon-transistor approach; $38M CHIPS Act Letter of Intent (May 2026); DARPA QBI Stage B; partnerships with imec, GlobalFoundries, NVIDIA, Dell; $150M+ raised; roadmap to first commercial machine 2029, million qubits on a chip by 2031, sub-$1 per physical qubit. (diraq.com; thequantuminsider.com; NIST)
- Quantum Motion — standard silicon-CMOS full-stack system at the UK NQCC (three server racks; Qiskit/Cirq compatible); $160M Series C. (quantummotion.com; thequantuminsider.com)
- CMOS-compatibility review (2024) — semiconductor spin qubits as a strong candidate for large-scale fault-tolerant computing. (arXiv 2409.03993)
- Silicon two-qubit processor — single- and two-qubit control fidelities above 99% (2021). (arXiv 2111.11937)

> **Educational disclaimer.** This material is educational content intended to help readers understand quantum computing technology. It is not investment advice or a recommendation to buy or sell any financial instrument. Technical and financial figures are as of each company's announcement or filing date and are subject to change. Investment decisions are the reader's own responsibility; consult a qualified professional where appropriate.

*Brutal Edge — Frameworks over forecasts. Signal over noise.*
