import React from 'react';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
// import DeleteOutline from '@material-ui/icons/DeleteOutline';
import DeleteOutline from '@material-ui/icons/DeleteForeverTwoTone';

// import Edit from '@material-ui/icons/Edit';
import Edit from '@material-ui/icons/CreateTwoTone';

import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => (
    <AddBox {...props} color={'primary'} ref={ref} />
  )),
  Check: forwardRef((props, ref) => (
    <Check {...props} color={'primary'} ref={ref} />
  )),
  Clear: forwardRef((props, ref) => (
    <Clear {...props} color={'primary'} ref={ref} />
  )),
  Delete: forwardRef((props, ref) => (
    <DeleteOutline {...props} color={'primary'} ref={ref} />
  )),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} color={'primary'} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => (
    <Edit {...props} color={'primary'} ref={ref} />
  )),
  Export: forwardRef((props, ref) => (
    <SaveAlt {...props} color={'primary'} ref={ref} />
  )),
  Filter: forwardRef((props, ref) => (
    <FilterList {...props} color={'primary'} ref={ref} />
  )),
  FirstPage: forwardRef((props, ref) => (
    <FirstPage {...props} color={'primary'} ref={ref} />
  )),
  LastPage: forwardRef((props, ref) => (
    <LastPage {...props} color={'primary'} ref={ref} />
  )),
  NextPage: forwardRef((props, ref) => (
    <ChevronRight {...props} color={'primary'} ref={ref} />
  )),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} color={'primary'} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => (
    <Clear {...props} color={'primary'} ref={ref} />
  )),
  Search: forwardRef((props, ref) => (
    <Search {...props} color={'primary'} ref={ref} />
  )),
  SortArrow: forwardRef((props, ref) => (
    <ArrowUpward {...props} color={'primary'} ref={ref} />
  )),
  ThirdStateCheck: forwardRef((props, ref) => (
    <Remove {...props} color={'primary'} ref={ref} />
  )),
  ViewColumn: forwardRef((props, ref) => (
    <ViewColumn {...props} color={'primary'} ref={ref} />
  ))
};

export default tableIcons;
