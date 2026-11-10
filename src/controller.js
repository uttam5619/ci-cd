import User from "./model.js"

export const createUser = async (req, res)=>{
    const {name, email} = req.body()
    if(!name || !email){
        return res.status(400).json({
            "status":"success",
            "message":"name and email are mandatory"
        })
    }

    const user = await User.insertOne({
        name:name,
        email:email
    })

    return res.status(201).json({
        status:"success",
        "data":user
    })
}


export const updateUser = async (req,res)=>{

    const { id } = req.params

    const { name, email, phone } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true, runValidators: true }
    )

    if (!updatedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      }
    })

}


export const getUser = async ()=>{
    const {id} = req.params

    const fetchedUser = await User.findById(id)

    if (!fetchedUser) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: fetchedUser,
      }
    })
}


export const deleteUser = async (req, res)=>{
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)

    if(!deleteUser){
        return res.status(404).json({
            "success":"fail",
            "message":"user not found"
        })
    }

    return res.status(201).json({
        "status":"success",
        "message": `user ${deletedUser} deleted sucessfully`
    })
}


