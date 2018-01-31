(WIP) Typescript definitions for the [sails.js](https://github.com/balderdashy/sails) web framework. 


**Overview:** 

sails.js is a node.js mvc web framework. The two main pieces of a sails app are the Models, and Controllers. The views can be interchanged between multiple view engines. They aren't sails specific so don't require any type mappings.

**Requirements:**

Requires the express,bluebird, and socket.io type mappings. Eventually, we'll merge this with definitely typed and use tsd, but for now, just install everything manually.


**Controllers:**

Each controller action is passed two parameters,an express request object, and an express response object. The request and response objects have been extended by the sails framework to add custom functionality. The main controller type definitions are for the extensions to the request and response objects.



**Models:**

A sails Model is a static class with methods like create, update, and find which correspond to operations on the database. These operations return Records.

Records: A record corresponds to a single row in the database.





**Usage:**

todo


**Mappings:**

todo, check the code
