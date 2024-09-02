/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.auth = (function() {

    /**
     * Namespace auth.
     * @exports auth
     * @namespace
     */
    var auth = {};

    auth.AuthService = (function() {

        /**
         * Constructs a new AuthService service.
         * @memberof auth
         * @classdesc Represents an AuthService
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function AuthService(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (AuthService.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = AuthService;

        /**
         * Creates new AuthService service using the specified rpc implementation.
         * @function create
         * @memberof auth.AuthService
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {AuthService} RPC service. Useful where requests and/or responses are streamed.
         */
        AuthService.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link auth.AuthService#createCredential}.
         * @memberof auth.AuthService
         * @typedef createCredentialCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {auth.CreateCredentialResponse} [response] CreateCredentialResponse
         */

        /**
         * Calls createCredential.
         * @function createCredential
         * @memberof auth.AuthService
         * @instance
         * @param {auth.ICreateCredentialRequest} request CreateCredentialRequest message or plain object
         * @param {auth.AuthService.createCredentialCallback} callback Node-style callback called with the error, if any, and CreateCredentialResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AuthService.prototype.createCredential = function createCredential(request, callback) {
            return this.rpcCall(createCredential, $root.auth.CreateCredentialRequest, $root.auth.CreateCredentialResponse, request, callback);
        }, "name", { value: "createCredential" });

        /**
         * Calls createCredential.
         * @function createCredential
         * @memberof auth.AuthService
         * @instance
         * @param {auth.ICreateCredentialRequest} request CreateCredentialRequest message or plain object
         * @returns {Promise<auth.CreateCredentialResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link auth.AuthService#findCredential}.
         * @memberof auth.AuthService
         * @typedef findCredentialCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {auth.FindCredentialResponse} [response] FindCredentialResponse
         */

        /**
         * Calls findCredential.
         * @function findCredential
         * @memberof auth.AuthService
         * @instance
         * @param {auth.IFindCredentialRequest} request FindCredentialRequest message or plain object
         * @param {auth.AuthService.findCredentialCallback} callback Node-style callback called with the error, if any, and FindCredentialResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AuthService.prototype.findCredential = function findCredential(request, callback) {
            return this.rpcCall(findCredential, $root.auth.FindCredentialRequest, $root.auth.FindCredentialResponse, request, callback);
        }, "name", { value: "findCredential" });

        /**
         * Calls findCredential.
         * @function findCredential
         * @memberof auth.AuthService
         * @instance
         * @param {auth.IFindCredentialRequest} request FindCredentialRequest message or plain object
         * @returns {Promise<auth.FindCredentialResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link auth.AuthService#validateCredential}.
         * @memberof auth.AuthService
         * @typedef validateCredentialCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {auth.ValidateCredentialResponse} [response] ValidateCredentialResponse
         */

        /**
         * Calls validateCredential.
         * @function validateCredential
         * @memberof auth.AuthService
         * @instance
         * @param {auth.IValidateCredentialRequest} request ValidateCredentialRequest message or plain object
         * @param {auth.AuthService.validateCredentialCallback} callback Node-style callback called with the error, if any, and ValidateCredentialResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AuthService.prototype.validateCredential = function validateCredential(request, callback) {
            return this.rpcCall(validateCredential, $root.auth.ValidateCredentialRequest, $root.auth.ValidateCredentialResponse, request, callback);
        }, "name", { value: "validateCredential" });

        /**
         * Calls validateCredential.
         * @function validateCredential
         * @memberof auth.AuthService
         * @instance
         * @param {auth.IValidateCredentialRequest} request ValidateCredentialRequest message or plain object
         * @returns {Promise<auth.ValidateCredentialResponse>} Promise
         * @variation 2
         */

        /**
         * Callback as used by {@link auth.AuthService#issueToken}.
         * @memberof auth.AuthService
         * @typedef issueTokenCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {auth.IssueTokenResponse} [response] IssueTokenResponse
         */

        /**
         * Calls issueToken.
         * @function issueToken
         * @memberof auth.AuthService
         * @instance
         * @param {auth.IIssueTokenRequest} request IssueTokenRequest message or plain object
         * @param {auth.AuthService.issueTokenCallback} callback Node-style callback called with the error, if any, and IssueTokenResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AuthService.prototype.issueToken = function issueToken(request, callback) {
            return this.rpcCall(issueToken, $root.auth.IssueTokenRequest, $root.auth.IssueTokenResponse, request, callback);
        }, "name", { value: "issueToken" });

        /**
         * Calls issueToken.
         * @function issueToken
         * @memberof auth.AuthService
         * @instance
         * @param {auth.IIssueTokenRequest} request IssueTokenRequest message or plain object
         * @returns {Promise<auth.IssueTokenResponse>} Promise
         * @variation 2
         */

        return AuthService;
    })();

    auth.CreateCredentialRequest = (function() {

        /**
         * Properties of a CreateCredentialRequest.
         * @memberof auth
         * @interface ICreateCredentialRequest
         * @property {string|null} [username] CreateCredentialRequest username
         * @property {string|null} [password] CreateCredentialRequest password
         */

        /**
         * Constructs a new CreateCredentialRequest.
         * @memberof auth
         * @classdesc Represents a CreateCredentialRequest.
         * @implements ICreateCredentialRequest
         * @constructor
         * @param {auth.ICreateCredentialRequest=} [properties] Properties to set
         */
        function CreateCredentialRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateCredentialRequest username.
         * @member {string} username
         * @memberof auth.CreateCredentialRequest
         * @instance
         */
        CreateCredentialRequest.prototype.username = "";

        /**
         * CreateCredentialRequest password.
         * @member {string} password
         * @memberof auth.CreateCredentialRequest
         * @instance
         */
        CreateCredentialRequest.prototype.password = "";

        /**
         * Creates a new CreateCredentialRequest instance using the specified properties.
         * @function create
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {auth.ICreateCredentialRequest=} [properties] Properties to set
         * @returns {auth.CreateCredentialRequest} CreateCredentialRequest instance
         */
        CreateCredentialRequest.create = function create(properties) {
            return new CreateCredentialRequest(properties);
        };

        /**
         * Encodes the specified CreateCredentialRequest message. Does not implicitly {@link auth.CreateCredentialRequest.verify|verify} messages.
         * @function encode
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {auth.ICreateCredentialRequest} message CreateCredentialRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCredentialRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            return writer;
        };

        /**
         * Encodes the specified CreateCredentialRequest message, length delimited. Does not implicitly {@link auth.CreateCredentialRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {auth.ICreateCredentialRequest} message CreateCredentialRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCredentialRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateCredentialRequest message from the specified reader or buffer.
         * @function decode
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.CreateCredentialRequest} CreateCredentialRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCredentialRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.CreateCredentialRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.password = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateCredentialRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.CreateCredentialRequest} CreateCredentialRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCredentialRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateCredentialRequest message.
         * @function verify
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateCredentialRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            return null;
        };

        /**
         * Creates a CreateCredentialRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.CreateCredentialRequest} CreateCredentialRequest
         */
        CreateCredentialRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.CreateCredentialRequest)
                return object;
            var message = new $root.auth.CreateCredentialRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.password != null)
                message.password = String(object.password);
            return message;
        };

        /**
         * Creates a plain object from a CreateCredentialRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {auth.CreateCredentialRequest} message CreateCredentialRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateCredentialRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.username = "";
                object.password = "";
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            return object;
        };

        /**
         * Converts this CreateCredentialRequest to JSON.
         * @function toJSON
         * @memberof auth.CreateCredentialRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateCredentialRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateCredentialRequest
         * @function getTypeUrl
         * @memberof auth.CreateCredentialRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateCredentialRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.CreateCredentialRequest";
        };

        return CreateCredentialRequest;
    })();

    auth.CreateCredentialResponse = (function() {

        /**
         * Properties of a CreateCredentialResponse.
         * @memberof auth
         * @interface ICreateCredentialResponse
         * @property {string|null} [clientId] CreateCredentialResponse clientId
         */

        /**
         * Constructs a new CreateCredentialResponse.
         * @memberof auth
         * @classdesc Represents a CreateCredentialResponse.
         * @implements ICreateCredentialResponse
         * @constructor
         * @param {auth.ICreateCredentialResponse=} [properties] Properties to set
         */
        function CreateCredentialResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateCredentialResponse clientId.
         * @member {string} clientId
         * @memberof auth.CreateCredentialResponse
         * @instance
         */
        CreateCredentialResponse.prototype.clientId = "";

        /**
         * Creates a new CreateCredentialResponse instance using the specified properties.
         * @function create
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {auth.ICreateCredentialResponse=} [properties] Properties to set
         * @returns {auth.CreateCredentialResponse} CreateCredentialResponse instance
         */
        CreateCredentialResponse.create = function create(properties) {
            return new CreateCredentialResponse(properties);
        };

        /**
         * Encodes the specified CreateCredentialResponse message. Does not implicitly {@link auth.CreateCredentialResponse.verify|verify} messages.
         * @function encode
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {auth.ICreateCredentialResponse} message CreateCredentialResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCredentialResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
            return writer;
        };

        /**
         * Encodes the specified CreateCredentialResponse message, length delimited. Does not implicitly {@link auth.CreateCredentialResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {auth.ICreateCredentialResponse} message CreateCredentialResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateCredentialResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateCredentialResponse message from the specified reader or buffer.
         * @function decode
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.CreateCredentialResponse} CreateCredentialResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCredentialResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.CreateCredentialResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.clientId = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CreateCredentialResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.CreateCredentialResponse} CreateCredentialResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateCredentialResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateCredentialResponse message.
         * @function verify
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateCredentialResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            return null;
        };

        /**
         * Creates a CreateCredentialResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.CreateCredentialResponse} CreateCredentialResponse
         */
        CreateCredentialResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.CreateCredentialResponse)
                return object;
            var message = new $root.auth.CreateCredentialResponse();
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            return message;
        };

        /**
         * Creates a plain object from a CreateCredentialResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {auth.CreateCredentialResponse} message CreateCredentialResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateCredentialResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.clientId = "";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                object.clientId = message.clientId;
            return object;
        };

        /**
         * Converts this CreateCredentialResponse to JSON.
         * @function toJSON
         * @memberof auth.CreateCredentialResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateCredentialResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateCredentialResponse
         * @function getTypeUrl
         * @memberof auth.CreateCredentialResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateCredentialResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.CreateCredentialResponse";
        };

        return CreateCredentialResponse;
    })();

    auth.FindCredentialRequest = (function() {

        /**
         * Properties of a FindCredentialRequest.
         * @memberof auth
         * @interface IFindCredentialRequest
         * @property {string|null} [id] FindCredentialRequest id
         */

        /**
         * Constructs a new FindCredentialRequest.
         * @memberof auth
         * @classdesc Represents a FindCredentialRequest.
         * @implements IFindCredentialRequest
         * @constructor
         * @param {auth.IFindCredentialRequest=} [properties] Properties to set
         */
        function FindCredentialRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FindCredentialRequest id.
         * @member {string} id
         * @memberof auth.FindCredentialRequest
         * @instance
         */
        FindCredentialRequest.prototype.id = "";

        /**
         * Creates a new FindCredentialRequest instance using the specified properties.
         * @function create
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {auth.IFindCredentialRequest=} [properties] Properties to set
         * @returns {auth.FindCredentialRequest} FindCredentialRequest instance
         */
        FindCredentialRequest.create = function create(properties) {
            return new FindCredentialRequest(properties);
        };

        /**
         * Encodes the specified FindCredentialRequest message. Does not implicitly {@link auth.FindCredentialRequest.verify|verify} messages.
         * @function encode
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {auth.IFindCredentialRequest} message FindCredentialRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FindCredentialRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            return writer;
        };

        /**
         * Encodes the specified FindCredentialRequest message, length delimited. Does not implicitly {@link auth.FindCredentialRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {auth.IFindCredentialRequest} message FindCredentialRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FindCredentialRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FindCredentialRequest message from the specified reader or buffer.
         * @function decode
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.FindCredentialRequest} FindCredentialRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FindCredentialRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.FindCredentialRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FindCredentialRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.FindCredentialRequest} FindCredentialRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FindCredentialRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FindCredentialRequest message.
         * @function verify
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FindCredentialRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            return null;
        };

        /**
         * Creates a FindCredentialRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.FindCredentialRequest} FindCredentialRequest
         */
        FindCredentialRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.FindCredentialRequest)
                return object;
            var message = new $root.auth.FindCredentialRequest();
            if (object.id != null)
                message.id = String(object.id);
            return message;
        };

        /**
         * Creates a plain object from a FindCredentialRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {auth.FindCredentialRequest} message FindCredentialRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FindCredentialRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.id = "";
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            return object;
        };

        /**
         * Converts this FindCredentialRequest to JSON.
         * @function toJSON
         * @memberof auth.FindCredentialRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FindCredentialRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FindCredentialRequest
         * @function getTypeUrl
         * @memberof auth.FindCredentialRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FindCredentialRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.FindCredentialRequest";
        };

        return FindCredentialRequest;
    })();

    auth.FindCredentialResponse = (function() {

        /**
         * Properties of a FindCredentialResponse.
         * @memberof auth
         * @interface IFindCredentialResponse
         * @property {string|null} [id] FindCredentialResponse id
         * @property {string|null} [username] FindCredentialResponse username
         * @property {string|null} [createdAt] FindCredentialResponse createdAt
         * @property {string|null} [updatedAt] FindCredentialResponse updatedAt
         */

        /**
         * Constructs a new FindCredentialResponse.
         * @memberof auth
         * @classdesc Represents a FindCredentialResponse.
         * @implements IFindCredentialResponse
         * @constructor
         * @param {auth.IFindCredentialResponse=} [properties] Properties to set
         */
        function FindCredentialResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FindCredentialResponse id.
         * @member {string} id
         * @memberof auth.FindCredentialResponse
         * @instance
         */
        FindCredentialResponse.prototype.id = "";

        /**
         * FindCredentialResponse username.
         * @member {string} username
         * @memberof auth.FindCredentialResponse
         * @instance
         */
        FindCredentialResponse.prototype.username = "";

        /**
         * FindCredentialResponse createdAt.
         * @member {string} createdAt
         * @memberof auth.FindCredentialResponse
         * @instance
         */
        FindCredentialResponse.prototype.createdAt = "";

        /**
         * FindCredentialResponse updatedAt.
         * @member {string} updatedAt
         * @memberof auth.FindCredentialResponse
         * @instance
         */
        FindCredentialResponse.prototype.updatedAt = "";

        /**
         * Creates a new FindCredentialResponse instance using the specified properties.
         * @function create
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {auth.IFindCredentialResponse=} [properties] Properties to set
         * @returns {auth.FindCredentialResponse} FindCredentialResponse instance
         */
        FindCredentialResponse.create = function create(properties) {
            return new FindCredentialResponse(properties);
        };

        /**
         * Encodes the specified FindCredentialResponse message. Does not implicitly {@link auth.FindCredentialResponse.verify|verify} messages.
         * @function encode
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {auth.IFindCredentialResponse} message FindCredentialResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FindCredentialResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.username);
            if (message.createdAt != null && Object.hasOwnProperty.call(message, "createdAt"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.createdAt);
            if (message.updatedAt != null && Object.hasOwnProperty.call(message, "updatedAt"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.updatedAt);
            return writer;
        };

        /**
         * Encodes the specified FindCredentialResponse message, length delimited. Does not implicitly {@link auth.FindCredentialResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {auth.IFindCredentialResponse} message FindCredentialResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FindCredentialResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FindCredentialResponse message from the specified reader or buffer.
         * @function decode
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.FindCredentialResponse} FindCredentialResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FindCredentialResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.FindCredentialResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.username = reader.string();
                        break;
                    }
                case 3: {
                        message.createdAt = reader.string();
                        break;
                    }
                case 4: {
                        message.updatedAt = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FindCredentialResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.FindCredentialResponse} FindCredentialResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FindCredentialResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FindCredentialResponse message.
         * @function verify
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FindCredentialResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                if (!$util.isString(message.createdAt))
                    return "createdAt: string expected";
            if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                if (!$util.isString(message.updatedAt))
                    return "updatedAt: string expected";
            return null;
        };

        /**
         * Creates a FindCredentialResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.FindCredentialResponse} FindCredentialResponse
         */
        FindCredentialResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.FindCredentialResponse)
                return object;
            var message = new $root.auth.FindCredentialResponse();
            if (object.id != null)
                message.id = String(object.id);
            if (object.username != null)
                message.username = String(object.username);
            if (object.createdAt != null)
                message.createdAt = String(object.createdAt);
            if (object.updatedAt != null)
                message.updatedAt = String(object.updatedAt);
            return message;
        };

        /**
         * Creates a plain object from a FindCredentialResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {auth.FindCredentialResponse} message FindCredentialResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FindCredentialResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = "";
                object.username = "";
                object.createdAt = "";
                object.updatedAt = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.createdAt != null && message.hasOwnProperty("createdAt"))
                object.createdAt = message.createdAt;
            if (message.updatedAt != null && message.hasOwnProperty("updatedAt"))
                object.updatedAt = message.updatedAt;
            return object;
        };

        /**
         * Converts this FindCredentialResponse to JSON.
         * @function toJSON
         * @memberof auth.FindCredentialResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FindCredentialResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FindCredentialResponse
         * @function getTypeUrl
         * @memberof auth.FindCredentialResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FindCredentialResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.FindCredentialResponse";
        };

        return FindCredentialResponse;
    })();

    auth.ValidateCredentialRequest = (function() {

        /**
         * Properties of a ValidateCredentialRequest.
         * @memberof auth
         * @interface IValidateCredentialRequest
         * @property {string|null} [username] ValidateCredentialRequest username
         * @property {string|null} [password] ValidateCredentialRequest password
         */

        /**
         * Constructs a new ValidateCredentialRequest.
         * @memberof auth
         * @classdesc Represents a ValidateCredentialRequest.
         * @implements IValidateCredentialRequest
         * @constructor
         * @param {auth.IValidateCredentialRequest=} [properties] Properties to set
         */
        function ValidateCredentialRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ValidateCredentialRequest username.
         * @member {string} username
         * @memberof auth.ValidateCredentialRequest
         * @instance
         */
        ValidateCredentialRequest.prototype.username = "";

        /**
         * ValidateCredentialRequest password.
         * @member {string} password
         * @memberof auth.ValidateCredentialRequest
         * @instance
         */
        ValidateCredentialRequest.prototype.password = "";

        /**
         * Creates a new ValidateCredentialRequest instance using the specified properties.
         * @function create
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {auth.IValidateCredentialRequest=} [properties] Properties to set
         * @returns {auth.ValidateCredentialRequest} ValidateCredentialRequest instance
         */
        ValidateCredentialRequest.create = function create(properties) {
            return new ValidateCredentialRequest(properties);
        };

        /**
         * Encodes the specified ValidateCredentialRequest message. Does not implicitly {@link auth.ValidateCredentialRequest.verify|verify} messages.
         * @function encode
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {auth.IValidateCredentialRequest} message ValidateCredentialRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ValidateCredentialRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            return writer;
        };

        /**
         * Encodes the specified ValidateCredentialRequest message, length delimited. Does not implicitly {@link auth.ValidateCredentialRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {auth.IValidateCredentialRequest} message ValidateCredentialRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ValidateCredentialRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ValidateCredentialRequest message from the specified reader or buffer.
         * @function decode
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.ValidateCredentialRequest} ValidateCredentialRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ValidateCredentialRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.ValidateCredentialRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.password = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ValidateCredentialRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.ValidateCredentialRequest} ValidateCredentialRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ValidateCredentialRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ValidateCredentialRequest message.
         * @function verify
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ValidateCredentialRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            return null;
        };

        /**
         * Creates a ValidateCredentialRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.ValidateCredentialRequest} ValidateCredentialRequest
         */
        ValidateCredentialRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.ValidateCredentialRequest)
                return object;
            var message = new $root.auth.ValidateCredentialRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.password != null)
                message.password = String(object.password);
            return message;
        };

        /**
         * Creates a plain object from a ValidateCredentialRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {auth.ValidateCredentialRequest} message ValidateCredentialRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ValidateCredentialRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.username = "";
                object.password = "";
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            return object;
        };

        /**
         * Converts this ValidateCredentialRequest to JSON.
         * @function toJSON
         * @memberof auth.ValidateCredentialRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ValidateCredentialRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ValidateCredentialRequest
         * @function getTypeUrl
         * @memberof auth.ValidateCredentialRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ValidateCredentialRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.ValidateCredentialRequest";
        };

        return ValidateCredentialRequest;
    })();

    auth.ValidateCredentialResponse = (function() {

        /**
         * Properties of a ValidateCredentialResponse.
         * @memberof auth
         * @interface IValidateCredentialResponse
         * @property {boolean|null} [isValid] ValidateCredentialResponse isValid
         */

        /**
         * Constructs a new ValidateCredentialResponse.
         * @memberof auth
         * @classdesc Represents a ValidateCredentialResponse.
         * @implements IValidateCredentialResponse
         * @constructor
         * @param {auth.IValidateCredentialResponse=} [properties] Properties to set
         */
        function ValidateCredentialResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ValidateCredentialResponse isValid.
         * @member {boolean} isValid
         * @memberof auth.ValidateCredentialResponse
         * @instance
         */
        ValidateCredentialResponse.prototype.isValid = false;

        /**
         * Creates a new ValidateCredentialResponse instance using the specified properties.
         * @function create
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {auth.IValidateCredentialResponse=} [properties] Properties to set
         * @returns {auth.ValidateCredentialResponse} ValidateCredentialResponse instance
         */
        ValidateCredentialResponse.create = function create(properties) {
            return new ValidateCredentialResponse(properties);
        };

        /**
         * Encodes the specified ValidateCredentialResponse message. Does not implicitly {@link auth.ValidateCredentialResponse.verify|verify} messages.
         * @function encode
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {auth.IValidateCredentialResponse} message ValidateCredentialResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ValidateCredentialResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.isValid != null && Object.hasOwnProperty.call(message, "isValid"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isValid);
            return writer;
        };

        /**
         * Encodes the specified ValidateCredentialResponse message, length delimited. Does not implicitly {@link auth.ValidateCredentialResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {auth.IValidateCredentialResponse} message ValidateCredentialResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ValidateCredentialResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ValidateCredentialResponse message from the specified reader or buffer.
         * @function decode
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.ValidateCredentialResponse} ValidateCredentialResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ValidateCredentialResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.ValidateCredentialResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.isValid = reader.bool();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ValidateCredentialResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.ValidateCredentialResponse} ValidateCredentialResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ValidateCredentialResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ValidateCredentialResponse message.
         * @function verify
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ValidateCredentialResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.isValid != null && message.hasOwnProperty("isValid"))
                if (typeof message.isValid !== "boolean")
                    return "isValid: boolean expected";
            return null;
        };

        /**
         * Creates a ValidateCredentialResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.ValidateCredentialResponse} ValidateCredentialResponse
         */
        ValidateCredentialResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.ValidateCredentialResponse)
                return object;
            var message = new $root.auth.ValidateCredentialResponse();
            if (object.isValid != null)
                message.isValid = Boolean(object.isValid);
            return message;
        };

        /**
         * Creates a plain object from a ValidateCredentialResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {auth.ValidateCredentialResponse} message ValidateCredentialResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ValidateCredentialResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.isValid = false;
            if (message.isValid != null && message.hasOwnProperty("isValid"))
                object.isValid = message.isValid;
            return object;
        };

        /**
         * Converts this ValidateCredentialResponse to JSON.
         * @function toJSON
         * @memberof auth.ValidateCredentialResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ValidateCredentialResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ValidateCredentialResponse
         * @function getTypeUrl
         * @memberof auth.ValidateCredentialResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ValidateCredentialResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.ValidateCredentialResponse";
        };

        return ValidateCredentialResponse;
    })();

    auth.IssueTokenRequest = (function() {

        /**
         * Properties of an IssueTokenRequest.
         * @memberof auth
         * @interface IIssueTokenRequest
         * @property {string|null} [username] IssueTokenRequest username
         * @property {string|null} [password] IssueTokenRequest password
         */

        /**
         * Constructs a new IssueTokenRequest.
         * @memberof auth
         * @classdesc Represents an IssueTokenRequest.
         * @implements IIssueTokenRequest
         * @constructor
         * @param {auth.IIssueTokenRequest=} [properties] Properties to set
         */
        function IssueTokenRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IssueTokenRequest username.
         * @member {string} username
         * @memberof auth.IssueTokenRequest
         * @instance
         */
        IssueTokenRequest.prototype.username = "";

        /**
         * IssueTokenRequest password.
         * @member {string} password
         * @memberof auth.IssueTokenRequest
         * @instance
         */
        IssueTokenRequest.prototype.password = "";

        /**
         * Creates a new IssueTokenRequest instance using the specified properties.
         * @function create
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {auth.IIssueTokenRequest=} [properties] Properties to set
         * @returns {auth.IssueTokenRequest} IssueTokenRequest instance
         */
        IssueTokenRequest.create = function create(properties) {
            return new IssueTokenRequest(properties);
        };

        /**
         * Encodes the specified IssueTokenRequest message. Does not implicitly {@link auth.IssueTokenRequest.verify|verify} messages.
         * @function encode
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {auth.IIssueTokenRequest} message IssueTokenRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IssueTokenRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            return writer;
        };

        /**
         * Encodes the specified IssueTokenRequest message, length delimited. Does not implicitly {@link auth.IssueTokenRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {auth.IIssueTokenRequest} message IssueTokenRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IssueTokenRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an IssueTokenRequest message from the specified reader or buffer.
         * @function decode
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.IssueTokenRequest} IssueTokenRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IssueTokenRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.IssueTokenRequest();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.username = reader.string();
                        break;
                    }
                case 2: {
                        message.password = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an IssueTokenRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.IssueTokenRequest} IssueTokenRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IssueTokenRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an IssueTokenRequest message.
         * @function verify
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        IssueTokenRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.username != null && message.hasOwnProperty("username"))
                if (!$util.isString(message.username))
                    return "username: string expected";
            if (message.password != null && message.hasOwnProperty("password"))
                if (!$util.isString(message.password))
                    return "password: string expected";
            return null;
        };

        /**
         * Creates an IssueTokenRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.IssueTokenRequest} IssueTokenRequest
         */
        IssueTokenRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.IssueTokenRequest)
                return object;
            var message = new $root.auth.IssueTokenRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.password != null)
                message.password = String(object.password);
            return message;
        };

        /**
         * Creates a plain object from an IssueTokenRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {auth.IssueTokenRequest} message IssueTokenRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        IssueTokenRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.username = "";
                object.password = "";
            }
            if (message.username != null && message.hasOwnProperty("username"))
                object.username = message.username;
            if (message.password != null && message.hasOwnProperty("password"))
                object.password = message.password;
            return object;
        };

        /**
         * Converts this IssueTokenRequest to JSON.
         * @function toJSON
         * @memberof auth.IssueTokenRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        IssueTokenRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for IssueTokenRequest
         * @function getTypeUrl
         * @memberof auth.IssueTokenRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        IssueTokenRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.IssueTokenRequest";
        };

        return IssueTokenRequest;
    })();

    auth.IssueTokenResponse = (function() {

        /**
         * Properties of an IssueTokenResponse.
         * @memberof auth
         * @interface IIssueTokenResponse
         * @property {string|null} [accessToken] IssueTokenResponse accessToken
         * @property {string|null} [refreshToken] IssueTokenResponse refreshToken
         */

        /**
         * Constructs a new IssueTokenResponse.
         * @memberof auth
         * @classdesc Represents an IssueTokenResponse.
         * @implements IIssueTokenResponse
         * @constructor
         * @param {auth.IIssueTokenResponse=} [properties] Properties to set
         */
        function IssueTokenResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * IssueTokenResponse accessToken.
         * @member {string} accessToken
         * @memberof auth.IssueTokenResponse
         * @instance
         */
        IssueTokenResponse.prototype.accessToken = "";

        /**
         * IssueTokenResponse refreshToken.
         * @member {string} refreshToken
         * @memberof auth.IssueTokenResponse
         * @instance
         */
        IssueTokenResponse.prototype.refreshToken = "";

        /**
         * Creates a new IssueTokenResponse instance using the specified properties.
         * @function create
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {auth.IIssueTokenResponse=} [properties] Properties to set
         * @returns {auth.IssueTokenResponse} IssueTokenResponse instance
         */
        IssueTokenResponse.create = function create(properties) {
            return new IssueTokenResponse(properties);
        };

        /**
         * Encodes the specified IssueTokenResponse message. Does not implicitly {@link auth.IssueTokenResponse.verify|verify} messages.
         * @function encode
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {auth.IIssueTokenResponse} message IssueTokenResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IssueTokenResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.accessToken != null && Object.hasOwnProperty.call(message, "accessToken"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.accessToken);
            if (message.refreshToken != null && Object.hasOwnProperty.call(message, "refreshToken"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.refreshToken);
            return writer;
        };

        /**
         * Encodes the specified IssueTokenResponse message, length delimited. Does not implicitly {@link auth.IssueTokenResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {auth.IIssueTokenResponse} message IssueTokenResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        IssueTokenResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an IssueTokenResponse message from the specified reader or buffer.
         * @function decode
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.IssueTokenResponse} IssueTokenResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IssueTokenResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.IssueTokenResponse();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.accessToken = reader.string();
                        break;
                    }
                case 2: {
                        message.refreshToken = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an IssueTokenResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.IssueTokenResponse} IssueTokenResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        IssueTokenResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an IssueTokenResponse message.
         * @function verify
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        IssueTokenResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.accessToken != null && message.hasOwnProperty("accessToken"))
                if (!$util.isString(message.accessToken))
                    return "accessToken: string expected";
            if (message.refreshToken != null && message.hasOwnProperty("refreshToken"))
                if (!$util.isString(message.refreshToken))
                    return "refreshToken: string expected";
            return null;
        };

        /**
         * Creates an IssueTokenResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.IssueTokenResponse} IssueTokenResponse
         */
        IssueTokenResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.IssueTokenResponse)
                return object;
            var message = new $root.auth.IssueTokenResponse();
            if (object.accessToken != null)
                message.accessToken = String(object.accessToken);
            if (object.refreshToken != null)
                message.refreshToken = String(object.refreshToken);
            return message;
        };

        /**
         * Creates a plain object from an IssueTokenResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {auth.IssueTokenResponse} message IssueTokenResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        IssueTokenResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.accessToken = "";
                object.refreshToken = "";
            }
            if (message.accessToken != null && message.hasOwnProperty("accessToken"))
                object.accessToken = message.accessToken;
            if (message.refreshToken != null && message.hasOwnProperty("refreshToken"))
                object.refreshToken = message.refreshToken;
            return object;
        };

        /**
         * Converts this IssueTokenResponse to JSON.
         * @function toJSON
         * @memberof auth.IssueTokenResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        IssueTokenResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for IssueTokenResponse
         * @function getTypeUrl
         * @memberof auth.IssueTokenResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        IssueTokenResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.IssueTokenResponse";
        };

        return IssueTokenResponse;
    })();

    return auth;
})();

module.exports = $root;
