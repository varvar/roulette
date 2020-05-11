# Message Roulette

### Project Setup
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

  http://{app-url}/api/users/register

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
 
* #### Error Response: #### 

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{ errorObj }`

  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "message": "Validation error" }`

* #### Notes: #### 

  Email address is unique property and cannot be added twice.  


#### Login User ####

* #### URL ####

  http://{app-url}/api/users/login

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
 
* #### Error Response: #### 

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "message": "Email and password does not match" }`

* #### Notes: #### 

  Token returned in login response is JWT token and should be used for authentication in socket.io API  


