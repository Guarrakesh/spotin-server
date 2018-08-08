const helpers = {

    sportSlugIconMap(slug) {
        const map = {
            'football': 'soccer',
            'tennis': 'tennis',
            'basket': 'basket',
            'baseball': 'baseball',

            'american-football': 'rugby'
        };

        return map[slug] || null;

    },


}



export default helpers;
