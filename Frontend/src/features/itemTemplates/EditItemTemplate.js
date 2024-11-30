import { useParams } from "react-router-dom";
import { useGetItemTemplatesQuery } from "./itemTemplatesApiSlice";
import EditItemTemplateForm from "./EditItemTemplateForm";
import useAuth from "../../hooks/useAuth";

const EditItemTemplate = () => {
  const { itemTemplateId } = useParams();
  const { userId } = useAuth();

  const {
    data: itemTemplates,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetItemTemplatesQuery(userId);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = itemTemplates;

    const itemTemplate = ids?.length
      ? entities[itemTemplateId]
      : null;

    content = <EditItemTemplateForm itemTemplate={itemTemplate} />;
  }

  return content;
};

export default EditItemTemplate;
