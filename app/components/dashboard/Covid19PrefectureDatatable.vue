<script setup>
import {onMounted} from "vue";
import _ from 'lodash';
import moment from 'moment';
import 'moment/dist/locale/ja';

moment.locale('ja');
import {
  PREFECTURES_EN,
  CND_LV_A,
  CND_LV_B,
  CND_LV_C,
  CND_LV_D,
  CND_LV_E,
  COL_CND,
  COL_CND_A,
  // COL_CND_B,
  COL_CND_C,
  // COL_CND_D,
  // COL_CND_E,
} from '@/utils/dashboard/DcChart.constants.js';
import {php_number_format} from '@/utils/dashboard/phpjs.js';

import {
  // loadScriptJQueryUI,
  // loadScriptJQueryUIDatepickerJa,
  loadScriptDataTables,
  loadScriptSparkline,
} from '@/utils/dashboard/utils.js';

const props = defineProps({
  data: {
    type: Object, // Format @see public/data/covid19-data-2021-02-28.options.json
    default: () => {
      return {
        // ac_data_tbl: [],
        // chartDateLineYmdMsg: [],
        // prefTable: {
        //   japanRegions: {},
        //   link: []
        // },
        // pref_tbl_last_m1:{
        //   '北海道': {bed:457,carriers:2454,deaths:48,discharged:2238,n:1771855,pcrtested:60178,pcrtested_p:3.4},
        //   '青森県': {bed:457,carriers:2454,deaths:48,discharged:2238,n:1771855,pcrtested:60178,pcrtested_p:3.4},
        // },
        // pref_tbl_last_m2:{
        //   '北海道': {carriers: 2440, deaths: 48, discharged: 2230, pcrtested: 140309},
        //   '青森県': {carriers: 2440, deaths: 48, discharged: 2230, pcrtested: 140309},
        // },
        // spk: {
        //   bar_stacks: [],
        //   line: [],
        //   max_ymd: '2020-01-16',
        //   min_ymd: '2021-02-22',
        //   out_of_100k: [],
        //   vline: []
        // }
      }
    }
  },
  isDark: {
    type: Boolean,
    default: false
  }
});

const isSp = window.innerWidth <= 768;

