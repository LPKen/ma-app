require("dotenv").config()

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
app.use(cors(
    {
        origin: ["exp://u.expo.dev/update/047c1a96-8a23-494f-a428-32adeee7d980","exp://u.expo.dev/update/8fc542c3-9dce-4549-b83f-1364dc1f0eb7"],
        methods: ["POST","GET","PUT","DELETE"],
        credentials: true
    }
));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

mongoose.connect(
    process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log("blub");
}).catch((error) => {
    console.log(error,"kei blub");
})

app.listen(port, () => {
    console.log("blub",port)
});

const User = require("./models/user");
const Message = require("./models/message");
const Semester = require("./models/semester");
const Info = require("./models/info");
const Subject = require("./models/subject");
const Grade = require("./models/grade");
const Group = require("./models/group");


//POSTS


//endpoint for registration of the user
app.post("/register", async (req,res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    const {name,email,pfp} = req.body;

    if (!email) return res.status(405).json({message:"Email is required"});

    if(email.length>254) return res.status(406).json({message:"Email too long"});

    var valid = emailRegex.test(email);
    if(!valid) return res.status(407).json({message:"Not a real email"});

    //create a new user object
    const newUser = new User({name,email,password: hashedPassword,pfp});
    //save the user in mongodb
    newUser.save().then(() => {
        res.status(200).json({message:"User hat blub gemacht"})
    }).catch((error) => {
        console.log("Es gab ein böses blub: ",error);
        res.status(500).json({message:"Böses blub im Registrieren"})
    })
})

//endpoint for the login
app.post('/login', async (req,res) => {
    const {email,password} = req.body;
    //check if the email and password are provided
    if(!email || !password) {
        return res.status(405).json({message:"Email and password are required"})
    }
    //check if the email and password are valid
    const user = await User.findOne({email})
    try {
        if(!user){
            //user not found
            return res.status(406).json({message:"User not found"})
        }
        //compare the provided data with the database data
        if(!await bcrypt.compare(req.body.password, user.password)){
            return res.status(407).json({message: "Invalid password"})
        }
        const accessToken = createToken(user._id);
        res.status(200).json({accessToken});
    } catch (error) {
        console.log("error in finding the user",error);
        res.status(500).json({message: "Internal server error"})
    }
});

//function to create token for the user

const createToken = (userId) => {
    //Set the payload
    const payload = {
        userId: userId,
    };
    //Generate the token with key and expiration time
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30d'})
    
    return accessToken;
}


//endpoint to create a new semester
app.post("/semesters", (req,res) => {
    const {name,subjects,average,pluspoints,owner} = req.body;
    //create a new user object
    const newSemester = new Semester({name,subjects,average,pluspoints,owner});
    //save the user in mongodb
    newSemester.save().then(() => {
        res.status(200).json({message:"User hat blub gemacht"})
    }).catch((error) => {
        console.log("Es gab ein böses blub: ",error);
        res.status(500).json({message:"Böses blub im Registrieren"})
    })
})

//endpoint to create a new subject
app.post("/subjects", (req,res) => {
    const {name,tests,pluspoints,average,weight,semester_id} = req.body;
    //create a new user object
    const newSubject = new Subject({name,tests,pluspoints,average,weight,semester_id});
    //save the user in mongodb
    newSubject.save().then(() => {
        res.status(200).json({message:"User hat blub gemacht"})
    }).catch((error) => {
        console.log("Es gab ein böses blub: ",error);
        res.status(500).json({message:"Böses blub im Registrieren"})
    })
})

//endpoint to create a new subject
app.post("/grades", (req,res) => {
    const {name,grade,weight,days,hours,methods,tips,subject_id} = req.body;
    //create a new user object
    const newGrade = new Grade({name,grade,weight,days,hours,methods,tips,subject_id});
    //save the user in mongodb
    newGrade.save().then(() => {
        res.status(200).json({message:"User hat blub gemacht"})
    }).catch((error) => {
        console.log("Es gab ein böses blub: ",error);
        res.status(500).json({message:"Böses blub im Registrieren"})
    })
})

//endpoint to create a new group
app.post("/groups", (req,res) => {
    const {name,members,admin,requests,pfp} = req.body;
    //create a new user object
    const newGroup = new Group({name,members,admin,requests,pfp});
    //save the user in mongodb
    newGroup.save().then(() => {
        res.status(200).json({message:"User hat blub gemacht"})
    }).catch((error) => {
        console.log("Es gab ein böses blub: ",error);
        res.status(500).json({message:"Böses blub im Registrieren"})
    })
})


