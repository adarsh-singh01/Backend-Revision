# Backend Roadmap

### Backend has 2 components 
- prog language-java,js,php,golang,c++
- database-mongo,mysql,popstgres,sqlite

earlier js cant be run standalone but now node,deno,bun made is possible

sbhi prog lang me koi na koi library ya framework use hoti hai
java(springboot),python(django),js(express,mongoose),php(laravel),golang,c++(crow)

framework/library in DB --> ORM,ODM

DB is always in another continent.


## file structure

### src
- index.js (db connects)
- app.js (config,cookie,urlencode)
- constants (enums,db-name)
##### DB
##### Models
##### Controllers
##### Routes
##### Middlewares
##### Utils
##### More



server does not mean it is some big aws computer ...ur laptop ,phone can also be a server .
when we use listen in express ... unlike in frontend after we console.log something the app stops ....it listens to requests

IN MONGODB WHEN U SAVE A MODEL NAME IN DB it becomes plural and in lowercase...ex-User becomes users...mongo is intelligent if u write categories it wont change it.