  db.competitions.aggregate([
    { '$match': 
        { sport: ObjectId("5b33f4f1e0cc7477e26f795f") } 
    }, 
    { '$lookup':
        { 
            from: 'sport_events', 
            let: { competition_id: "$_id", start_date: new Date("2018-11-11T21:44:19.298Z"), end_date: new Date("2018-11-T21:44:19.298Z")},
            as: 'week_events', 
            pipeline: [
                    { $match: { 
                        $expr: { 
                            $and: [
                                 {"$eq": [ "$competition", "$$competition_id" ]},
                                 {"$gte": ["$start_at", "$$start_date"] },
                                 {"$lt": ["$start_at", "$$end_date"] },
                            ]
                               
                         },
                     }
                    },
                    { $count: "count" } ,
            ]
           
         } 
     }, 
     { $addFields: { "week_events": { $sum: "$week_events.count" } } },

     { '$sort': { id: -1 } }
    ])

