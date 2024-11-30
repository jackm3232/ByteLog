import { useGetDailyLogsQuery } from "./dailyLogsApiSlice";
import DailyLog from "./DailyLog";
import useAuth from "../../hooks/useAuth";

const DailyLogsList = () => {
  const { userId } = useAuth();

  const {
    data: dailyLogs,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetDailyLogsQuery(userId, {
    pollingInterval: 20000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = dailyLogs;

    const sortedIds = [...ids].sort((a, b) => {
      const dateA = new Date(entities[a].date);
      const dateB = new Date(entities[b].date);
      return dateB - dateA;
    });
    
    const tableContent = sortedIds?.length
      && sortedIds.map(dailyLogId => {
        const dailyLog = entities[dailyLogId];
        return <DailyLog key={dailyLogId} dailyLog={dailyLog} dailyLogId={dailyLogId} />;
      });

    content = (
      <table className="table table--logtemps">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th logtemp__status">Date</th>
            <th scope="col" className="table__th logtemp__created">Total Calories</th>
            <th scope="col" className="table__th logtemp__updated">Total Protein (g)</th>
            <th scope="col" className="table__th logtemp__edit">Edit</th>
          </tr>
        </thead>
          <tbody>
            {tableContent}
          </tbody>
      </table>
    );
  }

  return content;
};

export default DailyLogsList;
