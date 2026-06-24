---
title: "Quantum Security & Post-Quantum Cryptography: The Cybersecurity Upgrade Wall"
series: "Quantum Computing 101"
week: 9
slug: "quantum-101-part9-quantum-security"
description: "How NIST's post-quantum cryptography standards (ML-KEM, ML-DSA, SLH-DSA) are changing cybersecurity now — and why the encryption-replacement market can open before quantum computers are commercialized at scale."
publishDate: "2026-06-23"
readingTime: "18 min"
tags: ["Quantum Computing 101", "Post-Quantum Cryptography", "Cybersecurity", "NIST", "Technology"]
---

# Quantum Computing 101 — Part 9

## Quantum Security & Post-Quantum Cryptography: The Cybersecurity Upgrade Wall

> **About this series.** This is an educational resource for readers learning about quantum computing. It is not a recommendation to buy or sell any security. Companies are named as examples of *who operates in each layer, and how* — not as investment picks. The section "What to watch when evaluating this market" explains the metrics specialists use, as a tool for reading the news.

So far we have covered quantum computing hardware and software — superconducting, trapped ion, neutral atom, photonic, silicon spin, topological, quantum annealing, and the software and cloud layer. This part is about **quantum security** and **post-quantum cryptography (PQC).**

In one middle-school sentence: **Quantum security is the work of changing the locks on bank, government, and corporate systems in advance — because a powerful future quantum computer could break today's internet encryption.**

This topic matters enormously, because **the encryption-replacement market can open before quantum computers are even commercialized at scale.**

---

## 1. Why Are Quantum Computers Dangerous for Security?

Today's internet security is built largely on cryptography. When you log into a banking app, pay with a credit card, log into a corporate VPN, communicate with a cloud server, receive a software update, or sign a blockchain wallet transaction — cryptography is behind all of it.

The problem: some of the public-key cryptography widely used today is vulnerable to a large-scale quantum computer. In particular, public-key schemes like RSA and ECC could be put at risk by Shor's algorithm once a sufficiently powerful quantum computer exists.

No such commercial-grade quantum computer exists yet. But the security market does not only ask "Was it broken today?" It also asks "Could data stolen today be decrypted in the future?" This is called **Harvest Now, Decrypt Later.**

In plain terms: **An attacker steals encrypted data today and stores it. They cannot read it now. But if a quantum computer becomes powerful enough in the future, they may decrypt it then.**

CISA, the NSA, and NIST have jointly warned about this risk, noting that adversaries may collect data requiring long-term protection now in order to decrypt it later. Because of this, agencies recommend that organizations begin a quantum-readiness roadmap, a cryptographic-asset inventory, risk assessment, and vendor discussions now.

---

## 2. What Is Post-Quantum Cryptography?

Post-quantum cryptography (PQC) is cryptography designed to remain secure even in the age of quantum computers. A common misunderstanding to avoid: **PQC is not cryptography that runs on a quantum computer.** PQC runs on ordinary computers, but is built to withstand attacks from quantum computers.

By analogy: an existing lock may be strong against ordinary thieves but weak against a future special tool. PQC is a new lock designed with that future tool already in mind.

In August 2024, NIST released its first three finalized PQC standards. NIST stated these standards were ready for immediate use and explained that new standards were needed because future quantum computers could threaten current online security and privacy.

---

## 3. The Core Standards NIST Set

Three standards are essential to understand — and each now has a formal FIPS (Federal Information Processing Standard) number:

**1) ML-KEM (FIPS 203)** — used for key exchange / key encapsulation. In plain terms: **a method for two computers meeting for the first time to safely create a shared secret key.** Critical for website access, VPNs, cloud communication, messaging apps, and corporate networks. It is derived from the algorithm formerly called CRYSTALS-Kyber, and comes in three parameter sets (ML-KEM-512, 768, 1024).

