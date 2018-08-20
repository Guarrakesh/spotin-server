import React, { Component } from 'react';

class Card extends Component{
    render(){
        return (
            <div className={"card"
                + (this.props.hidden ? " card-hidden":"")
                + (this.props.calendar ? " card-calendar":"")
                + (this.props.plain ? " card-plain":"")
                + (this.props.wizard ? " card-wizard":"")} style={this.props.style}>
                {
                    (this.props.title !== undefined) || (this.props.category !== undefined) ?
                    (
                        <div className={"header" + (this.props.textCenter ? " text-center":"")}>
                            <h4 className="title">{this.props.title}</h4>
                            <div className="actions">{this.props.actions}</div>
                              <p className="category">{this.props.category}</p>


                        </div>

                    ):""
                }
                <div className={"content"
                    + (this.props.ctAllIcons ? " all-icons":"")
                    + (this.props.ctFullWidth ? " content-full-width":"")
                    + (this.props.ctTextCenter ? " text-center":"")
                    + (this.props.tableFullWidth ? " table-full-width":"")}>
                    {this.props.content || this.props.children }
                </div>
                {
                    (this.props.stats !== undefined) || (this.props.legend !== undefined) ? (
                        <div className={"footer"
                            + ( this.props.ftTextCenter ? " text-center":"" )}>
                            {this.props.legend !== undefined ? (
                                <div className="legend">
                                    {this.props.legend}
                                </div>
                            ):null}
                            {this.props.stats !== undefined ? (<hr />):null}
                            {this.props.stats !== undefined ? (
                                <div className="stats">
                                    {this.props.stats}
                                </div>
                            ):null}
                        </div>
                    ):null
                }
            </div>
        );
    }
}

export default Card;
