/**
* -> index.js: El punto de entrada de la aplicación donde se configura Express y se conecta con las rutas y middleware.
* routes: Define las rutas y utiliza los controladores correspondientes para manejar las solicitudes.
* controllers: Contiene controladores que manejan la lógica de la aplicación para cada ruta.

* middleware: Almacena middleware personalizados
* models: Define modelos de datos para interactuar con la base de datos u otras fuentes de datos.
* utils: Contiene utilidades compartidas que pueden ser utilizadas en diferentes partes de la aplicación.
* config: Almacena archivos de configuración, como configuraciones de base de datos o claves secretas.
*/

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { typeDefs, resolvers } from "./src/configs/gateway.js";
import { buildSubgraphSchema } from "@apollo/federation";

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
	schema: buildSubgraphSchema({ typeDefs, resolvers }),
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
	"/graphql",
	cors(),
	express.json(),
	expressMiddleware(server, {
		context: async ({ req }) => ({ token: req.headers.token }),
	})
);

await new Promise((resolve) => httpServer.listen({ port: 9000 }, resolve));

console.log(`🚀 AUTHENTICATION Server ready at http://localhost:9000/graphql`);
