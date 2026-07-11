---
title: "The Optical Bottleneck: Why AI's Next Constraint Is Light — and the Chokepoint I Was Underweighting Until Now"
slug: "special-optical-bottleneck-three-layer-may-2026"
description: "I spent most of 2024 and 2025 treating networking as plumbing. Compute mattered. Memory mattered. Power mattered. Networking was the boring middle layer that delivered packets. That framing is now wrong, and the part I had been missing — where the value actually concentrates — is small enough that most coverage still isn't pointing at it. This is the piece I should have written six months ago."
date: "2026-06-21T12:30:00Z"
category: "Reports"
subcategory: "Special Report"
badge: "special-report"
readTime: "17 min"
heroImage: "/images/reports/special-optical-bottleneck-three-layer-may-2026.webp"
author: "DHLM Studio Team"
byline: "DHLM Studio"
tags: ["SPECIAL-REPORT", "OPTICAL-NETWORKING", "SILICON-PHOTONICS", "CO-PACKAGED-OPTICS", "CPO", "LUMENTUM", "LITE", "COHERENT", "COHR", "NVDA", "AVGO", "AI-INFRASTRUCTURE", "CHOKEPOINT", "QUANTUM-NETWORKING"]
contentLifespan: "evergreen"
promotionWeeks: 4
---

# The Optical Bottleneck
## Why AI's Next Constraint Is Light — and the Chokepoint I Was Underweighting Until Now

I want to start this one with a confession.

For most of 2024 and 2025, I had a working mental model of AI infrastructure that put compute at the top, memory in the middle, power as the macro overlay, and networking somewhere at the bottom as the plumbing. The plumbing did its job. The plumbing wasn't the story. Whenever I came across an optical networking pitch, I'd nod along, file it under "interesting adjacency," and move on to the parts of the stack I thought were more important.

That was the wrong framing. I want to walk through how I figured that out, what changed my mind, and where I now think the real chokepoint actually sits — because the part I was missing is small enough that even now most semiconductor coverage isn't pointing at it directly. This is the piece I should have written six months ago.

---

## 1. The mental model I was running

The compute-first framing of AI infrastructure works fine at small cluster scales. When you're building a 1,000-GPU cluster, the GPUs are obviously the asset. The interconnect between them matters, but it's not the binding constraint. The training run finishes, the cost-per-token math works, and networking sits in the background doing its job.

At 10,000 GPUs, the framing still mostly holds. You start noticing networking more — power, latency, fabric design begin to matter visibly — but the GPUs are still the protagonist of the cost structure.

At 100,000 GPUs, the framing starts cracking. The networking power budget becomes a real line item. The fabric topology becomes a design choice that materially affects training efficiency. The cost of moving data between accelerators starts being comparable, in some configurations, to the cost of computing on the data.

At 1,000,000 GPUs — which is the cluster size the frontier labs and the largest hyperscalers are now openly designing toward — the framing breaks completely. The compute layer becomes one of several first-order constraints, and not necessarily the binding one. Power, memory, and networking each compete for being the layer that limits how far the architecture can scale.

I had been running the compute-first framing past the point where it stopped describing the system accurately. Once I corrected for that, NVIDIA's March 2025 announcement of its Spectrum-X and Quantum-X Photonics platforms — co-packaged optics, 1.6 terabit-per-second per port, 3.5x energy efficiency, designed to connect millions of GPUs — stopped reading as a product launch and started reading as a category statement. The company building the AI stack was telling the market, in production-systems language, that the copper era is ending and the next phase of scaling cannot happen without light.

That recategorization is what this piece is about.

---

## 2. The framework — three layers, three different chokepoints

The cleanest way I have found to think about the optical opportunity is to split it the same way we have split the rest of the AI infrastructure stack: into layers, each with its own demand curve, supply structure, and rerating profile.

