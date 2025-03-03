import mongoose from "mongoose";

const contestSchema= new mongoose.Schema({
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
  },
  problems:[
    {
      contestId: {type: String},
      index: {type: String}
    }
  ],
  duration:{
    type: Number
  },
  
  registrations:[
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String
      },
      problemsSolved:[
        {
          contestId: {type: String},
          index: {type: String}
        }
      ],
      penalty:{
        type: Number
      }
    }
  ]
},
{
  timstamps: true,
})

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;