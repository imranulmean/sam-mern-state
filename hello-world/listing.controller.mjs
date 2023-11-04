import Listing from './listing.model.mjs';

let res;

export const createListing = async (event3) => {
  try {
    const listing = await Listing.create(event3);
    res={listing, success:true};
    return res;
  } catch (error) {
      res = {success: false, statusCode:500,message:error.message};
      return res;
  }
};

export const getListings = async (event3) => {
  try {
    
    const limit = parseInt(event3.limit) || 9;
    const startIndex = parseInt(event3.startIndex) || 0;
    let offer = event3.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = event3.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = event3.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = event3.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = event3.searchTerm || '';

    const sort = event3.sort || 'createdAt';

    const order = event3.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    
    res=listings;
    return res;
  } catch (error) {
      res = {success: false, statusCode:500,message:error.message};
      return res;
  }
};

export const getListing = async (event3) => {
  try {
    const listing = await Listing.findById(event3.customerId);
    if (!listing) {
      return res = {success: false, statusCode:404,message:'Listing not found!'};
    }
    res=listing;
    return res;
  } catch (error) {
       res = {success: false, statusCode:500,message:error.message};
      return res;
  }
};

export const updateListing = async (event3) => {
  const listing = await Listing.findById(event3.customerId);
  if (!listing) {
    return res = {success: false, statusCode:404,message:'Listing not found!'};
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      event3.customerId,
      event3.body,
      { new: true }
    );
    res={updatedListing, success:true};
    return res;
  } catch (error) {
      res = {success: false, statusCode:500,message:error.message};
      return res;
  }
};





