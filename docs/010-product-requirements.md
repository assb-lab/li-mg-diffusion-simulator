# Product Requirements

Status: Accepted

## Product Name

Li-Mg Alloy Diffusion Simulator

---

## Product Vision

Li-rich Li-Mg alloy anodes on LLZO-type solid electrolytes の拡散律速を、研究者が直感的に理解・再現・探索できる軽量Webアプリを作る。

---

## Primary Goal

Krauskopf et al. 2019 の Figure 9 / Figure 10 に対応する Li0.9Mg0.1 合金負極の1D化学拡散モデルを再現し、以下を可視化する。

- concentration profile `c_Li(x, t)`
- delithiation current density dependence
- temperature dependence
- beta-phase Li utilization
- total Li utilization estimate

---

## Target Users

- 全固体電池研究者
- 電池メーカーR&D担当者
- 材料科学・電気化学を学ぶ学生
- 論文再現を行う開発者

---

## Core User Stories

### US-01: Figure 9を再現したい

ユーザーは、25 µm厚 Li0.9Mg0.1 anode について、10 µA cm^-2、100 µA cm^-2、1 mA cm^-2の濃度プロファイルを表示できる。

### US-02: 電流密度を変えたい

ユーザーは、任意の電流密度を入力し、beta-phase lower boundに到達するまでの濃度変化と利用率を確認できる。

### US-03: 温度依存性を見たい

ユーザーは、Arrhenius型の拡散係数 `D(T)` を使って、温度ごとの利用率を比較できる。

### US-04: 設計パラメータを探索したい

ユーザーは、厚み、D、初期濃度、beta lower boundを変更し、利用率・停止時間・容量を探索できる。

### US-05: 結果を保存したい

ユーザーは、simulation resultをCSV、JSON、PNGとして保存できる。

---

## Success Criteria

### Figure 9 Acceptance

室温相当、Li0.9Mg0.1、25 µm級 anode において、beta-phase Li utilizationが論文値に対して ±5 percentage points以内であること。

| Current density | Target beta-phase Li utilization |
| --------------: | -------------------------------: |
|     10 µA cm^-2 |                              93% |
|    100 µA cm^-2 |                              41% |
|      1 mA cm^-2 |                               9% |

参考として、total Li utilizationは以下を目標にする。

| Current density | Target total Li utilization |
| --------------: | --------------------------: |
|     10 µA cm^-2 |                         61% |
|    100 µA cm^-2 |                         27% |
|      1 mA cm^-2 |                          6% |

---

## Non-goals for MVP

- 純Li金属の3D pore formation model
- 表面拡散・粒界拡散・転位拡散の明示的モデル化
- 力学連成
- LLZO内部のLi輸送モデル
- electrochemical Butler-Volmer kinetics
- 実験データ自動フィッティング
- ユーザーアカウント
- サーバーサイドDB
