// package: base.v1
// file: base/v1/service.proto

var base_v1_service_pb = require("../../base/v1/service_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Health = (function () {
  function Health() {}
  Health.serviceName = "base.v1.Health";
  return Health;
}());

Health.Check = {
  methodName: "Check",
  service: Health,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.HealthRequest,
  responseType: base_v1_service_pb.HealthResponse
};

exports.Health = Health;

function HealthClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

HealthClient.prototype.check = function check(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Health.Check, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.HealthClient = HealthClient;

var Permission = (function () {
  function Permission() {}
  Permission.serviceName = "base.v1.Permission";
  return Permission;
}());

Permission.Check = {
  methodName: "Check",
  service: Permission,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.PermissionCheckRequest,
  responseType: base_v1_service_pb.PermissionCheckResponse
};

Permission.Expand = {
  methodName: "Expand",
  service: Permission,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.PermissionExpandRequest,
  responseType: base_v1_service_pb.PermissionExpandResponse
};

Permission.LookupEntity = {
  methodName: "LookupEntity",
  service: Permission,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.PermissionLookupEntityRequest,
  responseType: base_v1_service_pb.PermissionLookupEntityResponse
};

Permission.LookupEntityStream = {
  methodName: "LookupEntityStream",
  service: Permission,
  requestStream: false,
  responseStream: true,
  requestType: base_v1_service_pb.PermissionLookupEntityRequest,
  responseType: base_v1_service_pb.PermissionLookupEntityStreamResponse
};

Permission.LookupSubject = {
  methodName: "LookupSubject",
  service: Permission,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.PermissionLookupSubjectRequest,
  responseType: base_v1_service_pb.PermissionLookupSubjectResponse
};

Permission.SubjectPermission = {
  methodName: "SubjectPermission",
  service: Permission,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.PermissionSubjectPermissionRequest,
  responseType: base_v1_service_pb.PermissionSubjectPermissionResponse
};

exports.Permission = Permission;

function PermissionClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

PermissionClient.prototype.check = function check(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Permission.Check, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

PermissionClient.prototype.expand = function expand(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Permission.Expand, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

PermissionClient.prototype.lookupEntity = function lookupEntity(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Permission.LookupEntity, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

PermissionClient.prototype.lookupEntityStream = function lookupEntityStream(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Permission.LookupEntityStream, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

PermissionClient.prototype.lookupSubject = function lookupSubject(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Permission.LookupSubject, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

PermissionClient.prototype.subjectPermission = function subjectPermission(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Permission.SubjectPermission, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.PermissionClient = PermissionClient;

var Watch = (function () {
  function Watch() {}
  Watch.serviceName = "base.v1.Watch";
  return Watch;
}());

Watch.Watch = {
  methodName: "Watch",
  service: Watch,
  requestStream: false,
  responseStream: true,
  requestType: base_v1_service_pb.WatchRequest,
  responseType: base_v1_service_pb.WatchResponse
};

exports.Watch = Watch;

function WatchClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

WatchClient.prototype.watch = function watch(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Watch.Watch, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.WatchClient = WatchClient;

var Schema = (function () {
  function Schema() {}
  Schema.serviceName = "base.v1.Schema";
  return Schema;
}());

Schema.Write = {
  methodName: "Write",
  service: Schema,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.SchemaWriteRequest,
  responseType: base_v1_service_pb.SchemaWriteResponse
};

Schema.PartialWrite = {
  methodName: "PartialWrite",
  service: Schema,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.SchemaPartialWriteRequest,
  responseType: base_v1_service_pb.SchemaPartialWriteResponse
};

Schema.Read = {
  methodName: "Read",
  service: Schema,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.SchemaReadRequest,
  responseType: base_v1_service_pb.SchemaReadResponse
};

Schema.List = {
  methodName: "List",
  service: Schema,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.SchemaListRequest,
  responseType: base_v1_service_pb.SchemaListResponse
};

exports.Schema = Schema;

function SchemaClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

SchemaClient.prototype.write = function write(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Schema.Write, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

SchemaClient.prototype.partialWrite = function partialWrite(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Schema.PartialWrite, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

SchemaClient.prototype.read = function read(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Schema.Read, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

SchemaClient.prototype.list = function list(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Schema.List, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.SchemaClient = SchemaClient;

var Data = (function () {
  function Data() {}
  Data.serviceName = "base.v1.Data";
  return Data;
}());

Data.Write = {
  methodName: "Write",
  service: Data,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.DataWriteRequest,
  responseType: base_v1_service_pb.DataWriteResponse
};

Data.WriteRelationships = {
  methodName: "WriteRelationships",
  service: Data,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.RelationshipWriteRequest,
  responseType: base_v1_service_pb.RelationshipWriteResponse
};

Data.ReadRelationships = {
  methodName: "ReadRelationships",
  service: Data,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.RelationshipReadRequest,
  responseType: base_v1_service_pb.RelationshipReadResponse
};

Data.ReadAttributes = {
  methodName: "ReadAttributes",
  service: Data,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.AttributeReadRequest,
  responseType: base_v1_service_pb.AttributeReadResponse
};

Data.Delete = {
  methodName: "Delete",
  service: Data,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.DataDeleteRequest,
  responseType: base_v1_service_pb.DataDeleteResponse
};

Data.DeleteRelationships = {
  methodName: "DeleteRelationships",
  service: Data,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.RelationshipDeleteRequest,
  responseType: base_v1_service_pb.RelationshipDeleteResponse
};

exports.Data = Data;

function DataClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

DataClient.prototype.write = function write(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Data.Write, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

DataClient.prototype.writeRelationships = function writeRelationships(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Data.WriteRelationships, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

DataClient.prototype.readRelationships = function readRelationships(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Data.ReadRelationships, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

DataClient.prototype.readAttributes = function readAttributes(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Data.ReadAttributes, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

DataClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Data.Delete, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

DataClient.prototype.deleteRelationships = function deleteRelationships(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Data.DeleteRelationships, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.DataClient = DataClient;

var Bundle = (function () {
  function Bundle() {}
  Bundle.serviceName = "base.v1.Bundle";
  return Bundle;
}());

Bundle.Write = {
  methodName: "Write",
  service: Bundle,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.BundleWriteRequest,
  responseType: base_v1_service_pb.BundleWriteResponse
};

Bundle.Read = {
  methodName: "Read",
  service: Bundle,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.BundleReadRequest,
  responseType: base_v1_service_pb.BundleReadResponse
};

Bundle.Delete = {
  methodName: "Delete",
  service: Bundle,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.BundleDeleteRequest,
  responseType: base_v1_service_pb.BundleDeleteResponse
};

exports.Bundle = Bundle;

function BundleClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BundleClient.prototype.write = function write(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bundle.Write, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BundleClient.prototype.read = function read(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bundle.Read, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BundleClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bundle.Delete, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.BundleClient = BundleClient;

var Tenancy = (function () {
  function Tenancy() {}
  Tenancy.serviceName = "base.v1.Tenancy";
  return Tenancy;
}());

Tenancy.Create = {
  methodName: "Create",
  service: Tenancy,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.TenantCreateRequest,
  responseType: base_v1_service_pb.TenantCreateResponse
};

Tenancy.Delete = {
  methodName: "Delete",
  service: Tenancy,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.TenantDeleteRequest,
  responseType: base_v1_service_pb.TenantDeleteResponse
};

Tenancy.List = {
  methodName: "List",
  service: Tenancy,
  requestStream: false,
  responseStream: false,
  requestType: base_v1_service_pb.TenantListRequest,
  responseType: base_v1_service_pb.TenantListResponse
};

exports.Tenancy = Tenancy;

function TenancyClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TenancyClient.prototype.create = function create(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Tenancy.Create, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TenancyClient.prototype.delete = function pb_delete(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Tenancy.Delete, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

TenancyClient.prototype.list = function list(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Tenancy.List, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.TenancyClient = TenancyClient;

