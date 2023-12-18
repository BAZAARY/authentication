/**
* -> index.js: El punto de entrada de la aplicación donde se configura Express y se conecta con las rutas y middleware.
* routes: Define las rutas y utiliza los controladores correspondientes para manejar las solicitudes.
* controllers: Contiene controladores que manejan la lógica de la aplicación para cada ruta.

* middleware: Almacena middleware personalizados
* models: Define modelos de datos para interactuar con la base de datos u otras fuentes de datos.
* utils: Contiene utilidades compartidas que pueden ser utilizadas en diferentes partes de la aplicación.
* config: Almacena archivos de configuración, como configuraciones de base de datos o claves secretas.
*/
// Add this to the very top of the first file loaded in your app

// import apm from "elastic-apm-node";

// const apmInstance = apm.start({
// 	serviceName: "authentication-service",

// 	secretToken: "pmzj1HFP3c3kwUw3Gl",

// 	serverUrl: "https://017f20cd667948199b024b97e2c47ca6.apm.us-central1.gcp.cloud.es.io:443",

// 	environment: "my-environment",
// });

import { ApolloServer, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { buildSubgraphSchema } from "@apollo/subgraph";
import http from "http";
import express from "express";
import cors from "cors";
import { typeDefs, resolvers } from "./src/configs/connection.js";

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

// export { apmInstance };
