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

    // Select the database
    const db = client.db('exp5');  

    // ****** TUTORIAL p1 **************************

    const response = await db.collection('inventory').insertOne({
        item: 'canvas',
        qty: 100,
        tags: ['cotton'],
        size: { h: 28, w: 35.5, uom: 'cm' }
    });
    console.log("Response? : ", response);
    divider();


    let res = await db.collection('inventory').find({ item: 'canvas' }).toArray();
    console.log('Found:', res);
    divider();


    await db.collection('inventory').insertMany([
        {
          item: 'journal',
          qty: 25,
          tags: ['blank', 'red'],
          size: { h: 14, w: 21, uom: 'cm' }
        },
        {
          item: 'mat',
          qty: 85,
          tags: ['gray'],
          size: { h: 27.9, w: 35.5, uom: 'cm' }
        },
        {
          item: 'mousepad',
          qty: 25,
          tags: ['gel', 'blue'],
          size: { h: 19, w: 22.85, uom: 'cm' }
        }
      ]);

    res = await db.collection('inventory').find({}).toArray();
    console.log("All Contents: ",res);
    divider();

    await db.collection('inventory').deleteMany({})


    // ********* TUTORIAL P2 **********
    await db.collection('inventory').insertMany([
        {
          item: 'journal',
          qty: 25,
          size: { h: 14, w: 21, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'notebook',
          qty: 50,
          size: { h: 8.5, w: 11, uom: 'in' },
          status: 'A'
        },
        {
          item: 'paper',
          qty: 100,
          size: { h: 8.5, w: 11, uom: 'in' },
          status: 'D'
        },
        {
          item: 'planner',
          qty: 75,
          size: { h: 22.85, w: 30, uom: 'cm' },
          status: 'D'
        },
        {
          item: 'postcard',
          qty: 45,
          size: { h: 10, w: 15.25, uom: 'cm' },
          status: 'A'
        }
    ]);

    const cursor1 = await db.collection('inventory').find({}).toArray();
    console.log("Result all: ", cursor1);
    divider();

    const cursor2 = await db.collection('inventory').find({ status: 'D' }).toArray();
    console.log("Result B:", cursor2);
    divider();

    const cursor3 = await db.collection('inventory').find({
        status: { $in: ['A', 'D'] }
      }).toArray();
    console.log("Result C:", cursor3);
    divider();

    const cursor4 = await db.collection('inventory').find({
        status: 'A',
        qty: { $lt: 30 }
      }).toArray();
    console.log("Result D:", cursor4);
    divider();

    await db.collection('inventory').deleteMany({})


    // ********** TUTORIAL P3  **************

    await db.collection('inventory').insertMany([
        {
          item: 'canvas',
          qty: 100,
          size: { h: 28, w: 35.5, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'journal',
          qty: 25,
          size: { h: 14, w: 21, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'mat',
          qty: 85,
          size: { h: 27.9, w: 35.5, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'mousepad',
          qty: 25,
          size: { h: 19, w: 22.85, uom: 'cm' },
          status: 'P'
        },
        {
          item: 'notebook',
          qty: 50,
          size: { h: 8.5, w: 11, uom: 'in' },
          status: 'P'
        },
        {
          item: 'paper',
          qty: 100,
          size: { h: 8.5, w: 11, uom: 'in' },
          status: 'D'
        },
        {
          item: 'planner',
          qty: 75,
          size: { h: 22.85, w: 30, uom: 'cm' },
          status: 'D'
        },
        {
          item: 'postcard',
          qty: 45,
          size: { h: 10, w: 15.25, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'sketchbook',
          qty: 80,
          size: { h: 14, w: 21, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'sketch pad',
          qty: 95,
          size: { h: 22.85, w: 30.5, uom: 'cm' },
          status: 'A'
        }
      ]);

    const res1 = await db.collection('inventory').find({item: 'paper'}).toArray();
    console.log("Paper before:", res1);
    divider();

    await db.collection('inventory').updateOne(
      { item: 'paper' },
      {
        $set: { 'size.uom': 'cm', status: 'P' },
        $currentDate: { lastModified: true }
      }
    );

    const res2 = await db.collection('inventory').find({item: 'paper'}).toArray();
    console.log("Paper after:", res2);
    divider();

    const res3 = await db.collection('inventory').find( { qty: { $lt: 50 } }).toArray();
    console.log("Items before:", res3);
    divider();

    await db.collection('inventory').updateMany(
        { qty: { $lt: 50 } },
        {
          $set: { 'size.uom': 'in', status: 'P' },
          $currentDate: { lastModified: true }
        }
      );

    const res4 = await db.collection('inventory').find( { qty: { $lt: 50 } }).toArray();
    console.log("Items after:", res4);
    divider(); 

    await db.collection('inventory').replaceOne(
        { item: 'paper' },
        {
          item: 'paper',
          instock: [
            { warehouse: 'A', qty: 60 },
            { warehouse: 'B', qty: 40 }
          ]
        }
      );

    const res5 = await db.collection('inventory').find({item: 'paper'}).toArray();
    console.log("Paper after replacement:", res5);
    divider();
  

    await db.collection('inventory').deleteMany({});

    // ************ TUTORIAL P4 **************
    divider();

    await db.collection('inventory').insertMany([
        {
          item: 'journal',
          qty: 25,
          size: { h: 14, w: 21, uom: 'cm' },
          status: 'A'
        },
        {
          item: 'notebook',
          qty: 50,
          size: { h: 8.5, w: 11, uom: 'in' },
          status: 'P'
        },
        {
          item: 'paper',
          qty: 100,
          size: { h: 8.5, w: 11, uom: 'in' },
          status: 'D'
        },
        {
          item: 'planner',
          qty: 75,
          size: { h: 22.85, w: 30, uom: 'cm' },
          status: 'D'
        },
        {
          item: 'postcard',
          qty: 45,
          size: { h: 10, w: 15.25, uom: 'cm' },
          status: 'A'
        }
      ]);

      await db.collection('inventory').deleteMany({ status: 'A' });
      await db.collection('inventory').deleteOne({ status: 'D' });

    const afterDelete = await db.collection('inventory').find({}).toArray();
    console.log("DB after deleting--\nAll with status: A\nOne with status D\nResult:", afterDelete);
    divider();
    
    
    await db.collection('inventory').deleteMany({});

    // ***************** TUTORIAL P5 ***************

    await db.collection('pizzas').insertMany( [
        { _id: 0, type: "pepperoni", size: "small", price: 4 },
        { _id: 1, type: "cheese", size: "medium", price: 7 },
        { _id: 2, type: "vegan", size: "large", price: 8 }
     ] )

    await db.collection('pizzas').bulkWrite( [
        { insertOne: { document: { _id: 3, type: "beef", size: "medium", price: 6 } } },
        { insertOne: { document: { _id: 4, type: "sausage", size: "large", price: 10 } } },
        { updateOne: {
           filter: { type: "cheese" },
           update: { $set: { price: 8 } }
        } },
        { deleteOne: { filter: { type: "pepperoni"} } },
        { replaceOne: {
           filter: { type: "vegan" },
           replacement: { type: "tofu", size: "small", price: 4 }
        } }
     ] )

    const afterWrite = await db.collection('pizzas').find({}).toArray();
    console.log("Afer bulk write: ", afterWrite );
    divider();

    await db.collection('pizzas').deleteMany({});


  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the main function
main().catch(console.error);
