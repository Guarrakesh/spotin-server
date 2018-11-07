db.getCollection('broadcasts').aggregate([
    {
        $match: { "reservations.0": { $exists: 1 } }
    },
    {
        $unwind: "$reservations"
    },

  {
        $addFields: {
            broadcast: "$_id",
            user: "$reservations.user",
            used: "$reservations.used",
            created_at: "$reservations.created_at",
            _id: "$reservations._id"
        }

    },
    {
        $project: {
            start_at: 0,
            end_at: 0,
            offer: 0,
            newsfeed: 0,
            reservations: 0,
        }
    }
    
  
   // { $replaceRoot: { newRoot: "$reservations"}}
   
]);
