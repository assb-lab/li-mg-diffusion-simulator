# Domain Model

Status: Accepted

## Concepts

### AlloyAnode

Li-rich alloy anode.

MVPでは `Li0.9Mg0.1` のみを扱う。

### BetaPhase

Li-Mg binary systemにおけるbeta-phase。

MVPでは以下の濃度範囲を有効範囲とする。

```text
24.0 <= c_Li <= 69.6 mmol cm^-3
```

### Delithiation

Liがsolid electrolyte界面側から引き抜かれる過程。

### Interface

`x = L` または `ξ = L`。

Solid electrolyteとLi-Mg alloy anodeの接触界面。

### Nonactive Side

`x = 0` または `ξ = 0`。

delithiation反応が起きない側。

### Concentration Profile

`c_Li(x, t)`。

Li濃度の空間・時間分布。

### Utilization

delithiationによって利用されたLi量の割合。

MVPでは2種類を扱う。

1. total Li utilization
2. beta-phase Li utilization

---

## Coordinate System

論文の記号に合わせ、距離座標は `ξ` として説明されることがある。

実装では `x` を使う。

```text
x = 0: nonactive side
x = L: solid electrolyte interface
```

---

## Units

| Quantity              | Internal unit              | UI unit            |
| --------------------- | -------------------------- | ------------------ |
| length                | cm                         | µm                 |
| time                  | s                          | s, min, h          |
| concentration         | mmol cm^-3                 | mmol cm^-3         |
| diffusion coefficient | cm^2 s^-1                  | cm^2 s^-1          |
| current density       | A cm^-2                    | µA cm^-2, mA cm^-2 |
| capacity              | mAh cm^-2                  | mAh cm^-2          |
| temperature           | K internally for Arrhenius | °C in UI           |

---

## Constants

| Name               |             Value | Unit     |
| ------------------ | ----------------: | -------- |
| Faraday constant   |       96485.33212 | C mol^-1 |
| elementary charge  | not needed in MVP | -        |
| Boltzmann constant |    8.617333262e-5 | eV K^-1  |

---

## Default Material Parameters

| Parameter                              |   Value | Unit       | Source                |
| -------------------------------------- | ------: | ---------- | --------------------- |
| initial Li concentration               |    69.6 | mmol cm^-3 | Krauskopf et al. 2019 |
| beta lower bound                       |    24.0 | mmol cm^-3 | Krauskopf et al. 2019 |
| room-temperature diffusion coefficient | 3.0e-11 | cm^2 s^-1  | Krauskopf et al. 2019 |
| activation energy                      |    0.57 | eV         | Krauskopf et al. 2019 |

---

## Domain Invariants

- `thickness > 0`
- `diffusionCoeff > 0`
- `currentDensity >= 0`
- `initialConcentration > betaLowerBound`
- `gridCount >= 3`
- `maxTime > 0`
- `temperatureK > 0`
