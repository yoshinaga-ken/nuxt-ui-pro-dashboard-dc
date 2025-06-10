<script lang="ts" setup>
import * as dc from 'dc';
import * as d3 from 'd3';
import { onMounted, ref, watch, defineProps, defineExpose, defineEmits, defineModel, onUnmounted, nextTick } from "vue";
import { useDcBaseChart } from '../../composables/dashboard/useDcBaseChart';

// v-model for filters
const filters = defineModel<Array<any>>('filters', {
  default: () => []
});

const props = defineProps({
  ndx: {
    type: Object,
    required: true
  },
  keyIndex: {
    type: [Number, String],
    required: true
  },
  valueIndex: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    default: null
  },
  height: {
    type: Number,
    default: null
  },
  chartId: {
    type: String,
    default: () => `chart-${Date.now()}`
  },
  chartGroup: {
    type: String,
    default: 'chartGroup'
  },
  innerRadius: {
    type: Number,
    default: 0
  },
  showLabels: {
    type: Boolean,
    default: true
  },
  legend: {
    type: Object,
    default: () => ({
      isShow: true,
      x: 0,
      y: 8
    })
  },
  emitEvents: {
    type: Boolean,
    default: true
  },
  isRemoveEmpty: {
    type: Boolean,
    default: true
  },
  mouseLongClickDuration: {
    type: Number,
    default: 500 // ミリ秒単位の長押し判定の閾値
  },
  margins: {
    type: [Object, Number],
    default: null
  }
});

// イベント定義
const emit = defineEmits(['filtered']);

let chart;
let dimension;
let group;
const chartContainer = ref(null);  // チャートコンテナへの参照を追加
const chartHeader = ref(null);     // ヘッダーへの参照を追加
const chartFooter = ref(null);     // フッターへの参照を追加

// チャートサイズ用の変数（初期値はpropsから取得、なければデフォルト値）
const chartWidth = ref(props.width || 0);
const chartHeight = ref(props.height || 0);

// ResizeObserverを保持する変数
let resizeObserver = null;
// リサイズ中かどうかを示すフラグ
let isResizing = false;
// フィルター更新中かどうかを示すフラグ（無限ループ防止用）
let isUpdatingFilters = false;
// プログラム的にフィルターを設定中かどうかを示すフラグ
let isProgrammaticUpdate = false;

// useDcBaseChartの初期化
const {
  isMouseLongClick,
  setupMouseEvents,
  cleanupMouseEvents,
  applyBaseSettings,
  applySunburstMargins
} = useDcBaseChart({
  chartId: props.chartId,
  mouseLongClickDuration: props.mouseLongClickDuration,
  margins: props.margins
});

// Define resize handler at component level
const handleWindowResize = () => {
  if (!isResizing && chart) {
    redraw();
  }
};

// 親コンテナのサイズを取得する関数
const updateParentSize = () => {
  const container = document.getElementById(props.chartId);
  if (container && container.parentElement) {
    const { width, height } = container.parentElement.getBoundingClientRect();

    // propsでwidth/heightが指定されている場合はそれを優先
    if (props.width !== null) {
      chartWidth.value = props.width;
    } else if (width > 0) {
      chartWidth.value = width;
    } else {
      chartWidth.value = 300; // デフォルト値
    }

    if (props.height !== null) {
      chartHeight.value = props.height;
    } else if (height > 0) {
      // ヘッダーとフッターの高さを考慮
      let headerHeight = 0;
      let footerHeight = 0;

      const headerEl = document.querySelector(`#${props.chartId}-header`);
      const footerEl = document.querySelector(`#${props.chartId}-footer`);

      if (headerEl) {
        headerHeight = (headerEl as HTMLElement).offsetHeight;
      }

      if (footerEl) {
        footerHeight = (footerEl as HTMLElement).offsetHeight;
      }

      // 親の高さからヘッダーとフッターの高さを引く
      chartHeight.value = height - headerHeight - footerHeight;
    } else {
      chartHeight.value = 300; // デフォルト値
    }
  } else {
    // コンテナまたは親要素が見つからない場合
    chartWidth.value = props.width || 300;
    chartHeight.value = props.height || 300;
  }
};

