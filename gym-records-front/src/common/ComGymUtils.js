import * as ComUtils from '@/common/ComUtils.js';

const CATEGORIES = {
  body: { title: 'Body Weights', value: 'body', color: 'green' },
  cardio: { title: 'Cardio', value: 'cardio', color: 'blue' },
  weights: { title: 'Weights', value: 'weights', color: 'red' }
}

/**
 * Body/Weights
 */
const getSetsSummary = (p_sets, p_isbody) => {
  if (ComUtils.isEmptyArray(p_sets)) {
    return '';
  }
  return p_sets
    .map(set => `${ set.sets } set${ set.sets > 1 ? 's' : '' }${ p_isbody ? '' : ` of ${ set.weight } kgs` }`)
    .join(', ');
}

const getSetsSummaryBody = (p_sets) => {
  return getSetsSummary(p_sets, true);
}

const getSetsSummaryWeights = (p_sets) => {
  return getSetsSummary(p_sets, false);
}

/**
 * Categories
 */
const getCategories = () => {
  return Object.values(CATEGORIES).map(prop => { return { label: prop.title, value: prop.value, color: prop.color } });
}

const getCategoryColor = (p_name) => {
  return CATEGORIES[p_name].color;
}

const isCategory = (p_name, p_category) => {
  return CATEGORIES[p_name].value === p_category;
}

const isCategoryBody = (p_category) => {
  return isCategory('body', p_category);
}

const isCategoryCardio = (p_category) => {
  return isCategory('cardio', p_category);
}

const isCategoryWeights = (p_category) => {
  return isCategory('weights', p_category);
}

export {
  getSetsSummaryBody, getSetsSummaryWeights,
  getCategories, getCategoryColor, isCategoryBody, isCategoryCardio, isCategoryWeights
}