**Layer 1 — Component and Light Source.** This is where the photons are actually generated and shaped. Lasers, electro-absorption modulators, indium phosphide substrates, and the highly specialized supply base behind them. This is the deepest chokepoint in the stack, and it is the layer the equity market is still least equipped to price correctly. It is also the layer I had been underweighting most.

**Layer 2 — Integration and Packaging.** This is where optics merge with the rest of the semiconductor stack. Silicon photonics. Advanced packaging. Co-packaged optics. The photonic integrated circuits that make all of it manufacturable at scale. This is the layer NVIDIA, TSMC, and the major foundries are actively engineering around right now, and it is where the architectural rerating is happening in real time.

**Layer 3 — Systems and Architecture.** This is the layer the market is most comfortable with. Pluggable transceivers, switches, networking ASICs, system integrators. The largest revenue category today, and the one that has captured most of the recent investor attention — but increasingly downstream of the architectural decisions being made at Layers 1 and 2.

The mistake most coverage makes is treating these three layers as one undifferentiated optical market. They are not one market. They have different demand drivers, different supply constraints, different pricing power, and different rerating timelines. The investment work is figuring out which layer the exposure actually sits at.

That is where I want to spend most of this piece.

---

## 3. Why optical is no longer adjacent to AI

Before going into the layers, I want to set the broader case as plainly as I can, because the sizing of the opportunity depends on it.

AI workloads are uniquely sensitive to interconnect performance in ways that previous compute workloads were not. Training a large model is fundamentally a synchronized parallel computation across thousands or millions of accelerators. Every gradient exchange, every activation pass, every checkpoint synchronization is bottlenecked by the slowest path through the cluster. The faster the fabric, the larger the model that becomes economically trainable, the more efficiently the underlying capital deploys.

Copper-based interconnects degrade across all four of the things AI training cares about most: bandwidth, latency, power consumption, and physical reach. Each can be partially mitigated with engineering. None can be solved within the same physics. As cluster sizes scale by orders of magnitude, the penalties compound, and eventually the cluster stops being able to scale at all under the copper architecture.

NVIDIA has been unusually direct about this. The Spectrum-X and Quantum-X Photonics platforms exist because the company believes the path to million-GPU AI factories is not feasible under conventional electrical signaling. That is not marketing language. It is a public statement about what the physics will and will not support, made by the company that has more to lose than anyone if it is wrong.

The investable implication is that optical is no longer adjacent to AI infrastructure. It is a precondition for the next generation of AI infrastructure. The market is starting to price this, but unevenly — concentrating attention on the visible system-level winners while under-pricing the deeper component-level chokepoint.

That asymmetry is the opportunity.

---

## 4. Layer 1 — Where the real chokepoint lives

If the last few years of semiconductor cycles taught me anything, it is that the highest-conviction trades inside structural shifts tend to sit at the deepest component layer of the stack — the place where physical supply is genuinely constrained and substitution is genuinely difficult.

In memory, that place was HBM. SK Hynix's repricing as a category leader rather than a cyclical DRAM player was the dominant trade of 2024-2025, and the entire memory chapter of the AI capex story flowed downstream from that single observation: when the constraint is structural and the substitute doesn't exist, the chokepoint operator's economics change shape.

In optical, the equivalent role is played by the high-performance laser — specifically the electro-absorption modulated laser, or EML, used in 200-gigabit-per-lane transmission. The 200G-per-lane rate is not a minor incremental specification. It is the building block for the next generation of high-speed optical modules — 1.6 terabit transceivers, next-generation CPO platforms, and the eventual transition into 3.2T and beyond. Get the EML, and the rest of the optical roadmap is reachable. Don't get the EML, and the rest of the roadmap stalls.

The reason this is the chokepoint is mostly physical. Lasers cannot be made in silicon. They require exotic compound semiconductor substrates — indium phosphide is the dominant one — and the supply chain that produces them is geographically concentrated and capacity-constrained. Unlike most semiconductor categories, the EML supply base is not five or ten major suppliers competing on price. It is, in practical commercial terms, a handful.

