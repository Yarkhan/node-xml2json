"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toXml = exports.toJson = void 0;
var xml2obj_1 = __importDefault(require("./src/xml2obj"));
exports.toJson = xml2obj_1.default;
var obj2xml_1 = __importDefault(require("./src/obj2xml"));
exports.toXml = obj2xml_1.default;
