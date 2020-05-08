# Node.js Test Task

### Project Setup
```
git clone https://github.com/varvar/nlp.git
cd to folder nlp
npm install
npm update
```

### Run
```
npm start
```
Once server started it will be accessible on http://localhost:3000/

### API Reference

#### Perform tokenization process ####

  Run tokenizer process for provided .txt file. Average processing time for 5 MB file is about 10 sec and depends on download speed.

* #### URL ####

  http://localhost:3000/process

* #### Method: #### 
  
  `POST`
  
* #### Data Params #### 

  ```
    {"file":"http://www.gutenberg.org/cache/epub/10/pg10.txt"}

  ```
    Please note, that file property required and not optional

* #### Success Response: #### 
  
  * **Code:** 200 <br />
    **Content:** 
    ```
    {
        "processStatus": "Done",
        "fileName": "pg10.txt",
        "chunksProcessed": 148,
        "state": {
            "totalProcessingTime": "7 sec",
            "fileSize": "4.25 MB",
            "downloadSpeed": "601.7 kB/sec"
        }
    }
    ```
 
* #### Error Response: #### 

  * **Code:** 500 SERVER ERROR <br />
    **Content:** `{ errorObj }`

  OR

  * **Code:** 400 BAD REQUEST <br />
    **Content:** `{ "message": "File value can not be empty!" }`

* #### Notes: #### 

  "fileName" property from response object required for getting the words list in next API call, since it's an identifier for retrieving relevant json data. The rest of properties is for information only.  


#### Get words list and repetitions with sorting options ####

  Returns json data for provided file name with words list and repetitions.

* #### URL ####

  http://localhost:3000/words/{fileName}/{sort}/{order}

  For example: http://localhost:3000/words/pgs10.txt/repetitions/desc

* #### Method: #### 
  
  `GET`
  
* #### URL Params #### 

  **Required:**
 
   `fileName=[string]`
   
   **Optional:**
    
      `sort=[repetitions/word]`
      `order=[asc/desc]`

* #### Success Response: #### 
  
  * **Code:** 200 <br />
    **Content:** 
    ```
    [
      {
        "word": "project",
        "repetitions": 5
      },
      {
        "word": "gutenberg",
        "repetitions": 4
      },
      {
        "word": "ebook",
        "repetitions": 8
      },
      ....
    ]
    ```
 
* #### Error Response: #### 

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```
    {
      "message": {
          "errno": -2,
          "code": "ENOENT",
          "syscall": "open",
          "path": "/nlp/app/controllers/../../files/pgs10.txt.json"
      }
    }

    ``` 
    
#### Pipe words list to client ####

  Serving json data for provided file name via readable stream. This type of serving can increase request speed and performance.

* #### URL ####

  http://localhost:3000/pipe/{fileName}

  For example: http://localhost:3000/pipe/pgs10.txt

* #### Method: #### 
  
  `GET`
  
* #### URL Params #### 

  **Required:**
 
   `fileName=[string]`
   
* #### Success Response: #### 
  
  * **Code:** 200 <br />
    **Content:** 
    ```
    [
      {
        "word": "project",
        "repetitions": 5
      },
      {
        "word": "gutenberg",
        "repetitions": 4
      },
      {
        "word": "ebook",
        "repetitions": 8
      },
      ....
    ]
    ```
 
* #### Error Response: #### 

  * **Code:** 500 SERVER ERROR <br />
    **Content:** 
    ```
    {
      "message": {
          "errno": -2,
          "code": "ENOENT",
          "syscall": "open",
          "path": "/nlp/app/controllers/../../files/pgs10.txt.json"
      }
    }

    ``` 
        
### Test engine

Test engine based on Mocha as testing framework and Chai as assertion manager. There are two types of tests added: unit tests and integration/end to end tests. For current implementation there are no differences between integration and end to end tests.

To run test cases just run "npm test" inside project folder.