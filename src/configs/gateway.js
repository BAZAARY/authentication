// const bcrypt = require("bcrypt"); // Para encriptar contraseñas
// const jwt = require("jsonwebtoken"); // Para manejar tokens JWT
const {
	traemeusuarios,
	loginUser,
	registerUser,
	loginGoogleUser,
} = require("../controllers/authController");
const { getUsers } = require("../models/UsuariosModel");
const { gql } = require("apollo-server");

//SCHEMA
const typeDefs = gql`
	extend type Query {
		users: User
		registerUser: RegistrationResult
		loginUser: LoginResult
	}

	type User @key(fields: "id_usuario") {
		id_usuario: ID
		email: String
		nombre_usuario: String
		contrasena: String
	}

	#INPUTS

	input UserInput {
		email: String!
		nombre_usuario: String
		contrasena: String!
	}

	input CredentialLoginGoogle {
		clientId: String!
		credential: String!
	}

	#LO QUE RETORNA AL GATEWAY/FRONTEND

	type RegistrationResult {
		message: String!
	}

	type LoginResult {
		user: User
		token: String
		message: String
	}

	type LoginGoogleResult {
		user: User
		token: String
		message: String
	}

	type Mutation {
		registerUser(input: UserInput!): RegistrationResult!
		loginUser(input: UserInput!): LoginResult
		loginGoogleUser(input: CredentialLoginGoogle!): LoginGoogleResult
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

	Mutation: {
		registerUser: async (_, { input }) => {
			try {
				const { email, nombre_usuario, contrasena } = input;

				// Lógica para registrar al usuario y obtener el mensaje de confirmación
				const message = await registerUser(email, nombre_usuario, contrasena);

				return { message };
			} catch (error) {
				throw new Error(`Error al registrar el usuario: ${error.message}`);
			}
		},
	},

	Mutation: {
		loginUser: async (_, { input }) => {
			try {
				const { email, contrasena } = input;

				// Lógica para registrar al usuario y obtener el mensaje de confirmación
				const result = await loginUser(email, contrasena);
				console.log("result", result);

				return result;
			} catch (error) {
				throw new Error(`Error al inciar sesion (resolver): ${error.message}`);
			}
		},
	},

	Mutation: {
		loginGoogleUser: async (_, { input }) => {
			try {
				const { clientId, credential } = input;

				// Lógica para registrar al usuario y obtener el mensaje de confirmación
				const result = await loginGoogleUser(clientId, credential);
				console.log("GOOGLE USER MUTATION--------->", result);

				return result;
			} catch (error) {
				throw new Error(`Error al inciar sesion GOOGLE (resolver): ${error.message}`);
			}
		},
	},
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
