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

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CreateUserResponse {
  id: string;
  isSuperUser: boolean;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  isActive: boolean;
  username: string;
  email: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
  /** @format date-time */
  lastLogin: string | null;
}

export interface Avatar {
  /** @format date-time */
  createdAt: string;
  id: string;
  /** @format date-time */
  updatedAt: string;
  url: string;
  userId: string;
}

export interface Users {
  id: string;
  email: string;
  createdAt: string;
  firstName: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperUser: boolean;
  lastLogin: string;
  lastName: string;
  password: string;
  updatedAt: string;
  username: string;
  avatar: Avatar;
}

export interface UsersPagedResult {
  /** The total number of users */
  count: number;
  /** The list of users */
  data: Users[];
}

export interface Login {
  email: string;
  password: string;
}

export interface AdminLog {
  action: string;
  /** @format date-time */
  createdAt: string;
  changeMessage: string;
  contentTypeId: string;
  id: string;
  objectId: string;
  objectRepr: string;
  /** @format date-time */
  updatedAt: string;
  userId: string;
}

export interface Group {
  id: string;
  name: string;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  updatedAt: string;
}

export interface Permission {
  codename: string;
  contentTypeId: string;
  /** @format date-time */
  createdAt: string;
  id: string;
  name: string;
  /** @format date-time */
  updatedAt: string;
}

export interface Profile {
  adminLogs?: AdminLog[];
  /** @format date-time */
  createdAt: string;
  email: string;
  firstName: string;
  groups?: Group[];
  id: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperUser: boolean;
  /** @format date-time */
  lastLogin?: string;
  lastName: string;
  permissions?: Permission[];
  /** @format date-time */
  updatedAt: string;
  username: string;
  avatar?: Avatar;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
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

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || '',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
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
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData
          ? { 'Content-Type': type }
          : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Messenger Clone API
 * @version 1.0
 * @contact
 *
 * The messenger clone API description
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/`,
      method: 'GET',
      ...params,
    });

  users = {
    /**
     * No description
     *
     * @tags users
     * @name UsersControllerCreateUser
     * @summary Create a new user
     * @request POST:/users
     */
    usersControllerCreateUser: (
      data: CreateUserRequest,
      params: RequestParams = {}
    ) =>
      this.request<CreateUserResponse, void>({
        path: `/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersControllerGetUsers
     * @summary Get all users
     * @request GET:/users
     */
    usersControllerGetUsers: (
      query: {
        skip: number;
        take: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<UsersPagedResult, void>({
        path: `/users`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @name AuthControllerLogin
     * @request POST:/auth/login
     */
    authControllerLogin: (data: Login, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerLogout
     * @request POST:/auth/logout
     */
    authControllerLogout: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/auth/logout`,
        method: 'POST',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @name AuthControllerGetProfile
     * @request GET:/auth/profile
     */
    authControllerGetProfile: (params: RequestParams = {}) =>
      this.request<Profile, any>({
        path: `/auth/profile`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  avatars = {
    /**
     * No description
     *
     * @tags avatars
     * @name AvatarsControllerCreateAvatar
     * @request POST:/avatars/{userId}
     */
    avatarsControllerCreateAvatar: (
      userId: string,
      data: any,
      params: RequestParams = {}
    ) =>
      this.request<void, any>({
        path: `/avatars/${userId}`,
        method: 'POST',
        body: data,
        type: ContentType.FormData,
        ...params,
      }),
  };
}
