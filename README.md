Assignment 3 - Persistence: Two-tier Web Application with Flat File Database, Express server, and CSS template
===

## Blogatron Beta

http://a3-heartkiiier.glitch.me

A simple/user interface-freindly blog that users can read/post stories, more short ones compared to larger pieces of news/headlines. Displayed in a deck-of-cards manner. User can **click** on an image to read the full story and comments. Simply **log in** using **billy** as username and **12345** as password for an exisiting account or sign up as a new user (can put literally anything) to be able to post, comment, edit, and delete. For now, **only urls** are accepted for images. This can be easily done by copying the address of the image on Google Images or anywhere else, for that matter. If you leave the url blank, that's fine too.  

- Database utilized: MongoDB/Mongoose because I have been familiar with it in the past and comfortable.
- Authentication strategy: Passport Local with Mongoose since it seems to be the easiest and quickest option.
- A lot of style elements from tooplate.com were incorporated.
  - slight changes due to personal preferences were made such as color and positioning.
- body-parser, express, passport, passport-local, and method-override are the five express middleware packages that were used.

## Technical Achievements
- **EJS**: I used ejs instead of DOM manipulation to provide cleaner and more concise code. Using ejs is a lot more efficient and reliable compared to hard-coding the html.
- **Configuration of MongoDB**: I used MongoDB/Mongoose as explained above instead of lowDB, and since it's not easily supported in Glitch, I set it up using Mongo Atlas for Cloud database service, and configured it inside my app.js file.
- **Seeding the Database
### Design/Evaluation Achievements
- **Design Achievement 1**: I tested my application using screen reading software, and found that...
- **Design Achievement 2**: I followed best practices for accessibility, including providing alt attributes for images and using semantic HTML. There are no `<div>` or `<span>` elements in my document.
- **Design Achievement 3**: We tested the application with n=X users, finding that...
