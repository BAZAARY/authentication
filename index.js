/**
* -> index.js: El punto de entrada de la aplicación donde se configura Express y se conecta con las rutas y middleware.
* routes: Define las rutas y utiliza los controladores correspondientes para manejar las solicitudes.
* controllers: Contiene controladores que manejan la lógica de la aplicación para cada ruta.

* middleware: Almacena middleware personalizados
* models: Define modelos de datos para interactuar con la base de datos u otras fuentes de datos.
* utils: Contiene utilidades compartidas que pueden ser utilizadas en diferentes partes de la aplicación.
* config: Almacena archivos de configuración, como configuraciones de base de datos o claves secretas.
*/

import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";
import http from "http";
import express from "express";
import cors from "cors";
import { typeDefs, resolvers } from "./src/configs/gateway.js";

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const startApolloServer = async (app, httpServer) => {
	const server = new ApolloServer({
		schema: buildSubgraphSchema({ typeDefs, resolvers }),
		introspection: true,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();
	server.applyMiddleware({ app });
};

startApolloServer(app, httpServer);

app.listen(9000, () =>
	console.log("🚀 AUTHENTICATION Server ready at http://localhost:9000/graphql")
);