const mm = {
  tbl_pref: null,
  tbl_pref_isearch: null,
  SPARK_SX: isSp ? 60 : 25,
}
const drawPrefSparkline = (mode, bar_stacks) => {
  let tbl = $('#tbl_pref');
  //tbl.find('canvas').remove();

  let barWidth = isSp ? 2 : 5;
  let barHeight = isSp ? 50 : 80;
  let td_idx = $('#tbl_pref tr:eq(3) td').length - 1;//DataTableカラム非表示考慮

  for (var i = 0; i < bar_stacks.length; i++) {
    let spn = tbl.find('#spn' + i);

    let v = _.last(props.data.spk.line[0][i]);//0:carriers
    let a = tbl.find('#spn' + i + ' td:eq(0)');
    let pref_name = a.text();
    let o = spn.find('td:eq(' + td_idx + ')');

    //Stacked_Bar
    o.sparkline(bar_stacks[i], {
      type: 'bar', barColor: '#1f77b4'
      , barWidth: barWidth
      , height: barHeight
      , stackedBarColor: COL_CND
      //,chartRangeMax:100 // Stacked bar charts ignoring `chartRangeMax` option . https://github.com/gwatts/jquery.sparkline/issues/185
      , useropt: [pref_name, i]
      , tooltipFormatter(sparkline, options, f) {
        let pref_name = options.userOptions.useropt[0];
        let ii = options.userOptions.useropt[1];
        let ymd = moment(props.data.spk.max_ymd).subtract(bar_stacks[0].length - (f[0].offset + 1), 'days').format('M/D(ddd)');
        return ymd + ' - ' + pref_name + '<br />─【新規】─────<br />' +
          (f[4].value == 0 ? '' : '<span class="square" style="background:' + f[4].color + '"></span>' + CND_LV_A + ': ' + f[4].value + '名<br />') +
          (f[3].value == 0 ? '' : '<span class="square" style="background:' + f[3].color + '"></span>' + CND_LV_B + ': ' + f[3].value + '名<br />') +
          (f[2].value == 0 ? '' : '<span class="square" style="background:' + f[2].color + '"></span>' + CND_LV_C + ': ' + f[2].value + '名<br />') +
          (f[1].value == 0 ? '' : '<span class="square" style="background:' + f[1].color + '"></span>' + CND_LV_D + ': ' + f[1].value + '名<br />') +
          (f[0].value == 0 ? '' : '<span class="square" style="background:' + f[0].color + '"></span>' + CND_LV_E + ': ' + f[0].value + '名<br />') +
          '計: ' + (f[4].value + f[3].value + f[2].value + f[1].value + f[0].value) + '名<br />'
          ;
      }
    });

    if (mode !== 1) {
      //Line:10万人中の新規感染者数
      o.sparkline(props.data.spk.out_of_100k[i], {
        composite: true
        , lineColor: '#ffa07a', fillColor: false
        , maxSpotColor: ''
        // ,minSpotColor:'#FF0000'
        , spotRadius: isSp ? 1.5 : 2
        //,valueSpots:{':0.49': 'green', '0.5:': 'red'}
        , valueSpots: {'0.5:': 'red'}
        , chartRangeMax: 1
        , lineWidth: 1.5
        // ,normalRangeMin: 0
        // ,normalRangeMax: 0.5
        // ,normalRangeColor: 'rgba(0,0,0,0.1)'
        , tooltipFormatter(sparkline, options, f) {
          let style = f.y >= 0.5 ? 'font-weight:bold;color:#FF0000;' : '';
          return '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>10万人中 <span style="' + style + '">' + f.y + '</span>名<br />─【累計】─────<br />';
        }
      });
    }

    //0:Red_Line:感染累計
    o.sparkline(props.data.spk.line[0][i], {
      composite: true
      , chartRangeMax: v + 5
      , lineColor: 'red'
      , fillColor: 'rgba(255,0,0,0.1)'
      , useropt: [i]
      , tooltipFormatter(sparkline, options, f) {
        let pref_no = options.userOptions.useropt[0];
        let carr = props.data.spk.line[0][pref_no][f.x];// 感染累計
        let _1 = props.data.spk.line[1][pref_no][f.x];   // 感染累計-死亡
        //let _2 =props.data.spk.line[2][pref_no][f.x];  // 感染累計-(死亡＋退院)=患者数
        let death = carr - _1;
        //let population=props.data.pref_tbl_last_m1[pref_name].n;
        //let per=_.round(100*death/population,3)+'%'; //死亡/人口
        return '感染者: ' + php_number_format(f.y) + '名<br />' +
          '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>死亡: ' + php_number_format(death) + '名<br />';

      }
    });

    //1:Green_Line:感染累計-死亡
    o.sparkline(props.data.spk.line[1][i], {
      composite: true
      , chartRangeMax: v + 5
      , lineColor: COL_CND_A
      , fillColor: 'rgba(0,255,32,0.2)'
      , useropt: [i]
      , tooltipFormatter(sparkline, options, f) {
        let pref_no = options.userOptions.useropt[0];
        //let carr =props.data.spk.line[0][pref_no][f.x];// 感染累計
        let _1 = props.data.spk.line[1][pref_no][f.x];   // 感染累計-死亡
        let _2 = props.data.spk.line[2][pref_no][f.x];  // 感染累計-(死亡＋退院)=患者数
        return '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>退院: ' + php_number_format(_1 - _2) + '名<br />';
      }
    });

    //2:Blue_Line:感染累計-(死亡＋退院)=患者数
    o.sparkline(props.data.spk.line[2][i], {
      composite: true
      , chartRangeMax: v + 5
      , lineColor: 'blue', fillColor: 'rgba(0,0,255,0.18)'
      , useropt: [i]
      , tooltipFormatter(sparkline, options, f) {
        return '<span class="ui-icon ui-icon-chart-line" style="background:#FFF;color:' + f.color + '"></span>患者: ' + php_number_format(f.y) + '名';
      }
    });

    //Vertical_Line
    o.sparkline(props.data.spk.vline[i].slice(mm.SPARK_SX), {
      composite: true
      ,
      type: 'bar',
      barColor: 'rgba(255,0,0,1)'
      ,
      barWidth: 1
      ,
      barSpacing: barWidth
      ,
      height: barHeight
      ,
      chartRangeMax: 1000
      ,
      colorMap: {
        1000: 'rgba(255,0,0,0.9)',
        999: 'rgba(0,0,255,0.9)',
        998: 'rgba(255,140,0,0.9)',
        997: 'rgba(255,140,0,0.9)'
      } //1000:start 999:end
      ,
      tooltipFormatter(sparkline, options, f) {
        return '<br />' + (f[0].value === 1000 ? '※緊急事態宣言 発令' : (f[0].value === 999 ? '※緊急事態宣言 解除' :
            (f[0].value === 998 ? props.data.chartDateLineYmdMsg[5][1] : (f[0].value === 997 ? props.data.chartDateLineYmdMsg[6][1] : ''))
        ));
      }
    });
  }
}

