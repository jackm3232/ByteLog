import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const DailyLog = ({ dailyLog, dailyLogId }) => {
    
  const date = new Date(dailyLog.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const navigate = useNavigate();

  if (dailyLog) {
    const handleEdit = () => navigate(`/dashboard/dailylogs/${dailyLogId}`);

    return (
      <tr className="table__row">
        <td className="table__cell logtemp__status">{formattedDate}</td>
        <td className="table__cell logtemp__created">{dailyLog.calories}</td>
        <td className="table__cell logtemp__updated">{dailyLog.protein}</td>

        <td className="table__cell">
          <button
            className="icon-button table__button"
            onClick={handleEdit}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        </td>
      </tr>
    );
  } 
  else {
    return null;
  }
};

export default DailyLog;