Lumentum is the clearest single-name exposure to this chokepoint. The company ships 200G-per-lane EMLs at volume, which is the specific lane rate the industry is building 1.6T transceivers and next-generation CPO platforms around. Management's recent commentary has been about doubling laser chip shipments year over year and projecting more than fifty percent EML unit growth into the end of 2026. NVIDIA's public strategic partnership with Lumentum, including support for capacity expansion, is the kind of customer behavior that does not happen when the buyer thinks they are in a normal cycle. It happens when the buyer believes the supply constraint is structural and worth underwriting directly.

Coherent occupies an adjacent position with a broader optics portfolio and a separate NVIDIA relationship. Mitsubishi, Sumitomo, and parts of Broadcom's optical business operate in the EML supply chain as well, but the concentration of next-generation lane rates at the top of the supply base is meaningful, and it is what makes this layer behave differently from the more diffuse parts of the optical complex.

The structural read I now hold is that Layer 1 of the optical stack looks more like memory's HBM dynamic than it looks like the broader semiconductor commoditization curve. Customers are pre-allocating capacity. Lead times are extending past 2027. Hyperscalers and major chip companies are openly scrambling for secondary suppliers. That pattern is not cyclical scarcity. It is the structural repositioning of a component category from "commodity input" to "strategic constraint."

There is one more dimension to the Layer 1 chokepoint that deserves direct attention, because it is mostly absent from the equity research coverage I have seen so far. The IEA's *Energy and AI* special report — a 304-page analysis published in 2025 and updated in early 2026, from the institution that defines the global energy outlook — flagged it explicitly. Gallium is an increasingly critical metal used in cutting-edge computer chips and power electronics, including the photonic stack underneath the laser components I described above. China currently accounts for around 99 percent of global refined gallium supply. The IEA estimates that gallium demand from data centres alone could reach over 10 percent of today's total supply by 2030.

That is not a peripheral data point. The same supply-chain concentration that has shaped the rare-earth and critical-mineral conversation around batteries and EVs now extends directly into the photonic layer of AI infrastructure. The laser chokepoint sits on top of a mineral chokepoint that is geographically further concentrated and politically more exposed than the indium phosphide supply base itself. For an asset class being recategorized as critical infrastructure, that compounding concentration is the kind of risk-and-leverage profile investors need to understand explicitly rather than discover during a trade-policy event.

If I had to identify the single highest-conviction structural trade inside the entire optical complex right now, it would be exposure to this chokepoint — with full acknowledgment that single-name concentration carries idiosyncratic execution risk that a diversified semiconductor exposure does not. Position-sizing matters more here than in the diversified layers.

This is the part I had been underweighting most, and the part I now think the market is still under-pricing.

---

## 5. Layer 2 — The integration layer NVIDIA is actually engineering around

Layer 2 is where the architectural decisions are being made, and it is where the next wave of value creation is going to concentrate even if the absolute revenue numbers are smaller than Layer 3 today.

The defining technology here is co-packaged optics. In the older pluggable model, optical transceivers sit outside the switch ASIC and connect over short electrical traces. In CPO, the optics move into the same package environment as the switch silicon. The electrical distance between compute and optics shrinks from inches to millimeters. Power consumption drops sharply. Bandwidth density rises sharply. Latency drops further than most market participants have fully internalized.

NVIDIA's Spectrum-X and Quantum-X Photonics platforms are the most visible CPO products in the market today, built in partnership with TSMC, Coherent, Lumentum, Corning, Foxconn, and SENKO. The roadmap is explicit: 1.6 terabit-per-second per port, 3.5x energy efficiency improvement, 10x resilience improvement, targeting million-GPU AI factories. The named partner list functions as a strategic signal — these are the companies NVIDIA is publicly endorsing as core infrastructure for the next decade of AI buildout.

Underneath CPO sits silicon photonics — the manufacturing approach that makes optical integration economical at scale. The silicon photonics market is moving from specialized deployment toward industrial-scale manufacturing, with credible estimates putting CAGR in the high twenties to nearly thirty percent through the next decade. The strategic significance is not the absolute market size. It is that the optical layer can finally piggyback on the manufacturing economics of mainstream semiconductors. That is the precondition for optics becoming infrastructure rather than premium.

