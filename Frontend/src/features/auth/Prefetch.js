import { store } from "../../app/store"
import { dailyLogsApiSlice } from "../dailyLogs/dailyLogsApiSlice";
import { itemTemplatesApiSlice } from "../itemTemplates/itemTemplatesApiSlice"
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Prefetch = () => {
  const { userId } = useAuth();

  useEffect(() => {
    const dailyLogs = store.dispatch(dailyLogsApiSlice.endpoints.getDailyLogs.initiate(userId));
    const itemTemplates = store.dispatch(itemTemplatesApiSlice.endpoints.getItemTemplates.initiate(userId));

    return () => {
      dailyLogs.unsubscribe();
      itemTemplates.unsubscribe();
    }
  }, [userId]);

  return <Outlet />;
}
export default Prefetch;
