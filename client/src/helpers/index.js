const helpers = {

    sportSlugIconMap(slug) {
        const map = {
            'football': 'soccer',
            'tennis': 'tennis',
            'basket': 'basket',
            'baseball': 'baseball',
            'golf'    : 'golf',
            'moto'    : 'moto',

            'american-football': 'football',
            'rugby': 'rugby',
            'martial-arts': 'martial',
            'formula-1': 'formula',
            'volley'  : 'volley'
        };

        return map[slug] || null;

    },


}



export default helpers;
