const mongoose = require("mongoose");

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

module.exports = Contest;