import { OAuth2Client } from "google-auth-library";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config(); // Load environment variables from .env file

const secretKey = process.env.SECRET_KEY_JWT;

// Middleware para verificar la validez de un token de autenticacion JWT
export function verifyToken(req, res, next) {
	//Extrae el token del encabezado de autorizacion de la solicitud
	//El token se envía al servidor en el encabezado de autorización utilizando el esquema 'Bearer'
	const token = req.headers.authorization;
	console.log("MITOKEN", token);

	//Si no se proporciono ningun token. Se envia respuesta de error 401 (No autorizado)
	if (!token) {
		return res.status(401).json({ error: "Token no proporcionado" });
	}

	//Verifica la validad del token con la biblitoeca jsonwebtoken
	//Toma tres argumentos: el token a verificar, la clave secreta y una funcion de devolucion de llamada que maneja el resultado de la verificacion
	jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
		if (err) {
			return res.status(403).json({ error: "Token inválido" });
		}

		// Si el token es valido y se verifica correctamente, el usuario decodificado se asigna a req.user
		req.user = decoded;
		//Invoca siguiente funcion de middleware
		next();
	});
}

//Verify token with Google sign in
export async function verifyTokenGoogle(client_id, jwtToken) {
	const client = new OAuth2Client(client_id);
	// Call the verifyIdToken to
	// varify and decode it
	const ticket = await client.verifyIdToken({
		idToken: jwtToken,
		audience: client_id,
	});
	// Get the JSON with all the user info
	const payload = ticket.getPayload();
	// This is a JSON object that contains
	// all the user info
	return payload;
}
