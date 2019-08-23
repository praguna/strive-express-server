import mongoose from 'mongoose'

const ProblemDetailSchema=mongoose.Schema({
    problem : {type : mongoose.Schema.Types.ObjectId, ref : 'Problem' ,required :true},
    description : {type :String ,required : true, trim : true},
    background : {type :String ,required : true, trim : true},
    attempts : {type : Number , default: 0},
    solution: {type:String,requited:true, trim : true},
    input : {type : String ,required : true,trim : true},
    output : {type : String , requited : true, trim : true},
    success : {type : Number ,default: 0}
 });


module.exports=mongoose.model("ProblemDetail",ProblemDetailSchema);