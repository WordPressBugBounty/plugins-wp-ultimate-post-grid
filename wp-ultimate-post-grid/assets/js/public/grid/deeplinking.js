export default ( elemId, args ) => {
    return {
        getDeeplink() {
            let deeplink = [];

            if ( args.deeplinking ) {
                for ( let filter of this.filters ) {
                    if ( filter.hasOwnProperty( 'getDeeplink' ) ) {
                        deeplink.push( filter.getDeeplink() );
                    }
                }
    
                if ( false !== this.pagination ) {
                    if ( this.pagination.hasOwnProperty( 'getDeeplink' ) ) {
                        deeplink.push( this.pagination.getDeeplink() );
                    }
                }

                deeplink.push( this.getOrderDeeplink() );
            }

            return deeplink.filter( ( l ) => l ).join( '+' );
        },
        updateDeeplink() {
            let deeplink = '';

            for ( let grid of Object.values( WPUPG_Grids ) ) {
                let gridDeeplink = grid.getDeeplink();

                if ( gridDeeplink ) {
                    if ( deeplink ) {
                        deeplink += '#';
                    }
                    deeplink += `${ grid.gridSlug }+${ gridDeeplink }`;
                }
            }

            replaceDeeplink( deeplink );
        },
        jumpToGrid: false,
        restoreDeeplink() {
            let link = document.location.hash;
            link = link.substr(1);
        
            if ( link ) {
                // Make sure characters are not URL encoded
                link = link.replace( '%23', '#' );
                link = link.replace( '%7C', '|' );
                link = link.replace( '%2B', '+' );
                link = link.replace( '%3A', ':' );
                link = link.replace( '%2C', ',' );
        
                // Backwards compatibility
                link = link.replace( '|', '+' );
        
                const grids = link.split('#');
        
                for ( let i = 0; i < grids.length; i++ ) {
                    const grid = grids[i];
                    const parts = grid.split( '+' );
                    const gridSlug = parts.shift();

                    if ( 0 === i ) {
                        this.jumpToGrid = gridSlug;
                    }

                    // Let each grid handle its own restore.
                    if ( gridSlug === this.gridSlug ) {
                        // Pause filtering until all filters and pagination are resolved.
                        this.pauseFilter();
                        let promises = [];

                        for ( let part of parts ) {
                            const subParts = part.split( ':' );
                            const key = subParts[0];
                            const value = decodeURI( subParts[1] );

                            // Let pagination/filters check if this applies to them.
                            for ( let filter of this.filters ) {
                                if ( filter.hasOwnProperty( 'restoreDeeplink' ) ) {
                                    promises.push( filter.restoreDeeplink( key, value ) );
                                }
                            }
                
                            if ( false !== this.pagination ) {
                                if ( this.pagination.hasOwnProperty( 'restoreDeeplink' ) ) {
                                    promises.push( this.pagination.restoreDeeplink( key, value ) );
                                }
                            }
                        }

                        // Wait for all promises (if there are any) and resume the filter. Wait for max 2 seconds.
                        Promise.race(
                            [
                                Promise.all(promises),
                                new Promise((resolve) => {
                                    setTimeout(resolve, 2000);
                                }),
                            ]
                        ).then(() => this.restoredDeeplink() ).catch(() => this.restoredDeeplink() );
                    }
                }
            } else {
                this.fireEvent( 'restoredDeeplink', false );
            }
        },
        restoredDeeplink() {
            // Resume filtering (was paused to prevent too many animations).
            this.resumeFilter();

            // Might be needed to hide pagination.
            this.loadItems({
                type: 'count',
            });

            // Maybe jump to grid.
            if ( args.hasOwnProperty( 'deeplinking_jump' ) && args.deeplinking_jump ) {
                if ( this.jumpToGrid && this.jumpToGrid === this.gridSlug ) {
                    // Try to jump to full grid first.
                    const elementsToJumpTo = [
                        `wpupg-grid-with-filters-${ this.gridSlug }`,
                        `wpupg-grid-${ this.gridSlug }-filters`,
                        `wpupg-grid-container-${ this.gridSlug }`,
                    ];

                    for ( let element of elementsToJumpTo ) {
                        const elem = document.getElementById( element );

                        if ( elem ) {
                            elem.scrollIntoView({
                                behavior: 'smooth',
                            });

                            break;
                        }
                    }
                }
            }

            this.fireEvent( 'restoredDeeplink', true );
        },
        initDeeplinking() {
            if ( ! this.isPreview ) {
                this.on( 'initReady', () => {
                    this.restoreDeeplink();
                });

                this.on( 'filter', () => {
                    this.updateDeeplink();
                });

                this.on( 'sort', () => {
                    this.updateDeeplink();
                });
            }
        },
    }
};

// Source: http://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-with-javascript-without-page-refresh/5298684#5298684
function replaceDeeplink( link ) {
    var scrollV, scrollH, loc = window.location;
    if ("replaceState" in history && ( 'http:' === loc.protocol || 'https:' === loc.protocol ) ) {
        var hash = link == '' ? '' : '#' + link;
        history.replaceState("", document.title, loc.pathname + hash + loc.search);
    } else {
        // Prevent scrolling by storing the page's current scroll offset
        scrollV = document.documentElement.scrollTop || document.body.scrollTop;
        scrollH = document.documentElement.scrollLeft || document.body.scrollLeft;

        loc.hash = link;

        // Restore the scroll offset, should be flicker free
        document.documentElement.scrollTop = document.body.scrollTop = scrollV;
        document.documentElement.scrollLeft = document.body.scrollLeft = scrollH;
    }
}