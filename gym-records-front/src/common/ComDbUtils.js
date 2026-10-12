import { supabase } from '@/lib/supabaseClient.js';
import * as ComUtils from '@/common/ComUtils.js';
import { useCommonStore } from "@/store/StoreCommon";

const deleteTable = async (p_table, p_id) => {
  const StoreCommon = useCommonStore()
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
  const StoreCommon = useCommonStore()
  StoreCommon.loading = true;

  const { error } = await supabase.from(p_table).insert(p_data);
  if (error) {
    alert('Error inserting data to table ' + p_table);
    console.error(error);
    return;
  }

  StoreCommon.loading = false;
}

const insertTableByLogin = async (p_table, p_data, p_store) => {
  p_data['user_id'] = p_store.loginid;
  await insertTable(p_table, p_data);
}

/**
 * Select from table
 * @param {String} p_table tablename
 * @param {Array} p_cond ex: [{columnname: 'user_id', value: 'yon'}]
 * @returns 
 */
const selectTable = async (p_table, p_cond) => {
  const StoreCommon = useCommonStore()
  StoreCommon.loading = true;

  let query = supabase.from(p_table).select();

  if (!ComUtils.isEmptyArray(p_cond)) {
    for (const cond of p_cond) {
      query = query.eq(cond.columnname, cond.value);
    }
  }

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

const selectTableByLogin = async (p_table, p_store) => {
  return await selectTable(p_table, [{ columnname: 'user_id', value: p_store.loginid }]);
}

const updateTable = async (p_table, p_id, p_data) => {
  const StoreCommon = useCommonStore()
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
  deleteTable, insertTable, insertTableByLogin, selectTable, selectTableByLogin, updateTable
}