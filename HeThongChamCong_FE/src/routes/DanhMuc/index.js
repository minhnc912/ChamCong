import React from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "util/asyncComponent";
import Auth from 'helpers/Auth';

const EmployeeList= asyncComponent(() => import('./EmployeeList/EmployeeList'));
const HistoryAttendance= asyncComponent(() => import('./HistoryAttendance/HistoryAttendance'));
const RealTimeEvent= asyncComponent(() => import('./RealTimeEvent/RealTimeEvent'));

const App = ({ match, location, menus, permission }) => {
  const { pathname } = location;
  return (
    <Switch>
      <Route path={`/danh-muc/danh-sach-nhan-vien`} exact component={Auth(EmployeeList, menus, pathname, permission)} />
      <Route path={`/danh-muc/lich-su-cham-cong`} exact component={Auth(HistoryAttendance, menus, pathname, permission)} />
      <Route path={`/danh-muc/su-kien-thoi-gian-thuc`} exact component={Auth(RealTimeEvent, menus, pathname, permission)} />
    </Switch>
  )
};

export default App;
