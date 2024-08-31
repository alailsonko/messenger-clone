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

    return auth;
})();

module.exports = $root;