**2) ML-DSA (FIPS 204)** — used for digital signatures. In plain terms: **an electronic seal that confirms a file or message really came from the stated sender.** Important for software updates, certificates, document signing, and verifying financial transactions. It is derived from CRYSTALS-Dilithium, and is intended to replace RSA and ECDSA signatures in certificates and secure handshakes.

**3) SLH-DSA (FIPS 205)** — also a digital signature, but built on a different mathematical foundation (a hash-based signature). In plain terms: **a different kind of sturdy electronic seal.** Because it relies only on hash functions rather than lattice mathematics, its security assumptions are simple and well understood, making it attractive for long-term robustness.

In **March 2025**, NIST selected **HQC** as a fifth algorithm — an additional code-based KEM that serves as a backup to ML-KEM. Because HQC rests on different mathematics from ML-KEM, it could be important if a weakness were ever found in ML-KEM. NIST is also developing **FIPS 206 (FN-DSA**, based on FALCON) for cases needing smaller signatures.

Why standardization matters so much: without standards, companies cannot move. Once standards exist, procurement, product development, certification, and security updates begin. In other words, PQC has started moving from the research stage to the **purchase-and-replacement stage.**

---

## 4. Why Prepare Now?

Many people ask: "If a quantum computer can't break RSA yet, why spend money now?" The answer is simple: **replacing cryptography takes a long time.**

The cryptography of a large enterprise or government is not in one place. It is hidden in servers, laptops, mobile apps, the cloud, databases, payment systems, certificates, VPNs, IoT devices, cars, factory equipment, medical devices, satellites, and military systems. Some organizations do not even know precisely which cryptography they use, or where.

So the first step is not "install new cryptography." The first step is building a **cryptographic inventory.**

The joint CISA / NSA / NIST guidance recommends that organizations build a quantum-readiness roadmap and an inventory identifying where public-key cryptography is used and what depends on it. In plain terms: **You have to find where all the locks in the house are before you can replace them with new ones.**

---

## 5. Crypto-Agility Is the Key

One of the most important terms in PQC is **crypto-agility** — the ability to change cryptography quickly. Suppose you use cryptography A today. Next year, a better cryptography B becomes the standard. A few years later, a weakness is found in A. You need to be able to swap it out quickly, without rebuilding the entire system. That capability is crypto-agility.

In middle-school terms: **making it so that when a lock gets old, you can swap just the lock without breaking down the whole door.**

This matters because the winner of the PQC market may not simply be the company that knows the algorithms, but the company that lets enterprises and governments **find, classify, replace, and continuously manage** their cryptography. In other words, PQC is not just an algorithm market — it is a market for **cryptographic inventory, certificate management, key management, network security, cloud security, endpoint security, and supply-chain security.**

---

## 6. Which Systems Are Most at Risk?

Not every system needs to change at the same speed. Three categories come first:

**First, data that must be stored for a long time.** Medical records, national-security material, intellectual property, financial data, and customer personal information that must be protected for 10+ years are at risk — because they can be stolen now and decrypted later.

**Second, equipment that is hard to replace for a long time.** Cars, aircraft, satellites, industrial equipment, medical devices, and power-grid equipment used for 10+ years are especially important.

**Third, roots of trust.** Certificates, software signing, firmware signing, identity systems, and cloud key-management systems. If these fall, trust in the entire system is shaken.

The NSA's CNSA 2.0 guidance covers the transition to quantum-resistant algorithms for National Security Systems, recommending that software and firmware signing begin transitioning immediately, with CNSA 2.0 signature algorithms used for new software and firmware from 2025. This trend applies to government systems first, but over time is likely to spread to defense, cloud, finance, telecom, and industrial supply chains.

---

## 7. Related Companies and the Educational Lens

PQC is not a market only for specific quantum-hardware companies. It connects more strongly with existing cybersecurity, cloud, network, certificate, semiconductor, and infrastructure companies.

