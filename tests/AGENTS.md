# tests/AGENTS.md

## Scope

`tests` は横断的なintegration test、acceptance test、fixtureを格納する。

---

## Rules

- テスト名は振る舞いを説明する
- モックは極力使わない
- fixture は出典と意味を明記する
- Figure 9 / Figure 10 再現テストは acceptance として扱う
- 失敗時にどの物理量がずれたか分かるassertion messageを書く

---

## Coverage Goal

全体80%以上。

ただし、数値モデルのacceptance testはカバレッジ目的ではなく、再現性保証を目的とする。
