import * as $protobuf from 'protobufjs';
import Long = require('long');
/** Namespace auth. */
export namespace auth {
  /** Represents an AuthService */
  class AuthService extends $protobuf.rpc.Service {
    /**
     * Constructs a new AuthService service.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     */
    constructor(
      rpcImpl: $protobuf.RPCImpl,
      requestDelimited?: boolean,
      responseDelimited?: boolean,
    );

    /**
     * Creates new AuthService service using the specified rpc implementation.
     * @param rpcImpl RPC implementation
     * @param [requestDelimited=false] Whether requests are length-delimited
     * @param [responseDelimited=false] Whether responses are length-delimited
     * @returns RPC service. Useful where requests and/or responses are streamed.
     */
    public static create(
      rpcImpl: $protobuf.RPCImpl,
      requestDelimited?: boolean,
      responseDelimited?: boolean,
    ): AuthService;

    /**
     * Calls createUsernameAndPassword.
     * @param request CreateUsernameAndPasswordRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and CreateUsernameAndPasswordResponse
     */
    public createUsernameAndPassword(
      request: auth.ICreateUsernameAndPasswordRequest,
      callback: auth.AuthService.createUsernameAndPasswordCallback,
    ): void;

    /**
     * Calls createUsernameAndPassword.
     * @param request CreateUsernameAndPasswordRequest message or plain object
     * @returns Promise
     */
    public createUsernameAndPassword(
      request: auth.ICreateUsernameAndPasswordRequest,
    ): Promise<auth.CreateUsernameAndPasswordResponse>;
  }

  namespace AuthService {
    /**
     * Callback as used by {@link auth.AuthService#createUsernameAndPassword}.
     * @param error Error, if any
     * @param [response] CreateUsernameAndPasswordResponse
     */
    type createUsernameAndPasswordCallback = (
      error: Error | null,
      response?: auth.CreateUsernameAndPasswordResponse,
    ) => void;
  }

  /** Properties of a CreateUsernameAndPasswordRequest. */
  interface ICreateUsernameAndPasswordRequest {
    /** CreateUsernameAndPasswordRequest username */
    username?: string | null;

    /** CreateUsernameAndPasswordRequest password */
    password?: string | null;
  }

  /** Represents a CreateUsernameAndPasswordRequest. */
  class CreateUsernameAndPasswordRequest
    implements ICreateUsernameAndPasswordRequest
  {
    /**
     * Constructs a new CreateUsernameAndPasswordRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.ICreateUsernameAndPasswordRequest);

    /** CreateUsernameAndPasswordRequest username. */
    public username: string;

    /** CreateUsernameAndPasswordRequest password. */
    public password: string;

    /**
     * Creates a new CreateUsernameAndPasswordRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateUsernameAndPasswordRequest instance
     */
    public static create(
      properties?: auth.ICreateUsernameAndPasswordRequest,
    ): auth.CreateUsernameAndPasswordRequest;

    /**
     * Encodes the specified CreateUsernameAndPasswordRequest message. Does not implicitly {@link auth.CreateUsernameAndPasswordRequest.verify|verify} messages.
     * @param message CreateUsernameAndPasswordRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.ICreateUsernameAndPasswordRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified CreateUsernameAndPasswordRequest message, length delimited. Does not implicitly {@link auth.CreateUsernameAndPasswordRequest.verify|verify} messages.
     * @param message CreateUsernameAndPasswordRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.ICreateUsernameAndPasswordRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a CreateUsernameAndPasswordRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateUsernameAndPasswordRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.CreateUsernameAndPasswordRequest;

    /**
     * Decodes a CreateUsernameAndPasswordRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateUsernameAndPasswordRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.CreateUsernameAndPasswordRequest;

    /**
     * Verifies a CreateUsernameAndPasswordRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CreateUsernameAndPasswordRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateUsernameAndPasswordRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.CreateUsernameAndPasswordRequest;

    /**
     * Creates a plain object from a CreateUsernameAndPasswordRequest message. Also converts values to other types if specified.
     * @param message CreateUsernameAndPasswordRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.CreateUsernameAndPasswordRequest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this CreateUsernameAndPasswordRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CreateUsernameAndPasswordRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CreateUsernameAndPasswordResponse. */
  interface ICreateUsernameAndPasswordResponse {
    /** CreateUsernameAndPasswordResponse clientId */
    clientId?: string | null;
  }

  /** Represents a CreateUsernameAndPasswordResponse. */
  class CreateUsernameAndPasswordResponse
    implements ICreateUsernameAndPasswordResponse
  {
    /**
     * Constructs a new CreateUsernameAndPasswordResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.ICreateUsernameAndPasswordResponse);

    /** CreateUsernameAndPasswordResponse clientId. */
    public clientId: string;

    /**
     * Creates a new CreateUsernameAndPasswordResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateUsernameAndPasswordResponse instance
     */
    public static create(
      properties?: auth.ICreateUsernameAndPasswordResponse,
    ): auth.CreateUsernameAndPasswordResponse;

    /**
     * Encodes the specified CreateUsernameAndPasswordResponse message. Does not implicitly {@link auth.CreateUsernameAndPasswordResponse.verify|verify} messages.
     * @param message CreateUsernameAndPasswordResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.ICreateUsernameAndPasswordResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified CreateUsernameAndPasswordResponse message, length delimited. Does not implicitly {@link auth.CreateUsernameAndPasswordResponse.verify|verify} messages.
     * @param message CreateUsernameAndPasswordResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.ICreateUsernameAndPasswordResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a CreateUsernameAndPasswordResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateUsernameAndPasswordResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.CreateUsernameAndPasswordResponse;

    /**
     * Decodes a CreateUsernameAndPasswordResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateUsernameAndPasswordResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.CreateUsernameAndPasswordResponse;

    /**
     * Verifies a CreateUsernameAndPasswordResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CreateUsernameAndPasswordResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateUsernameAndPasswordResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.CreateUsernameAndPasswordResponse;

    /**
     * Creates a plain object from a CreateUsernameAndPasswordResponse message. Also converts values to other types if specified.
     * @param message CreateUsernameAndPasswordResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.CreateUsernameAndPasswordResponse,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this CreateUsernameAndPasswordResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CreateUsernameAndPasswordResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}
