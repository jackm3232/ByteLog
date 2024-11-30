import { useState, useEffect } from "react";
import { useUpdateItemTemplateMutation, useDeleteItemTemplateMutation } from "./itemTemplatesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

const EditItemTemplateForm = ({ itemTemplate }) => {
  const { userId } = useAuth();

  const [updateItemTemplate, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useUpdateItemTemplateMutation();

  const [deleteItemTemplate, {
    isSuccess: isDelSuccess,
    isError: isDelError,
    error: delError
  }] = useDeleteItemTemplateMutation();

  const navigate = useNavigate();

  const [name, setName] = useState(itemTemplate.name);
  const [calories, setCalories] = useState(itemTemplate.calories);
  const [protein, setProtein] = useState(itemTemplate.protein);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setName("");
      setCalories("");
      setProtein("");
      navigate("/dashboard/itemtemplates");
    }
  }, [isSuccess, isDelSuccess, navigate]);

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
    if (canSave) {
      await updateItemTemplate({ userId, id: itemTemplate.id, name, calories, protein });
    }
  };

  const onDeleteItemTemplateClicked = async () => {
    await deleteItemTemplate({ userId, id: itemTemplate.id });
  };

  const errClass = (isError || isDelError) ? "errmsg" : "offscreen";
  const validNameClass = !name ? "form__input--incomplete" : "";
  const validCaloriesClass = !calories ? "form__input--incomplete" : "";
  const validProteinClass = !protein ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={e => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit "{itemTemplate.name}" Item Template</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveItemTemplateClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              className="icon-button"
              title="Delete"
              onClick={onDeleteItemTemplateClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="logtemp-title">
          Name:
        </label>
        <input
          className={`form__input ${validNameClass}`}
          id="logtemp-title"
          name="name"
          type="text"
          autoComplete="off"
          value={name}
          onChange={onNameChanged}
        />

        <label className="form__label" htmlFor="logtemp-title">
          Calories:
        </label>
        <input
          className={`form__input ${validCaloriesClass}`}
          id="logtemp-title"
          name="calories"
          type="text"
          value={calories}
          onChange={onCaloriesChanged}
        />

        <label className="form__label" htmlFor="logtemp-title">
          Protein (g):
        </label>
        <input
          className={`form__input ${validProteinClass}`}
          id="logtemp-title"
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

export default EditItemTemplateForm;
