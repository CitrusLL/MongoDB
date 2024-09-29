const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 

const client = new MongoClient(uri);

function divider(){
    console.log("***********************************");
}

async function main() {
  try {
    
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('exp5');  
    const orders = db.collection('orders'); 

    await db.collection('orders').deleteMany({})
    await db.collection('map_reduce_example').deleteMany({})
    await db.collection('agg_alternative_1').deleteMany({})
  
    await orders.insertMany([
      { _id: 1, cust_id: "Ant O. Knee", ord_date: new Date("2020-03-01"), price: 25, items: [ { sku: "oranges", qty: 5, price: 2.5 }, { sku: "apples", qty: 5, price: 2.5 } ], status: "A" },
      { _id: 2, cust_id: "Ant O. Knee", ord_date: new Date("2020-03-08"), price: 70, items: [ { sku: "oranges", qty: 8, price: 2.5 }, { sku: "chocolates", qty: 5, price: 10 } ], status: "A" },
      { _id: 3, cust_id: "Busby Bee", ord_date: new Date("2020-03-08"), price: 50, items: [ { sku: "oranges", qty: 10, price: 2.5 }, { sku: "pears", qty: 10, price: 2.5 } ], status: "A" },
      { _id: 4, cust_id: "Busby Bee", ord_date: new Date("2020-03-18"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
      { _id: 5, cust_id: "Busby Bee", ord_date: new Date("2020-03-19"), price: 50, items: [ { sku: "chocolates", qty: 5, price: 10 } ], status: "A"},
      { _id: 6, cust_id: "Cam Elot", ord_date: new Date("2020-03-19"), price: 35, items: [ { sku: "carrots", qty: 10, price: 1.0 }, { sku: "apples", qty: 10, price: 2.5 } ], status: "A" },
      { _id: 7, cust_id: "Cam Elot", ord_date: new Date("2020-03-20"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
      { _id: 8, cust_id: "Don Quis", ord_date: new Date("2020-03-20"), price: 75, items: [ { sku: "chocolates", qty: 5, price: 10 }, { sku: "apples", qty: 10, price: 2.5 } ], status: "A" },
      { _id: 9, cust_id: "Don Quis", ord_date: new Date("2020-03-20"), price: 55, items: [ { sku: "carrots", qty: 5, price: 1.0 }, { sku: "apples", qty: 10, price: 2.5 }, { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
      { _id: 10, cust_id: "Don Quis", ord_date: new Date("2020-03-23"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" }
   ]);


  const awns = await orders.aggregate([
      { $group: { _id: "$cust_id", value: { $sum: "$price" } } },
      { $out: "agg_alternative_1" }
  ]).toArray();
  //console.log(awns);

  const bf_agg = await orders.find({}).toArray();
  const agg_out = await db.collection('agg_alternative_1').find().sort( { _id: 1 } ).toArray();
  //console.log(bf_agg);
  console.log(agg_out);

  // p2

  await orders.aggregate( [
    { $match: { ord_date: { $gte: new Date("2020-03-01") } } },
    { $unwind: "$items" },
    { $group: { _id: "$items.sku", qty: { $sum: "$items.qty" }, orders_ids: { $addToSet: "$_id" } }  },
    { $project: { value: { count: { $size: "$orders_ids" }, qty: "$qty", avg: { $divide: [ "$qty", { $size: "$orders_ids" } ] } } } },
    { $merge: { into: "agg_alternative_3", on: "_id", whenMatched: "replace",  whenNotMatched: "insert" } }
 ] ).toArray();

  const out2 = await db.collection("agg_alternative_3").find().sort( { _id: 1 } ).toArray();
  console.log(out2);

  // my operation
  await orders.aggregate([
    {$unwind: "$items"},
    {$group: {  _id: "$cust_id", items: { $addToSet: "$items.sku" }}},
    {$out: "my_result"}
  ]).toArray();

  const res1 = await db.collection('my_result').find({}).toArray();
  divider();
  console.log("My result:\n",res1);


  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the main function
main().catch(console.error);
