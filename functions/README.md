# ego-functions

## 環境構築手順

- ローカルの node を 10 にする
- yarn install する
  - nuxt 本体は node10 にする必要があるが、cloud functions は node8 の為、package.json の engines で 8 を指定している
  - そのまま `yarn install` すると node のバージョン違いでコケてしまうので `yarn install --ignore-engines` を実行する

## ローカルデバッグ方法

[参考: ローカルでのファンクションの実行](https://firebase.google.com/docs/functions/local-emulator?hl=ja)

### １. ローカルのエミューレーターを起動

`yarn shell` を実行

### 2. Postman 等の RestClient ツールで実行する

URL は `http://localhost:5000/プロジェクト名/リージョン名/goalOnRequest` で良い

## デプロイ参考情報

functions を個別にデプロイする際は `functions:goalOnRequest` のように指定する
