import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ItemTemplate = ({ itemTemplate, itemTemplateId }) => {
  
  const navigate = useNavigate();

  if (itemTemplate) {
    const handleEdit = () => navigate(`/dashboard/itemtemplates/${itemTemplateId}`)

    return (
      <tr className="table__row">
        <td className="table__cell logtemp__status">{itemTemplate.name}</td>
        <td className="table__cell logtemp__created">{itemTemplate.calories}</td>
        <td className="table__cell logtemp__updated">{itemTemplate.protein}</td>

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

export default ItemTemplate;