// d3.schemeCategory20b has been removed from D3v5
const d3SchemeCategory20b = [
  '#393b79', '#5254a3', '#6b6ecf', '#9c9ede', '#637939',
  '#8ca252', '#b5cf6b', '#cedb9c', '#8c6d31', '#bd9e39',
  '#e7ba52', '#e7cb94', '#843c39', '#ad494a', '#d6616b',
  '#e7969c', '#7b4173', '#a55194', '#ce6dbd', '#de9ed6'
];

// チャートの初期化関数
const initChart = () => {
  // ndxが存在するかつdimensionメソッドを持っているか確認
  if (!props.ndx || typeof props.ndx.dimension !== 'function') {
    console.warn('SunburstChart: ndx is not available yet or not a valid crossfilter instance');
    return;
  }

  try {
    // 親コンテナのサイズを更新
    updateParentSize();

    // チャートの作成
    chart = new dc.SunburstChart(`#${props.chartId}`, props.chartGroup);

    // ディメンションとグループの作成
    dimension = props.ndx.dimension(function (d) {
      let value;

      // keyIndexが数値の場合は従来通り
      if (typeof props.keyIndex === 'number') {
        value = d[props.keyIndex];
      }
      // keyIndexが文字列の場合は書式指定として処理
      else if (typeof props.keyIndex === 'string') {
        // まず、プレースホルダーの値を取得
        const placeholderValues = [];
        const placeholderPattern = /\$(\d+)/g;
        let match;

        // すべてのプレースホルダーを見つけて値を取得
        while ((match = placeholderPattern.exec(props.keyIndex)) !== null) {
          const arrayIndex = parseInt(match[1], 10);
          const val = d[arrayIndex] !== undefined ? d[arrayIndex] : '';
          placeholderValues.push(val);
        }

        // すべてのプレースホルダーの値が空かどうかをチェック
        const allEmpty = placeholderValues.every(val => val === '' || val === null || val === undefined);

        if (allEmpty && placeholderValues.length > 0) {
          // すべてのプレースホルダーが空の場合は空文字列
          value = '';
        } else {
          // $1, $2, $3... などのプレースホルダーを d[1], d[2], d[3]... で置換
          value = props.keyIndex.replace(/\$(\d+)/g, (match, index) => {
            const arrayIndex = parseInt(index, 10);
            return d[arrayIndex] !== undefined ? d[arrayIndex] : '';
          });
        }
      }
      else {
        // その他の場合は空文字列
        value = '';
      }

      // isRemoveEmptyがtrueの場合、undefinedや空の値をフィルタリング
      if (props.isRemoveEmpty && (value === '-' || value === undefined || value === null || value === '')) {
        return [];
      }

      return Array.isArray(value)
        ? value
        : (value || '').split('/');
    });

    group = dimension.group().reduceSum(function (d) {
      return d[props.valueIndex] || 1;
    });

    // チャートの設定
    chart
      .width(chartWidth.value)
      .height(chartHeight.value)
      .dimension(dimension)
      .group(group)
      .colors(d3.scaleOrdinal(d3SchemeCategory20b))
      .innerRadius(props.innerRadius);

    // フィルター追加ロジックとマージン設定を適用
    applyBaseSettings(chart);

    // SunburstChart専用のマージン適用（cx, cyメソッドを使用）
    applySunburstMargins(chart, chartWidth.value, chartHeight.value);

    // ラベルの表示設定
    if (!props.showLabels) {
      chart.renderLabel(false);
    } else {
      // ラベルをカスタマイズして値を表示
      chart.label(function (d) {
        // ラベルと値を組み合わせて表示
        const label = d.key; // ラベルテキスト（配列の最後の要素）
        const value = d.value; // 値
        return `${label}: ${value}`;
      });
    }

    // デフォルトの凡例設定とマージして、未設定のプロパティにデフォルト値を適用
    const legendConfig = {
      isShow: props.legend.isShow !== undefined ? props.legend.isShow : true,
      x: props.legend.x !== undefined ? props.legend.x : 0,
      y: props.legend.y !== undefined ? props.legend.y : 8
    };

    // 凡例の追加
    if (legendConfig.isShow) {
      chart.legend(
        dc.legend()
          .x(legendConfig.x)
          .y(legendConfig.y)
      );
    }

    // イベント発火設定
    if (props.emitEvents) {
      // filteredイベントを直接hookする
      chart.on('filtered', function (chart, filter) {
        // プログラム的な更新中は処理をスキップ
        if (isProgrammaticUpdate) {
          return;
        }

        // フィルター更新中フラグを立てる
        isUpdatingFilters = true;

        try {
          // v-modelのfiltersを更新
          const currentFilters = chart.filters();
          const newFilters = currentFilters.map(f => {
            // HierarchyFilterの場合は配列として取得
            if (f && f.path) {
              return f.path; // HierarchyFilterのpathプロパティ
            } else if (Array.isArray(f)) {
              return f;
            } else {
              return [f];
            }
          });

          filters.value = newFilters;

          emit('filtered', {
            filter: filter,
            chart: chart,
            filters: newFilters
          });
        } catch (error) {
          console.error('Error in filtered event handler:', error);
        } finally {
          // フィルター更新中フラグを非同期で下げる
          setTimeout(() => {
            isUpdatingFilters = false;
          }, 10);
        }
      });
    }

    // フィルタの設定
    if (filters.value.length > 0) {
      isProgrammaticUpdate = true;
      nextTick(() => {
        if (!chart) return;
        chart.filterAll();
        filters.value.forEach(path => {
          if (path && path.length > 0) {
            chart.filter(dc.filters.HierarchyFilter(path));
          }
        });
        dc.redrawAll(props.chartGroup);

        nextTick(() => {
          isProgrammaticUpdate = false;
        });
      });
    }
    // チャートの描画
    isResizing = true; // リサイズ中フラグを立てる
    chart.render();
    // リサイズ中フラグを非同期で下げる（DOMの更新完了後）
    setTimeout(() => {
      isResizing = false;
    }, 200);

  } catch (error) {
    console.error("Failed to initialize SunburstChart:", error);
  }
};

