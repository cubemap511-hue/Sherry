# Sherry / MellowCherie

公開サイト: https://cubemap511-hue.github.io/Sherry/

公開サイトはこのGitHubリポジトリからGitHub Pagesへ公開します。予定を登録する管理フォームとデータ保存だけSitesを使います。

## 予定の追加・編集・削除

管理フォーム: https://mellowcherie-pastel.folksyinlet.chatgpt.site/admin

共通パスワードでログインし、開催日・イベント名・時間・詳細を入力して保存します。GitHubアカウントは不要です。管理フォームはパスワードを共有したメンバー向けです。

保存した予定は公開カレンダーの再読み込み・画面復帰時に反映されます。開いたままのカレンダーも30秒ごとに更新します。予定データはすべての訪問者に公開されます。

以前の更新案内URL https://cubemap511-hue.github.io/Sherry/admin/ からも管理フォームへ移動できます。公開サイト内には管理用リンクを表示しません。

## ファイル

- index.html: 本文・ロゴ・最初の本の演出
- logo.png: ブランドロゴ
- calendar.css: カレンダー、クリック演出、背景バブル
- calendar.js: カレンダーと演出。Sitesの公開APIから予定を取得
- admin/index.html: 管理フォームへの案内・移動
- events.json: 以前の静的運用時のバックアップ。現在の表示・更新には使いません

Sites側は公開予定の読み取りAPIとパスワード認証付き管理フォームを提供します。GitHubの公開元からは予定の読み取りだけを許可し、変更は管理フォーム内で認証した場合に限ります。

パスワード・APIキー・セッション用の秘密情報は、この公開リポジトリに保存しません。
