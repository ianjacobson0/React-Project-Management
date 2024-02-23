"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const schema_1 = require("@graphql-tools/schema");
const userResolvers_1 = require("./graphql/User/userResolvers");
const userModels_1 = require("./graphql/User/userModels");
const organizationResolvers_1 = require("./graphql/Organization/organizationResolvers");
const organizationModels_1 = require("./graphql/Organization/organizationModels");
const projectResolvers_1 = require("./graphql/Project/projectResolvers");
const projectModels_1 = require("./graphql/Project/projectModels");
const inviteResolvers_1 = require("./graphql/Invite/inviteResolvers");
const inviteModels_1 = require("./graphql/Invite/inviteModels");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("./types/types");
const body_parser_graphql_1 = require("body-parser-graphql");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const lodash_1 = require("lodash");
const app = (0, express_1.default)();
const port = 3001;
const schema = (0, schema_1.makeExecutableSchema)({
    resolvers: (0, lodash_1.merge)(userResolvers_1.resolvers, organizationResolvers_1.resolvers, projectResolvers_1.resolvers, inviteResolvers_1.resolvers),
    typeDefs: [userModels_1.models, organizationModels_1.models, projectModels_1.models, inviteModels_1.models]
});
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const operationName = req.body.operationName;
    const unauthenticatedQueries = ["SignUp", "SignIn"];
    if (unauthenticatedQueries.includes(operationName)) {
        next();
    } else {
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]) || "";
        if (yield checkToken(token)) {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
});
const checkToken = token => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let decoded = jsonwebtoken_1.default.decode(token, { complete: true });
        if (!decoded) {
            return false;
        } else {
            let payload = decoded.payload;
            if (new Date(payload.expires).getTime() <= Date.now()) {
                return false;
            } else {
                return true;
            }
        }
    } catch (err) {
        return false;
    }
});
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use('/graphql', (0, body_parser_graphql_1.bodyParserGraphQL)(), authenticate);
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: schema,
    graphiql: true,
    customFormatErrorFn: err => {
        return (0, types_1.getErrorMessage)(err.message);
    }
}));
app.post('/verify', body_parser_1.default.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const token = body.token;
    if (yield checkToken(token)) {
        res.status(200).json({ success: true, message: "Succesfully authenticated" });
    } else {
        res.status(200).json({ success: false, message: "Token not valid" });
    }
}));
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});