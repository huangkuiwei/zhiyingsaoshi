<template>
  <view class="global-m">
    <view class="d-flex-center" v-if="type == 'file'">
      <wd-tabs v-model="tab">
        <block v-for="(item, index) in tabs" :key="index">
          <wd-tab :title="item.name" :name="item.name"> </wd-tab>
        </block>
      </wd-tabs>
    </view>
    <view>
      <image
        :src="urls.length > 0 ? urls[pageNum - 1] : null"
        style="width: 100%"
        mode="widthFix"
      />
    </view>
    <wd-gap height="50px"></wd-gap>
    <view class="pic-fixed">
      <wd-pagination
        :page-size="1"
        :hide-if-one-page="false"
        :total="urls.length"
        v-model="pageNum"
        @change="pageChange"
      />
      <wd-gap height="10px"></wd-gap>
      <view class="box">
        <view
          v-show="tab == 'image'"
          @click="index = 1"
          class="direct-li"
          :class="{ active: index == 1 }"
          style="font-size: 0.85rem"
        >
          <view style="text-align: center">
            <image
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/zongxiang.png"
              style="height: 22px"
              mode="heightFix"
            />
          </view>
          <view>竖向拼接</view>
        </view>
        <view
          v-if="tab == 'image'"
          @click="index = 2"
          class="direct-li"
          :class="{ active: index == 2 }"
          style="font-size: 0.85rem; margin-left: 10px"
        >
          <view style="text-align: center">
            <image
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/images/hengxiang.png"
              style="height: 22px"
              mode="heightFix"
            />
          </view>
          <view>横向拼接</view>
        </view>
        <view class="flex-1"></view>
        <view>
          <wd-button @click="toSubmit">转换</wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { toRouter } from "@/hooks/utils";
const urls = ref([]),
  url = ref(""),
  index = ref(1),
  type = ref(null),
  tabs = ref([
    { name: "image", type: "image" },
    { name: "word", type: "word" },
    { name: "pdf", type: "pdf" },
    { name: "excel", type: "excel" },
    { name: "ppt", type: "ppt" },
  ]),
  tab = ref("图像"),
  pageNum = ref(1);
onLoad((options) => {
  if (options.urls) {
    urls.value = options.urls.split(",");
    url.value = urls.value[0];
  }
  if (options.type) {
    type.value = options.type;
    console.log(tab.value);
    
  }
});

onShareAppMessage(() => {
  return {
    title: '高清电子文档一键转换',
    imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/share-img.jpg',
    path: '/pages/index/index',
  }
})


const toSubmit = () => {
  if(tab.value == 'image'){
    toRouter(
      "/pages/puzzle/index?urls=" + urls.value.join(",") + "&type=" + index.value
    );
  } else {
    toRouter('/pages/ai-file/index?urls=' + urls.value.join(',') + '&type=' + tab.value)
  }
  
};

const toDirect = () => {};

const pageChange = () => {};
</script>

<style scoped lang="scss">
.pic-fixed {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  box-shadow: 0 -4px 4px #eee;
  z-index: 9;
  background: #fff;
  --wot-button-primary-bg-color: #00D7AD;
  .box {
    height: 55px;
    display: flex;
    padding: 0 1.5rem;
    align-items: center;
  }
}
.direct-li {
  background: #f4f4f4;
  padding: 4px;
}
.direct-li.active {
  background: #d3ebfd;
}
</style>