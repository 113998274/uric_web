<template>
  <div class="codemirror" style="width: 100%">
    <codemirrorref
    ="myCmGenerate"class="code-mirror"v-model="code":options="options"@changes="changes"@ready="onCmReady"@focus="onCmFocus"@input="onCmCodeChange"@scroll="onScrollFn"></codemirror>
    <br/>
    <a-space>
      <a-button type="primary" @click="handleRunCode">在线运行</a-button>
      <a-button type="primary" @click="handleConfirm">点击保存</a-button>
    </a-space>
    <a-card title="代码执行结果" style="width: 100%"><p> {{ this.data }}</p></a-card>
  </div>
</template>
<script>
import {codemirror} from 'vue-codemirror' // 引入组件
// 核心样式
import 'codemirror/lib/codemirror.css'// 引入主题后还需要在 options 中指定主题才会生效
import 'codemirror/theme/material.css'//设置代码编译类型，并在配置中设置指定项 mode
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/javascript/javascript'
import {run_online} from "@/services/driver_intercept";

export default {
  name: "CodeMirror", data() {
    return {api_str: 'http://localhost:7777/auth/run_online', code: '', // 编辑器绑定的值,对应v-model// 默认配置options: {tabSize: 4, // 缩进格式theme: 'material', // 主题，对应主题库 JS 需要提前引入lineNumbers: true, // 显示行号line: true,        // 检查格式autocorrect: true,  // 自动更正spellcheck: true,  // 拼写检查mode: { // 模式, 可查看 codemirror/mode 中的所有模式,运行代码类型name: 'python',json: true},styleActiveLine: true, // 高亮选中行hintOptions: {completeSingle: true // 当匹配只有一项的时候是否自动补全},foldGutter: true,  // 可将对象折叠，与下面的gutters一起使用gutters: ["CodeMirror-lint-markers","CodeMirror-linenumbers","CodeMirror-foldgutter"],highlightSelectionMatches: {minChars: 2,style: "matchhighlight",showToken: true},data: "",}}},methods: {onCmReady() {this.$refs.myCmGenerate.codemirror.setSize('100%', '400px')  //editor.setSize(width,height)},onCmFocus(instance, event) {console.log(instance)console.log(event)},onCmCodeChange(instance, obj) {console.log(instance)console.log(obj)},changes() {},onScrollFn() {},handleConfirm() {},handleRunCode() {this.loading = true;this.CodeMirrorEditor = this.$refs.myCmGenerate.codemirror;const lang = "python";const typed_code = this.code_content = this.CodeMirrorEditor.getValue(); //获取编辑器输入值editor.getValue()console.log('code-----',this.code_content);run_online(this.api_str, {lang, typed_code}).then((result) => {this.loading = false;this.data = result.data.errmsg;   //跟后端接口response对齐console.log('result---',this.data);}).catch((err) => {this.data = err;});}},components: {codemirror},mounted() {this.CodeMirrorEditor = this.$refs.myCmGenerate.codemirror;// this.code_content = this.CodeMirrorEditor.getValue();},}
</script>
<style></style>