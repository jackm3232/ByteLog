import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewItemTemplateMutation } from "./itemTemplatesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const NewItemTemplateForm = () => {
  const { userId } = useAuth();

  const [addNewItemTemplate, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewItemTemplateMutation();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setName("");
      setCalories("");
      setProtein("");
      navigate("/dashboard/itemtemplates");
    }
  }, [isSuccess, navigate]);

  const onNameChanged = e => setName(e.target.value);
  const onCaloriesChanged = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setCalories(value);
    }
  };
  const onProteinChanged = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setProtein(value);
    }
  };

  const canSave = [name, calories, protein].every(Boolean) && !isLoading;

  const onSaveItemTemplateClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewItemTemplate({ userId, name, calories, protein });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validNameClass = !name ? "form__input--incomplete" : "";
  const validCaloriesClass = !calories ? "form__input--incomplete" : "";
  const validProteinClass = !protein ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveItemTemplateClicked}>
        <div className="form__title-row">
          <h2>New Item Template</h2>
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
          Name:</label>
        <input
          className={`form__input ${validNameClass}`}
          id="title"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="title">
          Calories:
        </label>
        <input
          className={`form__input ${validCaloriesClass}`}
          id="title"
          name="calories"
          type="text"
          value={calories}
          onChange={onCaloriesChanged}
        />

        <label className="form__label" htmlFor="title">
          Protein (g):
        </label>
        <input
          className={`form__input ${validProteinClass}`}
          id="title"
          name="protein"
          type="text"
          value={protein}
          onChange={onProteinChanged}
        />

      </form>
    </>
  );

  return content;
};

export default NewItemTemplateForm;
