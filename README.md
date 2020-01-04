# msolitairejs
Mahjong Solitaire with native Javascript ES6

ES6で書かれた麻雀ソリティアです。麻雀ソリティアは麻雀牌のペアを取り除くシンプルなゲームです。

![画面](./ss.jpg)


## 遊ぶ
[https://onihei.github.io/msolitairejs](https://onihei.github.io/msolitairejs)

![スマートフォンでも動作します](./qr.png)

## 開発者用

### 技術要素
1. ES6
2. Enhanced Metafile (EMF)
3. Web Audio API
4. Canvas
5. バックトラッキング

### リソースの説明
#### background
自分のアルバムから持ってきた写真をPhotoshopで縮小しました。

#### drawable
Illustratorで出力した [Enhanced Metafile (EMF)](https://docs.microsoft.com/ja-jp/openspecs/windows_protocols/ms-emf/)です。EMFは軽量でフォーマットが公開されているベクター画像です。ベジェ曲線も扱えます。Javascriptでベクター画像を再生するのにちょうどよいので採用しました。

#### level
[Platinum](https://www.vector.co.jp/soft/win95/game/se231004.html)で出力したFMFファイルです。牌の配列をこれで作成しました。5つのレイヤーがあり、同じ位置の牌が重なるようにしました。

#### sound
パブリックドメインのmidiをガレージバンドで変換しました。
