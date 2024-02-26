import express, { Request, RequestHandler } from "express";
import { GraphQLParams, OptionsData, graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers as userResolvers } from "./graphql/User/userResolvers";
import { models as userModels } from "./graphql/User/userModels";
import { resolvers as orgResolvers } from "./graphql/Organization/organizationResolvers";
import { models as orgModels } from "./graphql/Organization/organizationModels";
import { resolvers as projectResolvers } from "./graphql/Project/projectResolvers";
import { models as projectModels } from "./graphql/Project/projectModels";
import { resolvers as inviteResolvers } from "./graphql/Invite/inviteResolvers";
import { models as inviteModels } from "./graphql/Invite/inviteModels";
import jwt from "jsonwebtoken";
import { getErrorMessage, jwtPayload, verifyRequest } from "./types/types";
import { bodyParserGraphQL } from "body-parser-graphql";
import bodyParser from "body-parser";
import cors from "cors";
import { merge } from "lodash";

const app: express.Application = express();

const port = 3001;

const schema = makeExecutableSchema({
    resolvers: merge(userResolvers, orgResolvers, projectResolvers, inviteResolvers),
    typeDefs: [userModels, orgModels, projectModels, inviteModels]
});

const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const operationName = req.body.operationName;
    const unauthenticatedQueries = ["SignUp", "SignIn"];

    if (unauthenticatedQueries.includes(operationName)) {
        next();
    } else {
        const token = req.headers.authorization?.split(' ')[1] || "";
        if (await checkToken(token)) {
            next();
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
}

const checkToken = async (token: string): Promise<boolean> => {
    try {
        const user = await jwt.verify(token, process.env.JWT_SECRET!);
        let decoded = jwt.decode(token, { complete: true });
        if (!decoded) {
            return false;
        } else {
            let payload: jwtPayload = decoded.payload as jwtPayload;
            if (new Date(payload.expires).getTime() <= Date.now()) {
                return false;
            }
            else {
                return true;
            }
        }
    } catch (err) {
        return false;
    }
}

app.use(cors());

app.use('/graphql', bodyParserGraphQL(), authenticate);

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true,
        customFormatErrorFn: (err) => {
            return getErrorMessage(err.message);
        }
    })
);

app.post('/verify', bodyParser.json(), async (req, res) => {
    const body = req.body as verifyRequest;
    const token = body.token;
    if (await checkToken(token)) {
        res.status(200).json({ success: true, message: "Succesfully authenticated" });
    } else {
        res.status(200).json({ success: false, message: "Token not valid" });
    }
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});