// 注: setupMouseEventsとcleanupMouseEventsはuseDcBaseChartから提供されるようになりました

// プロパティの変更を監視
watch(() => props.ndx, (newVal) => {
  // ndxが存在し、かつdimensionメソッドを持っているか確認
  if (newVal && typeof newVal.dimension === 'function') {
    initChart();
  }
}, { immediate: true });

// フィルターの変更を監視
watch(filters, (newFilters, oldFilters) => {
  // 無限ループを防ぐため、フィルター更新中は処理をスキップ
  if (!chart || isUpdatingFilters || isProgrammaticUpdate) {
    return;
  }

  // 配列の内容が実際に変わったかチェック
  const hasChanged = JSON.stringify(newFilters) !== JSON.stringify(oldFilters);
  if (!hasChanged) {
    return;
  }

  // プログラム的な更新フラグを立てる
  isProgrammaticUpdate = true;

  try {
    nextTick(() => {
      if (!chart) return;

      // 現在のフィルターをクリア
      chart.filterAll();

      // 新しいフィルターを適用
      if (newFilters && newFilters.length > 0) {
        newFilters.forEach(path => {
          if (path && path.length > 0) {
            chart.filter(dc.filters.HierarchyFilter(path));
          }
        });
      }

      // チャートグループを再描画
      dc.redrawAll(props.chartGroup);

      // プログラム的な更新フラグを非同期で下げる
      nextTick(() => {
        isProgrammaticUpdate = false;
      });
    });
  } catch (error) {
    console.error('Error in filters watch:', error);
    isProgrammaticUpdate = false;
  }
}, { deep: true });

// マウント時の初期化
onMounted(() => {
  // 親コンテナのサイズを更新
  updateParentSize();

  // ndxが存在し、かつdimensionメソッドを持っているか確認
  if (props.ndx && typeof props.ndx.dimension === 'function') {
    initChart();
  }

  // ResizeObserverの設定
  setupResizeObserver();

  // マウスイベントの設定
  setupMouseEvents();

  // ウィンドウサイズ変更時にも更新
  window.addEventListener('resize', handleWindowResize);
});

