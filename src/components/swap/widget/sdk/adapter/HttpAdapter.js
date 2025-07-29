import axios from 'axios';
import { omit } from 'lodash';

export default class HttpAdapter {
    constructor(config) {
        this.axios = axios.create({
            ...omit(config, ["config"]),
            baseURL: config?.baseURL,
            timeout: config?.timeout
        });

        if (config) {
            this.setConfig(config);
        }
    }

    async get(url, config) {
        return await this.axios.get(url, config);
    }

    async post(url, data, config) {
        return await this.axios.post(url, data, config);
    }

    setConfig(config) {
        if (!config) throw new Error("config object undefined");
        this.axios = axios.create(config);
    }
}