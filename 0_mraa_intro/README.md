1. [libmraaと内容の簡単な説明](#libmraaと内容の簡単な説明)
   - [本セクションで使うもの](#本セクションで使うもの)
2. [とりあえず使ってみる\(デジタル出力/Blink\)](#とりあえず使ってみる（デジタル出力/Blink）)
   1. [とりあえずLチカ](#とりあえずLチカ)
   2. [libmraaのアップデート](#libmraaのアップデート)
   3. [APIドキュメントなど](#APIドキュメントなど)
3. [デジタル入力](#デジタル入力)
4. [アナログ入力](#アナログ入力)
5. [割り込み処理](#割り込み処理)
6. [簡単なGUIを作ってみる](#簡単なGUIを作ってみる)

---

# libmraaと内容の簡単な説明

[libmraa](https://github.com/intel-iot-devkit/mraa)はIntelが中心となって開発を行なっているオープンソースの[GNU/Linux](https://ja.wikipedia.org/wiki/GNU/Linux%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0)向けライブリです。

ライブラリはC/C++で書かれていますが、C/C++以外にも、バインディングが提供されているJavaScript/Python/(Java)などで書かれたアプリケーションから利用することで、開発ボードなどハードウェアのIO操作を行うことができます。

libmraaから扱えるデジタル・アナログ入出力や、I2C/SPI通信などの機能をIntel Edison上で実際に動かし、それらを使って簡単なアプリケーションを作ってみます。

なお、以降のサンプルプログラム等は基本的にIntel Edison + Intel Arduino board上での動作を前提としますが、[現状サポートされているハードウェアはIntel製である EdisonやGalileo以外にもRaspberry PiやBagelebone Blackなど](https://github.com/intel-iot-devkit/mraa#supported-boards)があり、IOピンのマッピングは内部的に行われるので、異なるプラットフォームで共通のソースコードが利用できます。

本セクションではlibmraaを使ったごく基本的なGPIOの操作を行うプログラムをPythonとJavaScript(Node.js)それぞれで実装し、実際にEdison内で動かしてみます。

## 本セクションで使うもの
- Intel Edison + Arudino board
- ホストコンピューター（Intel Edisonへsshやscreen等でアクセスする）
- 可変抵抗器（http://akizukidenshi.com/catalog/g/gP-03277/ http://akizukidenshi.com/catalog/g/gP-00246/ など。特に値の指定はなし。ブレッドボードに刺せるものが望ましい）
- タクトスイッチ 3個（http://akizukidenshi.com/catalog/g/gP-03647/ http://www.switch-science.com/catalog/38/ など）


# とりあえず使ってみる（デジタル出力/Blink）

## とりあえずLチカ

Intel Edisonは最新版のファームウェアにアップデートしておきます。

[本家githubのREADME](https://github.com/intel-iot-devkit/mraa#installing-on-your-board)に_[opkg](#opkg)_の追加作業が書いてありますが、[最新版のファームウェア](https://software.intel.com/en-us/iot/hardware/edison/downloads)で単にlibmraaを使うだけであればこの作業は不要です。

##### _[opkg]_
> 多くのLinuxディストリビューションではパッケージ管理システムを利用してOS内で利用されるライブラリの依存関係などを管理し、アプリケーションの導入や開発を行いやすくしています。

> opkgはEdisonのデフォルトOSイメージのベースとなっている[Yocto Project](https://www.yoctoproject.org/)によって開発・提供されている軽量なパッケージ管理システムです。

> Edison上でアプリケーションを利用したり、開発を行ったりする上で必要なライブラリ群をopkgコマンドを利用してインストールし、管理することができます。

何もしない状態だとv0.5.2のlibmraaがインストールされているようです(2015年11月現在、edison-iotdk-image-280915.zipにアップデートしただけの状態)。

wifiなどの設定をし、Edisonがインターネットに接続された状態にします。sshやscreenなどでEdisonにログインし、下記のコマンドを実行します。


```bash
curl https://raw.githubusercontent.com/inafact/make-it-with-mraa/master/0_mraa_intro/0_Blink-IO.py | python
```

または

```bash
curl https://raw.githubusercontent.com/intel-iot-devkit/mraa/master/examples/javascript/Blink-IO.js | node
```

Arduinoボード上にあるLEDが点滅したでしょうか？

最初のコマンドはPythonから、２番目のコマンドはNode.jsからlibmraaを利用したいわゆる「Lチカ」プログラムです。
両者ともオンライン上にアップロードしてあるソースコードをダウンロードしてきて、Edison内で実行する、というものです。


## libmraaのアップデート

libmrraの開発はそこそこのスピードで行われているようなので、より新しいものを使うためには前述の通り、opkgの追加記述を行いましょう。

```bash
echo "src mraa-upm http://iotdk.intel.com/repos/2.0/intelgalactic" > /etc/opkg/mraa-upm.conf
opkg update
opkg install libmraa0
```

その他、詳細については[githubの項目](https://github.com/intel-iot-devkit/mraa#installing-on-your-board)の通りですが、上記の追記でopkgによって管理されるようになる内容は

http://iotdk.intel.com/repos/

の「各バージョン番号/intelgalactic/」を確認してみるとわかります。


## APIドキュメントなど

各言語のAPIドキュメントはgithubのソースコードからコンパイルすることもできますが、オンラインのものも下記にまとめられています。

https://github.com/intel-iot-devkit/mraa#api-documentation

また、ArduinoのIDEなどからEdisonを利用していた場合に注意しておきたいのはlibmraaのIOピンのマッピングで、Edisonのものは[こちら](http://iotdk.intel.com/docs/master/mraa/edison.html)にあるので確認しておくと良いでしょう。


---

以降は[githubのレポジトリ](https://github.com/inafact/make-it-with-mraa/tree/master/0_mraa_intro)にあるソースコードの順を追っていきます。

最後の項目を除いて、各項ともにPythonとJavaScript(Node.js)のプログラムがありますが、基本的に同一の回路を同じように動かすものです。

_＊ちなみに内容のベースは[libmraa本家のexample](https://github.com/intel-iot-devkit/mraa/tree/master/examples)です。_

ブレッドボード上に用意する回路はPDF及び[Fritzing](http://fritzing.org/home/)のドキュメントを同梱していますので、そちらを参考にしてください。


ソースコードは

https://github.com/inafact/make-it-with-mraa.git

からEdison上にgitでcloneしてくるか、

> _gitの導入については[こちら](http://edison-lab.jp/blog/2015/07/lets-make-edison-beacon-code.html#step04)の記事も参考に_

https://github.com/inafact/make-it-with-mraa/releases

から最新のものをダウンロードして、Edison上に展開します。


### gitでcloneする場合の例

```bash
git clone https://github.com/inafact/make-it-with-mraa.git
```

### wgetでのダウンロード＆展開例（＊展開されるディレクトリはmake-it-with-mraa-x.x.x[xはバージョン番号]のようになります）

```bash
wget -qO- https://github.com/inafact/make-it-with-mraa/archive/0.0.1.tar.gz | tar xvz
```

展開もしくはcloneしてきたら、このセクションのディレクトリに移動しておきます。

```bash
cd make-it-with-mraa/0_mraa_intro
```

# デジタル入力

![1_jpg](https://github.com/inafact/make-it-with-mraa/raw/master/0_mraa_intro/1_GPIO_DigitalRead.jpg)

1秒ごとにタクトスイッチのON/OFFを読み取り、値をコンソールに表示します。

### Pythonから実行

```bash
python 1_GPIO_DigitalRead.py
```
### Node.jsから実行

```bash
node 1_GPIO_DigitalRead.js
```

# アナログ入力

![2_jpg](https://github.com/inafact/make-it-with-mraa/raw/master/0_mraa_intro/2_AioA0.jpg)

1秒ごとに可変抵抗器の値を読みとって値をコンソールに表示します。

### Pythonから実行

```bash
python 2_AioA0.py
```

### Node.jsから実行

```bash
node 2_AioA0.js
```

# 割り込み処理

![3_jpg](https://github.com/inafact/make-it-with-mraa/raw/master/0_mraa_intro/3_Isr.jpg)

二つのタクトスイッチのHi/Loの変化を読みとって割り込みイベントを発生させ、それによってインクリメント・デクリメント(基準の数に+1したり-1したりする)された数値をコンソールに表示します。
先ほどまでの例と異なり、スイッチ側がトリガを発生させるので、変化した時のみコンソールに値が出力されるようになります。

### Pythonから実行

```bash
python 3_Isr.py
```

### Node.jsから実行

```
node 3_Isr.js
```

# 簡単なGUIを作ってみる

![4_jpg](https://github.com/inafact/make-it-with-mraa/raw/master/0_mraa_intro/4_WebGuiTest.jpg)


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

Edisonと同じネットワーク内にいるコンピューターやスマートフォンからEdisonの8888番ポートにアクセスします。

[![https://gyazo.com/ee60659f019e8283ffc877d58ad51238](https://i.gyazo.com/ee60659f019e8283ffc877d58ad51238.png)](https://gyazo.com/ee60659f019e8283ffc877d58ad51238)

各入力は次の動作に対応しています。

- アナログ入力（A0）からの入力値を、タクトスイッチを押している間だけグラフにプロットします。

  [![https://gyazo.com/dc5b2d685e783ea981416f130f42e38f](https://i.gyazo.com/dc5b2d685e783ea981416f130f42e38f.gif)](https://gyazo.com/dc5b2d685e783ea981416f130f42e38f)

- 中央ふたつのタクトスイッチではグラフ横軸のスケール調整ができます（1~100倍）。図の左側（PIN 6）で拡大、図の右側（PIN 7）で縮小です。

  [![https://gyazo.com/0e68ea08d165dc9c01262ea70df03000](https://i.gyazo.com/0e68ea08d165dc9c01262ea70df03000.gif)](https://gyazo.com/0e68ea08d165dc9c01262ea70df03000)

- ブラウザ側の画面下部のスライダーでは更新頻度を変更できます（1~100。１の時30FPS - だいたい30ミリ秒に１回 - で更新、以降等倍で更新頻度を下げます）。
