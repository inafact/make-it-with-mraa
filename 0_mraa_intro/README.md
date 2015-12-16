## libmraaと内容の簡単な説明

[libmraa](https://github.com/intel-iot-devkit/mraa)はIntelが中心となって開発を行なっているオープンソースのGNU/Linux向けライブリです。

ライブラリはC/C++で書かれていますが、C/C++以外にも、バインディングが提供されているJavaScript/Python/(Java)などで書かれたアプリケーションから利用することで、ハードウェア・開発ボードのIO操作を行うことができます。

libmraaから扱えるデジタル・アナログ入出力や、I2C/SPI通信などの機能をIntel Edison上で実際に動かし、それらを使って簡単なアプリケーションを作ってみます。

なお、基本的にはIntel Edison + Intel Arduino board上での動作を前提としますが、[現状サポートされているハートウェア・開発ボードは実はIntel製である EdisonやGalileo以外にもRaspberry PiやBagelebone Blackなど](https://github.com/intel-iot-devkit/mraa#supported-boards)があり、IOピンのマッピングは内部的に行われるので、異なるプラットフォームで共通のソースコードが利用できます。


## 0. とりあえず使ってみる(デジタル出力/Blink)、libmraaのアップデート、ドキュメントへのリンクなど

### とりあえずLチカ

Intel Edisonは最新版のファームウェアにアップデートしておきます。

[githubのREADME](https://github.com/intel-iot-devkit/mraa#installing-on-your-board)にはopkgの追加作業が書いてありますが、[最新版のファームウェア](https://software.intel.com/en-us/iot/hardware/edison/downloads)で単にlibmraaを使うだけであればこの作業は不要です。

何もしない状態だとv0.5.2のlibmraaがインストールされているようです(2015年11月現在、edison-iotdk-image-280915.zipにアップデートしただけの状態)。

wifiなどの設定をし、Edisonがインターネットに接続された状態にします。sshやscreenなどでEdisonにログインし、下記のコマンドを実行します。

```bash
curl https://raw.githubusercontent.com/intel-iot-devkit/mraa/master/examples/javascript/Blink-IO.js | node
```

または

```bash
curl https://raw.githubusercontent.com/inafact/make-it-with-mraa/master/0_mraa_intro/0_Blink-IO.py | python
```

Arduinoボード上にあるLEDが点滅したでしょうか？

最初のコマンドはNode.jsから、２番目のコマンドはPythonからlibmraaを利用したいわゆる「Lチカ」プログラムです。


### libmraaのアップデート

開発はそこそこのスピードで行われているようなので、より新しいものを使うためには前述の通り、opkgの追加記述を行います。

```bash
echo "src mraa-upm http://iotdk.intel.com/repos/2.0/intelgalactic" > /etc/opkg/mraa-upm.conf
opkg update
opkg install libmraa0
```

その他の詳細については[githubの項目](https://github.com/intel-iot-devkit/mraa#installing-on-your-board)の通りですが、opkgでダウンロードされる内容は

http://iotdk.intel.com/repos/

の「各バージョン番号/intelgalactic/」を確認してみるとわかります。


### APIドキュメントなど

各言語のAPIドキュメントはgithubのソースコードからコンパイルすることもできますが、オンラインものも下記にまとめられています。

https://github.com/intel-iot-devkit/mraa#api-documentation

また、ArduinoのIDEなどからEdisonを利用していた場合に注意しておきたいのはlibmraaのIOピンのマッピングで、Edisonのものは[こちら](http://iotdk.intel.com/docs/master/mraa/edison.html)にあるので確認しておくと良いでしょう。


---

以降は[githubのレポジトリ](https://github.com/inafact/make-it-with-mraa/tree/master/0_mraa_intro)にあるソースコードを順を追って試していきます。

同一の回路をPythonとJavaScript(Node.js)で同じように動かしていきます。

_＊ちなみに内容のベースは[libmraa本家のexample](https://github.com/intel-iot-devkit/mraa/tree/master/examples)です。_

ブレッドボード上の回路はPDFもしくは[Fritzing](http://fritzing.org/home/)のドキュメントを同梱していますので、そちらを参考にしてください。


ソースコードは

https://github.com/inafact/make-it-with-mraa.git

からEdison上にgitでcloneしてくるか、

> _gitの導入については[こちら](http://edison-lab.jp/blog/2015/07/lets-make-edison-beacon-code.html#step04)の記事も参考に_

https://github.com/inafact/make-it-with-mraa/releases

から最新のものをダウンロードして、Edison上に展開します。


- gitでcloneする場合の例

```bash
git clone https://github.com/inafact/make-it-with-mraa.git
```

- wgetでのダウンロード＆展開例（＊展開されるディレクトリはmake-it-with-mraa-x.x.x[xはバージョン番号]のようになります）

```bash
wget -qO- https://github.com/inafact/make-it-with-mraa/archive/0.0.1.tar.gz | tar xvz
```

展開もしくはcloneしてきたら、このセクションのディレクトリに移動しておきます。

```bash
cd make-it-with-mraa/0_mraa_intro
```

## 1. デジタル入力

![1_pdf](https://github.com/inafact/make-it-with-mraa/raw/master/0_mraa_intro/1_GPIO_DigitalRead.jpg)

タクトスイッチのON/OFFを読みとって値をコンソールに表示します

```bash
python 1_GPIO_DigitalRead.py
```

```bash
node 1_GPIO_DigitalRead.js
```

## 2. アナログ入力

可変抵抗器の値を読みとって値をコンソールに表示します

```bash
python 2_AioA0.py
```

```bash
node 2_AioA0.js
```

## 3. 割り込み処理（ロータリーエンコーダー）

ロータリーエンコーダーのクリックを読みとって割り込みイベントを発生させ、それによってインクリメント・デクリメント(基準の数に+1したり-1したりする)された数値をコンソールに表示します

```bash
python 3_IsrRotaryEncoder.py
```

```
node 3_IsrRotaryEncoder.js
```

## 4. 簡単なGUIを作ってみる

前項まではコンソールからプログラムを実行し、数値等出力もコンソール内で行っていました。
実際にもっと複雑なアプリケーションを作る際にはもう少しグラフィカルなインターフェースであったり、リアルタイムに入力をコントロールする必要があるかと思います。

最後の項ではNode.js + Websocket(Socket.io) + HTML5/JavaScriptを組み合わせて、前項までの回路をWebブラウザ上のインターフェースからコントロールしたり、モニタリングできるようにしてみます。

アプリケーションのディレクトリに移動します。

```bash
cd 4_WebGuiTest
```

Node.jsのモジュールをインストールします。

> _Node.jsのモジュールのインストールなどについては[こちら](http://edison-lab.jp/blog/2015/05/lets-make-edison-node-js.html#step05)の記事も参考に_

```bash
npm install --prod
```

回路を組んだ状態でWebサーバーを起動します。

```bash
npm run server
```

Edisonと同じネットワーク内にいるコンピューターやスマートフォンからEdisonの8080番ポートにアクセスします。
[![https://gyazo.com/ee60659f019e8283ffc877d58ad51238](https://i.gyazo.com/ee60659f019e8283ffc877d58ad51238.png)](https://gyazo.com/ee60659f019e8283ffc877d58ad51238)

- アナログ入力（A0）からの入力値を、タクトスイッチを押している間だけグラフにプロットします。

  [![https://gyazo.com/dc5b2d685e783ea981416f130f42e38f](https://i.gyazo.com/dc5b2d685e783ea981416f130f42e38f.gif)](https://gyazo.com/dc5b2d685e783ea981416f130f42e38f)

- ロータリーエンコーダーではグラフ横軸のスケール調整ができます（1~100）

  [![https://gyazo.com/0e68ea08d165dc9c01262ea70df03000](https://i.gyazo.com/0e68ea08d165dc9c01262ea70df03000.gif)](https://gyazo.com/0e68ea08d165dc9c01262ea70df03000)

- ブラウザ側の画面下部のスライダーでは更新頻度を変更できます（1~100。１の時30FPS - だいたい30ミリ秒に１回 - で更新、以降等倍で更新頻度を下げます）。