- **Cloudflare** — strong in internet traffic, CDN, security, Zero Trust, and network infrastructure. It matters in the PQC transition because it sits close to the internet edge and TLS communication; as web-traffic security moves to PQC, edge-network operators can play an important role.
- **Palo Alto Networks** — strong in enterprise security platforms, firewalls, SASE, cloud security, and threat detection. In the PQC era, visibility into cryptography use, VPNs, authentication, traffic inspection, and policy management within enterprise networks can matter.
- **CrowdStrike** — strong in endpoint and cloud security. PQC is not only an antivirus issue, but connects to certificates, update signing, key management, and identity security on endpoints.
- **Zscaler** — important in the Zero Trust and secure-access layer. Where enterprise traffic passes through cloud security gateways, PQC-ready TLS, authentication, and key-exchange transitions become important topics.
- **Certificate companies (DigiCert, Sectigo, etc.)** — the certificate ecosystem is critical. Digital certificates are the core of internet trust; moving to PQC signature algorithms raises issues of issuance, management, replacement, expiration, and compatibility.
- **Thales, Entrust, IBM** — key management, hardware security modules (HSMs), and government/enterprise security infrastructure. Large organizations do not store cryptographic keys just anywhere; they need HSMs and key-management infrastructure.
- **Microsoft, Amazon, Google** — cloud companies are central, since enterprise data and applications live in the cloud. The PQC transition connects to cloud TLS, key-management services, certificates, API security, identity, and confidential computing.

> **An educational perspective:** **PQC may create revenue opportunities for "cybersecurity-infrastructure" companies sooner than for "quantum-computer" companies.** The threat is quantum, but the spending is on conventional security infrastructure — which is why this market can open first.

---

## 8. PQC Is Not QKD

Studying quantum security, you also encounter **QKD (Quantum Key Distribution)** — a method of distributing secret keys using the principles of quantum physics. PQC and QKD are different:

- **PQC** is a new set of cryptographic algorithms that run on ordinary computers.
- **QKD** is a physical security method that distributes keys using quantum communication equipment.

The one more likely to apply broadly is PQC, because it can be deployed as a software update into existing software and internet infrastructure. QKD can matter for specific governments, defense, finance, and telecom networks, but converting all of the world's internet to QKD is difficult.

In one sentence: **PQC is a software-centric upgrade; QKD is a special-communications-infrastructure security method.** Both matter, but the market character differs.

---

## 9. Are Blockchain and Bitcoin Safe?

This is a question U.S. readers always ask. As quantum computers grow more powerful, blockchain and Bitcoin could be affected. Bitcoin uses hash functions and digital signatures. Hash functions could have some security strength reduced by quantum computers, but this is a less direct risk than for public-key signatures.

The bigger issue is addresses whose public key is exposed. If a sufficiently powerful quantum computer could attack ECDSA signatures, assets at addresses with revealed public keys could be at risk. But this does not mean "Bitcoin breaks tomorrow."

The important point is that, long term, blockchain networks may also need to upgrade to PQC signature schemes. The difficulty is that blockchains require consensus among participants worldwide, so upgrades are not easy.

The key point: **quantum security is not only a problem for banks and governments — it is also a long-term issue for blockchain and digital-asset infrastructure.**

---

## 10. What to Watch When Evaluating This Market

Educational, not investment advice — the metrics specialists track for PQC and quantum security:

**1. Speed of NIST standard adoption** — how fast ML-KEM, ML-DSA, SLH-DSA, and HQC enter real products.
**2. Government procurement requirements** — when PQC requirements become mandatory in U.S. government, defense, intelligence, and critical infrastructure.
**3. Crypto-inventory product demand** — whether companies spend on tools to map their own cryptography use.
**4. HSM and key-management upgrades** — how fast key-management ecosystems (Thales, Entrust, IBM) ship PQC-ready products.
**5. TLS and web-infrastructure transition** — whether Cloudflare, Google, Microsoft, and Amazon deploy PQC or hybrid key exchange at scale.
**6. Certificate ecosystem** — whether DigiCert, Sectigo, and the CA/B Forum move to PQC certificate schemes.
**7. IoT and long-lived equipment** — whether cars, industrial equipment, medical devices, and satellites support PQC-ready firmware and secure updates.
**8. Cyber-insurance and regulation** — whether insurers and regulators begin to require quantum readiness.

