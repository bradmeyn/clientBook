# Welcome to ClientBook
## Fullstack client relationship manager

### Desicription

A full CRUD application with user authorisation and authentication. Node and Express are used on the backend with MongoDB for the database.
I used Bootstrap on the front-end to save time, however have also created and styled some elements myself.

### Features: 
- Ability to create a new business account that establishes a new administrator user.
- Create,view, update and delete clients. 
- Quickly find clients with navbar search using client names or numbers.
- Create timestamped client notes.

### Software Used
- HTML
- CSS
- Boostrap
- Javscript
- Node.js
- Express
- MongoDb
- Passport.js
- EJS

### Skills Demonstrated
- Build full stack application using a range of modern technologies.
- Demonstate RESTful routing concepts
- Facilitate user login, authentication and authorisations using Passport.js
- Implement pagination
- Emded dynamic data and render it using EJS templates
- Build dropdown search functionality


## Future Plans

This project is still a work in progress. 

### Finalise notes functionality 
I want the 5 most recent notes to display on the client "show" page and implement a note-search feature on the notes index.

### Implement a Jobs feature
I will eventunally add the ability to create a job with various stages. Any outstanding jobs will be visible on the clients show page.

### User admin
Add the ability for an administrator to create additional logins and set access levels (view/edit/delete). Also add a forgot/reset password feature.

### User Dashboard
Currently upon login you land on the index page displaying all clients associated with the business. Once the notes & jobs elements have been finalised I would like to implement a dashboard that has  current jobs outstanding which a chart. Other elements will include client birthdays and recently created notes.

### General Clean-up
I have to go through, fix up some styling and make the app mobile-friendly. This includes updating the landing page.

### Dynamic show page for relationships
Currently each client is an individual. I would like to add the ability to link partners & then potentially render a different EJS template for relationships.

### Assets/Liabilities & Cashflow/Expenses
Originally I was going to add client assets/liabilities, income & expenses as additional fields. This isn't really a priority because I would like to move on, but it would allow for some nice visual elements with net wealth charts etc.