//endpoint to send a request to a user

app.post("/friend-request",async(req,res) => {
    const {currentUserId,selectedUserId} = req.body;

    try{
        //update the recepient's requests array
        await User.findByIdAndUpdate(selectedUserId,{
            $push:{friendRequests: currentUserId}
        })
        //update the sender's send requests array
        await User.findByIdAndUpdate(currentUserId,{
            $push:{sentFriendRequests: selectedUserId}
        })
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    }
})




//PUTS

//endpoint to update a subject in pa
app.put('/subjects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.average !== undefined) {
        updateFields.average = updatedData.average;
      }
      if (updatedData.pluspoints !== undefined) {
        updateFields.pluspoints = updatedData.pluspoints;
      }
  
      const result = await Subject.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  //endpoint to share or not to share
app.put('/sharesubjects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Create an object with the fields you want to update
    const updateFields = {};
    if (updatedData.shared !== undefined) {
      updateFields.shared = updatedData.shared;
    }

    const result = await Subject.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Use $set to update specific fields
      { new: true } // To return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully', updatedData: result });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//endpoint to update a semester in pa
  app.put('/semester/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.average !== undefined) {
        updateFields.average = updatedData.average;
      }
      if (updatedData.pluspoints !== undefined) {
        updateFields.pluspoints = updatedData.pluspoints;
      }
  
      const result = await Semester.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//endpoint to add a request

app.post("/groups/:id",async(req,res) => {
    const groupId = req.params.id;
    const currentUserId = req.body.user_id;
    console.log(req.body.user_id,"wird zu den Anfragen von",groupId,"hinzugefügt.");
    try{
        //update the recepient's requests array
        await Group.findByIdAndUpdate(groupId,{
            $push:{requests: currentUserId}
        })
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    }
})

//add a request to the group
app.post("/groups/accept/:id",async(req,res) => {
    const groupId = req.params.id;
    const currentUserId = req.body.user_id;
    console.log(req.body.user_id,"wird zu",groupId,"hinzugefügt.");
    try{
        //update the recepient's requests array
        await Group.findByIdAndUpdate(groupId,{
            $pull:{requests: currentUserId},
            $push:{members: currentUserId}
        })
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    }
})

//reject someone 😔
app.post("/groups/reject/:id",async(req,res) => {
    const groupId = req.params.id;
    const currentUserId = req.body.user_id;
    console.log(req.body.user_id,"wird nicht zu",groupId,"hinzugefügt.");
    try{
        //update the recepient's requests array
        await Group.findByIdAndUpdate(groupId,{
            $pull:{requests: currentUserId},
        })
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    }
})

//leave 😔
app.post("/groups/leave/:id",async(req,res) => {
    const groupId = req.params.id;
    console.log(req.params,"jfds")
    const currentUserId = req.body.user_id;
    console.log(req.body.user_id,"verlässt",groupId);
    try{
        //update the recepient's requests array
        await Group.findByIdAndUpdate(groupId,{
            $pull:{members: currentUserId},
        })
        res.sendStatus(200);
    } catch(error) {
        res.sendStatus(500);
    }
})


//endpoint to update a semester in pa
app.put('/semester/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.average !== undefined) {
        updateFields.average = updatedData.average;
      }
      if (updatedData.pluspoints !== undefined) {
        updateFields.pluspoints = updatedData.pluspoints;
      }
  
      const result = await Semester.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//endpoint to update a semester after edit
app.put('/semesters/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.name !== undefined) {
        updateFields.name = updatedData.name;
      }
  
      const result = await Semester.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//endpoint to update a semester after edit
app.put('/subject/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.name !== undefined) {
        updateFields.name = updatedData.name;
      }
      if (updatedData.weight !== undefined) {
        updateFields.weight = updatedData.weight;
      }
  
      const result = await Subject.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//endpoint to update user after edit  
  app.put('/user/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.name !== undefined) {
        updateFields.name = updatedData.name;
      }
      if (updatedData.pfp !== undefined) {
        updateFields.pfp = updatedData.pfp;
      }
  
      const result = await User.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//endpoint to chang password after edit  
app.put('/password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (updatedData.password != updatedData.confirm) {
      return res.status(405).json({ message: 'password could not be confirmed' });
    }

    // Create an object with the fields you want to update
    const updateFields = {};
    if (updatedData.password !== undefined) {
      updateFields.password = await bcrypt.hash(updatedData.password, 10);
    }


    const result = await User.findByIdAndUpdate(
      id,
      { $set: updateFields }, // Use $set to update specific fields
      { new: true } // To return the updated document
    );

    if (!result) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully', updatedData: result });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//endpoint to update a group after edit
app.put('/groups/edit/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      // Create an object with the fields you want to update
      const updateFields = {};
      if (updatedData.name !== undefined) {
        updateFields.name = updatedData.name;
      }
      if (updatedData.pfp !== undefined) {
        updateFields.pfp = updatedData.pfp;
      }
  
      const result = await Group.findByIdAndUpdate(
        id,
        { $set: updateFields }, // Use $set to update specific fields
        { new: true } // To return the updated document
      );
  
      if (!result) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//change admin when someone leaves
app.put("/groups/newAdmin/:id",async(req,res) => {
    try{
        // Create an object with the fields you want to update
        const groupId = req.params.id;
        const updatedData = req.body;

        const updateFields = {};
        if (updatedData.admin !== undefined) {
            updateFields.admin = updatedData.admin;
        }
        console.log("mmmmmmmmmmmm",updateFields, req.params);
    
        const result = await Group.findByIdAndUpdate(
            groupId,
            { $set: updateFields }, // Use $set to update specific fields
            { new: true } // To return the updated document
        );
    
        if (!result) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

//change settings
app.put("/settings/:id",async(req,res) => {
    try{
        // Create an object with the fields you want to update
        const { id } = req.params;
        const updatedData = req.body;

        const updateFields = {};
        if (updatedData.propWeight !== undefined) {
            updateFields.propWeight = updatedData.propWeight;
        }
        if (updatedData.shareGrades !== undefined) {
            updateFields.shareGrades = updatedData.shareGrades;
        }
    
        const result = await User.findByIdAndUpdate(
            id,
            { $set: updateFields }, // Use $set to update specific fields
            { new: true } // To return the updated document
        );
    
        if (!result) {
            return res.status(404).json({ message: 'Document not found' });
        }
    
        res.json({ message: 'Document updated successfully', updatedData: result });
    } catch (error) {
      console.error('Error updating document:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})


//DELETES

//endpoint to delete a semester
app.delete('/semesters/:semesterId', (req, res) => {
    const semesterId = req.params.semesterId;
    const query = {_id: semesterId};
    Semester.deleteMany(query).then((semesters) => {
        res.status(200).json(semesters)
    }).catch((error) => {
        console.log("Error deleting semesters", error);
        res.status(500).json({message:"Error deleting semesters"})
    })
  });

  //endpoint to delete a subject of a semester
  app.delete('/subjects/:semesterId', (req, res) => {
    const semesterId = req.params.semesterId;
    const query = {semester_id: semesterId};
    Subject.deleteMany(query).then((subjects) => {
        res.status(200).json(subjects)
    }).catch((error) => {
        console.log("Error deleting subjects", error);
        res.status(500).json({message:"Error deleting subjects"})
    })
  });

    //endpoint to delete a subject of a semester
    app.delete('/deletesubjects/:id', (req, res) => {
        const id = req.params.id;
        const query = {_id: id};
        Subject.deleteMany(query).then((subjects) => {
            res.status(200).json(subjects)
        }).catch((error) => {
            console.log("Error deleting subjects", error);
            res.status(500).json({message:"Error deleting subjects"})
        })
      });

  app.delete('/grades/:subjectId', (req, res) => {
    const subjectId = req.params.subjectId;
    const query = {subject_id: subjectId};
    Grade.deleteMany(query).then((grades) => {
        res.status(200).json(grades)
    }).catch((error) => {
        console.log("Error deleting grades", error);
        res.status(500).json({message:"Error deleting grades"})
    })
  });

  app.delete('/deletegrades/:id', (req, res) => {
    const id = req.params.id;
    const query = {_id: id};
    Grade.deleteMany(query).then((grades) => {
        res.status(200).json(grades)
    }).catch((error) => {
        console.log("Error deleting grades", error);
        res.status(500).json({message:"Error deleting grades"})
    })
  });


  //endpoint to delete a group
  app.delete('/groups/:id', (req, res) => {
    const id = req.params.id;
    const query = {_id: id};
    Group.deleteMany(query).then((group) => {
        res.status(200).json(group)
    }).catch((error) => {
        console.log("Error deleting group", error);
        res.status(500).json({message:"Error deleting group"})
    })
  });



//GETS

//endpoint to access all the other users
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
    console.log(loggedInUserId);
    
    User.findOne({_id: loggedInUserId}).then((users) => {
        return res.status(200).json(users)
    }).catch((error) => {
        console.log("Error retrieving users", error);
        return res.status(500).json({message:"Error retrieving users"})
    })
});


//endpoint to access the semesters
app.get("/semesters/:userId", (req, res) => {
    const uId = req.params.userId;

    Semester.find({owner: uId}).then((semesters) => {
        res.status(200).json(semesters)
    }).catch((error) => {
        console.log("Error accessing semesters", error);
        res.status(500).json({message:"Error accessing semesters"})
    })
})

//endpoint to access a semester for edit
app.get("/editsemester/:id", (req, res) => {
    const id = req.params.id;

    Semester.find({_id: id}).then((semesters) => {
        res.status(200).json(semesters)
    }).catch((error) => {
        console.log("Error accessing semesters", error);
        res.status(500).json({message:"Error accessing semesters"})
    })
})

//endpoint to access the subjects
app.get("/subjects/:semester", (req, res) => {
    let SemesterName = req.params.semester;
    console.log("sname:",SemesterName);
    Subject.find({semester_id: SemesterName}).then((subjects) => {
        res.status(200).json(subjects)
    }).catch((error) => {
        console.log("Error accessing subjects", error);
        res.status(500).json({message:"Error accessing subjects"})
    })
})

//endpoint to access a subject for edit
app.get("/editsubject/:id", (req, res) => {
    const id = req.params.id;

    Subject.find({_id: id}).then((subjects) => {
        res.status(200).json(subjects)
    }).catch((error) => {
        console.log("Error accessing subjects", error);
        res.status(500).json({message:"Error accessing subjects"})
    })
})

//endpoint to access the grades
app.get("/grades/:subject", (req, res) => {
    let SubjectName = req.params.subject;
    console.log("fdsafdfdsafd",req.params);
    Grade.find({subject_id: SubjectName}).then((grades) => {
        res.status(200).json(grades)
    }).catch((error) => {
        console.log("Error accessssing grades", error);
        res.status(500).json({message:"Error accessing gradess"})
    })
})

//endpoint to access the groups for the user
app.get("/groups/:userId", (req, res) => {
    const uId = req.params.userId;
    Group.find({members: uId}).then((groups) => {
        res.status(200).json(groups)
    }).catch((error) => {
        console.log("Error accessing groups", error);
        res.status(500).json({message:"Error accessssing groups"})
    })
})

//endpoint to access the groups for the admin
app.get("/groups/admin/:userId", (req, res) => {
    const adminId = req.params.userId;
    Group.find({admin: adminId}).then((groups) => {
        res.status(200).json(groups)
    }).catch((error) => {
        console.log("Error accessing groups", error);
        res.status(500).json({message:"Error accessing groups"})
    })
})

//endpoint to access the admin of a group
app.get("/groups/gadmin/:groupId", (req, res) => {
    const groupId = req.params.groupId;
    Group.find({_id: groupId}).then((groups) => {
        res.status(200).json(groups)
    }).catch((error) => {
        console.log("Error accessing groups", error);
        res.status(500).json({message:"Error accessing groups"})
    })
})

//endpoint to access the groups for search
app.get("/groups/search/:userId", (req, res) => {
    const uId = req.params.userId;
    Group.find({$and: [
        {members: {$ne: uId}},
        {requests: {$ne: uId}}
    ]}).then((groups) => {
        res.status(200).json(groups)
    }).catch((error) => {
        console.log("Error accessing groups", error);
        res.status(500).json({message:"Error accessing groups"})
    })
})

//endpoint to access the users of a group
app.get("/groups/users/:groupId", (req, res) => {
    const gId = req.params.groupId;
    Group.find({_id: gId}).then((groups) => {
        res.status(200).json(groups)
    }).catch((error) => {
        console.log("Error accessing groups", error);
        res.status(500).json({message:"Error accessing groups"})
    })
})

//endpoint to access articles
app.get("/infos/", (req, res) => {
    Info.find({}).then((info) => {
        res.status(200).json(info)
    }).catch((error) => {
        console.log("Error accessing information", error);
        res.status(500).json({message:"Error accessing information"})
    })
})

app.get("/infos/:article", (req, res) => {
    const articleId = req.params
    Info.find({_id: articleId}).then((info) => {
        res.status(200).json(info)
    }).catch((error) => {
        console.log("Error accessing information", error);
        res.status(500).json({message:"Error accessing information"})
    })
})

app.get("/", (req, res) => {
  res.send("Hello world!");
})

