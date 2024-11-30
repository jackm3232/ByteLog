import { useParams } from "react-router-dom";
import { useGetDailyLogsQuery } from "./dailyLogsApiSlice";
import EditDailyLogForm from "./EditDailyLogForm";
import useAuth from "../../hooks/useAuth";

const EditDailyLog = () => {
  const { dailyLogId } = useParams();
  const { userId } = useAuth();

  const {
    data: dailyLogs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDailyLogsQuery(userId);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = dailyLogs;

    const dailyLog = ids?.length
      ? entities[dailyLogId]
      : null;

    content = <EditDailyLogForm dailyLog={dailyLog} />;
  }

  return content;
};

export default EditDailyLog;
