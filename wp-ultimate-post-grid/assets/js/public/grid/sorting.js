export default ( elemId, args ) => {
    return {
        order: args.order,
        defaultOrder: args.order,
        usingDefaultOrder() {
            if ( JSON.stringify( this.order ) === JSON.stringify( this.defaultOrder ) ) {
                return true;
            }

            if ( 'default' === this.order[0].by && this.defaultOrder[0].type === this.order[0].type ) {
                return true;
            }

            return false;
        },
        getOrderKey() {
            let orderBy = this.order[0].by;

            if ( 'default' === orderBy ) {
                orderBy = this.defaultOrder[0].by;
            }

            return `${ orderBy }|${ this.order[0].type }`;
        },
        getOrderDeeplink() {
            if ( this.usingDefaultOrder() ) {
                return false;
            }

            return `order:${ this.order[0].by }-${ this.order[0].type }`;
        },
        setOrder( order ) {
            if ( JSON.stringify( order ) !== JSON.stringify( this.order ) ) {
                this.order = order;

                this.isotope.arrange({
                    sortBy: order[0].by,
                    sortAscending: order[0].type === 'asc',
                });

                this.fireEvent( 'sort' );
            }
        },
        getSortedOrder( items ) {
            let orderBy = 'default';
            let orderAscending = this.args.isotope.sortAscending;

            if ( ! this.usingDefaultOrder() ) {
                orderBy = this.order[0].by;
                orderAscending = this.order[0].type === 'asc';
            }

            // Check what sorting method is used.
            const sorting = this.args.isotope.getSortData.hasOwnProperty( orderBy ) ? this.args.isotope.getSortData[ orderBy ].split( ' ' ) : this.args.isotope.getSortData.default.split( ' ' );

            // Data attribute containing the value to sort by.
            const dataAttribute = sorting[0].substr( 1, sorting[0].length - 2 );

            // Optional parsing function for that value.
            let parseFunction = false;
            if ( 2 === sorting.length ) {
                switch ( sorting[1] ) {
                    case 'parseInt':
                        parseFunction = 'parseInt';
                        break;
                    case 'parseFloat':
                        parseFunction = 'parseFloat';
                        break;
                }
            }

            // Get the values to sort.
            let valuesToSort = [];

            for ( let i = 0; i < items.length; i++ ) {
                let item = items[ i ];
                let value = item.getAttribute( dataAttribute );

                if ( 'parseInt' === parseFunction ) {
                    value = parseInt( value );
                } else if ( 'parseFloat' === parseFunction ) {
                    value = parseFloat( value );
                }
                
                valuesToSort.push({
                    index: i,
                    value,
                });
            }

            // Sort values.
            valuesToSort.sort((a, b) => {
                if ( false === parseFunction ) {
                    return a.value.localeCompare( b.value );
                } else {
                    return a.value - b.value;
                }
            });

            // Reverse if descending.
            if ( ! orderAscending ) {
                valuesToSort.reverse();
            }

            return valuesToSort.map((a) => a.index);
        },
    }
};