import mongoose from 'mongoose'
const ProblemSchema=mongoose.Schema({
   name : {type : String ,required : true ,max : 100,trim:true},
   author : {type :String ,required :true ,max : 100,trim : true },
   company : {type :String ,required :true ,max : 100 , trim : true},
   tag : {type : String , required : true , max  : 100},
   difficulty : {type : String , required : true , max  : 100},
   date :{type : Date ,required :true}
});

module.exports = mongoose.model("Problem",ProblemSchema);