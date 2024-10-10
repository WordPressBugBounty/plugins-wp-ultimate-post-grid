import React, { Component } from 'react';
import SVG from 'react-inlinesvg';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'

import Icons from './FieldIconIcons';
import { __wpupg } from 'Shared/Translations';

export default class FieldIcon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selecting: false,
        }
    }

    render() {
        const icons = Icons.getIcons();

        let selectedIcon = this.props.value ? Icons.getIcon( this.props.value ) : false;
        let hasSelectedIcon = true;

        if ( ! selectedIcon ) {
            selectedIcon = Icons.getIcon( 'add-img' );
            hasSelectedIcon = false;
        }

        return (
            <Tooltip
                html={
                    <div className="wpupg-admin-modal-field-icons-container">
                        <div className="wpupg-admin-modal-field-icons">
                            {
                                Object.keys( icons ).map((key, index) => {
                                    if ( 'add-img' === key ) {
                                        return null;
                                    }
                                    
                                    const icon = icons[key];

                                    return (
                                        <div
                                            key={ index }
                                            className="wpupg-admin-modal-field-icons-icon"
                                            onClick={ () => {
                                                this.setState({
                                                    selecting: false,
                                                }, () => {
                                                    this.props.onChange( key );
                                                });
                                            } }
                                        >
                                        <SVG
                                                src={ icon }
                                            />
                                        </div>
                                    );
                                })
                            }
                        </div>
                        {
                            hasSelectedIcon
                            &&
                            <a
                                href="#"
                                onClick={ (e) => {
                                    e.preventDefault();
                                    this.setState({
                                        selecting: false,
                                    }, () => {
                                        this.props.onChange( false );
                                    });
                                } }
                            >{ __wpupg( 'Remove Icon' ) }</a>
                        }
                    </div>
                }
                trigger="manual"
                open={ this.state.selecting }
                onRequestClose={() => {
                    this.setState({
                        selecting: false,
                    });
                }}
                interactive={ true }
                theme="light"
                popperOptions={ {
                    modifiers: {
                        addZIndex: {
                            enabled: true,
                            order: 810,
                            fn: data => ({
                                ...data,
                                styles: {
                                ...data.styles,
                                zIndex: 100000,
                                },
                            })
                        }
                    }
                } }
            >
                <div
                    className={ `wpupg-admin-modal-field-icon${ hasSelectedIcon ? ' wpupg-admin-modal-field-icon-selected' : ' wpupg-admin-modal-field-icon-none'}` }
                    onClick={ () => {
                        this.setState({
                            selecting: true,
                        });
                    } }
                >
                    <Tooltip
                        title={ hasSelectedIcon ? __wpupg( 'Change Icon' ) : __wpupg( 'Select Icon' ) }
                        popperOptions={ {
                            modifiers: {
                                addZIndex: {
                                enabled: true,
                                order: 810,
                                fn: data => ({
                                    ...data,
                                    styles: {
                                    ...data.styles,
                                    zIndex: 100000,
                                    },
                                })
                                }
                            }
                        } }
                        disabled={ this.state.selecting }
                    >
                        <SVG
                            src={ selectedIcon }
                        />
                    </Tooltip>
                </div>
            </Tooltip>
        );
    }
}