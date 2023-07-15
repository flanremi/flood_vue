import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from "axios";


window._AMapSecurityConfig = {
    securityJsCode:"a7fdf5bb3762d44534fb96585ec2ca75",
}

// axios.defaults.baseURL = "https://mock.apifox.cn/m1/2969414-0-default"
axios.defaults.baseURL = "http://127.0.0.1:8088"

const app = createApp(App)

app.provide('global',{
    axios
})

app.use(ElementPlus)
app.mount('#app')

