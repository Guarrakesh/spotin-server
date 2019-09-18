import React from "react";
import {TextField, NumberField, DateField, ShowButton, List, Datagrid} from 'react-admin';
import VersionedImageField from "../fields/VersionedImageField";

const PrizeList = props => (
    <List {...props}>
      <Datagrid>
        <VersionedImageField source="image.versions" minSize={{ width: 64, height: 64 }}/>
        <TextField source="name" label="Nome"/>
        <NumberField source="cost" label="Costo"/>
        <NumberField source="availability" label="Disponibilità"/>
        <DateField source="grantingTime" label="Tempo di assegnazione"/>
        <ShowButton/>
      </Datagrid>

    </List>
);

export default PrizeList;