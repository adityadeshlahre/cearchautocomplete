import { parseAsInteger, useQueryState } from "nuqs";
import { useSearchProduct } from "../hooks/useSearchProduct";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {
  Button,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

const AutoComplete = () => {
  const [query, setQuery] = useQueryState("q");
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );
  const [skip, setSkip] = useQueryState("skip", parseAsInteger.withDefault(0));
  const [inputValue, setInputValue] = useState(query || "");
  const { products, isLoading, total } = useSearchProduct();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQuery(inputValue || null);
    }, 400);
    return () => clearTimeout(timeout);
  }, [inputValue]);

  const onLimitChange = (e: SelectChangeEvent<string>) => {
    setLimit(Number(e.target.value));
    setSkip(0);
  };

  const onPrevPage = () => {
    setSkip(Math.max((skip || 0) - (limit || 10), 0));
  };

  const onNextPage = () => {
    setSkip(Math.min((skip || 0) + (limit || 10), total - (limit || 10)));
  };

  return (
    <div className="justify-center items-center min-h-screen flex flex-col">
      <Box sx={{ width: 300 }}>
        <TextField
          fullWidth
          placeholder="Type something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 10,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            onClick={onPrevPage}
            disabled={(skip || 0) === 0}
          >
            Prev
          </Button>
          <FormControl fullWidth>
            <Select
              id="fetched-products"
              value={String(limit || 10)}
              onChange={onLimitChange}
            >
              {[5, 10, 20, 50].map((n) => (
                <MenuItem key={n} value={String(n)}>
                  {n} per page
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={onNextPage}
            disabled={(skip || 0) + (limit || 10) >= total}
          >
            Next
          </Button>
        </Box>

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!isLoading && products.length > 0 && (
          <Paper
            sx={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxHeight: 200,
              overflowY: "auto",
              mt: 1,
            }}
            elevation={3}
          >
            <List dense>
              {products.map((p) => (
                <ListItem key={p.id} component="button">
                  <ListItemText>{p.title}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </div>
  );
};

export default AutoComplete;
