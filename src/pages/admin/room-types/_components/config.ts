@@ .. @@
     },
     {
       name: "description",
       type: "textarea",
       validation: z.string(),
       label: "Description",
       placeholder: "Describe the room type features and amenities",
       space: 2,
       order: 2,
     },
     {
       name: "status",
       type: "select",
       validation: z.string(),
       label: "Status",
       options: [
         { label: "Active", value: "active" },
         { label: "Inactive", value: "inactive" },
       ],
       space: 1,
       order: 3,
     },
   ],
   onsuccess: "/admin/room-types",
   onSubmit: async (values, isUpdate) => {
     console.log("Room type form values:", values);

     if (isUpdate) {
       return await apiService.put(ROUTES.UPDATE_ROOM_TYPE_ROUTE(values.id), values);
     } else {
       return await apiService.post(ROUTES.CREATE_ROOM_TYPE_ROUTE, values);
     }
   },
 };