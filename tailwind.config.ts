import type { Config } from 'tailwindcss';
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons';

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        white: '#FCFDFC',
        olive: {
          light: '#E6EBE0',
          DEFAULT: '#A0B690',
          strong: '#5D7D4C',
          dark: '#2E3F26',
        },
        moss: {
          light: '#A5B764',
          DEFAULT: '#1B210F',
        },
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['ooui']),
    }),
  ],
  safelist: [
    {
      pattern: /grid-(cols|rows)-\d{1,2}/,
    },
  ],
};
