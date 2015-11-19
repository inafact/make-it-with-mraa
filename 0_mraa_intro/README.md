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

ライブラリ自体のドキュメントはgithubのソースコードからコンパイルするか、オンラインのものを参考にしてください。

- [C/C++](http://iotdk.intel.com/docs/master/mraa/)
- [Python](http://iotdk.intel.com/docs/master/mraa/python/)
- [JavaScript](http://iotdk.intel.com/docs/master/mraa/node/modules/mraa.html)

ArduinoのIDEなどからEdisonを利用していた場合に注意しておきたいのはlibmraaのIOピンのマッピングで、Edisonのものは[こちら](http://iotdk.intel.com/docs/master/mraa/edison.html)にあるので確認しておくと良いでしょう。


---

以降は[githubのレポジトリ](https://github.com/inafact/make-it-with-mraa/tree/master/0_mraa_intro)にあるソースコードを順を追って試していきます。

同一の回路をPythonとJavaScript(Node.js)で同じように動かしていきます。

_＊ちなみに内容のベースは[libmraa本家のexample](https://github.com/intel-iot-devkit/mraa/tree/master/examples)です。_

ブレッドボード上の回路はPDFもしくは[Fritzing](http://fritzing.org/home/)のドキュメントを同梱していますので、そちらを参考にしてください。


## 1. デジタル出力

```
python 1_GPIO_DigitalRead.py
```

```
node 1_GPIO_DigitalRead.js
```

## 2. アナログ入力

```
python 2_AioA0.py
```

```
node 2_AioA0.js
```

## 3. 割り込み処理（ロータリーエンコーダー）

```
python 3_IsrRotaryEncoder.py
```

```
node 3_IsrRotaryEncoder.py
```

## 4. 簡単なGUIを作ってみる

前項まではコンソールからプログラムを実行し、数値等出力もコンソール内で行っていました。
実際にもっと複雑なアプリケーションを作る際にはもう少しグラフィカルなインターフェースであったり、リアルタイムに入力をコントロールする必要があるかと思います。

最後の項ではNode.js + Websocket(Socket.io) + HTML5/JavaScriptを組み合わせて、前項までの回路をWebブラウザ上のインターフェースからコントロール／モニタリングできるようにしてみます。

必要なモジュールをインストールして、GUI用のスクリプトをコンパイルします。

https://github.com/inafact/make-it-with-mraa.git

からEdison上にソースをcloneしてくるか、

https://github.com/inafact/make-it-with-mraa/releases

から最新のものをダウンロードして、Edison上に展開します。

```
cd 0_mraa_intro/4_WebGuiTest
npm install --prod
```

回路を組んだ状態でWebサーバーを起動します。

```
npm run server
```

Edisonと同じネットワーク内にいるコンピューターやスマートフォンからEdisonの8080番ポートにアクセスします。
![image_1](https://gyazo.com/ee60659f019e8283ffc877d58ad51238)

- アナログ入力（A0）からの入力値を、タクトスイッチを押している間だけグラフを更新します。

  ![image_2](https://gyazo.com/0e68ea08d165dc9c01262ea70df03000)

- ロータリーエンコーダーはグラフ横軸のスケール調整（1~100）

  ![image_3](https://gyazo.com/0e68ea08d165dc9c01262ea70df03000)

- 画面側のスライダーは更新頻度を変更します（1~100。１の時30FPSで更新、以降等倍で更新頻度を下げます）。
