/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Aluno {
  /** @format int32 */
  id?: number;
  nome?: string | null;
  email?: string | null;
  /** @format int32 */
  idade?: number;
  /** @format date-time */
  dataCadastro?: string | null;
}

export interface AlunoModel {
  /** @format int32 */
  id?: number;
  nome?: string | null;
  email?: string | null;
  /** @format int32 */
  idade?: number;
}

export interface LoginModel {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * @format password
   * @minLength 5
   * @maxLength 20
   */
  password: string;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface RegisterModel {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * @format password
   * @minLength 1
   */
  password: string;
  /** @format password */
  confirmPassword?: string | null;
}

export interface UserToken {
  token?: string | null;
  /** @format date-time */
  expiration?: string;
}

export interface AlunosGetByNomeListParams {
  nome?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Alunos API
 * @version v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Account
     * @name AccountRegisterCreate
     * @request POST:/api/Account/Register
     * @secure
     * @response `200` `UserToken` OK
     */
    accountRegisterCreate: (data: RegisterModel, params: RequestParams = {}) =>
      this.request<UserToken, any>({
        path: `/api/Account/Register`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Account
     * @name AccountLoginCreate
     * @request POST:/api/Account/Login
     * @secure
     * @response `200` `UserToken` OK
     */
    accountLoginCreate: (data: LoginModel, params: RequestParams = {}) =>
      this.request<UserToken, any>({
        path: `/api/Account/Login`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alunos
     * @name AlunosList
     * @request GET:/api/Alunos
     * @secure
     * @response `200` `(Aluno)[]` OK
     */
    alunosList: (params: RequestParams = {}) =>
      this.request<Aluno[], any>({
        path: `/api/Alunos`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alunos
     * @name AlunosCreate
     * @request POST:/api/Alunos
     * @secure
     * @response `201` `void` Created
     */
    alunosCreate: (data: AlunoModel, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/Alunos`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alunos
     * @name GetAluno
     * @request GET:/api/Alunos/{id}
     * @secure
     * @response `200` `Aluno` OK
     */
    getAluno: (id: number, params: RequestParams = {}) =>
      this.request<Aluno, any>({
        path: `/api/Alunos/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alunos
     * @name AlunosUpdate
     * @request PUT:/api/Alunos/{id}
     * @secure
     * @response `200` `void` OK
     * @response `400` `ProblemDetails` Bad Request
     */
    alunosUpdate: (id: number, data: AlunoModel, params: RequestParams = {}) =>
      this.request<void, ProblemDetails>({
        path: `/api/Alunos/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alunos
     * @name AlunosDelete
     * @request DELETE:/api/Alunos/{id}
     * @secure
     * @response `200` `void` OK
     * @response `404` `ProblemDetails` Not Found
     */
    alunosDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, ProblemDetails>({
        path: `/api/Alunos/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Alunos
     * @name AlunosGetByNomeList
     * @request GET:/api/Alunos/GetByNome
     * @secure
     * @response `200` `(Aluno)[]` OK
     * @response `404` `ProblemDetails` Not Found
     */
    alunosGetByNomeList: (query: AlunosGetByNomeListParams, params: RequestParams = {}) =>
      this.request<Aluno[], ProblemDetails>({
        path: `/api/Alunos/GetByNome`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
}
