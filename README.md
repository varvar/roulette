# Message Roulette

Running application example can be found on https://mroulette.herokuapp.com

### Project Setup on local machine
```
git clone https://github.com/varvar/roulette.git
cd to folder roulette
npm install
npm update
```

### Run
```
npm start
```
Once server started it will be accessible on http://localhost:8080/

### HTTP API Reference

#### Register User ####

* #### URL ####

  https://mroulette.herokuapp.com/api/users/register

* #### Method: #### 
  
  `POST`
  
* #### Data Params #### 

  ```
    {
      "name":"User1",
      "email":"test4@mail.com",
      "password":"123456"
    }

  ```
    Please note, that all properties are required and not optional

* #### Success Response: #### 
  
  * **Code:** 200 <br />
    **Content:** 
    ```
    {
        "id": 5,
        "name": "User1",
        "email": "test4@mail.com"
    }
    ```
 
* #### Notes: #### 

  Email address is unique property and cannot be added twice.  


#### Login User ####

* #### URL ####

  https://mroulette.herokuapp.com/api/users/login

* #### Method: #### 
  
  `POST`
  
* #### Data Params #### 

  ```
    {
      "email":"test4@mail.com",
      "password":"123456"
    }

  ```
    Please note, that all properties are required and not optional

* #### Success Response: #### 
  
  * **Code:** 200 <br />
    **Content:** 
    ```
    {
      "code": 200,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InRlc3QyIiwiZW1haWwiOiJ0ZXN0MkBtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJGVLQVBBYXpWMm0wcDZyaHRFUVBvN082SnpES3F0cjd2UmhWZGFSaEE0Ry5KLnVIUGJVSW9LIiwiaXAiOm51bGwsImxhc3RMb2dpbiI6bnVsbCwibG9naW5Db3VudCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyMC0wNS0xMVQxMTo1OToxOS4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMC0wNS0xMVQxMTo1OToxOS4wMDBaIiwiaWF0IjoxNTg5MTk4NDA2LCJleHAiOjE1ODkxOTg3MDZ9.tu27GFxtZJk-MjVgj5hMkPV7qnNoCoHmyJauV-Mmizk"
  }
    ```
 
* #### Notes: #### 

  Token returned in login response is JWT token and should be used for authentication in socket.io API 
  
### SOCKET.IO API Reference

* User connection to socket API requires JWT token and socket server URL should look like this: 

https://mroulette.herokuapp.com/?token={JWT token} 

* Server emits everything to "messages" channel, so all connected users should listen to this channel. 

### Blast ###

Emit message to all users except sender

* #### Server Event Name ####

 `blast`
 
* #### Data supported #### 

Any type of messages as plain text

### Spin ###

Emit message to a random user except sender

* #### Server Event Name ####

 `spin`
 
* #### Data supported #### 

Any type of messages as plain text


### Wild ###

Emit a message to X random users except sender. X can be determined by the user. The default value in case it's not provided by user is 5.

* #### Server Event Name ####

 `wild`
 
* #### Data supported #### 

Json as following:
```
{
  "usersNumber":3,// number
  "messsage": "Hello world" // any string
}

```

