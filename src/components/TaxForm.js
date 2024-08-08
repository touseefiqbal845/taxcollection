import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  FormGroup,
  Box,
} from "@mui/material";

const TaxForm = ({ items }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const initialValues = {
    name: "",
    rate: "",
    applied_to: "some",
    applicable_items: [],
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    rate: Yup.number()
      .min(0, "Must be greater than or equal to 0")
      .required("Required"),
  });

  const handleSubmit = (values) => {
    console.log({
      ...values,
      rate: values.rate * 0.01,
      applicable_items: selectedItems,
    });
  };

  const handleCategoryChange = (category, isChecked) => {
    if (category.id === null) {
      const uncategorizedItems = items.filter((item) => !item.category);
      const newSelectedItems = isChecked
        ? [...selectedItems, ...uncategorizedItems.map((item) => item.id)]
        : selectedItems.filter(
            (itemId) => !uncategorizedItems.find((item) => item.id === itemId)
          );

      setSelectedItems(newSelectedItems);
    } else {
      const newSelectedItems = isChecked
        ? [
            ...selectedItems,
            ...items
              .filter((item) => item.category?.id === category.id)
              .map((item) => item.id),
          ]
        : selectedItems.filter(
            (itemId) =>
              !items.find(
                (item) =>
                  item.id === itemId && item.category?.id === category.id
              )
          );

      setSelectedItems(newSelectedItems);
    }
  };

  const handleItemChange = (itemId, isChecked) => {
    const newSelectedItems = isChecked
      ? [...selectedItems, itemId]
      : selectedItems.filter((id) => id !== itemId);

    setSelectedItems(newSelectedItems);
  };

  const handleRadioChange = (event) => {
    const value = event.target.value;
    if (value === "all") {
      setSelectedItems(items.map(item => item.id));
      setIsSelectAll(true);
    } else {
      setIsSelectAll(false);
    }
  };

  const categorizedItems = items.reduce((acc, item) => {
    const category = item.category || { id: null, name: "" };
    if (!acc[category.id]) {
      acc[category.id] = { category, items: [] };
    }
    acc[category.id].items.push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (isSelectAll) {
      setSelectedItems(items.map(item => item.id));
    }
  }, [isSelectAll, items]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box width="100%" maxWidth="600px">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <Box mb={2}>
                <h1>Add Tax</h1>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Tax Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  fullWidth
                  id="rate"
                  name="rate"
                  label="Rate"
                  type="number"
                  value={values.rate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.rate && Boolean(errors.rate)}
                  helperText={touched.rate && errors.rate}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box mb={2}>
                <FormLabel component="legend">Apply to</FormLabel>
                <RadioGroup
                  name="applied_to"
                  value={values.applied_to}
                  onChange={(e) => {
                    handleRadioChange(e);
                    handleChange(e);
                  }}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="Apply to all items in collection"
                  />
                  <FormControlLabel
                    value="some"
                    control={<Radio />}
                    label="Apply to specific items"
                  />
                </RadioGroup>
              </Box>

              {values.applied_to === "some" && (
                <Box mb={2}>
                  {Object.values(categorizedItems).map(
                    ({ category, items }) => (
                      <Box key={category.id} mb={2}>
                        <Box sx={{ backgroundColor: "#778899" }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={items.every((item) =>
                                  selectedItems.includes(item.id)
                                )}
                                onChange={(e) =>
                                  handleCategoryChange(
                                    category,
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={category.id !== null ? category.name : ""}
                          />
                        </Box>

                        <FormGroup sx={{ ml: 3 }}>
                          {items.map((item) => (
                            <FormControlLabel
                              key={item.id}
                              control={
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onChange={(e) =>
                                    handleItemChange(item.id, e.target.checked)
                                  }
                                />
                              }
                              label={item.name}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    )
                  )}
                </Box>
              )}

              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{
                  marginBottom: "40px",
                }}
              >
                Apply tax to {selectedItems.length} item(s)
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default TaxForm;
