<script setup>

import {onMounted, ref} from "vue";

const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  isSp: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};

// ウィンドウオープン処理
const handleWopenClick = (event) => {
  event.preventDefault();

  const element = event.currentTarget;
  const w2 = parseInt(screen.width / 2) - 20;
  const top = 50; // for parent title bar

  const span = element.querySelector('span');

  if (span && span.classList.contains('ui-icon-arrow-2-e-w')) {
    // 横比較の場合
    const td = element.closest('td');
    const prevTd = td.previousElementSibling;
    const nextTd = td.nextElementSibling;

    const aElement = prevTd?.querySelector('a');
    const bElement = nextTd?.querySelector('a');

    if (aElement && bElement) {
      const wL = window.open(
        aElement.href,
        '1',
        `top=${top},left=0,height=${screen.height - top * 4},width=${w2}`
      );
      const wR = window.open(
        bElement.href,
        '2',
        `top=${top},left=${w2 + 20},height=${screen.height - top * 4},width=${w2}`
      );

      // スクロール同期
      setupScrollSync(wL, wR);
    }
  } else if (span && span.classList.contains('ui-icon-arrow-2-n-s')) {
    // 縦比較の場合
    const td = element.closest('td');
    const tdIndex = Array.from(td.parentNode.children).indexOf(td);
    const tr = element.closest('tr');

    const prevTr = tr.previousElementSibling;
    const nextTr = tr.nextElementSibling;

    const aElement = prevTr?.children[tdIndex]?.querySelector('a');
    const bElement = nextTr?.children[tdIndex]?.querySelector('a');

    if (aElement && bElement) {
      const wL = window.open(
        aElement.href,
        '1',
        `top=${top},left=0,height=${screen.height - top * 4},width=${w2}`
      );
      const wR = window.open(
        bElement.href,
        '2',
        `top=${top},left=${w2 + 20},height=${screen.height - top * 4},width=${w2}`
      );

      // スクロール同期
      setupScrollSync(wL, wR);
    }
  } else {
    // 単一ウィンドウオープン
    const td = element.closest('td');
    const tdIndex = Array.from(td.parentNode.children).indexOf(td);
    const windowName = tdIndex === 0 ? '1' : '2';
    const leftPos = tdIndex === 0 ? 0 : w2 + 20;

    window.open(
      element.href,
      windowName,
      `left=${leftPos},top=${top},height=${screen.height - top * 4},width=${w2}`
    );
  }
};

// スクロール同期設定
const setupScrollSync = (wL, wR) => {
  if (wL && wR) {
    // 左ウィンドウのスクロールイベント
    wL.addEventListener('scroll', () => {
      if (wR && !wR.closed) {
        wR.scrollTo(wL.scrollX, wL.scrollY);
      }
    });

    // 右ウィンドウのスクロールイベント
    wR.addEventListener('scroll', () => {
      if (wL && !wL.closed) {
        wL.scrollTo(wR.scrollX, wR.scrollY);
      }
    });
  }
};

onMounted(async () => {
  // await loadScriptJQueryUI();
});
</script>

