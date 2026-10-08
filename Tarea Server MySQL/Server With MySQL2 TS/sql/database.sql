CREATE DATABASE IF NOT EXISTS pos;
USE pos;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    description VARCHAR(500) NOT NULL,
    brand VARCHAR(100),
    img TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO products (name, price, stock, description, brand, img) VALUES
    ('Laptop Pro 14', 21999.00, 12, 'Laptop de 14 pulgadas para trabajo y estudio.', 'Nova', 'laptop-pro-14.jpg'),
    ('Mouse Inalambrico', 399.00, 45, 'Mouse inalambrico con conexion Bluetooth.', 'Nova', 'mouse-inalambrico.jpg'),
    ('Teclado Mecanico', 1299.00, 20, 'Teclado mecanico con retroiluminacion.', 'Keycraft', 'teclado-mecanico.jpg');