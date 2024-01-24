import mongoose from "mongoose";


const DataSchema=new mongoose.Schema({

email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},


facebookData:[],
instagramData:[],


})

const Automata=mongoose.models.auto_data||mongoose.model('auto_data',DataSchema)

export default Automata;