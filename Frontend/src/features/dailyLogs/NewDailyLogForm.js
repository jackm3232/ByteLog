import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewDailyLogMutation } from "./dailyLogsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const NewDailyLogForm = () => {
  const { userId } = useAuth();

  const [addNewDailyLog, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewDailyLogMutation();

  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [totalCalories, setTotalCalories] = useState("");
  const [totalProtein, setTotalProtein] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setDate("");
      setTotalCalories("");
      setTotalProtein("");
      navigate("/dashboard/dailylogs");
    }
  }, [isSuccess, navigate]);

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
    e.preventDefault();
    if (canSave) {
      await addNewDailyLog({ userId, date, calories: totalCalories, protein: totalProtein });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";

  const isValidDate = (dateStr) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    return regex.test(dateStr);
  };
  const validDateClass = isValidDate(date) ? "" : "form__input--incomplete";

  const validCaloriesClass = !totalCalories ? "form__input--incomplete" : "";
  const validProteinClass = !totalProtein ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveDailyLogClicked}>
        <div className="form__title-row">
          <h2>New Daily Log</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="title">
          Date (MM/DD/YYYY):</label>
        <input
          className={`form__input ${validDateClass}`}
          id="title"
          name="name"
          type="text"
          autoComplete="off"
          value={date}
          onChange={onDateChanged}
        />

        <label className="form__label" htmlFor="title">
          Total Calories:
        </label>
        <input
          className={`form__input ${validCaloriesClass}`}
          id="title"
          name="calories"
          type="text"
          value={totalCalories}
          onChange={onCaloriesChanged}
        />

        <label className="form__label" htmlFor="title">
          Total Protein (g):
        </label>
        <input
          className={`form__input ${validProteinClass}`}
          id="title"
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

export default NewDailyLogForm;
