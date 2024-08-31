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

    /**
     * Calls findCredential.
     * @param request FindCredentialRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and FindCredentialResponse
     */
    public findCredential(
      request: auth.IFindCredentialRequest,
      callback: auth.AuthService.findCredentialCallback,
    ): void;

    /**
     * Calls findCredential.
     * @param request FindCredentialRequest message or plain object
     * @returns Promise
     */
    public findCredential(
      request: auth.IFindCredentialRequest,
    ): Promise<auth.FindCredentialResponse>;

    /**
     * Calls validateCredential.
     * @param request ValidateCredentialRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and ValidateCredentialResponse
     */
    public validateCredential(
      request: auth.IValidateCredentialRequest,
      callback: auth.AuthService.validateCredentialCallback,
    ): void;

    /**
     * Calls validateCredential.
     * @param request ValidateCredentialRequest message or plain object
     * @returns Promise
     */
    public validateCredential(
      request: auth.IValidateCredentialRequest,
    ): Promise<auth.ValidateCredentialResponse>;

    /**
     * Calls issueToken.
     * @param request IssueTokenRequest message or plain object
     * @param callback Node-style callback called with the error, if any, and IssueTokenResponse
     */
    public issueToken(
      request: auth.IIssueTokenRequest,
      callback: auth.AuthService.issueTokenCallback,
    ): void;

    /**
     * Calls issueToken.
     * @param request IssueTokenRequest message or plain object
     * @returns Promise
     */
    public issueToken(
      request: auth.IIssueTokenRequest,
    ): Promise<auth.IssueTokenResponse>;
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

    /**
     * Callback as used by {@link auth.AuthService#findCredential}.
     * @param error Error, if any
     * @param [response] FindCredentialResponse
     */
    type findCredentialCallback = (
      error: Error | null,
      response?: auth.FindCredentialResponse,
    ) => void;

    /**
     * Callback as used by {@link auth.AuthService#validateCredential}.
     * @param error Error, if any
     * @param [response] ValidateCredentialResponse
     */
    type validateCredentialCallback = (
      error: Error | null,
      response?: auth.ValidateCredentialResponse,
    ) => void;

    /**
     * Callback as used by {@link auth.AuthService#issueToken}.
     * @param error Error, if any
     * @param [response] IssueTokenResponse
     */
    type issueTokenCallback = (
      error: Error | null,
      response?: auth.IssueTokenResponse,
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

  /** Properties of a FindCredentialRequest. */
  interface IFindCredentialRequest {
    /** FindCredentialRequest id */
    id?: string | null;
  }

  /** Represents a FindCredentialRequest. */
  class FindCredentialRequest implements IFindCredentialRequest {
    /**
     * Constructs a new FindCredentialRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.IFindCredentialRequest);

    /** FindCredentialRequest id. */
    public id: string;

    /**
     * Creates a new FindCredentialRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FindCredentialRequest instance
     */
    public static create(
      properties?: auth.IFindCredentialRequest,
    ): auth.FindCredentialRequest;

    /**
     * Encodes the specified FindCredentialRequest message. Does not implicitly {@link auth.FindCredentialRequest.verify|verify} messages.
     * @param message FindCredentialRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.IFindCredentialRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified FindCredentialRequest message, length delimited. Does not implicitly {@link auth.FindCredentialRequest.verify|verify} messages.
     * @param message FindCredentialRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.IFindCredentialRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a FindCredentialRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FindCredentialRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.FindCredentialRequest;

    /**
     * Decodes a FindCredentialRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FindCredentialRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.FindCredentialRequest;

    /**
     * Verifies a FindCredentialRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a FindCredentialRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FindCredentialRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.FindCredentialRequest;

    /**
     * Creates a plain object from a FindCredentialRequest message. Also converts values to other types if specified.
     * @param message FindCredentialRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.FindCredentialRequest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this FindCredentialRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FindCredentialRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a FindCredentialResponse. */
  interface IFindCredentialResponse {
    /** FindCredentialResponse id */
    id?: string | null;

    /** FindCredentialResponse username */
    username?: string | null;

    /** FindCredentialResponse createdAt */
    createdAt?: string | null;

    /** FindCredentialResponse updatedAt */
    updatedAt?: string | null;
  }

  /** Represents a FindCredentialResponse. */
  class FindCredentialResponse implements IFindCredentialResponse {
    /**
     * Constructs a new FindCredentialResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.IFindCredentialResponse);

    /** FindCredentialResponse id. */
    public id: string;

    /** FindCredentialResponse username. */
    public username: string;

    /** FindCredentialResponse createdAt. */
    public createdAt: string;

    /** FindCredentialResponse updatedAt. */
    public updatedAt: string;

    /**
     * Creates a new FindCredentialResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns FindCredentialResponse instance
     */
    public static create(
      properties?: auth.IFindCredentialResponse,
    ): auth.FindCredentialResponse;

    /**
     * Encodes the specified FindCredentialResponse message. Does not implicitly {@link auth.FindCredentialResponse.verify|verify} messages.
     * @param message FindCredentialResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.IFindCredentialResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified FindCredentialResponse message, length delimited. Does not implicitly {@link auth.FindCredentialResponse.verify|verify} messages.
     * @param message FindCredentialResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.IFindCredentialResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a FindCredentialResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns FindCredentialResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.FindCredentialResponse;

    /**
     * Decodes a FindCredentialResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns FindCredentialResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.FindCredentialResponse;

    /**
     * Verifies a FindCredentialResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a FindCredentialResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns FindCredentialResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.FindCredentialResponse;

    /**
     * Creates a plain object from a FindCredentialResponse message. Also converts values to other types if specified.
     * @param message FindCredentialResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.FindCredentialResponse,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this FindCredentialResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for FindCredentialResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ValidateCredentialRequest. */
  interface IValidateCredentialRequest {
    /** ValidateCredentialRequest username */
    username?: string | null;

    /** ValidateCredentialRequest password */
    password?: string | null;
  }

  /** Represents a ValidateCredentialRequest. */
  class ValidateCredentialRequest implements IValidateCredentialRequest {
    /**
     * Constructs a new ValidateCredentialRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.IValidateCredentialRequest);

    /** ValidateCredentialRequest username. */
    public username: string;

    /** ValidateCredentialRequest password. */
    public password: string;

    /**
     * Creates a new ValidateCredentialRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ValidateCredentialRequest instance
     */
    public static create(
      properties?: auth.IValidateCredentialRequest,
    ): auth.ValidateCredentialRequest;

    /**
     * Encodes the specified ValidateCredentialRequest message. Does not implicitly {@link auth.ValidateCredentialRequest.verify|verify} messages.
     * @param message ValidateCredentialRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.IValidateCredentialRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ValidateCredentialRequest message, length delimited. Does not implicitly {@link auth.ValidateCredentialRequest.verify|verify} messages.
     * @param message ValidateCredentialRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.IValidateCredentialRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ValidateCredentialRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ValidateCredentialRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.ValidateCredentialRequest;

    /**
     * Decodes a ValidateCredentialRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ValidateCredentialRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.ValidateCredentialRequest;

    /**
     * Verifies a ValidateCredentialRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ValidateCredentialRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ValidateCredentialRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.ValidateCredentialRequest;

    /**
     * Creates a plain object from a ValidateCredentialRequest message. Also converts values to other types if specified.
     * @param message ValidateCredentialRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.ValidateCredentialRequest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ValidateCredentialRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ValidateCredentialRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ValidateCredentialResponse. */
  interface IValidateCredentialResponse {
    /** ValidateCredentialResponse isValid */
    isValid?: boolean | null;
  }

  /** Represents a ValidateCredentialResponse. */
  class ValidateCredentialResponse implements IValidateCredentialResponse {
    /**
     * Constructs a new ValidateCredentialResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.IValidateCredentialResponse);

    /** ValidateCredentialResponse isValid. */
    public isValid: boolean;

    /**
     * Creates a new ValidateCredentialResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ValidateCredentialResponse instance
     */
    public static create(
      properties?: auth.IValidateCredentialResponse,
    ): auth.ValidateCredentialResponse;

    /**
     * Encodes the specified ValidateCredentialResponse message. Does not implicitly {@link auth.ValidateCredentialResponse.verify|verify} messages.
     * @param message ValidateCredentialResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.IValidateCredentialResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ValidateCredentialResponse message, length delimited. Does not implicitly {@link auth.ValidateCredentialResponse.verify|verify} messages.
     * @param message ValidateCredentialResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.IValidateCredentialResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ValidateCredentialResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ValidateCredentialResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.ValidateCredentialResponse;

    /**
     * Decodes a ValidateCredentialResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ValidateCredentialResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.ValidateCredentialResponse;

    /**
     * Verifies a ValidateCredentialResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ValidateCredentialResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ValidateCredentialResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.ValidateCredentialResponse;

    /**
     * Creates a plain object from a ValidateCredentialResponse message. Also converts values to other types if specified.
     * @param message ValidateCredentialResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.ValidateCredentialResponse,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ValidateCredentialResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ValidateCredentialResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an IssueTokenRequest. */
  interface IIssueTokenRequest {
    /** IssueTokenRequest username */
    username?: string | null;

    /** IssueTokenRequest password */
    password?: string | null;
  }

  /** Represents an IssueTokenRequest. */
  class IssueTokenRequest implements IIssueTokenRequest {
    /**
     * Constructs a new IssueTokenRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.IIssueTokenRequest);

    /** IssueTokenRequest username. */
    public username: string;

    /** IssueTokenRequest password. */
    public password: string;

    /**
     * Creates a new IssueTokenRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IssueTokenRequest instance
     */
    public static create(
      properties?: auth.IIssueTokenRequest,
    ): auth.IssueTokenRequest;

    /**
     * Encodes the specified IssueTokenRequest message. Does not implicitly {@link auth.IssueTokenRequest.verify|verify} messages.
     * @param message IssueTokenRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.IIssueTokenRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified IssueTokenRequest message, length delimited. Does not implicitly {@link auth.IssueTokenRequest.verify|verify} messages.
     * @param message IssueTokenRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.IIssueTokenRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an IssueTokenRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IssueTokenRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.IssueTokenRequest;

    /**
     * Decodes an IssueTokenRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IssueTokenRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.IssueTokenRequest;

    /**
     * Verifies an IssueTokenRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an IssueTokenRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IssueTokenRequest
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.IssueTokenRequest;

    /**
     * Creates a plain object from an IssueTokenRequest message. Also converts values to other types if specified.
     * @param message IssueTokenRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.IssueTokenRequest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this IssueTokenRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for IssueTokenRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an IssueTokenResponse. */
  interface IIssueTokenResponse {
    /** IssueTokenResponse accessToken */
    accessToken?: string | null;

    /** IssueTokenResponse refreshToken */
    refreshToken?: string | null;
  }

  /** Represents an IssueTokenResponse. */
  class IssueTokenResponse implements IIssueTokenResponse {
    /**
     * Constructs a new IssueTokenResponse.
     * @param [properties] Properties to set
     */
    constructor(properties?: auth.IIssueTokenResponse);

    /** IssueTokenResponse accessToken. */
    public accessToken: string;

    /** IssueTokenResponse refreshToken. */
    public refreshToken: string;

    /**
     * Creates a new IssueTokenResponse instance using the specified properties.
     * @param [properties] Properties to set
     * @returns IssueTokenResponse instance
     */
    public static create(
      properties?: auth.IIssueTokenResponse,
    ): auth.IssueTokenResponse;

    /**
     * Encodes the specified IssueTokenResponse message. Does not implicitly {@link auth.IssueTokenResponse.verify|verify} messages.
     * @param message IssueTokenResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: auth.IIssueTokenResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified IssueTokenResponse message, length delimited. Does not implicitly {@link auth.IssueTokenResponse.verify|verify} messages.
     * @param message IssueTokenResponse message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: auth.IIssueTokenResponse,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an IssueTokenResponse message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns IssueTokenResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): auth.IssueTokenResponse;

    /**
     * Decodes an IssueTokenResponse message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns IssueTokenResponse
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): auth.IssueTokenResponse;

    /**
     * Verifies an IssueTokenResponse message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an IssueTokenResponse message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns IssueTokenResponse
     */
    public static fromObject(object: {
      [k: string]: any;
    }): auth.IssueTokenResponse;

    /**
     * Creates a plain object from an IssueTokenResponse message. Also converts values to other types if specified.
     * @param message IssueTokenResponse
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: auth.IssueTokenResponse,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this IssueTokenResponse to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for IssueTokenResponse
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}
