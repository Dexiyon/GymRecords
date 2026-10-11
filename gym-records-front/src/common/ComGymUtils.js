import * as ComUtils from '@/common/ComUtils.js';

const getSetsSummary = (p_sets) => {
  if (ComUtils.isEmptyArray(p_sets)) {
    return '';
  }
  return p_sets
    .map(set => `${ set.sets } set${ set.sets > 1 ? 's' : '' } of ${ set.weight } kgs`)
    .join(', ');
}

export {
  getSetsSummary
}