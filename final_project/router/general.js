const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({ username: username, password: password });
            return res
                .status(200)
                .json({ message: "User successfully registred" });
        } else {
            return res.status(400).json({ message: "There is a user with this username" })
        }
    }
    else {
        return res.status(400).json({ message: "Please provide username and password" })
    }
});

// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//     if (books) {
//         return res.status(200).send(JSON.stringify(books, null, 4));
//     }
//     return res.status(404).json({ message: "Books data not available" });
// });

// using promise to get all books (task 10)
const getAllBooks = new Promise((resolve, reject) => {
    if (books) {
        const stringfiedBooks = JSON.stringify(books, null, 4);
        resolve(stringfiedBooks);
    } else {
        reject(new Error('Books data not available'));
    }
});
public_users.get('/', (req, res) => {
    getAllBooks
        .then((books) => {
            res.status(200).send(books);
        })
        .catch((error) => {
            res.status(500).send({ error: error.message });
        });
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const bookISBN = req.params.isbn;
//     if (isNaN(bookISBN)) {
//         return res.status(400).json({ message: "Please provide a number" });
//     } else {
//         const filteredBook = books[bookISBN];
//         if (filteredBook) {
//             return res.status(200).send(filteredBook);
//         } else {
//             return res.status(404).json({ message: "There is no books with this ISBN" });
//         }
//     }
// });

// using promise to get book details based on ISBN (task 11)
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        if (isNaN(isbn)) { reject(new Error('Please provide a number')); }
        else {
            const filteredBook = books[isbn];

            if (filteredBook) {
                resolve(filteredBook);
            } else {
                reject(new Error('There is no book with this ISBN'));
            }
        }
    });
};
public_users.get('/isbn/:isbn', function (req, res) {
    const bookISBN = req.params.isbn;
    getBookByISBN(bookISBN)
        .then((filteredBook) => {
            return res.status(200).send(filteredBook);
        })
        .catch((error) => {
            return res.status(404).json({ message: error.message });
        });
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const bookAuthor = req.params.author;
//     if (bookAuthor) {
//         const filteredBooks = Object.values(books).filter(book => book.author === bookAuthor);
//         if (filteredBooks.length) return res.status(200).send(filteredBooks);
//         else return res.status(404).json({ message: "There is no books for this author" });
//     } else {
//         return res.status(400).json({ message: "Please provide an author" });
//     }
// });

// using promise to get book details based on author (task 12)
const getBooksByAuthor = (bookAuthor) => {
    return new Promise((resolve, reject) => {
        if (bookAuthor) {
            const filteredBooks = Object.values(books).filter(book => book.author === bookAuthor);
            if (filteredBooks.length) {
                resolve(filteredBooks);
            } else {
                reject(new Error('There is no books for this author'));
            }
        } else {
            reject(new Error('Please provide an author'));
        }
    });
};
public_users.get('/author/:author', function (req, res) {
    const bookAuthor = req.params.author;
    getBooksByAuthor(bookAuthor)
        .then((filteredBooks) => {
            return res.status(200).send(filteredBooks);
        })
        .catch((error) => {
            return res.status(404).json({ message: error.message });
        });
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const bookTitle = req.params.title;
//     if (bookTitle) {
//         const filteredBooks = Object.values(books).filter(book => book.title === bookTitle);
//         if (filteredBooks.length) return res.status(200).send(filteredBooks);
//         else return res.status(404).json({ message: "There is no books with this title" });
//     } else {
//         return res.status(400).json({ message: "Please provide a title" });
//     }
// });

// using promise to getall books based on title (task 13)
const getBookByTitle = (bookTitle) => {
    return new Promise((resolve, reject) => {
        if (!bookTitle) {
            reject(new Error('Please provide a title'))
        }
        else {
            const filteredBooks = Object.values(books).filter(book => book.title === bookTitle);
            if (filteredBooks) {
                resolve(filteredBooks);
            } else {
                reject(new Error('There is no books with this title'))
            }
        }
    })
}
public_users.get('/title/:title', function (req, res) {
    const bookTitle = req.params.title;
    getBookByTitle(bookTitle).then((filteredBooks) => {
        return res.status(200).send(filteredBooks);
    }).catch((error) => {
        return res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const bookISBN = req.params.isbn;
    if (isNaN(bookISBN)) {
        return res.status(400).json({ message: "Please provide a number" });
    } else {
        const filteredBook = books[bookISBN];
        if (filteredBook) {
            return res.status(200).send(filteredBook.reviews);
        } else {
            return res.status(404).json({ message: "There is no books with this ISBN" });
        }
    };
});

module.exports.general = public_users;
