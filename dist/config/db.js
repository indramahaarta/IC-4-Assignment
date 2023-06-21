"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const dialect = new kysely_1.PostgresDialect({
    pool: () => __awaiter(void 0, void 0, void 0, function* () {
        return new pg_1.Pool({
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
        });
    }),
});
const db = new kysely_1.Kysely({
    dialect,
});
exports.default = db;
