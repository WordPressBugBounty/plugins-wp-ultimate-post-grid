import IconAddImg from '../../../icons/public/add-img.svg';
import IconAlphaOrder from '../../../icons/public/alpha-order.svg';
import IconArrowDown from '../../../icons/public/arrow-down.svg';
import IconArrowUp from '../../../icons/public/arrow-up.svg';
import IconDownArrow from '../../../icons/public/down-arrow.svg';
import IconEnlarge from '../../../icons/public/enlarge.svg';
import IconIncrease from '../../../icons/public/increase.svg';
import IconMinus from '../../../icons/public/minus.svg';
import IconPlus from '../../../icons/public/plus.svg';
import IconShuffle from '../../../icons/public/shuffle.svg';
import IconTriangleDown from '../../../icons/public/triangle-down.svg';
import IconTriangleRight from '../../../icons/public/triangle-right.svg';
import IconUpArrow from '../../../icons/public/up-arrow.svg';
import IconTriangleUp from '../../../icons/public/triangle-up.svg';
import IconTriangleSmallDown from '../../../icons/public/triangle-sm-down.svg';
import IconTriangleSmallRight from '../../../icons/public/triangle-sm-right.svg';
import IconTriangleSmallUp from '../../../icons/public/triangle-sm-up.svg';
 
const icons = {
    'add-img': IconAddImg,
    'down-arrow': IconDownArrow,
    'up-arrow': IconUpArrow,
    'arrow-down': IconArrowDown,
    'arrow-up': IconArrowUp,
    'triangle-down': IconTriangleDown,
    'triangle-up': IconTriangleUp,
    'triangle-right': IconTriangleRight,
    'triangle-sm-down': IconTriangleSmallDown,
    'triangle-sm-up': IconTriangleSmallUp,
    'triangle-sm-right': IconTriangleSmallRight,
    'alpha-order': IconAlphaOrder,
    'shuffle': IconShuffle,
    minus: IconMinus,
    plus: IconPlus,
    enlarge: IconEnlarge,
    increase: IconIncrease,
};


export default {
    getIcons() {
        return icons;
    },
    getIcon( name ) {
        return icons[name] ? icons[name] : null;
    },
};