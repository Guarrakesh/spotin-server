

import React from 'react';

import PropTypes from 'prop-types';
import Card from 'components/Card/Card.jsx'
import { FaCertificate } from 'react-icons/fa';
import { FiEdit, FiTrash } from 'react-icons/fi';
const CompetitionCard = (props) => {

    const {
        sport_id,
        name,
        country,
        week_events,
        image_versions

    } = props;
    let imageUrl;
    if (image_versions && image_versions.length > 0) {
        //Prendo la prima versione dell'immagine (fullwidth)
        imageUrl = image_versions[0].url;

    }

    return (

            <Card>

              <div style={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={styles.image}>
                        { imageUrl ? <img src={imageUrl}/> : <FaCertificate size={'3em'} /> }

                </div>
                <div onClick={props.onDelete} style={styles.deleteBtn}><FiTrash/></div>
                <div onClick={props.onPress} style={styles.editBtn}><FiEdit/></div>
                <div style={styles.info}>
                    <h4 style={styles.name}>{name}</h4>
                    <p style={styles.country}>{country}</p>
                </div>
              </div>
            </Card>


    );
};


CompetitionCard.propTypes = {
    onPress: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    onDelete: PropTypes.func

};
const styles = {
    editBtn: {
      position: 'absolute',
      top: 16,
      right: 64,
      cursor: 'pointer',
      color: '#23CCEF'
    },
    deleteBtn: {
      position: 'absolute',
      top: 16,
      right: 32,
      cursor: 'pointer',
      color: '#FB404B',
    },
    image: {
        width: 64,
        marginLeft: 16,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    name: {
        fontSize: 20,
    },
    country: {
        fontWeight: '300',
        fontSize: 14,
    },
    extra: {
        fontWeight: '700',
    },
    info: {
        flexDirection: 'column',
        flexGrow: 2,

    },

};

export default CompetitionCard;
