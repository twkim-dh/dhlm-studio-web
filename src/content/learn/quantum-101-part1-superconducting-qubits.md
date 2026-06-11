---
title: "Superconducting Qubits: The Semiconductor Path to Quantum Computing"
series: "Quantum Computing 101"
week: 1
slug: "quantum-101-part1-superconducting-qubits"
description: "Quantum computing is not one technology — several approaches compete to define the future. This part explains superconducting qubits: how IBM and Google bet on them, why cryogenic cooling is both strength and limitation, and the one metric that matters more than any qubit headline."
publishDate: "2026-06-15"
readingTime: "18 min"
tags: ["Quantum Computing 101", "Superconducting Qubits", "IBM", "Google", "Rigetti", "Quantum Basics", "Technology"]
---

# Quantum Computing 101 — Part 1
## Superconducting Qubits: The "Semiconductor Path" to Quantum Computing

> **About this series.** This is an educational resource for readers learning about quantum computing for the first time. It is not a recommendation to buy or sell any security. Companies are named because they are useful examples of *who is actually building each approach, and how* — not as investment picks. The section near the end, "What to watch when evaluating this approach," is not investment advice. It explains the metrics that specialists actually look at when judging whether a quantum technology is real — a tool for reading the news, not a buy signal.


When you first start studying quantum computing, one thing tends to cause the most confusion:

**Quantum computing looks like a single technology, but in reality several different approaches are competing with one another.**

Just as a single smartphone contains different technologies — an OLED display, a system-on-chip, a battery, a communications chip — quantum computing has several distinct paths. The main ones are **superconducting**, **trapped ion**, **neutral atom**, **photonic**, **silicon spin**, and **topological**.

This series explains each approach simply enough for a middle-school student to follow, while still going deep enough to reach the core of the technology. At the end of each part, we summarize what you should actually look at to understand that approach properly.

Today we start with the first: the **superconducting approach**.


## 1. What Is the Superconducting Approach?

Put simply, a superconducting quantum computer **makes qubits using extremely cold circuits through which electricity flows with almost no resistance.**

A normal computer calculates using semiconductor chips that conduct electricity. A superconducting quantum computer also uses chips. But there is one decisive difference from an ordinary semiconductor chip: these chips only operate at **extraordinarily low temperatures.**

Rigetti, which uses the superconducting approach, explains that the core of its quantum computer — the QPU — is a superconducting integrated circuit, cooled inside a dilution refrigerator to an environment near absolute zero. That is colder than outer space, approaching roughly minus 273 degrees Celsius. In plain terms, it is **a special chip that only works inside a refrigerator chilled to nearly absolute zero.**

Here is a helpful analogy:

- A normal computer chip is like **roads in a city**, where electrical signals travel back and forth to compute.
- A superconducting quantum chip is like a **nearly frictionless ice path**, where electrical signals move in a special quantum state to create information.

The basic unit of information created here is the **qubit**.


## 2. Why Is a Qubit Special?

The unit of information in a normal computer is the bit. A bit is either 0 or 1 — like a light switch, off or on, one or the other.

A qubit is different. A qubit can hold the properties of both 0 and 1 **at the same time.** This is called **superposition**. Qubits can also be strongly linked so that the state of one becomes bound up with the state of another — a phenomenon called **entanglement.**

In middle-school terms:

- A normal bit is a coin that has **already landed** on heads or tails.
- A qubit is closer to a coin that is **still spinning**, holding the possibility of both heads and tails at once.

The real physics is far more complex, but this is enough to understand the technology.

The single most important point is this:

**A quantum computer is not an all-powerful machine that solves every problem faster. But for certain specific problems, it can compute in a completely different way from a classical computer.**

Those "specific problems" mostly fall into these areas:

- Chemistry and materials simulation
- Financial portfolio optimization
- Logistics and routing optimization
- Cryptography and security
- Complex probability calculations
- Optimization problems combined with AI

Keep this in mind, and it becomes much easier to separate the hype around quantum computing from the genuinely meaningful progress.


## 3. Strengths of the Superconducting Approach