The CPO market itself is small today — the most cited estimate puts it around 95 million dollars in 2025 — but it is on a roughly 30 percent CAGR trajectory toward over a billion dollars by the early 2030s. The absolute numbers are directional. The shape of the curve is what matters: this is a market moving from technical roadmap to commercial category, and the value migration from pluggable to CPO is going to reshape the competitive landscape of the optical industry over the next five to seven years.

The investment implication for Layer 2 is that the named partners — particularly Coherent, TSMC, and the OSAT specialists with leading advanced packaging capacity — are positioned where the architectural rerating actually happens. The pluggable transceiver vendors who do not transition successfully to CPO are going to face a more difficult second half of this decade than the current revenue picture suggests.

This is the layer where the value migration is most visible to investors who have been watching the right signals. It is also the layer where the diversification benefits inside the optical complex are highest.

---

## 6. Layer 3 — The current revenue engine

The largest revenue category in optical networking today is not CPO. It is the high-speed pluggable transceiver — particularly at 800G and 1.6T, with the older 400G base still meaningful.

LightCounting's shipment forecasts have been moving up steadily through 2026, with 800G shipments expected to more than double in 2026 and 1.6T shipments moving from a small base into the tens of millions of ports. That growth is happening right now, in front of CPO's commercial rollout, driven by AI data center buildouts that cannot wait for the next architectural transition.

The point worth being clear about is that pluggable transceivers are not a bad investment. They are, in many cases, a very good investment for the next eighteen to twenty-four months. The point is that pluggable is the present revenue category, not necessarily the future architectural category. The investment frame should distinguish between two kinds of companies:

The first kind has revenue concentrated in pluggable today, and a credible path into CPO and silicon photonics integration. These benefit twice — from the near-term pluggable surge and from the long-term architectural transition. Coherent, MACOM with its hybrid semiconductor-photonics approach, and Lumentum with its laser leverage across both architectures sit closer to this position.

The second kind has revenue concentrated in pluggable today, and does not have that path. These benefit once, then face structural pressure as the architectural transition compounds. The equity market historically does not price category transitions correctly until the transition is well underway, which means the time to distinguish between the two groups is now, not later.

The integrated names are the ones that get to participate in both the near-term shipment cycle and the longer-term architectural rerating. The non-integrated names are vulnerable to a transition that the equity market typically prices late.

---

## 7. The system layer — NVIDIA, Broadcom, Cisco, Intel

Stepping up one more layer, the system-level winners in optical AI networking are not all the same kind of company, and conflating them is one of the most common analytical mistakes in the sector.

NVIDIA is the system architect of the optical transition. The company is not a pure optical component vendor and is not trying to be. What NVIDIA controls is the network architecture around accelerated computing — the photonics platforms, the InfiniBand and Ethernet topologies, and increasingly the supplier roster for the entire optical stack. The value NVIDIA captures from optical is not primarily through optical revenue. It is through the cluster-scale capabilities that optical enables, which protect and extend NVIDIA's position in the compute layer.

Broadcom is the networking-silicon power center. Tomahawk and Jericho remain industry-standard switch ASICs. AI revenue has been growing very rapidly — recent quarters at $5 billion-plus and trending higher — and the optical transition reinforces rather than threatens Broadcom's position because optical platforms still need switch silicon underneath them. Broadcom is positioned more like infrastructure-layer scale, less like a pure-play optical bet.

Cisco is the diversified incumbent. A sixty-billion-dollar revenue base, broad exposure across switches, routers, optics, and enterprise connectivity. The optical transition matters to Cisco, but Cisco's economics are spread across a much wider system-level surface area than the pure-play optical names. Cisco is a way to participate in the broad networking spending environment, not a way to take focused exposure to optical chokepoints.