const getJapanRegionData = (reg_str, type) => {
  reg_str = reg_str.replace('<br>', '');
  let n = null;
  switch (reg_str) {
    case '世界':
      n = '';
      break;
    case '日本':
      n = _.sumBy(_.values(props.data.pref_tbl_last_m1), type);
      break;
    default:
      let p = props.data.prefTable.japanRegions[reg_str];
      if (p) {
        n = 0;
        _.map(props.data.pref_tbl_last_m1, (v, k) => {
          if (p.includes(k)) n += v[type];
        });
      }
      break;
  }
  return n;
}

const initPrefTableData = () => {
  let max = 0;
  for (var i = 0; i < props.data.spk.bar_stacks.length; i++) {
    let last = _.last(props.data.spk.line[0][i]);
    if (max < last) max = last;
  }
  const p_max = props.data.pref_tbl_last_m1['東京都'].n + 100000;//_.max() ...

  let tbl = $('#tbl_pref');
  for (var i = 0; i < props.data.spk.bar_stacks.length; i++) {
    let v = _.last(props.data.spk.line[0][i]);//0:carriers
    let v_prev = props.data.spk.line[0][i][props.data.spk.line[0][i].length - 2];//0:carriers
    let new_patient = _.sum(_.last(props.data.spk.bar_stacks[i]));
    let per = parseInt(100 * v / max)
    if (per === 0 && v !== 0) per = 1;

    let a = tbl.find('#spn' + i + ' td:eq(0)');
    let pref_name = a.text();
    let spn = tbl.find('#spn' + i);

    let pop = props.data.pref_tbl_last_m1[pref_name].n;
    let p_per = parseInt(100 * pop / p_max);
    let c_per = _.round(100 * v / pop, 3);          //(感染者/人口)%
    let c_per2 = parseInt((c_per * 10) * p_per);   //10万人あたり%
    const tcolor = (props.isDark ? '#F0F0F0' : '#202020');
    spn.find('td:eq(1)')//人口/感染率
      .text(pop)
      .attr('title', '感染率(感染者数/人口): ' + c_per + '%')
      .css({'color': tcolor, 'vertical-align': 'top'})
      .css({'background': 'linear-gradient(to right, ' + COL_CND_C + ' , ' + COL_CND_C + ' ' + c_per2 + '%,#008080 ' + c_per2 + '%, #008080 ' + p_per + '%,#FFFFFF ' + p_per + '%, #FFFFFF) center center / 100% 30% no-repeat'})
    ;

    spn.find('td:eq(2)')//感染者
      .text(v)
      .css({'color': tcolor, 'vertical-align': 'top'})
      .css({'background': 'linear-gradient(to right, #1f77b4 ' + per + '%, #FFFFFF ' + per + '% ' + (100 - per) + '%) center center / 100% 30% no-repeat'});

    let ymd = moment(props.data.spk.max_ymd).subtract(1, 'days').format('YYYY/MM/DD(ddd)');
    spn.find('td:eq(3)').text(new_patient);//新規
    tbl.find('thead th:eq(3)').attr('title', '感染者数 前日比(' + ymd + '時点)');

    let p = props.data.pref_tbl_last_m1[pref_name];
    let deaths = p ? p.deaths : 0;
    let discharged = p ? p.discharged : 0;
    let patient = v - discharged - deaths;//累計 患者数 = 感染者数-退院者数-死亡者数

    let p_prev = props.data.pref_tbl_last_m2[pref_name];
    let deaths_prev = p_prev ? p_prev.deaths : 0;
    let discharged_prev = p_prev ? p_prev.discharged : 0;
    let patient_prev = v_prev - discharged_prev - deaths_prev;//累計 患者数 = 感染者数-退院者数-死亡者数

    spn.find('td:eq(4)').text(deaths);
    spn.find('td:eq(5)').text(discharged);
    spn.find('td:eq(6)').text(patient);
    spn.find('td:eq(7)').text(patient - patient_prev);
    tbl.find('thead th:eq(7)').attr('title', '患者数 前日比(' + ymd + '時点)');
  }
}

