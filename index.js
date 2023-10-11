/**
* -> index.js: El punto de entrada de la aplicación donde se configura Express y se conecta con las rutas y middleware.
* routes: Define las rutas y utiliza los controladores correspondientes para manejar las solicitudes.
* controllers: Contiene controladores que manejan la lógica de la aplicación para cada ruta.

* middleware: Almacena middleware personalizados
* models: Define modelos de datos para interactuar con la base de datos u otras fuentes de datos.
* utils: Contiene utilidades compartidas que pueden ser utilizadas en diferentes partes de la aplicación.
* config: Almacena archivos de configuración, como configuraciones de base de datos o claves secretas.
*/

require("dotenv").config();

const express = require("express");
const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { resolvers, typeDefs } = require("./src/configs/gateway");
// const bodyParser = require("body-parser");
// const cors = require("cors");

//IMPORTAR RUTAS
const authRoutes = require("./src/routes/authRoutes");
const app = express();

const { configureCORS } = require("./src/middlewares/corsMiddleware");

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow all the incoming IP addresses
//app.use(cors());
app.use(configureCORS);
app.use(authRoutes);

// const typeDefs = gql`
// 	extend type Query {
// 		me: User
// 	}

// 	type User @key(fields: "id") {
// 		id: ID!
// 		name: String
// 		username: String
// 	}
// `;

// const resolvers = {
// 	Query: {
// 		me() {
// 			return users[0];
// 		},
// 	},
// 	User: {
// 		__resolveReference(object) {
// 			return users.find((user) => user.id === object.id);
// 		},
// 	},
// };

const server = new ApolloServer({
	schema: buildFederatedSchema([
		{
			typeDefs,
			resolvers,
		},
	]),
});

server.listen({ port: 9000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});

// Iniciar el servidor
// app.listen(9000, () => {
// 	console.log("Servidor de AUTENTICACION Express.js en ejecución");
// });