Intel is the long-invested photonics pioneer with the most uncertain commercial leverage. The company has been working on silicon photonics for more than a decade, has demonstrated optical compute interconnect chiplets, and sits closer to the deep technology base than any other large U.S. semiconductor company. Whether Intel converts that technical position into commercial scale at the right time is the open question, and given the company's broader strategic challenges, I am cautious about over-weighting the photonics narrative inside a thesis that depends on Intel's broader turnaround executing well.

These are not interchangeable exposures. NVIDIA is the architect. Broadcom is the silicon. Cisco is the systems breadth. Intel is the long-invested pioneer with execution risk. None of them is a pure optical bet — and that is precisely why the pure-play optical names at Layers 1 and 2 carry the structural leverage that the diversified system-level names do not.

---

## 8. The private-market frontier — optical I/O at the chip level

The most disruptive long-term theme in optical may be optical I/O — the idea of moving optical communication directly to chip-to-chip and package-to-package interconnect, rather than rack-to-rack as the current optical layer largely does.

Intel's OCI chiplet is one public demonstration of where this direction leads. Private companies like Lightmatter, with its 3D photonic interposer approach and claimed bandwidths north of 100 terabits per second from a single package, and Ayar Labs with its optical engine chiplets demonstrated at TSMC's OIP event, are the most prominent names in the private-market frontier of this category.

I want to be careful with this part of the story. These are still private exposures, they carry serious technology and commercialization risk, and the public-market equivalent has yet to fully form. But the direction of travel is real, and it matters for how to think about the long duration of the optical thesis.

The key implication is that optical does not stop at transceivers or switches. If the trajectory continues, optical increasingly becomes part of the chip-to-chip communication problem, not just the rack-to-rack problem. That is why I now think of optical as a long-duration architectural theme rather than a near-term module cycle. The pluggable surge is real, the CPO transition is real, and the optical I/O frontier is real — three separate phases of the same broader shift, on three different timelines.

---

## 9. The quantum connection — real, but framed carefully

The link between optical networking and quantum computing is genuine. It is also the part of the story where investors most often over-extrapolate, and I want to set the framing carefully.

Two things are true at the same time. The first is that photonic technologies are increasingly central to quantum systems. Trapped-ion architectures rely on photons for control and measurement. Modular quantum systems require photonic links to scale beyond single-chip constraints. Quantum networking — the emerging field of connecting quantum systems through entanglement-preserving optical channels — is fundamentally a photonics problem at the physical layer. IonQ's recent milestone of linking two remote commercial quantum systems using photonic interconnect, alongside its DARPA HARQ program participation, is one concrete public example of how photonic expertise is becoming load-bearing for the quantum roadmap.

The second thing that is true is that this optionality does not automatically make every optical-networking stock a quantum winner. The skills, supply chains, and customer relationships that matter for AI data center optics overlap with — but are not identical to — those that matter for quantum interconnect. Different lane rates, different wavelengths, different system requirements, different customer set.

The honest investment framing is that optical-networking and silicon-photonics exposure carries a second growth vector if quantum networking grows into a serious industry later in this decade. That is genuine optionality, and it is worth something. But it should not be the primary thesis. The primary thesis stands on the AI data center buildout. Quantum is upside.

For investors who already own quantum exposure — IonQ being the cleanest public example — the implication runs the other way. The optical layer is part of why the quantum thesis is durable, not just whether the hardware roadmap executes on schedule.

---

## 10. Where this breaks — the bear cases I take seriously

Any thesis this structural has to be paired with a serious bear case. There are four I think are worth owning honestly.

**Transition timing.** CPO adoption could arrive slower than the bullish roadmap implies. If pluggable optics stay dominant for longer than expected, names positioned only for the future architecture may disappoint in the near term, and the architectural rerating may take longer to compound. The framework predicts CPO becomes the dominant volume category by the late 2020s. That timing is a forecast, not a certainty.

