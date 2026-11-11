//importar las 3 prinipales funciones de Vitest que son:
//describe: sirve para agrupar prueba que pertenecen a un mismo tema o archivo
//it: define un caso de prueba individual (lo que se quiere comprobar paso a paso)
//expect: evaluador que revisa si el contenido es igual al resultado esperado
import { describe, it, expect } from "vitest";

//importar las funciones reales del archivo password.util.ts para probar
import { hashPassword, comparePassword } from "./password.util.ts";

//bloque principal de pruebas para las contraseñas
describe("Pruebas unitarias de password.util", () => {
    //Definir las dos contraseñas de pruebas
    const password1 = "ClaveUno123!";
    const password2 = "ClaveDos456!";

    //caso 1: probar que se generan bien los hashes ( cadenas de texto incomprensibles desde un dato original)
    //usar async porque hashPassword devuelve una Promesa (Promise<string>) y necesitamos esperar que se resuelva para poder comparar el resultado (await)
    it("Generacion de hashes: cada uno es una cadena no vacia y diferente de s contraseña original", async () => {
        // generar los hashes esperandp (await) a que l  funcion termine de encriptar cada contraseña
        const hash1 = await hashPassword(password1);
        const hash2 = await hashPassword(password2);

        //---validaciones para hash1---
        //tyoeof devuelve el tipo de dato; comprobar que el texto de hash1 sea texto (string)
        expect(typeof hash1).toBe("string");
        //.length cuenta los caracteres; comprobamos que sea mayor que 0 (no vacio)
        expect(hash1.length).toBeGreaterThan(0);
        //.not.toBe comprueba ue el hash encriptado NO sea igual que a la contraseña en texto plano
        expect(hash1).not.toBe(password1);

        //validaciones para el hash2
        expect(typeof hash2).toBe("string");
        expect(hash2.length).toBeGreaterThan(0);
        expect(hash2).not.toBe(password2);
    });

    //caso 2: probar que el usuario ingrese la contraseña correcta
    it("Contraseña correcta: ambas comprobaciones regresan true", async () => {
        const hash1 = await hashPassword(password1);
        const hash2 = await hashPassword(password2);

        //Comparar lass contraseñas con su propip hash usando la funcion comparePassword
        const resultado1 = await comparePassword(password1, hash1);
        const resultado2 = await comparePassword(password2, hash2);

        //validar que ambas comparaciones devuelvan true
        expect(resultado1).toBe(true);
        expect(resultado2).toBe(true);
    });

    //caso 3: probar cuando el usuario ingrese una contraseña incorrecta
    it("Contraseña incorrecta: ambas comprobaciones regresan incorrectas", async () => {
        //generar hash de ambas contraseñas
        const hash1 = await hashPassword(password1);
        const hash2 = await hashPassword(password2);

        //comparar la contraseña 1 con el hash de la contraseña 2 y viceversa
        const resultadoCruzado1 = await comparePassword(password1, hash2);
        const resultadoCruzado2 = await comparePassword(password2, hash1);

        //validar que las comparaciones den false
        expect(resultadoCruzado1).toBe(false);
        expect(resultadoCruzado2).toBe(false);

    });

});
