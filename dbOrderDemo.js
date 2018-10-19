
var fs = require('fs');
var http = require('http');
var url = require('url');
var ObjectId = require('mongodb').ObjectID;
var ROOT_DIR = "static/";
var MongoClient = require('mongodb').MongoClient;
var db,menu;
var dbURL="mongodb://pizza1:pizza1@localhost:27017/pizzadb"
var server=http.createServer(function (req, res) {
   var urlObj = url.parse(req.url, true, false);
  console.log(urlObj.pathname)
  if(req.method=="GET")
  	if(urlObj.pathname=="/menu"){
      var query={price:{$gt:8.00}}
      findMenuItems(res,query)
  	}
    else if(urlObj.pathname=="/orders"){
      var query={}
      findOrderItems(res,query)
    }
  	else{
  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
  if (err) {
    res.writeHead(404);
    res.end("<h1>Page does not exist!</h1>");
    return;
  }
  res.writeHead(200);
  res.end(data);
})
}
if(req.method="POST")
  if(urlObj.pathname=="/sendOrder"){
    var dataFromClient=''
    req.on('data',function(chunk){
      dataFromClient+=chunk;
      console.log(dataFromClient)
    })
    req.on('end', function(){
      res.writeHead(200);
      res.end("Thank you for Order!")
    })

  }//end sendOrder
  if(urlObj.pathname=="/saveOrders"){
    var dataFromClient=''
    req.on('data',function(chunk){
      dataFromClient+=chunk;
      console.log(dataFromClient)
    })
    req.on('end', function(){
      updateOrders(res,dataFromClient)
      res.writeHead(200);
      res.end("Thank you for Order!")
    })

  }//end sendOrder
})
// Initialize connection once
MongoClient.connect(dbURL, 
					function(err, database) {
  if(err) throw err;

  db=database.db("pizzadb")
  
  // Start the application after the database connection is ready
  server.listen(8000);
  console.log("Listening on port 8000");
});

function findMenuItems(res,query)
{
 
  db.collection("menu").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })
}
  function findOrderItems(res,query)
{

  db.collection("orders").find(query).toArray(function (err,results) {
 
    console.log(results)
    
    res.writeHead(200);
    res.end(JSON.stringify(results))
  })
}

  function updateOrders(res,strOrders)
  {
    orders=JSON.parse(strOrders)
    for(i in orders)
    {
      console.log(i+"...........")
      console.log(orders[i])
      var query={_id:ObjectId(orders[i]._id)}
      var newValue={$set:{quantity:parseInt(orders[i].quantity)}}
      console.log("query"+query._id+"value:"+newValue["$set"])
      
      db.collection("orders").update(query,newValue,function(err,res){
        if(err) throw err
          else
          {
            console.log(res.result.nModified + " document(s) updated");
            console.log('OK!')
          }
          
      })
    }
    res.writeHead(200);
    res.end("OK")
  }

  //    res.writeHead(200);
  // res.end(results);
 



