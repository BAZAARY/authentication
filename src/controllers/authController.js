/**
 * Controladores de autenticacion, manejo de las cuentas de usuario
 */

import {
	getUserByEmail,
	getUsers,
	insertUser,
	// updatePasswordUser,
	searchUser,
	insertGoogleUser,
} from "../models/UsuariosModel.js";
import { verifyTokenGoogle } from "../middlewares/authMiddleware.js";
// import { apmInstance } from "../../index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import apm from "elastic-apm-node";
import axios from "axios";

config();

const secretKey = process.env.SECRET_KEY_JWT;

const apmInstance = apm.start({
	serviceName: "authentication-service",

	secretToken: "pmzj1HFP3c3kwUw3Gl",

	serverUrl: "https://017f20cd667948199b024b97e2c47ca6.apm.us-central1.gcp.cloud.es.io:443",

	environment: "my-environment",
});

//POST para el inicio de sesion de los usuarios
export async function loginUser(email, contrasena) {
	return new Promise(async (resolve, reject) => {
		//Start transaction
		const transaction = apmInstance.startTransaction("Inicio de sesión", "request");
		console.log("Transaction start" + transaction);

		try {
			// Realizar la consulta para obtener todos los datos del usuario en la base de datos
			const usuarioData = await getUserByEmail(email);

			// Agregar etiquetas para clasificar la transacción
			transaction.addLabels({
				email: email,
				accion: "login",
			});

			// Agregar contexto adicional sobre el usuario y la solicitud
			transaction.setUserContext({
				email: email,
			});

			// Verificar el hash de la contraseña
			const contrasenaHash = usuarioData.contrasena;

			// Comparar el hash almacenado con el hash de la contraseña proporcionada por el usuario
			const match = await bcrypt.compare(contrasena, contrasenaHash);

			// Si las contraseñas no coinciden, se envía una respuesta de error
			if (!match) {
				throw new Error("Credenciales de inicio de sesión inválidas");
			}

			const user = {
				id_usuario: usuarioData.id_usuario,
				email: usuarioData.email,
				nombre_usuario: usuarioData.nombre_usuario,
			};

			console.log("user", user, "usuarioData", usuarioData);
			// Generar token JWT con el id_usuario email y nombre del usuario
			const token = jwt.sign(user, secretKey);

			console.log("Transaction end");
			transaction.end();

			// Aquí agregamos el envío de logs a Elasticsearch
			const logs = [
				{ index: { _index: "logs", _type: "_doc" } },
				{
					message: "Inicio de sesión exitoso",
					timestamp: new Date().toISOString(),
					user_id: user.id_usuario,
				},
			];

			await sendLogsToElasticsearch(logs); // Llama a la función para enviar logs a Elasticsearch

			// Enviar el token al frontend con los datos del usuario y un mensaje de confirmacion
			resolve({ user, token, message: "Inicio de sesión exitoso" });
		} catch (error) {
			console.error("Error al inciar sesion:", error);

			//Capturar error, enviar log y finalizar transaccion
			apmInstance.captureError(error);
			apmInstance.logger.error("Ha ocurrido un error:", error);
			transaction.end();

			// Rechaza la promesa con el error
			reject(error);
		}
	});
}

//POST LOGIN WITH GOOGLE
export async function loginGoogleUser(clientId, credential) {
	return new Promise(async (resolve, reject) => {
		//Start transaction
		const transaction = apmInstance.startTransaction("Inicio de sesión con Google", "request");

		try {
			// Verificar el token con la función verifyTokenGoogle
			const payload = await verifyTokenGoogle(clientId, credential);

			//Obtener datos del usuario
			const { email, name, picture, given_name } = payload;

			// Agregar etiquetas para clasificar la transacción
			transaction.addLabels({
				email: email,
				usuario: name,
				accion: "login with google",
			});

			// Agregar contexto adicional sobre el usuario y la solicitud
			transaction.setUserContext({
				email: email,
			});

			//Email a verificar si ya existe en la base de datos
			const emailToCheck = email;

			try {
				//Consulta para verificar si el email existe en la base de datos
				const verifyExistenceUser = await searchUser(emailToCheck);

				//Si el correo electrónico NO está registrado en la tabla
				if (verifyExistenceUser.length == 0) {
					const registerUser = await insertGoogleUser(email, given_name, name);
					console.log(registerUser);
				}
			} catch (error) {
				console.error("Error en la consulta:", error);
			}

			const usuarioData = await getUserByEmail(email);

			//Datos para poner en el token
			const user = {
				id_usuario: usuarioData.id_usuario,
				email: usuarioData.email,
				nombre_usuario: usuarioData.nombre_usuario,
			};

			// Generar token JWT con el id_usuario email y nombre del usuario
			const token = jwt.sign(user, secretKey);

			// Enviar el token al frontend con los datos del usuario y un mensaje de confirmacion
			// res.json({ usuarioData, token, message: "Inicio de sesión exitoso" });
			resolve({ user, token, message: "Inicio de sesión (Google) exitoso" });
		} catch (error) {
			console.error("Error al iniciar sesión:", error);

			//Capturar error, enviar log y finalizar transaccion
			apmInstance.captureError(error);
			apmInstance.logger.error("Ha ocurrido un error:", error);

			res.status(500).json({ error: "Credenciales de inicio de sesión inválidas" });
		} finally {
			transaction.end();
		}
	});
}

//POST para el registro de usuarios
export async function registerUser(email, nombre_usuario, contrasena) {
	return new Promise(async (resolve, reject) => {
		//Start transaction
		const transaction = apmInstance.startTransaction("Registro de usuario", "request");

		try {
			// Generar el hash de la contraseña
			const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el número de rondas de hashing

			// Agregar etiquetas para clasificar la transacción
			transaction.addLabels({
				email: email,
				usuario: nombre_usuario,
				accion: "registro",
			});

			// Agregar contexto adicional sobre el usuario y la solicitud
			transaction.setUserContext({
				email: email,
			});

			const data = await insertUser(email, nombre_usuario, hashedPassword);

			// Resuelve la promesa con el resultado si es necesario
			resolve("OK");
		} catch (error) {
			console.error("Error al crear el usuario:", error);

			//Capturar error, enviar log y finalizar transaccion
			apmInstance.captureError(error);
			apmInstance.logger.error("Ha ocurrido un error:", error);

			// Rechaza la promesa con el error
			reject(error);
		} finally {
			transaction.end();
		}
	});
}

// Función para enviar logs a Elasticsearch
async function sendLogsToElasticsearch(logs) {
	try {
		const ELASTICSEARCH_ENDPOINT =
			"https://017f20cd667948199b024b97e2c47ca6.apm.us-central1.gcp.cloud.es.io:443"; // Reemplaza con tu endpoint de Elasticsearch

		const logData = logs.map((log) => JSON.stringify(log)).join("\n") + "\n";

		console.log("Enviando a ELASTICSEARCH");

		await axios.post(ELASTICSEARCH_ENDPOINT, logData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error al enviar logs a Elasticsearch:", error.message);
	}
}
