import { useGetItemTemplatesQuery } from "./itemTemplatesApiSlice";
import ItemTemplate from "./ItemTemplate";
import useAuth from "../../hooks/useAuth";

const ItemTemplatesList = () => {
  const { userId } = useAuth();

  const {
    data: itemTemplates,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetItemTemplatesQuery(userId, {
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
    const { ids, entities } = itemTemplates;
    
    const tableContent = ids?.length
      && ids.map(itemTemplateId => {
        const itemTemplate = entities[itemTemplateId];
        return <ItemTemplate key={itemTemplateId} itemTemplate={itemTemplate} itemTemplateId={itemTemplateId} />;
      });

    content = (
      <table className="table table--logtemps">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th logtemp__status">Name</th>
            <th scope="col" className="table__th logtemp__created">Calories</th>
            <th scope="col" className="table__th logtemp__updated">Protein (g)</th>
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

export default ItemTemplatesList;
