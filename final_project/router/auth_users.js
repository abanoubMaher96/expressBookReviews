const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    const filteredUsers = users.filter(user => user.username === username);
    return !filteredUsers.length;
}

const authenticatedUser = (username, password) => { //returns boolean
    const filteredUsers = users.filter(user => user.username === username && user.password === password);
    return filteredUsers.length
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (authenticatedUser(username, password)) {
            const accessToken = jwt.sign(
                { password }, "finalProject", { expiresIn: 60 * 60 }
            )
            req.session.authorization = {
                accessToken,
                username
            }
            return res.status(200).json({ message: "User successfully logged in" });

        }
        else {
            return res
                .status(401)
                .json({ message: "Invalid username or password" });
        }
    }
    else {
        return res.status(400).json({ message: "Please provide username and password" })
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const reviewQ = req.query.review;
    const username = req.session.authorization["username"];
    if (isNaN(bookISBN)) {
        return res.status(400).json({ message: "Please provide a number" });
    } else {
        const filteredBook = books[bookISBN];
        if (filteredBook) {
            if (reviewQ) {
                const bookReviews = filteredBook.reviews;
                const newBookReview = { ...bookReviews, [username]: reviewQ };
                books[bookISBN].reviews = newBookReview;
                return res.status(200).json({ message: "Review updated successfuly" });
            } else {
                return res.status(400).json({ message: "Please provide a review" });
            }
        } else {
            return res.status(404).json({ message: "There is no books with this ISBN" });
        }

    }
});
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const username = req.session.authorization["username"];
    if (isNaN(bookISBN)) {
        return res.status(400).json({ message: "Please provide a number" });
    } else {
        const filteredBook = books[bookISBN];
        if (filteredBook) {
            const bookReviews = filteredBook.reviews;
            const { [username]: _, ...newBookReview } = bookReviews;
            books[bookISBN].reviews = newBookReview;
            return res.status(200).json({ message: "Review has been deleted successfuly" });
        } else {
            return res.status(404).json({ message: "There is no books with this ISBN" });
        }

    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
