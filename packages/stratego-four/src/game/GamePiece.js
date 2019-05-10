import React from 'react';
import * as colors from '../theme/colors';

export default ({ color, ...props }) => {
  return (
    <svg width="52" height="61" viewBox="0 0 52 61" fill="none" {...props}>
      <rect x="7" y="5" width="38" height="52" fill={colors[color][600]} />
      <rect x="11" width="12" height="5" fill={colors[color][600]} />
      <rect x="29" width="12" height="5" fill={colors[color][600]} />
      <rect x="2" width="5" height="57" fill={colors.grey[700]} />
      <rect x="45" width="5" height="57" fill={colors.grey[700]} />
      <path d="M2 57H50L52 61H0L2 57Z" fill={colors.grey[700]} />
    </svg>
  );
};
