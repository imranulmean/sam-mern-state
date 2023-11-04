import bcryptjs from 'bcryptjs';
import User from './user.model.mjs';

let res;

export const signup = async (event3) => {
  
  const { username, email, password } = event3;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  
  try {
    await newUser.save();
    res="User Created Successfully";
    return res;
  } catch (error) {
    res = {success: false, statusCode:500,message:error.message};
    return res;
  }

};

export const signin = async (event3) => {
  const { email, password } = event3;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return res = {success: false, statusCode:404,message:'User not found!'};
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return res = {success: false, statusCode:401,message:'Wrong credentials!'};
    const { password: pass, ...rest } = validUser._doc;
    rest['success']=true;
      res=rest;
     return res;
  } catch (error) {
    res = {success: false, statusCode:500,message:error.message};
    return res;
  }
};

export const google = async (event3) => {
  try {
    const user = await User.findOne({ email: event3.email });
    if (user) {
      const { password: pass, ...rest } = user._doc;
      rest['success']=true;
       res=rest;
      return res;
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          event3.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: event3.email,
        password: hashedPassword,
        avatar: event3.photo,
      });
      await newUser.save();
      const { password: pass, ...rest } = newUser._doc;
      rest['success']=true;
       res=rest;
      return res;
    }
  } catch (error) {
    res = {success: false, statusCode:500,message:error.message};
    return res;
  }
};

