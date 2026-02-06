import { useEffect, useState } from "react";
import { CategoryContext } from "./CategoryContext";
import { getCategories } from "../api/api";

const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
        console.log(res.data)
      } catch (err) {
        console.log("error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
