import distinctColors from 'distinct-colors';

export const COLOR_LIST = distinctColors({ count: 50, lightMin: 50, lightMax: 70 }).map((color) => color.hex());
