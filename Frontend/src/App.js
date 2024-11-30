import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import DailyLogsList from "./features/dailyLogs/DailyLogsList"
import ItemTemplatesList from "./features/itemTemplates/ItemTemplatesList";
import EditDailyLog from "./features/dailyLogs/EditDailyLog";
import NewDailyLog from "./features/dailyLogs/NewDailyLog";
import EditItemTemplate from "./features/itemTemplates/EditItemTemplate";
import NewItemTemplate from "./features/itemTemplates/NewItemTemplate";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle("ByteLog");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Prefetch />}>
              <Route path="dashboard" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                <Route path="dailylogs">
                  <Route index element={<DailyLogsList />} />
                  <Route path=":dailyLogId" element={<EditDailyLog />} />
                  <Route path="new" element={<NewDailyLog />} />
                </Route>

                <Route path="itemtemplates">
                  <Route index element={<ItemTemplatesList />} />
                  <Route path=":itemTemplateId" element={<EditItemTemplate />} />
                  <Route path="new" element={<NewItemTemplate />} />
                </Route>
              
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