There are three main reasons the superconducting approach is powerful.

### First, it resembles the semiconductor industry

Superconducting qubits are made by etching circuits onto a chip. In this sense the philosophy is similar to conventional semiconductor manufacturing. That is why companies like IBM, Google, and Rigetti are pushing this approach hard.

Why does "resembling semiconductors" matter? Because for any technology to become a real industry, making one or two units well in a lab is not enough — it has to be **manufacturable at scale, repeatedly.**

In November 2025, IBM announced it was shifting primary fabrication of its quantum processors to an advanced 300mm wafer facility at the Albany NanoTech Complex in the United States. The 300mm wafer is the very standard used to mass-produce conventional semiconductors today. This is a move to bring quantum chips into the existing semiconductor manufacturing ecosystem.

### Second, gate speeds are fast

Superconducting qubits generally have fast gate operation speeds. A **gate** is the basic operation a quantum computer uses to compute. Just as a classical computer has logic operations like AND and OR, a quantum computer has quantum gates that change the state of qubits.

A fast gate means more calculations can be attempted in a short time. But there is an important caveat: **fast is not automatically good.** If speed comes at the cost of high error rates, the actual results are ruined. What truly matters is not raw speed but the **balance between speed and accuracy (error rate).** We will return to this balance below.

### Third, the large-company ecosystem is strong

The two biggest pillars of the superconducting approach are IBM and Google.

IBM is strong in cloud-based access, a software ecosystem called Qiskit, an openly published roadmap, and partnerships with enterprises and research institutions. IBM views quantum computers not as standalone devices but as part of a **quantum-classical workflow** used alongside high-performance classical computing (HPC).

Google has sent a strong message in error correction with its superconducting chip, **Willow**. According to Google Research, the 105-qubit Willow chip showed that as the lattice (code distance) grows larger, the logical error rate actually **decreases** — a result described as being "below threshold." Why this matters is explained in the next section on weaknesses.


## 4. Weaknesses of the Superconducting Approach

You cannot understand a technology by looking only at its strengths. The superconducting approach has clear weaknesses too.

### First, it must be made extremely cold

A superconducting quantum computer must operate at temperatures near absolute zero. As Rigetti's explanation above shows, the QPU is kept in a cryogenic state inside a dilution refrigerator. This cooling equipment is expensive, large, and difficult to operate.

In other words, a superconducting quantum computer is not a machine you put on your desk like a smartphone. For the foreseeable future, it is likely to be used inside cloud data centers, research institutions, national projects, and large-enterprise infrastructure.

### Second, errors are frequent

Quantum information is very fragile. It is easily disturbed by ambient temperature, electromagnetic waves, vibration, and noise. That is why the single most important challenge in quantum computing is **error correction.**

This is exactly why Google's Willow result matters. Normally, adding more qubits also adds more errors, making calculations easier to break. But Willow experimentally demonstrated a direction in which the logical error rate **falls** as the lattice grows. That is the meaning of the "below threshold" result, and it is an important step showing that error correction can actually work.

Whether you are an investor or a student, here is a core point to remember:

**The number of qubits matters less than the error rate. No matter how many qubits a machine has, if the errors are too high it cannot perform useful calculations.**

This single sentence is the most powerful tool you have when reading quantum computing news. When you see a headline like "1,000-qubit milestone!", you should reflexively ask, "And the error rate?"

### Third, wiring and control are complex

Each superconducting qubit must be controlled externally. As the number of qubits grows, signal lines, control electronics, cooling, and noise management become exponentially harder. Making many qubits is not enough; the real challenge is **controlling and connecting many qubits stably.**


## 5. Representative Companies in the Superconducting Approach

To repeat: the companies below are not "recommended stocks." They are **educational examples of how each approach is actually implemented.**

### IBM

IBM is one of the most important large players in superconducting quantum computing. Its roadmap is highly public, and its cloud access and software ecosystem are strong.

The key figures from IBM's roadmap, published in November 2025, give a sense of where this approach is heading:

- **Nighthawk processor**: 120 qubits, with 218 next-generation tunable couplers linking each qubit to its four nearest neighbors in a square lattice. IBM says it can run circuits roughly 30% more complex than its previous generation, Heron, at comparable fidelity.
- **Gate-count roadmap**: currently about 5,000 two-qubit gates → 7,500 in 2026 (up to three modules, 360 qubits) → 10,000 in 2027 → 15,000 in 2028 (more than 1,000 connected qubits). Here "gate count" indicates how long and complex a calculation the machine can run in a single job.
- **Long-term goal**: a first fault-tolerant quantum computer, **Starling** (200 qubits, on the scale of 100 million gates), targeted for 2029, followed by **Blue Jay** (on the scale of 2,000 qubits).

> **An educational perspective:** IBM is not a pure-play quantum company. Quantum is one of many businesses inside a vast corporation. So the leverage that quantum's success or failure has on the company as a whole is smaller than for a pure-play quantum firm. When studying the technology, it is useful to also consider "how large a share quantum represents within the company."

### Google / Alphabet

Google Quantum AI has a powerful presence in Willow and error-correction research. As noted above, the 105-qubit Willow demonstrated "below threshold" error correction, regarded as an important milestone on the path toward large-scale, error-corrected quantum computers.

> **An educational perspective:** Alphabet is a giant platform company spanning AI, search, cloud, advertising, autonomous driving, and quantum. Quantum is one part of that. Still, if quantum and AI converge over the long term, it is worth watching how Alphabet's research and compute capabilities play out.

### Rigetti Computing

Rigetti is a U.S.-listed company with high exposure to the superconducting approach. In April 2026 it made its **Cepheus-1-108Q** system generally available. Its published figures are a good case study for understanding the superconducting approach:

- 108 qubits, built on a modular (chiplet-based) architecture that **connects twelve 9-qubit chiplets.** This tripled the number of qubits and chiplets from its previous 36-qubit system.
- Median two-qubit gate fidelity of **99.1%**, median single-qubit gate fidelity of 99.9%, with a gate speed of about 60 nanoseconds.
- On a separate prototype system, Rigetti recorded a two-qubit gate fidelity as high as 99.9% at 28 nanoseconds. But that is a prototype figure; the current median on the deployed 108-qubit system is 99.1%. Rigetti has set 99.5% as its next target.

This distinction between "99.1% current value / 99.5% next target / 99.9% prototype record" is important. When reading announcements from quantum companies, you need the habit of asking **whether a number is the median across an entire production system, a best-case record on a few pairs, or a prototype value.** The same "99.9%" can mean entirely different things depending on context.

> **An educational perspective:** Because Rigetti has high pure-play exposure, its technical progress and the market's reaction are directly linked. That also means variables like the technology roadmap, capital raising, and competitive intensity have an outsized effect on the company.

### D-Wave Quantum

D-Wave should be viewed somewhat differently. D-Wave has long been strong in **quantum annealing.** Annealing is not a general-purpose quantum computer but an approach **specialized for optimization problems.** At the same time, D-Wave has stated it will develop a gate-based superconducting quantum computer as well, emphasizing challenges such as cryogenic control, multi-chip superconducting packaging, and reducing the number of I/O control lines.

Commercially, it already has real revenue cases. In 2026, reports noted a system sale of about $20 million to Florida Atlantic University and a $10 million quantum-computing-as-a-service (QCaaS) agreement with a Fortune 100 buyer.

> **An educational perspective:** D-Wave simultaneously pursues "optimization-focused quantum you can use today (annealing)" and "future general-purpose gate-based quantum." It therefore needs a different framework from other gate-based superconducting companies. How annealing's long-term standing compares with general-purpose quantum computers is itself a debated topic in the industry.

### Others: Alice & Bob, IQM, Oxford Quantum Circuits

These are private or non-U.S. companies, but they are important players in the superconducting family. In particular, Alice & Bob is drawing attention for its **cat qubit** approach to error-resistant qubits, while IQM and OQC play important roles in the European and U.K. superconducting ecosystems respectively. They may be difficult for U.S. public-market investors to access directly, but they show that the superconducting ecosystem extends well beyond the United States.