**Technology substitution.** If alternative architectures — chiplet-level optical I/O, photonic interposers like Lightmatter's approach, or something not yet visible — leapfrog CPO, the value chain reshapes again. The companies most exposed to the pluggable model could face pressure earlier than the current shipment data suggests. The companies most exposed to first-generation CPO could face substitution pressure later.

**AI capex sensitivity.** The optical surge is driven almost entirely by hyperscaler AI spending. A material slowdown — through a recession, a capex digestion phase, or a model-architecture shift that reduces interconnect intensity — hits the optical names quickly. The structural recategorization argument predicts the asset class survives a normal cycle. A severe cycle would test that prediction harder than the current data has tested it.

**Supply-chain concentration and geopolitics.** NVIDIA's own partner list illustrates how globally interdependent this stack is. TSMC packaging. Japanese laser and connector firms. U.S. component suppliers. Korean memory ties that increasingly intersect with optical roadmaps. Indium phosphide capacity that doesn't move quickly. Optical is becoming critical infrastructure, which means it is inheriting the political and geographical risk that comes with critical infrastructure in 2026.

Owning the bull case responsibly means owning these risks. The architectural shift is real. The conditions that allow it to compound are not all under the suppliers' control.

---

## 11. What this means for U.S. investors

The practical takeaway is a positioning framework, not a single-stock call.

The three-layer structure suggests three different ways to express the same broad thesis, with different risk profiles and different timelines.

Layer 1 exposure means direct chokepoint plays in lasers and high-performance optical components. Lumentum is the cleanest single-name version. The asymmetry is highest here because the supply constraint is most structural and the customer underwriting most aggressive. The risk is the same idiosyncratic risk that any single-component concentration carries. Position-sizing matters more here than in the diversified layers.

Layer 2 exposure means silicon photonics and CPO integration. Coherent's position in the NVIDIA partnership is one route. The advanced packaging ecosystem around TSMC is another. MACOM's hybrid semiconductor-photonics approach is a third. These are the names positioned where the architectural rerating actually happens, with diversification benefits that single-component plays do not have.

Layer 3 exposure means system-level networking and infrastructure. NVIDIA, Broadcom, and Cisco are the obvious vehicles. The exposure to optical is more diffuse here, mixed with everything else these companies do, but the operational scale and customer concentration provide a different kind of durability. These are infrastructure-scale bets, not chokepoint bets.

The framework does not say that all three layers will be equally rewarding. It says they will be rewarding differently, on different timelines, with different downside profiles. Investors who treat optical as one undifferentiated category will likely over-pay for diversified system-level exposure and under-own the chokepoint where the real structural pricing power sits.

The framework also does not say that optical networking simply goes up from here. It says the asset class is being recategorized from networking commodity to AI infrastructure, the rerating is mid-cycle, and the value migration inside the stack is uneven and identifiable.

---

## Closing

I started this piece with a confession. The framing I had been running treated networking as the plumbing of AI infrastructure. That framing was incomplete, then increasingly wrong, and by 2026 it stopped describing the system in any useful way. The bottleneck has moved to the network. Inside the network, it has moved to a specific component category. And inside that component category, it has moved to a chokepoint that looks structurally similar to the HBM dynamic we already watched reshape the memory complex.

If I had to compress the whole report into one sentence, it would be this:

**Compute gets the headlines, memory gets the scarcity premium, and optical networking is the next hidden chokepoint that determines how far and how profitably the entire AI system can scale.**

The next eighteen months will tell us how much of the framework was right and how fast the rerating completes. The chokepoint layer is where I expect the most asymmetric outcomes. The architecture layer is where I expect the cleanest compounding. The system layer is where I expect the steadiest exposure.

This is a long-duration thesis with an active cycle running underneath it. That combination — structural shift plus immediate revenue tailwind — is the rarer setup. It is worth taking seriously, and it is worth taking the time to figure out which layer of the stack the exposure actually sits at.

I should have written this piece six months ago. I am writing it now. The structural thesis is still early enough to be worth thinking carefully about.

---

*DHLM Studio. Independent investor analysis.*
