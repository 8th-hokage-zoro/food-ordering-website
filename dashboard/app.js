const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');

mongoose.connect('mongodb://0.0.0.0:27017/test',{useNewUrlParser:true,useUnifiedTopology:true});

const restaurantSchema=new mongoose.Schema({
  city:String,
  restaurant:String,
  dishes:Array
});

const Restaurant=mongoose.model('Restaurant',restaurantSchema);

const app=express();

app.set('view engine','ejs');

app.get('/',async(req,res)=>{
  const cities=await Restaurant.distinct('city');
  res.render('index',{cities});
});

app.get('/restaurants/:city',async(req,res)=>{
  const restaurants=await Restaurant.find({city:req.params.city});
  res.render('restaurants',{restaurants});
});

app.get('/dishes/:restaurantId',async(req,res)=>{
  const restaurant=await Restaurant.findById(req.params.restaurantId);
  res.render('dishes',{dishes:restaurant.dishes});
}); 

app.listen(3000,()=>console.log('Server started on port 3000'));
