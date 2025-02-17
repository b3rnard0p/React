import { MongoClient } from "mongodb";

const URI =
  "mongodb+srv://be:Cabo0907050301.@cluster0.xhsz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(URI);

export const db = client.db("Spotify");

//const songColletion = await db.collection("songs").find({}).toArray();

//console.log(songColletion);
