import HomePage from "./HomePage";
import AddProductPage from "./AddProductPage";
import ProductList from "./ProductList";
import CategoriesPage from "./CategoriesPage";
import InDevelopmentPage from "./InDevelopmentPage";
import AuthPage from "./AuthPage";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

export const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<AuthPage/>}/>
                <Route path="categories" element={<CategoriesPage/>}/>
                <Route path="home" element={<HomePage/>}/>
                <Route path="/indevelopment" element={<InDevelopmentPage/>}/>
                <Route path="/products/new" element={<AddProductPage/>}/>
                <Route path="/products" element={<ProductList/>} />
                <Route path="*" element={<Navigate to={"/login"} />}/>
            </Routes>
        </BrowserRouter>
    );
};