const initPrefTable = () => {
  initPrefTableData();

  for (var i = 0; i < props.data.spk.bar_stacks.length; i++) {
    props.data.spk.bar_stacks[i] = props.data.spk.bar_stacks[i].slice(mm.SPARK_SX);
    props.data.spk.out_of_100k[i] = props.data.spk.out_of_100k[i].slice(mm.SPARK_SX);
    props.data.spk.line[0][i] = props.data.spk.line[0][i].slice(mm.SPARK_SX)
    props.data.spk.line[1][i] = props.data.spk.line[1][i].slice(mm.SPARK_SX);
    props.data.spk.line[2][i] = props.data.spk.line[2][i].slice(mm.SPARK_SX);
  }

  $('.container_tbl_pref').show();
  $('#tbl_pref').show();

  drawPrefSparkline('first', props.data.spk.bar_stacks);

  mm.tbl_pref = $('#tbl_pref').DataTable({
    stateSave: false,
    order: [],
    searching: true,
    // search : {
    //   //search:'Fred'
    //   //"regex": true
    // },
    paging: false,
    scrollX: true, //IS_SP,
    fixedColumns: {
      leftColumns: 4, //IS_SP?1:4,
    },
    autoWidth: false,
    info: false,
    //order: [[ 0, 'asc' ], [ 1, 'desc' ],[ 2, 'desc' ]],
    //columDef:[
    //  { "targets": [ 1,2 ], "orderSequence": [ "desc","asc"]}
    // ]

    dom:
      '<"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-tl ui-corner-tr"lfrB>' +
      't' +
      '<"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-bl ui-corner-br"ip>',
    buttons: [
      //, 'csv'
      {
        text: '<label for="chk_tbl_detail"><input type="checkbox" id="chk_tbl_detail">詳細</label>',
        action: function (e, dt, node, config) {
          const isChecked = !$('#chk_tbl_detail').is(':checked');
          $("#chk_tbl_detail").prop('checked', isChecked);
          if (mm.tbl_pref) {
            mm.tbl_pref.column(1).visible(isChecked);
            mm.tbl_pref.column(4).visible(isChecked);
            mm.tbl_pref.column(5).visible(isChecked);
            mm.tbl_pref.column(6).visible(isChecked);
            mm.tbl_pref.column(7).visible(isChecked);
          }

        }
      },
      {
        text: '<i class="ui-icon ui-icon-arrowstop-1-s"></i><img title="テーブルのデータをCSV形式でダウンロードします。" width="20" src="/img/csv.png">'
        , extend: 'csvHtml5' //OPTION: https://datatables.net/reference/button/csvHtml5
        , filename: 'covid19'
        //,className: "btn btn-green"
        , charset: "utf-8"
        , bom: true
        //,init: function(api, node, config) {}
        , exportOptions: {
          columns: [0, 1, 2, 3, 4, 5, 6, 7]
          , format: {
            header: function (data, ci, n) {
              if (n.textContent === '人口感染率') n.textContent = '人口';
              return n.textContent;
            }
            , body: function (data, ri, ci) {
              return mm.tbl_pref.data()[ri][ci];
            }
          }
        }
      }
    ],

    columns: [
      //都道府県
      {
        render: function (data, type, row, meta) { //, row
          let ret = data;
          if (type === 'display') {
            if (props.data.prefTable.link[meta.row] && props.data.prefTable.link[meta.row].length) {
              let href = props.data.prefTable.link[meta.row][0];
              let title = props.data.prefTable.link[meta.row][1];
              let icon = PREFECTURES_EN[data] ? '<img src="/img/japan/' + PREFECTURES_EN[data] + '.gif">' : '';
              if (data === '日本') icon = '<img src="/img/world/Japan.png">';
              if (data === '世界') icon = '<i class="fa fa-globe" style="font-size:1.8em;"></i>';
              ret = '<a target="_blank" href="' + href + '" title="' + title + '">' + icon + data + '</a>';
            } else {
              ret = data;
            }
          }
          return ret;
        },
        orderable: false
      },
      //人口/感染率
      {
        visible: 0,
        orderSequence: ["desc", "asc"],
        render: function (data, type, row, meta) {
          let ret = data;
          if (type === 'display') {
            let p = props.data.pref_tbl_last_m1[row[0]];
            if (p) {
              let c_per = _.round(100 * p.carriers / p.n, 3);   //(感染者/人口)%
              ret = php_number_format(data) + '<br />' + c_per + '%';
            } else {
              let carriers = getJapanRegionData(row[0], 'carriers');
              if (carriers === '') {
                ret = '';
              } else {
                let n = getJapanRegionData(row[0], 'n');
                let c_per = _.round(100 * carriers / n, 3);   //(感染者/人口)%
                ret = php_number_format(n) + '<br />' + c_per + '%';
              }
            }
          } else {
            ret = data;
          }
          return ret;
        }
      },
      //感染者
      {
        orderSequence: ["desc", "asc"],
        render: function (data, type, row, meta) {
          let ret = data;
          if (type === 'display') {
            let n = getJapanRegionData(row[0], 'carriers');
            if (n === null) {
              ret = php_number_format(data);
            } else {
              ret = n === '' ? '' : php_number_format(n);
            }
          } else {
            ret = data;
          }
          return ret;
        }
      },
      //新規(▲)
      {
        render: function (data, type) { //, row
          return type === 'display' ? ((data === '0' || data === '') ? '' : '▲' + data) : data;
        }
        , orderSequence: ["desc", "asc"]
      },
      {visible: 0, orderSequence: ["desc", "asc"]},//死亡
      {visible: 0, orderSequence: ["desc", "asc"]},//退院
      {visible: 0, orderSequence: ["desc", "asc"]},//患者
      //前日比
      {
        visible: 0,
        render: function (data, type) { //, row
          return type === 'display' ? ((data === '0' || data === '') ? '' : (data > 0 ? '<span style="color:orange">▲' + Math.abs(data) + '</span>' : '<span style="color:green">▼' + Math.abs(data) + '</span>')) : (type === 'sort' && data === '' ? 10000 : data);
        }
        , orderSequence: ["asc", "desc"]
      },
      {orderable: false}
    ]
    , initComplete: function () {//(settings, json)
      let that = this.api();
      let dt = $(that.table().container());
      //let d=that.data();
      //
      let input = dt.find('[type=search]')
      mm.tbl_pref_isearch = input.clone();
      mm.tbl_pref_isearch
        .autocomplete_ex({
          user_opt: {
            data: props.data.ac_data_tbl,
            multiple: 1,
            select: function (event, ui) {
              mm.tbl_pref_isearch.val(mm.tbl_pref_isearch.val() + ' ');
              mm.tbl_pref_isearch.trigger('keyup').focus();
            }
          }
        })
        //.attr('type','input')
        .attr({
          'id': 'tbl_flt',
          'class': 'text-theme-col dark:bg-slate-900 dark:hover:bg-slate-700',
          'placeholder': '都道府県'
        })
        //.before($('<i class="fa fa-filter" style="padding:4px"></i>'))
        .on('keyup input clear', function () {
          let wd = mm.tbl_pref_isearch.val().replace(/　/g, ' ').trim().split(' ')
          if (wd.length == 1) {
            mm.tbl_pref.columns(0).search(wd[0]).draw();
          } else if (wd.length > 1) {
            const reg_str = '(' + wd.join('|') + ')';
            mm.tbl_pref.columns(0).search(reg_str, true).draw();
          }
        })
      ;
      input.before(mm.tbl_pref_isearch).remove();
      //mm.tbl_pref_isearch.addClass('btn_clear').btn_clear();

      let flt_txt = [];
      that.rows(':visible').every((rowIdx/*, tableLoop, rowLoop*/) => {
        flt_txt.push(that.row(rowIdx).data()[0]);
      });
      if (flt_txt.length && flt_txt.length !== props.data.prefTable.link.length) $('#tbl_flt').val(flt_txt.join(' '));

      that.on('draw.dt', function () {
        $('.dataTables_scrollBody').scrollLeft(3000);
      });

      if (isSp) {
        $('#JAPAN_REGIONS_H').html('北海道<BR>・東北');
        $('#JAPAN_REGIONS_K').html('九州<BR>・沖縄');
      }
    }
    , mark: {
      // https://github.com/julmot/datatables.mark.js/blob/master/README.md
      // "synonyms": {}
    }
  });

  if (!isSp) {
    $('#tbl_pref').sortable({
      axis: 'y'
      , placeholder: "ui-state-highlight"
      , items: 'tbody > tr'
      , cursor: 'move'
      , handle: '.uicm'
      , revert: 50
    });
  }

}