---

## 11. Where PQC Sits in the Quantum Industry Map

| Layer | Representative area | Educational meaning |
| --- | --- | --- |
| Quantum hardware | IBM, IonQ, Rigetti, D-Wave | Future compute power |
| Quantum software | Qiskit, Azure Quantum, Braket | Usability and platforms |
| Quantum security / PQC | NIST standards, CISA/NSA guidance, cybersecurity firms | The real-demand market that may open first |
| Quantum networking / QKD | Telecom, defense, satellite, photonics | Specialized high-security infrastructure |
| Enterprise transition services | Crypto inventory, key management, certificates | Consulting / software / security revenue |

The most important point: **PQC is not a market that starts after quantum computers are finished. It is a market that starts early precisely because quantum computers could become a threat.**

---

## 12. Summary

Quantum security is one of the most realistic early markets in quantum-computing investment. Even before quantum computers can solve every industrial problem, governments and enterprises already have to prepare their cryptographic infrastructure for transition.

NIST has released the PQC standards, and CISA, NSA, and NIST recommend starting a quantum-readiness roadmap and a cryptographic inventory. This has a clear meaning: quantum-hardware companies are a long-term option, while PQC and quantum security can become a nearer-term cybersecurity budget line.

Key company groups to understand: cloud (Microsoft, Amazon, Google); network security (Cloudflare, Palo Alto Networks, Zscaler); endpoint/identity security (CrowdStrike, Okta-type firms); key management/HSM (Thales, Entrust, IBM); certificate infrastructure (DigiCert, Sectigo); and government/defense security vendors providing PQC-ready cryptographic modules.

In one sentence:

> **Quantum security is the "insurance market" for quantum computing. Before quantum hardware is finished, governments and enterprises must first find, assess, and replace their cryptographic assets — and the companies earning revenue first in that process may be cybersecurity-infrastructure firms, not quantum-computer makers.**

To compress it fully:

> **Post-quantum cryptography is not science fiction. It is the next major cybersecurity migration cycle. The winners will be the companies that help governments and enterprises find every old lock, replace it with a quantum-resistant one, and make sure the next lock can be changed faster.**

In the next part, we cover **quantum applications — drug discovery, materials, finance, logistics, and energy:** what industrial problems quantum computers can actually solve, and which application areas to understand first.

---

## Sources and References

- NIST, *NIST Releases First 3 Finalized Post-Quantum Encryption Standards* (August 13, 2024): FIPS 203 (ML-KEM / Kyber), FIPS 204 (ML-DSA / Dilithium), FIPS 205 (SLH-DSA / SPHINCS+). (nist.gov; csrc.nist.gov)
- NIST, *NIST Selects HQC as Fifth Algorithm for Post-Quantum Encryption* (March 11, 2025); FIPS 206 (FN-DSA / FALCON) in development. (nist.gov; csrc.nist.gov)
- CISA / NSA / NIST, *Quantum-Readiness: Migration to Post-Quantum Cryptography* — Harvest Now, Decrypt Later; quantum-readiness roadmap and cryptographic inventory. (defense.gov; CISA)
- NSA, *Commercial National Security Algorithm Suite 2.0 (CNSA 2.0)* — software/firmware signing transition from 2025. (media.defense.gov)
- FIPS 203 final standard — ML-KEM parameter sets (512/768/1024), Module-LWE basis. (csrc.nist.gov/pubs/fips/203/final)

> **Educational disclaimer.** This material is educational content intended to help readers understand quantum computing and security technology. It is not investment advice or a recommendation to buy or sell any financial instrument. Standards, guidance, and company details are as of publication and are subject to change. Investment decisions are the reader's own responsibility; consult a qualified professional where appropriate.

*Brutal Edge — Frameworks over forecasts. Signal over noise.*
