import { supabase } from '@/lib/supabaseClient.js';
import * as ComUtils from '@/common/ComUtils.js';
import { useCommonStore } from "@/store/StoreCommon";
const StoreCommon = useCommonStore()

const deleteTable = async (p_table, p_id) => {
  StoreCommon.loading = true;

  let arr_id = [];
  if (!Array.isArray(p_id)) {
    arr_id.push(p_id);
  }
  else {
    arr_id = p_id;
  }
  const { error } = await supabase.from(p_table).delete().in('id', arr_id);
  if (error) {
    alert('Error deleting data from table ' + p_table);
    console.error(error);
    return;
  }

  StoreCommon.loading = false;
}

const insertTable = async (p_table, p_data) => {
  StoreCommon.loading = true;

  const { error } = await supabase.from(p_table).insert(p_data);
  if (error) {
    alert('Error inserting data to table ' + p_table);
    console.error(error);
    return;
  }

  StoreCommon.loading = false;
}

/**
 * 
 * @param {*} p_table 
 * @param {*} p_order 'columnname asc/desc' ex: 'data->>name asc'
 * @returns 
 */
const selectTable = async (p_table, p_order) => {
  StoreCommon.loading = true;

  let query = supabase.from(p_table).select();

  // if (!ComUtils.isEmptyString(p_order)) {
  //   const columnname = p_order.split(' ')[0];
  //   const order = p_order.split(' ')[1] === 'desc' ? { descending: true } : { ascending: true };
  //   alert(columnname + ' ' + JSON.stringify(order))
  //   query = query.order(columnname, order);
  // }

  let tabledata = [];
  const { data, error: fetchError } = await query;
  if (fetchError) {
    alert('Error fetching data from table ' + p_table);
  }
  else if (data.length > 0) {
    data.forEach(row => {
      const tablerow = row.data;
      tablerow.id = row.id;
      tabledata.push(tablerow);
    });
  }

  StoreCommon.loading = false;
  return tabledata;
}

const updateTable = async (p_table, p_id, p_data) => {
  StoreCommon.loading = true;

  const { error } = await supabase.from(p_table).update(p_data).eq('id', p_id);
  if (error) {
    alert('Error updating data of table ' + p_table);
    console.error(error);
    return;
  }

  StoreCommon.loading = false;
}

export {
  deleteTable, insertTable, selectTable, updateTable
}