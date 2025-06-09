import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useKeyModifier } from '@vueuse/core';
import * as dc from 'dc';

/**
 * Provides foundational features for DC.js charts in Vue components, including mouse event handling, filter management, and margin application.
 *
 * Supports detection of long mouse clicks and modifier keys (Control, Shift) to enable single or multi-selection filter behavior. Computes and applies chart margins, and offers utilities for Sunburst chart centering. Manages event listeners for mouse and touch interactions, and exposes methods to configure DC.js chart instances with custom filter handlers and margin settings.
 *
 * @param options - Configuration options for the chart, including the container element ID, optional long-click duration, and margin settings.
 * @returns An object exposing reactive states, filter handler, event setup/cleanup functions, margin utilities, and chart configuration methods for use in DC.js chart components.
 */
export function useDcBaseChart(options: {
  chartId: string;
  mouseLongClickDuration?: number;
  margins?: { top?: number; right?: number; bottom?: number; left?: number } | number | null;
}) {
  const {
    chartId,
    mouseLongClickDuration = 500, // デフォルトは500ミリ秒
    margins
  } = options;

  // 長押しクリック検出用フラグ
  const isMouseLongClick = ref(false);
  // プレスタイマー
  let pressTimer: ReturnType<typeof setTimeout> | null = null;

  // VueUse を使用してキー修飾子の状態を追跡
  const ctrlPressed = useKeyModifier('Control');
  const shiftPressed = useKeyModifier('Shift');

  // margin設定の計算処理
  const computedMargins = computed(() => {
    if (!margins) {
      return null;
    }

    if (typeof margins === 'number') {
      return {
        top: margins,
        right: margins,
        bottom: margins,
        left: margins
      };
    } else {
      // デフォルト値とマージ
      return Object.assign(
        { top: 30, right: 30, bottom: 30, left: 30 },
        margins
      );
    }
  });

  // マウスイベント処理関数
  const handleMouseDown = (event: MouseEvent | TouchEvent) => {
    clearTimeout(pressTimer as ReturnType<typeof setTimeout>);
    pressTimer = setTimeout(() => {
      isMouseLongClick.value = true;
    }, mouseLongClickDuration);
  };

  const handleMouseUp = (event: MouseEvent | TouchEvent) => {
    clearTimeout(pressTimer as ReturnType<typeof setTimeout>);
  };

  // フィルタ追加ハンドラ - 単一選択と追加選択を処理
  const addFilterHandler = (filters: any[], filter: any) => {
    let ret;
    // 長押しかCtrlキーまたはShiftキーが押されている場合は単一選択
    if (isMouseLongClick.value || ctrlPressed.value || shiftPressed.value) {
      ret = [filter]; // 単一選択
    } else {
      filters.push(filter); // 既存のフィルタに追加
      ret = filters; // 追加選択
    }
    isMouseLongClick.value = false; // フラグをリセット
    return ret;
  };

  // マウスイベントの設定
  const setupMouseEvents = () => {
    const container = document.getElementById(chartId);
    if (!container) return;

    // イベントリスナーを追加
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleMouseDown);
    container.addEventListener('touchend', handleMouseUp);
  };

  // マウスイベントのクリーンアップ
  const cleanupMouseEvents = () => {
    const container = document.getElementById(chartId);
    if (!container) return;

    // イベントリスナーを削除
    container.removeEventListener('mousedown', handleMouseDown);
    container.removeEventListener('mouseup', handleMouseUp);
    container.removeEventListener('touchstart', handleMouseDown);
    container.removeEventListener('touchend', handleMouseUp);
  };

  // DC チャートにカスタムフィルターハンドラを適用
  const applyCustomFilterHandlers = (chart: dc.BaseMixin<any>) => {
    // カスタムフィルター追加ハンドラをチャートに適用
    chart.addFilterHandler(addFilterHandler);
  };

  // DC チャートにmarginを適用
  const applyMargins = (chart: dc.BaseMixin<any>) => {
    if (computedMargins.value && chart.margins) {
      chart.margins(computedMargins.value);
    }
  };

  // SunburstChart専用のマージン適用（cx, cyメソッドを使用）
  const applySunburstMargins = (chart: any, chartWidth: number, chartHeight: number) => {
    if (!computedMargins.value) return;

    const margins = computedMargins.value;

    // 中心位置を計算（マージンを考慮）
    const centerX = (chartWidth - margins.left - margins.right) / 2 + margins.left;
    const centerY = (chartHeight - margins.top - margins.bottom) / 2 + margins.top;

    // cx, cyメソッドが存在する場合のみ適用
    if (chart.cx && typeof chart.cx === 'function') {
      chart.cx(centerX);
    }
    if (chart.cy && typeof chart.cy === 'function') {
      chart.cy(centerY);
    }
  };

  // チャートの基本設定を適用
  const applyBaseSettings = (chart: dc.BaseMixin<any>) => {
    applyCustomFilterHandlers(chart);
    applyMargins(chart);
  };

  // マウント時にイベントリスナーを設定
  onMounted(() => {
    setupMouseEvents();
  });

  // アンマウント時にイベントリスナーをクリーンアップ
  onUnmounted(() => {
    cleanupMouseEvents();
    // プレスタイマーをクリア
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  });

  return {
    isMouseLongClick,
    ctrlPressed,
    shiftPressed,
    addFilterHandler,
    setupMouseEvents,
    cleanupMouseEvents,
    applyCustomFilterHandlers,
    applyMargins,
    applySunburstMargins,
    applyBaseSettings,
    computedMargins
  };
}
