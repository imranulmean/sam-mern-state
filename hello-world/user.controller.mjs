import Listing from './listing.model.mjs';
import User from './user.model.mjs';
import bcryptjs from 'bcryptjs';

let res;
export const getUserListings = async (event3) => {
  
    try {
      const listings = await Listing.find({ userRef: event3.currentUser });
      res=listings;
      return res;
    } catch (error) {
        res = {success: false, statusCode:500,message:error.message};
        return res;
  }
   
};

export const updateUser = async (event3) => {
  try {
    if (event3.password) {
      event3.password = bcryptjs.hashSync(event3.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      event3.customerId,
      {
        $set: {
          username: event3.username,
          email: event3.email,
          password: event3.password,
          avatar: event3.avatar,
        },
      },{ new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    rest['success']=true;
    res=rest;
    return res;
    
  } catch (error) {
         res = {success: false, statusCode:500,message:error.message};
        return res;
  }
};