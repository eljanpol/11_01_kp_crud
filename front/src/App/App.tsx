import HomePage from "./HomePage";
import AddProductPage from "./AddProductPage";
import ProductList from "./ProductList";
import CategoriesPage from "./CategoriesPage";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

export const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="categories" element={<CategoriesPage/>}/>
                <Route path="home" element={<HomePage/>}/>
                <Route path="/products/new" element={<AddProductPage/>}/>
                <Route path="/products" element={<ProductList/>} />
                <Route path="*" element={<Navigate to={"/home"} />}/>
            </Routes>
        </BrowserRouter>
    );
};