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
         * Callback as used by {@link auth.AuthService#createUsernameAndPassword}.
         * @memberof auth.AuthService
         * @typedef createUsernameAndPasswordCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {auth.CreateUsernameAndPasswordResponse} [response] CreateUsernameAndPasswordResponse
         */

        /**
         * Calls createUsernameAndPassword.
         * @function createUsernameAndPassword
         * @memberof auth.AuthService
         * @instance
         * @param {auth.ICreateUsernameAndPasswordRequest} request CreateUsernameAndPasswordRequest message or plain object
         * @param {auth.AuthService.createUsernameAndPasswordCallback} callback Node-style callback called with the error, if any, and CreateUsernameAndPasswordResponse
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(AuthService.prototype.createUsernameAndPassword = function createUsernameAndPassword(request, callback) {
            return this.rpcCall(createUsernameAndPassword, $root.auth.CreateUsernameAndPasswordRequest, $root.auth.CreateUsernameAndPasswordResponse, request, callback);
        }, "name", { value: "createUsernameAndPassword" });

        /**
         * Calls createUsernameAndPassword.
         * @function createUsernameAndPassword
         * @memberof auth.AuthService
         * @instance
         * @param {auth.ICreateUsernameAndPasswordRequest} request CreateUsernameAndPasswordRequest message or plain object
         * @returns {Promise<auth.CreateUsernameAndPasswordResponse>} Promise
         * @variation 2
         */

        return AuthService;
    })();

    auth.CreateUsernameAndPasswordRequest = (function() {

        /**
         * Properties of a CreateUsernameAndPasswordRequest.
         * @memberof auth
         * @interface ICreateUsernameAndPasswordRequest
         * @property {string|null} [username] CreateUsernameAndPasswordRequest username
         * @property {string|null} [password] CreateUsernameAndPasswordRequest password
         */

        /**
         * Constructs a new CreateUsernameAndPasswordRequest.
         * @memberof auth
         * @classdesc Represents a CreateUsernameAndPasswordRequest.
         * @implements ICreateUsernameAndPasswordRequest
         * @constructor
         * @param {auth.ICreateUsernameAndPasswordRequest=} [properties] Properties to set
         */
        function CreateUsernameAndPasswordRequest(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateUsernameAndPasswordRequest username.
         * @member {string} username
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @instance
         */
        CreateUsernameAndPasswordRequest.prototype.username = "";

        /**
         * CreateUsernameAndPasswordRequest password.
         * @member {string} password
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @instance
         */
        CreateUsernameAndPasswordRequest.prototype.password = "";

        /**
         * Creates a new CreateUsernameAndPasswordRequest instance using the specified properties.
         * @function create
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {auth.ICreateUsernameAndPasswordRequest=} [properties] Properties to set
         * @returns {auth.CreateUsernameAndPasswordRequest} CreateUsernameAndPasswordRequest instance
         */
        CreateUsernameAndPasswordRequest.create = function create(properties) {
            return new CreateUsernameAndPasswordRequest(properties);
        };

        /**
         * Encodes the specified CreateUsernameAndPasswordRequest message. Does not implicitly {@link auth.CreateUsernameAndPasswordRequest.verify|verify} messages.
         * @function encode
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {auth.ICreateUsernameAndPasswordRequest} message CreateUsernameAndPasswordRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateUsernameAndPasswordRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.username != null && Object.hasOwnProperty.call(message, "username"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
            if (message.password != null && Object.hasOwnProperty.call(message, "password"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.password);
            return writer;
        };

        /**
         * Encodes the specified CreateUsernameAndPasswordRequest message, length delimited. Does not implicitly {@link auth.CreateUsernameAndPasswordRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {auth.ICreateUsernameAndPasswordRequest} message CreateUsernameAndPasswordRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateUsernameAndPasswordRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateUsernameAndPasswordRequest message from the specified reader or buffer.
         * @function decode
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.CreateUsernameAndPasswordRequest} CreateUsernameAndPasswordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateUsernameAndPasswordRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.CreateUsernameAndPasswordRequest();
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
         * Decodes a CreateUsernameAndPasswordRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.CreateUsernameAndPasswordRequest} CreateUsernameAndPasswordRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateUsernameAndPasswordRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateUsernameAndPasswordRequest message.
         * @function verify
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateUsernameAndPasswordRequest.verify = function verify(message) {
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
         * Creates a CreateUsernameAndPasswordRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.CreateUsernameAndPasswordRequest} CreateUsernameAndPasswordRequest
         */
        CreateUsernameAndPasswordRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.CreateUsernameAndPasswordRequest)
                return object;
            var message = new $root.auth.CreateUsernameAndPasswordRequest();
            if (object.username != null)
                message.username = String(object.username);
            if (object.password != null)
                message.password = String(object.password);
            return message;
        };

        /**
         * Creates a plain object from a CreateUsernameAndPasswordRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {auth.CreateUsernameAndPasswordRequest} message CreateUsernameAndPasswordRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateUsernameAndPasswordRequest.toObject = function toObject(message, options) {
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
         * Converts this CreateUsernameAndPasswordRequest to JSON.
         * @function toJSON
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateUsernameAndPasswordRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateUsernameAndPasswordRequest
         * @function getTypeUrl
         * @memberof auth.CreateUsernameAndPasswordRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateUsernameAndPasswordRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.CreateUsernameAndPasswordRequest";
        };

        return CreateUsernameAndPasswordRequest;
    })();

    auth.CreateUsernameAndPasswordResponse = (function() {

        /**
         * Properties of a CreateUsernameAndPasswordResponse.
         * @memberof auth
         * @interface ICreateUsernameAndPasswordResponse
         * @property {string|null} [clientId] CreateUsernameAndPasswordResponse clientId
         */

        /**
         * Constructs a new CreateUsernameAndPasswordResponse.
         * @memberof auth
         * @classdesc Represents a CreateUsernameAndPasswordResponse.
         * @implements ICreateUsernameAndPasswordResponse
         * @constructor
         * @param {auth.ICreateUsernameAndPasswordResponse=} [properties] Properties to set
         */
        function CreateUsernameAndPasswordResponse(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CreateUsernameAndPasswordResponse clientId.
         * @member {string} clientId
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @instance
         */
        CreateUsernameAndPasswordResponse.prototype.clientId = "";

        /**
         * Creates a new CreateUsernameAndPasswordResponse instance using the specified properties.
         * @function create
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {auth.ICreateUsernameAndPasswordResponse=} [properties] Properties to set
         * @returns {auth.CreateUsernameAndPasswordResponse} CreateUsernameAndPasswordResponse instance
         */
        CreateUsernameAndPasswordResponse.create = function create(properties) {
            return new CreateUsernameAndPasswordResponse(properties);
        };

        /**
         * Encodes the specified CreateUsernameAndPasswordResponse message. Does not implicitly {@link auth.CreateUsernameAndPasswordResponse.verify|verify} messages.
         * @function encode
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {auth.ICreateUsernameAndPasswordResponse} message CreateUsernameAndPasswordResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateUsernameAndPasswordResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.clientId != null && Object.hasOwnProperty.call(message, "clientId"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.clientId);
            return writer;
        };

        /**
         * Encodes the specified CreateUsernameAndPasswordResponse message, length delimited. Does not implicitly {@link auth.CreateUsernameAndPasswordResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {auth.ICreateUsernameAndPasswordResponse} message CreateUsernameAndPasswordResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CreateUsernameAndPasswordResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CreateUsernameAndPasswordResponse message from the specified reader or buffer.
         * @function decode
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {auth.CreateUsernameAndPasswordResponse} CreateUsernameAndPasswordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateUsernameAndPasswordResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.auth.CreateUsernameAndPasswordResponse();
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
         * Decodes a CreateUsernameAndPasswordResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {auth.CreateUsernameAndPasswordResponse} CreateUsernameAndPasswordResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CreateUsernameAndPasswordResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CreateUsernameAndPasswordResponse message.
         * @function verify
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CreateUsernameAndPasswordResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientId != null && message.hasOwnProperty("clientId"))
                if (!$util.isString(message.clientId))
                    return "clientId: string expected";
            return null;
        };

        /**
         * Creates a CreateUsernameAndPasswordResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {auth.CreateUsernameAndPasswordResponse} CreateUsernameAndPasswordResponse
         */
        CreateUsernameAndPasswordResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.auth.CreateUsernameAndPasswordResponse)
                return object;
            var message = new $root.auth.CreateUsernameAndPasswordResponse();
            if (object.clientId != null)
                message.clientId = String(object.clientId);
            return message;
        };

        /**
         * Creates a plain object from a CreateUsernameAndPasswordResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {auth.CreateUsernameAndPasswordResponse} message CreateUsernameAndPasswordResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CreateUsernameAndPasswordResponse.toObject = function toObject(message, options) {
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
         * Converts this CreateUsernameAndPasswordResponse to JSON.
         * @function toJSON
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CreateUsernameAndPasswordResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CreateUsernameAndPasswordResponse
         * @function getTypeUrl
         * @memberof auth.CreateUsernameAndPasswordResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CreateUsernameAndPasswordResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/auth.CreateUsernameAndPasswordResponse";
        };

        return CreateUsernameAndPasswordResponse;
    })();

    return auth;
})();

module.exports = $root;
