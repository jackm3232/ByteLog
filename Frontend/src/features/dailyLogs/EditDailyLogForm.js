import { useState, useEffect } from "react";
import { useUpdateDailyLogMutation, useDeleteDailyLogMutation } from "./dailyLogsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditDailyLogForm = ({ dailyLog }) => {
  const { userId } = useAuth();

  const [updateDailyLog, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateDailyLogMutation();

  const [deleteDailyLog, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteDailyLogMutation();

  const navigate = useNavigate();

  const rawDate = new Date(dailyLog.date);
  const formattedDate = rawDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const [date, setDate] = useState(formattedDate);
  const [totalCalories, setTotalCalories] = useState(dailyLog.calories);
  const [totalProtein, setTotalProtein] = useState(dailyLog.protein);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setDate("");
      setTotalCalories("");
      setTotalProtein("");
      navigate("/dashboard/dailylogs");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onDateChanged = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9/]*$/.test(value)) {
      setDate(value);
    }
  };
  const onCaloriesChanged = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setTotalCalories(value);
    }
  };
  const onProteinChanged = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setTotalProtein(value);
    }
  };

  const canSave = [date, totalCalories, totalProtein].every(Boolean) && !isLoading;

  const onSaveDailyLogClicked = async (e) => {
    if (canSave) {
      await updateDailyLog({ userId, id: dailyLog.id, date, calories: totalCalories, protein: totalProtein });
    }
  };

  const onDeleteDailyLogClicked = async () => {
    await deleteDailyLog({ userId, id: dailyLog.id });
  };

  const errClass = (isError || isDelError) ? "errmsg" : "offscreen";

  const isValidDate = (dateStr) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    return regex.test(dateStr);
  };
  const validDateClass = isValidDate(date) ? "" : "form__input--incomplete";

  const validCaloriesClass = !totalCalories ? "form__input--incomplete" : "";
  const validProteinClass = !totalProtein ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Daily Log for {formattedDate}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveDailyLogClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteDailyLogClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="logtemp-title">
          Date (MM/DD/YYYY):
        </label>
        <input
          className={`form__input ${validDateClass}`}
          id="logtemp-title"
          name="date"
          type="text"
          autoComplete="off"
          value={date}
          onChange={onDateChanged}
        />

        <label className="form__label" htmlFor="logtemp-title">
          Total Calories:
        </label>
        <input
          className={`form__input ${validCaloriesClass}`}
          id="logtemp-title"
          name="calories"
          type="text"
          value={totalCalories}
          onChange={onCaloriesChanged}
        />

        <label className="form__label" htmlFor="logtemp-title">
          Total Protein (g):
        </label>
        <input
          className={`form__input ${validProteinClass}`}
          id="logtemp-title"
          name="protein"
          type="text"
          value={totalProtein}
          onChange={onProteinChanged}
        />
        
      </form>
    </>
  );

  return content;
};

export default EditDailyLogForm;
