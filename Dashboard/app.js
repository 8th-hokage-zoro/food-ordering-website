// const express = require('express');
// const mongoose = require('mongoose');
// const ejs = require('ejs');

// mongoose.connect('mongodb://0.0.0.0:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

// const restaurantSchema = new mongoose.Schema({
//   city: String,
//   restaurants: [
//     {
//       name: String,
//       dishes: [
//         {
//           name: String,
//           rating: Number,
//           ingredients: [String],
//           picture: String,
//           cost: Number
//         }
//       ]
//     }
//   ]
// });
// const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// const app = express();

// app.set('view engine', 'ejs');

// app.get('/', async (req, res) => {
//   const cities = await Restaurant.distinct('city');
//   res.render('index', { cities });
// });

// app.get('/restaurants/:city', async (req, res) => {
//   const cityData = await Restaurant.findOne({ city: req.params.city });
//   res.render('restaurants', { restaurants: cityData.restaurants });
// });

// app.get('/dishes/:restaurantId',async(req,res)=>{
//   const restaurant=await Restaurant.findById(req.params.restaurantId);
//   res.render('dishes',{dishes:restaurant.dishes});
// }); 

// app.listen(3000,()=> console.log('Server started on port 3000'));
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://0.0.0.0:27017/test',{useNewUrlParser:true,useUnifiedTopology:true});

const restaurantSchema=new mongoose.Schema({
    city:String,
    restaurants:[{
        name:String,
        dishes:[{
            name:String,
            rating:Number,
            ingredients:[String],
            picture:String,
            cost:Number
        }]
    }]
});

const Restaurant=mongoose.model('Restaurant',restaurantSchema);

app.get('/',async(req,res)=>{
    try{
        const restaurants=await Restaurant.find({});
        res.render('index',{restaurants:restaurants});
    }catch(err){
        console.log(err);
    }
});

app.get('/restaurants/:city',async(req,res)=>{
    const city=req.params.city;
    try{
        const foundCity=await Restaurant.findOne({city:city});
        res.render('restaurants',{city:foundCity});
    }catch(err){
        console.log(err);
    }
});

app.get('/dishes/:city/:restaurant',async(req,res)=>{
    const city=req.params.city;
    const restaurantName=req.params.restaurant;
    try{
        const foundCity=await Restaurant.findOne({city:city});
        const restaurant=foundCity.restaurants.find(r=>r.name===restaurantName);
        res.render('dishes',{restaurant:restaurant});
    }catch(err){
        console.log(err);
    }
});

app.listen(3000,()=>{
    console.log('Server started on port 3000');
});
