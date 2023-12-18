import {
	traemeusuarios,
	loginUser,
	registerUser,
	loginGoogleUser,
} from "../controllers/authController.js";
import { getUsers } from "../models/UsuariosModel.js";
import { gql } from "apollo-server-express";

//SCHEMA
export const typeDefs = gql`
	extend type Query {
		users: User
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

//RESOLVERS
export const resolvers = {
	Query: {
		users: async () => {
			try {
				const data = await getUsers();
				return data[0];
			} catch (error) {
				throw new Error(`Error al obtener los usuarios: ${error}`);
			}
		},
	},

	Mutation: {
		/**
		 *
		 * USER REGISTER
		 */
		registerUser: async (_, { input }) => {
			try {
				const { email, nombre_usuario, contrasena } = input;

				const message = await registerUser(email, nombre_usuario, contrasena);

				return { message };
			} catch (error) {
				throw new Error(`Error al registrar el usuario: ${error.message}`);
			}
		},

		/**
		 *
		 * USER LOGIN
		 */
		loginUser: async (_, { input }) => {
			try {
				const { email, contrasena } = input;

				const result = await loginUser(email, contrasena);

				return result;
			} catch (error) {
				throw new Error(`Error al inciar sesion (resolver): ${error.message}`);
			}
		},

		/**
		 *
		 * USER GOOGLE LOGIN
		 */
		loginGoogleUser: async (_, { input }) => {
			try {
				const { clientId, credential } = input;

				const result = await loginGoogleUser(clientId, credential);

				return result;
			} catch (error) {
				throw new Error(`Error al inciar sesion GOOGLE (resolver): ${error.message}`);
			}
		},
	},
};
