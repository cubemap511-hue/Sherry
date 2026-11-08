# Sherry / MellowCherie

公開サイト: https://cubemap511-hue.github.io/Sherry/

GitHub Pagesの静的サイトです。HTML・CSS・JavaScript・画像・カレンダーの予定データを、このリポジトリだけで管理します。外部のAPIやデータベースは使用しません。

## カレンダーの更新

[予定データを編集](https://github.com/cubemap511-hue/Sherry/edit/main/events.json)して、`main` に保存します。GitHub Pagesの公開処理完了後、カレンダーへ反映されます。

```json
{
  "events": [
    {
      "id": "event-001",
      "date": "2026-12-01",
      "title": "イベント名",
      "time": "14:00",
      "details": "イベントのご案内"
    }
  ]
}
```

- `id`: 予定ごとに重複しない文字列
- `date`: 開催日（`YYYY-MM-DD`）
- `title`: イベント名
- `time`: 開始時間（`HH:mm`）。未定は空文字 `""`
- `details`: ご案内。改行は `\n`、未記入は空文字 `""`

このサンプルは実際の予定ではありません。予定がない場合は `{"events": []}` にします。

更新案内ページ: https://cubemap511-hue.github.io/Sherry/admin/

以前の共通パスワードによるサーバー保存は廃止し、GitHubのリポジトリ編集権限で管理する構成に戻しています。[GitHub Pagesは静的サイト用のサービス](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)です。

## サイトのファイル

- `index.html`: 本文・ロゴの表示・最初の本の演出
- `logo.png`: ブランドロゴ
- `calendar.css`: カレンダー、クリック演出、背景バブルの見た目
- `calendar.js`: カレンダー表示、ランダムなハートとリボン、背景バブル
- `events.json`: 全訪問者に公開する予定
- `admin/index.html`: GitHubから予定を更新する方法の案内

パスワード・APIキー・セッション用の秘密情報を、この公開リポジトリに保存しないでください。
