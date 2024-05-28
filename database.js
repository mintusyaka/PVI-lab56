
import mysql from "mysql2"

import dotenv from "dotenv"
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// await addStudent("ПП-27", "Anthony BAtory", "Male", "05.06.2008")
// await removeStudent("Anthony BAtory");

// const result = await getStudents();

// console.log(result);

export async function getStudents() {
    const [result] = await pool.query("SELECT * FROM students")
    return result;
}

export async function getStudent(name) {
    const [result] = await pool.query("SELECT * FROM students WHERE name = ?", [name])
    return result[0];
}

export async function updateStatusOnline(name) {
    await pool.query(`
        UPDATE students
        SET
        status = 'online'
        WHERE
        name = ?
    `, [name]);
}

export async function updateStatusOffline(name) {
    await pool.query(`
        UPDATE students
        SET
        status = 'offline'
        WHERE
        name = ?
    `, [name]);
}

export async function addStudent(group_name, name, sex, birthday) {
    if(isValidName(name)) {
        await pool.query(
            "INSERT INTO students (name, birthday, sex, group_name) VALUES (?, ?, ?, ?)",
            [name, birthday, sex, group_name]
        )
        return true;
    }
    return false;
}

export async function removeStudent(name) {
    await pool.query(
        "DELETE FROM students WHERE name = ?",
        [name]
    )
}

export async function editStudent(data) {
    await pool.query(`
        UPDATE students
        SET
        name = ?,
        birthday = ?,
        sex = ?,
        group_name = ?
        WHERE
        name = ?
    `, data);
//         "
//     UPDATE`students`
//     SET
//     `name`='{$student->name}',
//     `birthday`='{$student->birthday}',
//     `sex`='{$student->sex}',
//     `group_name`='{$student->group_name}'
//     WHERE `name`='{$name}';
// ");
}

function isValidName(name) {
    // Check if the name is a string
    if (typeof name !== 'string') {
        return false;
    }

    // Trim whitespace from the beginning and end of the name
    name = name.trim();

    // Check if the name is between 2 and 30 characters long
    if (name.length < 2 || name.length > 30) {
        return false;
    }

    // Check if the name contains only letters (using a regular expression)
    if (!/^[a-zA-Z ]+$/.test(name)) {
        return false;
    }

    // If all checks pass, the name is considered valid
    return true;
}