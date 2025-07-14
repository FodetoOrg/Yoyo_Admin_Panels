import type { FormConfig } from "@/lib/types";
import { apiService } from "@/lib/utils/api";
import { z } from "zod";

const formConfig: FormConfig = {
  title: "Create Coupon",
  fields: [
    {
      name: "code",
      type: "input",
      validation: z.string().min(1, {
        message: "Coupon code is required.",
      }),
      label: "Coupon Code",
      placeholder: "e.g., SUMMER25, WELCOME50",
      space: 1,
      order: 1,
    },
    {
      name: "description",
      type: "textarea",
      validation: z.string(),
      label: "Description",
      placeholder: "Describe what this coupon offers",
      space: 2,
      order: 2,
    },
    {
      name: "discountType",
      type: "select",
      validation: z.string().min(1, {
        message: "Discount type is required.",
      }),
      label: "Discount Type",
      options: [
        { label: "Percentage (%)", value: "percentage" },
        { label: "Fixed Amount ($)", value: "fixed" },
      ],
      space: 1,
      order: 3,
    },
    {
      name: "discountValue",
      type: "input",
      validation: z.number().min(1, {
        message: "Discount value is required.",
      }),
      label: "Discount Value",
      placeholder: "25 for 25% or 50 for $50",
      space: 1,
      inputType: "number",
      order: 4,
    },
    {
      name: "maxDiscountAmount",
      type: "input",
      validation: z.number().optional(),
      label: "Maximum Discount Amount ($)",
      placeholder: "Maximum discount cap (optional)",
      space: 1,
      inputType: "number",
      order: 5,
    },
    {
      name: "minOrderAmount",
      type: "input",
      validation: z.number().optional(),
      label: "Minimum Order Amount ($)",
      placeholder: "Minimum order value required (optional)",
      space: 1,
      inputType: "number",
      order: 6,
    },
    {
      name: "validFrom",
      type: "input",
      validation: z.string().min(1, {
        message: "Valid from date is required.",
      }),
      label: "Valid From",
      placeholder: "Start date",
      space: 1,
      inputType: "datetime-local",
      order: 7,
    },
    {
      name: "validTo",
      type: "input",
      validation: z.string().min(1, {
        message: "Valid to date is required.",
      }),
      label: "Valid To",
      placeholder: "End date",
      space: 1,
      inputType: "datetime-local",
      order: 8,
    },
    {
      name: "usageLimit",
      type: "input",
      validation: z.number().optional(),
      label: "Usage Limit",
      placeholder: "Maximum number of uses (optional)",
      space: 1,
      inputType: "number",
      order: 9,
    },
    {
      name: "priceIncreasePercentage",
      type: "input",
      validation: z.number().optional(),
      label: "Price Increase Percentage (%)",
      placeholder: "Optional price increase (e.g., 5 for 5%)",
      space: 1,
      inputType: "number",
      order: 10,
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
      order: 11,
    },
  ],
  columns: 2,
  onsuccess: "/admin/coupons",
  onSubmit: async (values, isUpdate) => {
    console.log("Coupon form values:", values);

    // Format dates to ISO string if they're not already
    if (values.validFrom && !values.validFrom.includes('T')) {
      values.validFrom = new Date(values.validFrom).toISOString();
    }
    if (values.validTo && !values.validTo.includes('T')) {
      values.validTo = new Date(values.validTo).toISOString();
    }
    
    if (isUpdate) {
      return await apiService.put(ROUTES.UPDATE_COUPON_ROUTE(values.id), values);
    } else {
      // Prepare mappings object as required by API
      const mappings = {
        cityIds: [],
        hotelIds: [],
        roomTypeIds: []
      };
      
      return await apiService.post(ROUTES.CREATE_COUPON_ROUTE, {
        ...values,
        mappings
      });
    }
  },
};

export default formConfig;