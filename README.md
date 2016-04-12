# [kobepeng's site](new.kobepeng.com)
a light weight blog based on nodejs&&mongodb. this blog mainly built for myself.
if you curious about how to build this. you can go there:  
https://github.com/nswbmw/N-blog.git

##  navigation	

*   [dependency](#dependency)
*	[install](#install)
*	[features](#features)
*	[config](#config)
*	[ToDo](#ToDo)
*	[Protocol](#Protocol)


## dependency
*   nodejs
*   mongodb
*   redis(to do)

## features
i use these framework or Midware you may concern:
1. express
2. ejs
3. multer
4. webpack(doing)
5. socket.io(to do)
how it looks? just click it:  
http://new.kobepeng.com

## install
```
git clone https://github.com/pengkobe/my_blog.git
cd my_blog
npm install
cd server
node  www
```

## config
edit settings.js at /blogroot/server  
mine for example:
```
module.exports = { 
   cookieSecret: 'myblog', 
   db: 'blog', 
   host: 'localhost',
   port: 27017,
   dbUrl:'mongodb://localhost/blog'
}; 

```


## ToDo
*	movie comments page
*	finish thoughts record page 
*	finish labroom page
*   a chatting room
*   build with webpack
*   test case

           
## Protocol

Released under the MIT Licenses