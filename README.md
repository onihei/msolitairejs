# msolitairejs
Mahjong Solitaire with native Javascript ES6

ES6で書かれた麻雀ソリティアです。麻雀ソリティアは麻雀牌のペアを取り除くシンプルなゲームです。

<img src="./ss.jpg" width="600px" alt="画面">

## 遊ぶ
[https://onihei.github.io/msolitairejs](https://onihei.github.io/msolitairejs)

![スマートフォンでも動作します](./qr.png)

## 開発者用

### 技術要素
1. ES6
2. Enhanced Metafile (EMF)
3. Canvas API
4. Web Audio API
5. Web Storage API
6. バックトラッキング

### リソースの説明
#### background
自分のアルバムから持ってきた写真をPhotoshopで縮小しました。

#### drawable
Illustratorで出力した [Enhanced Metafile (EMF)](https://docs.microsoft.com/ja-jp/openspecs/windows_protocols/ms-emf/)です。EMFは軽量でフォーマットが公開されている画像フォーマットです。ベジェ曲線も扱えます。Javascriptでベクター画像を再生するのにちょうどよいので採用しました。

EMF は Windowsのグラフィックスコンテキストへの操作をそのまま記録したようなフォーマットです。そのためベジェ曲線以外の機能を持っていますが、作成したパーサは必要な機能しかデコードしていません。

EMF はグラデーションの塗り潰しができません。グラデーションを使用したイラストを Illustrator で EMF に出力できますが、その部分はビットマップ画像になるので注意が必要です。

ベクター画像の作成には Illustrator と sketch を使用しました。

#### level
[Platinum](https://www.vector.co.jp/soft/win95/game/se231004.html)で出力したFMFファイルです。牌の配列をこれで作成しました。5つのレイヤーがあり、同じ位置の牌が重なるようにしました。
このファイルに記録しているのは配置場所だけです。実際に配置する麻雀牌は実行時に決定します。

#### sound
パブリックドメインのmidiをガレージバンドで変換しました。
