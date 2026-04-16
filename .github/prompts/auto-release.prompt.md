---
mode: agent
tools:
  - changes
  - terminal
  - codebase
description: 機能更新後の VerUp・commit・push・deploy を自動実施
---

# Auto Release Skill

機能追加・不具合修正が完了し、実装確認が取れたら次を自動実行する。

1. 変更内容を3行以内で要約し、リリースノート用の短文を作る。
2. 次のコマンドを実行する。

```bash
npm run release:auto -- --type patch --notes "<項目1>|<項目2>|<項目3>"
```

3. 実行結果を確認し、次を報告する。
- 新バージョン
- コミットID
- push成功可否
- deployトリガー結果

## オプション

- buildを省略する: `--skip-build`
- deployを省略する: `--skip-deploy`
- バージョン更新だけ確認する: `--dry-run`
- minor/majorを使う: `--type minor` または `--type major`