<template>
  <div id="panel_ana" class="bg-theme-col2 dc_panel drag" v-show="options.is_show" style="display: none;">
    <div class="chart-title-wrap">
      <span class="chart-title text-theme-col2" v-html="options.title"></span>
      <span class="ui-icon ui-icon-circle-close sp_icon btn_close" @click="handleClose"></span>
    </div>
    <div class="clearfix"></div>

    <div id="ana_diff_ls">
      <table id="tbl_ana" border="1" bordercolor="#b0b0b0" style="float:left;">
        <caption class="bg-theme-col">第N波</caption>
        <thead>
        <tr>
          <th><span class="ui-icon ui-icon-window"></span>左ウインドウ</th>
          <th></th>
          <th><span class="ui-icon ui-icon-window"></span>右ウィンドウ</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>全国 第1波(前半)<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                      :href="`${options.href}&date=2020-03-16+2020-04-19&light=1`"
                                      @click="handleWopenClick">3/15(日)～4/19(日)</a>
          </td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td>全国 第2波(前半)<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                      :href="`${options.href}&date=2020-06-22+2020-07-26&light=1`"
                                      @click="handleWopenClick">6/22(月)～7/26(日)</a>
          </td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
            </div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
            </div>
          </td>
        </tr>
        <tr>
          <td>千葉県 第1波<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                  :href="`${options.href}&name=千葉県&date=2020-03-21+32&light=1`"
                                  @click="handleWopenClick">3/21(土)～4/22(水)</a>
          </td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
            </div>
          </td>
          <td>千葉県 第2波<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                  :href="`${options.href}&name=千葉県&date=2020-06-21+32&light=1`"
                                  @click="handleWopenClick">6/21(日)～7/23(木)</a>
          </td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
            </div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
            </div>
          </td>
        </tr>
        <tr>
          <td>福岡県 第1波<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                  :href="`${options.href}&name=福岡県&date=2020-03-26+17&light=1`"
                                  @click="handleWopenClick">3/26(木)～4/12(日)</a>
          </td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
            </div>
          </td>
          <td>福岡県 第3波<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                  :href="`${options.href}&name=福岡県&date=2020-07-09+17&light=1`"
                                  @click="handleWopenClick">7/9(木)～7/26(日)</a>
          </td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
            </div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較
            </div>
          </td>
        </tr>
        <tr>
          <td>福岡市 第1波<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                  :href="`${options.href}&q=福岡市&date=2020-03-26+17&light=1`"
                                  @click="handleWopenClick">3/26(木)～4/12(日)</a>
          </td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較
            </div>
          </td>
          <td>福岡市 第2波<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                  :href="`${options.href}&q=福岡市&date=2020-07-09+17&light=1`"
                                  @click="handleWopenClick">7/9(木)～7/26(日)</a>
          </td>
        </tr>
        </tbody>
      </table>

      <table id="tbl_ana" border="1" bordercolor="#b0b0b0">
        <caption class="bg-theme-col">地域</caption>
        <thead>
        <tr>
          <th><span class="ui-icon ui-icon-window"></span>左ウインドウ</th>
          <th></th>
          <th><span class="ui-icon ui-icon-window"></span>右ウィンドウ</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=福岡市&light=1`" @click="handleWopenClick">福岡市</a></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=北九州市&light=1`" @click="handleWopenClick">北九州市</a></td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
        </tr>
        <tr>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=札幌市&light=1`" @click="handleWopenClick">札幌市</a></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=旭川市&light=1`" @click="handleWopenClick">旭川市</a></td>
        </tr>
        <tr>
          <td>東京都隣接県A<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                   :href="`${options.href}&name=埼玉県&light=1`" @click="handleWopenClick">埼玉県</a></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td>東京都隣接県B<br/><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&name=神奈川県&light=1`" @click="handleWopenClick">神奈川県</a>
          </td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
        </tr>
        <tr>
          <td>大阪府隣接県A<br/><a class="wopen ui-button ui-corner-all ui-widget"
                                   :href="`${options.href}&name=兵庫県&light=1`" @click="handleWopenClick">兵庫県</a></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td>大阪府隣接県B<br/><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&name=京都府&light=1`" @click="handleWopenClick">京都府</a>
          </td>
        </tr>
        </tbody>
      </table>

      <table id="tbl_ana" border="1" bordercolor="#b0b0b0">
        <caption class="bg-theme-col">職業、その他</caption>
        <thead>
        <tr>
          <th><span class="ui-icon ui-icon-window"></span>左ウインドウ</th>
          <th></th>
          <th><span class="ui-icon ui-icon-window"></span>右ウィンドウ</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=学生&light=1`" @click="handleWopenClick">学生</a></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=医療従事者&light=1`" @click="handleWopenClick">医療従事者</a></td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
        </tr>
        <tr>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=社会人&light=1`" @click="handleWopenClick">社会人</a></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&q=介護職員&light=1`" @click="handleWopenClick">介護職員</a></td>
        </tr>
        <tr>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&name=福岡県&q=学生&light=1`" @click="handleWopenClick">福岡県 学生</a>
          </td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&name=福岡県&q=医療従事者&light=1`" @click="handleWopenClick">福岡県 医療従事者</a></td>
        </tr>
        <tr>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
          <td></td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-n-s ic_btn"></span>比較</div>
          </td>
        </tr>
        <tr>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&name=北海道&q=学生&light=1`" @click="handleWopenClick">北海道 学生</a>
          </td>
          <td>
            <div class="diff wopen ui-button ui-corner-all ui-widget" @click="handleWopenClick"><span class="ui-icon ui-icon-arrow-2-e-w ic_btn"></span>比較</div>
          </td>
          <td><a class="wopen ui-button ui-corner-all ui-widget" :href="`${options.href}&name=北海道&q=医療従事者&light=1`" @click="handleWopenClick">北海道 医療従事者</a></td>
        </tr>
        </tbody>
      </table>

      <div class="clearfix"></div>
    </div>

    <ul>
      <li><span class="wopen ui-icon ui-icon ui-icon-arrow-2-e-w sp_icon"></span>&nbsp;<span
          class="wopen ui-icon ui-icon ui-icon-arrow-2-n-s sp_icon"></span>
        の比較ボタンをクリックすると比較用にウインドウが左右２つ開きます。<b><a
            tt_title="WEBブラウザの設定によってウインドウの複数オープンがブロックされている場合があります。<br /><img src='/img/hlp/popupblock_chrome.gif'><br /><br />以下の操作で設定の変更が可能です。<br />1.アドレスバーの右上にあるをクリック<br />2.「http://***のポップアップを常に許可する」にチェックを入れる">※開かない時</a></b>
      </li>
      <li>このサイトのURLのパラメタについては<b><a
          tt_title="■URLの例<br />福岡県 の状況の場合<br />https://sakanaclub.xsrv.jp/dc/covid19/name=福岡県<br /><br />福岡県 4/4(月)～5/2(土) 職業:看護師 の状況の場合<br />https://sakanaclub.xsrv.jp/dc/covid19/name=福岡県&date=4-4+5-2&q=看護師<br /><br />■パラメタの説明<br />＊name: 都道府県<br />例 name=福岡県<br />   name=福岡県+佐賀県  ...複数形式<br /><br />＊date: 日付<br />例 date=4-11     ...単一日形式  4月11日<br />　 date=4-4+5-8  ...範囲日形式  4月4日~5月8日<br />　 date=4-4+14   ...範囲日形式2 4月4日 + 14days<br /><br />＊q: 検索キーワード (市区町村・職業・状態等のキーワード)<br />例 q=北九州市 ...市区町村<br />　 q=看護師　 ...職業等<br />">こちらを参照</a></b>
      </li>
    </ul>
  </div>
</template>

<style scoped>

#tbl_ana {
  float: left;
  margin-right: 10px;
}

#tbl_ana caption {
  font-weight: bold;
  text-align: center;
  padding: 2px;
}

#tbl_ana th {
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #202020;
}

#tbl_ana td {
  text-align: center;
  padding: 2px 0px;
  border-bottom: 1px solid #202020;
}

</style>
