import {pool} from "./pool.js";
import useDb from "./useDb.js";

export const initDb = async () => {
    try {
        await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        
        await useDb();

        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(64) NOT NULL,
            avatarURL VARCHAR(255),
            biography VARCHAR(255),
            isEmailValidated BOOLEAN NOT NULL DEFAULT FALSE,
            isEmailPublic BOOLEAN NOT NULL DEFAULT TRUE,
            isEnabled BOOLEAN NOT NULL DEFAULT TRUE
        );`);
    
        await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            category ENUM('consola', 'ordenador', 'radio', 'televisor', 'movil') NOT NULL,
            price DECIMAL(10 , 2 ) NOT NULL,
            location VARCHAR(100),
            imageURL VARCHAR(255),
            description LONGTEXT NOT NULL,
            sellerId INT,
            FOREIGN KEY (sellerId)
                REFERENCES users (id)
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS reservation (
            id INT PRIMARY KEY AUTO_INCREMENT,
            buyOrder TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            reservationLocation VARCHAR(100) NOT NULL,
            reservationDate DATETIME NOT NULL,
            status ENUM('pendiente', 'en proceso', 'finalizada'),
            review ENUM('1', '2', '3', '4', '5'),
            buyerId INT,
            FOREIGN KEY (buyerId)
                REFERENCES users (id),
            productId INT,
            FOREIGN KEY (productId)
                REFERENCES products (id)
        );`);
    
    
        console.log("¡Base de datos creada satisfactoriamente!");
        
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

initDb();