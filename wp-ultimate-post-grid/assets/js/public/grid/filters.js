export default ( elemId, args ) => {
    let filters = [];
    if ( ! Array.isArray( args.filters ) ) {
        Object.values( args.filters ).map( ( filter ) => {
            if ( 'object' === typeof window[ 'WPUPG_Filter_' + filter.type ] ) {
                const initializedFilter = window[ 'WPUPG_Filter_' + filter.type ].init( elemId, filter );

                if ( initializedFilter ) {
                    filters.push( initializedFilter );
                    initializedFilter.elem.parentElement.style.visibility = 'visible';
                }
            }
        } );
    }

    return {
        filters,
        filtersRelation: args.filters_relation,
        filtersNoSelection: args.filters_no_selection,
        getFilterString( withoutPagination = false ) {
            let selectors = [];

            // Get pagination selector.
            let paginationSelector = '';
            if ( false !== this.pagination && ! withoutPagination ) {
                paginationSelector = this.pagination.getSelector();
            }

            // Get filter selectors.
            for ( let filter of this.filters ) {
                const filterSelectors = filter.getSelectors();

                if ( filterSelectors ) {
                    if ( 'OR' === this.filtersRelation ) {
                        selectors = selectors.concat( filterSelectors );
                    } else {
                        selectors.push( filterSelectors );
                    }
                }
            }
            
            let filterString = '';
            if ( 0 < selectors.length ) {
                let filterSelectors = [];

                if ( 'OR' === this.filtersRelation ) {
                    filterSelectors = selectors;
                } else {
                    filterSelectors = make_combinations( selectors ).map( (a) => a.join( '' ) );
                }

                // Combine pagination selector as it should always be applied, but only once per selector.
                filterString = filterSelectors.map((selector) => paginationSelector + selector).join( ', ' );
            }

            // If there was no filter, make sure pagination is still applied.
            if ( ! filterString ) {
                filterString = paginationSelector;
            }

            return filterString;
        },
        clearAll() {
            // Clear all individual filters.
            for ( let filter of this.filters ) {
                if ( filter.hasOwnProperty( 'clear' ) ) {
                    filter.clear();
                }
            }

            // Actually filter after clearing.
            this.filter();
        },
        filterPaused: false,
        pauseFilter() {
            this.filterPaused = true;
        },
        resumeFilter() {
            this.filterPaused = false;
            this.filter();
        },
        filter( instant = false ) {
            this.fireEvent( 'filter' );

            if ( ! this.filterPaused ) {
                const filterString = this.getFilterString();
                const transitionDuration = this.isotope.options.transitionDuration;
    
                // Temporarily hide empty message (gets checked after arrange);
                this.hideEmpty( true );
    
                if ( wpupg_public.debugging ) { console.log( 'WPUPG Filter - filterString', filterString ); }

                if ( instant ) {
                    this.isotope.options.transitionDuration = 0;
                }

                try {
                    this.isotope.arrange({
                        filter: filterString,
                    });
                    this.maybeHideItems();

                    if ( instant ) {
                        const filteredItemElements = new Set( this.isotope.getFilteredItemElements() );

                        for ( let item of this.isotope.getItemElements() ) {
                            if ( ! filteredItemElements.has( item ) ) {
                                item.style.display = 'none';
                            }
                        }
                    }
                } finally {
                    if ( instant ) {
                        this.isotope.options.transitionDuration = transitionDuration;
                    }
                }
            }
        },
        initFilters() {
            for ( let filter of this.filters ) {
                if ( filter.hasOwnProperty( 'init' ) ) {
                    filter.init();
                }
            }

            // Check what the initial state of the grid should be.
            this.maybeHideItems( true );
        },
        maybeHideItems( firstLoad = false ) {
            if ( 'empty' === this.filtersNoSelection || ( firstLoad && 'empty_on_load' === this.filtersNoSelection ) ) {
                if ( '' === this.getFilterString( true ) ) {
                    if ( wpupg_public.debugging ) { console.log( 'WPUPG Filter - No filter selection', this.filtersNoSelection ); }
                    this.isotope.arrange({
                        filter: '.wpupg-hide-items-when-no-filter-selection',
                    });
                }
            }
        },
    }
};

// Source: https://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements
function make_combinations( arg ) {
    var r = [], arg, max = arg.length-1;
    function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
}
