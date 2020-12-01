const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const geoSchema = new Schema({
    type: {
        type: String,
        default: "Point"
    },
    coordinates: {
        type: [Number],
        index: "2dsphere"
    }
});
const addressSchema = new Schema({
    street: {
        type: String,
    },
    locality: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: String,
    },
    location:geoSchema
    
});


const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:[true,'mobile number should be unique'],
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    address: addressSchema,
   
},{timestamps:true})


const Users=mongoose.model('Users',userSchema)
module.exports=Users;