// const bcrypt = require("bcrypt"); // Para encriptar contraseñas
// const jwt = require("jsonwebtoken"); // Para manejar tokens JWT
const { traemeusuarios, loginUser } = require("../controllers/authController");
const { getUsers } = require("../models/UsuariosModel");
const { gql } = require("apollo-server");

//SCHEMA
const typeDefs = gql`
	extend type Query {
		users: User
	}

	type User @key(fields: "id_usuario") {
		id_usuario: ID
		email: String
		nombre_usuario: String
		nickname: String
		avatar_id: Int
		contrasena: String
		logro_monarquia: Boolean
		logro_republica: Boolean
		logro_imperio: Boolean
		logro_personajes: Boolean
		logro_arquitectura: Boolean
		logro_cultura: Boolean
		nivel: Int
		experiencia: Int
	}
`;

// type Mutation {
//   loginUser(email: String!, contrasena: String!): AuthPayload
//   # Add other mutations for registration, etc.
// }
//RESOLVERS
const resolvers = {
	Query: {
		users: async () => {
			console.log("AAAAAAAAAAAAAAAA");
			try {
				const data = await getUsers();
				console.log("------------->", data[0]);
				return data[0];
			} catch (error) {
				throw new Error(`Error al obtener los usuarios: ${error}`);
			}
		},
		// Otros resolvers de consulta según sea necesario
	},

	// Mutation: {
	// 	async loginUser(_, { email, contrasena }) {
	// 		try {
	// 			return await loginUser(email, contrasena);
	// 		} catch (error) {
	// 			throw new Error(`Error al iniciar sesión: ${error.message}`);
	// 		}
	// 	},
	// 	// Otras mutaciones según sea necesario
	// },

	// Otros resolvers según sea necesario
};

const users = [
	{
		id: "1",
		name: "Ada Lovelace",
		birthDate: "1815-12-10",
		username: "@ada",
	},
	{
		id: "2",
		name: "Alan Turing",
		birthDate: "1912-06-23",
		username: "@complete",
	},
];

module.exports = { typeDefs, resolvers };
