/**
 * MANEJO DE LAS SOLICITUDES A LA BASE DE DATOS DE LA TABLA DE "usuarios"
 */
import { supabase } from "../configs/databaseConfig.js";

// Realizar la consulta para obtener todos los datos del usuario en la base de datos
export const getUserByEmail = async (email) => {
	try {
		const { data, error } = await supabase.from("usuarios").select("*").eq("email", email).single();

		if (error) {
			throw error;
		}

		return data;
	} catch (error) {
		throw new Error("DB: Error fetching user data");
	}
};

export const getUsers = async () => {
	try {
		// Seleccionar todos los usuarios de la base de datos con todos sus atributos
		const { data, error: queryError } = await supabase.from("usuarios").select("*");
		console.log("Hola, estoy en consulta de base de datos", data);
		// const users = [
		// 	{
		// 		id: "1",
		// 		name: "Ada Lovelace",
		// 		birthDate: "1815-12-10",
		// 		username: "@ada",
		// 	},
		// 	{
		// 		id: "2",
		// 		name: "Alan Turing",
		// 		birthDate: "1912-06-23",
		// 		username: "@complete",
		// 	},
		// ];

		//Si hay un error durante la consulta
		if (queryError) {
			throw new Error(queryError.message);
		}

		return data;
	} catch (error) {
		throw new Error("DB: Error fetching users");
	}
};

export const insertUser = async (email, nombre_usuario, hashedPassword) => {
	try {
		// Guardar los datos adicionales del usuario en la tabla 'usuarios'
		const { data, error: insertError } = await supabase
			.from("usuarios")
			.insert([{ email, nombre_usuario, contrasena: hashedPassword }]);

		//Si hay un error durante la insercion de los datos del usuario
		if (insertError) {
			throw new Error(insertError.message);
		}

		return data;
	} catch (error) {
		throw new Error("DB: Error inserting user");
	}
};

export const updatePasswordUser = async (to) => {
	try {
		const { error: queryError } = await supabase.from("usuarios").update(newData).eq("email", to);

		//Si hay un error durante
		if (queryError) {
			throw new Error(queryError.message);
		}
	} catch (error) {
		throw new Error("DB: Error updating user password");
	}
};
//Consulta para verificar si el email existe en la base de datos
export const searchUser = async (emailToCheck) => {
	try {
		//Consulta para verificar si el email existe en la base de datos
		const { data: userData, error: queryError } = await supabase
			.from("usuarios")
			.select("*")
			.eq("email", emailToCheck);

		//Si hay un error durante
		if (queryError) {
			throw new Error(queryError.message);
		}

		return userData;
	} catch (error) {
		throw new Error("DB: Error al buscar usuario/el usuario ya existe");
	}
};

export const insertGoogleUser = async (email, given_name, name) => {
	try {
		// Guardar los datos del usuario en la tabla 'usuarios'
		const { data, error: insertError } = await supabase
			.from("usuarios")
			.insert([{ email: email, nombre_usuario: name }]);

		//Si hay un error durante la insercion de los datos del usuario
		if (insertError) {
			throw new Error(insertError.message);
		}

		return data;
	} catch (error) {
		throw new Error("DB: Error al insertar usuario/el usuario ya existe");
	}
};

export const getUserPassword = async (id_usuario) => {
	try {
		//Obtener contrasena encriptada del usuario
		const { data, error } = await supabase
			.from("usuarios")
			.select("contrasena")
			.eq("id_usuario", id_usuario);

		//Si hay un error
		if (error) {
			throw new Error(error.message);
		}

		return data;
	} catch (error) {
		throw new Error("DB: Error fetching user password ");
	}
};

export const updateUserPassword = async (newData, id_usuario) => {
	try {
		const { data, error } = await supabase
			.from("usuarios")
			.update(newData)
			.eq("id_usuario", id_usuario);

		//Si hay un error
		if (error) {
			throw new Error(error.message);
		}

		return data;
	} catch (error) {
		throw new Error("DB: Error updating user password");
	}
};

// module.exports = {
// 	getUserByEmail,
// 	getUsers,
// 	getUserPassword,
// 	insertGoogleUser,
// 	insertUser,
// 	updatePasswordUser,
// 	updateUserPassword,
// 	searchUser,
// };
