import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const itemTemplatesAdapter = createEntityAdapter({});

const initialState = itemTemplatesAdapter.getInitialState();

export const itemTemplatesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getItemTemplates: builder.query({
      query: (userId) => ({
        url: `/itemtemplates/${userId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        }
      }),
      transformResponse: responseData => {
        const loadedItemTemplates = responseData.map(itemTemplate => {
          itemTemplate.id = itemTemplate._id;
          return itemTemplate;
        });
        return itemTemplatesAdapter.setAll(initialState, loadedItemTemplates);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "ItemTemplate", id: "LIST" },
            ...result.ids.map(id => ({ type: "ItemTemplate", id }))
          ];
        } 
        else {
          return [{ type: "ItemTemplate", id: "LIST" }];
        }
      }
    }),
    addNewItemTemplate: builder.mutation({
      query: ({ userId, name, calories, protein }) => ({
        url: `itemtemplates/${userId}`,
        method: "POST",
        body: { name, calories, protein }
      }),
      invalidatesTags: [
        { type: "ItemTemplate", id: "LIST" }
      ]
    }),
    updateItemTemplate: builder.mutation({
      query: ({ userId, id, name, calories, protein }) => ({
        url: `itemtemplates/${userId}`,
        method: "PATCH",
        body: { id, name, calories, protein }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ItemTemplate", id: arg.id }
      ]
    }),
    deleteItemTemplate: builder.mutation({
      query: ({ userId, id }) => ({
        url: `itemtemplates/${userId}`,
        method: "DELETE",
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "ItemTemplate", id: arg.id }
      ]
    }),
  }),
});

export const { 
  useGetItemTemplatesQuery,
  useAddNewItemTemplateMutation,
  useUpdateItemTemplateMutation,
  useDeleteItemTemplateMutation
 } = itemTemplatesApiSlice;

export const selectItemTemplatesResult = itemTemplatesApiSlice.endpoints.getItemTemplates.select();

const selectItemTemplatesData = createSelector(
  selectItemTemplatesResult,
  itemTemplatesResult => itemTemplatesResult.data
);

export const {
  selectAll: selectAllItemTemplates,
  selectById: selectItemTemplateById,
  selectIds: selectItemTemplateIds
} = itemTemplatesAdapter.getSelectors(state => selectItemTemplatesData(state) ?? initialState);
