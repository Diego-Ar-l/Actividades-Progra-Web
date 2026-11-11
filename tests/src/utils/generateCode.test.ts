//importar las funciones de Vitest para estructruar y evaluar las pruebas
import { describe, it, expect } from "vitest";

import { generateSixDigitCode } from "./generateCode.util";

describe("Pruebas unitarias de generateCode.util", () => {
    //caso 1 verificae el formato del cosigo generado
    it("Debe generar un pdogp en formato string de exactamaente 6 digitos", () => {
        const codigo = generateSixDigitCode();

        //comprobar que el codigo generado sea un string 
        expect(typeof codigo).toBe("string");

        //comprobar que el codigo genertado tenga tamaño de 6 caracteres
        expect(codigo).toHaveLength(6);

        // .toMatch(/^\d{6}$/) usa una expresion regular para asegurar que los 6 carateres sean solo numeros  del 0 al 9
        expect(codigo).toMatch(/^\d{6}$/);
    });

    //caso 2: verufucar el texto a tipo Numero para poder hacer comparaciones matematicas
    it("El codigo debe de estar generado ente 100000 y 999999", () => {
        const codigo = generateSixDigitCode();

        //converir el texto  a tinpo numero para poder hacer compararciones matematica
        const codigoNumerico = Number(codigo);

        //toBeGreaterThanOrEqual verifica que el codigo numerico sea mayor o igual a 100000
        expect(codigoNumerico).toBeGreaterThanOrEqual(100000);

        //toBeLessThanOrEqual verifica que el codigo sea menor o igual a 999999
        expect(codigoNumerico).toBeLessThanOrEqual(999999);
    });

});