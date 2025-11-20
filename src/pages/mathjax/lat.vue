<template>
  <view v-html="mathjax"></view>
</template>

<script>
import { ref, nextTick } from "vue";
import { onLoad } from "@dcloudio/uni-app";

export default {
  name: "MathJax",
  setup() {
    return {
      mathjax: ref(""),
    };
  },
  mounted() {
    nextTick(() => {
      let t = `y = \\sqrt { \\frac { \\left( x - 1 \\right) \\cos 2 x } { \\left( 2 x + 3 \\right) \\left( 3 - 4 x \\right) } }`;
      MathJax.tex2svg(t, { display: true }, (svg) => {
        this.mathjax.value = svg.outerHTML;
      });
    });
  },
};
</script>