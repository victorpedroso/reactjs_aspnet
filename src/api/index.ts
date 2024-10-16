import { Api } from "./api";
import { config } from "../config";

const apiInstance = new Api({ baseURL: config.baseUrl });

export default apiInstance;
