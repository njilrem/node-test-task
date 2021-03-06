# test task

## Task Tracker

### Users API

#### Register

Post to localhost:3000/users/register

Required body: {
  "firstName": "First",
  "lastName": "Last",
  "email": "example@gmail.com",
  "password": "sEcR3t"
}

#### Login

POST to localhost:3000/users/login

Required body: {
  "email": "example@gmail.com",
  "password": "sEcR3t"
}

#### Get all users

10 limit per page, GET to localhost:3000/users/?page=(var)

Bearer required

#### Get user

GET to localhost:3000/users/user

Bearer required

#### Update user

PATCH to localhost:3000/users/user

Bearer required

Example body: {
  "firstName": "Newfirst",
  "lastName": "Newlast",
  "email": "newexample@gmail.com",
  "password": "neWsEcR3t"
}

#### Delete user

DELETE to localhost:3000/users/user

Bearer required

Required body: {
  "email": "example@gmail.com",
  "password": "sEcR3t"
}

### Tasks API

Allowed statuses are: "View", "In progress", "Done"

#### Create task

POST to localhost:3000/tasks

Bearer required

Required body: {
  "title": "Example task title",
  "description": "Example task description",
  "status": "View"
}

#### Update task

PATCH to localhost:3000/tasks

Bearer required

Example body (id is required): {
  "id": 1
  "title": "Example task title",
  "description": "Example task description",
  "status": "In progress"
}

#### Assign task

POST to localhost:3000/tasks/assign

Bearer required

Required body: {
  "id": 1,
  "email": "userAssignedToEmail@example.com"
}

#### Delete task

Delete to localhost:3000/tasks

Bearer required

Required body: {
  "id": 1
}

#### Get tasks

GET to localhost:3000/tasks

Bearer required

#### Get tasks by status or/and filtered by date

GET to localhost:3000/tasks/status

Bearer required

Example body: {
    "status": "Done",
    "date": "2020-07-10"
}

#### Get tasks by user registration date

GET to localhost:3000/tasks/sort

sort can be "ASC", "DESC", etc

Bearer required

Example body: {
    "sort": "DESC"
}