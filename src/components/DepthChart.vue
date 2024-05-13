<template>
  <div class="deepth-chart">
    <div class="deepth-chart-layout" :style="{ height: fHeight + 24 + 'px' }">
      <canvas class="chart bg-color" ref="chart" :width="fWidth" :height="fHeight"></canvas>
      <canvas class="chart-mask" ref="chartMask" :width="fWidth" :height="fHeight" @mousemove="onMouseMove" @mouseout="onMouseOut"></canvas>
      <canvas class="chart-x" ref="chartX" :width="fWidth" :height="24" :style="{ top: fHeight + 'px', left: 0 }"></canvas>
      <canvas class="chart-y" ref="chartY" :width="48" :height="fHeight" :style="{ top: 0, left: fWidth + 'px' }"></canvas>
    </div>
  </div>
</template>

<script>
  import utils from "@/functions/depth_chart";

  export default {
    name: "DeepthChart",
    data() {
      return {
        chart: null,
        context: null,
        maskChart: null,
        maskContext: null,
        xChart: null,
        xContext: null,
        yChart: null,
        yContext: null,
        fWidth: parseFloat(this.width) - 48,
        fHeight: parseFloat(this.height) - 24,
        hasPaint: false,
        args: null,

        valueMap: new Map(),
      };
    },

    props: {
      data: {
        type: [Object, Array],
        default() {
          return {};
        },
      },
      width: {
        type: String,
        default: "400px",
      },
      height: {
        type: String,
        default: "300px",
      },
      buyFillColor: {
        type: String,
        default: "#09C989",
      },
      sellFillColor: {
        type: String,
        default: "#F24E4D",
      },
      gap: {
        type: Number,
        default: 0.1,
      },
      axisFontsize: {
        type: Number,
        default: 10,
      },
      jagged: {
        type: Boolean,
        default: false,
      },
      paddingTop: {
        type: Number,
        default: 10,
      },
      tipsPrice: {
        type: String,
        default: "Price",
      },
      tipsQuantity: {
        type: String,
        default: "Quantity",
      },
    },

    mounted() {
      this._initChart();
    },

    unmounted() {
      this._resetChart();
    },

    watch: {
      data: {
        handler(val) {
          this.valueMap = new Map();
          this.args = this._calcArgs(val, this.fWidth, this.fHeight);
          this._drawChart(val);
        },
        deep: true,
        immediate: false,
      },
    },

    computed: {
      isEmptyData() {
        return utils.isEmpty(this.data);
      },
    },

    methods: {
      _initChart() {
        this.chart = this.$refs["chart"];
        this.context = utils.getContext2D(this.chart);
        this.maskChart = this.$refs["chartMask"];
        this.maskContext = utils.getContext2D(this.maskChart);
        this.chartX = this.$refs["chartX"];
        this.xContext = utils.getContext2D(this.chartX);
        this.chartY = this.$refs["chartY"];
        this.yContext = utils.getContext2D(this.chartY);

        this._drawChart(this.data);
      },
      _resetChart() {
        this.chart = this.maskChart = this.chartX = this.chartY = null;
      },
      _drawChart(data) {
        if (!this.args) {
          this.args = this._calcArgs(this.data, this.fWidth, this.fHeight);
        }

        if (!this.isEmptyData) {
          const context = this.context;
          const width = parseFloat(this.fWidth);
          const height = parseFloat(this.fHeight);
          this._drawMainCanvas(context, data, width, height, this.args);
          // this._drawXLine(data);
          this._drawYLine(data);
          this.hasPaint = true;
        }
      },
      _drawXLine(data) {
        const contextX = this.xContext;
        const width = parseFloat(this.fWidth);
        if (this.hasPaint) contextX.clearRect(0, 0, width, 24);
        const { scaleW } = this.args;
        contextX.fillStyle = "#ccc";
        let x = 0;
        let y = 0;
        let buyLength = data["bids"].length;
        let sellLength = data["asks"].length;

        for (let i = 0; i < buyLength + sellLength; i++) {
          if (i % 4) continue;
          let index, text, textWidth;
          if (i < buyLength) {
            index = i;
            text = data["bids"][index][0];
            textWidth = contextX.measureText(text).width;
            x = width / 2 - i * scaleW - textWidth;
          } else {
            index = sellLength - (i - buyLength) - 1;
            text = data["asks"][index][0];
            textWidth = contextX.measureText(text).width;
            x = width / 2 + index * scaleW;
          }

          if (x + textWidth >= width) {
            x = width - textWidth;
          } else if (x <= 0) {
            x = 0;
          }
          y = this.axisFontsize || 12;
          contextX.fillText(text, x, y);
        }
      },
      _drawYLine() {
        let x = 0;
        let y = 0;

        const height = parseFloat(this.fHeight);
        const { maxAmount } = this.args;
        const contextY = this.yContext;
        if (this.hasPaint) contextY.clearRect(0, 0, 48, height);
        contextY.fillStyle = "#ccc";

        const seg = maxAmount / 7;
        for (let i = 1; i < 6; i++) {
          x = this.axisFontsize || 12;
          y = height - ((seg * i) / maxAmount) * height + 14;
          contextY.fillText(utils.toPretty(seg * i), x, y);
        }
      },
      _drawMainCanvas(context, data, width, height, args) {
        if (!args) {
          throw new Error("args not ok");
        }
        if (this.hasPaint) context.clearRect(0, 0, width, height);
        const { maxAmount, scaleW } = args;
        const paddingTop = this.paddingTop;
        let tempList = [];
        const gap = this.gap;
        context.beginPath();
        context.fillStyle = this.buyFillColor;

        let x = 0;
        let y = paddingTop;
        let lastPoint = { x, y };
        for (let i in data["bids"]) {
          x = width / 2 - i * scaleW - gap;
          y = height - (+data["bids"][i][2] / maxAmount) * height + paddingTop;
          if (y > height - paddingTop) y = height - paddingTop;

          tempList.push({
            x,
            y,
            value: data["bids"][i],
            side: "bids",
          });

          if (this.jagged) context.lineTo(x, lastPoint.y);
          context.lineTo(x, y);
          lastPoint = { x, y };
        }
        context.lineTo(0, y);
        context.lineTo(0, height);
        context.lineTo(width / 2 - gap, height);
        context.fill();
        context.closePath();
        context.beginPath();
        context.fillStyle = this.sellFillColor;
        context.moveTo(width / 2 + gap, height);
        lastPoint = {
          x: width / 2 + gap,
          y: height,
        };

        for (let i in data["asks"]) {
          const index = data["asks"].length - i - 1;
          x = width / 2 + i * scaleW + gap;
          y = height - (+data["asks"][index][2] / maxAmount) * height + paddingTop;
          if (y > height - paddingTop) y = height - paddingTop;
          tempList.push({
            x,
            y,
            value: data["asks"][index],
            side: "asks",
          });

          if (this.jagged) context.lineTo(x, lastPoint.y);
          context.lineTo(x, y);
          lastPoint = { x, y };
        }

        tempList = tempList.sort((a, b) => {
          return a.x - b.x;
        });

        tempList.forEach((item) => {
          this.valueMap.set([item.x, item.y, item.side], item.value);
        });

        context.lineTo(width + gap, y);
        context.lineTo(width + gap, height);
        context.lineTo(width / 2 + gap, height);
        context.fill();
        context.closePath();
      },
      _calcArgs(data, width, height) {
        if (!this.isEmptyData) {
          const maxAmount = Math.max(data["asks"][0][2], data["bids"][data["bids"].length - 1][2]);
          // const maxAmount = 135;
          const scaleH = maxAmount / height;
          const scaleW = width / 2 / data["asks"].length;

          return {
            maxAmount,
            scaleH,
            scaleW,
          };
        }
        return null;
      },
      onMouseMove({ offsetX, offsetY }) {
        const valueMap = this.valueMap;
        const maskContext = this.maskContext;
        const buyFillColor = this.buyFillColor;
        const sellFillColor = this.sellFillColor;
        const width = this.fWidth;
        const height = this.fHeight;
        for (let key of valueMap.keys()) {
          const x = key[0];
          const y = key[1];
          const side = key[2];
          const obj = valueMap.get(key);

          if (offsetX < x) {
            maskContext.strokeStyle = "rgba(200,200,200,0.5)";
            maskContext.lineWidth = 1;
            maskContext.setLineDash([2]);
            maskContext.clearRect(0, 0, width, height);
            maskContext.beginPath();
            maskContext.moveTo(0, y);
            maskContext.lineTo(width, y);
            maskContext.stroke();
            maskContext.closePath();

            maskContext.beginPath();
            maskContext.moveTo(x, 0);
            maskContext.lineTo(x, height);
            maskContext.stroke();
            maskContext.closePath();

            maskContext.beginPath();
            maskContext.shadowBlur = 10;
            maskContext.shadowColor = "rgba(0,0,0,0.8)";

            maskContext.fillStyle = "rgba(255,255,255, 1)";
            maskContext.arc(x, y, 5, 0, 2 * Math.PI);
            maskContext.fill();
            maskContext.closePath();

            maskContext.beginPath();

            maskContext.fillStyle = "rgba(255,255,255, 1)";
            maskContext.font = "12px bold";
            let widthOffset = 120;
            let heightOffset = 60;
            let left = x - widthOffset / 2;
            let top = y - heightOffset - 10;
            let tipsPriceText = `${this.tipsPrice} ${utils.toThousand(obj[0])}`;
            let tipsAmountText = `${this.tipsQuantity} ${utils.toThousand(obj[2])}`;
            let maxTextWidth = Math.max(maskContext.measureText(tipsPriceText).width, maskContext.measureText(tipsAmountText).width);
            if (maxTextWidth + 20 > widthOffset) widthOffset = maxTextWidth + 20;
            if (left < 0) left = 0;
            if (left >= width - widthOffset) left = width - widthOffset;
            if (top <= 0) top = y + 10;

            maskContext.fillRect(left, top, widthOffset, heightOffset);

            maskContext.fillStyle = side === "bids" ? buyFillColor : sellFillColor;
            maskContext.textAlign = "left";

            maskContext.shadowBlur = 0;

            const marginLeft = 10;
            const marginTop = 25;
            const lineHeight = 20;
            maskContext.fillText(tipsPriceText, left + marginLeft, top + marginTop);
            maskContext.fillText(tipsAmountText, left + marginLeft, top + marginTop + lineHeight);
            maskContext.closePath();
            break;
          }
        }
      },
      onMouseOut() {
        const maskContext = this.maskContext;
        const width = this.fWidth;
        const height = this.fHeight;
        maskContext.clearRect(0, 0, width, height);
      },
    },
  };
</script>

<style lang="css" scoped>
  canvas {
    position: absolute;
  }
  .deepth-chart-layout {
    position: relative;
    width: 100%;
    padding-top: 10px;
    /* overflow: hidden; */
  }
  .chart,
  .chart-mask {
    top: 0;
    left: 0;
    /* background: transparent; */
  }
  .chart-x {
    height: 24px;
  }
  .chart-y {
    width: 48px;
  }
</style>
