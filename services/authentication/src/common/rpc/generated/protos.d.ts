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
     * Calls createCredential.
     * @param request CreateCredentialRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and CreateCredentialResponse
     */
    public createCredential(
      request: auth.ICreateCredentialRequest,
      callback: auth.AuthService.createCredentialCallback,
    ): void;

    /**
     * Calls createCredential.
     * @param request CreateCredentialRequest message or plain object
     * @returns Promise
     */
    public createCredential(
      request: auth.ICreateCredentialRequest,
    ): Promise<auth.CreateCredentialResponse>;
  }

  namespace AuthService {
    /**
     * Callback as used by {@link auth.AuthService#createCredential}.
     * @param error Error, if any
     * @param [response] CreateCredentialResponse
     */
    type createCredentialCallback = (
      error: Error | null,
      response?: auth.CreateCredentialResponse,
    ) => void;
  }

  /** Properties of a CreateCredentialRequest. */
  interface ICreateCredentialRequest {
    /** CreateCredentialRequest username */
    username?: string | null;

    /** CreateCredentialRequest password */
    password?: string | null;
  }

  /** Represents a CreateCredentialRequest. */
  class CreateCredentialRequest implements ICreateCredentialRequest {
    /**
     * Constructs a new CreateCredentialRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.ICreateCredentialRequest);

    /** CreateCredentialRequest username. */
    public username: string;

    /** CreateCredentialRequest password. */
    public password: string;

    /**
     * Creates a new CreateCredentialRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateCredentialRequest instance
     */
    public static create(
      properties?: auth.ICreateCredentialRequest,
    ): auth.CreateCredentialRequest;

    /**
     * Encodes the specified CreateCredentialRequest message. Does not implicitly {@link auth.CreateCredentialRequest.verify|verify} messages.
     * @param message CreateCredentialRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.ICreateCredentialRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified CreateCredentialRequest message, length delimited. Does not implicitly {@link auth.CreateCredentialRequest.verify|verify} messages.
     * @param message CreateCredentialRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.ICreateCredentialRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a CreateCredentialRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateCredentialRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.CreateCredentialRequest;

    /**
     * Decodes a CreateCredentialRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateCredentialRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.CreateCredentialRequest;

    /**
     * Verifies a CreateCredentialRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CreateCredentialRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateCredentialRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.CreateCredentialRequest;

    /**
     * Creates a plain object from a CreateCredentialRequest message. Also converts values to other types if specified.
     * @param message CreateCredentialRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.CreateCredentialRequest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this CreateCredentialRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CreateCredentialRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a CreateCredentialResponse. */
  interface ICreateCredentialResponse {
    /** CreateCredentialResponse clientId */
    clientId?: string | null;
  }

  /** Represents a CreateCredentialResponse. */
  class CreateCredentialResponse implements ICreateCredentialResponse {
    /**
     * Constructs a new CreateCredentialResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.ICreateCredentialResponse);

    /** CreateCredentialResponse clientId. */
    public clientId: string;

    /**
     * Creates a new CreateCredentialResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateCredentialResponse instance
     */
    public static create(
      properties?: auth.ICreateCredentialResponse,
    ): auth.CreateCredentialResponse;

    /**
     * Encodes the specified CreateCredentialResponse message. Does not implicitly {@link auth.CreateCredentialResponse.verify|verify} messages.
     * @param message CreateCredentialResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.ICreateCredentialResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified CreateCredentialResponse message, length delimited. Does not implicitly {@link auth.CreateCredentialResponse.verify|verify} messages.
     * @param message CreateCredentialResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.ICreateCredentialResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a CreateCredentialResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateCredentialResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.CreateCredentialResponse;

    /**
     * Decodes a CreateCredentialResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateCredentialResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.CreateCredentialResponse;

    /**
     * Verifies a CreateCredentialResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a CreateCredentialResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateCredentialResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.CreateCredentialResponse;

    /**
     * Creates a plain object from a CreateCredentialResponse message. Also converts values to other types if specified.
     * @param message CreateCredentialResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.CreateCredentialResponse,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this CreateCredentialResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CreateCredentialResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}
