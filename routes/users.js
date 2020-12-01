const userRoute=require('express').Router();
const User=require('../models/user');
const bodyparser=require('body-parser');
userRoute.use(bodyparser.json());

//get all users
userRoute.get('/get',pagination(User),(req,res)=>{
   
    res.json(res.paginatedResults)
});

//get users using Geospatial Queries
userRoute.get('/get/geo', async (req, res) => {
   try {
    const users = await User.find({ 'address.location':{
        $geoWithin:
            { $centerSphere: [[req.query.lon, req.query.lat], 5 / 3963.2 ] }
    }});
    res.json(users);

   } catch (error) {
       res.status(400).json(error.message);
   }

})

//get user uso

//create user
userRoute.post('/create',async (req,res)=>{
    const user= new User(req.body);
   try {
       const createedUser = await user.save(user);
       res.status(201).json(createedUser);
   } catch (error) {
       res.status(400).json(error.message);
   }
});


//update user
userRoute.patch('/update/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            res.status(404).json("NO User found with this id")
        }
        res.json(user)
    } catch (error) {
        res.status(400).json(error.message)
    }
})


//delete user
userRoute.delete('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json("NO User found with this id");
        }
        res.json(user);
    } catch (error) {
        res.status(400).json(error.message)
    }
    
});

function pagination (model)  {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
    
        const results = {}
    
        if (endIndex < await model.countDocuments().exec()) {
          results.next = {
            page: page + 1,
            limit: limit
          }
        }
        
        if (startIndex > 0) {
          results.previous = {
            page: page - 1,
            limit: limit
          }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).sort({createdAt:-1}).exec();
            res.paginatedResults = results;
            next();
        } catch (e) {
            res.status(500).json( e.message );
        }
    }
    
}

module.exports=userRoute;