// ResizeObserverのセットアップ
const setupResizeObserver = () => {
  const container = document.getElementById(props.chartId);
  if (!container) return;

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;

      // サイズが変更された場合のみ更新
      if (width > 0 && height > 0) {
        // propsでwidth/heightが指定されている場合はそれを優先（ResizeObserverは無視）
        if (props.width !== null) {
          chartWidth.value = props.width;
        } else {
          chartWidth.value = width;
        }

        if (props.height !== null) {
          chartHeight.value = props.height;
        } else {
          // ヘッダーとフッターの高さを考慮
          let headerHeight = 0;
          let footerHeight = 0;

          const headerEl = document.querySelector(`#${props.chartId}-header`);
          const footerEl = document.querySelector(`#${props.chartId}-footer`);

          if (headerEl) {
            headerHeight = (headerEl as HTMLElement).offsetHeight;
          }

          if (footerEl) {
            footerHeight = (footerEl as HTMLElement).offsetHeight;
          }

          chartHeight.value = height - headerHeight - footerHeight;
        }

        // チャートが初期化されている場合はリサイズ
        if (chart && !isResizing) {
          isResizing = true; // リサイズ中フラグを立てる
          chart
            .width(chartWidth.value)
            .height(chartHeight.value);

          // リサイズ後にマージンを再適用
          applySunburstMargins(chart, chartWidth.value, chartHeight.value);

          chart.redraw();
          // リサイズ中フラグを非同期で下げる（DOMの更新完了後）
          setTimeout(() => {
            isResizing = false;
          }, 200);
        }
      }
    }
  });

  // 親要素の監視を開始
  const parent = container.parentElement;
  if (parent) {
    resizeObserver.observe(parent);
  } else {
    resizeObserver.observe(container);
  }
};

// コンポーネント破棄時のクリーンアップ
onUnmounted(() => {
  // ResizeObserverのクリーンアップ
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

  // マウスイベントのクリーンアップ
  cleanupMouseEvents();

  // イベントリスナーを削除
  window.removeEventListener('resize', handleWindowResize);
});

// Common chart update logic
const updateChart = (renderMethod: 'redraw' | 'render') => {
  if (chart) {
    // 親コンテナのサイズを更新
    updateParentSize();

    isResizing = true; // リサイズ中フラグを立てる
    chart
      .width(chartWidth.value)
      .height(chartHeight.value);

    // リサイズ後にマージンを再適用
    applySunburstMargins(chart, chartWidth.value, chartHeight.value);

    chart[renderMethod]();
    // リサイズ中フラグを非同期で下げる（DOMの更新完了後）
    setTimeout(() => {
      isResizing = false;
    }, 200);
  }
};

// 外部からアクセス可能な関数を定義
const redraw = () => updateChart('redraw');

const render = () => updateChart('render');

// 外部から使用できる関数を公開
defineExpose({
  chart,
  dimension,
  group,
  redraw,
  render,
  isMouseLongClick
});
</script>

<template>
  <div class="sunburst-chart-container">
    <div :id="`${chartId}-header`" class="chart-header" v-if="$slots.header" ref="chartHeader">
      <slot name="header" :chart="chart"></slot>
    </div>
    <div :id="chartId" class="sunburst-chart" ref="chartContainer"></div>
    <div :id="`${chartId}-footer`" class="chart-footer" v-if="$slots.footer" ref="chartFooter">
      <slot name="footer" :chart="chart"></slot>
    </div>
  </div>
</template>

<style>
.dc-chart .deselected path, .dc-chart .deselected circle {
  stroke: gray;
  fill-opacity: .5;
  fill: #ccc;
}
</style>

<style scoped>
.sunburst-chart-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 200px;
  min-height: 200px;
}

.sunburst-chart {
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 200px;
  overflow: visible; /* SVG要素がはみ出ても表示されるようにする */
}

.chart-header, .chart-footer {
  padding: 2px 0;
}
</style>