const onDocumentReadyPrefTable = () => {
  initPrefTable();

  const isChecked = !!(mm.tbl_pref && mm.tbl_pref.state()?.columns[4].visible);
  $("#chk_tbl_detail").prop('checked', isChecked);

  $("#chk_tbl_spkflt").checkboxradio().on('click', function () {
    let b = $(this).prop('checked');
    if (b) {
      drawPrefSparkline(1, mm.createFilteredBarStacksData());
    } else {
      drawPrefSparkline(2, props.data.spk.bar_stacks);
    }
  });
}

onMounted(async () => {
  await loadScriptDataTables();
  $.extend($.fn.dataTable.defaults, {
    language: {
      search: '<i class="fa fa-filter fa-icon"></i>'
    }
  });
  await loadScriptSparkline();

  onDocumentReadyPrefTable();
});
</script>

<template>
  <div class="container_tbl_pref text-theme-col bg-theme-col">
    <h4 class="hdr_pref">各都道府県の感染症情報取得先</h4>
    ※データは各都道府県が公開する感染症情報や厚生労働省の発表資料より取得しています。詳細は都道府県名のリンク先を参照下さい<br>
    <div>
      <table id="tbl_pref" border="1" bordercolor="#b0b0b0" cellpadding="3" cellspacing="3" frame="below"
             rules="rows">
        <thead>
        <tr bgcolor="#C0C0D0"
            title="カラムクリックで▲昇順▼降順にソートされます。&#x0A;Shiftキーを押しながら順番にクリックしていくとマルチカラムソートになります。">
          <th>都道府県</th>
          <th>人口<br/>感染率</th>
          <th>感染者</th>
          <th>新規</th>
          <th>死亡</th><!-- chk_tbl_detail -->
          <th>退院</th><!-- chk_tbl_detail -->
          <th title="入院治療等を要する患者数。(感染者数-無症状者数-退院者数-死亡者数)">患者</th>
          <!-- chk_tbl_detail -->
          <th>前日比</th><!-- chk_tbl_detail -->
          <th><i class="fa fa-area-chart"></i>感染推移&nbsp;&nbsp;&nbsp;<label for="chk_tbl_spkflt"
                                                                               id="chk_tbl_spkflt_l"></label><input
            type="checkbox" id="chk_tbl_spkflt"></th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>世界</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>日本</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td id="JAPAN_REGIONS_H">北海道・東北</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn0">
          <td bgcolor="">北海道</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn1">
          <td>青森県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn2">
          <td>岩手県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn3">
          <td>宮城県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn4">
          <td>秋田県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn5">
          <td>山形県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn6">
          <td>福島県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td>関東</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn7">
          <td>茨城県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn8">
          <td>栃木県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn9">
          <td>群馬県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn10">
          <td bgcolor="">埼玉県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn11">
          <td bgcolor="">千葉県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn12">
          <td bgcolor="">東京都</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn13">
          <td bgcolor="">神奈川県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td>中部</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn14">
          <td>新潟県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn15">
          <td>富山県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn16">
          <td>石川県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn17">
          <td>福井県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn18">
          <td>山梨県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn19">
          <td>長野県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn20">
          <td>岐阜県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn21">
          <td>静岡県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn22">
          <td>愛知県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td>近畿</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn23">
          <td>三重県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn24">
          <td>滋賀県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn25">
          <td bgcolor="">京都府</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn26">
          <td bgcolor="">大阪府</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn27">
          <td bgcolor="">兵庫県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn28">
          <td>奈良県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn29">
          <td>和歌山県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td>中国</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn30">
          <td>鳥取県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn31">
          <td>島根県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn32">
          <td>岡山県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn33">
          <td>広島県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn34">
          <td>山口県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td>四国</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn35">
          <td>徳島県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn36">
          <td>香川県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn37">
          <td>愛媛県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn38">
          <td>高知県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr class="tr_h">
          <td id="JAPAN_REGIONS_K">九州・沖縄</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn39">
          <td>福岡県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn40">
          <td>佐賀県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn41">
          <td>長崎県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn42">
          <td>熊本県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn43">
          <td>大分県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn44">
          <td>宮崎県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn45">
          <td>鹿児島県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr id="spn46">
          <td>沖縄県</td>
          <td align="right"></td>
          <td align="right"></td>
          <td class="uicm"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.container_tbl_pref {
  display: none;
}

#tbl_pref td {
  height: 2em;
}

#tbl_pref {
  width: 100%;
  display: none;
}

#tbl_pref_wrapper input {
  font-weight: normal;
}

#tbl_pref_wrapper .tr_h td {
  background-color: #E0E0E0;
  font-weight: bold;
  white-space: nowrap;
}

#tbl_pref_wrapper .tr_h td:nth-child(2),
#tbl_pref_wrapper .tr_h td:nth-child(3) {
  font-weight: normal;
}

table.dataTable thead th div.DataTables_sort_wrapper label * {
  position: relative;
  top: initial;
  margin-top: initial;
  right: initial;
}

.dt-search {
  float: right;
}

/*jquery-sparkline*/
.jqstooltip {
  font-size: 1em !important;
}
</style>
