import axios from 'axios';
import QS from 'querystring';
import config from '../config';
import router from '../../router'
import Utils from "@/js/utils";

// 请求域名
axios.defaults.baseURL = config.url;
axios.defaults.timeout = 10000;

// 请求拦截器(附带上token)
axios.interceptors.request.use(
    config => {
        const token = Utils.getToken();
        token && (config.headers.Authorization = 'Bearer ' + token);
        config.headers.common['meedu-platform'] = "PC";
        return config;
    },
    error => {
        return Promise.error(error);
    });

// 响应拦截器
axios.interceptors.response.use(
    response => {
        let code = response.data.code;
        if (code !== 0) {
            // 未登录错误
            if (code === 401) {
                Utils.clearToken();
                window.location.href = '/';
            }
            // api请求返回错误
            return Promise.reject(response);
        } else {
            return Promise.resolve(response);
        }
    },
    // 当http的状态码非2xx
    error => {
        let httpCode = error.response.status;
        if (httpCode === 401) {
            // 未登录
        } else if (httpCode === 403) {
            // 无权限
        } else if (httpCode === 404) {
            router.replace({
                name: "Error404"
            })

        } else if (httpCode === 500) {
            router.replace({
                name: "Error500"
            });
        } else {
            // 其他错误
        }
        return Promise.reject(error.response);
    }
);

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export function destroy(url) {
    return new Promise((resolve, reject) => {
        axios.delete(url).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}

export function put(url, params) {
    return new Promise((resolve, reject) => {
        axios.put(url, QS.stringify(params))
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}