## 6. What to Watch When Evaluating This Approach

This section is not investment advice. It is an educational summary of **the metrics specialists actually examine when gauging the real capability of a superconducting quantum computer.** Keep these in mind when reading news or company announcements, and you will develop an eye for separating hype from substance.

**1. Number of physical qubits.** How many qubits were built? The key point, though, is that you should never look at this alone.

**2. Gate fidelity.** How accurate are the computational operations? This is often more important than the number of qubits.

**3. Two-qubit gate performance.** The hard part of a quantum computer is not handling one qubit but making qubits interact. So two-qubit gate fidelity is especially important.

**4. Error-correction progress.** As with Willow's "below threshold" result, watch whether error correction is shown to actually work in the right direction.

**5. Circuit depth or gate count.** The reason IBM emphasizes 7,500 → 10,000 → 15,000 gates is to show whether it can perform longer, more complex calculations.

**6. Cloud usage and customers.** Is the technology actually being used by real customers? D-Wave's emphasis on commercial contracts fits this context.

**7. Capital strength.** Quantum computing demands enormous spending on cooling equipment, manufacturing, talent, and R&D. Especially for pure-play companies, the ability to raise capital determines how long the technology can be sustained.


## 7. Who Is Favored in the Superconducting Approach?

The superconducting approach favors those with the following capabilities:

- Experience in semiconductor manufacturing
- Capital to invest in cryogenic equipment and control technology
- The ability to provide customer access via the cloud
- The ability to pursue error-correction research over the long term
- The ability to build both hardware and a software ecosystem

That is why IBM and Google are strong. Rigetti, as a pure-play superconducting public company, is a case where technical progress is directly visible. D-Wave should be considered separately because it already has customer use cases in annealing.


## 8. Summary

The superconducting approach is **one of the most industrialized paths** in quantum computing. It is chip-based, large companies participate, cloud access is good, and the roadmaps are relatively clear. IBM targets verified quantum advantage by the end of 2026 and a fault-tolerant quantum computer by 2029, while Google has shown a thread of error-correction progress with Willow.

But its core weakness is just as clear:

**Superconducting quantum is fast and powerful, but it is cold, sensitive, and error-prone.**

So the eventual winner of this approach is likely to be not simply whoever builds the most qubits, but whoever **reduces errors, controls many qubits stably, and solves real customer problems by combining quantum with the cloud and HPC.**

In one sentence:

> **The superconducting approach is quantum computing's "semiconductor path." IBM and Google are the largest platform pillars, while Rigetti and D-Wave are cases where you can observe this technology's progress more directly in the public markets.**

In the next part, we cover the **trapped-ion approach.** Centered on IonQ and Quantinuum, we will look at why trapped ions are called "slow but precise" quantum computers. If superconducting is the "fast chip," trapped ion is the "precise atom" — and that contrast is the heart of the next part.


### Sources and References

- IBM, *Quantum Roadmap* and the Nighthawk/Loon announcement (November 12, 2025): Nighthawk 120 qubits / 218 couplers, gate-count roadmap, 300mm wafer transition, Starling (2029) and Blue Jay plans. (ibm.com/roadmaps/quantum)
- Google Research, *Making quantum error correction work* — Willow 105-qubit below-threshold error correction. (research.google)
- Rigetti Computing, *General Availability of 108-Qubit System Cepheus-1-108Q* (April 7, 2026): 99.1% median two-qubit fidelity, twelve 9-qubit chiplets. (investors.rigetti.com)
- D-Wave Quantum, annealing and gate-model announcements, and 2026 commercial-contract reports.
- AWS, *Amazon Braket launches Rigetti Cepheus-1-108Q* (April 7, 2026).


> **Educational disclaimer.** This material is educational content intended to help readers understand quantum computing technology. It is not investment advice or a recommendation to buy or sell any financial instrument. Technical figures and roadmaps are as of each company's announcement date and are subject to change. Investment decisions are the reader's own responsibility; consult a qualified professional where appropriate.

*Brutal Edge — Frameworks over forecasts. Signal over noise.*